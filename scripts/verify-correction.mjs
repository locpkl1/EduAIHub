/** Full app with an isolated Supabase SDK fixture; no network auth or database writes. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.EDUAIHUB_PLAYWRIGHT_MODULE ? pathToFileURL(path.resolve(process.env.EDUAIHUB_PLAYWRIGHT_MODULE)).href : 'playwright');
const browser = await chromium.launch({ headless:true, ...(process.env.EDUAIHUB_BROWSER_PATH ? {executablePath:process.env.EDUAIHUB_BROWSER_PATH}: {}) });
const base=process.env.EDUAIHUB_QA_URL || 'http://127.0.0.1:5173';
const output='.qa/correction.local';await fs.mkdir(output,{recursive:true});
const results=[];
async function test(name,run){if(process.env.EDUAIHUB_QA_FILTER&&!name.includes(process.env.EDUAIHUB_QA_FILTER))return;try{await run();results.push({name,status:'PASS'});console.log('PASS',name);}catch(e){results.push({name,status:'FAIL',error:e.message});console.log('FAIL',name,e.message);}}
async function setup({authenticated=true,loading=false,incomplete=false,width=1440,prompts=true}={}){
 const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});ctx.setDefaultTimeout(10000);ctx.setDefaultNavigationTimeout(30000);
 await ctx.route('**/src/lib/supabase.ts*',r=>r.fulfill({contentType:'application/javascript',body:'export const isSupabaseConfigured=true; export const supabaseConfigError="QA"; export const supabase=window.__qaSdk;'}));
 await ctx.route('**/*supabase.co/**',r=>r.abort());
 await ctx.addInitScript(({authenticated,loading,incomplete,prompts})=>{
  const user={id:'qa-workspace',email:'qa@example.invalid',user_metadata:{full_name:'Học sinh kiểm thử'}};
  const profile={id:user.id,full_name:'Học sinh kiểm thử',avatar_url:'',grade:incomplete?null:11,school:incomplete?null:'Trường kiểm thử',personal_background:'Ngữ cảnh thử',strengths:[],weaknesses:[],common_problems:['Không biết viết prompt'],learning_goals:['Ôn kiểm tra'],preferred_learning_style:'Từng bước',ai_experience_level:'Đã dùng cơ bản',onboarding_completed:!incomplete,created_at:'2026-01-01',updated_at:'2026-01-01'};
  window.__qaProfile=profile;window.__qaCalls=[];window.__landingSeen=false;
  new MutationObserver(()=>{if([...document.querySelectorAll('h1')].some(e=>e.textContent.includes('Học cách hỏi,')))window.__landingSeen=true;}).observe(document,{childList:true,subtree:true});
  let authListener;const session=()=>({access_token:'fixture-only',user});
  window.__qaSdk={auth:{getSession:()=>loading?new Promise(resolve=>{window.__resolveAuth=authenticated=>resolve({data:{session:authenticated?session():null}});}):Promise.resolve({data:{session:authenticated||sessionStorage.getItem('qa-callback-user')?session():null}}),onAuthStateChange:callback=>{authListener=callback;return{data:{subscription:{unsubscribe(){}}}};},signInWithOAuth:async options=>{window.__oauthOptions=options;return{error:null};},signOut:async()=>{authListener('SIGNED_OUT',null);return{error:null};}},from(table){const query={select(){return this;},eq(){return this;},order(){return this;},limit(n){window.__qaCalls.push({table,limit:n});return this;},maybeSingle(){if(window.__failProfileRead)return Promise.resolve({data:null,error:new Error('QA profile read failure')});if(window.__holdProfile)return new Promise(resolve=>{window.__releaseProfile=()=>resolve({data:profile,error:null});});return Promise.resolve({data:table==='profiles'?profile:null,error:null});},single(){if(window.__pendingProfile)return new Promise(resolve=>{window.__releaseProfileSave=()=>{Object.assign(profile,window.__pendingProfile);window.__pendingProfile=null;resolve({data:profile,error:null});};});return Promise.resolve({data:profile,error:null});},update(data){if(!window.__holdProfileSave)throw new Error('Unexpected QA write');window.__pendingProfile=data;return this;},insert(){throw new Error('Unexpected QA write');},then(resolve,reject){const data=table==='saved_prompts'&&prompts?Array.from({length:2},(_,i)=>({id:`qa-prompt-${i}`,user_id:user.id,purpose:`Prompt cá nhân ${i+1}`,prompt_content:'Nội dung prompt cá nhân đã lưu dùng để kiểm thử.',subject:'Toán học',chapter:'',book_series:'',created_at:'2026-01-01'})):[];return Promise.resolve({data,error:null}).then(resolve,reject);}};return query;}};
  window.__refreshAuth=()=>authListener('TOKEN_REFRESHED',session());
 },{authenticated,loading,incomplete,prompts});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));return{ctx,page,errors};
}
async function open(page,route='/'){await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator('main').waitFor();}
async function ready(page){await page.waitForFunction(()=>!document.body.textContent.includes('Đang xác minh phiên đăng nhập'));await page.waitForTimeout(120);}

