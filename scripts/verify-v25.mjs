/** Full app with an isolated Supabase SDK fixture; no network auth or database writes. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.EDUAIHUB_PLAYWRIGHT_MODULE ? pathToFileURL(path.resolve(process.env.EDUAIHUB_PLAYWRIGHT_MODULE)).href : 'playwright');
// Isolate each journey so a failed browser process cannot invalidate later journeys.
let browser;
const launchBrowser = () => chromium.launch({ headless:true, ...(process.env.EDUAIHUB_BROWSER_PATH ? {executablePath:process.env.EDUAIHUB_BROWSER_PATH}: {}) });
const base=process.env.EDUAIHUB_QA_URL || 'http://127.0.0.1:5173';
const output='.qa/v25.local';await fs.mkdir(output,{recursive:true});
const results=[];
async function test(name,run){
 if(process.env.EDUAIHUB_QA_FILTER&&!name.includes(process.env.EDUAIHUB_QA_FILTER))return;
 try{browser=await launchBrowser();await run();results.push({name,status:'PASS'});console.log('PASS',name);}
 catch(e){results.push({name,status:'FAIL',error:e.message});console.log('FAIL',name,e.stack||e.message);}
 finally{await browser?.close();}
}
async function setup({authenticated=true,loading=false,incomplete=false,width=1440,prompts=true,welcome=false}={}){
 const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});ctx.setDefaultTimeout(10000);ctx.setDefaultNavigationTimeout(30000);
 await ctx.route('**/src/lib/supabase.ts*',r=>r.fulfill({contentType:'application/javascript',body:'export const isSupabaseConfigured=true; export const supabaseConfigError="QA"; export const supabase=window.__qaSdk;'}));
 await ctx.route('**/*supabase.co/**',r=>r.abort());
 await ctx.addInitScript(({authenticated,loading,incomplete,prompts,welcome})=>{
  if(!welcome)sessionStorage.setItem("eduaihub_assistant_onboarding_v24","seen");
  const user={id:'qa-workspace',email:'qa@example.invalid',user_metadata:{full_name:'Học sinh kiểm thử'}};
  const profile={id:user.id,full_name:'Học sinh kiểm thử',avatar_url:'',grade:incomplete?null:11,school:incomplete?null:'Trường kiểm thử',personal_background:'Ngữ cảnh thử',strengths:[],weaknesses:[],common_problems:['Không biết viết prompt'],learning_goals:['Ôn kiểm tra'],preferred_learning_style:'Từng bước',ai_experience_level:'Đã dùng cơ bản',onboarding_completed:!incomplete,created_at:'2026-01-01',updated_at:'2026-01-01'};
  window.__qaProfile=profile;window.__qaCalls=[];window.__landingSeen=false;
  new MutationObserver(()=>{if([...document.querySelectorAll('h1')].some(e=>e.textContent.includes('Học cách hỏi,')))window.__landingSeen=true;}).observe(document,{childList:true,subtree:true});
  let authListener;const session=()=>({access_token:'fixture-only',user});
  window.__qaSdk={auth:{getSession:()=>loading?new Promise(resolve=>{window.__resolveAuth=authenticated=>resolve({data:{session:authenticated?session():null}});}):Promise.resolve({data:{session:authenticated||sessionStorage.getItem('qa-callback-user')?session():null}}),onAuthStateChange:callback=>{authListener=callback;return{data:{subscription:{unsubscribe(){}}}};},signInWithOAuth:async options=>{window.__oauthOptions=options;return{error:window.__oauthError?new Error("QA OAuth failure"):null};},signOut:async()=>{authListener('SIGNED_OUT',null);return{error:null};}},from(table){const query={select(){return this;},eq(){return this;},order(){return this;},limit(n){window.__qaCalls.push({table,limit:n});return this;},maybeSingle(){if(window.__failProfileRead)return Promise.resolve({data:null,error:new Error('QA profile read failure')});if(window.__holdProfile)return new Promise(resolve=>{window.__releaseProfile=()=>resolve({data:profile,error:null});});return Promise.resolve({data:table==='profiles'?profile:null,error:null});},single(){if(window.__pendingProfile)return new Promise(resolve=>{window.__releaseProfileSave=()=>{Object.assign(profile,window.__pendingProfile);window.__pendingProfile=null;resolve({data:profile,error:null});};});return Promise.resolve({data:profile,error:null});},update(data){if(!window.__holdProfileSave)throw new Error('Unexpected QA write');window.__pendingProfile=data;return this;},insert(){throw new Error('Unexpected QA write');},then(resolve,reject){const data=table==='learning_resources'?(window.__qaResources||[]):table==='saved_prompts'&&prompts?Array.from({length:2},(_,i)=>({id:`qa-prompt-${i}`,user_id:user.id,purpose:`Prompt cá nhân ${i+1}`,prompt_content:'Nội dung prompt cá nhân đã lưu dùng để kiểm thử.',subject:'Toán học',chapter:'',book_series:'',created_at:'2026-01-01'})):[];return Promise.resolve({data,error:null}).then(resolve,reject);}};return query;}};
  window.__refreshAuth=()=>authListener('TOKEN_REFRESHED',session());window.__emitAuth=authenticated=>authListener(authenticated?'SIGNED_IN':'SIGNED_OUT',authenticated?session():null);
 },{authenticated,loading,incomplete,prompts,welcome});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));return{ctx,page,errors};
}
async function open(page,route='/'){await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator('main').waitFor();}
async function ready(page){await page.waitForFunction(()=>!document.body.textContent.includes('Đang xác minh phiên đăng nhập'));await page.waitForTimeout(120);}

