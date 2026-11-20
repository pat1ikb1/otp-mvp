import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type EyeGuidanceMode = 'beacons' | 'vectors' | 'spotlight' | 'off';
export type CopyDensity = 'concise' | 'balanced' | 'detailed';
export type MotionPreset = 'snappy' | 'spring' | 'reduced';
export type FontFamilyId = 'geist' | 'inter' | 'serif' | 'mono';
export type DesignPresetId =
  | 'otp-signature'
  | 'nordic-minimal'
  | 'executive-dark'
  | 'tactile-soft';
export type RightPanelMode = 'studio' | 'guide';

export interface BlockOverride {
  hidden?: boolean;
  marginY?: number;
  padding?: number;
  radius?: number;
  emphasis?: boolean;
}

export interface BlockMeta {
  id: string;
  title: string;
  eyeCue: string;
  whyHere: string;
}

export interface DesignTokens {
  preset: DesignPresetId;
  screenPadding: number;
  blockGap: number;
  cardPadding: number;
  cardRadius: number;
  buttonRadius: number;
  phoneRadius: number;
  fontScale: number;
  fontFamily: FontFamilyId;
  copyDensity: CopyDensity;
  shadowDepth: number;
  glassBlur: number;
  borderWidth: number;
  primaryColor: string;
  accentLime: string;
  headerBg: string;
  surfaceBg: string;
  cardBg: string;
  textPrimary: string;
  eyeMode: EyeGuidanceMode;
  spotlightStep: number;
  dimInactivePct: number;
  showSaccadeHeatmap: boolean;
  motionPreset: MotionPreset;
  studioEditMode: boolean;
  rightPanelMode: RightPanelMode;
}

export interface DesignPresetMeta {
  id: DesignPresetId;
  name: string;
  tagline: string;
  tokens: Partial<DesignTokens>;
}

const STUDIO_STORAGE_KEY = 'otp-lifestart-design-studio-v1';

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  preset: 'otp-signature',
  screenPadding: 14,
  blockGap: 10,
  cardPadding: 14,
  cardRadius: 16,
  buttonRadius: 12,
  phoneRadius: 42,
  fontScale: 1,
  fontFamily: 'geist',
  copyDensity: 'concise',
  shadowDepth: 1,
  glassBlur: 0,
  borderWidth: 1,
  primaryColor: '#005e48',
  accentLime: '#74bf1e',
  headerBg: '#08261e',
  surfaceBg: '#f4f7f5',
  cardBg: '#ffffff',
  textPrimary: '#0b2e26',
  eyeMode: 'beacons',
  spotlightStep: 0,
  dimInactivePct: 24,
  showSaccadeHeatmap: true,
  motionPreset: 'spring',
  studioEditMode: false,
  rightPanelMode: 'studio',
};

