const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ideally move API key to a .env file — this is just for demo
const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);

// 🔧 Define the model once globally
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const explainDiff = async (diff) => {
  const prompt = `Explain the following git diff like I'm a junior developer:\n\n${diff}`;

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const response = await result.response;
    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation generated.";
    return text;
  } catch (err) {
    console.error("Gemini Error:", err.message);
    throw new Error("Failed to get explanation from Gemini");
  }
};

const handleCustomQuestion = async (diff, question) => {
  const prompt = `
                  You are a senior software engineer helping a junior developer understand a git commit.
                  Here is the git diff:
                  \`\`\`diff
                  ${diff}
                  \`\`\`
                  The developer asked: "${question}"
                  Please provide a clear, concise, and helpful explanation.
                  `;

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const response = await result.response;
    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    const ensureString = (input) => {
      if (typeof input === "string") return input;
      try {
        return JSON.stringify(input, null, 2);
      } catch {
        return "Invalid LLM response";
      }
    };
    return ensureString(text);
  } catch (err) {
    console.error("LLM (custom question) error:", err.message);
    throw new Error("Failed to process question with Gemini.");
  }
};

module.exports = {
  explainDiff,
  handleCustomQuestion,
};
