# EduAI-Hub Frontend Redesign Brief

## Project Context

EduAI-Hub is an AI learning platform for Vietnamese high school students from grade 10 to 12.

The platform helps students:

* learn how to use AI effectively
* write better prompts
* use AI for studying, writing, English learning, productivity, and school tasks
* save useful prompts
* use guided AI chatbots
* explore lessons, textbooks, resources, and learning tools

The backend, APIs, Supabase auth, database, and Coze API are already set up. This redesign must focus only on the frontend UI/UX.

## Current Tech Stack

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Router v7
* Supabase
* Recharts
* Vercel

## Current Routes

* `/` Landing page
* `/guides`
* `/ai-tools`
* `/lessons`
* `/lessons/:id`
* `/prompts`
* `/textbooks`
* `/profile`
* chatbot pages under `/ai-tools/...`

## Main Design Problem

The current UI is clean and usable, but it feels:

* too generic
* too boxy
* too safe
* too much like a normal AI SaaS website
* too industrial
* not visually memorable enough
* not expressive enough for a student-focused education brand

The redesign should not simply make the website “modern”.
The goal is to create a stronger visual identity.

## Design philosophy — V2.1 (authoritative)

**EDITORIAL LEARNING EXPERIENCE — MODERN NOTEBOOK EDITION**

**Distinctive — Readable — Functional.** Minimalism must not erase the product's identity. This section supersedes older broad suggestions for decoration throughout the site.

### Protected signature components

1. **Floating Capsule Navigation:** warm paper container, subtle border/shadow, grouped tabs, distinctive active state, layered blue/orange logo. Full desktop navigation only when enough room (currently 1280px). Capsule radius may exceed functional card radius.
2. **Layered Paper Hero:** editorial headline “Học cách hỏi, để biết cách học.” alongside readable paper/notebook layers and a blue learning note. Text remains in document flow; decorative layers cannot obscure it.
3. **Three AI Notebooks:** blue/orange/green notebooks for the three assistants, with paper edges, spine, meaningful icon, use case, example and one action each. No forced decorative stagger, clipped focus, excessive height, or static image replacing controls.

These signatures may be refined for accessibility, responsive layout and visual quality. Do not replace them with generic cards or flat navigation merely to simplify the design.

### V2.3 current product structure (supersedes V2.2 placement)

Application navigation is a **left** desktop grid column: 240px expanded, 72px rail. Keep public signatures, auth routing and dashboard intact. Chat history opens by default from1024px, left of chat; Study Prompt context remains a right dock, expanded by default. Retain push/slide, state, native sheets and all existing tools/data.

Guides is a single four-stage explorer (3/3/4/2 lessons). URL stage selection and old hashes work with keyboard and Back/Forward. Stage-only changes preserve the document reading position; ordinary route/anchor/POP behavior remains. Remove the public curriculum map, retaining the `/textbooks` resources route, catalogue, grade/subject filters, real PDFs and published sources. One guide01 product description is renamed accordingly; academic material is protected.

The website guidance assistant is an **independent fixed bottom-right widget**, never inside or offset by sidebar width. This explicitly replaces the earlier bottom-left placement. Use a56px circular brand-blue launcher and340px non-modal window,16px radius exception. Only static, honest guidance and real React Router links in this release; no API/service implementation. Hide below1024px, in chat/admin, with modal or form editing; no automatic popup on route changes. Avoid covering controls, keep safe-area margins, Escape/return focus and a scrollable low-height window. Hero artwork gains selection suppression only; text/links elsewhere and assistive-technology access stay intact.

See [V2.3 verification](UIUX_V23_VERIFICATION.md) for measurements and limits. The V2.2 extension below is historical and its placement rules are superseded.

### V2.2 product modes (historical extension)

Preserve the protected signatures in the **Public experience**. Guests keep the landing page at `/`. After session resolution, authenticated `/` uses a replace navigation to `/dashboard`; learning deep links remain accessible. Keep the existing Google OAuth callback at `/dashboard`. A per-tab sessionStorage return destination preserves the intended same-origin learning URL, including query/hash, and is consumed once. It is frontend navigation state, not server-side browsing history.

The **authenticated workspace** replaces the public top navbar with a right sidebar: 240px at 1280px and wider, 72px at 768–1279px or when collapsed. Below 768px, use a compact logo/avatar header and the existing five-destination bottom navigation, with Dashboard as its first destination. Guests use logo/login and the public home tab. Remove the mobile hamburger when the bottom navigation is present.

Dashboard leads with starting lesson 01, compact assistant shortcuts, up to three existing saved prompts, transparent profile-based recommendations, then resources. Never infer completed lessons, mastery, streaks or progress. Keep the existing profile page and three-step completion form; open completion explicitly from Profile instead of blocking all authenticated pages.

