import Foundation
import Capacitor
import WidgetKit

/// Hands the learner's progress to the home and lock screen widgets:
///   update({ json })  -> { saved, changed }
/// `json` is a WidgetSnapshot. The widgets are redrawn only when it changed.
@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "DeenWidget"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise)
    ]

    @objc func update(_ call: CAPPluginCall) {
        guard let json = call.getString("json"), let data = json.data(using: .utf8),
              (try? JSONDecoder().decode(WidgetSnapshot.self, from: data)) != nil else {
            call.reject("invalid snapshot")
            return
        }
        if WidgetStore.loadData() == data {
            call.resolve(["saved": true, "changed": false])
            return
        }
        let saved = WidgetStore.save(data)
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve(["saved": saved, "changed": true])
    }
}