const measurements=[];
const sleep = page => page.waitForTimeout(280);
const chatInput = page => page.getByRole('textbox', {name:'Nội dung tin nhắn gửi chatbot'});
const conversationWidth = page => page.locator('.chat-conversation').evaluate(e=>e.getBoundingClientRect().width);
const contextTrigger = page => page.getByRole('button',{name:'Ngữ cảnh học tập',exact:true});
async function captureHero(page, width, filename) {
 const box=await page.locator('main section').first().boundingBox();
 const cdp=await page.context().newCDPSession(page);
 const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.ceil(box.y+box.height+16),scale:1}});
 await fs.writeFile(filename,Buffer.from(data,'base64'));await cdp.detach();
}

await test('Public hero restores distinct papers and navbar; brand returns home without reload',async()=>{
 for(const width of [1440,390]) {
  const {ctx,page,errors}=await setup({authenticated:false,width});await open(page,'/guides');await ready(page);
  await page.evaluate(()=>window.__spaBrandSentinel=true);await page.getByRole('link',{name:'EduAI-Hub — Trang chủ',exact:true}).click();await page.waitForURL(base+'/');
  await page.locator('[data-hero-paper]').first().waitFor();
  assert.equal(await page.evaluate(()=>window.__spaBrandSentinel),true);
  assert.equal(await page.locator('[data-hero-paper]').count(),4);assert.equal(await page.locator('.hero-board-backing').count(),1);
  if(width===1440){const active=page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Trang chủ',exact:true});const style=await active.evaluate(e=>({border:getComputedStyle(e).borderTopColor,shadow:getComputedStyle(e).boxShadow}));assert.ok(style.shadow.includes('3px 3px'));assert.notEqual(style.border,'rgba(0, 0, 0, 0)');assert.ok(await page.getByText('Sổ tay học cùng AI',{exact:true}).isVisible());}
  await page.evaluate(()=>document.fonts.ready);
  const paperCopy=page.locator('[data-hero-paper] p, [data-hero-paper] li > span:last-child');
  for(const node of await paperCopy.all()) {
   await node.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   assert.ok(await node.evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return [...range.getClientRects()].filter(r=>r.width>0&&r.height>0).every(r=>{const x=r.left+r.width/2,y=r.top+r.height/2;return x>=0&&x<=innerWidth&&y>=0&&y<=innerHeight&&e.contains(document.elementFromPoint(x,y));});}),'Paper text must be readable, not behind another sheet');
  }
  await page.evaluate(()=>scrollTo(0,0));await captureHero(page,width,`${output}/after-hero-${width}.png`);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await ctx.close();
 }
});

