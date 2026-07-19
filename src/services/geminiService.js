import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export const analyzeDisasterRisk = async (weather, forecast) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are an AI disaster management assistant.

Current Weather:
- City: ${weather.name}
- Temperature: ${weather.main.temp}°C
- Humidity: ${weather.main.humidity}%
- Wind Speed: ${weather.wind.speed} m/s
- Condition: ${weather.weather[0].description}

Upcoming Forecast:
${forecast.list
  .slice(0, 3)
  .map(
    (f) =>
      `${f.dt_txt}: ${f.weather[0].description}, Temp ${f.main.temp}°C`
  )
  .join("\n")}

Respond ONLY in this format:

Risk Level:
Primary Threat:
Recommendation:
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI analysis unavailable.";
  }
};