import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download } from 'lucide-react';

interface RenderedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  renderedHtml: string;
  url: string;
}

export default function RenderedContentModal({
  isOpen,
  onClose,
  renderedHtml,
  url
}: RenderedContentModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([renderedHtml], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `rendered-content-${new URL(url).hostname}.html`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const lines = renderedHtml.split('\n').length;
  const characterCount = renderedHtml.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Rendered Page Content with Tags
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {lines} lines • {Math.round(characterCount / 1024)} KB • {url}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg inline-flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .HTML</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1.5 transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy All with Tags'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap word-break-all">
            {renderedHtml}
          </pre>
        </div>
      </div>
    </div>
  );
}
