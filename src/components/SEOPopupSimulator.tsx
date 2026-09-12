import React, { useState } from 'react';
import { 
  Eye, 
  FileText, 
  Heading, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Code2, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';
import { SEOReport, ImageItem, HeadingItem, CriticalIssue } from '../types';

interface SEOPopupSimulatorProps {
  report: SEOReport;
  aiDiagnosis: any | null;
  isAiLoading: boolean;
  onRunGeminiDiagnose: () => void;
  onCopyContent: () => void;
  onCopyAIPrompt: () => void;
}

type TabType = 'overview' | 'meta' | 'headings' | 'images' | 'links' | 'schema' | 'ranks' | 'ai';

export default function SEOPopupSimulator({
  report,
  aiDiagnosis,
  isAiLoading,
  onRunGeminiDiagnose,
  onCopyContent,
  onCopyAIPrompt
}: SEOPopupSimulatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [imageFilter, setImageFilter] = useState<'all' | 'missing' | 'hasAlt'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered images
  const filteredImages = report.images.filter((img) => {
    if (imageFilter === 'missing') return !img.hasAlt;
    if (imageFilter === 'hasAlt') return img.hasAlt;
    return true;
  });

  const missingAltCount = report.images.filter((img) => !img.hasAlt).length;
  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = report.issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all ${
      isExpanded ? 'w-full' : 'max-w-5xl mx-auto'
    }`}>
      {/* Extension Simulator Window Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            SEO Lens Popup Inspector
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
            {report.domain}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white p-1 rounded transition"
            title={isExpanded ? 'Standard view' : 'Expand full-width'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Extension Navigation Tabs (Light Theme) */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Overview</span>
          {report.issues.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-100 text-rose-700 font-bold">
              {report.issues.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'meta'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Meta & Social</span>
        </button>

        <button
          onClick={() => setActiveTab('headings')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'headings'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Heading className="w-3.5 h-3.5" />
          <span>Headings</span>
          <span className="text-[10px] text-slate-500 font-mono">({report.headings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'images'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Images & Alt</span>
          {missingAltCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-700 font-bold">
              {missingAltCount} missing
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">({report.images.length})</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'links'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Links</span>
          <span className="text-[10px] text-slate-500 font-mono">({report.links.total})</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'schema'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Schema JSON-LD</span>
          <span className="text-[10px] text-slate-500 font-mono">({report.schemaData.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ranks')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ranks'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Ranks & GSC</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Remedy</span>
          {aiDiagnosis && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 bg-white min-h-[460px]">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score & Indexability */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-xs ${
                    report.score >= 80 ? 'bg-emerald-600' : report.score >= 55 ? 'bg-amber-600' : 'bg-rose-600'
                  }`}
                >
                  <span className="text-xl leading-none">{report.score}</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">/ 100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Health</div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {report.score >= 80 ? 'Well Optimized' : report.score >= 55 ? 'Needs Attention' : 'Critical Issues'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                    {report.technical.isIndexable ? (
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Indexable
                      </span>
                    ) : (
                      <span className="text-rose-700 font-semibold inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Blocked (Noindex)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Title Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-1">
                  <span>Title Tag Length</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    report.titleLength >= 45 && report.titleLength <= 65
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {report.titleLength} / 60 chars
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      report.titleLength >= 45 && report.titleLength <= 65 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (report.titleLength / 60) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-800 font-medium truncate" title={report.title}>
                  {report.title || '(No title found)'}
                </p>
              </div>

              {/* Meta Description Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-1">
                  <span>Meta Description</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    report.metaDescriptionLength >= 130 && report.metaDescriptionLength <= 165
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {report.metaDescriptionLength} / 155 chars
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      report.metaDescriptionLength >= 130 && report.metaDescriptionLength <= 165
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (report.metaDescriptionLength / 155) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-800 line-clamp-1" title={report.metaDescription}>
                  {report.metaDescription || '(No meta description found)'}
                </p>
              </div>
            </div>

            {/* Core Metadata Quick List */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Key Technical Directives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Canonical URL</span>
                  <span className="font-mono text-slate-800 truncate block mt-0.5" title={report.canonical}>
                    {report.canonical || 'Not specified'}
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Robots Directive</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{report.robots}</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">SSL / HTTPS</span>
                  <span className="font-semibold text-slate-800 inline-flex items-center gap-1 mt-0.5">
                    {report.technical.isHttps ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {report.technical.isHttps ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Mobile Viewport</span>
                  <span className="font-semibold text-slate-800 block mt-0.5 truncate">
                    {report.viewport !== 'Not specified' ? 'Mobile Optimized' : 'Missing Viewport'}
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Issues & Recommendations */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Detected Issues & Fix Directives ({report.issues.length})
                  </h3>
                </div>
                <button
                  onClick={onCopyAIPrompt}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy for AI</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {report.issues.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">Clean SEO Bill of Health!</p>
                    <p className="text-xs text-slate-500 mt-1">No critical on-page or technical errors detected.</p>
                  </div>
                ) : (
                  report.issues.map((issue) => (
                    <div key={issue.id} className="p-4 hover:bg-slate-50/60 transition">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              issue.severity === 'critical'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : issue.severity === 'warning'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {issue.severity}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{issue.title}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">{issue.impact}</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{issue.description}</p>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 flex items-center justify-between">
                        <span className="truncate mr-2"><b>Fix:</b> {issue.fixTip}</span>
                        <button
                          onClick={() => copyToClipboard(issue.fixTip, issue.id)}
                          className="text-slate-400 hover:text-slate-700 shrink-0"
                          title="Copy fix tip"
                        >
                          {copiedCode === issue.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: META & SOCIAL ===================== */}
        {activeTab === 'meta' && (
          <div className="space-y-6">
            {/* Social Share Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook / Open Graph Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Open Graph Snippet (Facebook / LinkedIn)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">og:type = {report.openGraph.type}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                  {report.openGraph.image ? (
                    <img
                      src={report.openGraph.image}
                      alt="OG Banner"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-24 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      (No og:image specified)
                    </div>
                  )}
                  <div className="p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      {report.domain}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                      {report.openGraph.title || report.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {report.openGraph.description || report.metaDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Twitter Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Twitter Card Snippet
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    twitter:card = {report.twitterCard.card}
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                  {report.twitterCard.image ? (
                    <img
                      src={report.twitterCard.image}
                      alt="Twitter Banner"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-24 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      (No twitter:image specified)
                    </div>
                  )}
                  <div className="p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      {report.domain}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                      {report.twitterCard.title || report.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {report.twitterCard.description || report.metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Meta Tags Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Complete Head Tags Inventory
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-3 w-44">Property / Name</th>
                      <th className="p-3">Value Content</th>
                      <th className="p-3 w-28 text-right">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">&lt;title&gt;</td>
                      <td className="p-3 text-slate-800">{report.title || '<Missing>'}</td>
                      <td className="p-3 text-right font-mono text-slate-500">{report.titleLength} chars</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">meta[description]</td>
                      <td className="p-3 text-slate-800">{report.metaDescription || '<Missing>'}</td>
                      <td className="p-3 text-right font-mono text-slate-500">{report.metaDescriptionLength} chars</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">link[canonical]</td>
                      <td className="p-3 text-slate-800 font-mono">{report.canonical || '<Missing>'}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">meta[robots]</td>
                      <td className="p-3 text-slate-800">{report.robots}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">meta[viewport]</td>
                      <td className="p-3 text-slate-800 font-mono">{report.viewport}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">meta[charset]</td>
                      <td className="p-3 text-slate-800">{report.charset}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">html[lang]</td>
                      <td className="p-3 text-slate-800">{report.language}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">meta[og:title]</td>
                      <td className="p-3 text-slate-800">{report.openGraph.title || '<Not defined>'}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-blue-600">meta[og:image]</td>
                      <td className="p-3 text-slate-800 font-mono truncate max-w-md">{report.openGraph.image || '<Not defined>'}</td>
                      <td className="p-3 text-right font-mono text-slate-500">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: HEADINGS ===================== */}
        {activeTab === 'headings' && (
          <div className="space-y-6">
            {/* Headings Summary Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((level) => {
                const count = report.headings.filter((h) => h.level === level).length;
                return (
                  <div
                    key={level}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono flex items-center gap-2 ${
                      level === 'h1'
                        ? count === 1
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="uppercase">{level}:</span>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Tree View of Headings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Page Outline & Hierarchy Tree ({report.headings.length} tags)
                </h3>
              </div>
              <div className="p-4 divide-y divide-slate-100">
                {report.headings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No headings found on this page.</p>
                ) : (
                  report.headings.map((heading, idx) => {
                    const indentMap = {
                      h1: 'pl-2 border-l-4 border-blue-600',
                      h2: 'pl-6 border-l-2 border-slate-300',
                      h3: 'pl-10 border-l-2 border-slate-200',
                      h4: 'pl-14 border-l-2 border-slate-200',
                      h5: 'pl-16 border-l-2 border-slate-200',
                      h6: 'pl-20 border-l-2 border-slate-200',
                    };

                    return (
                      <div key={idx} className={`py-2.5 ${indentMap[heading.level]}`}>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${
                              heading.level === 'h1'
                                ? 'bg-blue-600 text-white'
                                : heading.level === 'h2'
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {heading.level}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">{heading.text}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: IMAGES & ALT TAGS ===================== */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setImageFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    imageFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Images ({report.images.length})
                </button>
                <button
                  onClick={() => setImageFilter('missing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    imageFilter === 'missing'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  Missing Alt ({missingAltCount})
                </button>
                <button
                  onClick={() => setImageFilter('hasAlt')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    imageFilter === 'hasAlt'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Has Alt ({report.images.length - missingAltCount})
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Showing {filteredImages.length} of {report.images.length}
              </span>
            </div>

            {/* Images Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-3 w-16">Preview</th>
                      <th className="p-3 w-32">Alt Status</th>
                      <th className="p-3">Alt Text Content</th>
                      <th className="p-3 w-64">Source URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredImages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          No images match this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredImages.map((img) => (
                        <tr key={img.id} className="hover:bg-slate-50/60">
                          <td className="p-3">
                            <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                              <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            {!img.hasAlt ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <AlertCircle className="w-3 h-3" /> Missing Alt
                              </span>
                            ) : img.isEmptyAlt ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <Info className="w-3 h-3" /> Decorative (alt="")
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Check className="w-3 h-3" /> Alt Present
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-slate-800">
                              {img.hasAlt ? (
                                img.alt || <span className="text-slate-400 italic">Empty alt="" (decorative)</span>
                              ) : (
                                <span className="text-rose-600 font-semibold italic">Missing alt attribute completely</span>
                              )}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[11px] truncate max-w-xs" title={img.src}>
                            {img.src}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: LINKS ===================== */}
        {activeTab === 'links' && (
          <div className="space-y-4">
            {/* Links Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Links</span>
                <span className="text-lg font-bold text-slate-900 block mt-0.5">{report.links.total}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Internal Links</span>
                <span className="text-lg font-bold text-blue-600 block mt-0.5">{report.links.internal}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">External Links</span>
                <span className="text-lg font-bold text-slate-700 block mt-0.5">{report.links.external}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Nofollow Directives</span>
                <span className="text-lg font-bold text-amber-600 block mt-0.5">{report.links.nofollow}</span>
              </div>
            </div>

            {/* Links Sample Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Page Anchor Text & Destinations
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-3 w-40">Anchor Text</th>
                      <th className="p-3">Destination Link (href)</th>
                      <th className="p-3 w-28">Type</th>
                      <th className="p-3 w-24">Follow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.links.sampleLinks.map((link, i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-900">{link.text}</td>
                        <td className="p-3 text-slate-600 font-mono text-[11px] truncate max-w-sm">{link.href}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              link.isInternal
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {link.isInternal ? 'Internal' : 'External'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              link.isNofollow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {link.isNofollow ? 'Nofollow' : 'Follow'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 6: SCHEMA JSON-LD ===================== */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Schema.org Structured Data ({report.schemaData.length} Blocks Found)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted from &lt;script type="application/ld+json"&gt; tags
                </p>
              </div>
            </div>

            {report.schemaData.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
                <Code2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">No Structured Data Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Adding Schema.org JSON-LD (such as Organization, WebSite, Article, or Product) allows Google to display Rich Snippets in SERPs.
                </p>
                <button
                  onClick={onRunGeminiDiagnose}
                  className="mt-4 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Recommended Schema with AI</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {report.schemaData.map((schema, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          @type: <span className="text-blue-600">{schema.type}</span>
                        </span>
                        {schema.isValid ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Valid JSON-LD
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Syntax Error
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(schema.rawJson, `schema-${idx}`)}
                        className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        {copiedCode === `schema-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCode === `schema-${idx}` ? 'Copied' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
                      {schema.rawJson}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 7: RANKS & GSC ===================== */}
        {activeTab === 'ranks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Google Search Console */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1.5">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Google Search Console</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Inspect the actual Google index status, chosen canonical, mobile indexing, and impressions for this exact URL.
                  </p>
                </div>
                <a
                  href={`https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(report.url)}&id=${encodeURIComponent(report.url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 text-xs font-bold text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center justify-center gap-1.5 transition"
                >
                  <span>Open URL in GSC</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Ahrefs */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>Ahrefs Site Explorer</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Check Domain Rating (DR), total backlinks count, referring domains, and organic keyword rankings.
                  </p>
                </div>
                <a
                  href={`https://app.ahrefs.com/site-explorer/overview?target=${encodeURIComponent(report.domain)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 text-xs font-bold text-center text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg inline-flex items-center justify-center gap-1.5 transition"
                >
                  <span>Analyze Domain in Ahrefs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Semrush */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1.5">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span>Semrush Analytics</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    View organic search volume, competitive positioning map, traffic trends, and top ranking keywords.
                  </p>
                </div>
                <a
                  href={`https://www.semrush.com/analytics/overview/?q=${encodeURIComponent(report.domain)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 text-xs font-bold text-center text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg inline-flex items-center justify-center gap-1.5 transition"
                >
                  <span>Check Domain in Semrush</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* How Integrations Work Explanation */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
              <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                How Live GSC & Rank API Connections Work:
              </h4>
              <p className="leading-relaxed text-slate-700 mt-1">
                • <b>Google Search Console:</b> Requires OAuth 2.0 with the scope <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono">https://www.googleapis.com/auth/webmasters.readonly</code>. The user must be a verified domain owner.
                <br />
                • <b>Ahrefs & Semrush:</b> Third-party metrics (DR, UR, backlinks) require paid API tokens or direct deep-links into their analytics portal.
              </p>
            </div>
          </div>
        )}

        {/* ===================== TAB 8: AI REMEDIATION ===================== */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  AI Fix & Remediation Plan
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Direct code rewrites for title, meta tags, and schema generated by Gemini
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onCopyAIPrompt}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg inline-flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt for External AI</span>
                </button>
                <button
                  onClick={onRunGeminiDiagnose}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg inline-flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAiLoading ? 'Synthesizing...' : 'Run Gemini Diagnostic'}</span>
                </button>
              </div>
            </div>

            {aiDiagnosis ? (
              <div className="space-y-4">
                {/* Verdict */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <span className="font-bold uppercase tracking-wider block text-emerald-800 mb-1">
                    Senior SEO Verdict:
                  </span>
                  <p className="text-sm font-medium leading-relaxed">{aiDiagnosis.summary}</p>
                </div>

                {/* Title & Meta Rewrite */}
                {aiDiagnosis.titleAndMetaRewrite && (
                  <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Recommended Title & Meta Description Rewrite
                    </h4>
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block">OPTIMIZED TITLE:</span>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-900 flex items-center justify-between">
                          <span>{aiDiagnosis.titleAndMetaRewrite.recommendedTitle}</span>
                          <button
                            onClick={() => copyToClipboard(aiDiagnosis.titleAndMetaRewrite.recommendedTitle, 'opt-title')}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {copiedCode === 'opt-title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block">OPTIMIZED META DESCRIPTION:</span>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-900 flex items-center justify-between">
                          <span>{aiDiagnosis.titleAndMetaRewrite.recommendedDescription}</span>
                          <button
                            onClick={() => copyToClipboard(aiDiagnosis.titleAndMetaRewrite.recommendedDescription, 'opt-desc')}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {copiedCode === 'opt-desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-1">
                        <b>Rationale:</b> {aiDiagnosis.titleAndMetaRewrite.rationale}
                      </p>
                    </div>
                  </div>
                )}

                {/* Priority Fixes */}
                {aiDiagnosis.criticalFixes && aiDiagnosis.criticalFixes.length > 0 && (
                  <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Priority Developer Code Snippets
                    </h4>
                    <div className="space-y-3">
                      {aiDiagnosis.criticalFixes.map((fix: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white">
                                {fix.priority}
                              </span>
                              <span className="font-bold text-slate-900">{fix.issue}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(fix.recommendedCode, `fix-${i}`)}
                              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                            >
                              {copiedCode === `fix-${i}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedCode === `fix-${i}` ? 'Copied' : 'Copy Code'}</span>
                            </button>
                          </div>
                          <p className="text-slate-600 mb-2">{fix.whyItMatters}</p>
                          <pre className="p-2.5 bg-slate-900 text-slate-100 font-mono text-[11px] rounded overflow-x-auto">
                            {fix.recommendedCode}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-slate-50">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">Ready for AI Analysis</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Click "Run Gemini Diagnostic" to generate tailor-made title rewrites, Schema.org code snippets, and image alt text solutions.
                </p>
                <button
                  onClick={onRunGeminiDiagnose}
                  disabled={isAiLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {isAiLoading ? 'Synthesizing with Gemini...' : 'Run Gemini Diagnostic Now'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
