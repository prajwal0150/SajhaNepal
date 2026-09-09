# API ARCHITECTURE

Base URL: `/api/v1` · All responses: `{ success, message, data, meta }` / `{ success:false, message, errors }`
Status codes: 400/401/403/404/409/422/429/500 · Pagination: `?page=1&limit=20` → `meta:{page,limit,total,totalPages}`

## auth `/auth`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | /register | – | `{fullName,email,phone,password,role?}` → tokens + user |
| POST | /login | – | `{email, password}` (email or phone) → tokens |
| POST | /refresh | – | `{refreshToken}` → rotated tokens |
| POST | /logout | – | revokes refresh token |
| GET | /me | user | current profile |
| PATCH | /me | user | update profile fields |
| POST | /change-password | user | `{currentPassword,newPassword}` |
| POST | /forgot-password | – | dev: returns resetToken (no provider configured) |
| POST | /reset-password | – | `{token,password}` |

## users `/users` (ADMIN unless noted)
GET `/` (search/role/page) · GET `/volunteers` · PATCH `/:id` (role, isActive, isBlocked)

## organizations `/organizations`
GET `/` (public, verified) · GET `/:id` · GET `/my` (org admin) · POST `/` (create) · PATCH `/:id` ·
POST `/:id/members` · PATCH `/:id/verify` (ADMIN) · GET `/:id/members`

## reports `/reports`
| Method | Path | Auth |
|---|---|---|
| POST | / | CITIZEN+ (multipart: images[], voice) |
| GET | / | public (verified+ only) / auth sees own + role scope |
| GET | /mine | reporter |
| GET | /nearby | public `?lat&lng&radiusKm&needType&urgency&limit` |
| GET | /:id | public serializer vs full (owner/volunteer/admin) |
| PATCH | /:id/cancel | reporter (PENDING only) |
| PATCH | /:id | ADMIN (moderation edit) |

Filters: `search, needType, urgency, status, verificationStatus, province, district, municipality, ward, claimedBy, from, to, lat/lng/radiusKm`

## verifications `/verifications`
POST `/` (VOLUNTEER+) `{reportId, decision: VERIFIED\|REJECTED\|FLAGGED, notes}` — state-machine enforced · GET `/mine` · GET `/?reportId=`

## claims `/claims`
POST `/` (NGO) `{reportId, organizationId}` — **atomic**, 409 on conflict · GET `/mine` · PATCH `/:id/start` · PATCH `/:id/cancel` (release back to VERIFIED)

## deliveries `/deliveries`
POST `/` (NGO, multipart proofImages) `{reportId, organizationId, quantityDelivered, recipientCount, deliveryLocation, notes}` → auto-resolves when quantity satisfied & proof present · GET `/mine` · GET `/?reportId=`

## notifications `/notifications`
GET `/` · GET `/unread-count` · PATCH `/:id/read` · POST `/read-all` · DELETE `/:id`

## missing-persons `/missing-persons`
POST `/` (auth, photo) · GET `/` (public search/status) · GET `/:id` · PATCH `/:id` · PATCH `/:id/status` (ADMIN/GOVERNMENT)

## relief-sites `/relief-sites`
GET `/` (public filters) · POST `/` (ADMIN/GOVERNMENT/NGO) · PATCH `/:id` · PATCH `/:id/occupancy` (guard ≤ capacity)

## inventory `/inventory`
GET `/items` · POST `/items` · POST `/transactions` (atomic; OUT guarded ≥ 0) · GET `/transactions`

## donations `/donations`
POST `/` (ADMIN/NGO) · GET `/` (ADMIN) · GET `/transparency` (public safe fields) · PATCH `/:id/status`

## hazards `/hazards`
GET `/` (public, active) · POST `/` (ADMIN/GOVERNMENT) · PATCH `/:id` · GET `/:id`

## analytics `/analytics`
GET `/overview` (role-scoped KPIs) · GET `/reports` (byNeedType/byUrgency/byDistrict/overTime) · GET `/performance` (NGO/volunteer) · GET `/shelters` (occupancy) · GET `/inventory-usage`

## admin `/admin`
GET `/dashboard-stats` · GET `/audit-logs` (filters) · GET `/settings` · PATCH `/settings`

## integrations `/integrations`
POST `/sms/incoming` (`x-sms-key` header; parse `NEED <place> Ward<n> <TYPE> <qty>`) · POST `/voice/upload` (auth audio; transcription PENDING) · GET `/payment/status` (dev manual flow) · POST `/ivr/missed-call` (dev adapter)

## Socket.IO events
`report:created, report:verified, report:rejected, report:claimed, report:updated, report:resolved, notification:new, shelter:updated, inventory:updated, delivery:submitted`
JWT handshake (`auth.token`), rooms: `role:CITIZEN`… `role:ADMIN`, `org:<id>`.
