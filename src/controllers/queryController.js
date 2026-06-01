const {
    getQueryHash,
    getCachedResponse,
    saveCache,
    logRequest,
    updateSession
} = require('../services/firestoreService');

const { generateResponse } = require('../services/geminiService');

function detectIntent(query) {
    const q = query.toLowerCase();

    if (q.includes("vote") || q.includes("election")) return "voting_info";
    if (q.includes("register") || q.includes("id")) return "registration";
    if (q.includes("where") || q.includes("location")) return "polling_location";
    if (q.includes("how")) return "procedure";

    return "general_query";
}

async function handleQuery(req, res) {
    const { query, language = 'en', accessibilityMode = false } = req.body;
    
    const sessionId =
        req.body.sessionId ||
        req.headers['x-session-id'] ||
        `session_${Date.now()}`;

    if (!query) {
        return res.status(400).json({ error: 'Query required' });
    }

    const start = Date.now();
    const hash = getQueryHash(query, language, accessibilityMode);

    // 1. Check cache
    let response = await getCachedResponse(hash);
    let source = 'Cache';

    if (!response) {
        // 2. Call Gemini
        response = await generateResponse(query, language, accessibilityMode);
        source = 'Gemini';

        // 3. Save cache (only if confidence is reasonable)
        if (response.confidence >= 0.5) {
            await saveCache(hash, response);
        }
    }

    const responseTime = Date.now() - start;

    // 4. Log
    await logRequest({ query, language, source, responseTime });

    // 5. Session
    await updateSession({
        sessionId,
        language,
        lastQuery: query,
        lastIntent: detectIntent(query)
    });

    if (response.isRateLimit) {
        return res.status(429).json({
            status: 'error',
            error: 'rate_limit',
            data: response,
            meta: { source, responseTime }
        });
    }

    return res.json({
        status: 'success',
        data: response,
        meta: { source, responseTime }
    });
}

module.exports = { handleQuery };