await test('Storage failure warns before reload; chat remains usable and warning recovers', async () => {
 const {ctx,page,errors}=await setup();
 await ctx.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  window.__failChatStorage=true;
  Storage.prototype.setItem=function(key,value){
   if(window.__failChatStorage&&key.startsWith('eduaihub_chat_sessions_'))throw new DOMException('QA quota','QuotaExceededError');
   return original.call(this,key,value);
  };
 });
 await ctx.route('**/api/coze',r=>r.fulfill({json:{content:'Phản hồi kiểm thử: hãy tự giải thích rồi đối chiếu SGK.',conversation_id:'fixture-conversation'}}));
 await open(page,'/ai-tools/hoc-tu-duy-prompt');await ready(page);
 const warning=page.getByRole('alert').filter({hasText:'Chưa lưu được lịch sử'});
 await warning.waitFor();
 const composer=page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'});
 await composer.fill('Câu hỏi khi bộ nhớ đầy');await page.getByRole('button',{name:'Gửi tin nhắn',exact:true}).click();
 await page.getByText('Phản hồi kiểm thử: hãy tự giải thích rồi đối chiếu SGK.',{exact:true}).waitFor();
 assert.ok(await warning.isVisible());
 for(const width of [320,390,1024]){
  await page.setViewportSize({width,height:500});
  assert.ok(await composer.evaluate(e=>{const box=e.getBoundingClientRect();return box.top>=0&&box.bottom<=innerHeight;}));
 }
 await page.setViewportSize({width:1440,height:900});
 await page.screenshot({path:output+'/storage-warning.png'});
 await page.evaluate(()=>window.__failChatStorage=false);
 await composer.fill('Câu hỏi sau khôi phục');await page.getByRole('button',{name:'Gửi tin nhắn',exact:true}).click();
 await warning.waitFor({state:'detached'});
 await page.reload();await ready(page);
 await page.getByText('Câu hỏi sau khôi phục',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);await ctx.close();
});

await test('Empty resource catalogue makes no unverified trust claim',async()=>{
 const{ctx,page}=await setup();await open(page,'/textbooks?grade=12');await ready(page);
 await page.getByText('Chưa có tài nguyên phù hợp với lựa chọn này.',{exact:true}).waitFor();
 assert.equal(await page.getByText(/Tài nguyên đã xác minh/).count(),0);await ctx.close();
});