Chat is a focus surface for both modes: no public navbar, footer or bottom navigation. Authenticated desktop starts with a 72px right rail, expandable at wide desktop. From 1024px, history is an optional 220px left dock and functional context a 280px right dock, inside the application navigation. Study Prompt context starts expanded. Opening/closing changes grid columns and slides the panel, never covers desktop chat or uses fade alone. Below 1024px, use native modal sheets sliding from the corresponding edges, with explicit focus and return focus. Keep one mounted subtree and all context fields. Use the visual viewport, a compact header, a scrolling message pane and a bounded composer. Preserve chat business logic, storage, conversation IDs, prompt saves and Coze contracts. Physical mobile keyboard behavior still requires device QA.

Guides only gains a blue introductory surface and four controlled stage accents. Its twelve compact reading rows, route aliases and academic content remain intact. No global redesign, new dependencies, backend, schema or OAuth mechanism changes belong to this extension.

The V2.2 correction uses `1b0c374` as the direct Public brand reference, with screenshots at the same 1440/390px widths. Preserve the capsule on mobile too, restore tab icons/offset active shadow and add the requested blue outline. Restore separate vague/improved prompt sheets, the three-question checklist and a blue statement over a backing sheet, plus paper label, blue highlight, orange marker and dotted hero surface. Correct V1's overlapping text with flow/grid rather than returning to absolute placement of text. Keep the condensed sections below the hero unchanged. Workspace right navigation occupies a real grid column; the public capsule never replaces it.

### Surface roles

- **Signature UI:** navigation, homepage hero, AI Tools notebooks and small brand marks may be expressive. Paper layering and intentional depth belong here.
- **Functional UI:** forms, prompt controls, profile, dashboard/admin and mobile navigation stay compact, consistent and task focused. Buttons 4px, cards/inputs 6px, ordinary menus 8px; avatar/status circles retain meaning.
- **Reading UI:** Guides and lesson details retain V2 compact rows, optimized reading width, typography, table of contents, anchors and preserved academic content. No return to tall cards or repeated boxed sections.

### Responsive and interaction guardrails

Below 768px, provide labeled five-destination bottom navigation, safe-area padding and resources access to both Kho Prompt and Bản đồ chương trình. Hide it inside chatbot routes, including aliases, to protect the composer. Intermediate widths use a compact top header, not crowded desktop tabs.

Profile uses overview + three editing groups: Thông tin cơ bản / Cách học với AI / Mục tiêu học tập. Multi-choice fields disclose searchable native checkbox lists, preserve unknown stored values and impose no arbitrary limit. The completion dialog uses three steps with one scroll pane and a footer in normal flex layout. Keep drafts across steps and retain the existing save payload.

Preserve all V2 improvements: contrast in both themes, keyboard navigation, route scroll restoration, compact learning layout, content sources, and academic examples. Do not add heavy motion, glass effects, unrelated sections or backend/auth/data changes.

## Color Direction

Default theme must be light.

Suggested light mode:

* warm off-white background
* deep ink text
* electric blue as primary accent
* soft sky blue as secondary
* muted lime/green accent
* warm orange accent
* paper-like surfaces
* subtle grain/noise if performant

Suggested dark mode:

* deep ink / near black background
* warm dark surface cards
* electric blue accents
* soft cream text
* muted green/orange highlights
* avoid pure black + neon overload

Dark mode must be implemented properly using Tailwind `dark:` classes or a clean theme system. Store user preference in localStorage. Default should be light mode.

## Layout Direction

The design should reduce the boxy feeling.

Use:

* bigger hero statement
* stronger first impression
* asymmetric hero composition
* large editorial headings
* mixed section rhythm
* some sections with visual density
* some sections with calm breathing space
* cards with varied sizes
* layered UI previews
* curved or organic containers where appropriate
* non-uniform feature layout

## Motion / Video Direction

Create natural spaces for short AI-learning videos or motion loops.

The videos should feel:

* human
* educational
* editorial
* study-life inspired
* not like corporate AI ads

Possible video blocks:

* prompt turning into study plan
* student notes becoming flashcards
* English writing corrected by AI
* lesson summary generated from textbook content
* AI chatbot guiding a student step by step

Use video placeholders if real video assets are not available yet.

## Page Redesign Scope

Redesign frontend UI across the existing structure:

1. Header / Navigation
2. Landing page
3. Guides page
4. AI Tools page
5. Chatbot pages
6. Lessons page
7. Lesson detail page
8. Prompt library
9. Textbooks page
10. Profile page
11. Footer
12. Shared components
13. Theme toggle / dark mode

## Technical Constraints

Do not change:

* backend logic
* Supabase schema
* API contracts
* Coze API integration
* authentication logic
* database logic
* route meaning

Allowed:

* redesign components
* reorganize frontend-only components
* improve Tailwind classes
* create design-system components
* add theme toggle
* add animation/motion if lightweight
* improve responsive layout
* improve accessibility
* improve empty states and loading states

## Implementation Goals

The final UI must be:

* responsive
* accessible
* consistent
* visually distinctive
* easy to maintain
* not over-engineered
* compatible with the current app structure

## Design Principle

Make EduAI-Hub look like a creative education brand with taste, not a generic AI startup.

The website should make students feel:

“I want to try this. This looks smart, useful, and different.”
