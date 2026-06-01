require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function listModels() {
    const response = await ai.models.list();
    if (response.pageInternal) {
        console.log("pageInternal type:", typeof response.pageInternal);
        console.log("pageInternal Is array:", Array.isArray(response.pageInternal));
        console.log("pageInternal Keys:", Object.keys(response.pageInternal));
        if (Array.isArray(response.pageInternal)) {
            console.log("Model names:", response.pageInternal.map(m => m.name));
        }
    }
}

listModels();