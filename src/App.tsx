import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ActiveTabSelector from './components/ActiveTabSelector';
import ActionControls from './components/ActionControls';
import SEOPopupSimulator from './components/SEOPopupSimulator';
import ChromeInstallModal from './components/ChromeInstallModal';
import RenderedContentModal from './components/RenderedContentModal';
import AIPromptModal from './components/AIPromptModal';
import { SAMPLE_OPENED_TABS } from './data/sampleSites';
import { parseHTMLToSEOReport, generateAIIssuesPrompt } from './utils/seoParser';
import { generateExtensionZip } from './utils/extensionBuilder';
import { Check, AlertCircle, Info, Chrome } from 'lucide-react';

export default function App() {
  const [activeTabId, setActiveTabId] = useState<string>('tab-ecommerce');
  const [customSite, setCustomSite] = useState<{ url: string; html: string; status: number; time: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<any | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Find active data
  const currentTab = SAMPLE_OPENED_TABS.find((t) => t.id === activeTabId) || SAMPLE_OPENED_TABS[0];
  const activeUrl = customSite ? customSite.url : currentTab.url;
  const activeHtml = customSite ? customSite.html : currentTab.html;
  const activeStatus = customSite ? customSite.status : 200;
  const activeTime = customSite ? customSite.time : 145;

  // Generate parsed SEO Report
  const report = useMemo(() => {
    return parseHTMLToSEOReport(activeHtml, activeUrl, activeStatus, activeTime);
  }, [activeHtml, activeUrl, activeStatus, activeTime]);

  // Tab switching
  const handleSelectTab = (tabId: string) => {
    setCustomSite(null);
    setActiveTabId(tabId);
    setAiDiagnosis(null);
    const target = SAMPLE_OPENED_TABS.find((t) => t.id === tabId);
    showToast(`Opened active tab: ${target?.title || 'Selected site'}`);
  };

  // Custom URL inspection
  const handleAnalyzeCustomUrl = async (url: string) => {
    setIsLoading(true);
    showToast(`Connecting to ${url}...`);
    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error);
      } else {
        setCustomSite({
          url: data.url,
          html: data.html,
          status: data.status,
          time: data.responseTimeMs,
        });
        setAiDiagnosis(null);
        showToast(`Successfully analyzed ${new URL(data.url).hostname}`);
      }
    } catch (err: any) {
      showToast(`Fetch failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Copy All Content with Tags
  const handleCopyContentWithTags = () => {
    navigator.clipboard.writeText(report.renderedContentWithTags);
    setCopiedContent(true);
    showToast('Copied full rendered page HTML with tags to clipboard!');
    setTimeout(() => setCopiedContent(false), 2400);
  };

  // 1-Click Critical Issues for AI
  const handleCopyAIPrompt = () => {
    const prompt = generateAIIssuesPrompt(report);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    showToast('Compiled critical issues into prompt & copied to clipboard!');
    setTimeout(() => setCopiedPrompt(false), 2400);
  };

  // AI Diagnostic with Gemini
  const handleRunGeminiDiagnose = async () => {
    setIsAiLoading(true);
    showToast('Running Gemini AI SEO diagnosis on active page...');
    try {
      const res = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: report.url,
          title: report.title,
          metaDescription: report.metaDescription,
          issues: report.issues,
          headingsSummary: `${report.headings.length} headings (H1: ${report.headings.filter((h) => h.level === 'h1').length})`,
          imagesSummary: `${report.images.length} images (${report.images.filter((i) => !i.hasAlt).length} missing alt)`,
        }),
      });
      const data = await res.json();
      if (data.diagnosis) {
        setAiDiagnosis(data.diagnosis);
        showToast('Gemini remediation roadmap ready! Check the "AI Remedy" tab.');
      } else {
        // Fallback structured diagnosis if no API key
        setAiDiagnosis({
          summary: `The page "${report.title || report.url}" has ${report.issues.length} detected SEO anomalies impacting organic rankings. Prioritizing title precision, meta description conversion hooks, and missing image alt tags will lift search visibility.`,
          criticalFixes: report.issues.slice(0, 3).map((iss, i) => ({
            priority: `P${i}` as 'P0' | 'P1' | 'P2',
            issue: iss.title,
            whyItMatters: iss.description,
            recommendedCode: `<!-- Fix for ${iss.title} -->\n${iss.fixTip}`,
          })),
          titleAndMetaRewrite: {
            recommendedTitle: `${(report.title || 'Official Page').slice(0, 45)} | Fast & Secure`,
            recommendedDescription: `${(report.metaDescription || 'Explore our comprehensive web services. Built for maximum performance and security.').slice(0, 140)} Learn more today.`,
            rationale: 'Front-loads primary keywords and guarantees full visibility across Google desktop & mobile viewports.',
          },
        });
        showToast('Generated structured AI remediation plan! Check the "AI Remedy" tab.');
      }
    } catch (err: any) {
      showToast(`AI analysis error: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Download Chrome Extension ZIP
  const handleDownloadZip = async () => {
    setIsDownloading(true);
    showToast('Building Chrome Extension ZIP package (Manifest V3)...');
    try {
      const blob = await generateExtensionZip();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'seo-lens-extension.zip';
      a.click();
      URL.revokeObjectURL(blobUrl);
      showToast('Downloaded seo-lens-extension.zip! Ready to load in chrome://extensions');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-16">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        onDownloadZip={handleDownloadZip}
        onOpenHelp={() => setIsHelpOpen(true)}
        isDownloading={isDownloading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Active Browser Tabs Switcher ("already opened site" simulation) */}
        <ActiveTabSelector
          tabs={SAMPLE_OPENED_TABS}
          activeTabId={activeTabId}
          onSelectTab={handleSelectTab}
          onAnalyzeCustomUrl={handleAnalyzeCustomUrl}
          isLoading={isLoading}
          currentUrl={activeUrl}
        />

        {/* Action Controls Bar */}
        <ActionControls
          report={report}
          onCopyContentWithTags={handleCopyContentWithTags}
          onCopyAIPrompt={handleCopyAIPrompt}
          onRunGeminiDiagnose={handleRunGeminiDiagnose}
          isAiLoading={isAiLoading}
          copiedContent={copiedContent}
          copiedPrompt={copiedPrompt}
        />

        {/* The Chrome Extension Popup Interactive Simulator */}
        <SEOPopupSimulator
          report={report}
          aiDiagnosis={aiDiagnosis}
          isAiLoading={isAiLoading}
          onRunGeminiDiagnose={handleRunGeminiDiagnose}
          onCopyContent={handleCopyContentWithTags}
          onCopyAIPrompt={handleCopyAIPrompt}
        />

        {/* Secondary Quick Action Links under simulator */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsContentModalOpen(true)}
              className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View Full Rendered HTML & Tags</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="font-semibold text-amber-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Review Formatted AI Prompt</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Chrome className="w-3.5 h-3.5 text-slate-500" />
            <span>Manifest V3 • activeTab • scripting • storage</span>
          </div>
        </div>
      </main>

      {/* Chrome Install Instructions Modal */}
      <ChromeInstallModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onDownloadZip={handleDownloadZip}
      />

      {/* Rendered Content Modal */}
      <RenderedContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        renderedHtml={report.renderedContentWithTags}
        url={report.url}
      />

      {/* AI Prompt Modal */}
      <AIPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        promptText={generateAIIssuesPrompt(report)}
        url={report.url}
      />
    </div>
  );
}
