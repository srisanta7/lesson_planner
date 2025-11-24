import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GradeLevel, QuizData } from "../types";

// Initialize the API client
// CRITICAL: process.env.API_KEY is assumed to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";

/**
 * Generates a structured lesson plan based on topic and grade level.
 */
export const generateLessonPlan = async (topic: string, grade: GradeLevel, duration: string): Promise<string> => {
  try {
    const prompt = `
      Create a comprehensive lesson plan for a ${grade} class about "${topic}".
      The lesson is ${duration} minutes long.
      
      Structure the response with the following headers using Markdown:
      # Lesson Title
      ## Objectives
      ## Materials Needed
      ## Warm-up (${Math.floor(parseInt(duration) * 0.15)} mins)
      ## Main Activity (${Math.floor(parseInt(duration) * 0.6)} mins)
      ## Wrap-up & Assessment (${Math.floor(parseInt(duration) * 0.25)} mins)
      ## Homework/Extension
      
      Keep the tone professional yet encouraging.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Lesson Plan Error:", error);
    throw new Error("Failed to generate lesson plan. Please try again.");
  }
};

/**
 * Generates a JSON formatted quiz.
 */
export const generateQuiz = async (topic: string, grade: GradeLevel, count: number): Promise<QuizData> => {
  try {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A creative title for the quiz" },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of 4 multiple choice options"
              },
              correctAnswer: { type: Type.STRING, description: "Must match one of the options exactly" },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      },
      required: ["title", "questions"]
    };

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `Generate a ${count}-question multiple choice quiz about "${topic}" for ${grade} students.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    return JSON.parse(jsonText) as QuizData;
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    throw new Error("Failed to generate quiz.");
  }
};

/**
 * Generates an educational illustration.
 */
export const generateEducationalImage = async (prompt: string): Promise<string> => {
  try {
    // We append specific style instructions for educational content
    const enhancedPrompt = `A clear, high-quality educational illustration of: ${prompt}. 
    Style: Vibrant, clean lines, suitable for a textbook or classroom presentation. 
    Avoid text inside the image if possible. White background preferred.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: enhancedPrompt,
      config: {
        // No responseMimeType for image generation models in this context usually, 
        // but we just need to parse the parts.
      }
    });

    // Iterate through parts to find the image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Failed to generate visual aid.");
  }
};
