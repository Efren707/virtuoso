# Virtuoso — AI Fantasy Football Draft Assistant

> A real-time, AI-powered draft assistant that connects to your Sleeper account
> and helps you make smarter picks on draft day.

---

## Current Status

**Phase 1 — Foundation: COMPLETE**
The dev environment is fully operational. Git repo initialized, monorepo structure in place,
PostgreSQL running via Docker Compose, and automated code formatting enforced on every commit.

**Next step:** Push to GitHub (if not done), then begin Phase 2 — NestJS backend scaffold.

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

## 3. Features Completed

### Phase 1 — Foundation ✅

- [x] Git repo initialized, `main` as default branch
- [x] Monorepo folder structure created (`client/`, `server/`, `docker/`, `docs/`, `.github/workflows/`)
- [x] `.gitignore` — covers `node_modules`, `.env`, `dist`, build artifacts, OS files
- [x] `docker-compose.yml` — PostgreSQL 16 + Adminer, `.env` variable substitution (no hardcoded credentials)
- [x] `.env.example` — template documenting all required environment variables
- [x] Root `package.json` with Prettier, Husky, lint-staged
- [x] `.prettierrc` — consistent formatting rules across the entire codebase
- [x] Husky pre-commit hook → lint-staged → Prettier on all staged files
- [x] Conventional commit convention established (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)

---

## 4. Current In-Progress Work

Nothing currently in progress. Phase 1 complete, Phase 2 not yet started.

**Pending GitHub push** (last Phase 1 item):

```bash
git remote add origin https://github.com/YOUR_USERNAME/virtuoso.git
git push -u origin main
```

---

## 5. Tech Stack

### Frontend

| Tool             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| React 18         | UI component framework                                   |
| TypeScript       | Type safety across the entire frontend                   |
| Vite             | Dev server + bundler (faster than Create React App)      |
| Tailwind CSS     | Utility-first styling — no custom CSS files needed       |
| Redux Toolkit    | Global state: draft board, user session, recommendations |
| React Router v6  | Client-side routing (Login, Dashboard, Draft Room)       |
| Socket.IO client | Real-time draft event updates from the backend           |
| Axios            | HTTP client for REST API calls                           |

### Backend

| Tool                | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| NestJS              | TypeScript backend framework with modules/DI/decorators |
| Socket.IO (gateway) | Relay live Sleeper draft events to connected clients    |
| TypeORM             | ORM for PostgreSQL — entities, migrations, repositories |
| Passport + JWT      | Authentication middleware and token strategy            |
| class-validator     | DTO validation (request body shape checking)            |
| @nestjs/config      | Environment variable management                         |

### Database

| Tool           | Purpose                                             |
| -------------- | --------------------------------------------------- |
| PostgreSQL 16  | Primary relational database                         |
| Docker Compose | Run Postgres locally without installing it natively |
| Adminer        | Lightweight DB browser UI at localhost:8080         |

### AI Integration

| Tool               | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| Anthropic SDK      | Claude API — recommendation explanations + draft chat |
| Prompt engineering | Structured prompts for consistent, useful AI output   |

### Infrastructure & Tooling

| Tool                    | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| Docker + Docker Compose | Containerize app for consistent dev/prod environments |
| GitHub Actions          | CI pipeline — lint, test, build on every push         |
| Prettier                | Code formatting enforced on commit                    |
| ESLint                  | Per-package linting (added in Phase 2 + 3)            |
| Husky + lint-staged     | Pre-commit hooks to auto-format and block bad commits |
| Railway / Render        | Backend hosting (Phase 7)                             |
| Vercel                  | Frontend hosting (Phase 7)                            |

---

## 6. System Architecture

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

## 7. Architecture Decisions

| Decision         | Choice                                 | Reason                                                        |
| ---------------- | -------------------------------------- | ------------------------------------------------------------- |
| Backend language | NestJS (TypeScript)                    | Same language as frontend; modern DI pattern; large ecosystem |
| Repo layout      | Monorepo                               | Simpler for solo project; frontend/backend change together    |
| Local DB         | Docker Compose                         | No native install needed; reproducible across machines        |
| Credentials      | `.env` + variable substitution         | Never commit secrets; `.env.example` documents required vars  |
| Formatting       | Prettier (not ESLint formatting rules) | Prettier is non-negotiable style; ESLint handles correctness  |
| ESLint scope     | Per-package (not root)                 | React and NestJS need different ESLint rule sets              |
| Commit style     | Conventional commits                   | Readable history; enables changelog generation later          |

