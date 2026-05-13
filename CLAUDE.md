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
- Recommends picks that fit *your* roster, *your* league, and *your* strategy
- Explains the reasoning behind every suggestion

---

## 2. Core Features

### MVP (Phase 1-3)
- [ ] Sleeper account connection (username-based lookup, no OAuth needed)
- [ ] Display user's leagues and upcoming/active drafts
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

## 3. Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI component framework |
| TypeScript | Type safety across the entire frontend |
| Vite | Dev server + bundler (faster than Create React App) |
| Tailwind CSS | Utility-first styling — no custom CSS files needed |
| Redux Toolkit | Global state: draft board, user session, recommendations |
| React Router v6 | Client-side routing (Login, Dashboard, Draft Room) |
| Socket.IO client | Real-time draft event updates from the backend |
| Axios | HTTP client for REST API calls |

### Backend
| Tool | Purpose |
|---|---|
| NestJS | TypeScript backend framework with modules/DI/decorators |
| Socket.IO (gateway) | Relay live Sleeper draft events to connected clients |
| TypeORM | ORM for PostgreSQL — entities, migrations, repositories |
| Passport + JWT | Authentication middleware and token strategy |
| class-validator | DTO validation (request body shape checking) |
| @nestjs/config | Environment variable management |

### Database
| Tool | Purpose |
|---|---|
| PostgreSQL | Primary relational database |
| Docker (local) | Run Postgres locally without installing it natively |

### AI Integration
| Tool | Purpose |
|---|---|
| Anthropic SDK | Claude API — recommendation explanations + draft chat |
| Prompt engineering | Structured prompts for consistent, useful AI output |

### Infrastructure & Tooling
| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Containerize app for consistent dev/prod environments |
| GitHub Actions | CI pipeline — lint, test, build on every push |
| ESLint + Prettier | Code style enforcement |
| Husky | Pre-commit hooks to block bad commits |
| Railway / Render | Backend hosting |
| Vercel | Frontend hosting |

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│           React SPA (Vite + TS)                  │
│  Redux Store │ Socket.IO Client │ REST calls      │
└──────────────┬──────────────────┬────────────────┘
               │ REST (HTTPS)     │ WebSocket (WSS)
               ▼                  ▼
┌─────────────────────────────────────────────────┐
│              NestJS Backend                      │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Auth     │  │ REST API │  │ Socket.IO     │  │
│  │ Module   │  │ Modules  │  │ Gateway       │  │
│  │ (JWT)    │  │          │  │               │  │
│  └──────────┘  └──────────┘  └──────┬────────┘  │
│                                     │            │
│  ┌──────────────────────────────────┼──────────┐ │
│  │         Service Layer            │          │ │
│  │  SleeperService │ RecommendationService     │ │
│  │  PlayerService  │ AiService                 │ │
│  └──────────────┬──────────────────┬───────────┘ │
└─────────────────┼──────────────────┼─────────────┘
                  │                  │
       ┌──────────┘          ┌───────┘
       ▼                     ▼
