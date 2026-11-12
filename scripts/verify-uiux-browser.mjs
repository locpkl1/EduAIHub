/** Local Vite QA. External reads are intercepted; no real sign-in or writes. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const modulePath = process.env.EDUAIHUB_PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(path.resolve(modulePath)).href : 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.EDUAIHUB_BROWSER_PATH ? { executablePath: process.env.EDUAIHUB_BROWSER_PATH } : {}) });
const base = process.env.EDUAIHUB_QA_URL || 'http://127.0.0.1:5173';
const output = process.env.EDUAIHUB_QA_OUTPUT || '.qa/uiux-v2.local';
await fs.mkdir(output, { recursive: true });
const results = [];
async function test(name, run) {
  if (process.env.EDUAIHUB_QA_SKIP_VISUAL && name.startsWith('Responsive:')) return;
  if (process.env.EDUAIHUB_QA_FILTER && !name.includes(process.env.EDUAIHUB_QA_FILTER)) return;
  try { const evidence = await run(); results.push({ name, status: 'PASS', evidence }); console.log('PASS', name); }
  catch (error) { results.push({ name, status: 'FAIL', error: error.message }); console.log('FAIL', name, error.message); }
}
async function context(width = 390) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
  ctx.setDefaultTimeout(10000);
  ctx.setDefaultNavigationTimeout(30000);
  await ctx.route('**/*supabase.co/**', route => route.request().url().includes('/rest/v1/')
    ? route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }) : route.abort());
  return ctx;
}
async function open(page, route) {
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await page.locator('main').waitFor();
  await page.getByText('Đang xác minh phiên đăng nhập…', { exact: true }).waitFor({ state: 'hidden' });
}
async function spa(page, route) {
  await page.evaluate(route => { history.pushState({}, '', route); dispatchEvent(new PopStateEvent('popstate')); }, route);
  await page.waitForTimeout(80);
}
async function bounds(page) {
  return page.evaluate(() => ({ mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light', width: innerWidth, height: document.documentElement.scrollHeight, scrollWidth: document.documentElement.scrollWidth, main: document.querySelectorAll('main').length, h1: document.querySelectorAll('h1').length }));
}
const routes = { home: '/', guides: '/guides', lesson: '/guides/tu-duy-hoc-tap-cung-ai', prompts: '/prompts', tools: '/ai-tools', lessons: '/lessons', experience: '/lessons/1', textbooks: '/textbooks', chat: '/ai-tools/hoc-tu-duy-prompt', study: '/ai-tools/goi-y-prompt-hoc-tap', evaluator: '/ai-tools/danh-gia-prompt', dashboard: '/dashboard', profile: '/profile', admin: '/admin' };
await test('Responsive: 6 widths × 14 routes × light/dark', async () => {
  const readings = [], errors = [];
  const ctx = await context(); const page = await ctx.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await open(page, '/');
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3000))]));
  for (const theme of ['light', 'dark']) for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(dark => { localStorage.setItem('theme', dark ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', dark); }, theme === 'dark');
    for (const [name, route] of Object.entries(routes)) {
      await spa(page, route);
      const reading = { name, theme, ...await bounds(page) }; readings.push(reading);
      assert.equal(reading.mode, theme, `Expected ${theme} theme for ${name}`);
      assert.ok(reading.scrollWidth <= width + 1, `${theme}/${width}/${name}: document overflow ${reading.scrollWidth}`);
      assert.equal(reading.main, 1, `${name}: one main`); assert.equal(reading.h1, 1, `${name}: one h1`);
      if ([390, 1440].includes(width) && ['home', 'guides', 'lesson', 'prompts', 'chat', 'textbooks'].includes(name)) {
        await page.screenshot({ path: `${output}/final-${theme}-${name}-${width}.png`, fullPage: true, animations: 'disabled', timeout: 15000 });
      }
    }
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(`${output}/responsive.json`, JSON.stringify(readings, null, 2));
  await ctx.close(); return { states: readings.length, errors: errors.length };
});

await test('Push / Back / Forward / anchors / chatbot document scroll', async () => {
  const ctx = await context(1280), page = await ctx.newPage();
  await open(page, '/guides');
  await page.getByRole('tab',{name:/Chặng 2:/}).click();
  const link = page.locator('a[href="/guides/tu-duy-hoc-tap-cung-ai"]').first();
  await link.scrollIntoViewIfNeeded(); const from = await page.evaluate(() => scrollY);
  await link.click(); await page.waitForURL('**/guides/tu-duy-hoc-tap-cung-ai');
  await page.waitForTimeout(150);
  assert.ok(await page.evaluate(() => scrollY < 3), `New route scrollY=${await page.evaluate(() => scrollY)}`);
  await page.evaluate(() => scrollTo(0, 800)); await page.waitForTimeout(100);
  await page.goBack(); await page.waitForTimeout(120);
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - from) < 5, 'Back restores guide position');
  await page.goForward(); await page.waitForTimeout(120);
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - 800) < 5, 'Forward restores article position');
  await page.getByRole('navigation', { name: 'Mục lục bài học' }).getByRole('link').nth(2).click();
  assert.ok(await page.evaluate(() => { const node = document.querySelector(location.hash); return node && node.getBoundingClientRect().top >= 76; }), 'Anchor clears header');
  await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: 'Công cụ AI' }).click();
  await page.locator('a[href="/ai-tools/hoc-tu-duy-prompt"]').first().click();
  await page.waitForTimeout(150);
  assert.ok(await page.evaluate(() => scrollY < 3), `New route scrollY=${await page.evaluate(() => scrollY)}`);
  await ctx.close(); return { back: from, forward: 800, anchor: 'visible below header' };
});

