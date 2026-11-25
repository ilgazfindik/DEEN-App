#!/usr/bin/env node
// TestFlight signing without any registered device and without a Development profile.
//
// Uses the App Store Connect API (the same key the upload uses) to
//   1. create a short-lived "Apple Distribution" certificate (fresh key + CSR made here),
//   2. create an "App Store" (IOS_APP_STORE) provisioning profile for the bundle id: no devices are involved,
// and writes them to --out as dist.p12 (+ p12.pass), AppStore.mobileprovision and state.json. `cleanup` revokes both again,
// so nothing piles up against Apple's limit of distribution certificates.
//
//   node scripts/ios-signing.mjs setup   --out DIR      (env: ASC_KEY_ID ASC_ISSUER_ID ASC_API_KEY_P8 [BUNDLE_ID PROFILE_NAME
//                                                         WIDGET_BUNDLE_ID WIDGET_PROFILE_NAME])
// With WIDGET_BUNDLE_ID, the widget extension gets its own App Store profile (Widget.mobileprovision) signed by the same
// certificate; its bundle id is registered when missing.
//   node scripts/ios-signing.mjs cleanup --out DIR      (same env)
//
// Secrets are only read from the environment and are never printed. ASC_API_BASE lets the test point at a local mock.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const BUNDLE_ID = process.env.BUNDLE_ID || 'com.ilgazfindik.ilnura';
export const PROFILE_NAME = process.env.PROFILE_NAME || 'Ilnura App Store (CI)';
const widgetBundle = () => process.env.WIDGET_BUNDLE_ID || '';
const widgetProfileName = () => process.env.WIDGET_PROFILE_NAME || 'Ilnura Widget App Store (CI)';
const MAX_DISTRIBUTION_CERTS = 3; // Apple allows 3 per team

const apiBase = () => process.env.ASC_API_BASE || 'https://api.appstoreconnect.apple.com';
const b64url = (v) => Buffer.from(v).toString('base64url');

export function normalizeP8(raw) {
  let s = String(raw || '').trim();
  if (!s.includes('\n') && s.includes('\\n')) s = s.replace(/\\n/g, '\n').trim(); // a secret pasted on one line
  if (!/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(s)) throw new Error('APPSTORE_API_KEY_P8 does not look like a .p8 private key (paste the whole file, BEGIN/END lines included)');
  return s + '\n';
}

export function makeJwt({ keyId, issuerId, p8, now = Math.floor(Date.now() / 1000) }) {
  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
  const payload = { iss: issuerId, iat: now, exp: now + 15 * 60, aud: 'appstoreconnect-v1' };
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.sign('sha256', Buffer.from(data), { key: p8, dsaEncoding: 'ieee-p1363' });
  return `${data}.${sig.toString('base64url')}`;
}

