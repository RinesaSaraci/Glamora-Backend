# Glamora Backend API

Glamora është një platformë e menaxhimit të saloneve të bukurisë, e ndërtuar mbi arkitekturën **multi-tenant**. Backend-i ekspozon një REST API të plotë që shërben si bazë për klientin React.

---

## Stack teknologjik

| Kategoria | Teknologjia |
|-----------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Prisma (Code First) |
| Database | PostgreSQL |
| Cache | Redis — Upstash |
| AI / LLM | Groq API (llama-3.3-70b-versatile) |
| Auth | JWT |
| Email | Nodemailer (Gmail) |
| Logging | Morgan |
| Dokumentim API | Swagger UI → `/api-docs` |
| Testim | Jest + Supertest |
| CI/CD | GitHub Actions |

---

## Arkitektura

Sistemi ndjek ndarjen e plotë **Klient ↔ Server**. Të dy anët janë repo të pavarura dhe komunikojnë vetëm nëpërmjet HTTP/REST.

```
Client (React + Vite)
        ↕  REST API
Express Server
    ├── Middleware  →  Morgan (logging), JWT (auth), Role, verifySalonOwnership
    ├── Routes → Controllers → Services
    ├── Prisma ORM  →  PostgreSQL
    ├── Redis Cache  →  Upstash
    ├── AI Service  →  Groq LLM API
    └── Email Job  →  Nodemailer (background)
```

---

## Modelet e databazës (20)

Skema ndahet në gjashtë grupe funksionale:

**Tenancy & Përdoruesit**
- `Tenant` — organizata që zotëron salona
- `User` — përdoruesit me role: `USER · ADMIN · OWNER · SUPERADMIN`

**Saloni & Shërbimet**
- `Salon` — saloni i bukurisë, i lidhur me tenant dhe owner
- `Category` — kategorive të shërbimeve (p.sh. Flokë, Spa, Nail Art)
- `Service` — shërbim specifik me çmim dhe kohëzgjatje
- `Product` — produkte kozmetike të shituara në salon

**Punonjësit**
- `Employee` — punonjës i lidhur me salonin
- `EmployeeService` — shumë-me-shumë: cilët shërbime bën secili punonjës
- `WorkingHour` — orari javor i secilit punonjës

**Rezervimet**
- `Reservation` — rezervim me status: `PENDING · CONFIRMED · CANCELLED · COMPLETED`
- `Waitlist` — listë pritëse kur slot-et janë të zëna
- `Review` — vlerësim 1–5 yje pas rezervimit të kompletuar

**Financat**
- `Invoice` — faturë e lidhur me rezervimin
- `Payment` — pagesa: `CASH · CARD · ONLINE`
- `Promotion` — oferta me kod zbritjeje (`PERCENTAGE` ose `FIXED`)
- `GiftCard` — kartë dhuratë me kod unik dhe vlerë të mbetur

**Sistemi**
- `Notification` — njoftime për përdoruesin
- `AuditLog` — regjistrim i veprimeve të rëndësishme
- `ChatSession` — sesion bisede me AI
- `ChatMessage` — mesazhet brenda sesionit (role: `USER · ASSISTANT`)

---

## Autentifikimi dhe rolet

Autentifikimi bëhet me **JWT Bearer token** që skadon pas 1 dite.

| Role | Qasja |
|------|-------|
| `USER` | Rezervime, reviews, waitlist, AI chat |
| `OWNER` | Menaxhim i salonit të vet + gjithçka e USER |
| `ADMIN` | Menaxhim i të gjitha saloneve të tenant-it |
| `SUPERADMIN` | Qasje totale në sistem |

> Nëse email mbaron me `@glamora.com`, roli caktohet automatikisht `ADMIN`.

---

## Grupet e endpoint-eve

