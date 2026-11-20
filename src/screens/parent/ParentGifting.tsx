import { useMemo } from 'react';
import { Gift, QrCode, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt } from '@/engine/finance';
import { useDesignStudio } from '@/state/designStudio';
import { useLifestart } from '@/state/store';

export function ParentGifting() {
  const { state, sendGift } = useLifestart();
  const { tokens } = useDesignStudio();
  const { core } = state;

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'gift-qr',
        title: 'Shareable Gift QR',
        eyeCue: 'Share family link',
        whyHere: 'Focal QR block shows how relatives invest straight into Long Vault with zero IBAN friction.',
        render: () => (
          <div
            style={{
              borderRadius: 'var(--ds-card-radius)',
              padding: 'var(--ds-card-padding)',
              background: 'linear-gradient(135deg, var(--ds-header-bg) 0%, var(--ds-primary) 100%)',
            }}
            className="text-white shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#74bf1e] px-2 py-0.5 text-[10px] font-bold text-[#08261e]">
                  <Sparkles className="h-3 w-3" /> Gift Link
                </span>
                <h3 className="mt-1.5 text-sm font-extrabold">
                  Gifts for {core.family.childName}
                </h3>
                {tokens.copyDensity !== 'concise' && (
                  <p className="mt-0.5 text-[11px] text-emerald-100/90">
                    Direct to Long-Term Super Bond.
                  </p>
                )}
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-[#08261e]">
                <QrCode className="h-10 w-10" />
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white/12 px-2.5 py-1.5 text-[11px]">
              <span className="font-mono text-emerald-100">
                otp.hu/gift/{core.family.childName.toLowerCase()}
              </span>
              <span className="font-extrabold text-[#74bf1e] tabular-nums">
                {formatFt(core.account.totals.gifts)}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'gift-simulate',
        title: '1-Tap Gift Demo',
        eyeCue: 'Test incoming gift',
        whyHere: 'Interactive trigger sits right below the QR card for instant demonstration.',
        render: () => (
          <div className="ds-card">
            <p className="text-xs font-bold ds-text-primary">Simulate Family Gift</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => sendGift('Grandma', 'Birthday Gift', CONFIG.GIFT_AMOUNT)}
                style={{
                  borderRadius: 'var(--ds-btn-radius)',
                  backgroundColor: 'var(--ds-primary)',
                  color: 'var(--ds-primary-fg)',
                }}
                className="ds-btn text-xs font-bold"
              >
                <Gift className="h-3.5 w-3.5" /> Grandma +15k
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendGift('Uncle Péter', 'Name Day', 10_000)}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn text-xs font-semibold"
              >
                <Gift className="h-3.5 w-3.5 text-[#005e48]" /> Uncle +10k
              </Button>
            </div>
          </div>
        ),
      },
      {
        id: 'gift-timeline',
        title: 'Gift History',
        eyeCue: 'Scan received gifts',
        whyHere: 'Chronological proof settles at the bottom without crowding the action area.',
        render: () => (
          <div className="ds-card">
            <p className="text-xs font-bold ds-text-primary">Gift Timeline</p>
            {core.gifts.length === 0 ? (
              <p className="mt-1.5 text-xs ds-text-muted">
                No gifts yet — tap above or scrub age forward.
              </p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {core.gifts.slice(0, 5).map((g) => (
                  <div
                    key={g.id}
                    className="ds-card-muted flex items-center justify-between px-2.5 py-2 text-xs"
                  >
                    <div>
                      <p className="font-bold ds-text-primary">{g.from}</p>
                      <p className="text-[10px] ds-text-muted">
                        {g.occasion} · Age {Math.floor(g.month / 12)}
                      </p>
                    </div>
                    <span style={{ color: 'var(--ds-primary)' }} className="font-extrabold tabular-nums">
                      +{formatFt(g.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
    ],
    [core, sendGift, tokens.copyDensity],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="parent-gifting" blocks={blocks} />
    </div>
  );
}