export const DESIGN_PRESETS: DesignPresetMeta[] = [
  {
    id: 'otp-signature',
    name: 'OTP Signature',
    tagline: 'Deep emerald authority + crisp lime accents',
    tokens: {
      preset: 'otp-signature',
      screenPadding: 14,
      blockGap: 10,
      cardPadding: 14,
      cardRadius: 16,
      buttonRadius: 12,
      phoneRadius: 42,
      fontScale: 1,
      fontFamily: 'geist',
      shadowDepth: 1,
      glassBlur: 0,
      borderWidth: 1,
      primaryColor: '#005e48',
      accentLime: '#74bf1e',
      headerBg: '#08261e',
      surfaceBg: '#f4f7f5',
      cardBg: '#ffffff',
      textPrimary: '#0b2e26',
    },
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Minimal',
    tagline: 'Airy Swiss grid, sharp corners, zero clutter',
    tokens: {
      preset: 'nordic-minimal',
      screenPadding: 18,
      blockGap: 14,
      cardPadding: 16,
      cardRadius: 8,
      buttonRadius: 6,
      phoneRadius: 34,
      fontScale: 0.98,
      fontFamily: 'inter',
      shadowDepth: 0,
      glassBlur: 0,
      borderWidth: 1,
      primaryColor: '#0f172a',
      accentLime: '#74bf1e',
      headerBg: '#0f172a',
      surfaceBg: '#f8fafc',
      cardBg: '#ffffff',
      textPrimary: '#0f172a',
    },
  },
  {
    id: 'executive-dark',
    name: 'Executive Dark',
    tagline: 'Private wealth glass surfaces & luminous contrast',
    tokens: {
      preset: 'executive-dark',
      screenPadding: 14,
      blockGap: 11,
      cardPadding: 14,
      cardRadius: 18,
      buttonRadius: 14,
      phoneRadius: 44,
      fontScale: 1,
      fontFamily: 'geist',
      shadowDepth: 3,
      glassBlur: 12,
      borderWidth: 1,
      primaryColor: '#047857',
      accentLime: '#84cc16',
      headerBg: '#050d0b',
      surfaceBg: '#0a1411',
      cardBg: '#12221d',
      textPrimary: '#ecf5f1',
    },
  },
  {
    id: 'tactile-soft',
    name: 'Tactile Soft',
    tagline: 'Warm rounded surfaces & elevated pillow cards',
    tokens: {
      preset: 'tactile-soft',
      screenPadding: 16,
      blockGap: 12,
      cardPadding: 16,
      cardRadius: 24,
      buttonRadius: 20,
      phoneRadius: 48,
      fontScale: 1.02,
      fontFamily: 'serif',
      shadowDepth: 2,
      glassBlur: 4,
      borderWidth: 0,
      primaryColor: '#115e59',
      accentLime: '#65a30d',
      headerBg: '#134e4a',
      surfaceBg: '#f2f6f2',
      cardBg: '#ffffff',
      textPrimary: '#132a23',
    },
  },
];

