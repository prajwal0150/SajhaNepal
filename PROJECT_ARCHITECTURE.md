# PROJECT ARCHITECTURE

## Style

Feature-based modular monolith. SOLID without artificial abstraction. High cohesion, low coupling.

Dependency direction (backend): `Routes → Controller → Service → Repository/Model` — business logic never touches HTTP.

## Backend (`server/`, port 5000)

```
server/src/
├── config/          environment.ts (zod), database.ts (mongoose), cloudinary.ts
├── core/
│   ├── errors/      AppError hierarchy + centralized handler
│   ├── middleware/  authenticate, authorize, validate, rateLimit, upload(multer), notFound
│   ├── auth/        jwt signing/verification (access + refresh)
│   ├── logger/      morgan-based structured logger
│   └── utils/       apiResponse helpers, pagination, asyncHandler, serializers
├── modules/         auth, users, organizations, reports, verification, claims,
│                    deliveries, notifications, missingPersons, reliefSites,
│                    inventory, donations, hazards, analytics, admin, auditLogs
│   └── <module>/    *.routes.ts, *.controller.ts, *.service.ts, *.model.ts, *.validation.ts, *.types.ts
├── integrations/    cloudinary, sms, ivr, voice, payment, government  (adapter pattern,
│                    development fallbacks clearly marked — no fake success claims)
├── sockets/         Socket.IO server (JWT handshake, role rooms)
├── app.ts           express app wiring
└── server.ts        http + socket bootstrap
```

## Frontend (`frontend/`, port 5173)

```
frontend/src/
├── app/
│   ├── App.tsx
│   ├── routes/      AppRoutes, ProtectedRoute, RoleRoute
│   ├── providers/   Provider, SocketProvider, ToastProvider
│   └── store/       store.ts, rootReducer.ts, hooks.ts (typed useAppDispatch/useAppSelector)
├── features/        auth, reports, verification, organizations, claims, deliveries,
│                    notifications, missingPersons, reliefSites, inventory, donations,
│                    hazards, analytics, map, offline, language, accessibility,
│                    volunteer, ngo, government, admin
│   └── <feature>/   components/ hooks/ pages/ redux/ services/ types/ validators/ index.ts
├── shared/          components/ hooks/ layouts/ constants/ types/ utils/ lib/
├── main.tsx
└── index.css        Tailwind v4 theme tokens
```

Redux data flow: `Component → Hook → dispatch(thunk) → Service → Axios → API → Slice → Selector → Component`. Axios calls never live in components.

## Key engineering decisions

| Concern         | Decision |
| --------------- | -------- |
| Atomic claiming | `Report.findOneAndUpdate({_id, status:'VERIFIED', claimedBy:null}, {$set:{status:'CLAIMED',...}})` — null result ⇒ HTTP 409 |
| State machine   | Server-side transition map; client-sent status is never trusted |
| Auth            | JWT access (15m) + refresh (7d, rotation), bcrypt(10), centralized axios interceptor w/ refresh queue + single-flight refresh |
| Public privacy  | `PublicReport` serializer strips phone/email/fraud/notes; `AdminReport` is full |
| Fraud/duplicate | Heuristic service scores `duplicateScore`/`fraudScore`, flags for moderation — never auto-deletes |
| File upload     | Multer memory + MIME/size validation → Cloudinary adapter; dev fallback = local disk storage (clearly marked) |
| Offline         | Service worker (app shell) + IndexedDB report queue (QUEUED/SYNCING/SYNCED/FAILED) + Background Sync API w/ manual fallback |
| i18n            | Redux-backed language slice, dictionary en/ne, `t()` helper |
| Charts          | Dependency-free SVG chart components (Bar/Line/Donut) for infographic dashboards |
| Realtime        | Socket.IO rooms per role; events mirror REST writes; MongoDB remains source of truth |

## Ports

- Backend `5000`, Frontend `5173` (Vite proxies `/api` and `/socket.io` → 5000).
