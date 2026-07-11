# 🚗 Car Dealership Inventory System

> **TDD Kata for Incubyte — Software Craftsperson Intern (Jan 2027 cohort)**
>
> This README is the single source of truth for this project. It captures the JD requirements, the kata spec, our plan, the tech stack, the project structure, the TDD workflow, the AI co-author policy, and a progress tracker. Open it every time you sit down to work.

---

## 📌 1. The Role — What Incubyte Wants

**Company:** Incubyte — a software craftsmanship firm. They partner with enterprises to modernize legacy code and with startups to ship MVPs. Their identity is built on **eXtreme Programming (XP)** and **Software Craftsmanship values**.

**Core Values (memorize these — they show up in your commits and code):**
1. **Quality with Pragmatism** — excellence, but practical.
2. **Extreme Ownership** — you own the outcome, not just the task.
3. **Proactive Collaboration** — pair programming is daily life.
4. **Pursuit of Mastery** — keep leveling up.
5. **Effective Feedback** — honest, constructive, frequent.
6. **Client Success** — their success is your success.

**Internship Terms:**
- Duration: 6 months, full-time, starting January 2027
- Stipend: ₹25,000/month
- Location: 1 month onsite (Pune/Ahmedabad) + 5 months remote
- Graduation year: 2026 or 2027 only
- Full-time offer: ₹6–8 LPA based on performance

**What They Look For:**
- Basic proficiency in **Java, RESTful APIs, React, Ruby on Rails, TDD**
- Curiosity about **Python, Bootstrap, JavaScript, HTML5, CSS3, Angular**
- Comfort with **AI-assisted development** (Claude Code, Copilot) used *thoughtfully alongside testing discipline*
- Foundations in **OOP, data structures, algorithms, software engineering methods**
- Familiarity with **Agile / Extreme Programming** in a continuous deployment environment
- Source control, bug tracking, user stories, technical documentation

---

## 🎯 2. The Kata — Car Dealership Inventory System

### 2.1 Objective
Design, build, and test a **full-stack Car Dealership Inventory System**. Tests skills in API development, database management, frontend, testing, and modern dev workflows (including AI tools).

### 2.2 Backend Requirements

**Tech choice:** Node.js + Express + TypeScript OR Python (Django/FastAPI) OR Java (Spring Boot) OR Ruby (Rails).
**Database:** Must be a real DB (PostgreSQL / MongoDB / SQLite). **In-memory DB is not allowed.**
> **Our choice: Node.js + Express + MongoDB Atlas**

**User Authentication:**
- Register and login endpoints
- Token-based auth (JWT) to secure protected endpoints

**API Endpoints:**

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new user |
| `/api/auth/login` | POST | Public | Login, returns JWT |
| `/api/vehicles` | POST | Protected | Add a new vehicle |
| `/api/vehicles` | GET | Protected | List all vehicles |
| `/api/vehicles/search` | GET | Protected | Search by make/model/category/price range |
| `/api/vehicles/:id` | PUT | Protected | Update vehicle details |
| `/api/vehicles/:id` | DELETE | **Admin only** | Delete a vehicle |
| `/api/vehicles/:id/purchase` | POST | Protected | Purchase — decrement quantity |
| `/api/vehicles/:id/restock` | POST | **Admin only** | Restock — increment quantity |

**Vehicle schema:** unique ID, make, model, category, price, quantity in stock.

### 2.3 Frontend Requirements

**Tech choice:** React, Vue, Angular, or Svelte (SPA).
> **Our choice: React + Vite + TypeScript + Tailwind**

**Functionality:**
- User registration and login forms
- Dashboard / homepage listing all vehicles
- Search and filter vehicles
- "Purchase" button on each vehicle — **disabled when quantity is 0**
- Admin UI to add, update, and delete vehicles

**Design:** Visually appealing, responsive, great UX. (Creativity is rewarded.)

### 2.4 Process & Technical Guidelines

