require('dotenv').config();
const { handleQuery } = require('./src/controllers/queryController');

async function test() {
    const req = {
        body: {
            query: 'How to vote in elections 2026?',
            language: 'en',
            sessionId: 'test-session-123'
        }
    };

    const res = {
        status: function(code) {
            console.log('Status:', code);
            return this;
        },
        json: function(data) {
            console.log('Response JSON:', JSON.stringify(data, null, 2));
            return this;
        }
    };

    console.log('Testing handleQuery...');
    await handleQuery(req, res);
    console.log('Test complete.');
}

test();
