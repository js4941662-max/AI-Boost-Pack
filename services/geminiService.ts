
import { GoogleGenAI, GenerateContentRequest, GenerateContentResponse, Content, Part } from "@google/genai";
import { EXAMPLE_IMAGE_DATA_URL, EXAMPLE_REPLIES } from '../exampleData';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function analyzeError(error: unknown): Error {
    console.error("Gemini Service Error:", error);

    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            return new Error("API Key Invalid: Your API key is not valid. Please ensure it is correct and has the necessary permissions.");
        }
        if (error.message.includes("quota")) {
            return new Error("Quota Exceeded: You have exceeded your API quota. Please check your Google AI Platform billing.");
        }
        if (error.message.includes("429")) {
            return new Error("Rate Limit Exceeded: Too many requests. Please wait a moment and try again.");
        }
        if (error.message.includes("500") || error.message.includes("503")) {
            return new Error("Service Unavailable: The AI service is temporarily down. Please try again later.");
        }
        if (error.message.includes("safety")){
             return new Error("Content Moderation: The request or response was blocked due to safety settings.");
        }
        return new Error(`An unexpected error occurred: ${error.message}`);
    }
    
    return new Error("An unknown error occurred during the AI request.");
}

async function generateContentWithRetry(
    params: GenerateContentRequest,
    maxRetries: number = 3,
    initialBackoffMs: number = 1000
): Promise<GenerateContentResponse> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent(params);
            if (!response.text) {
                console.error("Malformed AI Response:", response);
                throw new Error("AI Malformed Response: The response from the AI was empty or malformed.");
            }
            return response;
        } catch (error) {
            const errorMessage = (error instanceof Error ? error.message : String(error)).toLowerCase();
            const isServiceUnavailable = errorMessage.includes("503") || errorMessage.includes("unavailable") || errorMessage.includes("overloaded");

            if (isServiceUnavailable && attempt < maxRetries) {
                const delay = initialBackoffMs * Math.pow(2, attempt) + Math.random() * 1000;
                console.warn(`Service unavailable. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Service Unavailable: The AI service failed to respond after multiple retries.");
}


export const generateReplySuggestions = async (imageDataUrl: string): Promise<string> => {
    const prompt = `
      You are "Echo", an expert social media strategist specializing in crafting engaging replies for X (formerly Twitter).
      Your goal is to help users build their personal brand by providing high-quality, context-aware responses.

      Analyze the provided screenshot of a tweet. Based on its content, tone, and any visible context (like author, likes, etc.), generate 3-5 distinct reply suggestions.

      **CRITICAL INSTRUCTIONS:**
      1.  **Output Format:** Respond ONLY with a valid JSON object. Do not include any text, code block markers (\`\`\`json), or explanations before or after the JSON.
      2.  **JSON Structure:** The JSON object must have a single key "suggestions", which is an array of objects. Each object in the array represents one reply suggestion and must have two keys:
          - "style": A one-word description of the reply's tone (e.g., "Insightful", "Humorous", "Question", "Supportive", "Professional", "Sarcastic").
          - "text": The reply text, which must be 280 characters or less.
      3.  **Reply Quality:**
          - **Be Contextual:** Your replies must directly relate to the content of the tweet in the image.
          - **Add Value:** Each reply should either add a new perspective, ask a thoughtful question, or provide a clever/funny take. Avoid generic replies like "Great post!" or "I agree!".
          - **Be Concise:** Keep it short and punchy, as is natural on X.
          - **Vary the Style:** Provide a mix of different styles for the user to choose from.

      **EXAMPLE JSON OUTPUT FORMAT:**
      {
        "suggestions": [
          {
            "style": "Insightful",
            "text": "This really highlights the shift towards decentralized product development. It's not just about building in public, but building *with* the public."
          },
          {
            "style": "Humorous",
            "text": "So you're saying I should stop yelling my feature requests into the void and actually... talk to users? Wild concept."
          },
          {
            "style": "Question",
            "text": "Great point! How do you balance that rapid feedback loop with maintaining a long-term, cohesive product vision?"
          }
        ]
      }

      Now, analyze the user's provided tweet image and generate the JSON response.
    `;

    const base64Data = imageDataUrl.split(',')[1];
    if (!base64Data) {
        throw new Error("Invalid image data URL provided.");
    }

    try {
        const imagePart: Part = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Data,
            },
        };
        const textPart: Part = {
            text: prompt,
        };
        
        const contents: Content[] = [{
            parts: [textPart, imagePart]
        }];
        
        const response = await generateContentWithRetry({
            model: 'gemini-pro-vision',
            contents: contents,
            config: {
                temperature: 0.5,
                responseMimeType: "application/json",
            }
        });

        const text = response.text;
        if (!text) {
             throw new Error("AI Malformed Response: The response from the AI was empty.");
        }
        // Basic validation to ensure it's likely JSON
        if (!text.trim().startsWith('{') || !text.trim().endsWith('}')) {
            console.error("Invalid JSON response from AI:", text);
            throw new Error("AI Malformed Response: The AI did not return a valid JSON object.");
        }
        return text;
    } catch (error) {
        throw analyzeError(error);
    }
};
