import assert from 'node:assert/strict';
import { localParts, shouldSend, liveStreak, buildMessage, isAllowedPushEndpoint, safeEqual } from '../supabase/functions/send-reminders/logic.mjs';
// 2026-11-10 16:30 UTC = 19:30 in Istanbul (UTC+3), 17:30 in Berlin (UTC+1), 08:30 in Los Angeles (UTC-8)
const now = new Date('2026-11-10T16:30:00Z');
assert.deepEqual(localParts(now, 'Europe/Istanbul'), { date: '2026-11-10', hour: 19 });
assert.deepEqual(localParts(now, 'America/Los_Angeles'), { date: '2026-11-10', hour: 8 });
assert.deepEqual(localParts(new Date('2026-11-10T23:30:00Z'), 'Europe/Istanbul'), { date: '2026-11-11', hour: 2 }, 'local date rolls over');
assert.deepEqual(localParts(now, 'Not/AZone'), { date: '2026-11-10', hour: 16 }, 'unknown zone falls back to UTC');
const sub = (o = {}) => ({ tz: 'Europe/Istanbul', hour: 19, last_sent_on: null, lang: 'tr', ...o });
const streakState = { streakMeta: { lastStudyDate: '2026-11-09', currentStreak: 6 } };
assert.deepEqual(shouldSend(sub(), now, streakState), { date: '2026-11-10', streak: 6 }, 'due at the learner’s hour');
assert.equal(shouldSend(sub({ hour: 20 }), now, streakState), null, 'not the learner’s hour');
assert.equal(shouldSend(sub({ last_sent_on: '2026-11-10' }), now, streakState), null, 'only once per local day');
assert.equal(shouldSend(sub(), now, { streakMeta: { lastStudyDate: '2026-11-10', currentStreak: 7 } }), null, 'already studied today: no nag');
assert.deepEqual(shouldSend(sub(), now, null), { date: '2026-11-10', streak: 0 }, 'no synced progress: generic reminder');
assert.equal(liveStreak({ streakMeta: { lastStudyDate: '2026-11-07', currentStreak: 9 } }, '2026-11-10'), 0, 'broken streak is not promised');
assert.match(buildMessage('tr', 6).body, /6 günlük/);
assert.match(buildMessage('en', 0).body, /mini lesson/);
for (const l of ['tr', 'en', 'de', 'fr', 'ar']) { const m = buildMessage(l, 3); assert(m.title && m.body, l); }
assert.equal(buildMessage('xx', 0).title, 'Ilnura');
for (const ok of ['https://fcm.googleapis.com/fcm/send/abc','https://updates.push.services.mozilla.com/wpush/v2/x','https://web.push.apple.com/Qx','https://wns2-par02p.notify.windows.com/w/?token=1','https://api.push.apple.com/3/device/x']) assert(isAllowedPushEndpoint(ok), ok);
for (const bad of ['http://fcm.googleapis.com/x','https://evil.example/x','https://fcm.googleapis.com.evil.example/x','https://user:pw@fcm.googleapis.com/x','https://fcm.googleapis.com:8443/x','https://169.254.169.254/latest','https://localhost/x','not a url','']) assert(!isAllowedPushEndpoint(bad), bad);
assert(safeEqual('abc','abc')); assert(!safeEqual('abc','abd')); assert(!safeEqual('abc','abcd')); assert(!safeEqual('abc',null));
console.log('Reminder logic ok');
