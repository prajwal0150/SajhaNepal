# DATABASE ARCHITECTURE

MongoDB via Mongoose. Default URI: `mongodb://127.0.0.1:27017/saajha-rahat` (Atlas supported via env).

## Collections

### users
`fullName, email(unique), phone, passwordHash(select:false), role: CITIZEN|VOLUNTEER|NGO|GOVERNMENT|ADMIN, avatar, address, province, district, municipality, ward, isVerified, isActive, isBlocked, lastLoginAt`
Indexes: `email(unique)`, `phone`, `role`. passwordHash never serialized.

### organizations
`name, type: NGO|INGO|GOVERNMENT_AGENCY|LOCAL_GOVERNMENT|COMMUNITY_GROUP|OTHER, description, email, phone, logo, registrationNumber, address+geo fields, location(GeoJSON), verificationStatus: PENDING|VERIFIED|REJECTED, verifiedBy, verifiedAt, members[{user, roleInOrg}], trustScore(0-100)`
Indexes: `name(text)`, `verificationStatus`.

### reports (DisasterReport — core entity)
`reporter, reporterContact, title, description, needType: MEDICAL|WATER|FOOD|SHELTER|CLOTHING|RESCUE|MISSING_PERSON|EVACUATION|OTHER, urgency: CRITICAL|HIGH|MEDIUM|LOW, status: PENDING|VERIFIED|REJECTED|CLAIMED|IN_PROGRESS|RESOLVED|CANCELLED, verificationStatus: PENDING|VERIFIED|REJECTED|FLAGGED, location(GeoJSON Point), province, district, municipality, ward, address, affectedPeople, requiredQuantity, quantityUnit, deliveredQuantity, images[], voiceUrl, transcription, source: WEB|SMS|IVR|VOICE, verificationScore, duplicateScore, fraudScore, flags[], requireProof, verifiedBy, verifiedAt, claimedBy(ref Organization), claimedAt, resolvedAt, consent`
Indexes: `status`, `urgency`, `needType`, `createdAt`, `district`, `municipality`, `ward`, `claimedBy`, `verificationStatus`, `location: 2dsphere`, compound `{status:1, urgency:1, createdAt:-1}`.

### verifications
`report, volunteer, decision: VERIFIED|REJECTED|FLAGGED, notes, evidence[], createdAt`
Indexes: `report`, `volunteer`, `createdAt`.

### deliveries
`report, organization, deliveredBy, quantityDelivered, recipientCount, deliveryLocation{address, coordinates, ward}, proofImages[], notes, deliveredAt`
Indexes: `report`, `organization`, `deliveredAt`.

### notifications
`user, type: REPORT_CREATED|REPORT_VERIFIED|REPORT_REJECTED|REPORT_CLAIMED|DELIVERY_SUBMITTED|REPORT_RESOLVED|NEW_CRITICAL_NEED|ORGANIZATION_APPROVED|SYSTEM_ALERT, title, message, entity{kind,id}, isRead`
Indexes: `user`, `isRead`, `createdAt`.

### missingpersons
`fullName, photo, age, gender, lastSeenLocation, lastSeenWard, description, contactPhone, reportedBy, status: SEARCHING|FOUND_SAFE|FOUND_DECEASED|CLOSED, matchedShelter`
Indexes: `fullName`, `status`.

### reliefSites
`name, siteType: SHELTER|WAREHOUSE, location(GeoJSON), province, district, municipality, ward, address, capacity, currentOccupancy, contact, managedBy(ref Organization), status: ACTIVE|FULL|CLOSED`
Invariant: `currentOccupancy ≤ capacity` enforced in service. Indexes: `siteType`, `location: 2dsphere`, `district`.

### inventoryItems / inventoryTransactions
Items: `warehouse(ref ReliefSite type WAREHOUSE), itemType: WATER|FOOD|MEDICINE|TARPAULIN|BLANKET|CLOTHING|OTHER, quantity, unit, lowStockThreshold`
Transactions: `item, warehouse, transactionType: IN|OUT|TRANSFER|ADJUSTMENT, quantityChanged, performedBy, relatedReport, notes`
OUT uses atomic guarded update: `findOneAndUpdate({_id, quantity:{$gte:qty}}, {$inc:{quantity:-qty}})` — never negative. Index: `warehouse+itemType(unique)`.

### donations
`donorReference, donorName, amountNPR, linkedReport, organization, disbursedBy, proofImage, notes, status: RECEIVED|ALLOCATED|DISBURSED|COMPLETED|CANCELLED`
Public transparency serializer hides donor identity.

### hazards
`type: FLOOD|LANDSLIDE|EARTHQUAKE|WEATHER|OTHER, title, description, severity: LOW|MODERATE|HIGH|EXTREME, source, location, affectedArea[], startTime, endTime, status: ACTIVE|EXPIRED|CANCELLED, isMock`

### auditLogs (append-only)
`actor, action, entityType, entityId, metadata, ipAddress`
Indexes: `actor`, `entityType+entityId`, `createdAt`. Normal users can never modify.

### settings (singleton doc)
Platform settings: maintenance mode, proof requirement default, retention days, per-feature flags.

## Consistency rules

- Claim → atomic `findOneAndUpdate` (no read-then-write race).
- Delivery + resolution + audit + notifications → MongoDB session transaction where replica set available, with non-transactional fallback for standalone `mongod`.
- Inventory OUT guarded `$inc`.
- Trust score recomputed server-side on verify/claim/delivery events.
