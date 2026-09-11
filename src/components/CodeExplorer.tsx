import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';
import { NextJsCodeFile, ProjectIdea } from '../types';

interface CodeExplorerProps {
  project: ProjectIdea;
  onDownloadZip: () => void;
}

export default function CodeExplorer({ project, onDownloadZip }: CodeExplorerProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(project.files[0]?.path || '');
  const [copied, setCopied] = useState(false);

  // If active project changed and selected file doesn't exist, reset
  const currentFile = project.files.find((f) => f.path === selectedFilePath) || project.files[0];

  const handleCopyCode = async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const getBadgeForType = (type: NextJsCodeFile['type']) => {
    switch (type) {
      case 'server-action':
        return { label: "'use server'", color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'server-component':
        return { label: 'RSC Component', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'client-component':
        return { label: "'use client'", color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'route-handler':
        return { label: 'Edge Route Handler', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'config':
        return { label: 'Config / Library', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Source File', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    }
  };

  const badge = currentFile ? getBadgeForType(currentFile.type) : null;
  const lines = currentFile ? currentFile.code.split('\n') : [];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      {/* File Tabs & Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* File Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {project.files.map((file) => {
            const isSelected = file.path === currentFile?.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>{file.path}</span>
              </button>
            );
          })}
        </div>

        {/* File Actions */}
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${badge.color}`}>
              {badge.label}
            </span>
          )}

          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono flex items-center gap-1 transition active:scale-95"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onDownloadZip}
            className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded text-xs font-mono flex items-center gap-1 transition active:scale-95"
          >
            <Download className="w-3 h-3 text-indigo-400" />
            <span>.ZIP</span>
          </button>
        </div>
      </div>

      {/* Description Callout */}
      {currentFile && (
        <div className="bg-slate-900/40 px-4 py-2 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{currentFile.description}</span>
        </div>
      )}

      {/* Code Viewer with Line Numbers */}
      <div className="p-4 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                <td className="w-10 pr-4 text-right select-none text-slate-600 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="text-slate-300 whitespace-pre">
                  {line.startsWith("'use server'") ? (
                    <span className="text-emerald-400 font-bold">{line}</span>
                  ) : line.startsWith("'use client'") ? (
                    <span className="text-cyan-400 font-bold">{line}</span>
                  ) : line.includes('import ') ? (
                    <span className="text-purple-300">{line}</span>
                  ) : line.includes('export ') ? (
                    <span className="text-indigo-300 font-semibold">{line}</span>
                  ) : line.includes('revalidateTag') || line.includes('unstable_cache') ? (
                    <span className="text-amber-300 font-semibold">{line}</span>
                  ) : (
                    line
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
