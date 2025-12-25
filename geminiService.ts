
import { GoogleGenAI, Type } from "@google/genai";
import { QuizConfig, Question } from "./types";

export const generateQuizQuestions = async (config: QuizConfig): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    console.error("API_KEY topilmadi! Netlify Site Settings > Environment variables bo'limiga API_KEY qo'shing.");
    throw new Error("Tizimda API kaliti sozlanmagan. Iltimos, administrator bilan bog'laning.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Dostonbek Academy ta'lim platformasi uchun professional test savollarini yarating.
  
  Mavzu: ${config.category} - ${config.topic} - ${config.subTopic}
  Qiyinchilik: ${config.difficulty}
  Savollar soni: ${config.questionCount}
  Til: O'zbek tili
  Format: JSON array
  
  Xususiyatlar:
  1. 4 ta variant (options), bitta to'g'ri javob indeksi (0-3).
  2. Har bir savol uchun tushunarli izoh (explanation) yozing.
  3. Javob faqat JSON array formatida bo'lsin.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI tomonidan bo'sh javob qaytdi.");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    if (error.status === 403 || error.message?.includes("API key")) {
      throw new Error("API kaliti faol emas yoki noto'g'ri kiritilgan.");
    }
    throw new Error("Savollarni yaratishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
  }
};

export const analyzePerformance = async (results: any): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") return "Natijalar muvaffaqiyatli tahlil qilindi.";
  
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Talabaning natijasini tahlil qiling: ${results.score}/${results.totalQuestions} to'g'ri. Mavzu: ${results.subTopic}. Qisqa va motivatsion tahlil bering.`;
  
  try {
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text || "Yaxshi natija, o'qishdan to'xtamang!";
  } catch (e) {
    return "Natijalar tahlil qilindi. Bilim olishda davom eting!";
  }
};
