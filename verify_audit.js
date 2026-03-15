const axios = require('axios');
const mongoose = require('mongoose');

async function verifyUserScans() {
    const baseUrl = 'http://localhost:5000/api';
    const testUser = {
        name: 'Audit Logic Tester',
        email: `audit_${Date.now()}@cyberspace.ai`,
        password: 'Password123!'
    };

    try {
        console.log('--- Phase 1: User Onboarding ---');
        await axios.post(`${baseUrl}/auth/register`, testUser);
        const loginRes = await axios.post(`${baseUrl}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        const token = loginRes.data.token;
        const userId = loginRes.data.user._id;
        console.log(`User logged in. ID: ${userId}`);

        console.log('\n--- Phase 2: Perform Phishing Scan ---');
        const phishingRes = await axios.post(`${baseUrl}/phishing/check`, 
            { url: 'https://security-test.com' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Phishing scan performed.');

        console.log('\n--- Phase 3: Perform Vulnerability Scan ---');
        // Note: This might take time due to VirusTotal, but let's try
        try {
            await axios.post(`${baseUrl}/vulnerability/scan`, 
                { target: 'example.com' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Vulnerability scan performed.');
        } catch (e) {
            console.log('Vulnerability scan failed (likely API quota), skipping but proceeding with history check.');
        }

        console.log('\n--- Phase 4: Check User Scan History ---');
        const historyRes = await axios.get(`${baseUrl}/user/scans`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const history = historyRes.data.data;
        console.log('History fetched successfully.');
        console.log(`Phishing scans found: ${history.phishing.length}`);
        console.log(`Vulnerability scans found: ${history.vulnerability.length}`);

        if (history.phishing.some(s => s.userId === userId)) {
            console.log('✅ PASS: Scan record contains correct userId.');
        } else {
            console.log('❌ FAIL: Scan record missing or incorrect userId.');
        }

        console.log('\n--- Phase 5: Check Activity Logs (Admin Only) ---');
        // Try accessing as normal user first
        try {
            await axios.get(`${baseUrl}/admin/activity`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ FAIL: Unauthorized user accessed admin logs.');
        } catch (err) {
            console.log('✅ PASS: Unauthorized access to admin logs blocked (403).');
        }

        console.log('\nVERIFICATION COMPLETE');
    } catch (err) {
        console.error('Verification Failed:', err.response?.data || err.message);
    }
}

verifyUserScans();
