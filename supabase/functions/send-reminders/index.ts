// Daily reminder sender. Called every 10 minutes by pg_cron (with a shared secret) and, for GET ?action=key, by the app.
import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { shouldSend, buildMessage } from './logic.mjs';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

async function config() {
  const { data, error } = await admin.from('push_config').select('*').eq('id', 1).single();
  if (error) throw error;
  if (data.vapid_public && data.vapid_private) return data;
  // First run: the keys are created here and never leave the server (only the public half is shared).
  const keys = webpush.generateVAPIDKeys();
  const { data: saved, error: e2 } = await admin.from('push_config').update({ vapid_public: keys.publicKey, vapid_private: keys.privateKey }).eq('id', 1).is('vapid_public', null).select('*').maybeSingle();
  if (e2) throw e2;
  if (saved) return saved;
  return (await admin.from('push_config').select('*').eq('id', 1).single()).data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  try {
    const cfg = await config();
    const url = new URL(req.url);
    if (req.method === 'GET' && url.searchParams.get('action') === 'key') return json({ publicKey: cfg.vapid_public });
    if (req.headers.get('x-cron-secret') !== cfg.cron_secret) return json({ error: 'forbidden' }, 403);

    webpush.setVapidDetails('https://github.com/ilgazfindik/DEEN-App', cfg.vapid_public, cfg.vapid_private);
    const now = new Date();
    const { data: subs, error } = await admin.from('push_subscriptions').select('*');
    if (error) throw error;
    const ids = [...new Set((subs ?? []).map((s) => s.user_id))];
    const states = new Map<string, any>();
    if (ids.length) {
      const { data: rows } = await admin.from('progress').select('user_id, state:data->>deen_v4_1_state').in('user_id', ids);
      for (const r of rows ?? []) { try { states.set(r.user_id, JSON.parse((r as any).state)); } catch (_) { /* no usable progress yet */ } }
    }
    let sent = 0, removed = 0, failed = 0, due = 0;
    for (const sub of subs ?? []) {
      const verdict = shouldSend(sub, now, states.get(sub.user_id) ?? null);
      if (!verdict) continue;
      due++;
      const msg = buildMessage(sub.lang, verdict.streak);
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify({ ...msg, url: './', tag: 'ilnura-daily' }), { TTL: 6 * 3600, urgency: 'normal' });
        await admin.from('push_subscriptions').update({ last_sent_on: verdict.date }).eq('id', sub.id);
        sent++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) { await admin.from('push_subscriptions').delete().eq('id', sub.id); removed++; }
        else { failed++; console.error('push failed', e?.statusCode ?? String(e)); }
      }
    }
    return json({ subscriptions: subs?.length ?? 0, due, sent, removed, failed });
  } catch (e) {
    console.error(e);
    return json({ error: 'internal' }, 500);
  }
});