await test('Left app navigation occupies grid space, expands by default and returns to Dashboard',async()=>{
 const {ctx,page,errors}=await setup();await open(page,'/guides');await ready(page);const side=page.getByRole('complementary',{name:'Không gian học tập'});
 assert.equal(Math.round((await side.boundingBox()).width),240);assert.equal(await page.locator('.workspace-shell').evaluate(e=>getComputedStyle(e).display),'grid');
 const main=page.locator('main');const full=await main.boundingBox();assert.equal(Math.round(full.x),240);assert.equal(Math.round(full.width),1200);
 await page.evaluate(()=>window.__spaBrandSentinel=true);await side.getByRole('link',{name:'EduAI-Hub — Tổng quan',exact:true}).click();await page.waitForURL('**/dashboard');assert.equal(await page.evaluate(()=>window.__spaBrandSentinel),true);
 await page.getByRole('button',{name:'Thu gọn điều hướng',exact:true}).click();await page.waitForTimeout(70);const middle=(await main.boundingBox()).width;await sleep(page);const compact=(await main.boundingBox()).width;assert.ok(middle>full.width&&middle<compact,'Width must change during transition');assert.equal(Math.round(compact-full.width),168);measurements.push({kind:'left-navigation',expandedMain:full.width,midMain:middle,collapsedMain:compact});
 await side.getByRole('link',{name:'Cẩm nang AI',exact:true}).click();await side.getByRole('link',{name:'EduAI-Hub — Tổng quan',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForURL('**/dashboard');
 await page.getByRole('button',{name:'Mở rộng điều hướng',exact:true}).click();await sleep(page);assert.equal(Math.round((await main.boundingBox()).width),Math.round(full.width));
 await page.screenshot({path:`${output}/after-dashboard-1440.png`,fullPage:true});assert.deepEqual(errors,[]);await ctx.close();
});

await test('Chat2 desktop context pushes chat; history and collapsed context preserve every draft',async()=>{
 const {ctx,page,errors}=await setup();const key='eduaihub_chat_sessions_study-prompt_qa-workspace';
 const session={id:'context-session',title:'Phiên ngữ cảnh',messages:[{id:'message-1',role:'user',text:'Câu hỏi đã lưu'},{id:'message-2',role:'ai',text:'Phản hồi đã lưu'}],conversationId:'context-conversation',createdAt:'2026-01-01',updatedAt:'2026-01-01'};
 await ctx.addInitScript(({key,session})=>localStorage.setItem(key,JSON.stringify([session])),{key,session});
 await open(page,'/ai-tools/goi-y-prompt-hoc-tap');await ready(page);await sleep(page);const panel=page.getByRole('region',{name:'Ngữ cảnh học tập',exact:true});await panel.waitFor();assert.ok(await page.getByRole('region',{name:'Lịch sử trò chuyện',exact:true}).isVisible());await page.getByRole('button',{name:'Ẩn lịch sử trò chuyện',exact:true}).click();await sleep(page);

 assert.equal(await contextTrigger(page).getAttribute('aria-expanded'),'true');assert.equal(Math.round((await panel.boundingBox()).width),280);assert.equal(await panel.evaluate(e=>e.matches(':modal')),false);
 await panel.getByLabel('Môn học',{exact:true}).selectOption('toan');const area=panel.getByLabel('Mảng kiến thức',{exact:true});await area.selectOption({index:1});await panel.getByLabel('Chủ đề cụ thể (không bắt buộc)',{exact:true}).selectOption({index:1});await panel.getByLabel('Nhu cầu học tập',{exact:true}).fill('Ngữ cảnh không được mất');await panel.getByLabel('Trình độ hiện tại',{exact:true}).selectOption('Đang hiểu một phần');await chatInput(page).fill('Bản nháp hội thoại');
 const before=await panel.evaluate(e=>{window.__contextNode=e.querySelector('textarea');return [...e.querySelectorAll('select,textarea')].map(n=>n.value);});const stored=await page.evaluate(key=>localStorage.getItem(key),key);
 const chatBefore=await conversationWidth(page);const panelBox=await panel.boundingBox();const chatBox=await page.locator('.chat-conversation').boundingBox();assert.ok(panelBox.x>=chatBox.x+chatBox.width-1);
 await contextTrigger(page).click();await page.waitForTimeout(70);const middle=await conversationWidth(page);await sleep(page);const after=await conversationWidth(page);assert.ok(middle>chatBefore&&middle<after,'Chat width changes through the push transition');assert.equal(Math.round(after-chatBefore),280);measurements.push({kind:'chat-context-push',expandedChat:chatBefore,midChat:middle,collapsedChat:after});assert.ok(await page.locator('#chat-context').evaluate(e=>e.inert));
 await contextTrigger(page).focus();for(let i=0;i<10;i++){await page.keyboard.press('Tab');assert.equal(await page.locator('#chat-context').evaluate(e=>e.contains(document.activeElement)),false);}
 await contextTrigger(page).click();await sleep(page);assert.deepEqual(await panel.evaluate(e=>[...e.querySelectorAll('select,textarea')].map(n=>n.value)),before);assert.ok(await panel.evaluate(e=>window.__contextNode===e.querySelector('textarea')));assert.equal(await chatInput(page).inputValue(),'Bản nháp hội thoại');
 await page.getByRole('button',{name:'Hiện lịch sử trò chuyện'}).click();await sleep(page);const history=page.getByRole('region',{name:'Lịch sử trò chuyện',exact:true});assert.equal(Math.round((await history.boundingBox()).width),220);assert.equal(Math.round(chatBefore-await conversationWidth(page)),220);assert.equal(await history.evaluate(e=>e.matches(':modal')),false);assert.ok(await history.getByRole('button',{name:'Phiên ngữ cảnh',exact:true}).isVisible());
 await page.screenshot({path:`${output}/after-chat2-all-docks-1440.png`});await history.getByRole('button',{name:'Đóng lịch sử trò chuyện'}).click();await sleep(page);assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),stored);await contextTrigger(page).focus();await page.keyboard.press('Escape');await sleep(page);assert.equal(await contextTrigger(page).getAttribute('aria-expanded'),'false');assert.deepEqual(errors,[]);await ctx.close();
});

