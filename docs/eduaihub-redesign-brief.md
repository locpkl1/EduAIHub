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

## Desired Creative Direction

The new EduAI-Hub UI should feel like:

A bold, editorial, human-centered, slightly experimental AI learning platform for Vietnamese students.

The design should combine:

* editorial web design
* modern education branding
* expressive typography
* subtle futuristic details
* student-centered storytelling
* warm human learning energy
* clean but unconventional layouts

## Brand Feeling

The final UI should feel:

* smart
* youthful
* creative
* inspiring
* helpful
* slightly rebellious
* memorable
* polished
* human
* not robotic
* not corporate
* not template-like

## Visual Direction

Use:

* default light mode
* optional dark mode toggle
* expressive typography
* asymmetrical section layouts
* layered cards and overlapping elements
* soft organic shapes
* offset frames
* visual rhythm
* warm off-white backgrounds
* stronger contrast
* tasteful motion
* non-generic AI visuals
* human learning moments
* subtle paper/sticker/notebook/highlight details

Avoid:

* generic blue-purple AI SaaS style
* robotic visuals
* glowing brains
* circuit board graphics
* hologram clichés
* identical card grids
* boring rectangular sections
* cold corporate dashboards
* over-polished industrial AI aesthetics
* changing backend logic

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
