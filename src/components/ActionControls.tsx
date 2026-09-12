import React from 'react';
import { Copy, Sparkles, Code2, AlertTriangle, ExternalLink, Check, Flame } from 'lucide-react';
import { SEOReport } from '../types';

interface ActionControlsProps {
  report: SEOReport;
  onCopyContentWithTags: () => void;
  onCopyAIPrompt: () => void;
  onRunGeminiDiagnose: () => void;
  isAiLoading: boolean;
  copiedContent: boolean;
  copiedPrompt: boolean;
}

export default function ActionControls({
  report,
  onCopyContentWithTags,
  onCopyAIPrompt,
  onRunGeminiDiagnose,
  isAiLoading,
  copiedContent,
  copiedPrompt
}: ActionControlsProps) {
  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = report.issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Overview stats pill */}
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-white shadow-xs ${
            report.score >= 80
              ? 'bg-emerald-600'
              : report.score >= 55
              ? 'bg-amber-600'
              : 'bg-rose-600'
          }`}
        >
          <span className="text-base leading-none">{report.score}</span>
          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">Score</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">
              {report.title || '(Untitled Page)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono flex items-center gap-2">
            <span>{report.url}</span>
            <span className="text-slate-300">•</span>
            <span>{report.technical.wordCount} words</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-semibold">{criticalCount} Critical</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-semibold">{warningCount} Warnings</span>
          </p>
        </div>
      </div>

      {/* Main Action Buttons requested by user */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Button 1: Copy All Content with Tags */}
        <button
          onClick={onCopyContentWithTags}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition active:scale-95 shadow-xs"
          title="Copy rendered page HTML with all tags to clipboard"
        >
          {copiedContent ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Content Copied!</span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-slate-700" />
              <span>Copy Content with Tags</span>
            </>
          )}
        </button>

        {/* Button 2: Critical Issues for AI */}
        <button
          onClick={onCopyAIPrompt}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition active:scale-95 shadow-xs"
          title="Compile all critical SEO issues into a structured prompt for ChatGPT, Gemini, or Claude"
        >
          {copiedPrompt ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">AI Prompt Copied!</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Critical Issues for AI</span>
            </>
          )}
        </button>

        {/* Button 3: Instant AI Diagnose (Gemini) */}
        <button
          onClick={onRunGeminiDiagnose}
          disabled={isAiLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition active:scale-95 shadow-xs"
          title="Generate instantaneous senior SEO fix roadmap and rewrite snippets using Gemini"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{isAiLoading ? 'Analyzing...' : 'Ask Gemini AI'}</span>
        </button>
      </div>
    </div>
  );
}
