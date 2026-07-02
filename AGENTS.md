# AGENTS.md — EduAI-Hub Frontend Design Instructions

## Project

EduAI-Hub is a React 18 + TypeScript + Vite + Tailwind CSS education platform for Vietnamese high school students.

It helps students:

* learn how to use AI effectively
* write better prompts
* use AI for studying, writing, English, productivity, and school tasks
* use guided AI chatbots
* save useful prompts
* explore lessons, textbooks, resources, and learning tools

## Important Constraints

The backend, database, Supabase auth, Coze API, and route logic are already set up.

Do not change:

* Supabase schema
* Supabase auth logic
* Coze API behavior
* API contracts
* database logic
* existing route meaning
* environment variables

Only change:

* frontend UI/UX
* styling
* layout
* reusable components
* responsiveness
* accessibility
* light/dark theme behavior

## Design Goal

Redesign the frontend to feel:

* visually striking
* editorial
* human-centered
* youthful
* creative
* slightly unconventional
* polished
* less generic
* less boxy
* less corporate
* less like a typical AI SaaS website

EduAI-Hub should feel like a creative education brand with strong taste, not a cold AI product.

## Theme Requirements

Default theme must be light mode.

Add a proper dark mode toggle:

* visible in the header
* stored in localStorage
* default to light mode if no preference exists
* use Tailwind dark mode or a clean theme system
* keep contrast accessible
* avoid pure black + neon overload

## Visual Direction

Use:

* warm off-white backgrounds
* deep ink text
* electric blue primary accent
* muted green and warm orange secondary accents
* large editorial headings
* asymmetrical layouts
* layered cards
* soft organic shapes
* offset frames
* subtle paper, sticker, notebook, and highlight details
* varied card sizes
* tasteful motion
* student-centered visual language

Avoid:

* generic blue-purple AI SaaS gradients
* repetitive rectangular card grids
* robots, chips, circuits, holograms, glowing brains
* cold corporate dashboards
* identical feature cards
* sterile layouts
* chaotic experimental art
* heavy animation that hurts performance

## Implementation Style

Prefer reusable components:

* ThemeToggle
* PageShell
* SectionHeading
* EditorialCard
* FeatureCard
* CTASection
* VideoFeatureBlock
* ShapeAccent
* EmptyState
* LoadingState

Keep components simple, TypeScript-safe, responsive, and maintainable.

## Workflow

Before making big changes:

1. inspect the current frontend structure
2. explain the design diagnosis
3. list files to modify
4. propose the implementation plan
5. then implement step by step

After each implementation step:

* run npm run build
* fix TypeScript and frontend errors
* keep backend logic untouched
