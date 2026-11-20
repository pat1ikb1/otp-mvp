import { describe, expect, it } from 'vitest';
import {
  buildCssVariables,
  computeContrastRatio,
  DEFAULT_DESIGN_TOKENS,
  getWcagBadge,
  reorderBlockList,
} from '@/state/designStudio';

describe('Design Studio WCAG contrast & layout helpers', () => {
  it('computes accurate WCAG 2.1 contrast ratios and badges', () => {
    const emeraldAaaRatio = computeContrastRatio('#005e48', '#ffffff');
    expect(emeraldAaaRatio).toBeGreaterThan(7);
    expect(getWcagBadge(emeraldAaaRatio)).toEqual({ level: 'AAA', pass: true });

    const limeOnForestRatio = computeContrastRatio('#74bf1e', '#08261e');
    expect(limeOnForestRatio).toBeGreaterThan(4.5);
    expect(getWcagBadge(limeOnForestRatio).pass).toBe(true);

    const limeOnWhiteRatio = computeContrastRatio('#74bf1e', '#ffffff');
    expect(limeOnWhiteRatio).toBeLessThan(3);
    expect(getWcagBadge(limeOnWhiteRatio)).toEqual({ level: 'Fail', pass: false });
  });

  it('reorders block IDs safely without mutating the input array', () => {
    const initial = ['hero', 'pockets', 'bond', 'chart'];
    const movedForward = reorderBlockList(initial, 0, 2);
    expect(movedForward).toEqual(['pockets', 'bond', 'hero', 'chart']);
    expect(initial).toEqual(['hero', 'pockets', 'bond', 'chart']);

    const movedBack = reorderBlockList(movedForward, 3, 1);
    expect(movedBack).toEqual(['pockets', 'chart', 'bond', 'hero']);

    expect(reorderBlockList(initial, -1, 2)).toEqual(initial);
    expect(reorderBlockList(initial, 1, 99)).toEqual(initial);
  });

  it('builds complete CSS custom properties for tokens', () => {
    const vars = buildCssVariables({
      ...DEFAULT_DESIGN_TOKENS,
      screenPadding: 20,
      blockGap: 14,
      cardRadius: 24,
      buttonRadius: 18,
      phoneRadius: 48,
      fontScale: 1.08,
    });

    expect(vars['--ds-screen-padding']).toBe('20px');
    expect(vars['--ds-block-gap']).toBe('14px');
    expect(vars['--ds-card-radius']).toBe('24px');
    expect(vars['--ds-btn-radius']).toBe('18px');
    expect(vars['--ds-phone-radius']).toBe('48px');
    expect(vars['--ds-font-scale']).toBe('1.08');
    expect(vars['--ds-primary']).toBe('#005e48');
    expect(vars['--ds-primary-fg']).toBe('#ffffff');
  });
});
