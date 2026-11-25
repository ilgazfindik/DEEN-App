import WidgetKit
import SwiftUI

// Home and lock screen widgets: the streak (small, and the three lock screen sizes) and today's progress (medium).
// They read the snapshot the app writes (WidgetStore) and redraw at midnight and at 20:00, when the day's status changes.

// MARK: - Text

private let strings: [String: [String: String]] = [
    "tr": ["days": "gün seri", "done": "Bugün tamam", "risk": "Serini koru!", "night": "Seri bu gece bitiyor!",
           "start": "Bugün başla", "goal": "Günlük hedef", "week": "Bu hafta", "short.done": "tamam", "short.risk": "bugün ders",
           "streak.name": "Seri", "streak.desc": "Serin ve bugünkü dersin.", "progress.name": "Bugünkü ilerleme",
           "progress.desc": "Serin, haftan ve günlük hedefin."],
    "en": ["days": "day streak", "done": "Done today", "risk": "Keep your streak!", "night": "Streak ends tonight!",
           "start": "Start today", "goal": "Daily goal", "week": "This week", "short.done": "done", "short.risk": "lesson today",
           "streak.name": "Streak", "streak.desc": "Your streak and today’s lesson.", "progress.name": "Today’s progress",
           "progress.desc": "Your streak, your week and your daily goal."],
    "de": ["days": "Tage Serie", "done": "Heute erledigt", "risk": "Halte deine Serie!", "night": "Serie endet heute Nacht!",
           "start": "Heute starten", "goal": "Tagesziel", "week": "Diese Woche", "short.done": "erledigt", "short.risk": "Lektion heute",
           "streak.name": "Serie", "streak.desc": "Deine Serie und die heutige Lektion.", "progress.name": "Heutiger Fortschritt",
           "progress.desc": "Deine Serie, deine Woche und dein Tagesziel."],
    "fr": ["days": "jours de série", "done": "Fait aujourd’hui", "risk": "Garde ta série !", "night": "Ta série finit ce soir !",
           "start": "Commence aujourd’hui", "goal": "Objectif du jour", "week": "Cette semaine", "short.done": "fait", "short.risk": "leçon du jour",
           "streak.name": "Série", "streak.desc": "Ta série et la leçon du jour.", "progress.name": "Progrès du jour",
           "progress.desc": "Ta série, ta semaine et ton objectif du jour."],
    "ar": ["days": "أيام متتالية", "done": "أنجزت اليوم", "risk": "حافظ على سلسلتك!", "night": "سلسلتك تنتهي الليلة!",
           "start": "ابدأ اليوم", "goal": "هدف اليوم", "week": "هذا الأسبوع", "short.done": "تم", "short.risk": "درس اليوم",
           "streak.name": "السلسلة", "streak.desc": "سلسلتك ودرس اليوم.", "progress.name": "تقدّم اليوم",
           "progress.desc": "سلسلتك وأسبوعك وهدف اليوم."]
]

private func tr(_ key: String, _ lang: String) -> String {
    strings[lang]?[key] ?? strings["tr"]?[key] ?? key
}

private func storedLang() -> String { WidgetStore.load()?.lang ?? "tr" }

// MARK: - Look

private let gold = Color(red: 0.95, green: 0.77, blue: 0.36)
private let flameOn = Color(red: 1.0, green: 0.58, blue: 0.2)
private let night = LinearGradient(colors: [Color(red: 0.11, green: 0.15, blue: 0.33), Color(red: 0.04, green: 0.08, blue: 0.19)],
                                   startPoint: .topLeading, endPoint: .bottomTrailing)

extension View {
    /// iOS 17 draws the background itself (and adds the margins); iOS 16 needs both done here.
    @ViewBuilder func widgetBackground<B: View>(_ bg: B, padded: Bool = true) -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            containerBackground(for: .widget) { bg }
        } else if padded {
            padding(14).background(bg)
        } else {
            self.background(bg)
        }
    }
}

// MARK: - Timeline

struct DeenEntry: TimelineEntry {
    let date: Date
    let snap: WidgetSnapshot
}

struct DeenProvider: TimelineProvider {
    private var sample: WidgetSnapshot {
        var s = WidgetSnapshot()
        s.streak = 7
        s.lastStudy = WidgetSnapshot.dayKey(Date())
        s.todayKey = s.lastStudy
        s.todayLessons = 1
        s.goal = 2
        s.studied = (0..<7).compactMap { i in
            Calendar.current.date(byAdding: .day, value: -i, to: Date()).map(WidgetSnapshot.dayKey)
        }
        s.companion = "owl"
        s.lang = storedLang()
        return s
    }

