import Foundation
import StoreKit
import UIKit
import Capacitor

/// Premium subscriptions through StoreKit 2 (Apple's in-app purchase). The web app calls:
///   products({ ids })        -> { products: [{ id, displayPrice, price, currency, period, trial, eligibleForTrial }] }
///   purchase({ id })         -> { status: purchased | cancelled | pending, entitlement }
///   entitlement()            -> { active, productId, expires, inTrial, willRenew }
///   restore()                -> entitlement after AppStore.sync()
///   manage()                 -> opens Apple's subscription management sheet
/// and listens to "entitlement" events (renewals, refunds, purchases on another device).
/// Prices come from the App Store in the learner's own currency; nothing about money is decided here.
@objc(SubscriptionsPlugin)
public class SubscriptionsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SubscriptionsPlugin"
    public let jsName = "DeenStore"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "products", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "entitlement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manage", returnType: CAPPluginReturnPromise)
    ]

    private var updates: Task<Void, Never>?
    private var cache: [String: Product] = [:]

    override public func load() {
        // Renewals, refunds and purchases made elsewhere arrive here; each one is finished and passed on.
        updates = Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let transaction) = result { await transaction.finish() }
                guard let self = self else { continue }
                let info = await Self.currentEntitlement()
                self.notifyListeners("entitlement", data: info)
            }
        }
    }

    deinit { updates?.cancel() }

    private static func periodString(_ p: Product.SubscriptionPeriod?) -> String {
        guard let p = p else { return "" }
        switch p.unit {
        case .day: return "P\(p.value)D"
        case .week: return "P\(p.value)W"
        case .month: return "P\(p.value)M"
        case .year: return "P\(p.value)Y"
        @unknown default: return ""
        }
    }

    private static func describe(_ product: Product) async -> [String: Any] {
        var out: [String: Any] = [
            "id": product.id,
            "displayPrice": product.displayPrice,
            "price": NSDecimalNumber(decimal: product.price).doubleValue,
            "currency": product.priceFormatStyle.currencyCode,
            "title": product.displayName,
            "period": periodString(product.subscription?.subscriptionPeriod)
        ]
        if let offer = product.subscription?.introductoryOffer, offer.paymentMode == .freeTrial {
            out["trial"] = ["period": periodString(offer.period)]
        }
        out["eligibleForTrial"] = await product.subscription?.isEligibleForIntroOffer ?? false
        return out
    }

    /// The newest active Premium transaction, if any.
    static func currentEntitlement() async -> [String: Any] {
        var best: Transaction?
        for await result in Transaction.currentEntitlements {
            guard case .verified(let t) = result, t.productType == .autoRenewable, t.revocationDate == nil else { continue }
            if let e = t.expirationDate, e < Date() { continue }
            if best == nil || (t.expirationDate ?? .distantPast) > (best?.expirationDate ?? .distantPast) { best = t }
        }
        guard let t = best else { return ["active": false] }
        var info: [String: Any] = ["active": true, "productId": t.productID]
        if let e = t.expirationDate { info["expires"] = e.timeIntervalSince1970 * 1000 }
        if #available(iOS 17.2, *) {
            info["inTrial"] = t.offer?.paymentMode == .freeTrial
        } else {
            info["inTrial"] = t.offerType == .introductory
        }
        if let status = try? await Product.products(for: [t.productID]).first?.subscription?.status.first,
           case .verified(let renewal) = status.renewalInfo {
            info["willRenew"] = renewal.willAutoRenew
        }
        return info
    }

    @objc func products(_ call: CAPPluginCall) {
        let ids = (call.getArray("ids", String.self) ?? []).filter { !$0.isEmpty }
        Task {
            do {
                let list = try await Product.products(for: ids)
                var out: [[String: Any]] = []
                for p in list { cache[p.id] = p; out.append(await Self.describe(p)) }
                call.resolve(["products": out])
            } catch {
                call.reject("products: \(error.localizedDescription)")
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let id = call.getString("id"), !id.isEmpty else { call.reject("missing id"); return }
        Task {
            do {
                var product = cache[id]
                if product == nil { product = try await Product.products(for: [id]).first }
                guard let p = product else { call.reject("unknown product"); return }
                let result = try await p.purchase()
                switch result {
                case .success(let verification):
                    guard case .verified(let t) = verification else { call.reject("unverified"); return }
                    await t.finish()
                    call.resolve(["status": "purchased", "entitlement": await Self.currentEntitlement()])
                case .userCancelled:
                    call.resolve(["status": "cancelled"])
                case .pending:
                    call.resolve(["status": "pending"])
                @unknown default:
                    call.resolve(["status": "cancelled"])
                }
            } catch {
                call.reject("purchase: \(error.localizedDescription)")
            }
        }
    }

    @objc func entitlement(_ call: CAPPluginCall) {
        Task { call.resolve(await Self.currentEntitlement()) }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do { try await AppStore.sync() } catch { /* the learner may cancel the sign-in; still report what is there */ }
            call.resolve(await Self.currentEntitlement())
        }
    }

    @objc func manage(_ call: CAPPluginCall) {
        Task { @MainActor in
            if let scene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
                do { try await AppStore.showManageSubscriptions(in: scene); call.resolve(["shown": true]) }
                catch { call.resolve(["shown": false]) }
            } else { call.resolve(["shown": false]) }
        }
    }
}