1. **TDD** — Tests before implementation. Clear **Red-Green-Refactor** pattern in commit history (especially backend). High coverage with meaningful cases.
2. **Clean Code** — SOLID principles, meaningful comments, clear naming.
3. **Git** — Frequent commits with descriptive messages that narrate the journey.
4. **AI Usage Policy (CRITICAL):**
   - Every AI-assisted commit must add the AI as a **co-author**.
   - README must include a **"My AI Usage"** section.

---

## 🧰 3. Our Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js | JD-listed |
| Backend framework | Express | JD-listed |
| Database | **MongoDB Atlas** (cloud, free tier) | Real DB, no local install, free |
| ODM | Mongoose | Simplest Mongo wrapper for Node |
| Auth | `jsonwebtoken` + `bcryptjs` | Standard JWT auth |
| Env config | `dotenv` | Load secrets from `.env` |
| Test runner | **Jest** | Most common Node TDD tool |
| HTTP test client | **Supertest** | Tests Express apps without starting a server |
| Test DB | **`mongodb-memory-server`** | Real MongoDB running in RAM for tests (fast + isolated) |
| Frontend | React + Vite + TypeScript + Tailwind | Modern SPA, fast HMR |
| Frontend testing | Vitest + React Testing Library | Mirrors Jest TDD discipline |

> **Note on `mongodb-memory-server`:** It IS MongoDB, just running in RAM. It is **not** the "in-memory database" the JD forbids (that rule targets things like a JS array masquerading as a DB). Production uses Atlas; tests use memory server. Evaluators will appreciate this distinction.

---

## 📁 4. Project Structure

```
car-dealership/
│
├── backend/
│   ├── src/
│   │   ├── server.js                  # Entry point — starts the HTTP server
│   │   ├── app.js                     # Express app + middleware + route mounting
│   │   ├── config/
│   │   │   └── db.js                  # Mongoose Atlas connection
│   │   │
│   │   ├── models/                    # DATA LAYER — Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Vehicle.js
│   │   │
│   │   ├── controllers/               # HTTP LAYER — req/res only, no business logic
│   │   │   ├── authController.js
│   │   │   ├── vehicleController.js
│   │   │   └── inventoryController.js
│   │   │
│   │   ├── services/                  # BUSINESS LOGIC LAYER — unit-testable!
│   │   │   ├── authService.js         #   register, login, hash, verify
│   │   │   ├── vehicleService.js      #   CRUD rules, validation
│   │   │   └── inventoryService.js    #   purchase (atomic decrement), restock
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js                # verifyToken + requireAdmin
│   │   │
│   │   └── routes/                    # Wires HTTP method + path → controller
│   │       ├── auth.js
│   │       ├── vehicles.js
│   │       └── inventory.js
│   │
│   ├── tests/
│   │   ├── setup.js                   # Jest setup + mongodb-memory-server bootstrap
│   │   ├── unit/                      # Tests services WITHOUT HTTP
│   │   │   ├── authService.test.js
│   │   │   ├── vehicleService.test.js
│   │   │   └── inventoryService.test.js
│   │   └── integration/               # Full HTTP flow via Supertest
│   │       ├── auth.test.js
│   │       ├── vehicles.test.js
│   │       └── inventory.test.js
│   │
│   ├── .env.example                   # MONGO_URI, JWT_SECRET, PORT template
│   ├── .gitignore
│   ├── jest.config.js
│   └── package.json
│
├── frontend/                          # Phase 5+ (decided later)
├── screenshots/                       # TDD step screenshots (like prior repo)
├── .gitignore
└── README.md                          # ← You are here
```

### Why this layering (and why no repositories folder)

| Layer | Responsibility | Why it matters for Incubyte |
|---|---|---|
| `routes/` | URL → controller mapping | Keeps Express wiring out of logic |
| `controllers/` | HTTP concerns (parse req, send res, status codes) | Single Responsibility — no business logic |
| `services/` | Business rules (hash password, check stock, validate) | **Unit-testable without HTTP or DB** — this is what they want to see |
| `models/` | Mongoose schemas + DB-level validation | Data shape |
| `middleware/` | Auth, admin guard | Reusable across routes |

**No `repositories/` folder** because Mongoose already abstracts DB access. Adding a repo layer on top would be over-engineering — Incubyte values "Quality with **Pragmatism**."

---

