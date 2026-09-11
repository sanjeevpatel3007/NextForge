import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Download, 
  FolderDown, 
  Flame, 
  Layers, 
  Code2,
  ExternalLink
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface HeaderProps {
  activeProject: ProjectIdea;
  onOpenGenerator: () => void;
  onDownloadZip: () => void;
  onSelectProject: (id: string) => void;
  allProjects: ProjectIdea[];
}

export default function Header({
  activeProject,
  onOpenGenerator,
  onDownloadZip,
  onSelectProject,
  allProjects
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white font-mono">
                Next<span className="text-indigo-400">Forge</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CRAZY DEMO LAB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Staff-Grade Next.js 15 Blueprints & Interactive Simulators
            </p>
          </div>
        </div>

        {/* Quick project switcher for desktop */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {allProjects.map((p) => {
            const isActive = p.id === activeProject.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenGenerator}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Synthesize</span> Crazy Idea
          </button>

          <button
            onClick={onDownloadZip}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition active:scale-95"
            title="Download full runnable Next.js 15 repository ZIP"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span> .ZIP
          </button>
        </div>
      </div>
    </header>
  );
}
