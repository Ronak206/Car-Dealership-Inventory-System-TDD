# Car Dealership Inventory System – Incubyte TDD Assessment
This project is a full-stack *Car Dealership Inventory System*, built using *Test-Driven Development (TDD)* with Node.js, Express, MongoDB, and React. It is part of the recruitment assessment for the Incubyte Software Craftsperson role.

---

## 🧪 Requirements Covered
This system handles:

**Backend API**
* ✅ User registration → hashes password, rejects duplicate email
* ✅ User login → returns JWT on valid credentials, rejects invalid ones
* ✅ Protected routes → reject requests with missing/invalid token
* ✅ Admin-only routes → reject non-admin users with 403
* ✅ Add a new vehicle → with field validation
* ✅ List all vehicles
* ✅ Search vehicles → by make, model, category, price range (combinable filters)
* ✅ Update vehicle details
* ✅ Delete a vehicle → admin only
* ✅ Purchase a vehicle → atomically decrements quantity, blocks purchase at 0 stock
* ✅ Restock a vehicle → admin only, atomically increments quantity

**Frontend**
* ✅ Registration and login forms
* ✅ Dashboard listing all vehicles
* ✅ Search and filter UI
* ✅ Purchase button → disabled when quantity is 0
* ✅ Admin UI → add, update, delete vehicles

---

## 📁 Project Structure
```
car-dealership/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   ├── config/db.js
│   │   ├── models/            # User.js, Vehicle.js
│   │   ├── controllers/       # authController.js, vehicleController.js, inventoryController.js
│   │   ├── services/          # authService.js, vehicleService.js, inventoryService.js
│   │   ├── middleware/auth.js # verifyToken, requireAdmin
│   │   ├── routes/            # health.js, auth.js, vehicles.js, inventory.js
│   │   └── utils/httpError.js
│   ├── tests/
│   │   ├── setup.js           # Jest setup + mongodb-memory-server bootstrap
│   │   ├── unit/               # middleware + service tests
│   │   └── integration/        # Supertest HTTP flow tests
│   ├── .env.example            # MONGO_URI, JWT_SECRET, PORT template
│   ├── .gitignore
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   └── src/
├── .gitignore
└── README.md                   # This file
```

---

## ⚙ How to Run

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd car-dealership
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, PORT
node src/server.js     # runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:5173
```

### 4. Run backend tests
```bash
cd backend
npm test
```

---

## 🧪 Sample Output
```bash
PASS  tests/integration/health.test.js
PASS  tests/integration/auth.test.js
PASS  tests/integration/vehicles.test.js
PASS  tests/integration/inventory.test.js
PASS  tests/unit/authService.test.js

Test Suites: 5 passed, 5 total
Tests:       28 passed, 28 total
Time:        12.4s
```

---

## 🤖 My AI Usage
AI tools (Claude) were used throughout as a pair-programming assistant — scaffolding tests, debugging environment issues (Jest timeouts, JWT_SECRET in test env, CORS config), and reviewing endpoint design. Every AI-assisted commit includes a `Co-authored-by` trailer.

Verify with:
```bash
git log --grep="Co-authored-by"
```

---

## 👨‍💻 Author
*Ronak*

---

## 🏁 Final Notes
This project demonstrates my understanding of:
* Test-Driven Development (Red-Green-Refactor) across a full backend REST API
* Layered architecture (routes → controllers → services → models)
* Atomic MongoDB operations to prevent race conditions (e.g. inventory purchase)
* JWT-based authentication and role-based authorization
* Honest, transparent AI-assisted development workflow