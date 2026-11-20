import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { useDesignStudio, type BlockMeta } from '@/state/designStudio';

export interface BlockDefinition extends BlockMeta {
  render: () => React.ReactNode;
}

const STEP_CIRCLES = ['①', '②', '③', '④', '⑤', '⑥'];

export function BlockCanvas({
  screenId,
  blocks,
}: {
  screenId: string;
  blocks: BlockDefinition[];
}) {
  const {
    tokens,
    blockOverrides,
    selectedBlockId,
    pulsedBlockId,
    registerScreenBlocks,
    getOrderedBlocks,
    moveBlock,
    moveBlockByDelta,
    toggleBlockHidden,
    selectBlock,
    updateToken,
    nextSpotlightStep,
    prevSpotlightStep,
  } = useDesignStudio();

  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const spotlightDialogRef = useRef<HTMLDivElement>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Active pointer drag state
  const [dragState, setDragState] = useState<{
    blockId: string;
    fromIndex: number;
    toIndex: number;
    pointerId: number;
    startY: number;
    deltaY: number;
  } | null>(null);

  const metaList = useMemo<BlockMeta[]>(
    () =>
      blocks.map(({ id, title, eyeCue, whyHere }) => ({
        id,
        title,
        eyeCue,
        whyHere,
      })),
    [blocks],
  );

  useEffect(() => {
    registerScreenBlocks(screenId, metaList);
  }, [screenId, metaList, registerScreenBlocks]);

  const orderedMeta = useMemo(
    () => getOrderedBlocks(screenId, metaList),
    [screenId, metaList, getOrderedBlocks],
  );

  const blocksById = useMemo(
    () => new Map(blocks.map((b) => [b.id, b])),
    [blocks],
  );

  const orderedBlocks = useMemo(
    () =>
      orderedMeta
        .map((m) => blocksById.get(m.id))
        .filter((b): b is BlockDefinition => Boolean(b)),
    [orderedMeta, blocksById],
  );

  const visibleBlocks = useMemo(
    () => orderedBlocks.filter((b) => !blockOverrides[b.id]?.hidden),
    [orderedBlocks, blockOverrides],
  );

  const hiddenCount = orderedBlocks.length - visibleBlocks.length;

  // Determine active spotlight block when eyeMode === 'spotlight'
  const spotlightIndex =
    visibleBlocks.length > 0 ? Math.min(tokens.spotlightStep, visibleBlocks.length - 1) : 0;
  const spotlightBlockId =
    tokens.eyeMode === 'spotlight' ? visibleBlocks[spotlightIndex]?.id ?? null : null;

  useEffect(() => {
    if (!spotlightBlockId) return;
    const node = blockRefs.current[spotlightBlockId];
    if (node) {
      node.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }, [spotlightBlockId, prefersReducedMotion]);

  // Compute drop target index & update CSS drop line marker from layout midpoints
  const updateDropTarget = useCallback(
    (clientY: number, fromIndex: number) => {
      const listEl = containerRef.current;
      if (!listEl) return fromIndex;

      const children = Array.from(
        listEl.querySelectorAll<HTMLElement>('[data-block-item="true"]'),
      );
      if (children.length === 0) return fromIndex;

      let targetIndex = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        if (clientY < midpoint) {
          targetIndex = i;
          break;
        }
      }

      // Convert insertion slot to final array index
      const nextIndex = targetIndex > fromIndex ? targetIndex - 1 : targetIndex;
      const clampedIndex = Math.max(0, Math.min(children.length - 1, nextIndex));

      if (clampedIndex === fromIndex) {
        listEl.removeAttribute('data-drop');
      } else {
        const listRect = listEl.getBoundingClientRect();
        let lineY: number;
        if (targetIndex === 0) {
          lineY = children[0].getBoundingClientRect().top - 4;
        } else if (targetIndex >= children.length) {
          lineY = children[children.length - 1].getBoundingClientRect().bottom + 2;
        } else {
          const prevBottom = children[targetIndex - 1].getBoundingClientRect().bottom;
          const nextTop = children[targetIndex].getBoundingClientRect().top;
          lineY = (prevBottom + nextTop) / 2;
        }

        listEl.setAttribute('data-drop', 'true');
        listEl.style.setProperty('--drop-x', `${listRect.left + 4}px`);
        listEl.style.setProperty('--drop-y', `${lineY}px`);
        listEl.style.setProperty('--drop-w', `${Math.max(40, listRect.width - 8)}px`);
      }

      return clampedIndex;
    },
    [],
  );

  const clearDrag = useCallback(() => {
    document.documentElement.classList.remove('is-dragging-blocks');
    if (containerRef.current) {
      containerRef.current.removeAttribute('data-drop');
    }
    setDragState(null);
  }, []);

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== dragState.pointerId) return;
      const nextTo = updateDropTarget(e.clientY, dragState.fromIndex);
      setDragState((prev) =>
        prev
          ? {
              ...prev,
              toIndex: nextTo,
              deltaY: e.clientY - prev.startY,
            }
          : null,
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId !== dragState.pointerId) return;
      const block = orderedBlocks.find((b) => b.id === dragState.blockId);
      if (dragState.toIndex !== dragState.fromIndex) {
        moveBlock(screenId, dragState.fromIndex, dragState.toIndex);
        if (block) {
          setLiveAnnouncement(`Moved ${block.title} to position ${dragState.toIndex + 1}`);
        }
      }
      clearDrag();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setLiveAnnouncement('Reordering cancelled');
        clearDrag();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', clearDrag);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', clearDrag);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragState, updateDropTarget, moveBlock, screenId, orderedBlocks, clearDrag]);

  const handleDeltaMove = useCallback(
    (blockId: string, title: string, delta: -1 | 1, currentIdx: number) => {
      const targetIdx = currentIdx + delta;
      if (targetIdx < 0 || targetIdx >= orderedBlocks.length) return;
      moveBlockByDelta(screenId, blockId, delta);
      setLiveAnnouncement(`Moved ${title} to position ${targetIdx + 1} of ${orderedBlocks.length}`);
    },
    [moveBlockByDelta, orderedBlocks.length, screenId],
  );

  const motionTransition =
    prefersReducedMotion || tokens.motionPreset === 'reduced'
      ? { duration: 0 }
      : tokens.motionPreset === 'snappy'
        ? { duration: 0.15, ease: 'easeOut' as const }
        : { type: 'spring' as const, stiffness: 360, damping: 28 };

  let visibleCounter = 0;

  return (
    <div
      ref={containerRef}
      className="ds-block-list relative flex flex-col"
      style={{ gap: 'var(--ds-block-gap)' }}
    >
      {/* Screen-reader live region for block move updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {orderedBlocks.map((block, fullIndex) => {
        const override = blockOverrides[block.id] ?? {};
        const isHidden = Boolean(override.hidden);
        if (isHidden && !tokens.studioEditMode) {
          return null;
        }

        const visibleIndex = isHidden ? -1 : visibleCounter++;
        const stepNumber = visibleIndex >= 0 ? visibleIndex + 1 : null;
        const isDraggingThis = dragState?.blockId === block.id;
        const isSelected = selectedBlockId === block.id;
        const isPulsed = pulsedBlockId === block.id;
        const isSpotlightTarget = spotlightBlockId === block.id;
        const isDimmedBySpotlight =
          tokens.eyeMode === 'spotlight' && spotlightBlockId !== null && !isSpotlightTarget;

        const blockStyle: React.CSSProperties = {
          marginBlock: override.marginY !== undefined ? `${override.marginY}px` : undefined,
          opacity: isDraggingThis
            ? 0.96
            : isHidden
              ? 0.45
              : isDimmedBySpotlight
                ? 'var(--ds-dim-opacity)'
                : 1,
          transform: isDraggingThis ? `translateY(${dragState.deltaY}px) scale(1.02)` : undefined,
          zIndex: isDraggingThis ? 50 : isSpotlightTarget ? 30 : undefined,
          ...(override.padding !== undefined
            ? ({ '--ds-card-padding': `${override.padding}px` } as React.CSSProperties)
            : {}),
          ...(override.radius !== undefined
            ? ({ '--ds-card-radius': `${override.radius}px` } as React.CSSProperties)
            : {}),
        };

        const showBeaconRing =
          (tokens.eyeMode === 'beacons' && stepNumber === 1) || isPulsed || isSpotlightTarget;

        return (
          <motion.div
            key={block.id}
            ref={(el) => {
              blockRefs.current[block.id] = el;
            }}
            layout={!isDraggingThis && !prefersReducedMotion && tokens.motionPreset !== 'reduced'}
            transition={motionTransition}
            data-block-item="true"
            data-block-id={block.id}
            data-block-step={stepNumber ?? undefined}
            data-block-title={block.title}
            data-block-cue={block.eyeCue}
            style={blockStyle}
            onClick={(e) => {
              if (!tokens.studioEditMode) return;
              // Allow selecting block without blocking internal buttons
              const target = e.target as HTMLElement;
              if (!target.closest('button, input, select, a')) {
                selectBlock(block.id);
              }
            }}
            className={`group/block relative rounded-[var(--ds-card-radius)] transition-[opacity,box-shadow] duration-200 ${
              isDraggingThis ? 'pointer-events-none shadow-2xl ring-2 ring-[#74bf1e]' : ''
            } ${
              isSelected && tokens.studioEditMode
                ? 'ring-2 ring-[#005e48] ring-offset-2 ring-offset-[var(--ds-surface-bg)]'
                : ''
            } ${
              override.emphasis
                ? 'ring-2 ring-[#74bf1e]/70 ring-offset-1 ring-offset-[var(--ds-surface-bg)]'
                : ''
            } ${showBeaconRing && !isDraggingThis ? 'ds-beacon-active ring-2 ring-[#74bf1e]/75' : ''}`}
          >
            {/* Subtle Step Beacon Badge in Beacons / Spotlight / Edit mode */}
            {(tokens.eyeMode === 'beacons' || tokens.eyeMode === 'spotlight' || tokens.studioEditMode) &&
              stepNumber !== null && (
                <div
                  className={`pointer-events-none absolute -top-2 left-2.5 z-20 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-xs transition-opacity ${
                    stepNumber === 1 || isSpotlightTarget || isPulsed
                      ? 'bg-[#08261e] text-[#74bf1e]'
                      : 'border border-black/10 bg-white/95 text-[#08261e]'
                  } ${
                    tokens.studioEditMode || stepNumber === 1 || isSpotlightTarget || isPulsed
                      ? 'opacity-100'
                      : 'opacity-85 group-hover/block:opacity-100'
                  }`}
                >
                  <span>{STEP_CIRCLES[stepNumber - 1] ?? stepNumber}</span>
                  <span className="max-w-[140px] truncate">{block.eyeCue}</span>
                </div>
              )}

            {/* Interactive Block Controls (visible in Edit Mode or on hover/focus-within) */}
            <div
              className={`absolute -top-2.5 right-2 z-20 flex items-center gap-0.5 rounded-full border border-black/10 bg-white/95 px-1 py-0.5 shadow-sm backdrop-blur-xs transition-opacity ${
                tokens.studioEditMode
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0 group-hover/block:pointer-events-auto group-hover/block:opacity-100 group-focus-within/block:pointer-events-auto group-focus-within/block:opacity-100'
              }`}
            >
              <button
                type="button"
                aria-label={`Drag to reorder ${block.title}`}
                title="Drag to move block"
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  document.documentElement.classList.add('is-dragging-blocks');
                  setDragState({
                    blockId: block.id,
                    fromIndex: fullIndex,
                    toIndex: fullIndex,
                    pointerId: e.pointerId,
                    startY: e.clientY,
                    deltaY: 0,
                  });
                }}
                className="ds-drag-handle flex h-5 w-5 items-center justify-center rounded-full text-[#4a635c] hover:bg-black/5 hover:text-[#08261e]"
              >
                <GripVertical className="h-3 w-3" />
              </button>
              <button
                type="button"
                disabled={fullIndex === 0}
                onClick={() => handleDeltaMove(block.id, block.title, -1, fullIndex)}
                aria-label={`Move ${block.title} up`}
                title="Move up"
                className="flex h-5 w-5 items-center justify-center rounded-full text-[#4a635c] hover:bg-black/5 hover:text-[#08261e] disabled:opacity-30"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                disabled={fullIndex === orderedBlocks.length - 1}
                onClick={() => handleDeltaMove(block.id, block.title, 1, fullIndex)}
                aria-label={`Move ${block.title} down`}
                title="Move down"
                className="flex h-5 w-5 items-center justify-center rounded-full text-[#4a635c] hover:bg-black/5 hover:text-[#08261e] disabled:opacity-30"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  selectBlock(block.id);
                  updateToken('rightPanelMode', 'studio');
                }}
                aria-label={`Inspect styling for ${block.title}`}
                title="Edit block margin & rounding"
                className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                  isSelected
                    ? 'bg-[#005e48] text-white'
                    : 'text-[#4a635c] hover:bg-black/5 hover:text-[#08261e]'
                }`}
              >
                <SlidersHorizontal className="h-2.5 w-2.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleBlockHidden(block.id)}
                aria-label={isHidden ? `Show ${block.title}` : `Hide ${block.title}`}
                title={isHidden ? 'Show block' : 'Hide block'}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[#4a635c] hover:bg-black/5 hover:text-[#08261e]"
              >
                {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
            </div>

            {block.render()}

            {/* Non-modal Tethered Spotlight Tour Card */}
            {isSpotlightTarget && (
              <div
                ref={spotlightDialogRef}
                role="dialog"
                aria-labelledby={`spotlight-title-${block.id}`}
                className="mt-2 rounded-xl border border-[#74bf1e]/60 bg-[#08261e] p-3 text-white shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-[#74bf1e] uppercase">
                    <Sparkles className="h-3 w-3" />
                    <span>
                      Eye Step {spotlightIndex + 1} of {visibleBlocks.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateToken('eyeMode', 'beacons')}
                    aria-label="Exit spotlight tour"
                    className="rounded-md p-0.5 text-emerald-200/80 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p id={`spotlight-title-${block.id}`} className="mt-1 text-xs font-bold text-white">
                  {block.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-emerald-100/90">
                  {block.whyHere}
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => prevSpotlightStep(visibleBlocks.length)}
                      className="inline-flex items-center gap-0.5 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
                    >
                      <ChevronLeft className="h-3 w-3" /> Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => nextSpotlightStep(visibleBlocks.length)}
                      className="inline-flex items-center gap-0.5 rounded-lg bg-[#74bf1e] px-2.5 py-1 text-[10px] font-bold text-[#08261e] hover:bg-[#82cf28]"
                    >
                      Next <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateToken('eyeMode', 'beacons')}
                    className="text-[10px] font-semibold text-emerald-200 hover:text-white"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Recovery pill when blocks are hidden */}
      {hiddenCount > 0 && !tokens.studioEditMode && (
        <button
          type="button"
          onClick={() => updateToken('studioEditMode', true)}
          className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#005e48]/30 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#005e48] hover:bg-white"
        >
          <Eye className="h-3 w-3" /> {hiddenCount} hidden block{hiddenCount > 1 ? 's' : ''} · Show
        </button>
      )}
    </div>
  );
}