await test('Mobile sheets slide from edges, trap focus, preserve state and adapt to desktop',async()=>{
 for(const width of [320,390,768]) {
  const {ctx,page,errors}=await setup({width});await open(page,'/ai-tools/goi-y-prompt-hoc-tap');await ready(page);const trigger=contextTrigger(page);assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.ok((await trigger.boundingBox()).height>=44);
  await chatInput(page).fill('Bản nháp mobile');await trigger.click();const panel=page.getByRole('dialog',{name:'Ngữ cảnh học tập',exact:true});await panel.waitFor();await page.waitForFunction(()=>document.getElementById('chat-context').contains(document.activeElement));await page.waitForTimeout(30);const entering=(await panel.boundingBox()).x;await sleep(page);const settled=(await panel.boundingBox()).x;assert.ok(entering>settled,'Context moves leftward from the right edge');measurements.push({kind:'mobile-context-slide',width,enteringX:entering,settledX:settled});
  await panel.getByLabel('Nhu cầu học tập',{exact:true}).fill('Mục tiêu mobile');const field=panel.getByLabel('Trình độ hiện tại',{exact:true});await field.focus();await page.keyboard.press('Tab');assert.ok(await panel.evaluate(e=>e.contains(document.activeElement)));await page.keyboard.press('Escape');await page.locator('#chat-context').waitFor({state:'hidden'});assert.ok(await trigger.evaluate(e=>document.activeElement===e));
  await trigger.click();await panel.waitFor();await sleep(page);assert.equal(await panel.getByLabel('Nhu cầu học tập',{exact:true}).inputValue(),'Mục tiêu mobile');await panel.getByRole('button',{name:'Đóng ngữ cảnh học tập'}).click();await page.locator('#chat-context').waitFor({state:'hidden'});assert.equal(await chatInput(page).inputValue(),'Bản nháp mobile');
  await page.getByRole('button',{name:'Hiện lịch sử trò chuyện'}).click();const history=page.getByRole('dialog',{name:'Lịch sử trò chuyện',exact:true});await history.waitFor();await sleep(page);assert.equal(Math.round((await history.boundingBox()).x),0);await page.keyboard.press('Escape');await page.locator('#chat-history').waitFor({state:'hidden'});
  await page.setViewportSize({width,height:500});await chatInput(page).focus();await page.waitForTimeout(100);assert.ok(await chatInput(page).evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));
  await page.setViewportSize({width:1024,height:900});await sleep(page);const dock=page.getByRole('region',{name:'Ngữ cảnh học tập',exact:true});assert.ok(await dock.isVisible());assert.equal(await dock.getByLabel('Nhu cầu học tập',{exact:true}).inputValue(),'Mục tiêu mobile');assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.deepEqual(errors,[]);await ctx.close();
 }
});

