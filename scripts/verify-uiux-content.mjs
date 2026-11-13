import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import tailwindConfig from '../tailwind.config.js';

const root = process.cwd();
const require = createRequire(import.meta.url);
function loadData(file) {
  const filename = path.resolve(root, file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const data = new Module(filename);
  data.filename = filename;
  data.paths = require.resolve.paths('lucide-react');
  data._compile(compiled.outputText, filename);
  return data.exports;
}

const guidePath = 'src/data/guideLessons.ts';
const currentSource = fs.readFileSync(guidePath, 'utf8').replace(/\r\n/g, '\n');
const originalSource = execFileSync('git', ['show', `0bd1c09a2c658401beb4b218c2f59c27365cbd89:${guidePath}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n');
// V2.3 updates one product-feature description; every other source byte stays intact.
const expectedSource = originalSource.replace(
  'Bản đồ chương trình: giúp tìm ngữ cảnh lớp, môn, mảng kiến thức và chủ đề trước khi tạo prompt học tập.',
  'Tài nguyên học tập: giúp tìm danh mục sách theo lớp, môn và mở các nguồn tài liệu đang có.'
);
assert.equal(currentSource, expectedSource, 'Academic guide source must remain intact outside the resource feature rename');
const { guideLessons, guideStages, getGuideLesson, getAdjacentGuideLessons } = loadData(guidePath);
const blocks = guideLessons.flatMap(lesson => lesson.sections.flatMap(section => section.blocks ?? []));
const counts = {
  lessons: guideLessons.length,
  stages: guideStages.length,
  examplePrompts: blocks.filter(block => block.type === 'prompt').length,
  activities: blocks.filter(block => block.type === 'callout' && block.tone === 'try').length,
  selfChecks: guideLessons.reduce((total, lesson) => total + lesson.selfCheck.length, 0),
  aliases: guideLessons.reduce((total, lesson) => total + (lesson.legacySlugs?.length ?? 0), 0),
};
assert.deepEqual(counts, { lessons: 12, stages: 4, examplePrompts: 32, activities: 15, selfChecks: 36, aliases: 12 });
assert.equal(new Set(guideLessons.map(lesson => lesson.slug)).size, 12);
for (const [index, lesson] of guideLessons.entries()) {
  assert.equal(getGuideLesson(lesson.slug), lesson);
  for (const alias of lesson.legacySlugs ?? []) assert.equal(getGuideLesson(alias), lesson);
  assert.equal(getAdjacentGuideLessons(lesson.slug).previous, guideLessons[index - 1]);
  assert.equal(getAdjacentGuideLessons(lesson.slug).next, guideLessons[index + 1]);
  assert.ok(lesson.objectives.length && lesson.takeaways.length && lesson.selfCheck.length);
}
const { lessons } = loadData('src/data/lessons.ts');
assert.equal(lessons.length, 3);
const { learningTools } = loadData('src/data/learningTools.ts');
assert.equal(learningTools.length, 3);
const app = fs.readFileSync('src/App.tsx', 'utf8');
const baselineApp = execFileSync('git', ['show', '0bd1c09a2c658401beb4b218c2f59c27365cbd89:src/App.tsx'], { encoding: 'utf8' });
const routes = source => [...source.matchAll(/<Route\s+path="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(routes(app).sort(), [...routes(baselineApp), '/about'].sort(), 'Existing routes and redirects plus the V2.4 About route must stay available');
for (const tool of learningTools) assert.ok(routes(app).includes(tool.href));
console.log('PASS content integrity and route compatibility', JSON.stringify({ ...counts, experiences: lessons.length, tools: learningTools.length, routes: routes(app).length }));


const samples = ['bg-primary/10', 'text-primary/80', 'bg-bg-card/90', 'border-primary/30', 'ring-primary/20'];
const css = await postcss([tailwind({ ...tailwindConfig, content: [{ raw: samples.join(' '), extension: 'html' }] })]).process('@tailwind utilities;', { from: undefined });
for (const utility of samples) assert.ok(css.css.includes('.' + utility.replace('/', '\\/')), `Missing alpha utility: ${utility}`);
assert.ok(css.css.includes('color-mix(in srgb'));
console.log('PASS alpha color utility generation', samples.join(', '));
