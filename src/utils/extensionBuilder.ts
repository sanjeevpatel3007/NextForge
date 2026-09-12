import JSZip from 'jszip';

export async function generateExtensionZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. manifest.json (Manifest V3)
  const manifest = {
    manifest_version: 3,
    name: 'SEO Lens - On-Page & Technical SEO Auditor',
    version: '1.0.0',
    description: 'Instant on-page SEO, technical audit, metadata, alt tags, schema JSON-LD, content extraction, and AI issue prompt generator.',
    action: {
      default_popup: 'popup.html',
      default_icon: {
        '16': 'icon16.png',
        '48': 'icon48.png',
        '128': 'icon128.png'
      }
    },
    icons: {
      '16': 'icon16.png',
      '48': 'icon48.png',
      '128': 'icon128.png'
    },
    permissions: [
      'activeTab',
      'scripting',
      'storage',
      'clipboardWrite'
    ],
    host_permissions: [
      '<all_urls>'
    ]
  };

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. popup.html (Light white theme & premium UI)
  const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Lens</title>
  <style>
    :root {
      --bg: #ffffff;
      --card-bg: #f8fafc;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { width: 480px; min-height: 580px; max-height: 600px; background: var(--bg); color: var(--text); overflow-y: auto; font-size: 13px; }
    .header { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: #ffffff; position: sticky; top: 0; z-index: 20; }
    .brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: var(--text); }
    .badge { padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
    .score-badge { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 13px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
    
    .actions-bar { padding: 10px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; border-bottom: 1px solid var(--border); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; border: none; transition: 0.15s; }
    .btn-primary { background: #0f172a; color: #ffffff; }
    .btn-primary:hover { background: #1e293b; }
    .btn-secondary { background: #ffffff; color: #334155; border: 1px solid var(--border); }
    .btn-secondary:hover { background: #f1f5f9; }
    .btn-accent { background: #4f46e5; color: #ffffff; }
    .btn-accent:hover { background: #4338ca; }

    .nav-tabs { display: flex; background: #ffffff; border-bottom: 1px solid var(--border); overflow-x: auto; padding: 0 8px; }
    .tab { padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap; }
    .tab.active { color: var(--primary); border-bottom-color: var(--primary); }
    
    .content { padding: 14px 16px; }
    .panel { display: none; }
    .panel.active { display: block; }

    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
    .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.05em; }
    .val { font-size: 13px; color: var(--text); word-break: break-all; line-height: 1.4; }
    
    .status-pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .status-ok { background: #dcfce7; color: #166534; }
    .status-warn { background: #fef3c7; color: #92400e; }
    .status-crit { background: #fee2e2; color: #991b1b; }

    .table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .table th { text-align: left; padding: 6px 8px; background: #e2e8f0; color: #475569; font-weight: 600; }
    .table td { padding: 6px 8px; border-bottom: 1px solid var(--border); }

    .toast { position: fixed; bottom: 12px; right: 12px; left: 12px; background: #0f172a; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; display: none; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 50; }
    pre.code { background: #1e293b; color: #f8fafc; padding: 8px; border-radius: 6px; font-size: 11px; overflow-x: auto; max-height: 180px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <span>SEO Lens</span>
    </div>
    <div id="scoreBadge" class="score-badge">--/100</div>
  </div>

  <div class="actions-bar">
    <button id="btnCopyContent" class="btn btn-secondary" title="Copy rendered page HTML with tags">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      <span>Copy All Content</span>
    </button>
    <button id="btnAIIssues" class="btn btn-primary" title="Export all critical issues formatted for AI">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      <span>AI Fix Prompt</span>
    </button>
  </div>

  <div class="nav-tabs">
    <div class="tab active" data-target="panel-overview">Overview</div>
    <div class="tab" data-target="panel-meta">Meta & Social</div>
    <div class="tab" data-target="panel-headings">Headings</div>
    <div class="tab" data-target="panel-images">Images (Alt)</div>
    <div class="tab" data-target="panel-schema">Schema</div>
    <div class="tab" data-target="panel-ranks">Ranks & GSC</div>
  </div>

  <div class="content">
    <!-- Panel 1: Overview -->
    <div id="panel-overview" class="panel active">
      <div class="card">
        <div class="card-title">Target URL</div>
        <div id="valUrl" class="val" style="font-size:11px;">Inspecting active tab...</div>
      </div>
      <div class="card">
        <div class="card-title" style="display:flex; justify-content:space-between;">
          <span>Title Tag</span>
          <span id="valTitleLen" class="status-pill status-ok">-- chars</span>
        </div>
        <div id="valTitle" class="val font-semibold">Loading...</div>
      </div>
      <div class="card">
        <div class="card-title" style="display:flex; justify-content:space-between;">
          <span>Meta Description</span>
          <span id="valDescLen" class="status-pill status-ok">-- chars</span>
        </div>
        <div id="valDesc" class="val">Loading...</div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div class="card">
          <div class="card-title">Canonical</div>
          <div id="valCanonical" class="val" style="font-size:11px;">--</div>
        </div>
        <div class="card">
          <div class="card-title">Robots</div>
          <div id="valRobots" class="val" style="font-size:11px;">--</div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Critical Issues Detected (<span id="issueCount">0</span>)</div>
        <div id="issuesList"></div>
      </div>
    </div>

    <!-- Panel 2: Meta -->
    <div id="panel-meta" class="panel">
      <div class="card">
        <div class="card-title">Open Graph (Facebook / LinkedIn)</div>
        <div style="font-size:12px; margin-bottom:4px;"><b>og:title:</b> <span id="ogTitle">--</span></div>
        <div style="font-size:12px; margin-bottom:4px;"><b>og:type:</b> <span id="ogType">--</span></div>
        <div style="font-size:12px; margin-bottom:4px;"><b>og:image:</b> <span id="ogImg">--</span></div>
      </div>
      <div class="card">
        <div class="card-title">Twitter Card</div>
        <div style="font-size:12px; margin-bottom:4px;"><b>twitter:card:</b> <span id="twCard">--</span></div>
        <div style="font-size:12px; margin-bottom:4px;"><b>twitter:title:</b> <span id="twTitle">--</span></div>
      </div>
      <div class="card">
        <div class="card-title">Technical Meta</div>
        <div style="font-size:12px; margin-bottom:4px;"><b>Charset:</b> <span id="valCharset">--</span></div>
        <div style="font-size:12px; margin-bottom:4px;"><b>Language:</b> <span id="valLang">--</span></div>
        <div style="font-size:12px;"><b>Viewport:</b> <span id="valViewport">--</span></div>
      </div>
    </div>

    <!-- Panel 3: Headings -->
    <div id="panel-headings" class="panel">
      <div class="card">
        <div class="card-title">Heading Hierarchy (H1 - H6)</div>
        <div id="headingsSummary" style="margin-bottom:8px; font-weight:600;">--</div>
        <div id="headingsList" style="max-height:300px; overflow-y:auto;"></div>
      </div>
    </div>

    <!-- Panel 4: Images -->
    <div id="panel-images" class="panel">
      <div class="card">
        <div class="card-title" style="display:flex; justify-content:space-between;">
          <span>Image Alt Tag Audit</span>
          <span id="imgMissingBadge" class="status-pill status-warn">-- missing</span>
        </div>
        <div id="imagesList" style="max-height:320px; overflow-y:auto;"></div>
      </div>
    </div>

    <!-- Panel 5: Schema -->
    <div id="panel-schema" class="panel">
      <div class="card">
        <div class="card-title">Schema.org JSON-LD (<span id="schemaCount">0</span> found)</div>
        <div id="schemaList"></div>
      </div>
    </div>

    <!-- Panel 6: Ranks & GSC -->
    <div id="panel-ranks" class="panel">
      <div class="card">
        <div class="card-title">Google Search Console</div>
        <p style="color:var(--text-muted); font-size:12px; line-height:1.4; margin-bottom:8px;">Inspect index status, canonicals, and search performance for this URL in GSC:</p>
        <button id="btnOpenGSC" class="btn btn-secondary" style="width:100%;">Open in Google Search Console</button>
      </div>
      <div class="card">
        <div class="card-title">Ahrefs & Semrush Rank Checks</div>
        <p style="color:var(--text-muted); font-size:12px; line-height:1.4; margin-bottom:8px;">Check Domain Rating, backlinks, and organic ranking keywords instantly:</p>
        <div style="display:flex; gap:8px;">
          <button id="btnOpenAhrefs" class="btn btn-secondary" style="flex:1;">Check in Ahrefs</button>
          <button id="btnOpenSemrush" class="btn btn-secondary" style="flex:1;">Check in Semrush</button>
        </div>
      </div>
    </div>
  </div>

  <div id="toast" class="toast">Action copied to clipboard!</div>
  <script src="popup.js"></script>
</body>
</html>`;

  zip.file('popup.html', popupHtml);

  // 3. popup.js (Active Tab Inspector & Controller)
  const popupJs = `
let currentReport = null;

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      document.getElementById(target).classList.add('active');
    });
  });

  // Query active tab in current window
  if (chrome?.tabs?.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        inspectActiveTab(tabs[0].id, tabs[0].url);
      }
    });
  } else {
    showToast('Extension running outside Chrome environment');
  }

  // Action: Copy All Content with Tags
  document.getElementById('btnCopyContent')?.addEventListener('click', () => {
    if (!currentReport || !currentReport.renderedHtml) {
      showToast('No rendered page content available to copy');
      return;
    }
    navigator.clipboard.writeText(currentReport.renderedHtml).then(() => {
      showToast('Copied full rendered HTML with tags to clipboard!');
    });
  });

  // Action: Copy AI Issues Prompt
  document.getElementById('btnAIIssues')?.addEventListener('click', () => {
    if (!currentReport) return;
    const prompt = buildAIPrompt(currentReport);
    navigator.clipboard.writeText(prompt).then(() => {
      showToast('AI Remediation Prompt copied to clipboard!');
    });
  });

  // Action: GSC / Ahrefs / Semrush
  document.getElementById('btnOpenGSC')?.addEventListener('click', () => {
    if (!currentReport) return;
    const url = encodeURIComponent(currentReport.url);
    window.open(\`https://search.google.com/search-console/inspect?resource_id=\${url}&id=\${url}\`, '_blank');
  });

  document.getElementById('btnOpenAhrefs')?.addEventListener('click', () => {
    if (!currentReport) return;
    const domain = new URL(currentReport.url).hostname;
    window.open(\`https://app.ahrefs.com/site-explorer/overview?target=\${domain}\`, '_blank');
  });

  document.getElementById('btnOpenSemrush')?.addEventListener('click', () => {
    if (!currentReport) return;
    const domain = new URL(currentReport.url).hostname;
    window.open(\`https://www.semrush.com/analytics/overview/?q=\${domain}\`, '_blank');
  });
});

function inspectActiveTab(tabId, tabUrl) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: extractDomDetails
  }, (results) => {
    if (chrome.runtime.lastError || !results || !results[0] || !results[0].result) {
      console.warn('Could not inject content script:', chrome.runtime.lastError);
      document.getElementById('valTitle').textContent = 'Unable to inspect page (restricted browser page)';
      return;
    }
    const data = results[0].result;
    data.url = tabUrl;
    currentReport = data;
    renderUI(data);
  });
}

function extractDomDetails() {
  const titleEl = document.querySelector('title');
  const title = titleEl ? titleEl.innerText.trim() : '';

  const getMeta = (q) => {
    const el = document.querySelector(\`meta[name="\${q}" i], meta[property="\${q}" i]\`);
    return el ? el.getAttribute('content') || '' : '';
  };

  const canonicalEl = document.querySelector('link[rel="canonical"]');
  const canonical = canonicalEl ? canonicalEl.getAttribute('href') : '';
  const metaDesc = getMeta('description');
  const robots = getMeta('robots') || 'index, follow';
  const viewport = getMeta('viewport');
  const charset = document.characterSet || 'UTF-8';
  const lang = document.documentElement.lang || 'en';

  // OpenGraph & Twitter
  const ogTitle = getMeta('og:title');
  const ogType = getMeta('og:type');
  const ogImage = getMeta('og:image');
  const twCard = getMeta('twitter:card');
  const twTitle = getMeta('twitter:title');

  // Headings
  const headings = [];
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
    headings.push({ level: el.tagName.toLowerCase(), text: el.innerText.replace(/\\s+/g, ' ').trim() });
  });

  // Images
  const images = [];
  document.querySelectorAll('img').forEach(img => {
    images.push({
      src: img.src || img.getAttribute('src') || '',
      alt: img.getAttribute('alt'),
      hasAlt: img.getAttribute('alt') !== null,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height
    });
  });

  // Schemas
  const schemas = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
    try {
      schemas.push({ raw: s.innerText, parsed: JSON.parse(s.innerText) });
    } catch(e) {
      schemas.push({ raw: s.innerText, error: true });
    }
  });

  return {
    title,
    metaDesc,
    canonical,
    robots,
    viewport,
    charset,
    lang,
    ogTitle,
    ogType,
    ogImage,
    twCard,
    twTitle,
    headings,
    images,
    schemas,
    renderedHtml: document.documentElement.outerHTML
  };
}

function renderUI(data) {
  document.getElementById('valUrl').textContent = data.url;
  document.getElementById('valTitle').textContent = data.title || '(Missing Title Tag)';
  document.getElementById('valTitleLen').textContent = \`\${data.title.length} chars\`;
  document.getElementById('valDesc').textContent = data.metaDesc || '(Missing Meta Description)';
  document.getElementById('valDescLen').textContent = \`\${data.metaDesc.length} chars\`;
  document.getElementById('valCanonical').textContent = data.canonical || 'Not defined';
  document.getElementById('valRobots').textContent = data.robots;

  // Social
  document.getElementById('ogTitle').textContent = data.ogTitle || 'N/A';
  document.getElementById('ogType').textContent = data.ogType || 'N/A';
  document.getElementById('ogImg').textContent = data.ogImage || 'N/A';
  document.getElementById('twCard').textContent = data.twCard || 'N/A';
  document.getElementById('twTitle').textContent = data.twTitle || 'N/A';
  document.getElementById('valCharset').textContent = data.charset;
  document.getElementById('valLang').textContent = data.lang;
  document.getElementById('valViewport').textContent = data.viewport || 'Missing';

  // Headings
  const h1Count = data.headings.filter(h => h.level === 'h1').length;
  document.getElementById('headingsSummary').textContent = \`Total: \${data.headings.length} (H1s: \${h1Count})\`;
  const hContainer = document.getElementById('headingsList');
  hContainer.innerHTML = '';
  data.headings.forEach(h => {
    const d = document.createElement('div');
    d.style.padding = '4px 0';
    d.style.borderBottom = '1px solid #e2e8f0';
    d.style.fontSize = '12px';
    d.innerHTML = \`<span style="font-weight:700; color:#2563eb; margin-right:6px;">[\${h.level.toUpperCase()}]</span> \${escapeHtml(h.text)}\`;
    hContainer.appendChild(d);
  });

  // Images
  const missingAlt = data.images.filter(img => !img.hasAlt);
  document.getElementById('imgMissingBadge').textContent = \`\${missingAlt.length} missing alt\`;
  const imgContainer = document.getElementById('imagesList');
  imgContainer.innerHTML = '';
  data.images.slice(0, 30).forEach(img => {
    const row = document.createElement('div');
    row.style.padding = '6px 0';
    row.style.borderBottom = '1px solid #e2e8f0';
    row.style.fontSize = '11px';
    const status = img.hasAlt ? (img.alt === '' ? '<span class="status-pill status-warn">alt=""</span>' : '<span class="status-pill status-ok">alt present</span>') : '<span class="status-pill status-crit">missing alt</span>';
    row.innerHTML = \`<div style="display:flex; justify-content:space-between; margin-bottom:2px;">\${status}<span>\${img.width}x\${img.height}</span></div><div style="word-break:break-all; color:#64748b;">\${escapeHtml(img.alt || img.src)}</div>\`;
    imgContainer.appendChild(row);
  });

  // Schemas
  document.getElementById('schemaCount').textContent = data.schemas.length;
  const sContainer = document.getElementById('schemaList');
  sContainer.innerHTML = '';
  if (data.schemas.length === 0) {
    sContainer.innerHTML = '<div style="color:#64748b; font-size:12px;">No JSON-LD structured data detected.</div>';
  } else {
    data.schemas.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      const type = s.parsed?.['@type'] || 'Custom JSON-LD';
      card.innerHTML = \`<div class="card-title">\${type}</div><pre class="code">\${escapeHtml(s.raw)}</pre>\`;
      sContainer.appendChild(card);
    });
  }

  // Calculate quick score & issues
  const issues = [];
  let score = 100;
  if (!data.title) { issues.push('Missing <title> tag'); score -= 20; }
  if (!data.metaDesc) { issues.push('Missing <meta name="description">'); score -= 15; }
  if (h1Count === 0) { issues.push('Missing <h1> heading'); score -= 15; }
  if (h1Count > 1) { issues.push('Multiple <h1> headings found'); score -= 8; }
  if (missingAlt.length > 0) { issues.push(\`\${missingAlt.length} images missing alt attribute\`); score -= 12; }
  if (!data.canonical) { issues.push('Missing canonical link'); score -= 8; }
  if (data.schemas.length === 0) { issues.push('No schema JSON-LD found'); score -= 5; }

  score = Math.max(10, Math.min(100, score));
  document.getElementById('scoreBadge').textContent = \`\${score}/100\`;
  document.getElementById('issueCount').textContent = issues.length;
  
  const issueContainer = document.getElementById('issuesList');
  issueContainer.innerHTML = '';
  if (issues.length === 0) {
    issueContainer.innerHTML = '<div style="color:#16a34a; font-weight:600; font-size:12px;">Great job! No critical on-page issues detected.</div>';
  } else {
    issues.forEach(iss => {
      const d = document.createElement('div');
      d.style.color = '#dc2626';
      d.style.padding = '4px 0';
      d.style.fontSize = '12px';
      d.innerHTML = \`• \${iss}\`;
      issueContainer.appendChild(d);
    });
  }
}

function buildAIPrompt(data) {
  return \`# SEO Audit & Remediation Request\\n\\nURL: \${data.url}\\nTitle: "\${data.title}"\\nMeta Description: "\${data.metaDesc}"\\nHeadings Count: \${data.headings.length}\\nImages Missing Alt: \${data.images.filter(i=>!i.hasAlt).length}\\nSchemas: \${data.schemas.length}\\n\\nPlease analyze these on-page SEO issues and provide an optimized Title, Meta Description, and schema JSON-LD snippet.\`;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 2400);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
`;

  zip.file('popup.js', popupJs);

  // 4. content.js
  const contentJs = `// SEO Lens Content Script
console.log('SEO Lens Content Inspector Active');
`;
  zip.file('content.js', contentJs);

  // 5. background.js
  const backgroundJs = `// Service Worker for SEO Lens
chrome.runtime.onInstalled.addListener(() => {
  console.log('SEO Lens Chrome Extension installed successfully');
});
`;
  zip.file('background.js', backgroundJs);

  // 6. SVG / Canvas Icons generator
  const createSvgIcon = (size: number) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="#f8fafc" stroke="#2563eb" stroke-width="2"/>
  <circle cx="11" cy="11" r="5" stroke="#2563eb" stroke-width="2"/>
  <line x1="21" y1="21" x2="15" y2="15" stroke="#2563eb" stroke-width="2.5"/>
</svg>`;

  zip.file('icon16.png', createSvgIcon(16));
  zip.file('icon48.png', createSvgIcon(48));
  zip.file('icon128.png', createSvgIcon(128));

  // 7. README.md with clear installation steps
  const readme = `# SEO Lens - Chrome Extension (Manifest V3)

## How to Install in Google Chrome:

1. **Unzip** this archive to a local folder on your computer.
2. Open Google Chrome and navigate to: \`chrome://extensions/\`
3. Toggle on **"Developer mode"** in the top right corner.
4. Click the **"Load unpacked"** button in the top left.
5. Select the unzipped folder containing \`manifest.json\`.
6. Open any live website and click the **SEO Lens** icon in your Chrome toolbar!

## Features Included:
- **Instant On-Page SEO Audit:** Title, Meta Description, Canonical, Robots, Charset, Viewport.
- **Headings Hierarchy:** Tree view of H1–H6 with multiple H1 flags.
- **Image Alt Tag Inspector:** Audits all \`<img>\` tags for missing or empty \`alt\` attributes.
- **Schema JSON-LD:** Extracts and validates structured data.
- **"Copy All Content with Tags" Button:** 1-click clipboard copy of clean rendered HTML with tags.
- **"AI Fix Prompt" Button:** Generates structured prompt ready for Gemini, ChatGPT, or Claude.
- **Google Search Console, Ahrefs & Semrush Quick Ranks Links.**
`;
  zip.file('README.md', readme);

  return await zip.generateAsync({ type: 'blob' });
}
