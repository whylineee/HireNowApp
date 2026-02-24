# Architecture Overview

## Layers
- `app/`: route-level screens and navigation composition (Expo Router).
- `components/`: reusable UI building blocks and layout primitives.
- `hooks/`: stateful domain logic (favorites, applications, recent searches, preferences, i18n, theme).
- `services/`: data access and API-like adapters.
- `types/`: domain contracts (`User`, `Job`, shared payloads).
- `utils/`: cross-cutting helpers (`storage`).

## State Strategy
- UI state remains local per screen.
- Domain state is module-store based hooks with:
  - in-memory source of truth,
  - listener subscriptions for cross-screen sync,
  - persistence via `utils/storage`.

Current synced domain stores:
- `useFavorites`
- `useApplications`
- `useRecentSearches`
- `useUserPreferences`

## Navigation Strategy
- Stack transitions are enabled globally in `app/_layout.tsx`.
- Top-level product areas use custom `Header` + `BottomNav`.
- Bottom navigation uses `router.replace` to behave like tabs and avoid stack bloat.
- Back navigation uses `Header` logic:
  - prefers explicit callback,
  - falls back to `router.back()`,
  - if no history: `router.replace('/')`.

## UI System
- Tokens live in `constants/theme.ts`.
- Core primitives (`Button`, `Input`, `Card`, `Screen`, `Header`, `BottomNav`) are the only allowed entry points for new screen styling.
- Avoid inline styles for core interactions and avoid duplicating color/spacing constants in screens.

## Localization
- All user-facing strings should come from `locales/en.ts` and `locales/uk.ts`.
- `t(key, params)` supports token interpolation (`{{name}}`, `{{count}}`).

## Extension Rules
- Add new cross-screen state through a dedicated hook in `hooks/` with the same listener + persistence pattern.
- Add new screen sections by composing existing primitives first; introduce new primitives only when reused in 2+ places.
