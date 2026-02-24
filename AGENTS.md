# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Expo Router screens and route segments (for example, `app/job/[id].tsx`).
- `components/`: Reusable UI split by concern: `ui/`, `layout/`, and `job/`.
- `hooks/`: Custom hooks (`useJobs`, `useAuth`, `useFavorites`) for stateful logic.
- `services/`: Data access and service functions; `utils/`: pure helper functions.
- `constants/`: Design tokens and app constants; prefer `constants/theme.ts` over hardcoded values.
- `types/`: Domain types/interfaces; `locales/`: i18n resources; `assets/images/`: static assets.
- `docs/`: Extended technical documentation (`Development.md`, `API.md`, etc.).

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm start`: Start the Expo development server.
- `npm run ios`: Launch iOS target.
- `npm run android`: Launch Android target.
- `npm run web`: Run the web target.
- `npm run lint`: Run Expo ESLint checks.

## Coding Style & Naming Conventions
- TypeScript is strict (`tsconfig.json`); avoid `any` unless there is a clear, temporary reason.
- Use 2-space indentation and keep files focused on one responsibility.
- Naming: components/screens use PascalCase (`JobCard.tsx`, `RegistrationScreen.tsx`); hooks use camelCase with `use` prefix (`useDebounce.ts`); utility/constants/type files use concise camelCase names (`salary.ts`, `job.ts`).
- Use `@/` path aliases for root imports.
- Use theme tokens (`colors`, `spacing`, `typography`) instead of raw hex or magic numbers.

## Testing Guidelines
- No automated test runner is currently configured in `package.json`.
- Minimum PR validation: run `npm run lint` and manually verify changed flows on at least one native target (`ios` or `android`).
- For UI changes, also verify `npm run web`.
- If you add non-trivial business logic, add or propose Jest + Testing Library tests in `__tests__/` with `*.test.ts`/`*.test.tsx`.

## Commit & Pull Request Guidelines
- Commit history is mixed; use Conventional Commit style going forward: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- Keep commits small and scoped to a single change.
- PRs should include what changed and why, a linked issue/task, screenshots or short recordings for UI changes, and testing notes (platforms checked and lint status).
- Update relevant docs in `docs/` when APIs, hooks, or component behavior changes.
