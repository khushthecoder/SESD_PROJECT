# ER Diagram — HealthSync

## Database: PostgreSQL (Relational Data)

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        varchar phone
        enum role "ADMIN | DOCTOR | RECEPTIONIST | PATIENT"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    PATIENTS {
        uuid id PK
        uuid user_id FK
        date date_of_birth
        enum gender "MALE | FEMALE | OTHER"
        varchar blood_group
        text address
        varchar emergency_contact_name
        varchar emergency_contact_phone
    }

    DOCTORS {
        uuid id PK
        uuid user_id FK
        varchar specialization
        varchar qualification
        int experience_years
        varchar license_number UK
        decimal consultation_fee
        boolean is_available
    }

    DEPARTMENTS {
        uuid id PK
        varchar name UK
        text description
        boolean is_active
    }

    DOCTOR_DEPARTMENTS {
        uuid doctor_id FK
        uuid department_id FK
    }

    SCHEDULES {
        uuid id PK
        uuid doctor_id FK
        enum day_of_week "MON | TUE | WED | THU | FRI | SAT | SUN"
        time start_time
        time end_time
        int slot_duration_minutes
        boolean is_active
    }

    TIME_SLOTS {
        uuid id PK
        uuid schedule_id FK
        date date
        time start_time
        time end_time
        boolean is_available
    }

    APPOINTMENTS {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        uuid time_slot_id FK
        enum type "CONSULTATION | FOLLOW_UP | EMERGENCY"
        enum status "SCHEDULED | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED"
        text reason
        text notes
        varchar cancel_reason
        timestamp created_at
        timestamp updated_at
    }

    PRESCRIPTIONS {
        uuid id PK
        uuid appointment_id FK
        uuid doctor_id FK
        uuid patient_id FK
        text diagnosis
        text notes
        timestamp created_at
    }

    PRESCRIPTION_ITEMS {
        uuid id PK
        uuid prescription_id FK
        varchar medicine_name
        varchar dosage
        varchar frequency
        varchar duration
        text instructions
    }

    MEDICAL_RECORDS {
        uuid id PK
        uuid patient_id FK
        uuid uploaded_by FK
        enum type "PRESCRIPTION | LAB_REPORT | IMAGING | CLINICAL_NOTE"
        varchar title
        text description
        varchar file_url
        timestamp created_at
    }

    BILLINGS {
        uuid id PK
        uuid appointment_id FK
        uuid patient_id FK
        decimal amount
        enum status "PENDING | PAID | OVERDUE | REFUNDED"
        varchar payment_method
        timestamp paid_at
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type "BOOKING_CONFIRMATION | REMINDER | PRESCRIPTION | PAYMENT | GENERAL"
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    %% ══════════════════════════════════════════
    %% RELATIONSHIPS
    %% ══════════════════════════════════════════

    USERS ||--o| PATIENTS : "patient profile"
    USERS ||--o| DOCTORS : "doctor profile"

    DOCTORS ||--o{ SCHEDULES : "has"
    SCHEDULES ||--o{ TIME_SLOTS : "generates"

    DOCTORS }o--o{ DEPARTMENTS : "belongs to"
    DOCTOR_DEPARTMENTS }o--|| DOCTORS : "links"
    DOCTOR_DEPARTMENTS }o--|| DEPARTMENTS : "links"

    PATIENTS ||--o{ APPOINTMENTS : "books"
    DOCTORS ||--o{ APPOINTMENTS : "attends"
    TIME_SLOTS ||--o| APPOINTMENTS : "reserved by"

    APPOINTMENTS ||--o| PRESCRIPTIONS : "has"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_ITEMS : "contains"

    DOCTORS ||--o{ PRESCRIPTIONS : "writes"
    PATIENTS ||--o{ PRESCRIPTIONS : "receives"

    PATIENTS ||--o{ MEDICAL_RECORDS : "has"
    USERS ||--o{ MEDICAL_RECORDS : "uploads"

    APPOINTMENTS ||--o| BILLINGS : "generates"
    PATIENTS ||--o{ BILLINGS : "pays"

    USERS ||--o{ NOTIFICATIONS : "receives"
```

---

## Database: MongoDB (Document Store)

Used for flexible, high-volume, or semi-structured data.

### Collection: `audit_logs`

```json
{
  "_id": "ObjectId",
  "userId": "uuid (ref: users)",
  "action": "CREATE | UPDATE | DELETE | LOGIN | LOGOUT",
  "entity": "appointment | prescription | user | billing",
  "entityId": "uuid",
  "changes": {
    "before": { },
    "after": { }
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "ISODate"
}
```

### Collection: `chat_messages` (Doctor–Patient communication)

```json
{
  "_id": "ObjectId",
  "appointmentId": "uuid",
  "senderId": "uuid",
  "receiverId": "uuid",
  "message": "string",
  "attachments": ["url1", "url2"],
  "isRead": false,
  "sentAt": "ISODate"
}
```

---

## Cache: Redis

| Key Pattern | Value | TTL | Purpose |
|---|---|---|---|
| `slots:{doctorId}:{date}` | JSON array of available slots | 5 min | Avoid repeated slot computation |
| `analytics:{range}` | Dashboard metrics JSON | 15 min | Cache expensive aggregation queries |
| `session:{userId}` | Session metadata | 24 hr | Active session tracking |
| `rate:{ip}` | Request count | 1 min | Rate limiting |

---

## Table Summary

| Table | Rows (Est.) | Key Relationships |
|---|---|---|
| `users` | All users | Parent of patients, doctors |
| `patients` | 1:1 with user | Owns appointments, records, billings |
| `doctors` | 1:1 with user | Owns schedules, appointments, prescriptions |
| `departments` | ~10-20 | Many-to-many with doctors |
| `schedules` | Per doctor per day | Generates time slots |
| `time_slots` | High volume | Reserved by appointments |
| `appointments` | Core entity | Links patient ↔ doctor ↔ slot |
| `prescriptions` | Per appointment | Contains prescription items |
| `prescription_items` | Per prescription | Medicine details |
| `medical_records` | Per patient | Documents and reports |
| `billings` | Per appointment | Payment tracking |
| `notifications` | Per user | Alert delivery |
