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

  // URL inspection proxy for live websites
  app.post('/api/analyze-url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Valid URL is required' });
      }

      let targetUrl = url.trim();
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }

      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SEO-Lens/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const html = await response.text();
      const finalUrl = response.url || targetUrl;
      const status = response.status;

      res.json({
        success: true,
        url: finalUrl,
        status,
        responseTimeMs: responseTime,
        html,
      });
    } catch (err: any) {
      console.error('URL Fetch Error:', err.message);
      res.status(500).json({
        error: `Could not fetch URL: ${err.message}. If the domain blocks automated requests, try another URL or test with one of the pre-loaded sites.`,
      });
    }
  });

  // Gemini SEO Issue Diagnostic API
  app.post('/api/ai-diagnose', async (req, res) => {
    try {
      const rawKey = process.env.GEMINI_API_KEY || '';
      const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
      const { url, title, metaDescription, issues, headingsSummary, imagesSummary } = req.body;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 15) {
        return res.json({
          fallback: true,
          message: 'Gemini API key not configured. Using standard structured SEO prompt.',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an elite Senior Technical SEO Specialist and Web Architect.
Analyze the following on-page and technical SEO audit findings for: ${url || 'Current Page'}

Page Metadata:
- Title: "${title || 'N/A'}"
- Meta Description: "${metaDescription || 'N/A'}"
- Heading Overview: ${headingsSummary || 'N/A'}
- Image Audit: ${imagesSummary || 'N/A'}

Detected Issues:
${JSON.stringify(issues, null, 2)}

Provide a senior-level, crystal-clear remediation action plan in valid JSON format matching this schema:
{
  "summary": "2 sentence executive verdict on current on-page SEO health",
  "criticalFixes": [
    {
      "priority": "P0" | "P1" | "P2",
      "issue": "Brief issue title",
      "whyItMatters": "Impact on Google ranking/crawling",
      "recommendedCode": "Exact HTML/Schema snippet to copy-paste"
    }
  ],
  "titleAndMetaRewrite": {
    "recommendedTitle": "Optimized title under 60 chars",
    "recommendedDescription": "Compelling meta description between 140-155 chars with call to action",
    "rationale": "Why this will increase SERP CTR"
  },
  "schemaRecommendation": {
    "type": "Organization | Article | Product | WebSite | LocalBusiness",
    "jsonLdSnippet": "<!-- Fully formed <script type=\\"application/ld+json\\"> tag ready to paste -->"
  }
}`;

      const response: any = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response?.text;
      if (!text) {
        return res.json({ fallback: true });
      }

      const parsed = JSON.parse(text);
      return res.json({ success: true, diagnosis: parsed });
    } catch (err: any) {
      console.error('AI Diagnose Error:', err);
      return res.json({ fallback: true, error: err.message });
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