---

## 8. Development Principles

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

### Test as you build

Unit tests for services and utilities. Integration tests for API endpoints.
Don't batch testing to the end — it becomes impossible to catch.

---

## 9. Phased Roadmap

### Phase 1 — Foundation ✅ COMPLETE

**Goal:** Working dev environment, project structure, Git history starts here.

- [x] Initialize Git repo, push to GitHub
- [x] Create monorepo folder structure (`client/`, `server/`, `docker/`, `docs/`)
- [x] Write `.gitignore`
- [x] Create `docker-compose.yml` for local PostgreSQL + Adminer
- [x] Set up Prettier + lint-staged at root level
- [x] Configure Husky pre-commit hooks

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
- [ ] Add ESLint to `server/` with NestJS-appropriate rules

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
- [ ] Add ESLint to `client/` with React + TypeScript rules

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

---

### Phase 5 — Recommendation Engine (Week 7-9)

**Goal:** The app tells you who to pick and why (algorithmic, before AI is added).

- [ ] Build `RecommendationService` — pure scoring function
- [ ] Factors: ADP value, positional balance, scarcity, bye weeks, PPR weighting
- [ ] `GET /recommendations?draftId=&pickNumber=` endpoint
- [ ] Frontend: "Top 3 Picks" component in Draft Room UI
- [ ] Plain-text explanation from scoring breakdown (no AI yet)
- [ ] Unit test the scoring function with known inputs

**Learning goals:**

- Algorithm design: building and testing a scoring/ranking function
- Pure functions: why recommendation logic should have no side effects
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
- Streaming responses: server-sent events vs WebSocket for AI output
- Cost awareness: prompt caching, token counting

---

### Phase 7 — Polish + Deployment (Week 11-13)

**Goal:** The app runs in production and can be shown to anyone.

- [ ] Multi-stage `Dockerfile` for `server/` and `client/`
- [ ] GitHub Actions: lint → test → build on every PR
- [ ] Deploy backend to Railway or Render
- [ ] Deploy frontend to Vercel
- [ ] Production environment variables + CORS config
- [ ] Write `README.md` with setup steps

**Learning goals:**

- Multi-stage Docker builds: why they reduce image size
- CI/CD: what "continuous integration" means in practice
- The 12-factor app methodology

---

## 10. Repository Structure

### Current (Phase 1 complete)

```
virtuoso/
├── client/                    # React frontend (empty — Phase 3)
├── server/                    # NestJS backend (empty — Phase 2)
├── docker/                    # Dockerfiles (empty — Phase 7)
├── docs/                      # Architecture docs (empty)
├── .github/
│   └── workflows/             # CI pipelines (empty — Phase 7)
├── .husky/
│   └── pre-commit             # Runs lint-staged on commit
├── .env                       # Local secrets (gitignored)
├── .env.example               # Secret template (committed)
├── .gitignore
├── .prettierrc                # Formatting rules
├── CLAUDE.md
├── docker-compose.yml         # PostgreSQL + Adminer for local dev
└── package.json               # Root: Prettier, Husky, lint-staged only
```

### Target (Phase 7 complete)

```
virtuoso/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── components/             # DraftBoard, PlayerCard, RecommendationPanel, ChatPanel
│   │   ├── pages/                  # LoginPage, DashboardPage, DraftRoomPage
│   │   ├── store/                  # authSlice, leagueSlice, draftSlice
│   │   ├── hooks/                  # useDraftSocket, useRecommendations
│   │   ├── services/               # api.ts, authService, leagueService, draftService
│   │   └── types/                  # player.ts, draft.ts, league.ts
│   └── package.json
├── server/                         # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/               # JWT strategy + login
│   │   │   ├── sleeper/            # Sleeper API client
│   │   │   ├── draft/              # Draft logic + WS gateway
│   │   │   ├── players/
│   │   │   ├── recommendations/
│   │   │   └── ai/                 # Claude API integration
│   │   ├── entities/               # TypeORM entities
│   │   └── common/                 # Guards, interceptors, pipes, filters
│   └── package.json
├── docker/
│   ├── Dockerfile.client
│   └── Dockerfile.server
├── .github/workflows/ci.yml
├── docker-compose.yml
└── package.json
```

