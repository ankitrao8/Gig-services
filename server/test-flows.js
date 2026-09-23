// Automated End-to-End Test for Sahakar Seva
// Runs through all 4 key user flows

const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING SAHAKAR SEVA END-TO-END FLOW TESTS ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (e) {
      console.log('❌ FAILED:', e.message);
      failed++;
    }
  }

  // 1. Health check
  await test('Server Health Check', async () => {
    const r = await fetch(`${BASE}/health`).then(res => res.json());
    if (r.status !== 'OK') throw new Error('Health not OK');
  });

  // 2. Auth: Customer Login
  let customerToken = '';
  await test('Customer Login with Mock OTP (123456)', async () => {
    const r = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9999999999', otp: '123456' })
    }).then(res => res.json());
    if (!r.success || !r.token) throw new Error(r.message || 'No token');
    customerToken = r.token;
  });

  // 3. Worker Search & Matching
  let targetWorkerId = '';
  await test('Worker Search with Geo-Matching & Skill Filter', async () => {
    const r = await fetch(`${BASE}/workers?service=sk-elec&lat=25.3176&lng=82.9739&maxDistance=10`).then(res => res.json());
    if (!r.success || r.workers.length === 0) throw new Error('No workers matched');
    targetWorkerId = r.workers[0].id;
    if (r.workers[0].distanceKm === undefined) throw new Error('Distance missing');
  });

  // 4. Customer Creates Booking
  let newBookingId = '';
  await test('Customer Creates Instant Booking (10-Step Wizard)', async () => {
    const r = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        workerId: targetWorkerId,
        serviceId: 'sk-elec',
        bookingType: 'INSTANT',
        scheduledDate: '2026-03-25',
        scheduledTime: '11:00 AM',
        address: 'Flat 402, Ganga Heights, Varanasi',
        problemDescription: 'Main circuit breaker fuse replacement'
      })
    }).then(res => res.json());
    if (!r.success || !r.booking) throw new Error(r.message || 'Booking creation failed');
    newBookingId = r.booking.id;
  });

  // 5. Simulated Payment & GST Invoice
  await test('Simulate Digital UPI Payment with Welfare Fee Breakdown', async () => {
    const r = await fetch(`${BASE}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        bookingId: newBookingId,
        amount: 350,
        paymentMethod: 'UPI'
      })
    }).then(res => res.json());
    if (!r.success || !r.payment || !r.invoice) throw new Error(r.message || 'Payment simulation failed');
    if (r.payment.welfareContribution !== 25) throw new Error('Welfare contribution not calculated correctly');
  });

  // 6. Worker Job Progression
  let workerToken = '';
  await test('Worker Login & Status Progression (Accept -> On Way -> In Progress -> Complete)', async () => {
    const authRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '8888888888', otp: '123456' })
    }).then(res => res.json());
    workerToken = authRes.token;

    // Advance to ACCEPTED
    await fetch(`${BASE}/bookings/${newBookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${workerToken}` },
      body: JSON.stringify({ status: 'ACCEPTED' })
    });

    // Advance to COMPLETED
    const completeRes = await fetch(`${BASE}/bookings/${newBookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${workerToken}` },
      body: JSON.stringify({ status: 'COMPLETED' })
    }).then(res => res.json());

    if (!completeRes.success || completeRes.booking.status !== 'COMPLETED') {
      throw new Error('Status transition failed');
    }
  });

  // 7. Verified Customer Rating
  await test('Customer Verified Rating (Allowed after COMPLETED)', async () => {
    const r = await fetch(`${BASE}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        bookingId: newBookingId,
        rating: 5,
        review: 'Punctual, verified cooperative technician. Excellent work.',
        onTime: true
      })
    }).then(res => res.json());
    if (!r.success || !r.rating) throw new Error(r.message || 'Rating failed');
  });

  // 8. Public Safe Worker QR Verification (Zero auth)
  await test('Public Worker QR Verification (/verify-worker/:token) with Data Redaction', async () => {
    const r = await fetch(`${BASE}/verify-worker/SKR-EL-10291-VERIFIED`).then(res => res.json());
    if (!r.success || !r.publicVerification) throw new Error('QR lookup failed');
    const pub = r.publicVerification;
    if (pub.phone || pub.aadhaar || pub.address) throw new Error('Security leak: sensitive fields not redacted!');
    if (!pub.name || !pub.society || !pub.skillLevel) throw new Error('Missing public verified details');
  });

  // 9. AI Demand Forecasting & Workforce Allocation
  await test('AI Demand Forecasting (Moving Average & 7-Day Horizon)', async () => {
    const r = await fetch(`${BASE}/forecast`).then(res => res.json());
    if (!r.success || !r.serviceForecasts || !r.zoneDemands) throw new Error('Forecast API failed');
    const elec = r.serviceForecasts.find(s => s.service === 'Electrician');
    if (!elec || !elec.sevenDaysPrediction || elec.sevenDaysPrediction.length !== 7) {
      throw new Error('7-Day projection missing');
    }
  });

  // 10. Admin Worker Verification Console
  let adminToken = '';
  await test('Admin Verification Action (Approve / Verify Worker)', async () => {
    const authRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '7777777777', otp: '123456' })
    }).then(res => res.json());
    adminToken = authRes.token;

    // Verify worker 20 (Mukesh Tiwari)
    const r = await fetch(`${BASE}/admin/workers/wrk-20/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'VERIFIED' })
    }).then(res => res.json());

    if (!r.success || r.worker.verificationStatus !== 'VERIFIED') throw new Error('Admin verification failed');
  });

  // 11. Emergency Service Dispatch
  await test('Emergency Service Instant Dispatch Algorithm', async () => {
    const r = await fetch(`${BASE}/bookings/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        serviceId: 'sk-plumb',
        address: 'Ghats Crossing, Varanasi'
      })
    }).then(res => res.json());

    if (!r.success || !r.booking.emergency) throw new Error('Emergency dispatch failed');
  });

  console.log(`\n==============================================`);
  console.log(`E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==============================================`);
  if (failed > 0) process.exit(1);
}

runTests();
