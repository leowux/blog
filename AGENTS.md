# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js portfolio blog using the App Router. Route files, layouts, global styles, and UI components live under `app/`. Shared blog utilities are in `lib/`, especially `lib/blog.ts`. Blog content is stored as MDX files in `posts/`; each post should include frontmatter such as `title`, `publishedAt`, `summary`, and `tags`. Static images and public assets belong in `public/`. Custom markdownlint rules live in `markdownlint-rules/`.

## Build, Test, and Development Commands

- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create a production build and catch route/type/build errors.
- `pnpm start`: serve the production build after `pnpm build`.
- `pnpm lint:markdown "posts/**/*.mdx"`: lint blog posts with the configured markdownlint rules.

There is currently no dedicated unit test script. For UI changes, run the dev server and verify the affected page in a browser.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing style: two-space indentation, double quotes in TS/TSX imports, semicolons, and utility-first Tailwind classes. Keep reusable UI in `app/components/` and name component files in kebab case, for example `tag-cloud.tsx`. Component exports should use PascalCase, for example `TagCloud`. Blog post filenames should be lowercase, descriptive, and hyphenated, for example `daily-ai-topic-2026-07-06.mdx`.

## Testing Guidelines

Before submitting code changes, run `pnpm build`. For content changes, run `pnpm lint:markdown "posts/**/*.mdx"`. For visual changes, verify the relevant route locally, including responsive behavior where applicable. When changing wrapped labels or tags, check a narrow viewport such as `375x812`, confirm spacing via the rendered page, and capture a screenshot when useful.

## Agent Verification Flow

For UI changes, keep verification short and evidence-based:

1. Run `pnpm dev` and open the affected route in the Codex in-app browser.
2. Set a narrow viewport when checking responsive layout, usually `375x812`.
3. Inspect the visible result; use `getBoundingClientRect()` or `getComputedStyle()` only when spacing or sizing must be confirmed.
4. Capture one focused screenshot if the change is visual.
5. Check console errors, reset the viewport, and stop the dev server.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commits, such as `docs(blog): add daily ai topic 2026-07-06` and `chore(markdown): raise post word limit to 5000`. Keep that pattern: `type(scope): summary`. Use `docs(blog)` for post/content changes, `fix(ui)` for visual bugs, and `chore(...)` for maintenance.

Pull requests should include a short description, affected routes or files, verification commands run, and screenshots for UI changes. Link related issues when available.

## Security & Configuration Tips

Do not commit secrets or local environment files. Keep generated folders such as `.next/`, `node_modules/`, and local package stores out of commits.
