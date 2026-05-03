const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "models/gemini-2.0-flash";

async function generateResponse(query, language) {
    try {
        const prompt = `
You are an Election Education Assistant for India.

Explain clearly in ${language === 'hi' ? 'Hindi' : 'English'}.

User Query: ${query}

Rules:
- Step-by-step
- Simple language
- Structured response

Return ONLY valid JSON:
{
  "title": "...",
  "steps": ["..."],
  "tips": ["..."],
  "language": "${language}",
  "confidence": 0.95
}
`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        // ✅ CORRECT way (SDK safe)
        const text = response.text;

        if (!text) {
            throw new Error("Empty Gemini response");
        }

        return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Service Error:", error);

        return {
            title: "Unable to generate response",
            steps: ["Please try again later."],
            tips: ["AI service temporarily unavailable"],
            language,
            confidence: 0.1
        };
    }
}

module.exports = { generateResponse };