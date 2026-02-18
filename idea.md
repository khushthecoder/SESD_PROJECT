# HealthSync — Smart Clinic & Patient Management System

## Problem Statement

Small to mid-sized clinics still rely on manual appointment registers, paper prescriptions, and disconnected billing. This leads to scheduling conflicts, lost patient history, delayed follow-ups, and zero visibility into clinic performance. There is no affordable, unified digital solution tailored for independent clinics.

## Solution

**HealthSync** is a full-stack web application that digitizes end-to-end clinic operations — from patient registration and doctor scheduling to appointment booking, prescription management, billing, and real-time notifications — all under a single platform with role-based access control.

---

## Scope

| In Scope | Out of Scope (v1) |
|---|---|
| Patient & Doctor management (CRUD) | Telemedicine / video consultation |
| Appointment booking with slot management | Insurance claim processing |
| Prescription creation & medical records | Lab integration / LIMS |
| Billing & invoice generation | Mobile app (React Native) |
| Real-time notifications (WebSocket) | Multi-clinic / franchise support |
| Role-based access (Admin, Doctor, Receptionist, Patient) | AI-based diagnosis |
| Admin analytics dashboard | |
| Audit trail / activity logging | |

---

## Key Features

### 1. Multi-Role Authentication & Authorization
- JWT-based auth with access + refresh tokens
- Role-Based Access Control (RBAC): **Admin**, **Doctor**, **Receptionist**, **Patient**
- Secure password hashing (bcrypt), rate limiting on auth endpoints

### 2. Patient Module
- Patient registration with demographics, medical history, emergency contacts
- View appointment history, prescriptions, and billing records
- Self-service appointment booking via patient portal

### 3. Doctor Module
- Doctor profiles with specializations, qualifications, consultation fees
- Weekly schedule management with configurable time slots
- View today's appointments, patient history during consultation

### 4. Appointment Engine
- Real-time slot availability checking
- Book, reschedule, and cancel appointments
- Appointment lifecycle with state machine: `Scheduled → Confirmed → In Progress → Completed → Cancelled`
- Automatic conflict detection (no double-booking)

### 5. Prescription & Medical Records
- Doctors create prescriptions during/after appointments
- Builder pattern for constructing complex prescriptions (medicines, dosage, frequency, duration)
- Medical record storage with document upload support
- Patient-accessible prescription history

### 6. Billing & Payments
- Auto-generate invoices from completed appointments
- Strategy pattern for billing: consultation fee, procedure-based, package deals
- Payment status tracking (Pending → Paid → Overdue)
- Payment history and receipt generation

### 7. Notification System
- Observer pattern: appointment status changes → trigger notifications
- Strategy pattern: deliver via Email, SMS, or In-App (WebSocket)
- Appointment reminders, booking confirmations, prescription alerts

### 8. Admin Dashboard
- Clinic-wide analytics: daily appointments, revenue, doctor utilization
- User management (approve/suspend accounts)
- Department management
- Audit log viewer (who did what, when)

---

## Tech Stack

| Component | Technology |
|---|---|
| **Language** | TypeScript |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Relational DB** | PostgreSQL (via Prisma ORM) |
| **Document DB** | MongoDB (via Mongoose) |
| **Cache** | Redis |
| **Real-Time** | Socket.io |
| **Frontend** | React.js + TypeScript |
| **Auth** | JWT + bcrypt |
| **API Docs** | Swagger / OpenAPI |
| **Containers** | Docker + Docker Compose |
| **Testing** | Jest + Supertest |

---

## Backend Architecture

```
┌─────────────────────────────────────────────┐
│                 Client (React)              │
└──────────────────┬──────────────────────────┘
                   │ HTTP / WebSocket
┌──────────────────▼──────────────────────────┐
│              API Gateway Layer              │
│   Rate Limiter · CORS · Request Logger      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Middleware Layer                   │
│   Auth (JWT) · RBAC · Input Validation      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Controller Layer                  │
│   Thin handlers — delegates to services     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            Service Layer                    │
│   Business logic · Design patterns live here│
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Repository Layer                   │
│   Data access abstraction (interface-based) │
└───┬──────────────┬─────────────┬────────────┘
    │              │             │
    ▼              ▼             ▼
PostgreSQL     MongoDB        Redis
(structured)   (documents)   (cache)
```

---

## Design Patterns

| Pattern | Usage |
|---|---|
| **Factory** | `UserFactory` creates role-specific user instances; `AppointmentFactory` creates consultation / follow-up / emergency types |
| **Strategy** | Interchangeable notification channels (Email, SMS, Push); flexible billing strategies |
| **Observer** | Appointment status changes emit events → NotificationService, AuditLogService listen and react |
| **State** | Appointment objects transition through well-defined states with allowed transitions enforced |
| **Builder** | `PrescriptionBuilder` — fluent API to construct prescriptions with medicines, dosage, notes |
| **Repository** | All data access behind `IRepository<T>` interface — services never touch raw DB queries |
| **Singleton** | Database connection pools, Logger instance, Config loader |

---

## OOP Principles Demonstrated

- **Encapsulation** — Domain entities hide internal state; expose controlled methods
- **Abstraction** — Abstract `User` class; interfaces like `INotificationStrategy`, `IRepository<T>`
- **Inheritance** — `Doctor`, `Patient`, `Admin`, `Receptionist` extend `User`; `Consultation`, `FollowUp`, `Emergency` extend `Appointment`
- **Polymorphism** — Services interact with `User` / `Appointment` references; concrete behavior varies by subclass