    func placeholder(in context: Context) -> DeenEntry { DeenEntry(date: Date(), snap: sample) }

    func getSnapshot(in context: Context, completion: @escaping (DeenEntry) -> Void) {
        let stored = WidgetStore.load()
        completion(DeenEntry(date: Date(), snap: stored ?? (context.isPreview ? sample : WidgetSnapshot())))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DeenEntry>) -> Void) {
        let snap = WidgetStore.load() ?? WidgetSnapshot()
        let now = Date(), cal = Calendar.current
        var dates = [now]
        if let evening = cal.date(bySettingHour: 20, minute: 0, second: 0, of: now), evening > now { dates.append(evening) }
        let tomorrow = cal.startOfDay(for: cal.date(byAdding: .day, value: 1, to: now) ?? now)
        dates.append(tomorrow)
        if let evening2 = cal.date(bySettingHour: 20, minute: 0, second: 0, of: tomorrow) { dates.append(evening2) }
        let dayAfter = cal.date(byAdding: .day, value: 1, to: tomorrow) ?? tomorrow
        dates.append(dayAfter)
        completion(Timeline(entries: dates.map { DeenEntry(date: $0, snap: snap) }, policy: .after(dayAfter)))
    }
}

// MARK: - Pieces

private struct Model {
    let entry: DeenEntry
    var snap: WidgetSnapshot { entry.snap }
    var lang: String { snap.lang }
    var status: WidgetSnapshot.Status { snap.status(at: entry.date) }
    var streak: Int { snap.liveStreak(at: entry.date) }
    var isEvening: Bool { Calendar.current.component(.hour, from: entry.date) >= 20 }
    var statusText: String {
        switch status {
        case .done: return tr("done", lang) + " ✓"
        case .atRisk: return isEvening ? tr("night", lang) : tr("risk", lang)
        case .none: return tr("start", lang)
        }
    }
    var statusColor: Color {
        switch status {
        case .done: return gold
        case .atRisk: return isEvening ? Color(red: 1, green: 0.5, blue: 0.42) : .white
        case .none: return .white.opacity(0.85)
        }
    }
    var pet: String {
        let known = ["lion", "cat", "wolf", "owl", "turtle", "eagle"]
        return "pet_" + (known.contains(snap.companion) ? snap.companion : "owl")
    }
    var direction: LayoutDirection { lang == "ar" ? .rightToLeft : .leftToRight }
}

private struct Flame: View {
    let lit: Bool
    var size: CGFloat = 22
    var body: some View {
        Image(systemName: "flame.fill")
            .font(.system(size: size, weight: .bold))
            .foregroundStyle(lit ? AnyShapeStyle(LinearGradient(colors: [Color.yellow, flameOn], startPoint: .top, endPoint: .bottom))
                                 : AnyShapeStyle(Color.white.opacity(0.35)))
    }
}

private struct WeekDots: View {
    let model: Model
    var body: some View {
        let cal = Calendar.current
        let days: [Date] = (0..<7).reversed().compactMap { cal.date(byAdding: .day, value: -$0, to: model.entry.date) }
        let fmt: DateFormatter = {
            let f = DateFormatter()
            f.locale = Locale(identifier: model.lang)
            f.dateFormat = "EEEEE"
            return f
        }()
        HStack(spacing: 5) {
            ForEach(days, id: \.self) { d in
                let key = WidgetSnapshot.dayKey(d)
                let on = model.snap.studied.contains(key) || (model.snap.lastStudy == key)
                let isToday = cal.isDate(d, inSameDayAs: model.entry.date)
                VStack(spacing: 2) {
                    ZStack {
                        Circle().fill(on ? gold : Color.white.opacity(0.14))
                        if on { Image(systemName: "checkmark").font(.system(size: 8, weight: .heavy)).foregroundColor(Color(red: 0.23, green: 0.15, blue: 0)) }
                    }
                    .frame(width: 16, height: 16)
                    .overlay(Circle().stroke(isToday ? Color.white.opacity(0.9) : .clear, lineWidth: 1.5))
                    Text(fmt.string(from: d)).font(.system(size: 9, weight: .semibold)).foregroundColor(.white.opacity(0.6))
                }
            }
        }
    }
}

// MARK: - Views