await test('All three bots and dashboard: widths, themes, dock geometry, screenshots and reduced motion',async()=>{
 const {ctx,page,errors}=await setup();await open(page,'/dashboard');await ready(page);let states=0;
 const routes=[['dashboard','/dashboard'],['chat1','/ai-tools/hoc-tu-duy-prompt'],['chat2','/ai-tools/goi-y-prompt-hoc-tap'],['chat3','/ai-tools/danh-gia-prompt']];
 for(const theme of ['light','dark'])for(const width of [320,390,768,1024,1280,1440])for(const [name,route]of routes){
  await page.setViewportSize({width,height:900});await page.evaluate(theme=>{localStorage.setItem('theme',theme);document.documentElement.classList.toggle('dark',theme==='dark');},theme);await page.evaluate(route=>{history.pushState({},'',route);dispatchEvent(new PopStateEvent('popstate'));},route);await sleep(page);states++;
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme}/${width}/${name}`);assert.equal(await page.locator('main').count(),1);assert.equal(await page.locator('h1').count(),1);
  if(name.startsWith('chat')){assert.ok(await chatInput(page).evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));assert.equal(await page.getByRole('navigation',{name:'Điều hướng dưới'}).count(),0);if(name!=='chat2')assert.equal(await contextTrigger(page).count(),0);else assert.equal(await contextTrigger(page).getAttribute('aria-expanded'),width>=1024?'true':'false');}
  if([390,1440].includes(width)&&name!=='chat3'){await page.screenshot({path:`${output}/after-${theme}-${name}-${width}.png`,fullPage:name==='dashboard'});if(name==='chat2'){await contextTrigger(page).click();await sleep(page);await page.screenshot({path:`${output}/after-${theme}-chat2-${width>=1024?'collapsed':'sheet'}-${width}.png`});if(width>=1024)await contextTrigger(page).click();else await page.getByRole('dialog',{name:'Ngữ cảnh học tập',exact:true}).getByRole('button',{name:'Đóng ngữ cảnh học tập'}).click();await sleep(page);}}
 }
 await page.emulateMedia({reducedMotion:'reduce'});await open(page,'/ai-tools/goi-y-prompt-hoc-tap');await ready(page);assert.equal(await page.locator('.chat-panels').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert.equal(await page.locator('.chat-sliding-panel').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert.equal(await page.locator('.workspace-shell').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert.deepEqual(errors,[]);
 await fs.writeFile(`${output}/correction-responsive.json`,JSON.stringify({states,errors},null,2));await ctx.close();
});

await fs.writeFile(`${output}/push-measurements.json`,JSON.stringify(measurements,null,2));
await fs.writeFile(`${output}/correction-results.json`,JSON.stringify(results,null,2));await browser.close();if(results.some(x=>x.status==='FAIL'))process.exitCode=1;
