# Sequence Diagram — HealthSync

## Main Flow: Patient Books an Appointment (End-to-End)

This sequence covers the complete flow from patient login → slot search → appointment booking → notification delivery.

```mermaid
sequenceDiagram
    actor Patient
    participant Frontend as React Frontend
    participant API as API Gateway
    participant Auth as Auth Middleware
    participant AC as AppointmentController
    participant AS as AppointmentService
    participant SF as SlotFinder
    participant AR as AppointmentRepository
    participant DB as PostgreSQL
    participant Obs as Observer/EventEmitter
    participant NS as NotificationService
    participant WS as WebSocket Server
    participant Cache as Redis Cache

    %% ── Authentication ──
    Note over Patient, Cache: 1. Authentication
    Patient->>Frontend: Enter credentials
    Frontend->>API: POST /api/v1/auth/login
    API->>Auth: Validate credentials
    Auth->>DB: Query user by email
    DB-->>Auth: User record
    Auth->>Auth: Verify password (bcrypt)
    Auth-->>API: Generate JWT (access + refresh)
    API-->>Frontend: 200 OK { accessToken, refreshToken }
    Frontend->>Frontend: Store tokens

    %% ── Search Available Slots ──
    Note over Patient, Cache: 2. Search Available Slots
    Patient->>Frontend: Select department + doctor + date
    Frontend->>API: GET /api/v1/doctors/:id/slots?date=2026-02-20
    API->>Auth: Verify JWT
    Auth-->>API: Authorized
    API->>AC: getAvailableSlots(doctorId, date)
    AC->>AS: findAvailableSlots(doctorId, date)
    AS->>Cache: Check cached slots
    alt Cache HIT
        Cache-->>AS: Cached slot data
    else Cache MISS
        AS->>SF: calculateSlots(doctorId, date)
        SF->>AR: getSchedule(doctorId, dayOfWeek)
        AR->>DB: SELECT schedule + booked slots
        DB-->>AR: Schedule + existing appointments
        AR-->>SF: Raw data
        SF->>SF: Compute free slots (exclude booked)
        SF-->>AS: Available TimeSlot[]
        AS->>Cache: Cache slots (TTL: 5 min)
    end
    AS-->>AC: Available TimeSlot[]
    AC-->>API: 200 OK { slots: [...] }
    API-->>Frontend: Slot list
    Frontend-->>Patient: Display available slots

    %% ── Book Appointment ──
    Note over Patient, Cache: 3. Book Appointment
    Patient->>Frontend: Select slot + enter visit reason
    Frontend->>API: POST /api/v1/appointments
    API->>Auth: Verify JWT + RBAC (Patient role)
    Auth-->>API: Authorized
    API->>AC: createAppointment(dto)
    AC->>AC: Validate input (class-validator)
    AC->>AS: bookAppointment(patientId, doctorId, slotId, reason)

    AS->>AR: checkSlotAvailability(slotId)
    AR->>DB: SELECT slot WHERE id = slotId AND is_available = true
    DB-->>AR: Slot record

    alt Slot Available
        AS->>AS: AppointmentFactory.create("consultation")
        AS->>AS: appointment.setState(ScheduledState)
        AS->>AR: save(appointment)
        AR->>DB: BEGIN TRANSACTION
        AR->>DB: INSERT appointment
        AR->>DB: UPDATE time_slot SET is_available = false
        AR->>DB: COMMIT
        DB-->>AR: Appointment created (id: 42)
        AR-->>AS: Saved appointment

        %% ── Invalidate cache ──
        AS->>Cache: Invalidate slot cache for doctor+date

        %% ── Observer Pattern: Notify ──
        AS->>Obs: emit("appointment.created", appointment)
        Obs->>NS: onAppointmentCreated(appointment)
        NS->>NS: strategy.selectChannel(user.preferences)

        par Email Notification
            NS->>NS: EmailStrategy.send(patient, details)
        and In-App Notification
            NS->>DB: INSERT notification record
            NS->>WS: Push real-time event to patient
            WS-->>Frontend: WebSocket event
            Frontend-->>Patient: Appointment confirmed!
        end

        AS-->>AC: Appointment details
        AC-->>API: 201 Created { appointment }
        API-->>Frontend: Success response
        Frontend-->>Patient: Show confirmation screen
    else Slot Already Taken
        AS-->>AC: Throw ConflictException
        AC-->>API: 409 Conflict
        API-->>Frontend: Error: slot unavailable
        Frontend-->>Patient: Show error + refresh slots
    end
```

