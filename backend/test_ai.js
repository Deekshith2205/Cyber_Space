/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require('jsonwebtoken');
const axios = require('axios');

const token = jwt.sign({ id: '60d0fe4f5311236168a109ca' }, 'cyberspace_secret', { expiresIn: '1h' });

async function test() {
    try {
        const res = await axios.post('http://localhost:5000/api/ai/analyze', 
            { message: 'What is phishing?', sessionId: 'test1234' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("SUCCESS:");
        console.log(res.data);
    } catch (err) {
        console.error("ERROR:");
        if (err.response) {
            console.error(err.response.status, err.response.data);
        } else {
            console.error(err.message);
        }
    }
}
test();
