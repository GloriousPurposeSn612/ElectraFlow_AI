const db = require('../config/firebase');

// Normalize query
function getQueryHash(query, language) {
    return query
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "_") + `_${language}`;
}

// Check cache
async function getCachedResponse(hash) {
    const snapshot = await db.collection('queryCache')
        .where('queryHash', '==', hash)
        .get();

    if (!snapshot.empty) {
        return snapshot.docs[0].data().response;
    }
    return null;
}

// Save cache
async function saveCache(hash, response) {
    await db.collection('queryCache').add({
        queryHash: hash,
        response,
        createdAt: new Date()
    });
}

// Log request
async function logRequest(data) {
    await db.collection('logs').add({
        ...data,
        timestamp: new Date()
    });
}

// Update session
async function updateSession(data) {
    await db.collection('sessions').add({
        ...data,
        timestamp: new Date()
    });
}

module.exports = {
    getQueryHash,
    getCachedResponse,
    saveCache,
    logRequest,
    updateSession
};