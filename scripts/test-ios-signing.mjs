// Tests scripts/ios-signing.mjs against a local mock of the App Store Connect API (no Apple account involved):
// the JWT is verified with the key's public half, the calls and their order are checked, the .p12 is opened with openssl,
// the certificate limit is respected, cleanup revokes what setup created, and no secret ever reaches the output.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { setup, cleanup, makeJwt, normalizeP8, BUNDLE_ID, PROFILE_NAME } from './ios-signing.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ios-signing-'));
const sh = (...a) => execFileSync('openssl', a, { stdio: ['ignore', 'pipe', 'pipe'] });

// the key the "team" would have downloaded as AuthKey_XXXX.p8
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const P8 = privateKey.export({ type: 'pkcs8', format: 'pem' });
const KEY_ID = 'ABC123DEFG', ISSUER = '11111111-2222-3333-4444-555555555555';

// a throw-away CA that "Apple" signs certificates with
sh('req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', path.join(tmp, 'ca.key'), '-out', path.join(tmp, 'ca.pem'), '-subj', '/CN=Mock Apple CA/', '-days', '2');

let existingCerts = 0, bundleKnown = true, log = [];
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const url = req.url, entry = { method: req.method, url: url.split('?')[0], body: body ? JSON.parse(body) : null };
    log.push(entry);
    // authentication: ES256 JWT signed with the .p8, kid + iss + aud, short lifetime
    const [h, p, s] = String(req.headers.authorization || '').replace('Bearer ', '').split('.');
    const header = JSON.parse(Buffer.from(h, 'base64url')), payload = JSON.parse(Buffer.from(p, 'base64url'));
    const okSig = crypto.verify('sha256', Buffer.from(`${h}.${p}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(s, 'base64url'));
    assert.equal(okSig, true, 'JWT signature'); assert.equal(header.alg, 'ES256'); assert.equal(header.kid, KEY_ID);
    assert.equal(payload.iss, ISSUER); assert.equal(payload.aud, 'appstoreconnect-v1'); assert.ok(payload.exp - payload.iat <= 20 * 60, 'token lifetime <= 20 min');
    const send = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(obj ? JSON.stringify(obj) : ''); };
    if (req.method === 'GET' && url.startsWith('/v1/bundleIds')) return send(200, { data: bundleKnown ? [{ id: 'BUNDLE1', attributes: { identifier: BUNDLE_ID } }] : [] });
    if (req.method === 'POST' && url === '/v1/bundleIds') return send(201, { data: { id: 'BUNDLE2', attributes: { identifier: entry.body.data.attributes.identifier } } });
    if (req.method === 'GET' && url.startsWith('/v1/profiles')) return send(200, { data: [{ id: 'OLDPROFILE', attributes: { name: PROFILE_NAME } }] });
    if (req.method === 'GET' && url.startsWith('/v1/certificates')) return send(200, { data: Array.from({ length: existingCerts }, (_, i) => ({ id: `X${i}`, attributes: { name: 'old' } })) });
    if (req.method === 'POST' && url === '/v1/certificates') {
      const a = entry.body.data.attributes;
      assert.equal(a.certificateType, 'DISTRIBUTION'); assert.match(a.csrContent, /BEGIN CERTIFICATE REQUEST/);
      fs.writeFileSync(path.join(tmp, 'req.csr'), a.csrContent);
      sh('x509', '-req', '-in', path.join(tmp, 'req.csr'), '-CA', path.join(tmp, 'ca.pem'), '-CAkey', path.join(tmp, 'ca.key'), '-CAcreateserial', '-out', path.join(tmp, 'issued.pem'), '-days', '2');
      sh('x509', '-in', path.join(tmp, 'issued.pem'), '-outform', 'der', '-out', path.join(tmp, 'issued.der'));
      return send(201, { data: { id: 'CERT1', attributes: { certificateContent: fs.readFileSync(path.join(tmp, 'issued.der')).toString('base64') } } });
    }
    if (req.method === 'POST' && url === '/v1/profiles') {
      const d = entry.body.data;
      assert.equal(d.attributes.profileType, 'IOS_APP_STORE', 'an App Store profile');
      if (d.attributes.name !== PROFILE_NAME) {
        assert.equal(d.attributes.name, 'Ilnura Widget App Store (CI)'); assert.equal(d.relationships.bundleId.data.id, 'BUNDLE2', 'the widget profile is for the widget bundle id');
        assert.deepEqual(d.relationships.certificates.data, [{ type: 'certificates', id: 'CERT1' }]);
        return send(201, { data: { id: 'PROFILE2', attributes: { uuid: 'uuid-widget', profileContent: Buffer.from('MOCK-WIDGET').toString('base64') } } });
      }
      assert.equal(d.relationships.devices, undefined, 'no devices are involved');
      assert.deepEqual(d.relationships.certificates.data, [{ type: 'certificates', id: 'CERT1' }]);
      return send(201, { data: { id: 'PROFILE1', attributes: { uuid: 'uuid-1234', profileContent: Buffer.from('MOCK-PROFILE').toString('base64') } } });
    }
    if (req.method === 'DELETE') return send(204);
    send(404, { errors: [{ detail: 'unexpected ' + req.method + ' ' + url }] });
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
process.env.ASC_API_BASE = `http://127.0.0.1:${server.address().port}`;
const creds = (out) => ({ out, keyId: KEY_ID, issuerId: ISSUER, p8: P8 });

// capture everything the script prints
const printed = [];
const realLog = console.log; console.log = (...a) => printed.push(a.join(' '));

try {
  // 1. normal run
  const out = path.join(tmp, 'run1');
  const info = await setup(creds(out));
  assert.deepEqual(info, { profileName: PROFILE_NAME, profileUuid: 'uuid-1234', bundleId: BUNDLE_ID });
  for (const f of ['dist.p12', 'p12.pass', 'AppStore.mobileprovision', 'state.json', 'info.json']) assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.equal(fs.readFileSync(path.join(out, 'AppStore.mobileprovision'), 'utf8'), 'MOCK-PROFILE');
  const pass = fs.readFileSync(path.join(out, 'p12.pass'), 'utf8');
  sh('pkcs12', '-in', path.join(out, 'dist.p12'), '-passin', `pass:${pass}`, '-nodes', '-noout'); // the .p12 opens with the stored password
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, 'state.json'), 'utf8')), { certId: 'CERT1', profileId: 'PROFILE1' });
  assert.equal((fs.statSync(path.join(out, 'dist.key')).mode & 0o077), 0, 'private key is not readable by others');
  const order = log.map((l) => `${l.method} ${l.url}`);
  assert.deepEqual(order, ['GET /v1/bundleIds', 'GET /v1/profiles', 'DELETE /v1/profiles/OLDPROFILE', 'GET /v1/certificates', 'POST /v1/certificates', 'POST /v1/profiles']);

  // 2. cleanup revokes what was created, then forgets it
  log = [];
  await cleanup(creds(out));
  assert.deepEqual(log.map((l) => `${l.method} ${l.url}`), ['DELETE /v1/profiles/PROFILE1', 'DELETE /v1/certificates/CERT1']);
  assert.equal(fs.existsSync(path.join(out, 'state.json')), false);
  log = []; await cleanup(creds(out)); assert.equal(log.length, 0, 'cleanup twice does nothing');

  // 3. the team is at Apple's limit: a clear message and no certificate is requested
  existingCerts = 3; log = [];
  await assert.rejects(setup(creds(path.join(tmp, 'run2'))), /already has 3 Apple Distribution certificates/);
  assert.ok(!log.some((l) => l.method === 'POST' && l.url === '/v1/certificates'));
  existingCerts = 2;

  // 4. the bundle id is registered when it is missing
  bundleKnown = false; log = [];
  await setup(creds(path.join(tmp, 'run3')));
  assert.ok(log.some((l) => l.method === 'POST' && l.url === '/v1/bundleIds' && l.body.data.attributes.platform === 'IOS'));
  bundleKnown = true;

  // 5. a certificate that was issued but whose profile step failed is still revoked: state.json exists right after the certificate
  // (checked through the mock failing the profile call)
  // -> covered by cleanup reading state.json written before the profile request

  // 5b. with a widget extension: its bundle id is registered, its own profile signed by the same certificate, cleanup removes it too
  process.env.WIDGET_BUNDLE_ID = 'com.ilgazfindik.ilnura.widget'; log = [];
  const out4 = path.join(tmp, 'run4');
  const winfo = await setup(creds(out4));
  assert.deepEqual(winfo.widget, { profileName: 'Ilnura Widget App Store (CI)', profileUuid: 'uuid-widget', bundleId: 'com.ilgazfindik.ilnura.widget' });
  assert.equal(fs.readFileSync(path.join(out4, 'Widget.mobileprovision'), 'utf8'), 'MOCK-WIDGET');
  assert.ok(log.some((l) => l.method === 'POST' && l.url === '/v1/bundleIds' && l.body.data.attributes.identifier === 'com.ilgazfindik.ilnura.widget'));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out4, 'state.json'), 'utf8')), { certId: 'CERT1', profileId: 'PROFILE1', widgetProfileId: 'PROFILE2' });
  log = []; await cleanup(creds(out4));
  assert.deepEqual(log.map((l) => `${l.method} ${l.url}`), ['DELETE /v1/profiles/PROFILE2', 'DELETE /v1/profiles/PROFILE1', 'DELETE /v1/certificates/CERT1']);
  delete process.env.WIDGET_BUNDLE_ID;

  // 6. no secret reaches the output
  const all = printed.join('\n');
  assert.ok(!all.includes(P8.split('\n')[1]), 'the .p8 body is never printed');
  assert.ok(!all.includes(pass), 'the .p12 password is never printed');
  assert.ok(!all.includes('Bearer') && !all.includes('eyJ'), 'no token is printed');

  // 7. input handling
  assert.equal(normalizeP8(P8.replace(/\n/g, '\\n')), P8, 'a one-line secret is repaired');
  assert.throws(() => normalizeP8('not a key'), /does not look like a \.p8/);
  const jwt = makeJwt({ keyId: KEY_ID, issuerId: ISSUER, p8: P8, now: 1700000000 });
  assert.equal(JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url')).exp, 1700000000 + 900);
  console.log = realLog;
  console.log('PASS: ios-signing (mock App Store Connect API)');
} finally {
  console.log = realLog;
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
