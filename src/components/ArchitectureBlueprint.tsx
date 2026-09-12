import React from 'react';
import { 
  Workflow, 
  Layers, 
  ArrowRight, 
  Database, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';
import { ProjectIdea } from '../types';
import ArchitectureVisualizer from './ArchitectureVisualizer';

interface BlueprintProps {
  project: ProjectIdea;
}

export default function ArchitectureBlueprint({ project }: BlueprintProps) {
  return (
    <div className="space-y-6">
      {/* 1. Mermaid.js & Canvas Visual Architecture Diagram */}
      <ArchitectureVisualizer project={project} />

      {/* 2. 4-Tier Architectural Pipeline & Execution Boundaries */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 font-mono">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Runtime Execution Boundaries & Data Flow Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict separation of concerns across Browser, RSC, Server Action, and Edge Persistence
            </p>
          </div>
          <span className="text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-full">
            {project.complexity}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Tier 1: Client Layer */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  01. Client Tier
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">
                  'use client'
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Optimistic UI & Hydration
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {project.architectureSummary.clientLayer}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500">
              Primitives: useOptimistic, useActionState, Transitions
            </div>
          </div>

          {/* Tier 2: Server Action Boundary */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  02. Server Action
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">
                  'use server'
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Atomic Mutation & Auth
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {project.architectureSummary.serverActionLayer}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500">
              Primitives: POST RPC, Zod Validation, Nanosecond Spans
            </div>
          </div>

          {/* Tier 3: Edge Streaming */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  03. Edge Streaming
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded">
                  Edge PoP
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                SSE & Route Handlers
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {project.architectureSummary.edgeStreamingLayer}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500">
              Primitives: ReadableStream, SSE, Zero-Cold-Start
            </div>
          </div>

          {/* Tier 4: Cache & Persistence */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  04. Cache & Data
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">
                  revalidateTag
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" />
                Invalidation & Ledger
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {project.architectureSummary.persistenceLayer}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-slate-500">
              Primitives: unstable_cache, Cache Tags, Durable Store
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
