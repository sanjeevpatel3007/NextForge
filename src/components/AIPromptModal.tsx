import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
  url: string;
}

export default function AIPromptModal({
  isOpen,
  onClose,
  promptText,
  url
}: AIPromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openChatGPT = () => {
    navigator.clipboard.writeText(promptText);
    window.open('https://chat.openai.com/', '_blank');
  };

  const openGemini = () => {
    navigator.clipboard.writeText(promptText);
    window.open('https://gemini.google.com/app', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full h-[78vh] flex flex-col shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/70 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Critical SEO Issues Prompt for AI
              </h3>
              <p className="text-xs text-slate-500">
                Formatted markdown prompt ready to paste into Gemini, ChatGPT, or Claude
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openGemini}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg inline-flex items-center gap-1 transition"
              title="Copy prompt and open Gemini"
            >
              <span>Paste in Gemini</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg inline-flex items-center gap-1.5 transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Prompt!' : 'Copy AI Prompt'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap word-break-all">
            {promptText}
          </pre>
        </div>
      </div>
    </div>
  );
}
