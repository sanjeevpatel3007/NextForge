import React, { useEffect, useRef, useState, useMemo } from 'react';
import mermaid from 'mermaid';
import { 
  Workflow, 
  Code2, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2,
  Activity,
  Layers,
  Sparkles,
  Cpu,
  Globe,
  Database,
  ArrowRight
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface VisualizerProps {
  project: ProjectIdea;
}

export default function ArchitectureVisualizer({ project }: VisualizerProps) {
  const [activeView, setActiveView] = useState<'mermaid' | 'canvas' | 'raw'>('mermaid');
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Derive or fallback mermaid definition
  const diagramCode = useMemo(() => {
    if (project.mermaidDiagram && project.mermaidDiagram.trim().length > 0) {
      return project.mermaidDiagram.trim();
    }
    // Procedural fallback if a newly generated project doesn't have one
    return `flowchart TD
  subgraph Client["Next.js 15 Client Layer ('use client')"]
    UI["Interactive UI Components<br/>(React 19 Hooks)"]
    Opt["useOptimistic()<br/>(Zero Latency State)"]
  end

  subgraph ServerActions["Server Action Boundary ('use server')"]
    Action["${project.title.replace(/[^a-zA-Z0-9]/g, '')}Action()<br/>with Atomic Isolation"]
  end

  subgraph EdgeLayer["Edge Streaming & Routing"]
    EdgeStream["Edge Route Handler<br/>(runtime = 'edge')"]
    Reval["revalidateTag('${project.id}-cache')<br/>(PoP CDN Invalidation)"]
  end

  subgraph Persistence["Cache & Data Store"]
    DB[("${project.architectureSummary.persistenceLayer.split(' ')[0] || 'Durable'} Store")]
  end

  UI -->|Dispatch Action| Action
  Action -->|Persist State| DB
  Action -->|Revalidate| Reval
  Reval --> EdgeStream
  EdgeStream -->|Stream RSC Payload| UI
  Action -.->|Instant Feedback| Opt`;
  }, [project]);

  // Initialize Mermaid on mount
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#020617',
        primaryColor: '#1e1b4b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#818cf8',
        secondaryColor: '#0f172a',
        tertiaryColor: '#090d16',
        mainBkg: '#0b0f19',
        nodeBorder: '#4f46e5',
        clusterBkg: '#090d16',
        clusterBorder: '#312e81',
        titleColor: '#c7d2fe',
        edgeLabelBackground: '#020617',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '11px',
      },
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 45,
        rankSpacing: 45,
      },
    });
  }, []);

  // Render SVG whenever project or diagramCode changes
  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        setRenderError(null);
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, diagramCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err.message || 'Failed to render Mermaid diagram.');
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [diagramCode]);

  // Copy Mermaid syntax
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(diagramCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Download SVG
  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}-architecture-diagram.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ----------------------------------------------------
  // Canvas-based Architecture Flow Simulation
  // ----------------------------------------------------
  useEffect(() => {
    if (activeView !== 'canvas') {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Define 4 Architecture Nodes
    const nodes = [
      { id: 'client', label: "Next.js Client Tier", sub: "'use client' Hydration", color: '#38bdf8', x: width * 0.15, y: height * 0.5, icon: 'Globe' },
      { id: 'actions', label: "Server Action Boundary", sub: "'use server' RPC & Zod", color: '#34d399', x: width * 0.38, y: height * 0.28, icon: 'Cpu' },
      { id: 'edge', label: "Edge Streaming PoP", sub: "SSE / ReadableStream", color: '#fbbf24', x: width * 0.62, y: height * 0.72, icon: 'Activity' },
      { id: 'persist', label: "Cache Tags & DB", sub: "revalidateTag & Store", color: '#a855f7', x: width * 0.85, y: height * 0.5, icon: 'Database' }
    ];

    // Data packets travelling between nodes
    interface Particle {
      x: number;
      y: number;
      progress: number;
      speed: number;
      fromIdx: number;
      toIdx: number;
      color: string;
      label: string;
    }

    const particles: Particle[] = [];
    const connectionPairs = [
      { from: 0, to: 1, label: 'Action POST (0.8ms)', color: '#38bdf8' },
      { from: 1, to: 3, label: 'Row Lock (12ms)', color: '#34d399' },
      { from: 3, to: 2, label: 'Tag Reval (4ms)', color: '#a855f7' },
      { from: 2, to: 0, label: 'Flight Stream (3ms)', color: '#fbbf24' },
      { from: 0, to: 2, label: 'SSE Subscribe', color: '#818cf8' },
    ];

    const spawnParticle = () => {
      if (particles.length >= 14) return;
      const pair = connectionPairs[Math.floor(Math.random() * connectionPairs.length)];
      particles.push({
        x: nodes[pair.from].x,
        y: nodes[pair.from].y,
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        fromIdx: pair.from,
        toIdx: pair.to,
        color: pair.color,
        label: pair.label
      });
    };

    let lastSpawn = 0;

    const render = (time: number) => {
      if (time - lastSpawn > 320) {
        spawnParticle();
        lastSpawn = time;
      }

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Connection Paths with Gradient Glow
      connectionPairs.forEach(pair => {
        const fromNode = nodes[pair.from];
        const toNode = nodes[pair.to];

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2 - 25;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y);
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Update & Draw Flying Data Packets
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const fromNode = nodes[p.fromIdx];
        const toNode = nodes[p.toIdx];
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2 - 25;

        // Quadratic Bezier interpolation
        const t = p.progress;
        p.x = (1 - t) * (1 - t) * fromNode.x + 2 * (1 - t) * t * midX + t * t * toNode.x;
        p.y = (1 - t) * (1 - t) * fromNode.y + 2 * (1 - t) * t * midY + t * t * toNode.y;

        // Packet Glow
        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Node Boxes
      nodes.forEach((node) => {
        const cardW = 160;
        const cardH = 72;
        const cardX = node.x - cardW / 2;
        const cardY = node.y - cardH / 2;

        // Node card background
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;

        // Rounded rect
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 10);
        ctx.fill();
        ctx.stroke();

        // Node Glow Corner
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(cardX + 14, cardY + 16, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node Title
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(node.label, cardX + 26, cardY + 20);

        // Node Subtitle
        ctx.font = '10px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(node.sub, cardX + 14, cardY + 42);

        // Status indicator
        ctx.font = '9px monospace';
        ctx.fillStyle = node.color;
        ctx.fillText('• HEALTHY 200 OK', cardX + 14, cardY + 60);
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeView]);

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-mono transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-slate-950 border-indigo-500/60' : 'relative'
      }`}
    >
      {/* Visualizer Header Toolbar */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{project.title} Architecture Visualizer</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                Mermaid.js Engine
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive system blueprint & runtime execution boundaries
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('mermaid')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeView === 'mermaid'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            Mermaid Diagram
          </button>

          <button
            onClick={() => setActiveView('canvas')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeView === 'canvas'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Live Canvas Flow
          </button>

          <button
            onClick={() => setActiveView('raw')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeView === 'raw'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Mermaid Code
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeView === 'mermaid' && (
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5 text-slate-400">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.2))}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition text-[10px] font-bold px-2"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
            </div>
          )}

          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs flex items-center gap-1.5 transition active:scale-95"
            title="Copy Mermaid syntax for GitHub README or Notion"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {activeView === 'mermaid' && (
            <button
              onClick={handleDownloadSvg}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs flex items-center gap-1.5 transition active:scale-95"
              title="Download SVG image"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export SVG</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg text-xs transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="relative min-h-[440px] max-h-[640px] overflow-auto flex items-center justify-center p-6 bg-slate-950/80">
        {/* MERMAID DIAGRAM VIEW */}
        {activeView === 'mermaid' && (
          <div className="w-full h-full flex items-center justify-center overflow-auto select-none">
            {renderError ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs max-w-md text-center">
                <div className="font-bold mb-1">Mermaid Rendering Error</div>
                <div className="text-[11px] text-slate-400 mb-3">{renderError}</div>
                <button
                  onClick={() => setActiveView('canvas')}
                  className="px-3 py-1 bg-rose-600/30 text-white rounded text-xs hover:bg-rose-600/50"
                >
                  Switch to Canvas Flow
                </button>
              </div>
            ) : svgContent ? (
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="flex items-center justify-center max-w-full [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:drop-shadow-lg"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Workflow className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Compiling Next.js system architecture diagram...</span>
              </div>
            )}
          </div>
        )}

        {/* CANVAS FLOW SIMULATION VIEW */}
        {activeView === 'canvas' && (
          <div className="w-full h-[460px] relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
            />
            {/* Live Canvas Overlay Telemetry Legend */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg text-[10px] text-slate-400 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Client 'use client'
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Server Action 'use server'
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Edge Stream PoP
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Cache Tags & DB
                </span>
              </div>

              <div className="text-emerald-400 font-bold">
                ● Live Data Flow: ~14.2 req/s simulated
              </div>
            </div>
          </div>
        )}

        {/* RAW MERMAID CODE VIEW */}
        {activeView === 'raw' && (
          <div className="w-full h-[460px] overflow-auto bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
              <span>Standard Mermaid.js Markdown Source</span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs text-indigo-300 font-mono leading-relaxed whitespace-pre selection:bg-indigo-500/40">
              {diagramCode}
            </pre>
          </div>
        )}
      </div>

      {/* Footer explanation bar */}
      <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next.js 15 Boundary Isolation: Zero sensitive API key leaks, streaming edge fallbacks, and transactional ACID consistency.</span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Pan & Zoom available • Compatible with GitHub Markdown & Mermaid Live
        </div>
      </div>
    </div>
  );
}