┌─────────────┐    ┌──────────────────┐    ┌───────────────┐
│ PostgreSQL  │    │  Sleeper API     │    │  Claude API   │
│             │    │  (REST + WS)     │    │  (Anthropic)  │
└─────────────┘    └──────────────────┘    └───────────────┘
```

**Key data flows:**
1. User logs in → backend verifies Sleeper username → issues JWT
2. User views their leagues → backend fetches from Sleeper REST API
3. Draft starts → backend subscribes to Sleeper's WebSocket for that draft
4. Sleeper sends pick events → backend relays to browser via Socket.IO
5. User requests recommendation → backend scores available players, calls Claude for explanation
6. AI response streams back to client

---

## 5. Development Principles

### Build incrementally
Every phase ends with working, demonstrable software. No half-finished features
sitting in limbo. If it's in the repo, it works.

### Understand before you copy
When external code (Stack Overflow, docs, AI) is used, the goal is to understand
every line before it gets committed. Unknown code is a liability.

### Git discipline
- Feature branches off `main` (`feature/sleeper-auth`, `fix/draft-board-flicker`)
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- PRs for every feature — even solo, this builds the habit

### No secrets in code
All credentials live in `.env` files that are git-ignored. Production secrets
go in environment variables set on the hosting platform.

### Type safety everywhere
TypeScript strict mode on both client and server. If it compiles, the shape is correct.
Shared types live in a `types/` folder to prevent client/server drift.

### Test as you build
Unit tests for services and utilities. Integration tests for API endpoints.
Don't batch testing to the end — it becomes impossible to catch.

---

## 6. Phased Roadmap

### Phase 1 — Foundation (Week 1-2)
**Goal:** Working dev environment, project structure, Git history starts here.

- [ ] Initialize Git repo, push to GitHub
- [ ] Create monorepo folder structure (`client/`, `server/`, `docker/`, `docs/`)
- [ ] Write `.gitignore` (node_modules, .env, dist, build artifacts)
- [ ] Create `docker-compose.yml` for local PostgreSQL
- [ ] Set up ESLint + Prettier for both client and server
- [ ] Configure Husky pre-commit hooks

**Learning goals:**
- Git branching strategy (trunk-based development vs Gitflow)
- Why monorepos work well for solo/small-team projects
- What `.gitignore` patterns matter and why
- How Docker Compose simplifies local dependencies

---

### Phase 2 — Backend Foundation (Week 2-4)
**Goal:** A running NestJS API with database connectivity and Sleeper data fetching.

- [ ] Scaffold NestJS project in `server/`
- [ ] Configure TypeORM + connect to PostgreSQL
- [ ] Create initial entities: `User`, `League`, `DraftPick`, `Player`
- [ ] Write and run first database migration
- [ ] Build `SleeperModule` — HTTP client wrapping the Sleeper REST API
- [ ] Build `AuthModule` — JWT strategy, login via Sleeper username
- [ ] REST endpoints: `GET /leagues`, `GET /players`, `GET /draft/:id`
- [ ] Add `class-validator` DTOs to all incoming request bodies
- [ ] Write unit tests for `SleeperService`

**Learning goals:**
- NestJS module system and dependency injection
- REST API design: resource naming, HTTP verbs, status codes
- SQL schema design: normalization, relationships, indexes
- What an ORM does and when raw SQL is better
- JWT: what it contains, how it's verified, why it's stateless

---

### Phase 3 — Frontend Foundation (Week 3-5)
**Goal:** A working React app that displays your Sleeper leagues and players.

- [ ] Scaffold Vite + React + TypeScript project in `client/`
- [ ] Configure Tailwind CSS
- [ ] Set up Redux Toolkit store with slices: `authSlice`, `leagueSlice`, `draftSlice`
- [ ] Add React Router: `/login`, `/dashboard`, `/draft/:id`
- [ ] Build Login page: enter Sleeper username → store JWT
- [ ] Build Dashboard page: list user's leagues
- [ ] Build Draft Room page: display draft board (static for now)
- [ ] Wire up Axios service layer to hit the NestJS REST API
- [ ] Add loading/error states to all async operations

**Learning goals:**
- React component architecture: when to split a component
- TypeScript generics (used heavily in Redux Toolkit)
- Redux state shape design: what lives in global vs local state
- The React rendering model and why unnecessary re-renders matter
- Controlled vs uncontrolled components

---

### Phase 4 — Real-Time Draft (Week 5-7)
**Goal:** The draft board updates live as picks are made.

- [ ] Add `socket.io` server-side to NestJS (`@WebSocketGateway`)
- [ ] Build `DraftGateway`: connect to Sleeper's WebSocket for a given draft
- [ ] Parse Sleeper pick events and emit them to connected clients
- [ ] Add `socket.io-client` to React frontend
- [ ] Update `draftSlice` in Redux on incoming socket events
- [ ] Animate pick additions to the draft board UI
- [ ] Handle reconnection logic (user loses WiFi mid-draft)
- [ ] Add "connected" / "reconnecting" status indicator in the UI

**Learning goals:**
- WebSocket protocol vs HTTP: when to use each
- Event-driven architecture: emitters, listeners, rooms
- Race conditions in real-time UIs and how to prevent them
- Why Redux is useful when multiple components react to the same events
- The Sleeper WebSocket API format

---

### Phase 5 — Recommendation Engine (Week 7-9)
**Goal:** The app tells you who to pick and why (algorithmic, before AI is added).

- [ ] Build `RecommendationService` — pure scoring function
- [ ] Factors in initial scoring:
  - [ ] ADP rank vs current pick number (value)
  - [ ] Roster needs by position (positional balance)
  - [ ] How many of a position remain available (scarcity)
  - [ ] Bye week conflicts with already-drafted players
  - [ ] PPR/scoring setting weight adjustments
- [ ] `GET /recommendations?draftId=&pickNumber=` endpoint
- [ ] Frontend: "Top 3 Picks" component in Draft Room UI
- [ ] Plain-text explanation generated from scoring breakdown (no AI yet)
- [ ] Unit test the scoring function with known inputs

**Learning goals:**
- Algorithm design: building and testing a scoring/ranking function
- API contract design: what belongs in query params vs request body
- Pure functions: why the recommendation logic should have no side effects
- Test-driven development: write the test before the function

---

### Phase 6 — AI Integration (Week 9-11)
**Goal:** Claude explains picks in natural language and answers draft questions.

- [ ] Add `AiModule` to NestJS with Anthropic SDK
- [ ] Design system prompt for the draft assistant persona
- [ ] `POST /ai/explain-pick` — Claude narrates a specific recommendation
- [ ] `POST /ai/chat` — streaming chat endpoint for draft Q&A
- [ ] Frontend: "AI Insight" card per recommendation
- [ ] Frontend: Draft Chat panel (streaming response display)
- [ ] Implement prompt caching (reduce API costs on repeated context)
- [ ] Add rate limiting to AI endpoints

**Learning goals:**
- LLM prompt engineering: system prompts, structured context, output format control
- Token efficiency: what goes in context vs what's looked up dynamically
- Streaming responses: server-sent events vs WebSocket for AI output
- AI UX patterns: loading states, streaming text, error fallbacks
- Cost awareness: prompt caching, token counting

---

### Phase 7 — Polish + Deployment (Week 11-13)
**Goal:** The app runs in production and can be shown to anyone.

- [ ] Write multi-stage `Dockerfile` for `server/`
- [ ] Write multi-stage `Dockerfile` for `client/`
- [ ] Update `docker-compose.yml` to orchestrate all three services
- [ ] GitHub Actions workflow: lint → test → build on every PR
- [ ] Deploy backend to Railway or Render
- [ ] Deploy frontend to Vercel
- [ ] Configure production environment variables on each platform
- [ ] Add HTTPS (handled by platforms) and CORS config
- [ ] Write a proper `README.md` (setup steps, env vars, architecture)

**Learning goals:**
- Multi-stage Docker builds: why they reduce image size
- The 12-factor app methodology (env config, stateless processes, etc.)
- CI/CD: what "continuous integration" actually means in practice
- CORS: why it exists, how to configure it correctly
- Production vs development config differences

---

## 7. Folder Structure

```
virtuoso/
├── client/                         # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── DraftBoard/
│   │   │   ├── PlayerCard/
│   │   │   ├── RecommendationPanel/
│   │   │   └── ChatPanel/
│   │   ├── pages/                  # Route-level components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── DraftRoomPage.tsx
│   │   ├── store/                  # Redux Toolkit
│   │   │   ├── index.ts            # Store config
│   │   │   ├── authSlice.ts
│   │   │   ├── leagueSlice.ts
│   │   │   └── draftSlice.ts
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useDraftSocket.ts
│   │   │   └── useRecommendations.ts
│   │   ├── services/               # Axios API wrappers
│   │   │   ├── api.ts              # Axios instance + interceptors
│   │   │   ├── authService.ts
│   │   │   ├── leagueService.ts
│   │   │   └── draftService.ts
│   │   ├── types/                  # TypeScript interfaces
│   │   │   ├── player.ts
│   │   │   ├── draft.ts
│   │   │   └── league.ts
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                         # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/               # JWT strategy, login endpoint
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── sleeper/            # Sleeper API client
│   │   │   │   ├── sleeper.module.ts
│   │   │   │   └── sleeper.service.ts
│   │   │   ├── draft/              # Draft logic + WS gateway
│   │   │   │   ├── draft.module.ts
│   │   │   │   ├── draft.service.ts
│   │   │   │   ├── draft.controller.ts
│   │   │   │   └── draft.gateway.ts
│   │   │   ├── players/
│   │   │   ├── recommendations/
│   │   │   └── ai/                 # Claude API integration
│   │   ├── entities/               # TypeORM database entities
│   │   │   ├── user.entity.ts
│   │   │   ├── league.entity.ts
│   │   │   └── draft-pick.entity.ts
│   │   ├── common/                 # Shared infrastructure
│   │   │   ├── guards/             # Auth guards
│   │   │   ├── interceptors/       # Logging, response shaping
│   │   │   ├── pipes/              # Validation pipes
│   │   │   └── filters/            # Exception filters
│   │   ├── config/                 # Environment config schemas
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── tsconfig.json
│   └── package.json
│
├── docker/
│   ├── Dockerfile.client
│   └── Dockerfile.server
│
├── docs/
│   └── architecture.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml              # Local dev: Postgres + both services
├── .gitignore
├── CLAUDE.md                       # This file
└── README.md
```

---

## 8. Learning Goals by Phase

| Phase | Key Skills |
|---|---|
| 1 — Foundation | Git branching, monorepo structure, dev environment, Docker basics |
| 2 — Backend | REST design, NestJS DI + modules, SQL schema design, TypeORM, JWT |
| 3 — Frontend | React architecture, TypeScript, Redux state design, async UI patterns |
| 4 — Real-Time | WebSocket protocol, event-driven architecture, Socket.IO rooms |
| 5 — Recommendations | Algorithm design, scoring functions, pure functions, TDD |
| 6 — AI | Prompt engineering, streaming, token efficiency, AI UX patterns |
| 7 — Deployment | Docker, CI/CD, 12-factor app, prod/dev config separation |

---

## Notes for Claude Code

- This is a learning project. Always explain the *why* before writing code.
- Break each phase into small, teachable steps.
- Prompt the user to write portions themselves where appropriate.
- Never generate the full application in one shot.
- After each milestone, explain what problem it solved and what comes next.
- When multiple approaches exist, present the tradeoffs before choosing.
