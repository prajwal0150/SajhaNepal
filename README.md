# SAAJHA RAHAT — साझा राहत

Live Disaster Relief & Needs Mapping Platform for Nepal.

Full-stack MERN MVP: React + Vite + TypeScript + Redux Toolkit (frontend), Express + TypeScript + Mongoose (backend), MongoDB, Socket.IO, Leaflet, PWA/offline-first.

## Monorepo layout

```
SajhaRahat/
├── frontend/   # React + Vite + TypeScript + Redux Toolkit (port 5173)
├── server/     # Express + TypeScript + Mongoose + Socket.IO (port 5000)
├── PROJECT_ARCHITECTURE.md
├── DATABASE_ARCHITECTURE.md
├── API_ARCHITECTURE.md
└── IMPLEMENTATION_PROGRESS.md
```

## Quick start

```bash
npm install                 # root tooling (concurrently)
npm --prefix server install
npm --prefix frontend install

# configure environment
cp server/.env.example server/.env
cp frontend/.env.example frontend/.env

# seed demo data (admin, volunteer, ngo, government, citizen + reports/shelters/...)
npm --prefix server run seed

# run backend (5000) + frontend (5173) together
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
- MongoDB: `mongodb://127.0.0.1:27017/saajha-rahat` (configurable via `server/.env`)

## Demo accounts (after seeding)

| Role      | Email                  | Password    |
| --------- | ---------------------- | ----------- |
| Admin     | admin@saajharahat.org  | Admin@123   |
| Volunteer | volunteer@saajharahat.org | Volunteer@123 |
| NGO       | ngo@saajharahat.org    | Ngo@123     |
| Government| gov@saajharahat.org    | Gov@123     |
| Citizen   | citizen@saajharahat.org| Citizen@123 |

## Core workflow

CITIZEN → SUBMIT NEED → REPORT (PENDING) → VOLUNTEER VERIFIES → VERIFIED →
MAP (public) → NGO CLAIMS (atomic) → IN_PROGRESS → DELIVERY + PROOF → RESOLVED → AUDIT + NOTIFICATION

See `API_ARCHITECTURE.md` for the full API surface and `DATABASE_ARCHITECTURE.md` for collections/indexes.
