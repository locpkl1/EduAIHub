import fs from 'node:fs/promises';
import ts from 'typescript';
import { pathToFileURL } from 'node:url';
const original = await fs.readFile('scripts/verify-v25.mjs','utf8');
const line = original.split('\n').find(s=>s.includes("await ctx.route('**/src/lib/supabase.ts*'"));
if(!line) throw Error('Fixture anchor changed');
function patchBundle(source) {
 const ast=ts.createSourceFile('bundle.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 const declarations=[];
 function visit(n){if(ts.isVariableDeclaration(n))declarations.push(n);ts.forEachChild(n,visit)}visit(ast);
 const matches=declarations.filter(n=>n.initializer&&ts.isConditionalExpression(n.initializer)&&n.initializer.getText(ast).includes('placeholder-anon-key'));
 if(matches.length!==1)throw Error('Expected exactly one Supabase client initializer');
 const topLevel=n=>{for(let p=n.parent;p;p=p.parent)if(ts.isFunctionLike(p))return false;return true;};
 const client=matches[0], flags=declarations.filter(n=>topLevel(n)&&n.name.getText(ast)===client.initializer.condition.getText(ast));
 if(flags.length!==1)throw Error('Expected one top-level configuration flag');
 const flag=flags[0];
 if(!flag?.initializer)throw Error('Missing configuration flag');
 const edits=[{start:client.initializer.getStart(ast),end:client.initializer.end,text:'window.__qaSdk'},{start:flag.initializer.getStart(ast),end:flag.initializer.end,text:'true'}];
 for(const edit of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,edit.start)+edit.text+source.slice(edit.end);
 return source;
}
const replacement=` await ctx.route('**/assets/*.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:patchBundle(await response.text())});});`;
// URL changes can precede React committing aria-selected; wait for the SAME asserted state.
const stable=original.replace("await page.waitForURL('**/guides?stage=4');assert.equal", "await page.waitForURL('**/guides?stage=4');await page.waitForFunction(()=>[...document.querySelectorAll('[role=tab]')].at(-1)?.getAttribute('aria-selected')==='true');assert.equal");
const readyMenu=stable.replace("await page.keyboard.press('Space');await nav.getByRole", "await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('[aria-controls=public-navigation]')?.getAttribute('aria-expanded')==='true');await nav.getByRole");
const source=`import ts from '${pathToFileURL(process.cwd()+'/node_modules/typescript/lib/typescript.js').href}';\n${patchBundle.toString()}\n`+readyMenu.replace(line,replacement);
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
