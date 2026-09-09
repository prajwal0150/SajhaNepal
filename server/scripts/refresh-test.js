const http = require('http');

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({ method, hostname: '127.0.0.1', port: 5000, path, headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve({ status: res.statusCode, json: (() => { try { return JSON.parse(d); } catch { return { raw: d }; } })() }));
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  const login = await req('POST', '/api/v1/auth/login', { email: 'volunteer@saajharahat.org', password: 'Volunteer@123' });
  console.log('login:', login.status);
  const rt = login.json.data.refreshToken;

  const r1 = await req('POST', '/api/v1/auth/refresh', { refreshToken: rt });
  console.log('refresh#1:', r1.status, 'newRT differs:', r1.json.data?.refreshToken !== rt);

  const r2 = await req('POST', '/api/v1/auth/refresh', { refreshToken: rt });
  console.log('refresh#2 (reuse):', r2.status, r2.json.message);

  const r3 = await req('POST', '/api/v1/auth/refresh', { refreshToken: r1.json.data.refreshToken });
  console.log('refresh#3 (new token):', r3.status, r3.json.message);
})();
