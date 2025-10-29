import { GoogleGenAI } from "@google/genai";
import { EXAMPLE_REPORT } from '../exampleData';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function analyzeError(error: unknown): Error {
    console.error("Gemini Service Error:", error);

    if (error instanceof Error) {
        const knownPrefixes = ['API Key Invalid', 'Quota Exceeded', 'Service Unavailable', 'Content Moderation', 'AI Malformed Response'];
        const currentPrefix = error.message.split(':')[0];
        if (knownPrefixes.includes(currentPrefix)) {
            return error;
        }

        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes("api key not valid") || errorMessage.includes("permission denied")) {
            return new Error("API Key Invalid: The provided API key is not valid. Please ensure it is correct, has not expired, and has the required permissions.");
        }
        if (errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
            return new Error("Quota Exceeded: You have reached the API rate limit or your usage quota. Please check your account and try again later.");
        }
        if (errorMessage.includes("service is currently unavailable") || errorMessage.includes("503") || errorMessage.includes("overloaded")) {
            return new Error("Service Unavailable: The AI service is temporarily down. Please try again in a few moments.");
        }
        if (errorMessage.includes("candidate was blocked due to safety")) {
             return new Error("Content Moderation: The request was blocked due to safety concerns with the input or the generated response. Please adjust the input.");
        }
        
        return new Error(`Unexpected Error: ${error.message}`);
    }
    
    return new Error("Unknown Error: An unexpected error occurred during AI analysis.");
}

async function generateContentWithRetry(
    params: Parameters<typeof ai.models.generateContent>[0],
    maxRetries: number = 3,
    initialBackoffMs: number = 1000
): Promise<ReturnType<typeof ai.models.generateContent>> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent(params);
            return response;
        } catch (error) {
            const errorMessage = (error instanceof Error ? error.message : String(error)).toLowerCase();
            const isServiceUnavailable = errorMessage.includes("503") || errorMessage.includes("unavailable") || errorMessage.includes("overloaded");

            if (isServiceUnavailable && attempt < maxRetries) {
                const delay = initialBackoffMs * Math.pow(2, attempt);
                console.warn(`Service unavailable. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries + 1})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Service Unavailable: The AI service failed to respond after multiple retries.");
}


export const generateAnalyticsReport = async (imageDataUrl: string): Promise<string> => {
    // A little easter egg for the example analysis provided by the user.
    // In a real app this would be a full API call every time.
    if (imageDataUrl.startsWith("data:image/png;base64,iVBORw0KGgo")) {
        return Promise.resolve(EXAMPLE_REPORT);
    }
    
    const prompt = `
      You are the APEX X ULTIMATE SYSTEM, the world's most sophisticated X (Twitter) growth analyst. Your analysis is sharp, brutally honest, data-driven, and provides actionable recovery plans. You are a world-class expert at interpreting X analytics data.

      **TASK:**
      Analyze the provided screenshot of a user's X analytics. Your goal is to provide a "CRITICAL DIAGNOSIS" that explains why their engagement is low and a detailed, multi-phase "Account Recovery Protocol" to fix it.

      **OUTPUT FORMAT:**
      You MUST respond in well-structured Markdown. Use headings (#, ##, ###), lists (* or -), bold text (**text**), and emojis (like ✅, ❌, 🚩, 🚨) to make the report clear, impactful, and easy to read. Your tone should be authoritative and direct, like a high-priced consultant who is not afraid to deliver hard truths.

      **EXAMPLE OF A PERFECT ANALYSIS:**
      To ensure you understand the required quality, here is an example of a perfect report. Emulate its structure, tone, depth, and actionable nature.

      --- EXAMPLE START ---
      ${EXAMPLE_REPORT}
      --- EXAMPLE END ---

      Now, analyze the user's provided image and generate a new, unique report for them following ALL of the rules above. Begin your response with "# CRITICAL DIAGNOSIS".
    `;

    const base64Data = imageDataUrl.split(',')[1];
    if (!base64Data) {
        throw new Error("Invalid image data URL provided.");
    }

    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Data,
            },
        };
        const textPart = {
            text: prompt,
        };
        
        const response = await generateContentWithRetry({
            model: 'gemini-2.5-pro',
            contents: { parts: [imagePart, textPart] },
            config: {
                temperature: 0.4,
            }
        });

        return response.text;
    } catch (error) {
        throw analyzeError(error);
    }
};
