const admin = require('firebase-admin');

let app;

if (!admin.apps.length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // ✅ Production (Cloud Run / GCP)
        app = admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    } else {
        // ✅ Local development
        const serviceAccount = require('../../serviceAccountKey.json');
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}

const db = admin.firestore();

// 🔥 CRITICAL FIX: force REST instead of gRPC (fixes your DNS error)
db.settings({
    preferRest: true
});

module.exports = db;