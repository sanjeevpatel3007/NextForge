import React, { useState } from 'react';
import { Globe, ArrowRight, ExternalLink, RefreshCw, Compass } from 'lucide-react';
import { SimulatedTab } from '../types';

interface ActiveTabSelectorProps {
  tabs: SimulatedTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onAnalyzeCustomUrl: (url: string) => void;
  isLoading: boolean;
  currentUrl: string;
}

export default function ActiveTabSelector({
  tabs,
  activeTabId,
  onSelectTab,
  onAnalyzeCustomUrl,
  isLoading,
  currentUrl
}: ActiveTabSelectorProps) {
  const [customInput, setCustomInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAnalyzeCustomUrl(customInput.trim());
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active Opened Sites (Select Site to Audit)
          </h2>
          <span className="text-[11px] text-slate-500">
            • Simulates clicking the Chrome Extension on an active tab
          </span>
        </div>

        {/* Live URL Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or enter any live URL (e.g. apple.com)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none text-slate-800 transition"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !customInput.trim()}
            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition inline-flex items-center gap-1.5 shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
            <span>Inspect</span>
          </button>
        </form>
      </div>

      {/* Tabs list styled like modern Chrome Browser Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId && currentUrl === tab.url;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/70 border-blue-500/80 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={tab.favicon}
                    alt=""
                    className="w-4 h-4 rounded-xs shrink-0 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {tab.title}
                  </span>
                </div>
                {isActive && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span className="font-mono truncate max-w-[150px]">{new URL(tab.url).hostname}</span>
                <span className="font-semibold text-slate-600 text-[10px] uppercase bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {tab.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