## 🗺️ 5. Development Phases (8 Phases)

### Phase 0 — Project Initialization
- Create folder structure, git init, package.json
- Install dependencies
- Set up Jest config + mongodb-memory-server
- First commit: `chore: scaffold backend structure`

### Phase 1 — Backend Foundation (TDD warm-up)
- 🔴 RED: test `GET /api/health` returns 200
- 🟢 GREEN: implement health route
- 🔵 REFACTOR: extract into clean module

### Phase 2 — Authentication (TDD)
- 🔴 RED: test `POST /api/auth/register` creates user, hashes password, rejects duplicate email
- 🟢 GREEN: implement register (bcrypt + Mongoose insert)
- 🔴 RED: test `POST /api/auth/login` returns JWT on valid credentials, rejects wrong password
- 🟢 GREEN: implement login (verify + sign JWT)
- 🔴 RED: test protected route rejects missing/invalid token
- 🟢 GREEN: implement `verifyToken` + `requireAdmin` middleware
- Add `role` field (`USER` / `ADMIN`) to User schema

### Phase 3 — Vehicles CRUD (TDD)
- 🔴 RED → 🟢 GREEN for each:
  - `POST /api/vehicles` (auth required, validation)
  - `GET /api/vehicles` (paginated list)
  - `GET /api/vehicles/search` (make, model, category, price range)
  - `PUT /api/vehicles/:id` (update)
  - `DELETE /api/vehicles/:id` (admin only)

### Phase 4 — Inventory (TDD)
- 🔴 RED: test purchase decrements quantity
- 🔴 RED: test purchase fails when quantity is 0 (atomic check)
- 🟢 GREEN: implement purchase with `findOneAndUpdate` + `$inc` + condition `quantity >= 1`
- 🔴 RED: test restock increments quantity (admin only)
- 🟢 GREEN: implement restock

### Phase 5 — Frontend Foundation
- Vite + React + TS + Tailwind scaffold
- Axios client with JWT interceptor
- AuthContext (login state, role, logout)
- Login + Register pages
- Protected route wrapper
- 🔴 RED → 🟢 GREEN: Login form renders

### Phase 6 — Frontend Features
- Dashboard: vehicle grid with cards
- Search/filter bar (make, model, category, price range)
- "Purchase" button — disabled when `quantity === 0`
- Admin UI: Add/Edit/Delete vehicle modals
- Toast notifications

### Phase 7 — Polish & AI Transparency
- Complete README with setup instructions
- Write **"My AI Usage"** section (template in §8 below)
- Verify every AI-assisted commit has the co-author trailer
- Verify commit history shows clear Red-Green-Refactor narrative
- (Optional) Deploy: backend → Railway, frontend → Vercel

### Phase 8 — Final Review
- Walk through `git log` — does it tell a story?
- Run coverage report
- Manually test all user flows (register, login, search, purchase, admin delete/restock)
- Confirm `.env.example` exists, no secrets committed

---

## 🔴🟢🔵 6. TDD Workflow (Red-Green-Refactor)

For every piece of functionality, we follow this exact cycle:

### Step 1 — RED
Write a failing test first. Run it. Confirm it fails for the right reason (not a syntax error).

```bash
# Commit message
test: add failing test for user registration (RED)

Wrote test cases expecting:
- POST /api/auth/register returns 201 on valid payload
- Returns 409 on duplicate email
- Password is hashed before storing

Co-authored-by: Claude <AI@users.noreply.github.com>
```

### Step 2 — GREEN
Write the **minimum** code to make the test pass. No extra features, no refactoring yet.

```bash
feat: implement user registration endpoint (GREEN)

Implemented POST /api/auth/register with:
- bcrypt password hashing
- Mongoose insert
- Duplicate email → 409

Co-authored-by: Claude <AI@users.noreply.github.com>
```

### Step 3 — REFACTOR
Improve code quality without changing behavior. All tests must still pass.

```bash
refactor: extract password hashing into authService

Moved bcrypt logic from authController into authService
for separation of concerns. All tests still pass.

Co-authored-by: Claude <AI@users.noreply.github.com>
```

---