await test('Prompt: keyboard select/copy/error, mobile return focus, desktop panel', async () => {
  const ctx = await context(), page = await ctx.newPage();
  await open(page, '/prompts'); const trigger = page.locator('[data-prompt-select]').first(); await trigger.waitFor();
  const promptId = await trigger.getAttribute('data-prompt-select');
  assert.equal(await trigger.evaluate(e => getComputedStyle(e.closest('article')).borderRadius), '6px');
  await trigger.focus(); await page.keyboard.press('Enter');
  const detail = page.locator('#reference-prompt-detail'); await detail.waitFor();
  assert.ok(await detail.locator('h2').evaluate(e => document.activeElement === e));
  assert.ok(await detail.locator('h2').evaluate(e => e.getBoundingClientRect().top >= 76 && e.getBoundingClientRect().top < innerHeight));
  await page.evaluate(() => { window.__copied = ''; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } }); });
  const copy = detail.getByRole('button', { name: 'Sao chép prompt' });
  await copy.focus(); await page.keyboard.press('Enter'); await detail.getByRole('button', { name: 'Đã sao chép' }).waitFor();
  assert.ok((await page.evaluate(() => window.__copied)).length > 40);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } }));
  await detail.getByRole('button', { name: 'Đã sao chép' }).click(); await detail.getByRole('alert').waitFor();
  await detail.getByRole('button', { name: 'Quay lại danh sách' }).click();
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-prompt-select')), promptId);
  await page.setViewportSize({ width: 1440, height: 900 }); await trigger.click();
  assert.ok(await page.locator('[data-prompt-select]').first().isVisible());
  assert.equal(await detail.getByRole('button', { name: /Sao chép|Đã sao chép/ }).count(), 1);
  await ctx.close(); return { clipboard: 'intercepted success and denied failure', returnFocus: promptId };
});

