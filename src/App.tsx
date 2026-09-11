/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import ProjectShowcase from './components/ProjectShowcase';
import IdeaGeneratorModal from './components/IdeaGeneratorModal';
import { CRAZY_PROJECTS } from './data/crazyProjects';
import { ProjectIdea } from './types';
import { downloadProjectAsZip } from './utils/exportProject';
import { Check, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<ProjectIdea[]>(CRAZY_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('chronostate');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDownloadZip = async () => {
    try {
      showToast(`Generating ${activeProject.title} Next.js 15 repository ZIP...`);
      await downloadProjectAsZip(activeProject);
      showToast(`Downloaded ${activeProject.title} starter repo successfully!`);
    } catch (err) {
      console.error('Download error:', err);
      showToast('Export failed. Please copy files directly from Code Explorer.');
    }
  };

  const handleAddCustomProject = (newProj: ProjectIdea) => {
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    showToast(`Synthesized "${newProj.title}" and loaded into demo lab!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeProject={activeProject}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onDownloadZip={handleDownloadZip}
        onSelectProject={(id) => setActiveProjectId(id)}
        allProjects={projects}
      />

      {/* Main Content Showcase */}
      <main>
        <ProjectShowcase
          projects={projects}
          activeProject={activeProject}
          onSelectProject={(id) => setActiveProjectId(id)}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          onDownloadZip={handleDownloadZip}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950/80 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>NextForge • Professional Next.js 15 Crazy Project Architecture Lab</span>
          </div>
          <div className="text-slate-600 text-[11px]">
            React 19 • App Router • Server Actions • RSC Streaming • Edge Telemetry
          </div>
        </div>
      </footer>

      {/* Idea Generator Modal */}
      <IdeaGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onAddCustomProject={handleAddCustomProject}
      />
    </div>
  );
}
