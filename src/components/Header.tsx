import React from 'react';
import { Search, Download, HelpCircle, Chrome, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onDownloadZip: () => void;
  onOpenHelp: () => void;
  isDownloading: boolean;
}

export default function Header({ onDownloadZip, onOpenHelp, isDownloading }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                SEO Lens
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Chrome className="w-3 h-3 text-blue-600" />
                Chrome Extension
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              On-Page & Technical SEO Auditor • Rendered Content • Alt Tags • AI Remediation
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition active:scale-95"
            title="How to install this extension in Google Chrome"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">How to Install</span>
          </button>

          <button
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-60"
            title="Download full Chrome Extension Manifest V3 ZIP package"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isDownloading ? 'Packaging...' : 'Download Extension (.ZIP)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