// This fixture mounts actual UI components with an in-memory provider. It never starts AuthProvider.
async function fixture(page, kind) {
  await page.route('**/__uiux_fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><link rel="stylesheet" href="/src/index.css"></head><body><div id="fixture"></div></body></html>' }));
  await page.goto(base + '/__uiux_fixture');
  await page.evaluate(async kind => {
    const refresh = (await import('/@react-refresh')).default;
    refresh.injectIntoGlobalHook(window); window.$RefreshReg$ = () => {}; window.$RefreshSig$ = () => type => type; window.__vite_plugin_react_preamble_installed__ = true;
    const layoutSource = await (await fetch('/src/components/Layout.tsx')).text();
    const mainSource = await (await fetch('/src/main.tsx')).text();
    const React = (await import(layoutSource.match(/from "([^"]*\/react\.js[^"]*)"/)[1])).default;
    const client = await import(mainSource.match(/from "([^"]*react-dom_client\.js[^"]*)"/)[1]);
    const createRoot = client.createRoot ?? client.default.createRoot;
    const routerUrl = layoutSource.match(/from "([^"]*react-router-dom\.js[^"]*)"/)[1];
    const router = await import(routerUrl);
    const { AuthContext } = await import('/src/contexts/authContextCore.ts');
    const el = React.createElement;
    const value = { user: { id: 'qa-only', email: 'qa@example.invalid' }, profile: { full_name: 'Học sinh kiểm thử', grade: 11, school: 'Trường kiểm thử', onboarding_completed: true }, displayName: 'Học sinh có tên dài để kiểm tra bố cục', avatarUrl: '', loading: false, isGuest: false, isProfileIncomplete: false, signInWithGoogle: async () => {}, signOut: async () => {}, updateProfile: async data => { window.__profileSaved = data; }, dismissProfileModal: () => {} };
    value.profile = {...value.profile, personal_background:'Ngữ cảnh học tập dài cần được giữ khi chuyển nhóm. '.repeat(8), strengths:['Tư duy logic','Lựa chọn cũ cần giữ'], weaknesses:['Trì hoãn'], common_problems:['Không biết viết prompt'], learning_goals:['Học hiệu quả hơn'], preferred_learning_style:'Từng bước', ai_experience_level:'Đã dùng cơ bản'};
    value.updateProfile = async data => { if(window.__profileFail) throw new Error('QA save error'); window.__profileSaved=data; if(window.__profileHold) await new Promise(resolve=>{window.__finishProfile=resolve;}); };
    let content;
    if (kind === 'header') {
      const Layout = (await import('/src/components/Layout.tsx')).default;
      content = el(router.MemoryRouter, null, el(router.Routes, null, el(router.Route, { element: el(Layout) }, el(router.Route, { path: '*', element: el('h1', null, 'Kiểm thử tài khoản') }))));
    } else if (kind === 'saved') {
      const Collection = (await import('/src/components/saved-prompts/SavedPromptWorkspace.tsx')).default;
      function SavedFixture() {
        const [prompts, setPrompts] = React.useState([{ id: 'qa-prompt', user_id: 'qa-only', purpose: 'Prompt kiểm thử', prompt_content: 'Nội dung prompt kiểm thử ban đầu', subject: 'Toán học', chapter: '', book_series: '', created_at: '2026-01-01' }]);
        return el(Collection, { prompts, onUpdate: async (id, prompt_content) => { if (window.__failUpdate) throw new Error('test'); const updated = { ...prompts[0], prompt_content }; setPrompts([updated]); return updated; }, onDelete: async () => { if (window.__failDelete) throw new Error('test'); setPrompts([]); } });
      }
      content = el(SavedFixture);
    } else if (kind === 'profile-page') { const Profile = (await import('/src/pages/Profile.tsx')).default; content=el(router.MemoryRouter,null,el(Profile));
    } else if (kind === 'profile') {
      const Completion = (await import('/src/components/ProfileCompletionModal.tsx')).default;
      function ProfileFixture() {
        const [shown, setShown] = React.useState(false);
        return el(AuthContext.Provider, { value: { ...value, isProfileIncomplete: shown, dismissProfileModal: () => setShown(false) } }, el('button', { onClick: () => setShown(true) }, 'Mở hồ sơ'), el(Completion));
      }
      content = el(ProfileFixture);
    } else if (kind === 'admin') {
      const AdminLayout = (await import('/src/pages/admin/AdminLayout.tsx')).default;
      content = el(router.MemoryRouter, { initialEntries: ['/admin'] }, el(AdminLayout));
    }
    createRoot(document.getElementById('fixture')).render(el(AuthContext.Provider, { value }, content));
  }, kind);
}
await test('Authenticated shell navigation switches without double navigation', async () => {
  const ctx = await context(), page = await ctx.newPage(); await fixture(page, 'header');
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok((await bounds(page)).scrollWidth <= width + 1);
    assert.equal(await page.getByRole('navigation', { name: 'Điều hướng chính' }).count(), 0);
    if(width < 768) { const account=page.getByRole('button',{name:/^Tài khoản:/});await account.waitFor();await account.click();await page.getByRole('dialog',{name:'Tài khoản học tập'}).waitFor();await page.keyboard.press('Escape');assert.ok(await account.evaluate(e=>document.activeElement===e));assert.equal(await page.getByRole('button',{name:'Mở menu',exact:true}).count(),0); }
    else {assert.ok(await page.getByRole('navigation',{name:'Điều hướng workspace'}).isVisible());assert.equal(await page.getByRole('navigation',{name:'Điều hướng dưới'}).isVisible(),false);}
  }
  await ctx.close(); return 'Mock provider; real sign-in not invoked';
});
await test('Saved prompts: dialog trap, Escape, edit/delete success/error, clipboard fallback', async () => {
  const ctx = await context(), page = await ctx.newPage(); await fixture(page, 'saved');
  const card = page.locator('article > button').first(); await card.waitFor(); await card.click();
  let dialog = page.getByRole('dialog', { name: 'Prompt kiểm thử' }); await dialog.waitFor();
  for (let i = 0; i < 12; i++) { await page.keyboard.press(i % 3 ? 'Tab' : 'Shift+Tab'); assert.ok(await dialog.evaluate(e => e.contains(document.activeElement))); }
  await page.keyboard.press('Escape'); assert.ok(await card.evaluate(e => document.activeElement === e)); await card.click();
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); window.__fallback = 0; document.execCommand = () => { window.__fallback++; return true; }; });
  await dialog.getByRole('button', { name: 'Sao chép prompt' }).click(); assert.equal(await page.evaluate(() => window.__fallback), 1);
  await dialog.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Chỉnh sửa prompt', exact: true });
  await dialog.getByRole('textbox').fill('Nội dung đã sửa trong kiểm thử');
  await page.evaluate(() => { window.__failUpdate = true; }); await dialog.getByRole('button', { name: 'Lưu thay đổi' }).click(); await dialog.getByRole('alert').waitFor();
  await page.evaluate(() => { window.__failUpdate = false; }); await dialog.getByRole('button', { name: 'Lưu thay đổi' }).click();
  dialog = page.getByRole('dialog', { name: 'Prompt kiểm thử' }); await dialog.getByText('Nội dung đã sửa trong kiểm thử', { exact: true }).waitFor();
  await dialog.getByRole('button', { name: 'Xóa', exact: true }).click(); dialog = page.getByRole('dialog', { name: 'Xác nhận xóa prompt' });
  await page.evaluate(() => { window.__failDelete = true; }); await dialog.getByRole('button', { name: 'Xác nhận xóa' }).click(); await dialog.getByRole('alert').waitFor();
  await page.evaluate(() => { window.__failDelete = false; }); await dialog.getByRole('button', { name: 'Xác nhận xóa' }).click(); await dialog.waitFor({ state: 'detached' });
  assert.equal(await page.locator('article').count(), 0);
  await ctx.close(); return 'Callbacks and data in memory only';
});
await test('Profile dialog and admin navigation focus', async () => {
  const ctx = await context(), page = await ctx.newPage(); await fixture(page, 'profile');
  const trigger = page.getByRole('button', { name: 'Mở hồ sơ' }); await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Cập nhật hồ sơ học tập' }); await dialog.waitFor();
  await page.keyboard.press('Shift+Tab'); assert.ok(await dialog.evaluate(e => e.contains(document.activeElement)));
  await page.keyboard.press('Escape'); assert.ok(await trigger.evaluate(e => document.activeElement === e));
  await fixture(page, 'admin'); const menu = page.getByRole('button', { name: 'Mở menu quản trị' }); await menu.click();
  await page.getByRole('dialog', { name: 'Điều hướng quản trị' }).waitFor(); await page.keyboard.press('Escape'); assert.ok(await menu.evaluate(e => document.activeElement === e));
  await ctx.close();
});
await test('Chat: history keyboard, breakpoint changes, copy, mock send and persistence', async () => {
  const ctx = await context(), page = await ctx.newPage();
  const storageKey = 'eduaihub_chat_sessions_prompt-thinking_guest';
  const sessions = [{ id: 'qa-session', title: 'Phiên kiểm thử', messages: Array.from({ length: 20 }, (_, i) => ({ id: `qa-${i}`, role: i % 2 ? 'ai' : 'user', text: i % 2 ? '# Phản hồi thử\n\nNội dung kiểm thử đủ dài để cuộn trong cuộc trò chuyện.' : 'Câu hỏi thử' })), conversationId: 'qa-conversation', createdAt: '2026-01-01', updatedAt: '2026-01-01' }];
  await ctx.addInitScript(({ storageKey, sessions }) => localStorage.setItem(storageKey, JSON.stringify(sessions)), { storageKey, sessions });
  let requestBody;
  await page.route('**/api/coze', async route => { requestBody = route.request().postDataJSON(); await new Promise(resolve => setTimeout(resolve, 250)); await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ content: '# Phản hồi mới\n\nNội dung phản hồi kiểm thử.', conversation_id: 'qa-conversation' }) }); });
  await open(page, '/ai-tools/hoc-tu-duy-prompt'); const pane = page.locator('[role="log"]').locator('..'); await pane.waitFor();
  assert.equal(await page.locator('h1').count(), 1);
  await page.getByRole('button', { name: 'Hiện lịch sử trò chuyện' }).click(); const history = page.locator('#chat-history'); await history.waitFor();
  const session = history.getByRole('button', { name: 'Phiên kiểm thử', exact: true }); await session.focus(); await page.keyboard.press('Enter'); await history.waitFor({state:'hidden'}); assert.equal(await history.getAttribute('open'), null);
  await page.getByRole('button', { name: 'Hiện lịch sử trò chuyện' }).click(); await page.setViewportSize({ width: 768, height: 900 });
  const last = history.getByRole('button', { name: /Xóa phiên:/ }).last(); await last.focus(); await page.keyboard.press('Tab'); assert.ok(await history.evaluate(e => e.contains(document.activeElement)));
  await page.setViewportSize({ width: 390, height: 900 }); await last.focus(); await page.keyboard.press('Tab'); assert.ok(await history.evaluate(e => e.contains(document.activeElement)));
  await page.keyboard.press('Escape'); await history.waitFor({state:'hidden'}); assert.ok(await page.getByRole('button', { name: 'Hiện lịch sử trò chuyện' }).evaluate(e => document.activeElement === e));
  const windowBefore = await page.evaluate(() => scrollY); await pane.evaluate(e => { e.scrollTop = 0; }); assert.equal(await page.evaluate(() => scrollY), windowBefore);
  await page.getByRole('textbox', { name: 'Nội dung tin nhắn gửi chatbot' }).fill('Câu hỏi QA mới'); await page.getByRole('button', { name: 'Gửi tin nhắn' }).click();
  await page.getByText('Nội dung phản hồi kiểm thử.', { exact: true }).waitFor();
  assert.equal(requestBody.conversationId, 'qa-conversation'); assert.equal(requestBody.botKey, 'prompt-thinking'); assert.equal(requestBody.message, 'Câu hỏi QA mới');
  assert.equal(await page.getByText('Câu hỏi QA mới', { exact: true }).evaluate(e => getComputedStyle(e).color), 'rgb(255, 255, 255)', 'Light chat bubble must use on-primary foreground');
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(stored[0].conversationId, 'qa-conversation'); assert.equal(stored[0].messages.length, 22);
  assert.deepEqual(Object.keys(stored[0].messages[0]).sort(), ['id', 'role', 'text']);
  assert.equal(await page.evaluate(() => scrollY), windowBefore);
  await page.screenshot({ path: `${output}/chat-with-messages-390.png`, fullPage: true });
  await ctx.close(); return { messages: stored[0].messages.length, realCozeRequests: 0 };
});