---

## 11. Important Commands

### Database

```bash
docker compose up -d          # Start PostgreSQL + Adminer in background
docker compose down           # Stop and remove containers
docker compose ps             # Check container status
docker compose logs postgres  # View Postgres logs
```

Adminer (DB browser UI): http://localhost:8080

- Server: `postgres` | User: `virtuoso` | Password: from `.env` | DB: `virtuoso`

### Git workflow

```bash
git checkout -b feature/your-feature   # Create feature branch
git add <files>                        # Stage specific files
git commit -m "feat: description"      # Commit with conventional prefix
git push -u origin feature/your-feature
```

### Root tooling

```bash
npm install                   # Install root dev dependencies
npx prettier --write .        # Manually format all files
```

---

## 12. Learning Goals by Phase

| Phase               | Key Skills                                                            |
| ------------------- | --------------------------------------------------------------------- |
| 1 — Foundation ✅   | Git branching, monorepo structure, dev environment, Docker basics     |
| 2 — Backend         | REST design, NestJS DI + modules, SQL schema design, TypeORM, JWT     |
| 3 — Frontend        | React architecture, TypeScript, Redux state design, async UI patterns |
| 4 — Real-Time       | WebSocket protocol, event-driven architecture, Socket.IO rooms        |
| 5 — Recommendations | Algorithm design, scoring functions, pure functions, TDD              |
| 6 — AI              | Prompt engineering, streaming, token efficiency, AI UX patterns       |
| 7 — Deployment      | Docker, CI/CD, 12-factor app, prod/dev config separation              |

---

## 13. Known Issues

None currently.

---

## 14. Next Recommended Steps

1. **Push to GitHub** (if not done):

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/virtuoso.git
   git push -u origin main
   ```

2. **Begin Phase 2 — Backend Foundation:**
   - Create a feature branch: `git checkout -b feature/nestjs-scaffold`
   - Scaffold NestJS inside `server/`: `cd server && npx @nestjs/cli new . --skip-git`
   - Connect NestJS to the running PostgreSQL container via TypeORM
   - Build the first module: `SleeperModule` to fetch user leagues from Sleeper's public API

---

## 15. Notes for Claude Code

- This is a learning project. Always explain the _why_ before writing code.
- Break each phase into small, teachable steps.
- Prompt the user to write portions themselves where appropriate.
- Never generate the full application in one shot.
- After each milestone, explain what problem it solved and what comes next.
- When multiple approaches exist, present the tradeoffs before choosing.
- ESLint is **not yet configured** — it will be added per-package in Phase 2 (server) and Phase 3 (client).
- The root `package.json` is for monorepo tooling only — do not add app dependencies there.
- Docker Compose uses `.env` variable substitution — credentials are never hardcoded.

---

## 16. Session Summary — Latest Changes

### Session 1 (Phase 1 — Foundation)

**Completed:**

- Initialized Git repo, set `main` as default branch
- Created monorepo folder structure with `.gitkeep` placeholders
- Wrote `.gitignore` covering `node_modules`, `.env`, build output, OS files
- Created `docker-compose.yml` with PostgreSQL 16 + Adminer
- Updated docker-compose to use `.env` variable substitution after user correctly identified hardcoded credentials as a bad practice
- Created `.env.example` as a committed secret template
- Initialized root `package.json` with Prettier, Husky, lint-staged
- Configured `.prettierrc` (semi, singleQuote, trailingComma: all, printWidth: 100)
- Wired Husky pre-commit hook to run lint-staged
- Verified Docker containers run and Adminer is accessible at localhost:8080
- Made 4 commits following conventional commit format

**Key lessons from this session:**

- Git does not track empty folders — use `.gitkeep`
- Docker Compose reads `.env` automatically — use `${VAR}` substitution
- Prettier's `trailingComma: "all"` reduces noisy Git diffs
- `lint-staged` scans only staged files — much faster than linting the whole project
- ESLint and Prettier serve different purposes — don't conflate them
