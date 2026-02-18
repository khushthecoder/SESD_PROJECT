# HealthSync

> **Smart Clinic & Patient Management System** — A full-stack application that digitizes clinic operations with appointment scheduling, prescription management, billing, and real-time notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js + TypeScript |
| **Backend** | Express.js |
| **Database** | PostgreSQL (relational) · MongoDB (documents/logs) |
| **Caching** | Redis |
| **Real-Time** | Socket.io |
| **Auth** | JWT (access + refresh tokens) · RBAC |
| **Frontend** | React.js + TypeScript |
| **Docs** | Swagger / OpenAPI |
| **Containerization** | Docker + Docker Compose |

---

## Architecture

```
Client (React)
   │
   ▼
API Gateway ── Rate Limiter ── Auth Middleware
   │
   ▼
Controllers ─── Input Validation
   │
   ▼
Services ────── Business Logic ── Design Patterns
   │
   ▼
Repositories ── Data Access Layer (abstracted)
   │
   ├──▶ PostgreSQL (Users, Appointments, Billing)
   ├──▶ MongoDB (Medical Records, Audit Logs)
   └──▶ Redis (Sessions, Slot Caching)
```

---

## Project Structure

```
healthsync/
├── src/
│   ├── config/            # DB connections, env, constants
│   ├── controllers/       # Route handlers (thin layer)
│   ├── services/          # Business logic
│   ├── repositories/      # Data access abstraction
│   ├── models/            # TypeScript classes & interfaces
│   │   ├── entities/      # Domain entities (User, Appointment…)
│   │   ├── enums/         # Status enums, roles
│   │   └── interfaces/    # Repository & service contracts
│   ├── middlewares/       # Auth, validation, error handling
│   ├── routes/            # Express route definitions
│   ├── patterns/          # Design pattern implementations
│   │   ├── factory/
│   │   ├── strategy/
│   │   ├── observer/
│   │   └── state/
│   ├── utils/             # Helpers, logger, validators
│   ├── types/             # Global type definitions
│   └── server.ts          # App entry point
├── client/                # React frontend
├── prisma/                # Prisma schema & migrations (PostgreSQL)
├── docker-compose.yml
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## Design Patterns Used

| Pattern | Where & Why |
|---|---|
| **Factory** | `UserFactory` — creates Admin / Doctor / Patient based on role |
| **Strategy** | `NotificationStrategy` — switch between Email, SMS, Push channels |
| **Observer** | `AppointmentObserver` — triggers notifications on status change |
| **State** | `AppointmentState` — manages lifecycle (Scheduled → Completed) |
| **Builder** | `PrescriptionBuilder` — constructs complex prescriptions step-by-step |
| **Repository** | All data access behind interfaces — swap DB without touching services |
| **Singleton** | `DatabaseConnection`, `Logger` — single shared instance |

---

## OOP Principles

- **Encapsulation** — Private fields with controlled access via getters/methods
- **Abstraction** — Abstract `User`, `Appointment` classes; interface contracts for repositories
- **Inheritance** — `Doctor`, `Patient`, `Admin` extend abstract `User`
- **Polymorphism** — Different appointment types override shared behavior

---

## API Modules

| Module | Endpoints | Description |
|---|---|---|
| **Auth** | `/api/v1/auth/*` | Register, Login, Refresh, Logout |
| **Patients** | `/api/v1/patients/*` | CRUD, medical history |
| **Doctors** | `/api/v1/doctors/*` | CRUD, schedule management |
| **Appointments** | `/api/v1/appointments/*` | Book, reschedule, cancel, status updates |
| **Prescriptions** | `/api/v1/prescriptions/*` | Create, view, print |
| **Billing** | `/api/v1/billing/*` | Generate invoices, track payments |
| **Notifications** | `/api/v1/notifications/*` | In-app + real-time via WebSocket |
| **Admin** | `/api/v1/admin/*` | Dashboard, analytics, user management |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<username>/healthsync.git
cd healthsync

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start databases (Docker)
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run migrate` | Run database migrations |

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/healthsync

# MongoDB
MONGODB_URI=mongodb://localhost:27017/healthsync_docs

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

---

