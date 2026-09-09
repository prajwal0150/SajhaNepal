/* eslint-disable no-console */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../modules/users/user.model';
import { Organization } from '../modules/organizations/organization.model';
import { Report } from '../modules/reports/report.model';
import { ReliefSite } from '../modules/reliefSites/reliefSite.model';
import { InventoryItem, InventoryTransaction } from '../modules/inventory/inventory.model';
import { MissingPerson } from '../modules/missingPersons/missingPerson.model';
import { Notification } from '../modules/notifications/notification.model';
import { Hazard } from '../modules/hazards/hazard.model';
import { Donation } from '../modules/donations/donation.model';
import { Delivery } from '../modules/deliveries/delivery.model';
import { Verification } from '../modules/verification/verification.model';
import { Settings } from '../modules/admin/settings.model';

const isFresh = process.argv.includes('--fresh');
const SALT = 10;

const LOCATIONS: Record<string, [number, number]> = {
  Kathmandu: [85.324, 27.7172],
  Lalitpur: [85.3247, 27.6588],
  Bhaktapur: [85.4298, 27.671],
  Sindhupalchok: [85.6857, 27.9517],
  Nuwakot: [85.15, 27.9],
  Gorkha: [84.6288, 28.0],
  Kaski: [83.9856, 28.2096],
  Chitwan: [84.3532, 27.5291],
  Sarlahi: [85.6, 26.9],
  Morang: [87.3, 26.65],
};