---

## Secondary Flow: Doctor Writes a Prescription

```mermaid
sequenceDiagram
    actor Doctor
    participant Frontend as React Frontend
    participant API as API Gateway
    participant PC as PrescriptionController
    participant PS as PrescriptionService
    participant PB as PrescriptionBuilder
    participant PR as PrescriptionRepository
    participant DB as PostgreSQL
    participant Obs as Observer/EventEmitter
    participant NS as NotificationService

    Doctor->>Frontend: Open appointment → Start consultation
    Frontend->>API: PATCH /api/v1/appointments/:id/status {status: "in_progress"}
    API-->>Frontend: 200 OK

    Doctor->>Frontend: Fill prescription form
    Frontend->>API: POST /api/v1/prescriptions
    API->>PC: createPrescription(dto)
    PC->>PS: buildPrescription(appointmentId, data)

    %% Builder Pattern
    PS->>PB: new PrescriptionBuilder()
    PS->>PB: .setPatient(patientId)
    PS->>PB: .setDoctor(doctorId)
    PS->>PB: .setDiagnosis("Acute Bronchitis")
    PS->>PB: .addMedicine("Amoxicillin", "500mg", "3x/day", "7 days")
    PS->>PB: .addMedicine("Cough Syrup", "10ml", "2x/day", "5 days")
    PS->>PB: .setNotes("Follow up in 1 week")
    PS->>PB: .build()
    PB-->>PS: Prescription object

    PS->>PR: save(prescription)
    PR->>DB: INSERT prescription + prescription_items
    DB-->>PR: Saved
    PR-->>PS: Prescription (id: 78)

    %% Notify patient
    PS->>Obs: emit("prescription.created", prescription)
    Obs->>NS: onPrescriptionCreated(prescription)
    NS->>NS: Send notification to patient

    PS-->>PC: Prescription details
    PC-->>API: 201 Created { prescription }
    API-->>Frontend: Success
    Frontend-->>Doctor: Prescription saved ✓
```

---

## Tertiary Flow: Admin Views Analytics

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend as React Frontend
    participant API as API Gateway
    participant Auth as Auth Middleware
    participant ADC as AdminController
    participant ADS as AnalyticsService
    participant Cache as Redis Cache
    participant DB as PostgreSQL

    Admin->>Frontend: Navigate to Dashboard
    Frontend->>API: GET /api/v1/admin/analytics?range=7d
    API->>Auth: Verify JWT + RBAC (Admin role)
    Auth-->>API: Authorized
    API->>ADC: getAnalytics(dateRange)
    ADC->>ADS: computeAnalytics(startDate, endDate)

    ADS->>Cache: Check cached analytics
    alt Cache HIT
        Cache-->>ADS: Cached analytics
    else Cache MISS
        ADS->>DB: COUNT appointments GROUP BY status
        ADS->>DB: SUM billing.amount WHERE paid
        ADS->>DB: COUNT appointments GROUP BY doctor_id
        DB-->>ADS: Raw aggregation data
        ADS->>ADS: Transform into dashboard metrics
        ADS->>Cache: Cache result (TTL: 15 min)
    end

    ADS-->>ADC: AnalyticsDTO
    ADC-->>API: 200 OK { analytics }
    API-->>Frontend: Dashboard data
    Frontend-->>Admin: Render charts + KPI cards
```
