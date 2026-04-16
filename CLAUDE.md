# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (port 5173)
npm run build      # Type-check with vue-tsc, then bundle with Vite
npm run preview    # Preview production build
```

No lint or test scripts are configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in:

```
VITE_AUTH_URL=https://dev.clipp.app/api/auth/auth
VITE_BOT_API_BASE=https://dev.clipp.app/api/bot
VITE_BOT_TOKEN=   # optional static token
```

## Architecture

Vue 3 + TypeScript admin dashboard for managing chatbot configurations (Telegram, WhatsApp, Zendesk). Uses Composition API throughout.

### HTTP Layer (`src/http/axios.ts`)

Two Axios instances with interceptors:
- `authHttp` — used for login, attaches `DEVICE_ID` and `APPLICATION_ID` headers
- `botHttp` — used for all bot API calls, attaches JWT token from Pinia store on every request

### State Management (`src/stores/`)

Pinia stores:
- `auth.store.ts` — JWT token + decoded user profile, persisted to localStorage
- `bots.store.ts` — bot list, selected bot, active config hash; `selectBot()` fetches full bot detail

### Module Structure (`src/modules/`)

Feature modules contain views, components, and services co-located:
- `auth/` — LoginView + auth.service (login API call)
- `bots/` — BotsView (list), BotDetail, HashEditor (drag-and-drop config editor) + bots.service

### Bot Config Editor Flow

1. `BotsView` lists bots; clicking one calls `botsStore.selectBot()`
2. `BotDetail` renders the selected bot's configuration via `HashEditor`
3. `HashEditor` uses `vue-draggable-plus` to let users reorder fields within categories
4. Saving calls `botsStore.saveHash()` → `botsService.updateBotHash()` → PATCH to API

### Types (`src/types/bot.types.ts`)

`BotField` defines field metadata (name, label, type, category, color). Categories: Identity, URLs, Images, Configuration, Vehicle & Payment, Complex fields. Each category has a distinct Tailwind color class.

### Routing (`src/router/index.ts`)

- `/login` — public, redirects to `/` if already authenticated
- `/` — requires auth (checked via `auth.store` token), renders `MainLayout` with `BotsView` as child
- Catch-all redirects to `/`

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Styling

Tailwind CSS with custom theme extensions in `tailwind.config.js`:
- Brand colors: `brand-*` (indigo-based palette)
- Dark UI colors: `dark-900`, `dark-800`, `dark-700`, `dark-600`
- Custom font: Inter
- Custom shadow: `glass`
