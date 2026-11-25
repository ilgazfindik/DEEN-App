import Foundation
import Security

/// The learner's progress as the widgets show it. The app writes it (WidgetBridge) after every change and the widget
/// extension only reads it. Both are signed with the same keychain access group, so no App Group is needed.
struct WidgetSnapshot: Codable {
    var streak: Int = 0
    /// Last day with a lesson, "yyyy-MM-dd" in local time.
    var lastStudy: String?
    /// Days with a lesson (last two weeks), "yyyy-MM-dd".
    var studied: [String] = []
    /// Lessons on `todayKey` and the daily goal (in lessons).
    var todayLessons: Int = 0
    var todayKey: String?
    var goal: Int = 1
    var xp: Int = 0
    var companion: String = "owl"
    var lang: String = "tr"

    init() {}

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        streak = max(0, (try? c.decodeIfPresent(Int.self, forKey: .streak)) ?? 0)
        lastStudy = try? c.decodeIfPresent(String.self, forKey: .lastStudy)
        studied = (try? c.decodeIfPresent([String].self, forKey: .studied)) ?? []
        todayLessons = max(0, (try? c.decodeIfPresent(Int.self, forKey: .todayLessons)) ?? 0)
        todayKey = try? c.decodeIfPresent(String.self, forKey: .todayKey)
        goal = max(1, (try? c.decodeIfPresent(Int.self, forKey: .goal)) ?? 1)
        xp = max(0, (try? c.decodeIfPresent(Int.self, forKey: .xp)) ?? 0)
        companion = (try? c.decodeIfPresent(String.self, forKey: .companion)) ?? "owl"
        lang = (try? c.decodeIfPresent(String.self, forKey: .lang)) ?? "tr"
    }

    static func dayKey(_ date: Date) -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    enum Status { case done, atRisk, none }

    /// Done today, streak still alive but today not done yet, or no running streak.
    func status(at date: Date) -> Status {
        let today = WidgetSnapshot.dayKey(date)
        if lastStudy == today { return .done }
        let yesterday = WidgetSnapshot.dayKey(Calendar.current.date(byAdding: .day, value: -1, to: date) ?? date)
        if lastStudy == yesterday && streak > 0 { return .atRisk }
        return .none
    }

    /// The streak as it stands at `date` (a missed day ends it).
    func liveStreak(at date: Date) -> Int { status(at: date) == .none ? 0 : streak }

    func lessonsToday(at date: Date) -> Int { todayKey == WidgetSnapshot.dayKey(date) ? todayLessons : 0 }
}

enum WidgetStore {
    private static let service = "com.ilgazfindik.ilnura.widget"
    private static let account = "snapshot"

    /// "TEAMID." + the shared group; the prefix comes from Info.plist (AppIdentifierPrefix = $(AppIdentifierPrefix)).
    private static var accessGroup: String? {
        guard let prefix = Bundle.main.object(forInfoDictionaryKey: "AppIdentifierPrefix") as? String,
              !prefix.isEmpty, !prefix.contains("$") else { return nil }
        return prefix + "com.ilgazfindik.ilnura.shared"
    }

    private static func query() -> [String: Any] {
        var q: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        if let group = accessGroup { q[kSecAttrAccessGroup as String] = group }
        return q
    }

    static func loadData() -> Data? {
        var q = query()
        q[kSecReturnData as String] = true
        q[kSecMatchLimit as String] = kSecMatchLimitOne
        var out: AnyObject?
        guard SecItemCopyMatching(q as CFDictionary, &out) == errSecSuccess else { return nil }
        return out as? Data
    }

    static func load() -> WidgetSnapshot? {
        guard let data = loadData() else { return nil }
        return try? JSONDecoder().decode(WidgetSnapshot.self, from: data)
    }

    @discardableResult
    static func save(_ data: Data) -> Bool {
        let q = query()
        let attributes: [String: Any] = [
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]
        let status = SecItemUpdate(q as CFDictionary, attributes as CFDictionary)
        if status == errSecItemNotFound {
            var add = q
            for (key, value) in attributes { add[key] = value }
            return SecItemAdd(add as CFDictionary, nil) == errSecSuccess
        }
        return status == errSecSuccess
    }
}
