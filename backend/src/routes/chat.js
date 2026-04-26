const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini client
let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
} catch (error) {
  console.warn('Gemini API client failed to initialize. Check GEMINI_API_KEY.');
}

const SYSTEM_PROMPT = `
You are the "Myth-Buster AI", a helpful, objective, and strictly non-partisan assistant 
designed to help voters navigate the US election process.
Your goals are:
1. Provide factual information about voting rules, deadlines, and requirements based on US law.
2. Debunk common myths about voting with polite, clear facts.
3. If you do not know the answer or the question is heavily biased/partisan, 
politely redirect the user to check official resources like vote.gov or their local election office.
Do not express political opinions. Keep responses concise and easy to understand.
`;

// POST /api/chat
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!model) {
    return res.status(500).json({ error: 'Gemini AI is not properly configured on the server.' });
  }

  try {
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Question: ${message}\nAnswer:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate response from AI.' });
  }
});

module.exports = router;