private struct SmallStreakView: View {
    let model: Model
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 0) {
                    HStack(spacing: 3) {
                        Flame(lit: model.status == .done, size: 20)
                        Text("\(model.streak)")
                            .font(.system(size: 34, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                            .minimumScaleFactor(0.6)
                            .lineLimit(1)
                    }
                    Text(tr("days", model.lang))
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.white.opacity(0.65))
                        .lineLimit(1)
                }
                Spacer(minLength: 0)
            }
            Spacer(minLength: 0)
            HStack(alignment: .bottom, spacing: 0) {
                Text(model.statusText)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(model.statusColor)
                    .lineLimit(2)
                    .minimumScaleFactor(0.8)
                Spacer(minLength: 0)
            }
        }
        .overlay(alignment: .topTrailing) {
            Image(model.pet).resizable().scaledToFit().frame(width: 62, height: 62).offset(x: 6, y: -6)
        }
    }
}

private struct MediumProgressView: View {
    let model: Model
    var body: some View {
        let done = min(model.snap.lessonsToday(at: model.entry.date), model.snap.goal)
        HStack(spacing: 10) {
            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 4) {
                    Flame(lit: model.status == .done, size: 18)
                    Text("\(model.streak)").font(.system(size: 26, weight: .heavy, design: .rounded)).foregroundColor(.white)
                    Text(tr("days", model.lang)).font(.system(size: 12, weight: .semibold)).foregroundColor(.white.opacity(0.65)).lineLimit(1)
                }
                Text(model.statusText).font(.system(size: 13, weight: .bold)).foregroundColor(model.statusColor).lineLimit(1).minimumScaleFactor(0.8)
                Spacer(minLength: 0)
                WeekDots(model: model)
                HStack(spacing: 6) {
                    Text(tr("goal", model.lang)).font(.system(size: 11, weight: .semibold)).foregroundColor(.white.opacity(0.7)).lineLimit(1)
                    GeometryReader { g in
                        ZStack(alignment: .leading) {
                            Capsule().fill(Color.white.opacity(0.14))
                            Capsule().fill(gold).frame(width: max(6, g.size.width * CGFloat(done) / CGFloat(max(1, model.snap.goal))))
                        }
                    }
                    .frame(height: 7)
                    Text("\(done)/\(model.snap.goal)").font(.system(size: 11, weight: .bold, design: .rounded)).foregroundColor(gold)
                }
            }
            Image(model.pet).resizable().scaledToFit().frame(width: 104)
        }
    }
}

private struct AccessoryView: View {
    let model: Model
    let family: WidgetFamily
    var body: some View {
        switch family {
        case .accessoryCircular:
            ZStack {
                AccessoryWidgetBackground()
                VStack(spacing: -1) {
                    Image(systemName: model.status == .done ? "flame.fill" : "flame").font(.system(size: 15, weight: .bold))
                    Text("\(model.streak)").font(.system(size: 19, weight: .heavy, design: .rounded)).minimumScaleFactor(0.6)
                }
            }
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 4) {
                    Image(systemName: model.status == .done ? "flame.fill" : "flame")
                    Text("\(model.streak) \(tr("days", model.lang))").font(.headline).lineLimit(1).minimumScaleFactor(0.7)
                }
                Text(model.statusText).font(.caption).lineLimit(2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        default:
            Text(Image(systemName: "flame.fill")) + Text(" \(model.streak) · " + tr(model.status == .done ? "short.done" : "short.risk", model.lang))
        }
    }
}

struct StreakEntryView: View {
    @Environment(\.widgetFamily) private var family
    let entry: DeenEntry
    var body: some View {
        let model = Model(entry: entry)
        Group {
            if family == .systemSmall {
                SmallStreakView(model: model).widgetBackground(night)
            } else {
                AccessoryView(model: model, family: family).widgetBackground(Color.clear, padded: false)
            }
        }
        .environment(\.layoutDirection, model.direction)
    }
}

struct ProgressEntryView: View {
    let entry: DeenEntry
    var body: some View {
        let model = Model(entry: entry)
        MediumProgressView(model: model)
            .widgetBackground(night)
            .environment(\.layoutDirection, model.direction)
    }
}

// MARK: - Widgets

struct StreakWidget: Widget {
    let kind = "IlnuraStreak"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DeenProvider()) { entry in
            StreakEntryView(entry: entry)
        }
        .configurationDisplayName(tr("streak.name", storedLang()))
        .description(tr("streak.desc", storedLang()))
        .supportedFamilies([.systemSmall, .accessoryCircular, .accessoryRectangular, .accessoryInline])
    }
}

struct ProgressWidget: Widget {
    let kind = "IlnuraProgress"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DeenProvider()) { entry in
            ProgressEntryView(entry: entry)
        }
        .configurationDisplayName(tr("progress.name", storedLang()))
        .description(tr("progress.desc", storedLang()))
        .supportedFamilies([.systemMedium])
    }
}

@main
struct IlnuraWidgets: WidgetBundle {
    var body: some Widget {
        StreakWidget()
        ProgressWidget()
    }
}
