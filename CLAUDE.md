# Virtuoso — AI Fantasy Football Draft Assistant

> A real-time, AI-powered draft assistant that connects to your Sleeper account
> and helps you make smarter picks on draft day.

---

## 1. Project Vision

Fantasy football drafts are won and lost in 60-second windows. Most players rely
on gut instinct or static rankings. Virtuoso changes that by giving you a real-time
AI co-pilot that reads your league's scoring settings, tracks what positions are
disappearing fast, models your roster needs, and explains every recommendation in
plain English.

**Target user:** Competitive fantasy football players who draft on Sleeper and want
a data-driven edge without needing to be statisticians.

**Core value proposition:**

- Connects directly to Sleeper — no manual data entry
- Watches the live draft board in real time
- Recommends picks that fit _your_ roster, _your_ league, and _your_ strategy
- Explains the reasoning behind every suggestion

---

## 2. Current Status

**Phase 4a — Backend Socket Gateway: COMPLETE**
`DraftsModule` polls Sleeper's `GET /draft/{draft_id}/picks` REST endpoint (Sleeper has no
official real-time API — the unofficial `wss://ws.sleeper.app/` was ruled out as too fragile
to build on) every 3 seconds per actively-watched `draftId`, diffs against previously-seen
picks, upserts new ones into `draft_picks`, and relays them to browser clients over a Socket.IO
`/drafts` namespace. Polling is refcounted — one poller per draft, started on first subscriber
and stopped once the last one disconnects. ESLint audit for `client/` also completed (finding:
`dist/` build output wasn't excluded from the flat config, not real lint debt).

**Next step:** Phase 4b — wire the frontend up to `DraftsModule`: `socket.io-client` in React,
`draftSlice` updates on `picks` events, reconnection logic + connection status indicator.

---

## 3. Core Features

### MVP (Phase 1-3)

- [x] Sleeper account connection (email/password signup → link Sleeper username)
- [x] Display user's leagues and upcoming/active drafts
- [ ] Real-time draft board sync (picks update live)
- [ ] Basic player recommendations based on ADP + positional scarcity
- [ ] Available player list with pick suggestions highlighted

### Phase 2 — Smarter Recommendations

- [ ] Scoring-settings-aware projections (PPR vs half-PPR vs standard)
- [ ] Bye week conflict detection and optimization
- [ ] Risk/upside profiles (safe floor picks vs ceiling plays)
- [ ] Positional scarcity warnings ("RBs are flying off the board")
- [ ] ADP value alerts ("this player is going 2 rounds later than expected")

### Phase 3 — AI Intelligence

- [ ] LLM-powered draft chat assistant (ask "why not take X?")
- [ ] AI narrative for each recommendation ("Kelce is the consensus TE1 and...")
- [ ] Draft trend analysis (what's being reached for, what's sliding)
- [ ] Post-draft roster grade and analysis
- [ ] Strategy mode selection (zero-RB, hero-RB, best-available, positional)

---

## 4. Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router v6
- Socket.IO client
- Axios

### Backend

- NestJS 11
- @nestjs/axios
- Socket.IO (gateway)
- TypeORM
- @nestjs/passport
- @nestjs/jwt
- bcrypt
- class-validator
- class-transformer
- @nestjs/config

### Database

- PostgreSQL 16
- Docker Compose
- Adminer

### AI Integration

- Anthropic SDK
- Prompt engineering

### Infrastructure & Tooling

- Docker + Docker Compose
- GitHub Actions
- Prettier
- ESLint
- Husky + lint-staged
- Railway / Render
- Vercel

---

## 5. System Architecture

- React SPA communicates with NestJS via REST + Socket.IO
- NestJS connects to PostgreSQL via TypeORM
- Sleeper REST API provides draft + league data (no official real-time API — draft picks are polled, not pushed)
- Anthropic API generates recommendation explanations and draft chat

**Key data flows:**

1. User signs up with email/password → bcrypt hash stored → JWT issued
2. User links Sleeper account → `POST /auth/link-sleeper` → Sleeper API verifies username → sleeperId stored on User row (first-claim, unique constraint)
3. User logs in with email/password → bcrypt compare → JWT issued
4. User views Dashboard → `GET /leagues` (JWT-protected) → backend fetches from Sleeper API using stored sleeperId → upserts each league into DB → links to user via `user_leagues` join table → returns league list
5. Draft starts → client emits `joinDraft` over Socket.IO → backend's `DraftPollerService` starts polling `GET /draft/{draft_id}/picks` for that draft (refcounted — shared across all clients watching the same draft)
6. Each poll diffs against previously-seen picks (by `pick_no`) → new picks are upserted into `draft_picks` → relayed to all clients in that draft's room via a `picks` Socket.IO event
7. User requests recommendation → backend scores available players, calls Claude for explanation
8. AI response streams back to client

---

## 6. Architecture Decisions

- Monorepo: `client/` + `server/`
- Email/password auth with JWT
- Sleeper account linked separately via `/auth/link-sleeper`
- UUID primary keys
- Single root `.env`
- `ConfigService.getOrThrow()` for required vars
- `synchronize: true` for dev only
- ESLint per package
- Conventional commits
- **League sync strategy:** fetch-and-sync on every Dashboard load (`GET /leagues` upserts from Sleeper into DB). Keeps data fresh; populates `leagues` table for Phase 4 draft subscriptions.
- **`leagueSlice` uses `createAsyncThunk`** — pending/fulfilled/rejected states handled in `extraReducers`, not manual dispatch of `setLoading`/`setLeagues`/`setError`.
- **Season hardcoded to `'2025'`** in `LeaguesService` for development. The constant is in `server/src/modules/leagues/leagues.service.ts` line ~25. Make user-selectable in a later phase.
- **Draft pick sync strategy:** REST polling, not a WebSocket subscription. Sleeper has no official real-time draft API — the community `wss://ws.sleeper.app/` endpoint is unofficial/undocumented and could break without notice, so `DraftPollerService` polls `GET /draft/{draft_id}/picks` every 3s (`DRAFT_POLL_INTERVAL_MS` in `server/src/modules/drafts/draft-poller.service.ts`) instead. One poller runs per actively-watched `draftId`, refcounted by connected/subscribed clients.
- **`DraftPick.player` is nullable**, with a companion `sleeperPlayerId` raw-id column. Pick events only carry Sleeper's `player_id`, and no player-sync job exists yet (Phase 5), so the `player` relation is only populated when a matching `Player` row already exists by `sleeperId` — otherwise it's `null` and `sleeperPlayerId` is relayed to the client as-is.
- **`DraftPick.league` stays required.** If no `League` row matches an incoming pick's `draftId`, that pick is not persisted (logged as a warning) — but it's still relayed live over the socket.

---

## 7. Development Principles

- Build incrementally
- Understand before you copy
- Git discipline
- No secrets in code
- Type safety everywhere
- Test as you build

---

## 8. Phased Roadmap

### Phase 1 — Foundation ✅ COMPLETE

Monorepo structure, Docker Compose (PostgreSQL + Adminer), Prettier, Husky.

---

### Phase 2 — Backend Foundation ✅ COMPLETE

NestJS + TypeORM entities, `SleeperModule` (Sleeper REST API wrapper), `AuthModule` (email/password + JWT + Sleeper account linking).

---

### Phase 3 — Frontend Foundation

#### 3a — Scaffold + Config ✅ COMPLETE

- [x] Vite + React + TypeScript in `client/`
- [x] Tailwind CSS, React Router (`/login`, `/signup`, `/link-sleeper`, `/dashboard`, `/draft/:id`)
- [x] Redux Toolkit store: `authSlice`, `leagueSlice`, `draftSlice`
- [x] Axios service layer wired to NestJS
- [x] ESLint for `client/`

#### 3b — Auth Pages ✅ COMPLETE

- [x] Login page (email/password → JWT → Redux)
- [x] Signup page
- [x] Sleeper Linking page (`POST /auth/link-sleeper`)
- [x] Route guard: `PrivateRoute` redirects unauthenticated → `/login`, unlinked → `/link-sleeper`
- [x] Design system: Poppins font + color palette tokens via Tailwind v4 `@theme`
- [x] `authSlice` localStorage persistence — auth state survives page refresh

#### 3c — Core Pages ✅ COMPLETE

- [x] Dashboard: fetch + display user's leagues (cards with name, season, scoring type, roster count)
- [x] Draft Room: static three-column layout (available players / draft board / roster + AI picks)
- [x] Loading/error states on all async ops (spinner + error message + retry button)
- [x] ESLint audit for `client/`

---

### Phase 4 — Real-Time Draft

#### 4a — Backend Socket Gateway ✅ COMPLETE

- [x] NestJS `@WebSocketGateway` (`DraftsGateway`, `/drafts` namespace) + `DraftPollerService` polling Sleeper's `GET /draft/{draft_id}/picks` (no official real-time API exists — see Architecture Decisions)
- [x] Parse pick events, persist new ones to `draft_picks`, relay to connected clients via a `picks` Socket.IO event

#### 4b — Frontend Live Updates

- [ ] `socket.io-client` in React, `draftSlice` updates on pick events
- [ ] Reconnection logic + connection status indicator

---

### Phase 5 — Recommendation Engine

#### 5a — Backend Scoring

- [ ] `RecommendationService`: score by ADP, positional balance, scarcity, bye weeks, PPR
- [ ] `GET /recommendations?draftId=&pickNumber=` endpoint + unit tests

#### 5b — Frontend Recommendations

- [ ] "Top 3 Picks" component in Draft Room
- [ ] Plain-text explanation from scoring breakdown

---

### Phase 6 — AI Integration

#### 6a — Backend AI

- [ ] `AiModule` with Anthropic SDK
- [ ] `POST /ai/explain-pick` + `POST /ai/chat` (streaming)
- [ ] Prompt caching + rate limiting

#### 6b — Frontend AI

- [ ] "AI Insight" card per recommendation
- [ ] Draft Chat panel (streaming display)

---

### Phase 7 — Deployment

#### 7a — Production Hardening

- [ ] Replace `synchronize: true` with TypeORM migrations
- [ ] Multi-stage Dockerfiles for `server/` and `client/`
- [ ] Production env vars + CORS config

#### 7b — CI/CD + Deploy

- [ ] GitHub Actions: lint → test → build on PRs
- [ ] Deploy backend to Railway/Render, frontend to Vercel
- [ ] Write `README.md`

---

## 9. Current Repository Structure

```
virtuoso/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── SignupPage.tsx
│       │   ├── LinkSleeperPage.tsx
│       │   ├── DashboardPage.tsx
│       │   └── DraftRoomPage.tsx
│       ├── store/
│       │   ├── index.ts        (RootState, AppDispatch)
│       │   ├── authSlice.ts
│       │   ├── leagueSlice.ts  (fetchLeagues thunk)
│       │   └── draftSlice.ts
│       ├── services/
│       │   └── api.ts          (axios instance + login/signup/linkSleeper/getLeagues)
│       └── components/
│           └── PrivateRoute.tsx
├── server/
│   └── src/
│       ├── entities/
│       │   ├── user.entity.ts
│       │   ├── league.entity.ts
│       │   ├── draft-pick.entity.ts
│       │   └── player.entity.ts
│       ├── modules/
│       │   ├── auth/
│       │   ├── sleeper/
│       │   ├── leagues/        (LeaguesModule — GET /leagues)
│       │   └── drafts/         (DraftsModule — DraftsGateway + DraftPollerService)
│       ├── app.module.ts
│       └── main.ts
├── docker/
├── docs/
├── .github/workflows/
```

---

## 10. Known Issues

- **Node version EBADENGINE warning** — `eslint-visitor-keys` requires Node `^20.19.0` or `^22.13.0`; current is `v20.12.0`. Non-blocking — ESLint and all tooling work correctly. Resolve by upgrading Node when convenient.
- **`synchronize: true` in TypeORM** — safe for local dev but must be replaced with migrations before any production deployment (Phase 7).
- **Season hardcoded to `'2025'`** — `LeaguesService.syncAndFetch()` fetches 2025 leagues for development. Change the `year` constant when 2026 leagues are available.

---

## 11. Notes for Claude Code

- This is a learning project. Always explain the _why_ before writing code.
- Break each phase into small, teachable steps.
- Prompt the user to write portions themselves where appropriate.
- Never generate the full application in one shot.
- After each milestone, explain what problem it solved and what comes next.
- When multiple approaches exist, present the tradeoffs before choosing.
- **Auth is email/password** — do not revert to Sleeper-username-only login. Sleeper is a linked account, not the identity provider. The linking endpoint is `POST /auth/link-sleeper` (protected by `JwtGuard`). Login and Sleeper linking are two separate flows — `authSlice` tracks `isSleeperLinked: boolean` to drive routing.
- The root `package.json` is for monorepo tooling only — do not add app dependencies there.
- Docker Compose uses `.env` variable substitution — credentials are never hardcoded.
- **`ConfigService.getOrThrow()`** should be used for required env vars — fails fast at startup with a readable error vs `get()` which silently returns `undefined`.
- **Never return `passwordHash`** from any endpoint — strip it via destructuring before returning user objects.