async function seed(): Promise<void> {
  await connectDatabase();

  if (isFresh) {
    console.log('⚠️  --fresh: dropping all collections');
    const collections = await mongoose.connection.db!.collections();
    for (const c of collections) await c.deleteMany({});
  }

  const existingAdmin = await User.findOne({ email: 'admin@saajharahat.org' });
  if (existingAdmin) {
    console.log('✅ Seed data already present. Use `npm run seed:fresh` to reset.');
    await disconnectDatabase();
    return;
  }

  const hash = (p: string) => bcrypt.hashSync(p, SALT);

  // ---- Users -------------------------------------------------------------
  const [_admin, volunteer, volunteer2, ngoUser, _gov, citizen] = await Promise.all([
    User.create({ fullName: 'Aarav Admin', email: 'admin@saajharahat.org', passwordHash: hash('Admin@123'), role: 'ADMIN', district: 'Kathmandu', province: 'Bagmati', phone: '9800000001' }),
    User.create({ fullName: 'Sita Volunteer', email: 'volunteer@saajharahat.org', passwordHash: hash('Volunteer@123'), role: 'VOLUNTEER', district: 'Kathmandu', province: 'Bagmati', phone: '9800000002', isVerified: true }),
    User.create({ fullName: 'Bikash Volunteer', email: 'volunteer2@saajharahat.org', passwordHash: hash('Volunteer@123'), role: 'VOLUNTEER', district: 'Kaski', province: 'Gandaki', phone: '9800000003', isVerified: true }),
    User.create({ fullName: 'Maya NGO', email: 'ngo@saajharahat.org', passwordHash: hash('Ngo@123'), role: 'NGO', district: 'Lalitpur', province: 'Bagmati', phone: '9800000004' }),
    User.create({ fullName: 'Hari Government', email: 'gov@saajharahat.org', passwordHash: hash('Gov@123'), role: 'GOVERNMENT', district: 'Kathmandu', province: 'Bagmati', phone: '9800000005' }),
    User.create({ fullName: 'Rita Citizen', email: 'citizen@saajharahat.org', passwordHash: hash('Citizen@123'), role: 'CITIZEN', district: 'Sindhupalchok', province: 'Bagmati', phone: '9800000006' }),
  ]);
  console.log('✅ Users seeded (admin, volunteers, ngo, gov, citizen)');

  // ---- Organizations ------------------------------------------------------
  const [ngo1, ngo2] = await Promise.all([
    Organization.create({
      name: 'Himalayan Relief Foundation', type: 'NGO', description: 'Community-driven disaster relief across central Nepal.',
      email: 'info@hrf.org.np', phone: '015551001', registrationNumber: 'REG-12345',
      district: 'Lalitpur', province: 'Bagmati', municipality: 'Lalitpur Metropolitan', ward: 10,
      location: { type: 'Point', coordinates: LOCATIONS.Lalitpur },
      verificationStatus: 'VERIFIED', verifiedAt: new Date(),
      members: [{ user: ngoUser._id, roleInOrg: 'ADMIN' }], trustScore: 82,
    }),
    Organization.create({
      name: 'Gandaki Rapid Response Team', type: 'COMMUNITY_GROUP', description: 'Volunteer rescue & supply network in Gandaki.',
      email: 'contact@grrt.org.np', phone: '061550100', registrationNumber: 'REG-67890',
      district: 'Kaski', province: 'Gandaki', municipality: 'Pokhara Metropolitan', ward: 8,
      location: { type: 'Point', coordinates: LOCATIONS.Kaski },
      verificationStatus: 'VERIFIED', verifiedAt: new Date(),
      members: [{ user: volunteer2._id, roleInOrg: 'MEMBER' }], trustScore: 74,
    }),
    Organization.create({
      name: 'Koshi Humanitarian Aid', type: 'INGO', description: 'INGO active in eastern Nepal flood response.',
      email: 'ops@kha.org', district: 'Morang', province: 'Koshi',
      verificationStatus: 'PENDING', members: [],
    }),
  ]);
  console.log('✅ Organizations seeded');

  // ---- Relief sites -------------------------------------------------------
  const shelter2 = await ReliefSite.create({ name: 'Sindhupalchok Higher Secondary School', siteType: 'SHELTER', location: { type: 'Point', coordinates: LOCATIONS.Sindhupalchok }, district: 'Sindhupalchok', province: 'Bagmati', municipality: 'Chautara Sangachokgadhi', ward: 3, capacity: 500, currentOccupancy: 480, contact: '9812222222', status: 'FULL' });
  await ReliefSite.create({ name: 'Bhaktapur Community Shelter', siteType: 'SHELTER', location: { type: 'Point', coordinates: LOCATIONS.Bhaktapur }, district: 'Bhaktapur', province: 'Bagmati', municipality: 'Bhaktapur', ward: 5, capacity: 300, currentOccupancy: 210, contact: '9811111111', managedBy: ngo1._id, status: 'ACTIVE' });
  const warehouse1 = await ReliefSite.create({ name: 'Kathmandu Central Warehouse', siteType: 'WAREHOUSE', location: { type: 'Point', coordinates: LOCATIONS.Kathmandu }, district: 'Kathmandu', province: 'Bagmati', capacity: 0, contact: '9813333333', managedBy: ngo1._id, status: 'ACTIVE' });
  const warehouse2 = await ReliefSite.create({ name: 'Pokhara Regional Warehouse', siteType: 'WAREHOUSE', location: { type: 'Point', coordinates: LOCATIONS.Kaski }, district: 'Kaski', province: 'Gandaki', capacity: 0, contact: '9814444444', managedBy: ngo2._id, status: 'ACTIVE' });
  console.log('✅ Relief sites seeded');

  // ---- Reports (needs) ----------------------------------------------------
  const mk = (
    district: keyof typeof LOCATIONS,
    title: string, description: string,
    needType: string, urgency: string, status: string, verificationStatus: string,
    extra: Record<string, unknown> = {},
  ): Record<string, unknown> => ({
    reporter: citizen._id, reporterContact: '9800000006',
    title, description, needType, urgency, status, verificationStatus,
    location: { type: 'Point', coordinates: LOCATIONS[district] },
    district, province: 'Bagmati', municipality: `${district} Rural Municipality`,
    affectedPeople: 1, requiredQuantity: 1, source: 'WEB', consent: true, ...extra,
  });

  const reports = await Report.create([
    mk('Sindhupalchok', 'Medical emergency — injured grandmother', 'Elderly woman injured by landslide debris needs urgent medical attention and transport to hospital.', 'MEDICAL', 'CRITICAL', 'PENDING', 'PENDING'),
    mk('Sindhupalchok', 'No drinking water for 40 households', 'Landslide destroyed the water pipeline. 40 households have had no clean water for 3 days.', 'WATER', 'CRITICAL', 'PENDING', 'PENDING', { requiredQuantity: 40, quantityUnit: 'jerrycans', affectedPeople: 200 }),
    mk('Nuwakot', 'Food for displaced family of six', 'Family sheltering in an open field after flood washed away their home. Need food for 6 people.', 'FOOD', 'HIGH', 'PENDING', 'PENDING', { requiredQuantity: 6, quantityUnit: 'meal kits', affectedPeople: 6 }),
    mk('Gorkha', 'Tarpaulins needed for 12 damaged roofs', 'Monsoon damaged 12 roofs in the settlement. Families exposed to rain.', 'SHELTER', 'HIGH', 'PENDING', 'PENDING', { requiredQuantity: 12, quantityUnit: 'tarpaulins', affectedPeople: 45 }),
    mk('Chitwan', 'Rescue needed — family stranded on rooftop', 'River swollen after dam release; family of 5 stranded on rooftop near riverbank.', 'RESCUE', 'CRITICAL', 'PENDING', 'PENDING', { affectedPeople: 5 }),
    mk('Kathmandu', 'Verified water need at temporary camp', 'Water tanks empty at the camp behind the stadium. 80 people affected.', 'WATER', 'HIGH', 'VERIFIED', 'VERIFIED', { requiredQuantity: 20, quantityUnit: 'jerrycans', affectedPeople: 80, verifiedBy: volunteer._id, verifiedAt: new Date(), verificationScore: 85 }),
    mk('Lalitpur', 'Blankets for cold night at shelter', 'Children at the shelter are sleeping without blankets. Night temperatures dropping.', 'CLOTHING', 'MEDIUM', 'VERIFIED', 'VERIFIED', { requiredQuantity: 30, quantityUnit: 'blankets', affectedPeople: 30, verifiedBy: volunteer._id, verifiedAt: new Date(), verificationScore: 90 }),
    mk('Kaski', 'Claimed food supply for flood camp', 'Rice, lentils and oil for 25 families at the ward-8 community hall camp.', 'FOOD', 'HIGH', 'CLAIMED', 'VERIFIED', { requiredQuantity: 25, quantityUnit: 'food kits', affectedPeople: 110, verifiedBy: volunteer2._id, verifiedAt: new Date(), claimedBy: ngo2._id, claimedAt: new Date(), verificationScore: 88 }),
    mk('Sarlahi', 'Resolved medical camp support', 'Mobile medical camp served the village; need fully delivered with proof.', 'MEDICAL', 'HIGH', 'RESOLVED', 'VERIFIED', { requiredQuantity: 5, quantityUnit: 'first-aid kits', affectedPeople: 120, verifiedBy: volunteer._id, verifiedAt: new Date(), claimedBy: ngo1._id, claimedAt: new Date(Date.now() - 2 * 86400000), resolvedAt: new Date(Date.now() - 86400000), deliveredQuantity: 5 }),
  ]);
  console.log('✅ Reports seeded (PENDING/VERIFIED/CLAIMED/RESOLVED)');

  // ---- Deliveries + verification for resolved report -----------------------
  const resolvedReport = reports[8];
  await Delivery.create({
    report: resolvedReport._id, organization: ngo1._id, deliveredBy: ngoUser._id,
    quantityDelivered: 5, recipientCount: 120,
    deliveryLocation: { address: 'Sarlahi village ward 4', ward: 4 },
    proofImages: ['/uploads/seed/proof-sarlahi.jpg'], notes: 'Coordinated with local health post.',
    deliveredAt: new Date(Date.now() - 86400000),
  });
  await Verification.create({ report: resolvedReport._id, volunteer: volunteer._id, decision: 'VERIFIED', notes: 'Confirmed with local health post volunteers.' });
  console.log('✅ Deliveries + verifications seeded');

  // ---- Inventory -----------------------------------------------------------
  const items = await InventoryItem.create([
    { warehouse: warehouse1._id, itemType: 'WATER', quantity: 500, unit: 'litres' },
    { warehouse: warehouse1._id, itemType: 'FOOD', quantity: 220, unit: 'kg' },
    { warehouse: warehouse1._id, itemType: 'MEDICINE', quantity: 45, unit: 'kits', lowStockThreshold: 20 },
    { warehouse: warehouse1._id, itemType: 'TARPAULIN', quantity: 80, unit: 'pieces' },
    { warehouse: warehouse2._id, itemType: 'BLANKET', quantity: 150, unit: 'pieces' },
    { warehouse: warehouse2._id, itemType: 'WATER', quantity: 320, unit: 'litres' },
  ]);
  await InventoryTransaction.create({ item: items[0]._id, warehouse: warehouse1._id, transactionType: 'IN', quantityChanged: 500, performedBy: ngoUser._id, notes: 'Initial stock' });
  console.log('✅ Inventory seeded');

  // ---- Missing persons -----------------------------------------------------
  await MissingPerson.create([
    { fullName: 'Dolma Sherpa', age: 34, gender: 'FEMALE', lastSeenLocation: 'Chautara bazaar bus stop', lastSeenWard: 3, district: 'Sindhupalchok', description: 'Last seen wearing a red jacket, travelling with her son.', contactPhone: '9850000001', reportedBy: citizen._id, status: 'SEARCHING' },
    { fullName: 'Kiran Tamang', age: 12, gender: 'MALE', lastSeenLocation: 'Melamchi riverbank', lastSeenWard: 1, district: 'Sindhupalchok', description: 'Went missing during the flood; blue school bag.', contactPhone: '9850000002', reportedBy: volunteer._id, status: 'FOUND_SAFE', matchedShelter: shelter2._id },
  ]);
  console.log('✅ Missing persons seeded');

  // ---- Hazards (clearly-marked dev mock data) ------------------------------
  await Hazard.create([
    { type: 'FLOOD', title: 'Sunkoshi river level rising (MOCK — dev data)', description: 'Mock development data: river above warning level at Barhabise.', severity: 'HIGH', source: 'DEV_MOCK_DHFEED', location: 'Sunkoshi river, Sindhupalchok', district: 'Sindhupalchok', affectedArea: ['Barhabise', 'Chautara'], startTime: new Date(), isMock: true },
    { type: 'LANDSLIDE', title: 'Road-blocking landslide Prithvi Highway (MOCK — dev data)', description: 'Mock development data: highway blocked near Mugling.', severity: 'MODERATE', source: 'DEV_MOCK_NDRRMA', location: 'Mugling', district: 'Chitwan', startTime: new Date(), isMock: true },
  ]);
  console.log('✅ Hazard alerts seeded (marked as dev mock)');

  // ---- Donations -------------------------------------------------------------
  await Donation.create([
    { donorReference: 'SEED-REF-001', donorName: 'Anonymous', amountNPR: 25000, organization: ngo1._id, linkedReport: reports[8]._id, status: 'COMPLETED', notes: 'Seed data' },
    { donorReference: 'SEED-REF-002', donorName: 'Local Business Group', amountNPR: 60000, organization: ngo2._id, status: 'ALLOCATED', notes: 'Seed data' },
  ]);
  console.log('✅ Donations seeded');

  // ---- Notifications + settings ---------------------------------------------
  await Notification.create([
    { user: citizen._id, type: 'REPORT_VERIFIED', title: 'Your report was verified', message: 'Verified water need at temporary camp' },
    { user: ngoUser._id, type: 'NEW_CRITICAL_NEED', title: 'New verified need near you', message: 'Water need in Kathmandu district' },
  ]);
  await Settings.create({});
  console.log('✅ Notifications + settings seeded');

  console.log('\n🎉 Seed complete! Login accounts (all passwords shown):');
  console.log('   admin@saajharahat.org      / Admin@123');
  console.log('   volunteer@saajharahat.org  / Volunteer@123');
  console.log('   ngo@saajharahat.org        / Ngo@123');
  console.log('   gov@saajharahat.org        / Gov@123');
  console.log('   citizen@saajharahat.org    / Citizen@123');

  await disconnectDatabase();




}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
