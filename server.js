const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', require('./src/routes/api'));

// Health check (important for Cloud Run)
app.get('/', (req, res) => {
    res.send('ElectraFlow AI is running');
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;