await test('Slow article: loading, Back restore, user scroll interruption, error retry', async () => {
  const ctx = await context(1280), page = await ctx.newPage();
  let settleResponse;
  let responseGate;
  function holdResponse() { responseGate = new Promise(resolve => { settleResponse = resolve; }); }
  holdResponse();
  const post = { id: 'qa-post', slug: 'qa-delayed', title: 'Bài xuất bản kiểm thử', excerpt: 'Nội dung kiểm thử', content: Array.from({ length: 70 }, () => 'Đoạn văn kiểm thử khả năng khôi phục cuộn khi nội dung đến trễ.').join('\n\n'), category: 'Kinh nghiệm', tags: [], reading_minutes: 5, featured: false, updated_at: '2026-01-01', published_at: '2026-01-01' };
  await page.route('**/rest/v1/content_posts*', async route => {
    if (!route.request().url().includes('qa-delayed')) return route.fulfill({ contentType: 'application/json', body: '[]' });
    const fail = await responseGate;
    await route.fulfill({ status: fail ? 400 : 200, contentType: 'application/json', body: JSON.stringify(fail ? { message: 'QA read error' } : post) });
  });
  async function leaveArticle() { holdResponse(); const box = await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: 'Kinh nghiệm học' }).boundingBox(); assert.ok(box.y >= 0 && box.y < 90); await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); await page.getByRole('heading',{name:'Kinh nghiệm học cùng AI',exact:true}).waitFor(); }
  async function release(fail = false) { settleResponse(fail); }
  await open(page, '/lessons/qa-delayed');
  await page.getByRole('status').filter({ hasText: 'Đang tải bài viết' }).waitFor(); assert.equal(await page.getByText('Không tìm thấy bài học').count(), 0);
  await release(); await page.getByRole('heading', { name: post.title }).waitFor();
  await page.evaluate(() => scrollTo(0, 900)); await page.waitForTimeout(150);
  await leaveArticle(); await page.waitForURL('**/lessons'); await page.goBack();
  await page.getByRole('status').filter({ hasText: 'Đang tải bài viết' }).waitFor(); await release(); await page.getByRole('heading', { name: post.title }).waitFor(); await page.waitForTimeout(150);
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - 900) < 5, `Restore after late content: actual=${await page.evaluate(() => scrollY)}`);
  await leaveArticle(); await page.waitForURL('**/lessons'); await page.goBack();
  await page.getByRole('status').filter({ hasText: 'Đang tải bài viết' }).waitFor(); await page.mouse.wheel(0, 100); await release(); await page.getByRole('heading', { name: post.title }).waitFor(); await page.waitForTimeout(150);
  assert.ok(await page.evaluate(() => scrollY < 400), 'User input cancels restoration');
  await leaveArticle(); await page.waitForURL('**/lessons'); await page.goBack(); await release(true);
  await page.getByRole('heading', { name: 'Chưa tải được bài viết' }).waitFor(); holdResponse(); await page.getByRole('button', { name: 'Thử tải lại' }).click(); await release(); await page.getByRole('heading', { name: post.title }).waitFor();
  await ctx.close(); return 'Delayed and failed GET responses are fixtures; no server writes';
});
await test('Computed text contrast: public pages and semantic control states', async () => {
  const ctx = await context(1440), page = await ctx.newPage(); await open(page, '/');
  const failures = [], pairResults = [];
  for (const theme of ['light', 'dark']) {
    await page.evaluate(dark => { localStorage.setItem('theme', dark ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', dark); }, theme === 'dark');
    await page.waitForTimeout(200);
    for (const route of ['/', '/guides', '/guides/tu-duy-hoc-tap-cung-ai', '/prompts', '/lessons', '/lessons/6', '/ai-tools', '/textbooks', '/dashboard', '/profile']) {
      await spa(page, route);
      const scan = await page.evaluate(() => {
        const canvas = document.createElement('canvas'), paint = canvas.getContext('2d'); canvas.width = canvas.height = 1;
        function rgba(color) { paint.clearRect(0, 0, 1, 1); paint.fillStyle = color; paint.fillRect(0, 0, 1, 1); return [...paint.getImageData(0, 0, 1, 1).data].map((n, i) => i === 3 ? n / 255 : n); }
        function mix(a, b) { return [...a.slice(0, 3).map((n, i) => n * a[3] + b[i] * (1 - a[3])), 1]; }
        function bg(el) { const chain = []; for (let node = el; node; node = node.parentElement) chain.unshift(rgba(getComputedStyle(node).backgroundColor)); return chain.reduce((out, layer) => mix(layer, out), [255, 255, 255, 1]); }
        function luminance(color) { return color.slice(0, 3).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((out, n, i) => out + n * [.2126, .7152, .0722][i], 0); }
        function ratio(foreground, background) { const values = [luminance(mix(foreground, background)), luminance(background)].sort((a, b) => b - a); return (values[0] + .05) / (values[1] + .05); }
        const failures = [], walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let node; (node = walk.nextNode());) {
          if (!node.textContent.trim()) continue; const el = node.parentElement, style = getComputedStyle(el), bounds = el.getBoundingClientRect();
          if (!bounds.width || bounds.width < 2 || !bounds.height || style.visibility === 'hidden' || el.closest('.sr-only,[aria-hidden="true"],:disabled')) continue;
          const size = parseFloat(style.fontSize), min = size >= 24 || size >= 18.66 && parseFloat(style.fontWeight) >= 700 ? 3 : 4.5;
          const contrast = ratio(rgba(style.color), bg(el));
          if (contrast + .02 < min) failures.push({ text: node.textContent.trim().slice(0, 65), contrast: +contrast.toFixed(2), min, color: style.color, className: el.className });
        }
        const token = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        const pairs = [['primary', '--foreground-on-primary', '--color-primary'], ['primary hover', '--foreground-on-primary', '--color-primary-hover'], ['accent', '--foreground-on-accent', '--color-accent'], ['success', '--foreground-on-success', '--color-success'], ['primary selection', '--color-primary-text', '--color-primary-light'], ['subtle on muted', '--text-subtle', '--color-bg-muted'], ['secondary', '--color-secondary', '--color-secondary-light'], ['accent text', '--color-accent', '--color-accent-light']].map(([name, fg, background]) => ({ name, ratio: +ratio(rgba(token(fg)), rgba(token(background))).toFixed(2) }));
        return { failures, pairs };
      });
      failures.push(...scan.failures.map(issue => ({ theme, route, ...issue })));
      if (route === '/') pairResults.push({ theme, pairs: scan.pairs });
    }
    await spa(page, '/ai-tools/hoc-tu-duy-prompt');
    const placeholder = await page.getByRole('textbox').evaluate(e => getComputedStyle(e, '::placeholder').color);
    assert.notEqual(placeholder, 'rgb(156, 163, 175)', 'Textarea must use semantic placeholder');
  }
  await fs.writeFile(`${output}/contrast.json`, JSON.stringify({ failures, pairResults }, null, 2));
  assert.deepEqual(failures, []);
  for (const state of pairResults) for (const pair of state.pairs) assert.ok(pair.ratio >= 4.5, `${state.theme}/${pair.name}: ${pair.ratio}`);
  await ctx.close(); return pairResults;
});
await test('Reduced motion, focus appearance and 720px reflow', async () => {
  const ctx = await context(720), page = await ctx.newPage(); await page.emulateMedia({ reducedMotion: 'reduce' }); await open(page, '/guides');
  await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Đến nội dung chính');
  const focus = await page.evaluate(() => { const style = getComputedStyle(document.activeElement); return { width: style.outlineWidth, style: style.outlineStyle }; });
  assert.equal(focus.style, 'solid'); assert.equal(focus.width, '2px');
  await page.evaluate(() => { const node = document.createElement('span'); node.id = 'qa-spinner'; node.className = 'animate-spin'; document.body.appendChild(node); });
  assert.equal(await page.locator('#qa-spinner').evaluate(e => getComputedStyle(e).animationName), 'none');
  assert.ok((await bounds(page)).scrollWidth <= 720);
  await ctx.close(); return '720px CSS reflow; native browser zoom is not simulated';
});


await test('Browser clipboard: Enter and Space round-trip', async () => {
  const ctx = await context(); await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
  const page = await ctx.newPage(); await open(page, '/prompts');
  await page.locator('[data-prompt-select]').first().click(); const detail = page.locator('#reference-prompt-detail');
  const original = await detail.locator('pre').innerText(); const copy = detail.getByRole('button', { name: 'Sao chép prompt' });
  await copy.focus(); await page.keyboard.press('Enter'); await detail.getByRole('button', { name: 'Đã sao chép' }).waitFor();
  assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n'), original);
  await page.evaluate(() => navigator.clipboard.writeText('QA sentinel'));
  await page.keyboard.press('Space'); assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n'), original);
  await ctx.close(); return 'Native Chromium clipboard with test permissions';
});


await test('V21 bottom navigation: active routes, resources, keyboard and chat exclusion', async () => {
  const ctx=await context(), page=await ctx.newPage(); await open(page,'/');
  const bottom=page.getByRole('navigation',{name:'Điều hướng dưới'});
  assert.equal(await bottom.getByRole('link').count(),4);
  for(const [route,label] of [['/','Trang chủ'],['/guides/tu-duy-hoc-tap-cung-ai','Cẩm nang'],['/ai-tools','Công cụ AI'],['/lessons/1','Bài học']]) {
    await spa(page,route); assert.equal(await bottom.getByRole('link',{name:label,exact:true}).getAttribute('aria-current'),'page');
  }
  const resource=bottom.getByRole('button',{name:'Tài nguyên'});
  await resource.click();let dialog=page.getByRole('dialog',{name:'Tài nguyên học tập'}); await dialog.waitFor();await page.keyboard.press('Escape');assert.ok(await resource.evaluate(e=>document.activeElement===e));
  for(const label of ['Kho Prompt','Tài nguyên học tập']){await resource.click(); await dialog.getByRole('link',{name:label,exact:true}).click();await dialog.waitFor({state:'detached'});assert.equal(await resource.getAttribute('aria-current'),'page');}
  await page.waitForTimeout(200); await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight)); await page.waitForTimeout(100);
  const bottomTop=await bottom.evaluate(e=>e.getBoundingClientRect().top);
  const footerEnd=await page.locator('footer').evaluate(e=>e.getBoundingClientRect().bottom);
  assert.ok(footerEnd<=bottomTop+1,`Footer ${footerEnd} is above bottom nav ${bottomTop}`);
  for(const route of ['/ai-tools/hoc-tu-duy-prompt','/ai-tools/prompt-hoc-tap','/ai-tools/prompt-da-dung']){await spa(page,route);assert.equal(await bottom.count(),0);assert.ok(await page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'}).isVisible());}
  await spa(page,'/');await resource.click();await dialog.waitFor();await page.setViewportSize({width:768,height:900});await dialog.waitFor({state:'detached'});await page.waitForTimeout(100);assert.equal(await bottom.isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement?.id),'main-content');
  await ctx.close();
});
await test('V21 Profile: compact editing, searchable choices and full payload preservation', async () => {
 const ctx=await context(),page=await ctx.newPage();await fixture(page,'profile-page');
 await page.getByRole('heading',{name:'Hồ sơ học tập',exact:true}).waitFor();assert.equal(await page.locator('#profile-editor').count(),0);
 await page.screenshot({path:`${output}/after-profile-overview-390.png`,fullPage:true});
 await page.getByRole('button',{name:/Cách học với AI/}).click();
 const problems=page.getByRole('group',{name:'Vấn đề khi dùng AI'});await problems.locator('summary').click();await problems.getByRole('searchbox').fill('phu thuoc');await problems.getByRole('searchbox').press('Enter');assert.equal(await page.evaluate(()=>window.__profileSaved),undefined);await problems.getByRole('checkbox',{name:'Dễ phụ thuộc AI',exact:true}).check();
 await page.getByRole('button',{name:/Mục tiêu học tập/}).click();const goals=page.getByRole('group',{name:'Mục tiêu học tập'});await goals.locator('summary').click();await goals.getByRole('checkbox',{name:'Dùng AI có trách nhiệm',exact:true}).check();
 await page.getByRole('button',{name:/Cách học với AI/}).click();assert.ok(await page.getByRole('button',{name:'Bỏ Lựa chọn cũ cần giữ',exact:true}).isVisible());
 await page.getByRole('button',{name:'Lưu thông tin'}).click();await page.getByRole('status').filter({hasText:'đã được lưu'}).waitFor();
 const data=await page.evaluate(()=>window.__profileSaved);assert.deepEqual(data.strengths,['Tư duy logic','Lựa chọn cũ cần giữ']);assert.ok(data.common_problems.includes('Dễ phụ thuộc AI'));assert.ok(data.learning_goals.includes('Dùng AI có trách nhiệm'));assert.equal(data.preferred_learning_style,'Từng bước');assert.ok(data.personal_background.startsWith('Ngữ cảnh'));
 assert.deepEqual(Object.keys(data).sort(),['full_name','grade','school','personal_background','strengths','weaknesses','common_problems','learning_goals','preferred_learning_style','ai_experience_level','onboarding_completed'].sort());
 await page.getByRole('button',{name:'Thu gọn',exact:true}).click();assert.ok(await page.getByRole('button',{name:/Cách học với AI/}).evaluate(e=>document.activeElement===e));await page.getByRole('button',{name:/Cách học với AI/}).click();await page.setViewportSize({width:1440,height:900});await page.screenshot({path:`${output}/after-profile-editing-1440.png`,fullPage:true});await ctx.close();
});
await test('V21 onboarding: steps, low viewport, one scroll pane, draft and pending/error states', async()=>{
 const ctx=await context(),page=await ctx.newPage();await page.setViewportSize({width:320,height:600});await fixture(page,'profile');const trigger=page.getByRole('button',{name:'Mở hồ sơ'});await trigger.click();const dialog=page.getByRole('dialog',{name:'Cập nhật hồ sơ học tập'});await dialog.waitFor();
 await dialog.getByRole('textbox',{name:'Tên hiển thị'}).fill('Tên kiểm thử đã sửa');await dialog.getByRole('button',{name:'Tiếp theo'}).click();
 await dialog.getByRole('textbox',{name:'Bạn đang cần hỗ trợ điều gì?'}).fill('Bản nháp không được mất');
 const strength=dialog.getByRole('group',{name:'Điểm mạnh',exact:true});await strength.locator('summary').click();await strength.getByRole('checkbox',{name:'Sáng tạo',exact:true}).check();await strength.locator('summary').focus();await page.keyboard.press('Tab');assert.ok(await strength.getByRole('searchbox').evaluate(e=>document.activeElement===e));await strength.getByRole('searchbox').press('Enter');assert.equal(await page.evaluate(()=>window.__profileSaved),undefined);await page.keyboard.press('Escape');assert.equal(await strength.locator('details').getAttribute('open'),null);assert.ok(await dialog.isVisible());
 await dialog.getByRole('button',{name:'Tiếp theo'}).click();await dialog.getByRole('button',{name:'Quay lại'}).click();assert.equal(await dialog.getByRole('textbox',{name:'Bạn đang cần hỗ trợ điều gì?'}).inputValue(),'Bản nháp không được mất');await dialog.getByRole('button',{name:'Quay lại'}).click();assert.equal(await dialog.getByRole('textbox',{name:'Tên hiển thị'}).inputValue(),'Tên kiểm thử đã sửa');
 await dialog.getByRole('button',{name:'Tiếp theo'}).click();await dialog.getByRole('button',{name:'Tiếp theo'}).click();
 await page.screenshot({path:`${output}/after-modal-goals-320.png`});await page.evaluate(()=>{window.__profileFail=true;});await dialog.getByRole('button',{name:'Lưu hồ sơ',exact:true}).click();await dialog.getByRole('alert').waitFor();
 await page.evaluate(()=>{window.__profileFail=false;window.__profileHold=true;});await dialog.getByRole('button',{name:'Lưu hồ sơ',exact:true}).click();await dialog.getByRole('button',{name:'Đang lưu…'}).waitFor();assert.ok(await dialog.getByRole('button',{name:'Để sau'}).isDisabled());await page.keyboard.press('Escape');assert.ok(await dialog.isVisible());await page.evaluate(()=>window.__finishProfile());await dialog.getByRole('status').filter({hasText:'Đã lưu hồ sơ'}).waitFor();
 const data=await page.evaluate(()=>window.__profileSaved);assert.equal(data.full_name,'Tên kiểm thử đã sửa');assert.equal(data.personal_background,'Bản nháp không được mất');assert.ok(data.strengths.includes('Sáng tạo'));assert.ok(data.strengths.includes('Lựa chọn cũ cần giữ'));
 await dialog.getByRole('button',{name:'Quay lại'}).click();
 for(const [width,height]of [[320,400],[390,600],[768,600],[1280,900]]){await page.setViewportSize({width,height});await page.waitForTimeout(100);assert.ok((await bounds(page)).scrollWidth<=width+1);const footer=dialog.locator('footer');assert.ok(await footer.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));const pane=dialog.locator('.profile-dialog > div');await pane.evaluate(e=>e.scrollTop=e.scrollHeight);assert.ok(await pane.evaluate(e=>e.scrollHeight-e.scrollTop-e.clientHeight<2));assert.ok(await dialog.evaluate(e=>e.scrollHeight<=e.clientHeight+1),'Outer dialog should not scroll too');await page.screenshot({path:`${output}/after-modal-learning-${width}-${height}.png`});}
 await dialog.locator('summary').first().focus();await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert.ok(await trigger.evaluate(e=>document.activeElement===e));await ctx.close();
});
await test('V21 signature captures',async()=>{
 const ctx=await context(),page=await ctx.newPage();await open(page,'/');await page.evaluate(()=>document.fonts.ready);
 for(const theme of ['light','dark'])for(const width of [320,390,768,1280,1440]){await page.setViewportSize({width,height:900});await page.evaluate(theme=>{localStorage.setItem('theme',theme);document.documentElement.classList.toggle('dark',theme==='dark');},theme);for(const[name,route]of[['home','/'],['tools','/ai-tools']]){await spa(page,route);assert.ok((await bounds(page)).scrollWidth<=width+1);await page.screenshot({path:`${output}/after-${theme}-${name}-${width}.png`,fullPage:true});}}
 await ctx.close();
});

await fs.writeFile(`${output}/interaction-results.json`, JSON.stringify(results, null, 2));
await browser.close();
console.log(JSON.stringify(results, null, 2));
if (results.some(result => result.status === 'FAIL')) process.exitCode = 1;
