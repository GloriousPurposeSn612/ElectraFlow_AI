const db = require('./src/config/firebase');

db.collection('test').add({ check: "working" })
    .then(() => {
        console.log("✅ Firestore connected");
        process.exit();
    })
    .catch(err => {
        console.error("❌ Error:", err);
        process.exit(1);
    });