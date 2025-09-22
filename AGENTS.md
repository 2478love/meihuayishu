# Repository Guidelines

Follow this guide to contribute effectively to the plum-blossom divination experience.

## Project Structure & Module Organization
- `src/app`: Next.js App Router entry; `page.tsx` now orchestrates divination flow plus AI insight/chat state, while `api/ai/route.ts` proxies requests to configurable LLM providers.
- `src/components`: Presentation and interaction widgets (`DivinationForm`, `AnimatedHexagram`, `HistoryPanel`) plus the AI surfaces (`AiInsightCard`, `AiChatPanel`). Keep UI concerns here, inject domain data through props.
- `src/lib`: Deterministic logic (`divination.ts`, trigrams/hexagrams datasets, history helpers) and AI utilities (`ai.ts` for HTTP client, `aiPrompts.ts` for prompt assembly). New algorithms should remain side-effect free.
- `src/types`: Shared interfaces for divination results and AI payloads; reference via the `@/*` alias.
- `public`: Static icons and background assets copied into the Next.js build. Root config files contain Tailwind, ESLint, and TypeScript settings.

## Build, Test, and Development Commands
- `npm install`: Install dependencies; rerun after pulling lockfile changes.
- `npm run dev`: Start the Turbopack dev server at `http://localhost:3000` with HMR.
- `npm run build`: Create the production bundle; run before tagging releases.
- `npm run start`: Serve the optimized bundle locally to confirm deployment parity.
- `npm run lint`: Apply the Next.js `core-web-vitals` ruleset; required before opening a PR.

## Coding Style & Naming Conventions
TypeScript runs in strict mode; prefer 2-space indentation, single quotes, and early returns over nested conditionals. Use PascalCase for components, camelCase for utilities, and `UPPER_SNAKE_CASE` for constants. Reference modules through the `@/*` path alias. Tailwind classes belong inside JSX `className` attributes—avoid inline styles unless dynamic tokens are required.

## Testing Guidelines
Automated tests are not yet wired up. When adding logic in `src/lib`, include lightweight unit specs (Vitest or Jest) under `src/lib/__tests__` and mock only external data. Manual QA should cover every divination mode, AI 自动解读渲染、AI 对话往返（含失败兜底文案）、历史记录回放及移动端排版。Document edge cases in the PR description if they cannot be automated.

## Commit & Pull Request Guidelines
Git history follows a Conventional Commits prefix (`feat:`, `fix:`, `chore:`). Keep the summary imperative and under 72 characters; use English for clarity and add context in the body if the change spans multiple modules. PRs must link related issues, list verification steps (`npm run build`, `npm run lint`), and attach UI captures when styling shifts. Request a reviewer before assigning labels, and resolve lint warnings prior to approval.

## AI Integration Notes
- Copy `.env.example` to `.env.local` and fill `AI_API_KEY`, `AI_API_BASE_URL`, `AI_MODEL` with your chosen Chinese LLM provider (Tongyi, Wenxin, Zhipu, Qianfan, etc.). Optional overrides (`AI_SYSTEM_PROMPT`, `AI_TIMEOUT_MS`) fine-tune tone and latency.
- The server-side proxy (`src/app/api/ai/route.ts`) expects an OpenAI-compatible `chat/completions` endpoint. Adjust `AI_COMPLETIONS_PATH` if the provider uses a different path.
- Keep API secrets on the server; never expose provider keys through client-side code. When adding new AI modes, extend `aiPrompts.ts` for prompt design and re-use `callAi` for network calls.
