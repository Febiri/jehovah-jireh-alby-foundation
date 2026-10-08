// End-to-end automated test suite for Jehovah Jireh Alby Foundation
// Credentials are read from the environment (.env) — never hardcode real passwords here.
try { require('dotenv').config({ path: require('path').join(__dirname, '.env') }); } catch (e) { /* dotenv optional */ }
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('JEHOVAH JIREH ALBY FOUNDATION - COMPREHENSIVE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Check Settings API & Official Foundation Wording
    console.log('\n--- 1. Testing Foundation Wording & Settings ---');
    const settingsRes = await fetch(`${BASE_URL}/api/settings`).then(r => r.json());
    assert(settingsRes.success === true, 'Settings API responds successfully');
    const s = settingsRes.data;

    assert(
      s.description.includes('caring for orphans, street children, vulnerable children and the needy'),
      'Official description matches corrected wording'
    );
    assert(
      s.mission === 'To provide food, shelter, education, medical support and spiritual guidance to orphaned and less privileged children in Ghana.',
      'Official mission matches corrected wording'
    );
    assert(
      s.vision === 'To see every vulnerable child smile, thrive, and know that God provides.',
      'Official vision matches exact supplied wording'
    );
    assert(s.motto === 'The Lord will provide', 'Official motto matches corrected wording');
    assert(s.scripture === 'Genesis 22:14', 'Scripture reference is Genesis 22:14');
    assert(s.phone === '0248072279', 'Official phone is 0248072279');
    assert(s.email === 'Jehovahjirehalbyfoundation@gmail.com', 'Official email matches exactly');
    assert(s.tiktok === '@jjaf_ghana', 'TikTok handle is @jjaf_ghana');
    assert(s.instagram === 'Jehovah jireh Alby Foundation', 'Instagram handle is Jehovah jireh Alby Foundation');
    assert(s.snapchat === 'jjaf.foundation', 'Snapchat handle is jjaf.foundation');

    // 2. What We Do Programs
    console.log('\n--- 2. Testing What We Do Programs ---');
    const whatRes = await fetch(`${BASE_URL}/api/what-we-do`).then(r => r.json());
    assert(whatRes.success === true, 'What We Do API responds');
    assert(whatRes.data.length === 5, 'Exactly 5 supplied activities are present');
    assert(whatRes.data.some(w => w.title.includes('orphanage homes')), 'Donation to orphanage homes present');
    assert(whatRes.data.some(w => w.title.includes('Food and clothing Drives')), 'Food and clothing drives present');
    assert(whatRes.data.some(w => w.title.includes('mattresses')), 'School supplies and mattresses present');
    assert(whatRes.data.some(w => w.title.includes('Medical and health support')), 'Medical and health support present');
    assert(whatRes.data.some(w => w.title.includes('Spiritual encouragement')), 'Spiritual encouragement present');

    // 3. Current Project & Dynamic Date Status
    console.log('\n--- 3. Testing Current Project & Dynamic Date Status ---');
    const projRes = await fetch(`${BASE_URL}/api/projects`).then(r => r.json());
    assert(projRes.success === true, 'Projects API responds');
    const cherubsProject = projRes.data.find(p => p.title.includes('cherubs orphanage home'));
    assert(!!cherubsProject, 'Cherubs orphanage home project exists');
    assert(cherubsProject.location === 'Santasi Apire', 'Cherubs location is Santasi Apire');
    assert(cherubsProject.time === 'Wednesday: morning 9am', 'Cherubs time is Wednesday: morning 9am');
    assert(
      cherubsProject.status === 'completed',
      `Cherubs project status dynamically resolved to "completed" because 30 Sept 2026 is past: status=${cherubsProject.status}`
    );

    // 4. Test Public Donation Submission
    console.log('\n--- 4. Testing Public Donation Form Submission ---');
    const donateRes = await fetch(`${BASE_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donor_name: 'Sister Bernice Mensah',
        email: 'bernice@example.com',
        phone: '0248072279',
        amount: 350,
        currency: 'GHS',
        frequency: 'one-time',
        payment_method: 'Mobile Money',
        message: 'Praying for all the children at Cherubs orphanage!',
        is_anonymous: false
      })
    }).then(r => r.json());
    assert(donateRes.success === true, 'Donation successfully submitted');
    assert(donateRes.data.transaction_ref.startsWith('JJAF-'), 'Unique transaction reference generated');
    assert(donateRes.data.payment_status === 'Pending', 'Pledge stored as Pending until admin confirms (no fake Completed)');
    const donationRef = donateRes.data.transaction_ref;

    // 5. Test Public Contact Message Submission
    console.log('\n--- 5. Testing Public Contact Form Submission ---');
    const contactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kwame Asante',
        email: 'kwame@asante.org',
        phone: '0501234567',
        subject: 'Volunteering for food drive',
        message: 'Greetings in Christ. I would love to volunteer for the upcoming community outreach in Kumasi.'
      })
    }).then(r => r.json());
    assert(contactRes.success === true, 'Contact message submitted and saved to database');
    const messageId = contactRes.data.id;

    // 6. Test Security & Protected Admin Routes (Without Token)
    console.log('\n--- 6. Testing Security & Protected Admin Route Protection ---');
    const unauthStats = await fetch(`${BASE_URL}/api/admin/stats`);
    assert(unauthStats.status === 401, 'Unauthorized request to /api/admin/stats is blocked (401)');
    const unauthProjectPost = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Project' })
    });
    assert(unauthProjectPost.status === 401, 'Unauthorized project creation is blocked (401)');

    // 7. Test Admin Login with Wrong and Correct Credentials
    console.log('\n--- 7. Testing Admin Authentication ---');
    const badLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@jjafoundation.org', password: 'WrongPassword123' })
    }).then(r => r.json());
    assert(badLogin.success === false, 'Invalid password is rejected');

    const goodLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@jjafoundation.org', password: process.env.ADMIN_PASSWORD || 'jjaf2024!' })
    }).then(r => r.json());
    assert(goodLogin.success === true && !!goodLogin.token, 'Admin login succeeds with valid JWT token');
    const adminToken = goodLogin.token;

    // 8. Test Admin Dashboard Stats API
    console.log('\n--- 8. Testing Admin Dashboard Stats ---');
    const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(statsRes.success === true, 'Admin stats retrieved successfully');
    assert(statsRes.data.totalProjects >= 3, 'Total projects counted');
    assert(statsRes.data.totalDonationsCount >= 4, 'Includes new donation');
    assert(statsRes.data.unreadMessages >= 1, 'Unread messages tracked');

    // 9. Test Project Management (Create, Edit, Delete)
    console.log('\n--- 9. Testing Project Management CRUD ---');
    const createProjRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Santasi Community Health & Hygiene Drive',
        date: '2026-11-20',
        time: 'Friday: 9:00 AM',
        location: 'Santasi Apire Clinic Grounds',
        description: 'Providing hygiene essentials, soaps, toothbrushes, and health screenings for orphans.',
        image: '/images/medical-support.jpg',
        status_mode: 'auto',
        featured: false
      })
    }).then(r => r.json());
    assert(createProjRes.success === true, 'Admin can create new project');
    const newProjectId = createProjRes.data.id;

    // Edit project
    const editProjRes = await fetch(`${BASE_URL}/api/projects/${newProjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Santasi Community Health & Hygiene Drive - Updated',
        status_mode: 'upcoming'
      })
    }).then(r => r.json());
    assert(editProjRes.success === true && editProjRes.data.title.includes('Updated'), 'Admin can update project');

    // Delete project
    const delProjRes = await fetch(`${BASE_URL}/api/projects/${newProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(delProjRes.success === true, 'Admin can delete project');

    // 10. Test Gallery Management (Create, Delete)
    console.log('\n--- 10. Testing Gallery Management CRUD ---');
    const createGalRes = await fetch(`${BASE_URL}/api/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Blessing at Santasi Apire',
        caption: 'Children smiling warmly with food and learning packs.',
        category: 'Orphanage Visits',
        image: '/images/cherubs-outreach.jpg',
        featured: false
      })
    }).then(r => r.json());
    assert(createGalRes.success === true, 'Admin can upload/add gallery item');
    const newGalId = createGalRes.data.id;

    const delGalRes = await fetch(`${BASE_URL}/api/gallery/${newGalId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(delGalRes.success === true, 'Admin can delete gallery item');

    // 11. Test Admin Donation Log & Filtering
    console.log('\n--- 11. Testing Admin Donation Review & Privacy ---');
    const adminDonationsRes = await fetch(`${BASE_URL}/api/donations?search=Bernice`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(adminDonationsRes.success === true, 'Admin can fetch filtered donations');
    assert(
      adminDonationsRes.data.some(d => d.transaction_ref === donationRef),
      'Submitted donation by Sister Bernice is properly recorded in admin dashboard'
    );

    // 12. Test Contact Message Review & Status Update
    console.log('\n--- 12. Testing Message Management & Status Toggle ---');
    const updateMsgRes = await fetch(`${BASE_URL}/api/messages/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'read' })
    }).then(r => r.json());
    assert(updateMsgRes.success === true && updateMsgRes.data.status === 'read', 'Admin can mark message as read');

    // 13. Test Settings Update (Dynamic Reflection)
    console.log('\n--- 13. Testing Dynamic Settings Update ---');
    const updateSettingsRes = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        momo_instructions: 'Official MoMo verified: Send support to 0248072279 with reference name.'
      })
    }).then(r => r.json());
    assert(updateSettingsRes.success === true, 'Admin can update website settings');

    // Verify change is immediately visible publicly
    const verifyPublicSettings = await fetch(`${BASE_URL}/api/settings`).then(r => r.json());
    assert(
      verifyPublicSettings.data.momo_instructions.includes('Official MoMo verified'),
      'Public settings automatically reflect administrator updates'
    );

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exit(1);
  }
}

runTests();