| Grupi | Endpoint-et kryesore |
|-------|----------------------|
| **Auth** | `POST /auth/register` `POST /auth/login` `GET /auth/profile` |
| **Admin** | `GET /admin/users` `DELETE /admin/users/:id` |
| **Tenants** | CRUD + `PATCH /tenants/:id/users/:id` |
| **Salons** | CRUD + `?search=` `?city=` |
| **Categories** | CRUD nën `/salons/:id/categories` |
| **Services** | CRUD nën `/salons/:id/services` |
| **Employees** | CRUD + assign services nën `/salons/:id/employees` |
| **Schedules** | Set/get orari javor nën `/salons/:id/employees/:id/schedules` |
| **Availability** | `GET /salons/:id/employees/:id/availability?date=` |
| **Reservations** | Book, list, my-bookings, update status |
| **Reviews** | Lër review pas rezervimit COMPLETED |
| **Promotions** | CRUD + `GET .../validate/:code` |
| **Products** | CRUD nën `/salons/:id/products` |
| **Gift Cards** | Create, validate, use |
| **Waitlist** | Join, list, update status |
| **Notifications** | Get, mark-read, mark-all-read |
| **AI** | Chat, rekomandime, gjenerim përshkrimesh |

Dokumentimi i plotë: **`http://localhost:8080/api-docs`**

---

## Funksionalitetet kryesore

### AI Chatbot
Endpoint `POST /ai/chat/:salonId` ekspozon një asistent virtual për çdo salon. AI njeh shërbimet dhe punonjësit e atij saloni dhe përgjigjet si recepsioniste. Historiku i bisedës ruhet nëpërmjet modeleve `ChatSession` dhe `ChatMessage`.

### Rekomandime personale
`GET /ai/recommendations` analizon historikun e rezervimeve të userit dhe kthen 3 sugjerime të personalizuara.

### Gjenerim automatik i përshkrimeve
`POST /ai/generate-description` merr emrin, çmimin dhe kohëzgjatjen e një shërbimi dhe gjeneron një përshkrim profesional në gjuhën shqipe (vetëm ADMIN/OWNER).

### Redis Caching
Lista e saloneve cache-ohet në Upstash Redis me TTL 60 sekonda. Cache invalidohet automatikisht kur krijohet, ndryshohet ose fshihet një salon.

### Background Email Job
Kur klienti bën rezervim, serveri kthen përgjigjen menjëherë dhe dërgon email konfirmimi **asynchronously** (`setImmediate`). Email-i nuk vonon API response-in.

### Multi-Tenancy
Çdo `Tenant` ka salonet dhe përdoruesit e vet. `verifySalonOwnership` middleware kontrollon që ADMIN qëndron brenda tenant-it të vet, ndërsa OWNER ka qasje vetëm te saloni i vet.

### OOP — AppError
Klasa `AppError extends Error` standarizon gabimet me `statusCode` dhe `name` — përdoret në të gjitha services dhe controllers.

---

## Middleware

| Middleware | Funksioni |
|-----------|-----------|
| `morgan("dev")` | Logging i të gjitha request-eve |
| `authMiddleware` | Verifikon JWT token |
| `roleMiddleware(roles)` | Kontrollon rolin e userit |
| `verifySalonOwnership` | Kontrollon pronësinë e salonit sipas rolit |

---

## Testimi dhe CI/CD

Testet ndodhen në `src/tests/` dhe mbulojnë:
- **Auth**: register, login, token validation
- **Salons**: CRUD, search/filter
- **Reservations**: krijim, conflict check, status update

GitHub Actions ekzekuton automatikisht të gjitha testet në çdo `push` dhe `pull_request` drejt `main`.

---

## Struktura e projektit

```
Glamora-Backend/
├── prisma/
│   ├── schema.prisma        ← 20 modele, Code First
│   ├── seed.js              ← Të dhëna test
│   └── migrations/          ← Historiku i plotë i migrimit
├── src/
│   ├── app.js               ← Express setup, middleware, routes
│   ├── controllers/         ← Request/Response handlers
│   ├── services/            ← Logjika e biznesit + ORM queries
│   ├── routes/              ← Endpoint definitions + Swagger JSDoc
│   ├── middleware/          ← auth, role, verifySalonOwnership
│   ├── lib/                 ← prisma, redis, openai, cache, AppError
│   ├── jobs/                ← Background email job
│   ├── tests/               ← Jest + Supertest
│   └── swagger.js           ← Swagger konfigurimi
└── .github/workflows/       ← CI/CD pipeline
```
