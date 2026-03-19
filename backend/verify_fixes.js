const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('--- Starting API Verification ---');

    try {
        // 1. Test Ping
        const pingRes = await axios.get('http://localhost:5000/ping');
        console.log('✅ Backend Ping:', pingRes.data);

        // 2. Test Vulnerability Scan
        console.log('Testing Vulnerability Scan for google.com...');
        try {
            await axios.post(`${BASE_URL}/vulnerability/scan`, { target: 'google.com' });
        } catch (error) {
            console.log('Vulnerability Scan endpoint responded with status:', error.response?.status);
            if (error.response && error.response.status === 401) {
                console.log('✅ Vulnerability Scan endpoint is protected by Auth as expected.');
            } else if (error.response && error.response.status === 404) {
                console.log('❌ Vulnerability Scan endpoint NOT FOUND (404). Check scanRoutes.ts');
            }
        }

        // 3. Test Profile Update
        try {
            await axios.put(`${BASE_URL}/user/update`, { name: 'Test' });
        } catch (error) {
            console.log('User Update endpoint responded with status:', error.response?.status);
            if (error.response && error.response.status === 401) {
                console.log('✅ User Update endpoint is protected by Auth as expected.');
            } else if (error.response && error.response.status === 404) {
                console.log('❌ User Update endpoint NOT FOUND (404). Check userRoutes.ts');
            }
        }

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

testEndpoints();
