import React, { useState } from 'react';
import { 
  Play, 
  Code2, 
  Workflow, 
  Share2, 
  Sparkles, 
  Flame, 
  Download, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Layers,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { ProjectIdea } from '../types';
import ChronoStateSim from './simulations/ChronoStateSim';
import NeuroMeshSim from './simulations/NeuroMeshSim';
import ChaosMonkeySim from './simulations/ChaosMonkeySim';
import SovereignAiSim from './simulations/SovereignAiSim';
import AlgoArenaSim from './simulations/AlgoArenaSim';
import CodeExplorer from './CodeExplorer';
import ArchitectureBlueprint from './ArchitectureBlueprint';
import ComplexityGauge from './ComplexityGauge';

interface ShowcaseProps {
  projects: ProjectIdea[];
  activeProject: ProjectIdea;
  onSelectProject: (id: string) => void;
  onOpenGenerator: () => void;
  onDownloadZip: () => void;
}

export default function ProjectShowcase({
  projects,
  activeProject,
  onSelectProject,
  onOpenGenerator,
  onDownloadZip
}: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'code' | 'blueprint' | 'strategy'>('demo');

  const renderActiveSimulation = () => {
    switch (activeProject.quickDemoType) {
      case 'chronostate':
        return <ChronoStateSim />;
      case 'neuromesh':
        return <NeuroMeshSim />;
      case 'chaos':
        return <ChaosMonkeySim />;
      case 'sovereign':
        return <SovereignAiSim />;
      case 'arena':
        return <AlgoArenaSim />;
      default:
        return <ChronoStateSim />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Designed for Staff & Principal Engineers creating standout portfolio demos
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono leading-tight">
                Crazy Next.js 15 Project Lab
              </h1>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Tired of generic CRUD apps, todo lists, and AI wrapper dashboards? Explore 
                <span className="text-slate-200 font-semibold"> 5 radical, boundary-pushing Next.js 15 concepts </span>
                with live playable simulators, full production-grade App Router code, and architectural blueprints.
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenGenerator}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Synthesize Custom Idea
              </button>

              <button
                onClick={onDownloadZip}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Export Next.js Project (.ZIP)
              </button>
            </div>
          </div>

          {/* Project Selector Carousel / Tabs */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {projects.map((proj) => {
              const isSelected = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`p-3.5 rounded-xl border text-left font-mono transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                      : 'bg-slate-950/60 hover:bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                        {proj.badge}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-white truncate">
                      {proj.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                      {proj.tagline}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-500">
                    <span>{proj.complexity}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Project Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeProject.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeProject.complexity}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeProject.badge}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
                {activeProject.title}: <span className="text-slate-400 font-normal">{activeProject.tagline}</span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm font-mono max-w-4xl leading-relaxed">
                <span className="text-amber-400 font-bold">Why it's crazy: </span>
                {activeProject.whyCrazy}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('blueprint')}
                className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-mono flex items-center gap-2 transition active:scale-95"
              >
                <Workflow className="w-4 h-4 text-indigo-400" />
                View Architecture Blueprint
              </button>

              <button
                onClick={onDownloadZip}
                className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-mono flex items-center gap-2 transition active:scale-95"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                Download Repo (.ZIP)
              </button>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeProject.nextjsFeatures.map((feat, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 font-mono">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-bold">{feat.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    {feat.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

          {/* D3 Technical Complexity Gauge */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <ComplexityGauge metrics={activeProject.complexityMetrics} projectTitle={activeProject.title} />
          </div>
        </div>
      </section>

      {/* Main Workspace: 4 Mode Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'demo'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            1. Live Interactive Demo
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            2. Next.js 15 Code Explorer ({activeProject.files.length} Files)
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'blueprint'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            3. Architecture Blueprint (Mermaid & Flow)
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition ${
              activeTab === 'strategy'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            4. Viral Launch & Strategy
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'demo' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                Live Interactive Simulation for <span className="text-white font-bold">{activeProject.title}</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Simulating Next.js 15 runtime behavior in real-time
              </span>
            </div>
            {renderActiveSimulation()}
          </div>
        )}

        {activeTab === 'code' && (
          <CodeExplorer project={activeProject} onDownloadZip={onDownloadZip} />
        )}

        {activeTab === 'blueprint' && (
          <ArchitectureBlueprint project={activeProject} />
        )}

        {activeTab === 'strategy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Why This Gets You Hired */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Why This Crazy Demo Defines a Senior/Staff Portfolio
              </h4>

              <div className="space-y-3 text-slate-300">
                <p className="leading-relaxed">
                  Junior and mid-level developers build boilerplate dashboards, clones of SaaS apps, or generic AI chatbots. Senior and Staff engineers show mastery of:
                </p>

                <ul className="space-y-2 text-slate-400 list-disc list-inside">
                  {activeProject.techHurdlesSolved.map((hurdle, i) => (
                    <li key={i} className="text-slate-300">
                      <span className="font-semibold text-white">{hurdle}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-slate-400 pt-2 border-t border-slate-800">
                  Demonstrating distributed resilience, zero-latency optimistic rollbacks, or edge streaming proves you can solve high-concurrency production challenges.
                </p>
              </div>
            </div>

            {/* Viral Launch Playbook */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Viral Launch & GitHub Playbook
              </h4>

              <div className="space-y-3 text-slate-300">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-[11px] text-indigo-300 font-bold mb-1">
                    The 15-Second Demo Hook:
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {activeProject.viralFactor}
                  </p>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="font-bold text-white">Recommended Launch Steps:</div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-400">
                    1. Record a 20-second screen capture dragging the time-travel scrubber or toggling chaos fault injection.
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-400">
                    2. Post on X/Twitter with title: "I built a visual time-travel debugger for Next.js 15 Server Actions..."
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-400">
                    3. Submit to Show HN with architectural deep-dive on React 19 useOptimistic & flight protocol decoding.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