await test('Three AI tools: real selection, delayed reply, network failure and retry with fixtures',async()=>{
 const{ctx,page,errors}=await setup();let failure=false;const requests=[];
 await ctx.route('**/api/coze',async r=>{

  requests.push(r.request().postDataJSON());
  if(failure)return r.abort('failed');
  await new Promise(resolve=>setTimeout(resolve,180));
  await r.fulfill({json:{content:'Phản hồi QA hợp lệ. Tự làm lại bài và đối chiếu nguồn.',conversation_id:'fixture-v25'}});
 });
 for(const slug of ['hoc-tu-duy-prompt','goi-y-prompt-hoc-tap','danh-gia-prompt']){
  await open(page,'/ai-tools');await page.locator(`main a[href="/ai-tools/${slug}"]`).first().click();
  const composer=page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'});
  await composer.fill('Hãy giúp mình tự sửa prompt học tập.');await page.keyboard.press('Enter');
  assert.ok(await page.getByRole('button',{name:'Gửi tin nhắn',exact:true}).isDisabled());
  await page.getByText('Phản hồi QA hợp lệ. Tự làm lại bài và đối chiếu nguồn.',{exact:true}).waitFor();
  assert.equal(requests.at(-1).botKey,{'hoc-tu-duy-prompt':'prompt-thinking','goi-y-prompt-hoc-tap':'study-prompt','danh-gia-prompt':'prompt-evaluator'}[slug]);
 }
 failure=true;const composer=page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'});
 await composer.fill('Thử khi mất mạng');await page.keyboard.press('Enter');
 await page.getByText('Không thể kết nối chatbot. Vui lòng kiểm tra mạng và thử lại.',{exact:true}).waitFor();
 failure=false;await composer.fill('Thử lại sau mất mạng');await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelectorAll('[role="log"] p').length>0&&!document.body.textContent.includes('AI đang phản hồi.'));
 assert.deepEqual(errors,[]);await ctx.close();
});

await test('Public mobile keyboard menu: Enter, Tab, Shift+Tab, Escape and focus restoration',async()=>{
 const{ctx,page}=await setup({authenticated:false,width:390});await open(page);await ready(page);
 const menu=page.getByRole('button',{name:'Mở menu công khai',exact:true});await menu.focus();await page.keyboard.press('Enter');
 const nav=page.getByRole('navigation',{name:'Điều hướng chính'});await nav.waitFor();
 await page.waitForFunction(()=>document.activeElement?.textContent==='Trang chủ');
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Tài nguyên');
 await page.keyboard.press('Shift+Tab');await page.keyboard.press('Escape');
 assert.ok(await menu.evaluate(e=>e===document.activeElement));
 await page.keyboard.press('Space');await nav.getByRole('link',{name:'Giới thiệu',exact:true}).focus();await page.keyboard.press('Enter');
 await page.waitForURL('**/about');await page.waitForFunction(()=>document.activeElement?.id==='main-content');await ctx.close();
});

