// // server/services/geminiService.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function getGraphInsights(summary) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//     You are an AI analyst. 
//     Given the following summary of a graph:
//     "${summary}"
//     Provide:
//     1. Key observations
//     2. Trends/patterns
//     3. Business/academic insights
//     Keep it short, structured, and useful.
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//     // const result = await genAI.generateContent({
//     //   model: "text-bison-001",  // Updated model
//     //   prompt: prompt,
//     //   temperature: 0.7,          // Optional: adjust creativity
//     //   maxOutputTokens: 500       // Optional: adjust response length
//     // });

//     return result.output[0].content[0].text;
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     return "Could not generate insights.";
//   }
// }

// module.exports = { getGraphInsights };
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGraphInsights(summary) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an AI analyst. 
    Given the following summary of a graph:
    "${summary}"
    Provide:
    1. Key observations
    2. Trends/patterns
    3. Business/academic insights
    Keep it short, structured, and useful.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate insights.";
  }
}

module.exports = { getGraphInsights };
