import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Eye,
  EyeOff,
  Layers,
  Paintbrush,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  computeContrastRatio,
  DESIGN_PRESETS,
  getWcagBadge,
  pickReadableForeground,
  useDesignStudio,
  type CopyDensity,
  type EyeGuidanceMode,
  type FontFamilyId,
  type MotionPreset,
} from '@/state/designStudio';

type StudioTab = 'basic' | 'blocks' | 'advanced';

function SliderControl({
  label,
  valueLabel,
  value,
  min,
  max,
  step = 1,
  onChange,
  onReset,
}: {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  onReset?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-[#0b2e26]">{label}</span>
        <button
          type="button"
          onDoubleClick={onReset}
          title={onReset ? 'Double-click to reset' : undefined}
          className="rounded-md bg-[#eef3f1] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#005e48] tabular-nums"
        >
          {valueLabel}
        </button>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  );
}

function ContrastMeter({
  label,
  fgHex,
  bgHex,
}: {
  label: string;
  fgHex: string;
  bgHex: string;
}) {
  const ratio = computeContrastRatio(fgHex, bgHex);
  const badge = getWcagBadge(ratio);
  return (
    <div className="flex items-center justify-between rounded-xl border border-black/6 bg-[#f6f8f7] px-2.5 py-1.5 text-[11px]">
      <div className="flex items-center gap-1.5">
        {badge.pass ? (
          <ShieldCheck className="h-3.5 w-3.5 text-[#005e48]" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
        )}
        <span className="font-medium text-[#0b2e26]">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 tabular-nums">
        <span className="font-mono text-[10px] text-[#4a635c]">{ratio.toFixed(2)}:1</span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
            badge.pass
              ? 'bg-[#e5f5de] text-[#08261e]'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {badge.level}
        </span>
      </div>
    </div>
  );
}

export function DesignStudioPanel() {
  const {
    tokens,
    activeScreenId,
    screenBlocks,
    getOrderedBlocks,
    blockOverrides,
    selectedBlockId,
    updateToken,
    applyPreset,
    moveBlockByDelta,
    toggleBlockHidden,
    setBlockOverride,
    resetBlockOrder,
    selectBlock,
    resetStudio,
    exportTokensCss,
  } = useDesignStudio();

  const [tab, setTab] = useState<StudioTab>('basic');
  const [copied, setCopied] = useState(false);

  const currentMeta = screenBlocks[activeScreenId] ?? [];
  const orderedBlocks = getOrderedBlocks(activeScreenId, currentMeta);
  const selectedBlock = orderedBlocks.find((b) => b.id === selectedBlockId) ?? orderedBlocks[0] ?? null;
  const selectedOverride = selectedBlock ? blockOverrides[selectedBlock.id] ?? {} : {};

  const handleCopyTokens = async () => {
    try {
      await navigator.clipboard.writeText(exportTokensCss());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5">
      {/* Presets Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-[#4a635c] uppercase">
            Theme Presets
          </span>
          <button
            type="button"
            onClick={() => updateToken('studioEditMode', !tokens.studioEditMode)}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
              tokens.studioEditMode
                ? 'bg-[#08261e] text-[#74bf1e]'
                : 'bg-[#ebf3f0] text-[#005e48] hover:bg-[#dceae4]'
            }`}
          >
            <Wand2 className="h-3 w-3" />
            {tokens.studioEditMode ? 'Editing Blocks' : 'Arrange Blocks'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {DESIGN_PRESETS.map((preset) => {
            const active = tokens.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-all ${
                  active
                    ? 'border-[#005e48] bg-[#ebf3f0] shadow-xs'
                    : 'border-black/8 bg-white hover:bg-[#f6f8f7]'
                }`}
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15"
                  style={{
                    background: `linear-gradient(135deg, ${preset.tokens.primaryColor} 55%, ${preset.tokens.accentLime} 55%)`,
                  }}
                />
                <span className="truncate text-[11px] font-bold text-[#0b2e26]">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Studio Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#eef3f1] p-1">
        {(
          [
            { id: 'basic', label: 'Basic', icon: Sliders },
            { id: 'blocks', label: `Blocks (${orderedBlocks.length})`, icon: Layers },
            { id: 'advanced', label: 'Advanced', icon: Paintbrush },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${
                active
                  ? 'bg-white text-[#08261e] shadow-xs'
                  : 'text-[#4a635c] hover:text-[#08261e]'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Inspector Body */}
      <div className="phone-scroll flex-1 min-h-0 space-y-3 overflow-y-auto pr-0.5">
        {tab === 'basic' && (
          <div className="space-y-3">
            {/* Spacing & Margins */}
            <div className="space-y-2.5 rounded-xl border border-black/6 bg-[#f9fbfa] p-3">
              <p className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                Margins & Spacing
              </p>
              <SliderControl
                label="Screen Outer Margin"
                valueLabel={`${tokens.screenPadding}px`}
                value={tokens.screenPadding}
                min={6}
                max={28}
                onChange={(v) => updateToken('screenPadding', v)}
                onReset={() => updateToken('screenPadding', 14)}
              />
              <SliderControl
                label="Block Vertical Gap"
                valueLabel={`${tokens.blockGap}px`}
                value={tokens.blockGap}
                min={4}
                max={28}
                onChange={(v) => updateToken('blockGap', v)}
                onReset={() => updateToken('blockGap', 10)}
              />
              <SliderControl
                label="Card Inner Padding"
                valueLabel={`${tokens.cardPadding}px`}
                value={tokens.cardPadding}
                min={8}
                max={28}
                onChange={(v) => updateToken('cardPadding', v)}
                onReset={() => updateToken('cardPadding', 14)}
              />
            </div>

            {/* Edge Rounding */}
            <div className="space-y-2.5 rounded-xl border border-black/6 bg-[#f9fbfa] p-3">
              <p className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                Edge Rounding
              </p>
              <SliderControl
                label="Card Corner Radius"
                valueLabel={`${tokens.cardRadius}px`}
                value={tokens.cardRadius}
                min={0}
                max={32}
                onChange={(v) => updateToken('cardRadius', v)}
                onReset={() => updateToken('cardRadius', 16)}
              />
              <SliderControl
                label="Button & Pill Radius"
                valueLabel={`${tokens.buttonRadius}px`}
                value={tokens.buttonRadius}
                min={2}
                max={32}
                onChange={(v) => updateToken('buttonRadius', v)}
                onReset={() => updateToken('buttonRadius', 12)}
              />
              <SliderControl
                label="Phone Frame Radius"
                valueLabel={`${tokens.phoneRadius}px`}
                value={tokens.phoneRadius}
                min={20}
                max={54}
                onChange={(v) => updateToken('phoneRadius', v)}
                onReset={() => updateToken('phoneRadius', 42)}
              />
            </div>

            {/* Typography & Copy Density */}
            <div className="space-y-2.5 rounded-xl border border-black/6 bg-[#f9fbfa] p-3">
              <p className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                Typography & Text Density
              </p>
              <SliderControl
                label="Type Scale"
                valueLabel={`${Math.round(tokens.fontScale * 100)}%`}
                value={Math.round(tokens.fontScale * 100)}
                min={85}
                max={115}
                onChange={(v) => updateToken('fontScale', Number((v / 100).toFixed(2)))}
                onReset={() => updateToken('fontScale', 1)}
              />

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#0b2e26]">Font Family</span>
                <div className="grid grid-cols-4 gap-1">
                  {(
                    [
                      { id: 'geist', label: 'Geist' },
                      { id: 'inter', label: 'Inter' },
                      { id: 'serif', label: 'Serif' },
                      { id: 'mono', label: 'Mono' },
                    ] as Array<{ id: FontFamilyId; label: string }>
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateToken('fontFamily', f.id)}
                      className={`rounded-lg py-1 text-[10px] font-bold transition-colors ${
                        tokens.fontFamily === f.id
                          ? 'bg-[#005e48] text-white'
                          : 'bg-white text-[#4a635c] ring-1 ring-black/8 hover:text-[#08261e]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#0b2e26]">Copy Density</span>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      { id: 'concise', label: 'Zen Concise' },
                      { id: 'balanced', label: 'Balanced' },
                      { id: 'detailed', label: 'Detailed' },
                    ] as Array<{ id: CopyDensity; label: string }>
                  ).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => updateToken('copyDensity', d.id)}
                      className={`rounded-lg py-1 text-[10px] font-bold transition-colors ${
                        tokens.copyDensity === d.id
                          ? 'bg-[#08261e] text-[#74bf1e]'
                          : 'bg-white text-[#4a635c] ring-1 ring-black/8 hover:text-[#08261e]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'blocks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                  Movable Screen Stack
                </p>
                <p className="text-[10px] text-[#4a635c]">
                  Drag handles inside phone or reorder below
                </p>
              </div>
              <button
                type="button"
                onClick={() => resetBlockOrder(activeScreenId)}
                className="rounded-lg bg-[#eef3f1] px-2 py-1 text-[10px] font-semibold text-[#005e48] hover:bg-[#dceae4]"
              >
                Reset Order
              </button>
            </div>

            <div className="space-y-1.5">
              {orderedBlocks.map((block, idx) => {
                const ov = blockOverrides[block.id] ?? {};
                const isHidden = Boolean(ov.hidden);
                const isSelected = selectedBlock?.id === block.id;
                return (
                  <div
                    key={block.id}
                    className={`flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-2 transition-colors ${
                      isSelected
                        ? 'border-[#005e48] bg-[#ebf3f0]'
                        : 'border-black/8 bg-white'
                    } ${isHidden ? 'opacity-55' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => selectBlock(block.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#08261e] text-[9px] font-bold text-[#74bf1e]">
                          {idx + 1}
                        </span>
                        <span className="truncate text-[11px] font-bold text-[#0b2e26]">
                          {block.title}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate pl-5 text-[10px] text-[#4a635c]">
                        {block.eyeCue}
                      </p>
                    </button>

                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveBlockByDelta(activeScreenId, block.id, -1)}
                        aria-label={`Move ${block.title} up`}
                        className="rounded-md p-1 text-[#4a635c] hover:bg-black/5 hover:text-[#08261e] disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderedBlocks.length - 1}
                        onClick={() => moveBlockByDelta(activeScreenId, block.id, 1)}
                        aria-label={`Move ${block.title} down`}
                        className="rounded-md p-1 text-[#4a635c] hover:bg-black/5 hover:text-[#08261e] disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBlockHidden(block.id)}
                        aria-label={isHidden ? `Show ${block.title}` : `Hide ${block.title}`}
                        className="rounded-md p-1 text-[#4a635c] hover:bg-black/5 hover:text-[#08261e]"
                      >
                        {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Per-Block Override Inspector */}
            {selectedBlock && (
              <div className="space-y-2.5 rounded-xl border border-[#005e48]/25 bg-[#f4faf7] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#005e48]" />
                    <p className="text-[11px] font-bold text-[#08261e]">
                      Block Inspector: {selectedBlock.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setBlockOverride(selectedBlock.id, {
                        marginY: undefined,
                        padding: undefined,
                        radius: undefined,
                        emphasis: false,
                      })
                    }
                    className="text-[10px] font-semibold text-[#005e48] hover:underline"
                  >
                    Clear
                  </button>
                </div>

                <SliderControl
                  label="Custom Top/Bottom Margin"
                  valueLabel={
                    selectedOverride.marginY !== undefined
                      ? `${selectedOverride.marginY}px`
                      : 'Auto'
                  }
                  value={selectedOverride.marginY ?? 0}
                  min={0}
                  max={28}
                  onChange={(v) => setBlockOverride(selectedBlock.id, { marginY: v })}
                />
                <SliderControl
                  label="Custom Card Padding"
                  valueLabel={
                    selectedOverride.padding !== undefined
                      ? `${selectedOverride.padding}px`
                      : `${tokens.cardPadding}px`
                  }
                  value={selectedOverride.padding ?? tokens.cardPadding}
                  min={6}
                  max={28}
                  onChange={(v) => setBlockOverride(selectedBlock.id, { padding: v })}
                />
                <SliderControl
                  label="Custom Corner Radius"
                  valueLabel={
                    selectedOverride.radius !== undefined
                      ? `${selectedOverride.radius}px`
                      : `${tokens.cardRadius}px`
                  }
                  value={selectedOverride.radius ?? tokens.cardRadius}
                  min={0}
                  max={32}
                  onChange={(v) => setBlockOverride(selectedBlock.id, { radius: v })}
                />
                <div className="flex items-center justify-between pt-0.5 text-[11px]">
                  <span className="font-medium text-[#0b2e26]">Focal Emphasis Ring</span>
                  <Switch
                    size="sm"
                    checked={Boolean(selectedOverride.emphasis)}
                    onCheckedChange={(checked) =>
                      setBlockOverride(selectedBlock.id, { emphasis: checked })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'advanced' && (
          <div className="space-y-3">
            {/* Elevation, Glass & Hairline */}
            <div className="space-y-2.5 rounded-xl border border-black/6 bg-[#f9fbfa] p-3">
              <p className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                Elevation, Glass & Borders
              </p>
              <SliderControl
                label="Shadow Elevation"
                valueLabel={`Level ${tokens.shadowDepth}`}
                value={tokens.shadowDepth}
                min={0}
                max={4}
                onChange={(v) => updateToken('shadowDepth', v)}
              />
              <SliderControl
                label="Glass Backdrop Blur"
                valueLabel={`${tokens.glassBlur}px`}
                value={tokens.glassBlur}
                min={0}
                max={20}
                onChange={(v) => updateToken('glassBlur', v)}
              />
              <SliderControl
                label="Border Hairline"
                valueLabel={`${tokens.borderWidth}px`}
                value={tokens.borderWidth}
                min={0}
                max={2}
                onChange={(v) => updateToken('borderWidth', v)}
              />
            </div>

            {/* Color & WCAG Contrast Lab */}
            <div className="space-y-2.5 rounded-xl border border-black/6 bg-[#f9fbfa] p-3">
              <p className="text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                Color & WCAG Contrast Lab
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { key: 'primaryColor', label: 'Primary CTA' },
                    { key: 'headerBg', label: 'Header Bar' },
                    { key: 'surfaceBg', label: 'Canvas Bg' },
                    { key: 'cardBg', label: 'Card Surface' },
                  ] as const
                ).map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-black/8 bg-white px-2 py-1.5 text-[10px] font-semibold text-[#0b2e26]"
                  >
                    <span>{item.label}</span>
                    <input
                      type="color"
                      value={tokens[item.key]}
                      onChange={(e) => updateToken(item.key, e.target.value)}
                      className="h-5 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                  </label>
                ))}
              </div>
              <div className="space-y-1.5 pt-1">
                <ContrastMeter
                  label="Primary CTA Text"
                  fgHex={pickReadableForeground(tokens.primaryColor)}
                  bgHex={tokens.primaryColor}
                />
                <ContrastMeter
                  label="Card Body Text"
                  fgHex={tokens.textPrimary}
                  bgHex={tokens.cardBg}
                />
              </div>
            </div>

            {/* Eye-Flow & Motion Physics */}
            <div className="space-y-2.5 rounded-xl border border-black/6 bg-[#f9fbfa] p-3">
              <p className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#005e48] uppercase">
                <Sparkles className="h-3 w-3" /> Eye-Flow & Motion Physics
              </p>
              <div className="grid grid-cols-2 gap-1">
                {(
                  [
                    { id: 'beacons', label: '1-2-3 Beacons' },
                    { id: 'vectors', label: 'Gaze Vectors' },
                    { id: 'spotlight', label: 'Spotlight Tour' },
                    { id: 'off', label: 'Clean (Off)' },
                  ] as Array<{ id: EyeGuidanceMode; label: string }>
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updateToken('eyeMode', m.id)}
                    className={`rounded-lg py-1.5 text-[10px] font-bold transition-colors ${
                      tokens.eyeMode === m.id
                        ? 'bg-[#08261e] text-[#74bf1e]'
                        : 'bg-white text-[#4a635c] ring-1 ring-black/8 hover:text-[#08261e]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <SliderControl
                label="Spotlight Dimming"
                valueLabel={`${tokens.dimInactivePct}%`}
                value={tokens.dimInactivePct}
                min={0}
                max={60}
                onChange={(v) => updateToken('dimInactivePct', v)}
              />

              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-[#0b2e26]">Gaze Fixation Heatmap</span>
                <Switch
                  size="sm"
                  checked={tokens.showSaccadeHeatmap}
                  onCheckedChange={(checked) => updateToken('showSaccadeHeatmap', checked)}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#0b2e26]">Motion Curve</span>
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      { id: 'snappy', label: 'Snappy' },
                      { id: 'spring', label: 'Spring' },
                      { id: 'reduced', label: 'Reduced' },
                    ] as Array<{ id: MotionPreset; label: string }>
                  ).map((mp) => (
                    <button
                      key={mp.id}
                      type="button"
                      onClick={() => updateToken('motionPreset', mp.id)}
                      className={`rounded-lg py-1 text-[10px] font-bold transition-colors ${
                        tokens.motionPreset === mp.id
                          ? 'bg-[#005e48] text-white'
                          : 'bg-white text-[#4a635c] ring-1 ring-black/8 hover:text-[#08261e]'
                      }`}
                    >
                      {mp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Studio Footer Actions */}
      <div className="grid shrink-0 grid-cols-2 gap-1.5 border-t border-black/8 pt-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyTokens}
          className="text-[11px] font-semibold"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#005e48]" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied CSS' : 'Copy CSS Tokens'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetStudio}
          className="text-[11px] font-semibold text-[#4a635c] hover:text-[#08261e]"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Studio
        </Button>
      </div>
    </div>
  );
}
