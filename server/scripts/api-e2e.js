/* End-to-end API verification of the MVP core loop */
const http = require('http');

let accessToken = null;

function req(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      method,
      hostname: '127.0.0.1',
      port: 5000,
      path,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    };
    const r = http.request(options, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(d) });
        } catch {
          resolve({ status: res.statusCode, json: { raw: d.slice(0, 200) } });
        }
      });
    });
    r.on('error', reject);
    r.setTimeout(5000, () => { r.destroy(); reject(new Error('timeout')); });
    if (data) r.write(data);
    r.end();
  });
}

function assert(name, cond, extra = '') {
  const pass = Boolean(cond);
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${pass ? '' : ' :: ' + extra}`);
  if (!pass) process.exitCode = 1;
}

async function login(email, password) {
  const res = await req('POST', '/api/v1/auth/login', { email, password });
  assert(`login ${email}`, res.status === 200 && res.json.data?.accessToken, JSON.stringify(res.json).slice(0, 200));
  return res.json.data;
}

(async () => {
  // 1. Health
  const health = await req('GET', '/health');
  assert('health endpoint', health.status === 200);

  // 2. Auth
  const ngoAuth = await login('ngo@saajharahat.org', 'Ngo@123');
  const citizenAuth = await login('citizen@saajharahat.org', 'Citizen@123');
  const volAuth = await login('volunteer@saajharahat.org', 'Volunteer@123');
  const adminAuth = await login('admin@saajharahat.org', 'Admin@123');

  accessToken = volAuth.accessToken;
  const me = await req('GET', '/api/v1/auth/me');
  assert('auth/me returns volunteer', me.json.data?.role === 'VOLUNTEER');

  // Refresh flow
  const refreshed = await req('POST', '/api/v1/auth/refresh', { refreshToken: volAuth.refreshToken });
  assert('refresh token rotation', refreshed.status === 200 && refreshed.json.data?.accessToken);
  const reuse = await req('POST', '/api/v1/auth/refresh', { refreshToken: volAuth.refreshToken });
  assert('refresh token reuse rejected', reuse.status === 401, `status ${reuse.status}`);

  // 3. Citizen creates report
  accessToken = citizenAuth.accessToken;
  const created = await req('POST', '/api/v1/reports', {
    title: 'Water urgently needed in Sajha Test Ward',
    description: 'Test end-to-end need: no clean drinking water after flood.',
    needType: 'WATER', urgency: 'HIGH',
    longitude: 85.32, latitude: 27.71,
    district: 'Kathmandu', municipality: 'Kathmandu', ward: 10,
    affectedPeople: 12, requiredQuantity: 10, quantityUnit: 'jerrycans',
    reporterContact: '9809999999', consent: true,
  });
  assert('citizen creates report', created.status === 201 && created.json.data?.status === 'PENDING', JSON.stringify(created.json).slice(0, 200));
  const reportId = created.json.data?._id;

  // Public list must NOT include PENDING (unauthenticated view)
  accessToken = null;
  const publicList = await req('GET', '/api/v1/reports?limit=100');
  assert('public list excludes PENDING', !publicList.json.data.some((r) => r._id === reportId));
  assert('public report has no phone/fraud data', publicList.json.data.every((r) => !('reporterContact' in r) && !('fraudScore' in r) && !('reporter' in r)));

  // 4. Volunteer verifies
  accessToken = volAuth.accessToken;
  const verified = await req('POST', '/api/v1/verifications', { reportId, decision: 'VERIFIED', notes: 'Checked by phone' });
  assert('volunteer verifies', verified.status === 200 && verified.json.data?.status === 'VERIFIED', JSON.stringify(verified.json).slice(0, 200));
  const doubleVerify = await req('POST', '/api/v1/verifications', { reportId, decision: 'REJECTED' });
  assert('double verification rejected (409)', doubleVerify.status === 409, `status ${doubleVerify.status}`);

  // 5. NGO org id
  accessToken = ngoAuth.accessToken;
  const myOrgs = await req('GET', '/api/v1/organizations/my');
  const orgId = myOrgs.json.data[0]?._id;
  assert('ngo has organization', Boolean(orgId));

  // 6. ATOMIC CLAIM + CONFLICT
  const claim1 = await req('POST', '/api/v1/claims', { reportId, organizationId: orgId });
  assert('first NGO claim succeeds', claim1.status === 201, JSON.stringify(claim1.json).slice(0, 160));
  const claim2 = await req('POST', '/api/v1/claims', { reportId, organizationId: orgId });
  assert('second claim conflicts (409)', claim2.status === 409, `status ${claim2.status}`);

  // 7. Release while CLAIMED → back to VERIFIED, then re-claim
  const release = await req('PATCH', `/api/v1/claims/${reportId}/cancel`);
  assert('claim released back to VERIFIED', release.status === 200 && release.json.data?.status === 'VERIFIED');
  const reClaim = await req('POST', '/api/v1/claims', { reportId, organizationId: orgId });
  assert('re-claim after release succeeds', reClaim.status === 201);

  // 8. Start operation
  const started = await req('PATCH', `/api/v1/claims/${reportId}/start`);
  assert('operation started (IN_PROGRESS)', started.status === 200 && started.json.data?.status === 'IN_PROGRESS');

  // 8b. Release after IN_PROGRESS must be rejected by the state machine
  const lateRelease = await req('PATCH', `/api/v1/claims/${reportId}/cancel`);
  assert('release after IN_PROGRESS rejected (409)', lateRelease.status === 409, `status ${lateRelease.status}`);

  // 9. Delivery without proof must NOT resolve
  const noProof = await req('POST', '/api/v1/deliveries', {
    reportId, organizationId: orgId, quantityDelivered: 10, recipientCount: 12,
    deliveryLocation: { address: 'Kathmandu ward 10', coordinates: [85.32, 27.71], ward: 10 },
    notes: 'no proof attached',
  });
  assert('resolution without proof rejected (400)', noProof.status === 400, `status ${noProof.status}`);

  // 10. Notifications
  const notifs = await req('GET', '/api/v1/notifications?limit=5');
  assert('notifications list', notifs.status === 200 && Array.isArray(notifs.json.data));

  // 11. Analytics (admin)
  accessToken = adminAuth.accessToken;
  const stats = await req('GET', '/api/v1/admin/dashboard-stats');
  assert('admin dashboard stats', stats.status === 200 && typeof stats.json.data?.totalReports === 'number');

  // 12. Role guard
  accessToken = citizenAuth.accessToken;
  const forbidden = await req('GET', '/api/v1/admin/dashboard-stats');
  assert('role guard blocks citizen from admin (403)', forbidden.status === 403, `status ${forbidden.status}`);

  // 13. Unauthenticated report detail privacy
  accessToken = null;
  const detail = await req('GET', `/api/v1/reports/${reportId}`);
  assert('public detail has no contact info', detail.status === 200 && !('reporterContact' in detail.json.data));

  // 14. SMS integration (dev adapter)
  const sms = await req('POST', '/api/v1/integrations/sms/incoming', { from: '9800000006', text: 'NEED Sindhupalchok Ward4 water 15' }, { 'x-sms-key': 'dev_sms_inbound_key' });
  assert('SMS parsed into report', sms.status === 200 && sms.json.data?.accepted === true && sms.json.data?.parsed?.needType === 'WATER', JSON.stringify(sms.json).slice(0, 160));

  console.log('DONE');

})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
