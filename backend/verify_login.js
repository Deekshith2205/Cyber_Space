const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
    console.log('--- Starting Login Verification ---');
    
    try {
        // 1. Test Login with Missing Fields
        console.log('Testing login with missing fields...');
        try {
            await axios.post(`${BASE_URL}/auth/login`, {});
        } catch (error) {
            console.log('Response:', error.response?.status, error.response?.data);
            if (error.response?.status === 400 && error.response?.data?.message === "Email and password required") {
                console.log('✅ Correctly handled missing fields.');
            }
        }

        // 2. Test Login with Non-existent User
        console.log('\nTesting login with non-existent user...');
        try {
            await axios.post(`${BASE_URL}/auth/login`, { email: 'nonexistent@test.com', password: 'password123' });
        } catch (error) {
            console.log('Response:', error.response?.status, error.response?.data);
            if (error.response?.status === 400 && error.response?.data?.message === "User not found") {
                console.log('✅ Correctly handled non-existent user.');
            }
        }

        // 3. Test Login with Invalid Password (assuming we can find a user)
        // I'll skip this if I don't know a user, but let's try 'agent@cyberspace.ai' if it exists.
        console.log('\nTesting login with invalid password (if user exists)...');
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, { email: 'agent@cyberspace.ai', password: 'wrongpassword' });
            console.log('Response (unexpected success):', res.status);
        } catch (error) {
            console.log('Response:', error.response?.status, error.response?.data);
            if (error.response?.status === 400 && error.response?.data?.message === "Invalid credentials") {
                console.log('✅ Correctly handled invalid password.');
            } else if (error.response?.status === 400 && error.response?.data?.message === "User not found") {
                console.log('ℹ️ User "agent@cyberspace.ai" not found, skipping password test.');
            }
        }

    } catch (error) {
        console.error('❌ Verification script error:', error.message);
    }
}

testLogin();