async function api(token, method, url, body) {
  const res = await fetch(apiBase() + url, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url.split('?')[0]} -> HTTP ${res.status} ${text.slice(0, 700)}`);
  return text ? JSON.parse(text) : {};
}

function openssl(args, input) {
  return execFileSync('openssl', args, { input, stdio: ['pipe', 'pipe', 'pipe'] });
}

function exportP12(dir, password) {
  const base = ['pkcs12', '-export', '-inkey', path.join(dir, 'dist.key'), '-in', path.join(dir, 'dist.pem'), '-out', path.join(dir, 'dist.p12'), '-passout', `pass:${password}`];
  // macOS `security import` cannot read the default (AES) encryption of OpenSSL 3, so ask for the old one first.
  try { openssl([...base, '-keypbe', 'PBE-SHA1-3DES', '-certpbe', 'PBE-SHA1-3DES', '-macalg', 'sha1']); }
  catch (_) { openssl(base); }
}

async function ensureBundle(token, identifier, name) {
  const bundles = await api(token, 'GET', `/v1/bundleIds?filter[identifier]=${encodeURIComponent(identifier)}&limit=200`);
  let bundle = (bundles.data || []).find((b) => b.attributes?.identifier === identifier);
  if (!bundle) {
    bundle = (await api(token, 'POST', '/v1/bundleIds', { data: { type: 'bundleIds', attributes: { identifier, name, platform: 'IOS' } } })).data;
    console.log(`Registered bundle id ${identifier}`);
  }
  return bundle;
}

async function removeProfiles(token, name) {
  const old = await api(token, 'GET', `/v1/profiles?filter[name]=${encodeURIComponent(name)}&limit=200`);
  for (const p of old.data || []) if (p.attributes?.name === name) { try { await api(token, 'DELETE', `/v1/profiles/${p.id}`); } catch (_) {} }
}

async function createProfile(token, name, bundleId, certId) {
  return (await api(token, 'POST', '/v1/profiles', {
    data: {
      type: 'profiles',
      attributes: { name, profileType: 'IOS_APP_STORE' },
      relationships: { bundleId: { data: { type: 'bundleIds', id: bundleId } }, certificates: { data: [{ type: 'certificates', id: certId }] } },
    },
  })).data;
}

export async function setup({ out, keyId, issuerId, p8 }) {
  fs.mkdirSync(out, { recursive: true, mode: 0o700 });
  const token = makeJwt({ keyId, issuerId, p8 });

  // 1. the bundle id (it exists once the app record was made; create it if it does not)
  const bundle = await ensureBundle(token, BUNDLE_ID, 'Ilnura');

  // 2. leftovers of an earlier run with the same profile name
  await removeProfiles(token, PROFILE_NAME);

  // 3. room for one more distribution certificate?
  const certs = await api(token, 'GET', '/v1/certificates?filter[certificateType]=DISTRIBUTION&limit=200');
  const n = (certs.data || []).length;
  if (n >= MAX_DISTRIBUTION_CERTS) {
    throw new Error(`The team already has ${n} Apple Distribution certificates (the limit is ${MAX_DISTRIBUTION_CERTS}). `
      + 'Revoke an unused one at developer.apple.com > Certificates, IDs & Profiles > Certificates, then run again.');
  }

  // 4. key + CSR here, certificate from Apple
  openssl(['req', '-new', '-newkey', 'rsa:2048', '-nodes', '-keyout', path.join(out, 'dist.key'), '-out', path.join(out, 'dist.csr'), '-subj', '/CN=Ilnura CI/']);
  fs.chmodSync(path.join(out, 'dist.key'), 0o600);
  const csr = fs.readFileSync(path.join(out, 'dist.csr'), 'utf8');
  const cert = (await api(token, 'POST', '/v1/certificates', { data: { type: 'certificates', attributes: { certificateType: 'DISTRIBUTION', csrContent: csr } } })).data;
  fs.writeFileSync(path.join(out, 'state.json'), JSON.stringify({ certId: cert.id })); // written at once: cleanup can revoke it even if a later step fails
  fs.writeFileSync(path.join(out, 'dist.der'), Buffer.from(cert.attributes.certificateContent, 'base64'));
  openssl(['x509', '-inform', 'der', '-in', path.join(out, 'dist.der'), '-out', path.join(out, 'dist.pem')]);
  const password = crypto.randomBytes(18).toString('hex');
  exportP12(out, password);
  fs.writeFileSync(path.join(out, 'p12.pass'), password, { mode: 0o600 });

  // 5. App Store profile: no devices
  const profile = await createProfile(token, PROFILE_NAME, bundle.id, cert.id);
  fs.writeFileSync(path.join(out, 'AppStore.mobileprovision'), Buffer.from(profile.attributes.profileContent, 'base64'));
  const state = { certId: cert.id, profileId: profile.id };
  fs.writeFileSync(path.join(out, 'state.json'), JSON.stringify(state));
  const info = { profileName: PROFILE_NAME, profileUuid: profile.attributes.uuid, bundleId: BUNDLE_ID };
  console.log(`Created Apple Distribution certificate and App Store profile "${PROFILE_NAME}" (${profile.attributes.uuid}) for ${BUNDLE_ID}`);

  // 6. the widget extension: its own bundle id and App Store profile, same certificate
  if (widgetBundle()) {
    const wb = await ensureBundle(token, widgetBundle(), 'Ilnura Widget');
    await removeProfiles(token, widgetProfileName());
    const wp = await createProfile(token, widgetProfileName(), wb.id, cert.id);
    fs.writeFileSync(path.join(out, 'Widget.mobileprovision'), Buffer.from(wp.attributes.profileContent, 'base64'));
    state.widgetProfileId = wp.id;
    fs.writeFileSync(path.join(out, 'state.json'), JSON.stringify(state));
    info.widget = { profileName: widgetProfileName(), profileUuid: wp.attributes.uuid, bundleId: widgetBundle() };
    console.log(`Created App Store profile "${widgetProfileName()}" (${wp.attributes.uuid}) for ${widgetBundle()}`);
  }
  fs.writeFileSync(path.join(out, 'info.json'), JSON.stringify(info));
  return info;
}

export async function cleanup({ out, keyId, issuerId, p8 }) {
  const f = path.join(out, 'state.json');
  if (!fs.existsSync(f)) { console.log('Nothing to clean up'); return; }
  const { certId, profileId, widgetProfileId } = JSON.parse(fs.readFileSync(f, 'utf8'));
  const token = makeJwt({ keyId, issuerId, p8 });
  for (const [kind, id] of [['profiles', widgetProfileId], ['profiles', profileId], ['certificates', certId]]) {
    if (!id) continue;
    try { await api(token, 'DELETE', `/v1/${kind}/${id}`); console.log(`Removed ${kind.slice(0, -1)} ${id}`); }
    catch (e) { console.log(`Could not remove ${kind.slice(0, -1)} ${id}: ${String(e.message).slice(0, 200)}`); }
  }
  fs.rmSync(f, { force: true });
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const i = rest.indexOf('--out');
  const out = i >= 0 ? rest[i + 1] : null;
  if (!['setup', 'cleanup'].includes(cmd) || !out) { console.error('usage: ios-signing.mjs setup|cleanup --out DIR'); process.exit(2); }
  const keyId = process.env.ASC_KEY_ID, issuerId = process.env.ASC_ISSUER_ID;
  if (!keyId || !issuerId || !process.env.ASC_API_KEY_P8) { console.error('Missing ASC_KEY_ID / ASC_ISSUER_ID / ASC_API_KEY_P8'); process.exit(1); }
  const args = { out, keyId, issuerId, p8: normalizeP8(process.env.ASC_API_KEY_P8) };
  try { await (cmd === 'setup' ? setup(args) : cleanup(args)); }
  catch (e) { console.error(`ios-signing ${cmd} failed: ${e.message}`); process.exit(1); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
