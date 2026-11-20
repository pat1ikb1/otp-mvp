export interface DesignTokens {
  screenPadding: number;
  blockGap: number;
  cardPadding: number;
  cardRadius: number;
  buttonRadius: number;
  phoneRadius: number;
  fontScale: number;
  primaryColor: string;
  accentLime: string;
  headerBg: string;
  surfaceBg: string;
  cardBg: string;
  textPrimary: string;
}

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  screenPadding: 17,
  blockGap: 26,
  cardPadding: 22,
  cardRadius: 14,
  buttonRadius: 25,
  phoneRadius: 42,
  fontScale: 1,
  primaryColor: '#38571a',
  accentLime: '#74bf1e',
  headerBg: '#f2f5f8',
  surfaceBg: '#f2f5f8',
  cardBg: '#ffffff',
  textPrimary: '#0b2e26',
};

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

export function buildCssVariables(tokens: DesignTokens): Record<string, string> {
  return {
    '--ds-screen-padding': `${tokens.screenPadding}px`,
    '--ds-block-gap': `${tokens.blockGap}px`,
    '--ds-card-padding': `${tokens.cardPadding}px`,
    '--ds-card-radius': `${tokens.cardRadius}px`,
    '--ds-btn-radius': `${tokens.buttonRadius}px`,
    '--ds-phone-radius': `${tokens.phoneRadius}px`,
    '--ds-font-scale': `${tokens.fontScale}`,
    '--ds-primary': tokens.primaryColor,
    '--ds-primary-fg': pickReadableForeground(tokens.primaryColor),
    '--ds-accent-lime': tokens.accentLime,
    '--ds-header-bg': tokens.headerBg,
    '--ds-surface-bg': tokens.surfaceBg,
    '--ds-card-bg': tokens.cardBg,
    '--ds-text-primary': tokens.textPrimary,
  };
}
