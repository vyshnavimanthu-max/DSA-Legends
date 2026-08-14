import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Gemini AI Explanations
  app.post("/api/explain", async (req, res) => {
    try {
      const { code, challengeTitle, language, problemStatement } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
You are an expert Coding Coach and Algorithms Tutor. Analyze this user's DSA code in detail.

Challenge Title: ${challengeTitle}
Programming Language: ${language}
Problem Statement:
${problemStatement}

User Code:
\`\`\`${language}
${code}
\`\`\`

Provide a professional, clear response with:
1. **Status Review**: Tell the user if the approach is correct, optimal, or has potential bugs/edge-cases.
2. **Complexity Analysis**: Provide formal Big-O time and space complexity with clear justifications for this specific code.
3. **Optimization Advice**: How could they make it faster or consume less space? Give clear, brief recommendations.
4. **Key Concept Explanation**: Briefly explain the core algorithm design paradigm (e.g. dynamic programming, sliding window, binary search) used here.

Make your tone technical, encouraging, and highly helpful. Return the response in clean, easy-to-read Markdown.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "An error occurred while calling the Gemini API" });
    }
  });

  // API route for AI Mentor Chat companion
  app.post("/api/mentor", async (req, res) => {
    try {
      const { message, history, currentTopic, guardianName, userPoints } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct history context
      let contextHistory = "";
      if (history && Array.isArray(history)) {
        contextHistory = history.map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Mentor'}: ${msg.content}`).join("\n");
      }

      const prompt = `
You are Cyber-Tutor Oris, a legendary AI Coding Mentor in a high-tech gamified DSA (Data Structures and Algorithms) training simulator. 
The student is currently operating the guardian archetype "${guardianName || "BinaryBlade"}" and has gathered ${userPoints || 0} XP points in their journey.
The current learning focus is: ${currentTopic || "General Data Structures"}.

Chat History with Student:
${contextHistory}

New student query/action: "${message}"

Respond as Oris. Follow these rules strictly:
1. **Explain with High Clarity**: If they ask about a DSA concept (like DP, Linked Lists, Dijkstra's, Sorting, Trees), explain it with a structured, intuitive cyber-themed analogy, including Big-O complexity.
2. **Provide Strategic Hints**: If they ask for a coding hint or are stuck, do NOT give the exact code immediately. Instead, guide them step-by-step using pseudo-code guidelines or logical checkpoints.
3. **Keep it Gamified & Cyberpunk**: Use light cyberpunk flavor words (e.g. "subroutine", "register", "neural link", "complexity firewall"), but keep the actual technical concepts highly accurate and rigorous.
4. **Motivational Surge**: Ensure you sound motivating, epic, and encouraging. Push them to optimize their constants and break through runtime limit barriers!
5. **Clear Formatting**: Use beautiful, clean Markdown headings, tables, or bold terms.

Return the response in pristine, clear Markdown. Keep responses relatively concise but technically rich.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("AI Mentor Endpoint Error:", error);
      res.status(500).json({ error: error?.message || "An error occurred in Oris AI Mentor processor" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
