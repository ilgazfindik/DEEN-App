import UIKit
import WebKit
import StoreKit
import Capacitor

/// Hosts the web app and registers the app's own native plugins.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(NativeTabBarPlugin())
    }

    /// TestFlight and debug builds get the developer tools (the admin panel); the App Store build never does. The flag goes
    /// into the web view's configuration, so it is set before the page's own scripts run (developer mode is decided while
    /// the page loads).
    override open func webViewConfiguration(for instanceConfiguration: InstanceConfiguration) -> WKWebViewConfiguration {
        let configuration = super.webViewConfiguration(for: instanceConfiguration)
        if MainViewController.isTestBuild {
            configuration.userContentController.addUserScript(WKUserScript(
                source: "window.__ILNURA_TESTFLIGHT__=true;",
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true
            ))
        }
        return configuration
    }

    /// True for a debug build or a build installed from TestFlight (its App Store receipt is a sandbox receipt).
    static var isTestBuild: Bool {
        #if DEBUG
        return true
        #else
        return Bundle.main.appStoreReceiptURL?.lastPathComponent == "sandboxReceipt"
        #endif
    }
}

/// The real iOS tab bar (UITabBar) laid over the web view on iOS 26 and later, where the system draws it in
/// Liquid Glass with its own selection lens, drag-to-switch gesture and feedback. The web app keeps its own tab
/// bar for routing (hidden while this one is shown) and drives this one through four calls:
///   isAvailable()                                  -> { available }
///   show({ tabs: [{ id, title, icon, selectedIcon, label }], selected, tint }) -> { shown, height }
///   select({ id })
///   setHidden({ hidden })
/// A tap (or a drag released) on a tab sends the "tabSelected" event with { id }.
@objc(NativeTabBarPlugin)
public class NativeTabBarPlugin: CAPPlugin, CAPBridgedPlugin, UITabBarDelegate {
    public let identifier = "NativeTabBarPlugin"
    public let jsName = "NativeTabBar"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "show", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "select", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setHidden", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "buildInfo", returnType: CAPPluginReturnPromise)
    ]

    private var tabBar: UITabBar?
    private var ids: [String] = []

    /// Liquid Glass tab bars exist from iOS 26; earlier systems keep the web tab bar.
    private var supported: Bool {
        if #available(iOS 26.0, *) { return true }
        return false
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": supported])
    }

    /// Whether this is a TestFlight or debug build (the web app then turns its developer tools on). Asked by the page as a
    /// second check next to the document-start flag: the sandbox App Store receipt, and on iOS 16+ the app transaction's
    /// environment (Sandbox for TestFlight, Xcode for a debug install).
    @objc func buildInfo(_ call: CAPPluginCall) {
        if MainViewController.isTestBuild {
            call.resolve(["testBuild": true, "source": "receipt"])
            return
        }
        if #available(iOS 16.0, *) {
            Task {
                var testBuild = false
                var source = "appTransaction:none"
                if let result = try? await AppTransaction.shared {
                    let transaction: AppTransaction
                    switch result {
                    case .verified(let value): transaction = value
                    case .unverified(let value, _): transaction = value
                    }
                    testBuild = transaction.environment == .sandbox || transaction.environment == .xcode
                    source = "appTransaction:" + transaction.environment.rawValue
                }
                call.resolve(["testBuild": testBuild, "source": source])
            }
        } else {
            call.resolve(["testBuild": false, "source": "receipt"])
        }
    }

    @objc func show(_ call: CAPPluginCall) {
        guard supported else {
            call.resolve(["shown": false, "height": 0])
            return
        }
        let tabs = call.getArray("tabs", JSObject.self) ?? []
        let selected = call.getString("selected")
        let tint = call.getString("tint")
        DispatchQueue.main.async {
            guard let host = self.bridge?.viewController?.view else {
                call.reject("No host view")
                return
            }
            let bar: UITabBar
            if let existing = self.tabBar {
                bar = existing
            } else {
                bar = UITabBar()
                bar.translatesAutoresizingMaskIntoConstraints = false
                bar.delegate = self
                bar.overrideUserInterfaceStyle = .dark
                host.addSubview(bar)
                NSLayoutConstraint.activate([
                    bar.leadingAnchor.constraint(equalTo: host.leadingAnchor),
                    bar.trailingAnchor.constraint(equalTo: host.trailingAnchor),
                    bar.bottomAnchor.constraint(equalTo: host.bottomAnchor)
                ])
                self.tabBar = bar
            }
            var items: [UITabBarItem] = []
            var ids: [String] = []
            for (index, tab) in tabs.enumerated() {
                let id = (tab["id"] as? String) ?? String(index)
                let icon = (tab["icon"] as? String) ?? "circle"
                let selectedIcon = (tab["selectedIcon"] as? String) ?? icon
                let item = UITabBarItem(
                    title: tab["title"] as? String,
                    image: UIImage(systemName: icon),
                    selectedImage: UIImage(systemName: selectedIcon)
                )
                item.tag = index
                if let label = tab["label"] as? String, !label.isEmpty {
                    item.accessibilityLabel = label
                }
                items.append(item)
                ids.append(id)
            }
            self.ids = ids
            bar.setItems(items, animated: false)
            if let tint = tint, let color = NativeTabBarPlugin.color(hex: tint) {
                bar.tintColor = color
            }
            if let selected = selected, let index = ids.firstIndex(of: selected) {
                bar.selectedItem = items[index]
            }
            bar.isHidden = false
            bar.alpha = 1
            host.bringSubviewToFront(bar)
            host.layoutIfNeeded()
            call.resolve(["shown": true, "height": bar.frame.height])
        }
    }

    @objc func select(_ call: CAPPluginCall) {
        let id = call.getString("id") ?? ""
        DispatchQueue.main.async {
            if let bar = self.tabBar, let index = self.ids.firstIndex(of: id), let items = bar.items, index < items.count {
                if bar.selectedItem !== items[index] {
                    bar.selectedItem = items[index]
                }
            }
            call.resolve()
        }
    }

    @objc func setHidden(_ call: CAPPluginCall) {
        let hidden = call.getBool("hidden") ?? false
        DispatchQueue.main.async {
            guard let bar = self.tabBar else {
                call.resolve()
                return
            }
            if hidden == bar.isHidden {
                call.resolve()
                return
            }
            if hidden {
                UIView.animate(withDuration: 0.18, animations: { bar.alpha = 0 }, completion: { _ in
                    if bar.alpha == 0 { bar.isHidden = true }
                })
            } else {
                bar.isHidden = false
                bar.superview?.bringSubviewToFront(bar)
                UIView.animate(withDuration: 0.18) { bar.alpha = 1 }
            }
            call.resolve()
        }
    }

    public func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        guard item.tag >= 0, item.tag < ids.count else { return }
        notifyListeners("tabSelected", data: ["id": ids[item.tag]])
    }

    private static func color(hex: String) -> UIColor? {
        var value = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if value.hasPrefix("#") { value.removeFirst() }
        guard value.count == 6, let rgb = UInt32(value, radix: 16) else { return nil }
        return UIColor(
            red: CGFloat((rgb >> 16) & 0xFF) / 255,
            green: CGFloat((rgb >> 8) & 0xFF) / 255,
            blue: CGFloat(rgb & 0xFF) / 255,
            alpha: 1
        )
    }
}