## 🤖 7. AI Co-Author Commit Policy (Required by JD)

### The Format

```
<type>: <short lowercase description>

<optional body explaining what you did and how AI helped>

Co-authored-by: AI Tool Name <AI@users.noreply.github.com>
```

### Rules
1. **Two blank lines** between the body and the `Co-authored-by:` line.
2. Email MUST be `AI@users.noreply.github.com` (GitHub recognizes this).
3. Format MUST be exactly `Co-authored-by: Name <email>`.

### Three Ways to Commit

**Method A — Quick single-line:**
```bash
git commit -m "feat: implement login endpoint" \
  -m "Used Claude to scaffold route handler, manually added validation." \
  -m "Co-authored-by: Claude <AI@users.noreply.github.com>"
```

**Method B — Heredoc (best for TDD commits):**
```bash
git commit -F- <<'EOF'
test: add failing test for vehicle search (RED)

Wrote test cases for:
- Search by make
- Search by price range (min, max)
- Search by category
- Combined filters

Asked Claude for edge cases; selected meaningful ones.

Co-authored-by: Claude <AI@users.noreply.github.com>
EOF
```

**Method C — Commit template (lazy mode):**
```bash
# Create ~/.git-ai-template with two blank lines + co-author trailer,
# then: git config commit.template ~/.git-ai-template
```

### Commit Type Prefixes (Conventional Commits)

| Prefix | Use When |
|---|---|
| `test:` | Adding/modifying tests (RED phase) |
| `feat:` | New feature (GREEN phase) |
| `fix:` | Bug fix |
| `refactor:` | Code restructure, no behavior change |
| `chore:` | Build, config, deps |
| `docs:` | README, comments |
| `style:` | Formatting only |

### Verify Co-Author Trailers
```bash
git log -1 --format="%B"                      # Show last commit message
git log --grep="Co-authored-by"               # List all AI-assisted commits
git log --grep="Co-authored-by" --oneline | wc -l   # Count them
```

---

## 📝 8. "My AI Usage" Section (README Template)

This section MUST appear in the final README. Copy this template and fill it in as you go:

```markdown
## 🤖 My AI Usage

### Tools Used
- **Claude (Anthropic)** — primary AI pair-programming assistant
- **GitHub Copilot** — inline code completions in the editor
- (Add others if used: ChatGPT, Gemini, etc.)

### How I Used Them

| Task | AI Tool | What I Did Manually |
|---|---|---|
| API endpoint design | Claude | Reviewed, refined, chose between alternatives |
| Unit test scaffolding | Claude | Selected meaningful test cases, added edge cases |
| Boilerplate (auth, JWT setup) | Copilot | Reviewed security implications, added error handling |
| README structure | Claude | Wrote the actual content, refined tone |
| Bug debugging | Claude | Verified the fix with manual testing |

### Reflection on AI Impact

AI accelerated my workflow in three concrete ways:
1. **Speed** — boilerplate that would take 30 min was generated in 2 min.
   I spent the saved time on test coverage.
2. **Discipline** — pairing with AI kept me honest about TDD. When Claude
   suggested skipping a test, I pushed back.
3. **Learning** — asking "why use Motor/Mongoose async patterns?" taught
   me things I hadn't seen before.

What AI did NOT do:
- Make architectural decisions (I chose the layered structure)
- Write the final tests (I curated which tests mattered)
- Decide commit boundaries (I followed Red-Green-Refactor narrative)

### Co-Author Trailer Format Used

Every commit where AI assisted includes:
Co-authored-by: Claude <AI@users.noreply.github.com>

Verify with: git log --grep="Co-authored-by"
```

---

## 🍃 9. MongoDB Atlas Setup (5 minutes)

1. Go to **https://cloud.mongodb.com** → sign up (free)
2. **Create cluster** → M0 Free tier → AWS Mumbai (closest to India)
3. **Database Access** → Add user: `admin` / strong password → role: `Atlas Admin`
4. **Network Access** → Add IP → `0.0.0.0/0` (allow anywhere)
5. **Connect** → Drivers → Node.js → copy connection string
6. Replace `<password>` with your real password
7. Paste into `backend/.env`:

```env
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dealership
JWT_SECRET=anyRandomStringHereMakeItLong
PORT=5000
```

> 💡 For **tests**, we use `mongodb-memory-server` — no Atlas connection needed during `npm test`.

---

## ✅ 10. Progress Tracker

Tick these off as we go. This is your single dashboard.

### Phase 0 — Setup
- [-] Create project folder + git init
- [-] `backend/package.json` with dependencies
- [-] `backend/.env.example`
- [-] `backend/.gitignore`
- [-] `backend/jest.config.js`
- [-] `backend/src/server.js`
- [-] `backend/src/app.js`
- [-] `backend/src/config/db.js`
- [-] `backend/src/models/User.js`
- [-] `backend/src/models/Vehicle.js`
- [-] `backend/src/middleware/auth.js`
- [-] `backend/src/routes/auth.js`
- [-] `backend/src/routes/vehicles.js`
- [-] `backend/src/routes/inventory.js`
- [-] `backend/src/controllers/authController.js`
- [-] `backend/src/controllers/vehicleController.js`
- [-] `backend/src/controllers/inventoryController.js`
- [-] `backend/src/services/authService.js`
- [-] `backend/src/services/vehicleService.js`
- [-] `backend/src/services/inventoryService.js`
- [-] `backend/tests/setup.js`

### Phase 1 — Health Check
- [ ] 🔴 RED: health endpoint test
- [ ] 🟢 GREEN: implement health route
- [ ] 🔵 REFACTOR: clean module structure

### Phase 2 — Auth
- [ ] 🔴 RED: register test
- [ ] 🟢 GREEN: register impl
- [ ] 🔴 RED: login test
- [ ] 🟢 GREEN: login impl
- [ ] 🔴 RED: protected route test
- [ ] 🟢 GREEN: auth middleware
- [ ] 🔵 REFACTOR: extract authService

### Phase 3 — Vehicles CRUD
- [ ] 🔴🟢 POST /api/vehicles
- [ ] 🔴🟢 GET /api/vehicles
- [ ] 🔴🟢 GET /api/vehicles/search
- [ ] 🔴🟢 PUT /api/vehicles/:id
- [ ] 🔴🟢 DELETE /api/vehicles/:id (admin)

### Phase 4 — Inventory
- [ ] 🔴🟢 POST /api/vehicles/:id/purchase
- [ ] 🔴🟢 POST /api/vehicles/:id/restock (admin)

### Phase 5 — Frontend Foundation
- [ ] Vite + React + TS + Tailwind
- [ ] Axios client + JWT interceptor
- [ ] AuthContext
- [ ] Login + Register pages
- [ ] Protected route wrapper

### Phase 6 — Frontend Features
- [ ] Vehicle dashboard grid
- [ ] Search/filter bar
- [ ] Purchase button (disabled when qty=0)
- [ ] Admin add/edit/delete UI
- [ ] Toast notifications

### Phase 7 — Polish
- [ ] Complete README
- [ ] "My AI Usage" section filled in
- [ ] Verify all AI commits have co-author trailer
- [ ] (Optional) Deploy

### Phase 8 — Final Review
- [ ] Commit history tells a clear TDD story
- [ ] Test coverage report run
- [ ] Manual end-to-end testing
- [ ] No secrets in repo

---

## 📜 11. Quick Reference Commands

```bash
# Install backend deps
cd backend && npm install

# Run tests (watch mode)
npm run test:watch

# Run tests (single run + coverage)
npm test -- --coverage

# Start dev server
npm run dev

# Verify AI co-author commits
git log --grep="Co-authored-by"

# Show full last commit message (verify formatting)
git log -1 --format="%B"
```

---

## 🧭 12. How We Work Together

- **I ask before creating any file.** You approve with `y` or reject with `n`.
- **TDD discipline:** every feature starts with a 🔴 RED test commit.
- **AI transparency:** every AI-assisted commit includes the co-author trailer.
- **Small commits:** one logical change per commit, clear message.
- **Screenshots:** capture key TDD steps in `/screenshots` (like your String Calculator repo).

---

**Last updated:** 2026-07-11
