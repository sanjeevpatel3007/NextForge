import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Wand2, 
  Check, 
  Terminal, 
  Layers, 
  Cpu, 
  Flame, 
  ArrowRight,
  Code2
} from 'lucide-react';
import { CrazyCategory, ComplexityLevel, ProjectIdea } from '../types';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomProject: (project: ProjectIdea) => void;
}

export default function IdeaGeneratorModal({
  isOpen,
  onClose,
  onAddCustomProject
}: GeneratorModalProps) {
  const [domain, setDomain] = useState<CrazyCategory>('DevTools & Internals');
  const [seniority, setSeniority] = useState<ComplexityLevel>('Staff Engineer');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Server Actions',
    'RSC Streaming',
    'Optimistic UI',
    'Cache Tags'
  ]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ProjectIdea | null>(null);

  if (!isOpen) return null;

  const allIngredients = [
    'Server Actions',
    'RSC Streaming',
    'Optimistic UI',
    'Cache Tags',
    'Edge Middleware',
    'WebAssembly (WASM)',
    'Distributed Chaos',
    'Multi-Agent AI',
    'WebGPU / Canvas'
  ];

  const toggleIngredient = (item: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          seniority,
          features: selectedIngredients,
          customPrompt
        })
      });

      const data = await res.json();

      if (data.idea) {
        const raw = data.idea;
        const newProj: ProjectIdea = {
          id: raw.id || 'custom-' + Date.now(),
          title: raw.title || 'Generated Next.js Innovation',
          tagline: raw.tagline || 'Custom synthesized Next.js 15 demo',
          category: domain,
          complexity: seniority,
          badge: raw.badge || 'AI-SYNTHESIZED',
          whyCrazy: raw.whyCrazy || 'Breaks conventional paradigms using advanced Next.js 15 primitives.',
          viralFactor: raw.viralFactor || 'High engineering leverage and visual demonstration.',
          techHurdlesSolved: raw.corePillars || [
            'Server Action boundary isolation',
            'Sub-second Edge data reconciliation',
            'Zero-flash Optimistic state updates'
          ],
          nextjsFeatures: [
            {
              title: 'Custom Server Action Engine',
              tag: 'Server Actions',
              description: 'Next.js 15 Server Action with atomic validations and telemetry.'
            },
            {
              title: 'React Server Component Stream',
              tag: 'Streaming',
              description: 'Progressive streaming suspense boundaries.'
            }
          ],
          architectureSummary: {
            clientLayer: 'Next.js 15 Client Component with optimistic transitions',
            serverActionLayer: "'use server' action pipeline",
            edgeStreamingLayer: 'Edge route handler with SSE broadcast',
            persistenceLayer: 'Edge cache tags and durable transactional store'
          },
          quickDemoType: 'chronostate',
          files: [
            {
              path: raw.keySnippet?.filename || 'app/actions/custom-engine.ts',
              type: 'server-action',
              description: raw.keySnippet?.description || 'Next.js 15 Server Action Implementation',
              code: raw.keySnippet?.code || `'use server';\n\nimport { revalidateTag } from 'next/cache';\n\nexport async function customAction(formData: FormData) {\n  // Generated custom logic\n  return { success: true };\n}`
            }
          ]
        };

        setGeneratedResult(newProj);
      } else {
        // High quality fallback procedural generator
        generateProceduralIdea();
      }
    } catch (err) {
      console.warn('API error, using procedural synthesis:', err);
      generateProceduralIdea();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProceduralIdea = () => {
    const proceduralTitles = [
      {
        title: 'ChronoMesh: Distributed State Teleport',
        tagline: 'Multi-Region Next.js 15 State Teleportation via Edge Cache Invalidation',
        whyCrazy: 'Allows a developer to execute a Server Action in Tokyo and stream optimistic visual diffs across 12 distributed Edge nodes simultaneously with zero client-side socket dependencies.'
      },
      {
        title: 'ZeroLeak: Ephemeral WebAssembly Vault',
        tagline: 'In-Memory WASM Encryption with Next.js 15 Secure Enclave Actions',
        whyCrazy: 'Zero database persistence: all sensitive user payloads are transformed in memory via client WASM and verified with cryptographic zero-knowledge Server Actions.'
      },
      {
        title: 'GhostWriter AST: Live Autonomous Refactorer',
        tagline: 'Multi-Agent Next.js 15 Code Synthesis with Optimistic Rollbacks',
        whyCrazy: 'A browser-based IDE that continuously benchmarks RSC performance regressions and automatically dispatches Server Action git patches with test verification.'
      }
    ];

    const pick = proceduralTitles[Math.floor(Math.random() * proceduralTitles.length)];

    const fallbackProject: ProjectIdea = {
      id: 'custom-' + Date.now(),
      title: pick.title,
      tagline: pick.tagline,
      category: domain,
      complexity: seniority,
      badge: 'STAFF SYNTHESIZED',
      whyCrazy: pick.whyCrazy,
      viralFactor: 'Exposes deep distributed systems nuances inside a slick, interactive Next.js 15 web application.',
      techHurdlesSolved: [
        'Deterministic state reconciliation across asynchronous Server Actions',
        'Sub-10ms flight payload delivery via Edge Route Handlers',
        'Preventing cache stampedes with Next.js 15 unstable_cache and revalidateTag'
      ],
      nextjsFeatures: [
        {
          title: 'Transactional Server Action Pipeline',
          tag: 'Server Actions',
          description: 'Atomic action execution with error recovery and optimistic rollbacks.'
        },
        {
          title: 'Streaming Suspense Architecture',
          tag: 'Streaming',
          description: 'Async Server Components streaming fallback skeletons without blocking TTI.'
        }
      ],
      architectureSummary: {
        clientLayer: 'Next.js 15 Client Component with useOptimistic and interactive canvas controls',
        serverActionLayer: "'use server' action verifying input schema with Zod and recording nanosecond telemetry",
        edgeStreamingLayer: 'Edge Route Handler streaming live events over SSE',
        persistenceLayer: 'Multi-tiered cache with on-demand cache tag revalidation'
      },
      quickDemoType: 'chronostate',
      files: [
        {
          path: 'app/actions/engine.ts',
          type: 'server-action',
          description: 'Synthesized Next.js 15 Server Action with high-precision spans and cache tags',
          code: `'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const ActionInputSchema = z.object({
  payloadId: z.string().min(3),
  targetLatency: z.number().default(0),
});

export async function executeSynthesizedAction(formData: FormData) {
  const start = performance.now();
  
  const parsed = ActionInputSchema.safeParse({
    payloadId: formData.get('payloadId'),
    targetLatency: Number(formData.get('targetLatency') || 0),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() };
  }

  // Next.js 15 on-demand cache tag invalidation
  revalidateTag('synthesized-telemetry');

  return {
    success: true,
    executionSpanMs: Math.round(performance.now() - start),
    timestamp: new Date().toISOString(),
  };
}
`
        }
      ]
    };

    setGeneratedResult(fallbackProject);
  };

  const handleApplyToLab = () => {
    if (generatedResult) {
      onAddCustomProject(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Wand2 className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">
                Crazy Next.js 15 Project Synthesizer
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Generate mind-blowing demo architectures for staff & senior developers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-mono text-xs">
          {/* Domain Selection */}
          <div>
            <label className="text-slate-300 font-bold block mb-2">
              1. Target Engineering Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'DevTools & Internals',
                  'Distributed Systems & Chaos',
                  'Multi-Agent & AI',
                  'Local-First & WASM',
                  'High-Frequency & Real-Time'
                ] as CrazyCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDomain(cat)}
                  className={`p-2 rounded-lg border text-left text-[11px] transition ${
                    domain === cat
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Seniority Level */}
          <div>
            <label className="text-slate-300 font-bold block mb-2">
              2. Target Seniority Impact
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Staff Engineer', 'Principal Architect', 'Viral Open-Source', 'Senior Fullstack'] as ComplexityLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSeniority(lvl)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition ${
                      seniority === lvl
                        ? 'bg-indigo-600 text-white font-semibold border-indigo-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Ingredients Chips */}
          <div>
            <label className="text-slate-300 font-bold block mb-2">
              3. Next.js 15 Spice Ingredients
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allIngredients.map((ing) => {
                const isSelected = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className={`px-2.5 py-1 rounded-md text-[11px] border transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    {ing}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt Optional Input */}
          <div>
            <label className="text-slate-300 font-bold block mb-1">
              4. Specific Quirks or Prompt (Optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Build an in-memory 3D git graph with optimistic server action rollbacks"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="p-4 bg-slate-950 border border-indigo-500/50 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {generatedResult.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {generatedResult.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {generatedResult.tagline}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded text-slate-300 text-[11px] leading-relaxed border border-slate-800">
                <span className="text-amber-400 font-bold">Why it's crazy: </span>
                {generatedResult.whyCrazy}
              </div>

              <button
                onClick={handleApplyToLab}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Check className="w-4 h-4" /> Load This Project into Live Lab
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95 shadow-md"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                Synthesizing Crazy Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Synthesize Crazy Idea
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