await test('All twelve guide lessons: four stages, real links, self-check and browser Back',async()=>{
 const{ctx,page,errors}=await setup();await open(page,'/guides');await ready(page);
 const links=await page.locator('[role="tabpanel"] h3 a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 assert.equal(links.length,12);
 const tabs=page.getByRole('tab');await tabs.first().focus();await page.keyboard.press('End');
 await page.waitForURL('**/guides?stage=4');assert.equal(await tabs.last().getAttribute('aria-selected'),'true');
 await page.keyboard.press('Home');await page.waitForURL('**/guides?stage=1');
 for(const href of links){await open(page,href);await ready(page);assert.equal(await page.locator('main h1').count(),1);assert.ok(await page.getByRole('navigation',{name:'Mục lục bài học'}).count()>0);assert.equal(await page.locator('#lesson-self-check ol > li').count(),3);}
 await open(page,links[0]);await page.getByRole('navigation',{name:'Điều hướng bài học'}).getByRole('link',{name:/Bài tiếp theo/}).click();await page.waitForURL('**'+links[1]);
 await page.reload();await ready(page);await page.goBack();await ready(page);assert.deepEqual(errors,[]);await ctx.close();
});

for(const width of [320,390,768,1024,1280,1440])await test(`Responsive ${width}: light/dark, public/workspace/chat, low viewport`,async()=>{
 const{ctx,page,errors}=await setup({width});const readings=[];
 await page.setViewportSize({width,height:({320:800,390:844,768:1024,1024:768,1280:800,1440:900})[width]});
 for(const theme of ['light','dark']){
  await open(page);await ready(page);await page.evaluate(t=>{document.documentElement.classList.toggle('dark',t==='dark');localStorage.setItem('theme',t);},theme);
  for(const route of ['/','/about','/textbooks','/dashboard','/guides','/prompts','/profile','/ai-tools/goi-y-prompt-hoc-tap']){
   await page.evaluate(route=>{history.pushState({},'',route);dispatchEvent(new PopStateEvent('popstate'));},route);await ready(page);
   const reading=await page.evaluate(()=>({route:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length}));
   assert.ok(reading.scrollWidth<=width+1,JSON.stringify(reading));assert.equal(reading.main,1);assert.equal(reading.h1,1);readings.push({theme,...reading});
   if(route.includes('goi-y-prompt'))assert.ok(await page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'}).evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));
   if((width===390&&route==='/')||(width===1440&&route.includes('goi-y-prompt'))){await page.waitForTimeout(300);await page.screenshot({path:`${output}/v25-${width}-${theme}-${route==='/'?'home':'chat'}.png`});}
  }
 }
 await page.setViewportSize({width,height:500});await ready(page);
 assert.ok(await page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'}).evaluate(e=>{const box=e.getBoundingClientRect();return box.top>=0&&box.bottom<=innerHeight;}));
 assert.deepEqual(errors,[]);await ctx.close();
 const guest=await setup({authenticated:false,width});
 await guest.page.setViewportSize({width,height:({320:800,390:844,768:1024,1024:768,1280:800,1440:900})[width]});
 for(const theme of ['light','dark']){
  await open(guest.page);await ready(guest.page);await guest.page.evaluate(t=>{document.documentElement.classList.toggle('dark',t==='dark');localStorage.setItem('theme',t);},theme);
  for(const route of ['/','/about','/textbooks','/guides']){
   await guest.page.evaluate(route=>{history.pushState({},'',route);dispatchEvent(new PopStateEvent('popstate'));},route);await ready(guest.page);
   const reading=await guest.page.evaluate(()=>({guest:true,route:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length}));
   assert.ok(reading.scrollWidth<=width+1,JSON.stringify(reading));assert.equal(reading.main,1);assert.equal(reading.h1,1);readings.push({theme,...reading});
   if(width===390&&route==='/')await guest.page.screenshot({path:`${output}/v25-guest-${width}-${theme}-home.png`});
  }
 }
 assert.deepEqual(guest.errors,[]);await guest.ctx.close();
 await fs.writeFile(`${output}/responsive-${width}.json`,JSON.stringify(readings,null,2));
});

await test('Profile save fixture updates actual Dashboard recommendation',async()=>{
 const{ctx,page,errors}=await setup({width:390});await open(page,'/profile');await ready(page);
 await page.getByRole('button',{name:/Mục tiêu/}).click();
 const goals=page.getByRole('group',{name:'Mục tiêu học tập',exact:true});await goals.locator('summary').click();
 await goals.getByRole('checkbox',{name:'Ôn kiểm tra',exact:true}).uncheck();
 await goals.getByRole('checkbox',{name:'Tạo prompt tốt hơn',exact:true}).check();
 await page.evaluate(()=>window.__holdProfileSave=true);
 await page.getByRole('button',{name:'Lưu thông tin',exact:true}).click();
 await page.waitForFunction(()=>Boolean(window.__releaseProfileSave));await page.evaluate(()=>window.__releaseProfileSave());
 await page.getByRole('navigation',{name:'Điều hướng dưới'}).getByRole('link',{name:/Tổng quan/}).click();
 await page.waitForURL('**/dashboard');await page.getByText('Dựa trên mục tiêu “Tạo prompt tốt hơn” bạn đã chọn.',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);await ctx.close();
});

await test('Guest/member admin denial; invalid route and missing lesson recover safely',async()=>{
 for(const authenticated of [false,true]){
  const{ctx,page,errors}=await setup({authenticated});await open(page,'/admin');await ready(page);
  await page.getByRole('heading',{name:authenticated?'Bạn không có quyền truy cập Trung tâm quản trị EduAI-Hub.':'Vui lòng đăng nhập để truy cập Trung tâm quản trị.'}).waitFor();
  assert.equal(await page.getByRole('navigation',{name:'Điều hướng quản trị'}).count(),0);
  if(authenticated){await open(page,'/guides/qa-missing-lesson');await page.getByRole('heading',{name:/Không tìm thấy/}).waitFor();await page.reload();await ready(page);}
  await open(page,'/qa-invalid-route');await page.waitForURL(base+'/');await page.getByRole('heading',{name:/Học cách hỏi,/}).waitFor();
  assert.deepEqual(errors,[]);await ctx.close();
 }
});

await test('Study prompt context, copy, failed save retry and personal library round trip',async()=>{
 const{ctx,page,errors}=await setup();let request;
 await ctx.route('**/api/coze',r=>{request=r.request().postDataJSON();return r.fulfill({json:{content:'<EDUAI_PROMPT>Prompt QA V25: hãy gợi ý từng bước, đừng giải thay.</EDUAI_PROMPT>',conversation_id:'qa-study-save'}});});
 await open(page,'/ai-tools/goi-y-prompt-hoc-tap');await ready(page);
 await page.evaluate(()=>{
  window.__saved=[];window.__saveFail=true;const original=window.__qaSdk.from;
  window.__qaSdk.from=function(table){if(table!=='saved_prompts')return original.call(this,table);return{
   select(){return this;},eq(){return this;},order(){return this;},limit(){return this;},
   insert(data){if(window.__saveFail)return Promise.resolve({error:new Error('QA save failure')});window.__saved.push({...data,id:'qa-v25-saved',created_at:'2026-11-10'});return Promise.resolve({error:null});},
   then(resolve,reject){return Promise.resolve({data:window.__saved,error:null}).then(resolve,reject);}
  };};
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});
 });
 const context=page.getByRole('region',{name:'Ngữ cảnh học tập',exact:true});
 await context.getByLabel('Môn học',{exact:true}).selectOption('toan');await context.getByLabel('Nhu cầu học tập',{exact:true}).fill('Hiểu bài bằng câu hỏi gợi mở');
 await page.getByRole('textbox',{name:'Nội dung tin nhắn gửi chatbot'}).fill('Tạo prompt để tự học Toán');await page.getByRole('button',{name:'Gửi tin nhắn',exact:true}).click();
 const card=page.locator('[data-prompt-card]');await card.waitFor();assert.equal(request.studyContext.learningGoal,'Hiểu bài bằng câu hỏi gợi mở');
 await card.getByRole('button',{name:'Sao chép prompt',exact:true}).click();assert.match(await page.evaluate(()=>window.__copied),/Prompt QA V25/);
 await card.getByRole('button',{name:'Lưu prompt',exact:true}).click();await card.getByRole('alert').waitFor();
 await page.evaluate(()=>window.__saveFail=false);await card.getByRole('button',{name:'Lưu prompt',exact:true}).click();await card.getByText('Đã lưu vào Kho Prompt.',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.__saved.length),1);await page.locator('a[href="/prompts"]').first().click();
 await page.getByRole('button',{name:'Prompt của tôi',exact:true}).click();await page.getByText('Prompt QA V25: hãy gợi ý từng bước, đừng giải thay.',{exact:true}).first().waitFor();
 assert.deepEqual(errors,[]);await ctx.close();
});

const suffix=process.env.EDUAIHUB_QA_FILTER?.replace(/[^a-z0-9]+/gi,'-').slice(0,60)||'all';
await fs.writeFile(`${output}/v25-results-${suffix}.json`,JSON.stringify(results,null,2));
if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