function parseHex(hex: string): [number, number, number] {
  const clean = hex.trim().replace('#', '');
  const expanded =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const num = Number.parseInt(expanded, 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function computeContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(fgHex);
  const l2 = relativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function getWcagBadge(ratio: number): {
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  pass: boolean;
} {
  if (ratio >= 7) return { level: 'AAA', pass: true };
  if (ratio >= 4.5) return { level: 'AA', pass: true };
  if (ratio >= 3) return { level: 'AA Large', pass: false };
  return { level: 'Fail', pass: false };
}

export function pickReadableForeground(bgHex: string): '#ffffff' | '#08261e' {
  const whiteRatio = computeContrastRatio('#ffffff', bgHex);
  const forestRatio = computeContrastRatio('#08261e', bgHex);
  return whiteRatio >= forestRatio ? '#ffffff' : '#08261e';
}

export function isDarkColor(hex: string): boolean {
  return relativeLuminance(hex) < 0.22;
}

export function reorderBlockList(
  ids: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= ids.length ||
    toIndex >= ids.length ||
    fromIndex === toIndex
  ) {
    return ids;
  }
  const next = [...ids];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

const SHADOW_SCALE = [
  'none',
  '0 1px 3px rgba(8, 38, 30, 0.06), 0 1px 2px rgba(8, 38, 30, 0.04)',
  '0 4px 12px rgba(8, 38, 30, 0.08), 0 1px 3px rgba(8, 38, 30, 0.05)',
  '0 10px 24px rgba(8, 38, 30, 0.14), 0 2px 6px rgba(8, 38, 30, 0.08)',
  '0 18px 36px rgba(8, 38, 30, 0.2), 0 4px 10px rgba(8, 38, 30, 0.1)',
] as const;

const FONT_STACKS: Record<FontFamilyId, string> = {
  geist: '"Geist Variable", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  inter: '"Inter", "Geist Variable", -apple-system, BlinkMacSystemFont, sans-serif',
  serif: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

const TRANSITION_MS: Record<MotionPreset, string> = {
  snappy: '140ms',
  spring: '240ms',
  reduced: '0ms',
};

export function buildCssVariables(tokens: DesignTokens): Record<string, string> {
  const darkSurface = isDarkColor(tokens.cardBg);
  const primaryFg = pickReadableForeground(tokens.primaryColor);
  const headerFg = pickReadableForeground(tokens.headerBg);
  const limeFg = pickReadableForeground(tokens.accentLime);
  const shadowIdx = Math.max(0, Math.min(4, Math.round(tokens.shadowDepth)));

  return {
    '--ds-screen-padding': `${tokens.screenPadding}px`,
    '--ds-block-gap': `${tokens.blockGap}px`,
    '--ds-card-padding': `${tokens.cardPadding}px`,
    '--ds-card-radius': `${tokens.cardRadius}px`,
    '--ds-btn-radius': `${tokens.buttonRadius}px`,
    '--ds-phone-radius': `${tokens.phoneRadius}px`,
    '--ds-font-scale': `${tokens.fontScale}`,
    '--ds-font-family': FONT_STACKS[tokens.fontFamily],
    '--ds-card-shadow': SHADOW_SCALE[shadowIdx],
    '--ds-glass-blur': `${tokens.glassBlur}px`,
    '--ds-border-width': `${tokens.borderWidth}px`,
    '--ds-border-color': darkSurface ? 'rgba(236, 245, 241, 0.14)' : 'rgba(11, 46, 38, 0.09)',
    '--ds-primary': tokens.primaryColor,
    '--ds-primary-fg': primaryFg,
    '--ds-accent-lime': tokens.accentLime,
    '--ds-accent-lime-fg': limeFg,
    '--ds-header-bg': tokens.headerBg,
    '--ds-header-fg': headerFg,
    '--ds-surface-bg': tokens.surfaceBg,
    '--ds-card-bg': tokens.glassBlur > 0
      ? darkSurface
        ? 'rgba(18, 34, 29, 0.82)'
        : 'rgba(255, 255, 255, 0.84)'
      : tokens.cardBg,
    '--ds-card-muted-bg': darkSurface ? 'rgba(255, 255, 255, 0.06)' : '#f2f6f4',
    '--ds-text-primary': tokens.textPrimary,
    '--ds-text-muted': darkSurface ? '#a3bfb5' : '#4a635c',
    '--ds-dim-opacity': `${Math.max(0.25, 1 - tokens.dimInactivePct / 100)}`,
    '--ds-transition-ms': TRANSITION_MS[tokens.motionPreset],
  };
}

interface PersistedStudioState {
  tokens: DesignTokens;
  blockOrders: Record<string, string[]>;
  blockOverrides: Record<string, BlockOverride>;
}

function loadPersistedStudio(): PersistedStudioState {
  try {
    const raw = localStorage.getItem(STUDIO_STORAGE_KEY);
    if (!raw) {
      return { tokens: DEFAULT_DESIGN_TOKENS, blockOrders: {}, blockOverrides: {} };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedStudioState>;
    return {
      tokens: { ...DEFAULT_DESIGN_TOKENS, ...(parsed.tokens ?? {}) },
      blockOrders: parsed.blockOrders ?? {},
      blockOverrides: parsed.blockOverrides ?? {},
    };
  } catch {
    return { tokens: DEFAULT_DESIGN_TOKENS, blockOrders: {}, blockOverrides: {} };
  }
}

interface DesignStudioContextValue {
  tokens: DesignTokens;
  cssVariables: Record<string, string>;
  activeScreenId: string;
  screenBlocks: Record<string, BlockMeta[]>;
  blockOrders: Record<string, string[]>;
  blockOverrides: Record<string, BlockOverride>;
  selectedBlockId: string | null;
  pulsedBlockId: string | null;
  updateToken: <K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => void;
  applyPreset: (presetId: DesignPresetId) => void;
  registerScreenBlocks: (screenId: string, blocks: BlockMeta[]) => void;
  getOrderedBlocks: (screenId: string, blocks: BlockMeta[]) => BlockMeta[];
  moveBlock: (screenId: string, fromIdx: number, toIdx: number) => void;
  moveBlockByDelta: (screenId: string, blockId: string, delta: -1 | 1) => void;
  toggleBlockHidden: (blockId: string) => void;
  setBlockOverride: (blockId: string, patch: Partial<BlockOverride>) => void;
  resetBlockOrder: (screenId: string) => void;
  selectBlock: (blockId: string | null) => void;
  pulseBlock: (blockId: string) => void;
  nextSpotlightStep: (totalSteps: number) => void;
  prevSpotlightStep: (totalSteps: number) => void;
  resetStudio: () => void;
  exportTokensCss: () => string;
}

const DesignStudioContext = createContext<DesignStudioContextValue | null>(null);

export function DesignStudioProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(() => loadPersistedStudio(), []);
  const [tokens, setTokens] = useState<DesignTokens>(initial.tokens);
  const [blockOrders, setBlockOrders] = useState<Record<string, string[]>>(initial.blockOrders);
  const [blockOverrides, setBlockOverrides] = useState<Record<string, BlockOverride>>(
    initial.blockOverrides,
  );
  const [screenBlocks, setScreenBlocks] = useState<Record<string, BlockMeta[]>>({});
  const [activeScreenId, setActiveScreenId] = useState<string>('parent-home');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [pulsedBlockId, setPulsedBlockId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const payload: PersistedStudioState = { tokens, blockOrders, blockOverrides };
      localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota issues in demo environment
    }
  }, [tokens, blockOrders, blockOverrides]);

  useEffect(() => {
    if (!pulsedBlockId) return;
    const timer = window.setTimeout(() => setPulsedBlockId(null), 1100);
    return () => window.clearTimeout(timer);
  }, [pulsedBlockId]);

  const updateToken = useCallback(<K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = useCallback((presetId: DesignPresetId) => {
    const preset = DESIGN_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTokens((prev) => ({
      ...prev,
      ...preset.tokens,
      preset: presetId,
    }));
  }, []);

  const registerScreenBlocks = useCallback((screenId: string, blocks: BlockMeta[]) => {
    setActiveScreenId(screenId);
    setScreenBlocks((prev) => {
      const existing = prev[screenId];
      if (
        existing &&
        existing.length === blocks.length &&
        existing.every(
          (b, i) =>
            b.id === blocks[i].id &&
            b.title === blocks[i].title &&
            b.eyeCue === blocks[i].eyeCue,
        )
      ) {
        return prev;
      }
      return { ...prev, [screenId]: blocks };
    });
    setTokens((prev) => (prev.spotlightStep >= blocks.length ? { ...prev, spotlightStep: 0 } : prev));
  }, []);

  const getOrderedBlocks = useCallback(
    (screenId: string, blocks: BlockMeta[]): BlockMeta[] => {
      const savedOrder = blockOrders[screenId];
      if (!savedOrder || savedOrder.length === 0) return blocks;
      const byId = new Map(blocks.map((b) => [b.id, b]));
      const ordered: BlockMeta[] = [];
      for (const id of savedOrder) {
        const match = byId.get(id);
        if (match) {
          ordered.push(match);
          byId.delete(id);
        }
      }
      for (const remaining of byId.values()) {
        ordered.push(remaining);
      }
      return ordered;
    },
    [blockOrders],
  );

  const moveBlock = useCallback(
    (screenId: string, fromIdx: number, toIdx: number) => {
      const currentMeta = screenBlocks[screenId];
      if (!currentMeta) return;
      const currentIds = getOrderedBlocks(screenId, currentMeta).map((b) => b.id);
      const nextIds = reorderBlockList(currentIds, fromIdx, toIdx);
      setBlockOrders((prev) => ({ ...prev, [screenId]: nextIds }));
    },
    [screenBlocks, getOrderedBlocks],
  );

  const moveBlockByDelta = useCallback(
    (screenId: string, blockId: string, delta: -1 | 1) => {
      const currentMeta = screenBlocks[screenId];
      if (!currentMeta) return;
      const currentIds = getOrderedBlocks(screenId, currentMeta).map((b) => b.id);
      const fromIdx = currentIds.indexOf(blockId);
      if (fromIdx === -1) return;
      const toIdx = Math.max(0, Math.min(currentIds.length - 1, fromIdx + delta));
      if (fromIdx === toIdx) return;
      const nextIds = reorderBlockList(currentIds, fromIdx, toIdx);
      setBlockOrders((prev) => ({ ...prev, [screenId]: nextIds }));
    },
    [screenBlocks, getOrderedBlocks],
  );

  const toggleBlockHidden = useCallback((blockId: string) => {
    setBlockOverrides((prev) => {
      const current = prev[blockId] ?? {};
      return {
        ...prev,
        [blockId]: { ...current, hidden: !current.hidden },
      };
    });
  }, []);

  const setBlockOverride = useCallback((blockId: string, patch: Partial<BlockOverride>) => {
    setBlockOverrides((prev) => ({
      ...prev,
      [blockId]: { ...(prev[blockId] ?? {}), ...patch },
    }));
  }, []);

  const resetBlockOrder = useCallback((screenId: string) => {
    setBlockOrders((prev) => {
      const next = { ...prev };
      delete next[screenId];
      return next;
    });
  }, []);

  const pulseBlock = useCallback((blockId: string) => {
    setPulsedBlockId(blockId);
  }, []);

  const nextSpotlightStep = useCallback((totalSteps: number) => {
    if (totalSteps <= 0) return;
    setTokens((prev) => ({
      ...prev,
      spotlightStep: (prev.spotlightStep + 1) % totalSteps,
    }));
  }, []);

  const prevSpotlightStep = useCallback((totalSteps: number) => {
    if (totalSteps <= 0) return;
    setTokens((prev) => ({
      ...prev,
      spotlightStep: (prev.spotlightStep - 1 + totalSteps) % totalSteps,
    }));
  }, []);

  const resetStudio = useCallback(() => {
    setTokens(DEFAULT_DESIGN_TOKENS);
    setBlockOrders({});
    setBlockOverrides({});
    setSelectedBlockId(null);
  }, []);

  const cssVariables = useMemo(() => buildCssVariables(tokens), [tokens]);

  const exportTokensCss = useCallback(() => {
    const entries = Object.entries(cssVariables)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
    return `:root {\n${entries}\n}\n\n/* Block Order (${activeScreenId}): ${JSON.stringify(
      blockOrders[activeScreenId] ?? 'default',
    )} */`;
  }, [cssVariables, activeScreenId, blockOrders]);

  return (
    <DesignStudioContext.Provider
      value={{
        tokens,
        cssVariables,
        activeScreenId,
        screenBlocks,
        blockOrders,
        blockOverrides,
        selectedBlockId,
        pulsedBlockId,
        updateToken,
        applyPreset,
        registerScreenBlocks,
        getOrderedBlocks,
        moveBlock,
        moveBlockByDelta,
        toggleBlockHidden,
        setBlockOverride,
        resetBlockOrder,
        selectBlock: setSelectedBlockId,
        pulseBlock,
        nextSpotlightStep,
        prevSpotlightStep,
        resetStudio,
        exportTokensCss,
      }}
    >
      {children}
    </DesignStudioContext.Provider>
  );
}

export function useDesignStudio(): DesignStudioContextValue {
  const ctx = useContext(DesignStudioContext);
  if (!ctx) {
    throw new Error('useDesignStudio must be used within DesignStudioProvider');
  }
  return ctx;
}
