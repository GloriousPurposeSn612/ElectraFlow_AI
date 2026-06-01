const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "models/gemini-3.5-flash";

async function generateResponse(query, language, accessibilityMode = false) {
    try {
        const prompt = `
You are an Election Education Assistant for India.

Explain clearly in ${language === 'hi' ? 'Hindi' : 'English'}.
${accessibilityMode ? '\nFormat for accessibility: Keep sentences short, avoid complex jargon, and use highly descriptive text.\n' : ''}
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

        const isRateLimit = error.status === 429 || 
                            error.message?.includes('429') || 
                            error.message?.includes('quota') ||
                            error.message?.includes('RESOURCE_EXHAUSTED');

        return {
            title: isRateLimit ? "Rate Limit Reached (5 req/min)" : "Unable to generate response",
            steps: isRateLimit 
                ? [
                    "We have hit the Gemini API free-tier rate limits (5 requests/minute).",
                    "Please wait a few seconds and try again.",
                    "Tip: Asking a question that was asked before will load instantly from the cache!"
                  ]
                : ["Please try again later."],
            tips: isRateLimit 
                ? ["Rate limits keep this free trial demo running safely. Thank you for your patience!"]
                : ["AI service temporarily unavailable"],
            language,
            confidence: 0.1,
            isRateLimit: isRateLimit
        };
    }
}

module.exports = { generateResponse };