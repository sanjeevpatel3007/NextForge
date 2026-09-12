import { SEOReport, HeadingItem, ImageItem, LinkItem, SchemaBlock, CriticalIssue } from '../types';

export function parseHTMLToSEOReport(htmlString: string, currentUrl: string, statusCode = 200, responseTime = 120): SEOReport {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(currentUrl);
  } catch {
    parsedUrl = new URL('https://example.com');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Title
  const titleTag = doc.querySelector('title');
  const title = titleTag ? (titleTag.textContent || '').trim() : '';
  const titleLength = title.length;

  // Meta helpers
  const getMeta = (nameOrProperty: string): string => {
    const el = doc.querySelector(`meta[name="${nameOrProperty}" i], meta[property="${nameOrProperty}" i]`);
    return el ? (el.getAttribute('content') || '').trim() : '';
  };

  const metaDescription = getMeta('description');
  const metaDescriptionLength = metaDescription.length;
  const canonicalEl = doc.querySelector('link[rel="canonical"]');
  const canonical = canonicalEl ? (canonicalEl.getAttribute('href') || '').trim() : '';
  const robots = getMeta('robots') || getMeta('googlebot') || 'index, follow';
  const viewport = getMeta('viewport');
  const charsetEl = doc.querySelector('meta[charset]');
  const charset = charsetEl ? (charsetEl.getAttribute('charset') || '').toUpperCase() : (doc.characterSet || 'UTF-8');
  const language = doc.documentElement.getAttribute('lang') || 'en';
  const author = getMeta('author');
  const keywords = getMeta('keywords');

  // Open Graph
  const openGraph = {
    title: getMeta('og:title') || title,
    description: getMeta('og:description') || metaDescription,
    image: getMeta('og:image'),
    url: getMeta('og:url') || canonical,
    type: getMeta('og:type') || 'website',
    siteName: getMeta('og:site_name'),
  };

  // Twitter Card
  const twitterCard = {
    card: getMeta('twitter:card') || 'summary_large_image',
    title: getMeta('twitter:title') || openGraph.title,
    description: getMeta('twitter:description') || openGraph.description,
    image: getMeta('twitter:image') || openGraph.image,
    site: getMeta('twitter:site'),
  };

  // Headings
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headings: HeadingItem[] = [];
  headingElements.forEach((el) => {
    const level = el.tagName.toLowerCase() as HeadingItem['level'];
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (text) {
      headings.push({ level, text });
    }
  });

  // Images
  const imgElements = doc.querySelectorAll('img');
  const images: ImageItem[] = [];
  imgElements.forEach((img, idx) => {
    const src = img.getAttribute('src') || '';
    const rawAlt = img.getAttribute('alt');
    const hasAlt = rawAlt !== null;
    const alt = rawAlt ? rawAlt.trim() : '';
    const isEmptyAlt = hasAlt && alt.length === 0;
    const isDecorative = isEmptyAlt || img.getAttribute('role') === 'presentation';

    images.push({
      id: `img-${idx + 1}`,
      src,
      alt,
      hasAlt,
      isEmptyAlt,
      isDecorative,
      width: parseInt(img.getAttribute('width') || '0', 10) || undefined,
      height: parseInt(img.getAttribute('height') || '0', 10) || undefined,
    });
  });

  // Links
  const linkElements = doc.querySelectorAll('a[href]');
  const sampleLinks: LinkItem[] = [];
  let internalCount = 0;
  let externalCount = 0;
  let nofollowCount = 0;

  linkElements.forEach((a) => {
    const href = a.getAttribute('href') || '';
    const text = (a.textContent || '').trim().slice(0, 100);
    const rel = (a.getAttribute('rel') || '').toLowerCase();
    const isNofollow = rel.includes('nofollow');
    const target = a.getAttribute('target') || '';

    let isInternal = false;
    if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?') || href.includes(parsedUrl.hostname)) {
      isInternal = true;
      internalCount++;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      externalCount++;
    }

    if (isNofollow) nofollowCount++;

    if (sampleLinks.length < 50 && href && !href.startsWith('javascript:')) {
      sampleLinks.push({
        href,
        text: text || '(No anchor text)',
        isInternal,
        isNofollow,
        hasTargetBlank: target === '_blank',
      });
    }
  });

  // Schemas (JSON-LD)
  const schemaScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const schemaData: SchemaBlock[] = [];
  schemaScripts.forEach((script) => {
    const rawJson = script.textContent || '';
    try {
      const parsed = JSON.parse(rawJson);
      let type = 'Unknown Schema';
      if (parsed['@type']) {
        type = Array.isArray(parsed['@type']) ? parsed['@type'].join(', ') : parsed['@type'];
      } else if (parsed['@graph'] && Array.isArray(parsed['@graph']) && parsed['@graph'][0]?.['@type']) {
        type = `@graph (${parsed['@graph'].map((g: any) => g['@type']).join(', ')})`;
      }
      schemaData.push({
        type,
        rawJson,
        isValid: true,
        data: parsed,
      });
    } catch {
      schemaData.push({
        type: 'Invalid JSON-LD Syntax',
        rawJson,
        isValid: false,
        data: null,
      });
    }
  });

  // Word count & Technical metrics
  const bodyText = doc.body ? (doc.body.textContent || '').replace(/\s+/g, ' ').trim() : '';
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;
  const isHttps = parsedUrl.protocol === 'https:';
  const hasViewport = Boolean(viewport);
  const hasDoctype = htmlString.toLowerCase().includes('<!doctype html');
  const isNoindex = robots.toLowerCase().includes('noindex');
  const isIndexable = !isNoindex && statusCode >= 200 && statusCode < 300;

  // Critical Issues & Warnings Engine
  const issues: CriticalIssue[] = [];

  // Title Audit
  if (!title) {
    issues.push({
      id: 'missing-title',
      severity: 'critical',
      category: 'meta',
      title: 'Missing <title> tag',
      description: 'The page has no title tag defined, which severely impairs search engine rankings and CTR.',
      fixTip: 'Add a distinctive, keyword-focused <title> tag between 45 and 60 characters.',
      impact: 'Critical Ranking Factor',
    });
  } else if (titleLength < 30) {
    issues.push({
      id: 'short-title',
      severity: 'warning',
      category: 'meta',
      title: `Page title is too short (${titleLength} characters)`,
      description: 'Short titles miss valuable keyword real estate and reduce search result visibility.',
      fixTip: 'Expand title to 50–60 characters to maximize SERP prominence.',
      impact: 'Click-Through Rate',
    });
  } else if (titleLength > 65) {
    issues.push({
      id: 'long-title',
      severity: 'warning',
      category: 'meta',
      title: `Page title may truncate (${titleLength} characters)`,
      description: 'Titles longer than ~60 characters get truncated with an ellipsis on Google desktop and mobile SERPs.',
      fixTip: 'Shorten title to ~55–60 characters while keeping the primary keyword at the front.',
      impact: 'SERP Truncation',
    });
  }

  // Meta Description Audit
  if (!metaDescription) {
    issues.push({
      id: 'missing-meta-desc',
      severity: 'critical',
      category: 'meta',
      title: 'Missing Meta Description',
      description: 'Without a meta description, Google will extract random body snippets for SERP previews.',
      fixTip: 'Write a persuasive summary between 140–155 characters with a compelling call-to-action.',
      impact: 'SERP CTR & Conversion',
    });
  } else if (metaDescriptionLength < 70) {
    issues.push({
      id: 'short-meta-desc',
      severity: 'warning',
      category: 'meta',
      title: `Meta description is short (${metaDescriptionLength} characters)`,
      description: 'A brief description fails to highlight your unique value proposition in search results.',
      fixTip: 'Expand to 140–155 characters highlighting page benefits.',
      impact: 'SERP Snippet Quality',
    });
  } else if (metaDescriptionLength > 165) {
    issues.push({
      id: 'long-meta-desc',
      severity: 'info',
      category: 'meta',
      title: `Meta description may truncate (${metaDescriptionLength} characters)`,
      description: 'Descriptions beyond 160 characters will be clipped by search engines.',
      fixTip: 'Trim to under 160 characters.',
      impact: 'Snippet Presentation',
    });
  }

  // Headings Audit
  const h1s = headings.filter((h) => h.level === 'h1');
  if (h1s.length === 0) {
    issues.push({
      id: 'missing-h1',
      severity: 'critical',
      category: 'headings',
      title: 'Missing H1 Heading tag',
      description: 'No <h1> tag was found. The H1 heading is a cornerstone on-page signal for topical relevance.',
      fixTip: 'Add exactly one clear, descriptive <h1> representing the primary subject of the page.',
      impact: 'Topical Relevance',
    });
  } else if (h1s.length > 1) {
    issues.push({
      id: 'multiple-h1s',
      severity: 'warning',
      category: 'headings',
      title: `Multiple H1 Headings detected (${h1s.length} found)`,
      description: 'Having multiple H1 tags can dilute content focus and create ambiguity for search bots.',
      fixTip: 'Consolidate down to a single <h1> and convert secondary headings to <h2> tags.',
      impact: 'Content Hierarchy',
    });
  }

  // Images Audit
  const imagesWithoutAlt = images.filter((img) => !img.hasAlt);
  const imagesWithEmptyAlt = images.filter((img) => img.hasAlt && img.isEmptyAlt);
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      id: 'missing-img-alt',
      severity: 'critical',
      category: 'images',
      title: `${imagesWithoutAlt.length} image(s) missing alt attribute completely`,
      description: 'Images without alt attributes harm web accessibility (screen readers) and miss Google Image search traffic.',
      fixTip: 'Add descriptive alt text to all informational images. Use alt="" strictly for decorative icons.',
      impact: 'Accessibility & Image SEO',
    });
  }

  // Canonical Audit
  if (!canonical) {
    issues.push({
      id: 'missing-canonical',
      severity: 'warning',
      category: 'technical',
      title: 'Missing canonical link tag',
      description: 'Without a self-referencing canonical tag, duplicate URL parameters (like UTM tags) can cause duplicate content issues.',
      fixTip: `<link rel="canonical" href="${currentUrl}"> should be declared in <head>.`,
      impact: 'Duplicate Content Prevention',
    });
  } else if (canonical !== currentUrl && !currentUrl.startsWith(canonical)) {
    issues.push({
      id: 'canonical-mismatch',
      severity: 'info',
      category: 'technical',
      title: 'Canonical points to different URL',
      description: `Current URL differs from canonical: "${canonical}". Search engines will credit ranking equity to the target.`,
      fixTip: 'Verify if this page is intentionally canonicalized elsewhere.',
      impact: 'Index Consolidation',
    });
  }

  // Robots Audit
  if (isNoindex) {
    issues.push({
      id: 'robots-noindex',
      severity: 'critical',
      category: 'technical',
      title: 'Page is blocked from indexing (noindex)',
      description: 'The meta robots tag specifies "noindex". Search engines are instructed NOT to show this page in SERPs.',
      fixTip: 'Remove the "noindex" directive from <meta name="robots"> if you want this page to rank.',
      impact: 'Index Exclusion',
    });
  }

  // Schema Audit
  if (schemaData.length === 0) {
    issues.push({
      id: 'missing-schema',
      severity: 'warning',
      category: 'schema',
      title: 'No JSON-LD structured data detected',
      description: 'Structured data enables rich snippets, stars, FAQs, and breadcrumbs in Google Search results.',
      fixTip: 'Add relevant schema (e.g. WebSite, Organization, Article, or Product) using <script type="application/ld+json">.',
      impact: 'Rich Snippets & CTR',
    });
  } else {
    const invalidSchemas = schemaData.filter((s) => !s.isValid);
    if (invalidSchemas.length > 0) {
      issues.push({
        id: 'invalid-schema-json',
        severity: 'critical',
        category: 'schema',
        title: 'Malformed JSON-LD syntax in structured data',
        description: 'One or more schema blocks contain invalid JSON syntax and will be ignored by Google.',
        fixTip: 'Validate JSON-LD syntax using Google Rich Results Test.',
        impact: 'Schema Failure',
      });
    }
  }

  // Open Graph & Social
  if (!openGraph.image) {
    issues.push({
      id: 'missing-og-image',
      severity: 'warning',
      category: 'meta',
      title: 'Missing og:image tag',
      description: 'Social sharing on LinkedIn, Twitter, and WhatsApp will lack an eye-catching preview banner.',
      fixTip: 'Add <meta property="og:image" content="..."> with a 1200x630px high-resolution image.',
      impact: 'Social Virality & CTR',
    });
  }

  // HTTPS Audit
  if (!isHttps && parsedUrl.protocol.startsWith('http')) {
    issues.push({
      id: 'insecure-http',
      severity: 'critical',
      category: 'technical',
      title: 'Page is served over insecure HTTP',
      description: 'HTTPS is an official Google ranking signal and essential for user trust and browser security warnings.',
      fixTip: 'Deploy an SSL/TLS certificate and configure 301 redirects from HTTP to HTTPS.',
      impact: 'Security & Ranking Signal',
    });
  }

  // Viewport
  if (!hasViewport) {
    issues.push({
      id: 'missing-viewport',
      severity: 'critical',
      category: 'technical',
      title: 'Missing mobile viewport meta tag',
      description: 'Mobile devices may render the page in desktop zoom view, failing Google Mobile-First Indexing.',
      fixTip: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> to <head>.',
      impact: 'Mobile Usability',
    });
  }

  // Score Calculation (out of 100)
  let score = 100;
  issues.forEach((iss) => {
    if (iss.severity === 'critical') score -= 18;
    else if (iss.severity === 'warning') score -= 8;
    else if (iss.severity === 'info') score -= 2;
  });
  if (headings.length > 0) score += 4;
  if (images.length > 0 && imagesWithoutAlt.length === 0) score += 6;
  if (schemaData.length > 0 && schemaData.every((s) => s.isValid)) score += 5;
  score = Math.max(10, Math.min(100, Math.round(score)));

  return {
    url: currentUrl,
    domain: parsedUrl.hostname,
    title,
    titleLength,
    metaDescription,
    metaDescriptionLength,
    canonical,
    robots,
    viewport: viewport || 'Not specified',
    charset,
    language,
    author: author || 'Not specified',
    keywords: keywords || 'Not specified',
    openGraph,
    twitterCard,
    headings,
    images,
    links: {
      total: linkElements.length,
      internal: internalCount,
      external: externalCount,
      nofollow: nofollowCount,
      sampleLinks,
    },
    schemaData,
    technical: {
      isHttps,
      statusCode,
      loadTimeMs: responseTime,
      wordCount,
      hasViewport,
      hasDoctype,
      isIndexable,
    },
    issues,
    score,
    renderedContentWithTags: htmlString,
  };
}

