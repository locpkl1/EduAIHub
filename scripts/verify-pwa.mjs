/** Real Chromium service-worker upgrade/offline checks on isolated local built assets. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.EDUAIHUB_PLAYWRIGHT_MODULE
  ? pathToFileURL(path.resolve(process.env.EDUAIHUB_PLAYWRIGHT_MODULE)).href : 'playwright');
const legacy = execFileSync('git', ['show', '53c771e:public/sw.js'], { encoding: 'utf8' });
let stage = 'old';
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (/^\/(api|auth|\.well-known)(\/|$)/.test(url.pathname)) {
      res.writeHead(401, { 'Content-Type': 'text/plain' }); res.end('Protected test endpoint'); return;
    }
    const name = url.pathname === '/sw.js' ? 'sw.js' : url.pathname.slice(1);
    let data;
    let type;
    if (name === 'sw.js') { data = stage === 'old' ? legacy : await fs.readFile('dist/sw.js'); type = 'application/javascript'; }
    else {
      const file = path.resolve('dist', name || 'index.html');
      if (!file.startsWith(path.resolve('dist') + path.sep)) throw new Error('Unsafe path');
      try { data = await fs.readFile(file); type = ({ '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html' })[path.extname(file)] || 'application/octet-stream'; }
      catch { data = await fs.readFile('dist/index.html'); type = 'text/html'; }
      if (type === 'text/html' && stage === 'old') data = data.toString().replace('<title>', '<title>OLD ');
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(data);
  } catch { res.writeHead(500); res.end('Test server failure'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, ...(process.env.EDUAIHUB_BROWSER_PATH ? { executablePath: process.env.EDUAIHUB_BROWSER_PATH } : {}) });
let checks = 0;
const pass = name => { checks++; console.log('PASS', name); };
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  await page.evaluate(async () => {
    localStorage.setItem('eduaihub_chat_sessions_test_user', 'preserve-history');
    const unrelated = await caches.open('another-app-cache'); await unrelated.put('/other', new Response('keep'));
  });
  assert.ok(await page.evaluate(async () => (await caches.keys()).includes('eduai-hub-v2')));
  pass('legacy worker and HTML cache installed');
  stage = 'new';
  await page.evaluate(async () => {
    const changed = new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    await (await navigator.serviceWorker.getRegistration()).update();
    await changed;
  });
  await page.waitForFunction(async () => (await caches.keys()).includes('eduaihub-offline-v1') && !(await caches.keys()).includes('eduai-hub-v2'));
  await page.reload();
  assert.ok(!(await page.title()).startsWith('OLD'));
  assert.equal(await page.evaluate(() => localStorage.getItem('eduaihub_chat_sessions_test_user')), 'preserve-history');
  assert.ok(await page.evaluate(async () => (await caches.keys()).includes('another-app-cache')));
  pass('old → new worker: fresh HTML, retained history and unrelated cache');
  await page.getByRole('heading', { name: /Học cách hỏi/ }).waitFor();
  assert.equal(await page.locator('main').count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByLabel('Lời chào của trợ lý EduAI-Hub', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Lời chào của trợ lý EduAI-Hub', { exact: true }).count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  pass('built Landing renders at mobile/desktop; committed passive assistant greeting remains');
  const manifest = await (await context.request.get(`${base}/manifest.json`)).json();
  assert.equal(manifest.id, '/'); assert.equal(manifest.scope, '/'); assert.equal(manifest.start_url, '/');
  for (const icon of manifest.icons) {
    const response = await context.request.get(base + icon.src); assert.equal(response.status(), 200);
    if (icon.type === 'image/png') {
      const buffer = await response.body(); const [width, height] = icon.sizes.split('x').map(Number);
      assert.equal(buffer.readUInt32BE(16), width); assert.equal(buffer.readUInt32BE(20), height);
    }
  }
  const session = await context.newCDPSession(page);
  const parsed = await session.send('Page.getAppManifest');
  assert.deepEqual(parsed.errors, []);
  pass('browser parses manifest; icon responses and PNG dimensions valid');
  for (const route of ['/', '/dashboard', '/guides', '/guides/tu-duy-hoc-tap-cung-ai', '/ai-tools/hoc-tu-duy-prompt', '/ai-tools/goi-y-prompt-hoc-tap', '/ai-tools/danh-gia-prompt', '/prompts', '/profile', '/textbooks']) {
    assert.equal((await page.goto(base + route)).status(), 200);
  }
  pass('10 direct SPA routes served (backend/auth isolated, not live feature acceptance)');
  assert.equal((await page.goto(base + '/auth/callback?code=test')).status(), 401);
  await page.goto(base + '/profile');
  assert.equal(await page.evaluate(async () => (await fetch('/api/coze', { method: 'POST', body: '{}' })).status), 401);
  const keys = await page.evaluate(async () => (await (await caches.open('eduaihub-offline-v1')).keys()).map(r => new URL(r.url).pathname));
  assert.deepEqual(keys, ['/offline.html']);
  pass('API/OAuth/profile responses absent from app Cache Storage');
  await context.setOffline(true);
  await page.goto(base + '/profile');
  await page.getByRole('heading', { name: 'Chưa có kết nối Internet' }).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('eduaihub_chat_sessions_test_user')), 'preserve-history');
  assert.ok(await page.evaluate(() => fetch('/api/coze').then(() => false, () => true)));
  pass('offline private-route navigation shows only public notice; API still fails honestly');
  await fs.mkdir('.qa/pwa.local', { recursive: true });
  for (const colorScheme of ['light', 'dark']) for (const width of [320, 390, 1280]) {
    await page.emulateMedia({ colorScheme }); await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `.qa/pwa.local/offline-${colorScheme}-${width}.png`, fullPage: true });
  }
  pass('offline fallback light/dark at 320/390/1280, no horizontal overflow');
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Thử tải lại' }).click();
  await page.waitForFunction(() => !document.querySelector('[name="eduaihub-offline-notice"]'));
  pass('retry returns to requested route when network recovers');
  await context.close();
  // Cold browser profile: install current worker before first offline relaunch.
  const fresh = await browser.newContext(); const tab = await fresh.newPage();
  await fresh.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  await tab.goto(base); await tab.waitForFunction(() => navigator.serviceWorker.controller);
  await fresh.setOffline(true); await tab.goto(base + '/guides');
  await tab.getByRole('heading', { name: 'Chưa có kết nối Internet' }).waitFor();
  pass('new profile warm-installed worker supports offline relaunch');
  await fresh.close();
  console.log(`PASS ${checks} PWA browser groups`);
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
