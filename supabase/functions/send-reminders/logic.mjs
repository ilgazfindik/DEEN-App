// Pure reminder rules (unit-tested in Node, imported by the Edge Function).
export const DEFAULT_HOUR = 19;

/** Local calendar date (YYYY-MM-DD) and hour for an IANA time zone. Falls back to UTC for unknown zones. */
export function localParts(now, tz) {
  let fmt;
  try { fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }); }
  catch (_) { fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }); }
  const p = Object.fromEntries(fmt.formatToParts(now).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}

export function previousDay(date) {
  const d = new Date(date + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Streak that is still alive today (studied yesterday), else 0. */
export function liveStreak(state, today) {
  const m = state && state.streakMeta;
  if (!m || !m.lastStudyDate) return 0;
  return m.lastStudyDate === previousDay(today) ? Math.max(0, Number(m.currentStreak) || 0) : 0;
}

/** One reminder per local day, at the learner's hour, only if they have not studied today. */
export function shouldSend(sub, now, state) {
  const { date, hour } = localParts(now, sub.tz);
  if (hour !== sub.hour) return null;
  if (sub.last_sent_on === date) return null;
  const studiedToday = !!(state && state.streakMeta && state.streakMeta.lastStudyDate === date);
  if (studiedToday) return null;
  return { date, streak: liveStreak(state, date) };
}

const MSG = {
  tr: { title: 'Ilnura', streak: (n) => `${n} günlük serin seni bekliyor. Bugün 5 dakikanı ayır!`, plain: 'Bugünkü mini dersin hazır. Birkaç dakikada tamamla!' },
  en: { title: 'Ilnura', streak: (n) => `Your ${n}-day streak is waiting. Take 5 minutes today!`, plain: 'Your mini lesson for today is ready. It takes just a few minutes!' },
  de: { title: 'Ilnura', streak: (n) => `Deine ${n}-Tage-Serie wartet. Nimm dir heute 5 Minuten!`, plain: 'Deine Mini-Lektion für heute ist bereit. Nur wenige Minuten!' },
  fr: { title: 'Ilnura', streak: (n) => `Ta série de ${n} jours t’attend. Prends 5 minutes aujourd’hui !`, plain: 'Ta mini-leçon du jour est prête. Quelques minutes suffisent !' },
  ar: { title: 'Ilnura', streak: (n) => `سلسلتك من ${n} يومًا تنتظرك. خصّص 5 دقائق اليوم!`, plain: 'درسك المصغّر لليوم جاهز. دقائق قليلة تكفي!' },
};
export function buildMessage(lang, streak) {
  const m = MSG[lang] || MSG.en;
  return { title: m.title, body: streak >= 2 ? m.streak(streak) : m.plain };
}