/**
 * Generates an exhaustive, structured diagnostic prompt
 * formatted for pasting into Gemini, ChatGPT, Claude, etc.
 */
export function generateAIIssuesPrompt(report: SEOReport): string {
  const criticals = report.issues.filter((i) => i.severity === 'critical');
  const warnings = report.issues.filter((i) => i.severity === 'warning');
  const missingAltImgs = report.images.filter((img) => !img.hasAlt);

  return `# Technical & On-Page SEO Audit Remediation Request

**Target URL:** ${report.url}
**Domain:** ${report.domain}
**SEO Health Score:** ${report.score}/100
**Indexability Status:** ${report.technical.isIndexable ? 'Indexable' : 'Blocked / Noindex'}
**Word Count:** ${report.technical.wordCount} words

---

## 1. Current Core Metadata
- **Title Tag (${report.titleLength} chars):** "${report.title || 'MISSING'}"
- **Meta Description (${report.metaDescriptionLength} chars):** "${report.metaDescription || 'MISSING'}"
- **Canonical URL:** "${report.canonical || 'MISSING'}"
- **Robots Directive:** "${report.robots}"
- **HTTPS Status:** ${report.technical.isHttps ? 'Secure (HTTPS)' : 'INSECURE (HTTP)'}
- **Mobile Viewport:** ${report.technical.hasViewport ? 'Configured' : 'MISSING'}

---

## 2. Heading Structure (${report.headings.length} headings found)
${
  report.headings.length > 0
    ? report.headings
        .slice(0, 15)
        .map((h) => `- [${h.level.toUpperCase()}] ${h.text}`)
        .join('\n')
    : 'No headings detected.'
}

---

## 3. Image Alt Tag Audit
- Total Images: ${report.images.length}
- Missing Alt Attribute: ${missingAltImgs.length}
${
  missingAltImgs.length > 0
    ? missingAltImgs
        .slice(0, 10)
        .map((img) => `  - Image src: "${img.src}" (Missing alt)`)
        .join('\n')
    : '  - All images have alt attributes.'
}

---

## 4. Structured Data (Schema.org)
- JSON-LD Blocks Found: ${report.schemaData.length}
${
  report.schemaData.length > 0
    ? report.schemaData.map((s) => `- Type: ${s.type} (Valid: ${s.isValid})`).join('\n')
    : '- No schema.org JSON-LD structured data detected.'
}

---

## 5. Detected Critical Issues & Warnings (${report.issues.length} total)

### Critical Severity (${criticals.length}):
${
  criticals.length > 0
    ? criticals.map((c, i) => `${i + 1}. **[${c.category.toUpperCase()}]** ${c.title}\n   - *Details:* ${c.description}\n   - *Impact:* ${c.impact}\n   - *Fix:* ${c.fixTip}`).join('\n\n')
    : 'None detected.'
}

### Warnings (${warnings.length}):
${
  warnings.length > 0
    ? warnings.map((w, i) => `${i + 1}. **[${w.category.toUpperCase()}]** ${w.title}\n   - *Details:* ${w.description}\n   - *Fix:* ${w.fixTip}`).join('\n\n')
    : 'None detected.'
}

---

## INSTRUCTIONS FOR AI ASSISTANT:
1. Provide optimized rewrite for the <title> (strictly 50-60 characters, high CTR).
2. Provide optimized rewrite for the <meta name="description"> (145-155 characters with clear value proposition).
3. Provide the exact Schema.org JSON-LD script (ready to copy-paste into <head>) tailored to this domain and content.
4. For any missing image alt tags, recommend context-aware, keyword-natural alt text.
5. Provide step-by-step developer remediation code for all Critical Severity items listed above.`;
}
