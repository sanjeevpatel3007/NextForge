import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini API route for dynamic crazy Next.js idea generation
  app.post('/api/generate-idea', async (req, res) => {
    try {
      const rawKey = process.env.GEMINI_API_KEY || '';
      const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
      const { domain, seniority, features, customPrompt } = req.body;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 15) {
        return res.status(200).json({
          fallback: true,
          message: 'Using built-in neural idea synthesis engine.',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Principal Next.js Architect and Creative Tech Visionary.
Generate an audacious, "crazy", portfolio-defining project idea designed for a senior/staff engineer to build as a mind-blowing demo in Next.js 15 (App Router, Server Actions, React Server Components, Streaming, Edge runtime, Optimistic UI).

User inputs:
- Target Domain: ${domain || 'Developer Tooling & Systems'}
- Seniority Level: ${seniority || 'Staff / Principal Engineer'}
- Ingredients: ${features && features.length > 0 ? features.join(', ') : 'Server Actions, React Server Components, Streaming Suspense, Edge Middleware, Canvas/WebGL'}
- Custom Request: ${customPrompt || 'Surprise me with a radical concept that combines Next.js 15 advanced primitives with high visual impact.'}

Return strictly valid JSON matching this schema:
{
  "id": "a-unique-slug",
  "title": "Short Punchy Title",
  "tagline": "Electrifying 1-sentence hook",
  "domain": "Domain category",
  "badge": "STAFF-GRADE DEMO",
  "whyCrazy": "2-3 sentences explaining why this concept breaks conventions and makes interviewers/investors gasp",
  "viralFactor": "Why this goes viral on GitHub / Twitter / Hacker News",
  "corePillars": ["Pillar 1 with technical depth", "Pillar 2 with technical depth", "Pillar 3 with technical depth"],
  "nextjs15Features": [
    { "feature": "Server Actions & useActionState", "role": "How it powers the crazy mechanic" },
    { "feature": "React Server Component Streaming", "role": "How it solves latency or streaming UI" },
    { "feature": "Optimistic UI with useOptimistic", "role": "Instant feedback loop description" },
    { "feature": "Edge Middleware / Route Handlers", "role": "Low-latency pipeline" }
  ],
  "architectureTree": [
    "app/layout.tsx",
    "app/page.tsx",
    "app/actions/engine.ts",
    "app/api/stream/route.ts",
    "components/visualizer.tsx",
    "lib/types.ts"
  ],
  "keySnippet": {
    "filename": "app/actions/engine.ts",
    "description": "Production Next.js 15 Server Action snippet demonstrating core logic",
    "code": "// Next.js 15 Server Action\\n'use server';\\n..."
  }
}`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 6500)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const text = response?.text;
      if (!text) {
        return res.status(200).json({ fallback: true });
      }

      const parsed = JSON.parse(text);
      return res.json({ success: true, idea: parsed });
    } catch (err: any) {
      console.error('Gemini error:', err);
      return res.status(200).json({ fallback: true, error: err.message });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
