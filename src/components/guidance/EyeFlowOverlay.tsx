import { useCallback, useEffect, useState } from 'react';
import { Eye, Pause, Play, Sparkles } from 'lucide-react';
import { useDesignStudio } from '@/state/designStudio';

interface BlockAnchor {
  id: string;
  step: number;
  title: string;
  cue: string;
  x: number;
  y: number;
  width: number;
  height: number;
  weightPct: number;
  scanSec: string;
}

const FIXATION_WEIGHTS = [46, 28, 16, 10, 8, 6];
const SCAN_TIMESTAMPS = ['0.3s', '1.1s', '2.0s', '3.1s', '4.2s', '5.0s'];

export function EyeFlowHud() {
  const { tokens, activeScreenId, screenBlocks, getOrderedBlocks, blockOverrides, pulseBlock, updateToken } =
    useDesignStudio();

  const metaList = screenBlocks[activeScreenId] ?? [];
  const ordered = getOrderedBlocks(activeScreenId, metaList).filter(
    (b) => !blockOverrides[b.id]?.hidden,
  );

  if (tokens.eyeMode === 'off' || ordered.length === 0) {
    return null;
  }

  const jumpToBlock = (blockId: string, idx: number) => {
    pulseBlock(blockId);
    if (tokens.eyeMode === 'spotlight') {
      updateToken('spotlightStep', idx);
    }
    const target = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative z-20 flex shrink-0 items-center justify-between gap-1.5 border-b border-black/8 bg-white/90 px-3 py-1.5 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto no-scrollbar">
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#08261e] px-2 py-0.5 text-[9px] font-bold text-[#74bf1e]">
          <Eye className="h-2.5 w-2.5" />
          Eye Flow
        </span>
        {ordered.map((block, idx) => (
          <button
            key={block.id}
            type="button"
            onClick={() => jumpToBlock(block.id, idx)}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors ${
              idx === 0 || (tokens.eyeMode === 'spotlight' && tokens.spotlightStep === idx)
                ? 'bg-[#e5f5de] text-[#08261e] ring-1 ring-[#74bf1e]/60'
                : 'bg-[#f1f5f3] text-[#4a635c] hover:bg-[#e4ece8] hover:text-[#08261e]'
            }`}
            title={block.eyeCue}
          >
            <span className="font-bold text-[#005e48]">{idx + 1}.</span>
            <span className="max-w-[78px] truncate">{block.title}</span>
          </button>
        ))}
      </div>
      {tokens.eyeMode !== 'spotlight' && (
        <button
          type="button"
          onClick={() => updateToken('eyeMode', 'spotlight')}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#ebf3f0] px-1.5 py-0.5 text-[9px] font-bold text-[#005e48] hover:bg-[#dceae4]"
          title="Start guided Spotlight Tour"
        >
          <Sparkles className="h-2.5 w-2.5" />
          Tour
        </button>
      )}
    </div>
  );
}

export function EyeFlowOverlay({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { tokens, activeScreenId, blockOrders, blockOverrides } = useDesignStudio();
  const [anchors, setAnchors] = useState<BlockAnchor[]>([]);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [motionPaused, setMotionPaused] = useState(false);

  const measure = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || tokens.eyeMode !== 'vectors') {
      setAnchors([]);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    setViewportSize({ w: containerRect.width, h: containerRect.height });

    const blockEls = Array.from(
      container.querySelectorAll<HTMLElement>('[data-block-step]'),
    );

    const nextAnchors: BlockAnchor[] = blockEls.map((el, i) => {
      const rect = el.getBoundingClientRect();
      // Place F/Z fixation points naturally (top-left for hero, alternating/centering for actions)
      const relLeft = rect.left - containerRect.left;
      const relTop = rect.top - containerRect.top;
      const xOffset = i === 0 ? 0.28 : i % 2 === 1 ? 0.68 : 0.36;
      const yOffset = Math.min(34, rect.height * 0.34);

      return {
        id: el.dataset.blockId ?? `b-${i}`,
        step: Number(el.dataset.blockStep ?? i + 1),
        title: el.dataset.blockTitle ?? `Step ${i + 1}`,
        cue: el.dataset.blockCue ?? '',
        x: Math.max(24, Math.min(containerRect.width - 24, relLeft + rect.width * xOffset)),
        y: relTop + yOffset,
        width: rect.width,
        height: rect.height,
        weightPct: FIXATION_WEIGHTS[i] ?? 5,
        scanSec: SCAN_TIMESTAMPS[i] ?? `${i + 1}s`,
      };
    });

    setAnchors(nextAnchors);
  }, [scrollContainerRef, tokens.eyeMode]);

  useEffect(() => {
    if (tokens.eyeMode !== 'vectors') {
      setAnchors([]);
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    // Delay initial measure slightly for layout animations to settle
    const timer = window.setTimeout(scheduleMeasure, 160);
    scheduleMeasure();

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(container);
    container.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [
    scrollContainerRef,
    tokens.eyeMode,
    tokens.blockGap,
    tokens.cardPadding,
    tokens.screenPadding,
    activeScreenId,
    blockOrders,
    blockOverrides,
    measure,
  ]);

  if (tokens.eyeMode !== 'vectors' || anchors.length === 0 || viewportSize.w === 0) {
    return null;
  }

  // Build smooth cubic bezier saccade curve segments
  const buildPath = () => {
    if (anchors.length < 2) return '';
    let d = `M ${anchors[0].x} ${anchors[0].y}`;
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      const midY = (a.y + b.y) / 2;
      const cx1 = a.x + (b.x - a.x) * 0.15;
      const cx2 = b.x - (b.x - a.x) * 0.15;
      d += ` C ${cx1} ${midY}, ${cx2} ${midY}, ${b.x} ${b.y}`;
    }
    return d;
  };

  const pathD = buildPath();

  return (
    <div className="pointer-events-none absolute inset-0 z-25 overflow-hidden">
      <svg
        width={viewportSize.w}
        height={viewportSize.h}
        viewBox={`0 0 ${viewportSize.w} ${viewportSize.h}`}
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="gazeHeatPrimary" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#74bf1e" stopOpacity="0.48" />
            <stop offset="45%" stopColor="#c89b3c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#005e48" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gazeHeatSecondary" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#005e48" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#74bf1e" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#005e48" stopOpacity="0" />
          </radialGradient>
          <marker
            id="saccadeArrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M 0 1 L 7 4 L 0 7 z" fill="#08261e" />
          </marker>
        </defs>

        {/* Gaze Heatmap Fixation Blobs */}
        {tokens.showSaccadeHeatmap &&
          anchors.map((pt, idx) => (
            <circle
              key={`heat-${pt.id}`}
              cx={pt.x}
              cy={pt.y}
              r={idx === 0 ? 74 : Math.max(36, 62 - idx * 8)}
              fill={idx === 0 ? 'url(#gazeHeatPrimary)' : 'url(#gazeHeatSecondary)'}
            />
          ))}

        {/* Saccade Curve Underlay */}
        {pathD && (
          <>
            <path
              d={pathD}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.75}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#08261e"
              strokeWidth={2.2}
              strokeDasharray="6 6"
              markerEnd="url(#saccadeArrow)"
              className={`ds-saccade-flow ${motionPaused ? 'is-paused' : ''}`}
            />
          </>
        )}

        {/* Fixation Reticles & Scan Timestamps */}
        {anchors.map((pt, idx) => (
          <g key={`reticle-${pt.id}`} transform={`translate(${pt.x}, ${pt.y})`}>
            <circle
              r={idx === 0 ? 15 : 13}
              fill="#08261e"
              stroke="#74bf1e"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontSize="11"
              fontWeight="800"
            >
              {pt.step}
            </text>
            <rect
              x={16}
              y={-11}
              width={66}
              height={22}
              rx={11}
              fill="#08261e"
              fillOpacity={0.92}
            />
            <text
              x={49}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e5f5de"
              fontSize="9"
              fontWeight="700"
            >
              {pt.scanSec} · {pt.weightPct}%
            </text>
          </g>
        ))}
      </svg>

      {/* Accessible Pause/Play control for continuous saccade animation */}
      <button
        type="button"
        onClick={() => setMotionPaused((p) => !p)}
        aria-label={motionPaused ? 'Play gaze vector animation' : 'Pause gaze vector animation'}
        className="pointer-events-auto absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full bg-[#08261e]/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md backdrop-blur-xs hover:bg-[#08261e]"
      >
        {motionPaused ? <Play className="h-3 w-3 text-[#74bf1e]" /> : <Pause className="h-3 w-3 text-[#74bf1e]" />}
        <span>{motionPaused ? 'Play Scan' : 'Pause Scan'}</span>
      </button>
    </div>
  );
}
