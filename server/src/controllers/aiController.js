const { default: axios } = require("axios");

// Initialize Gemini lazily using the official SDK
let genAI;

const getAI = async () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
  }

  if (!genAI) {
    const { GoogleGenAI } = await import("@google/genai");

    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return genAI;
};

// Common function to generate AI content
const MODELS = [
  "gemini-3.8-flash", // primary
  "gemini-3.7-flash", // fallback 1
  "gemini-3.5-flash-lite", // fallback 2 (lite models usually have more spare capacity)
  "gemini-3.1-flash-lite", // fallback 3
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isRetryable = (err) => {
  const msg = String(err?.message || "");
  return (
    err?.status === 503 ||
    err?.status === 429 ||
    err?.status === 500 ||
    /UNAVAILABLE|overloaded|high demand|RESOURCE_EXHAUSTED/i.test(msg)
  );
};

const generateAIContent = async (prompt, jsonMode = false) => {
  const ai = await getAI();
  let lastError;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          ...(jsonMode && {
            config: { responseMimeType: "application/json" },
          }),
        });
        return response.text;
      } catch (err) {
        lastError = err;
        if (!isRetryable(err)) throw err; // real error, don't retry
        await sleep(1000 * 2 ** attempt); // 1s, 2s, 4s
      }
    }
    console.warn(`Model ${model} unavailable, trying next...`);
  }

  throw lastError;
};

// Parse JSON response safely
const parseJSON = (text) => {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned);
};

// Handle API errors
const handleError = (res, err) => {
  console.error("Gemini API Error:", err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "AI service temporarily unavailable"
        : err.message,
  });
};

// @desc    Summarize article using Gemini AI
// @route   POST /api/ai/summarize
exports.summarizeArticle = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title && !description && !content) {
      return res.status(400).json({
        success: false,
        message: "Article content required",
      });
    }

    const articleText = `
Title: ${title || "N/A"}
Description: ${description || "N/A"}
Content: ${content || description || "N/A"}
    `.trim();

    const prompt = `
You are a professional news summarization assistant.

Analyze the following news article and provide:

1. Summary: 2-3 clear and concise sentences.
2. Key Points: 3-5 important facts.
3. Sentiment: Positive, Negative, or Neutral.
4. Category Tags: 2-3 relevant topic tags.

Article:
${articleText}

Return valid JSON with exactly this structure:
{
  "summary": "Article summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "sentiment": "Neutral",
  "tags": ["Technology", "Business"]
}
`;

    const responseText = await generateAIContent(prompt, true);
    const parsed = parseJSON(responseText);

    res.json({
      success: true,
      ...parsed,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// @desc    Ask questions about an article
// @route   POST /api/ai/ask
exports.askAboutArticle = async (req, res) => {
  try {
    const { title, description, question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = `
You are a knowledgeable news assistant.

Answer the question about the following news article.

Article Title: ${title || "N/A"}
Article Description: ${description || "N/A"}

Question: ${question}

Provide a helpful, factual and concise answer in 2-4 sentences.
If the article does not contain enough information, clearly mention that.
`;

    const answer = await generateAIContent(prompt);

    res.json({
      success: true,
      answer,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// @desc    Generate article categories/tags
// @route   POST /api/ai/tags
exports.generateTags = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: "Article title or description required",
      });
    }

    const prompt = `
Generate 5 relevant topic tags for this news article.

Title: ${title || "N/A"}
Description: ${description || "N/A"}

Return only a valid JSON array of 5 strings.
Example:
["Technology", "AI", "Business", "Innovation", "News"]
`;

    const responseText = await generateAIContent(prompt, true);
    const tags = parseJSON(responseText);

    if (!Array.isArray(tags)) {
      throw new Error("Invalid tags response from Gemini");
    }

    res.json({
      success: true,
      tags,
    });
  } catch (err) {
    handleError(res, err);
  }
};
