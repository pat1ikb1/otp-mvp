import { useMemo } from 'react';
import { Gift, QrCode, Sparkles } from 'lucide-react';
import { BlockCanvas, type BlockDefinition } from '@/components/studio/BlockCanvas';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt } from '@/engine/finance';
import { useLifestart } from '@/state/store';

export function ParentGifting() {
  const { state, sendGift } = useLifestart();
  const { core } = state;

  const blocks = useMemo<BlockDefinition[]>(
    () => [
      {
        id: 'gift-qr',
        render: () => (
          <div className="ds-card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e4] px-2.5 py-0.5 text-[10px] font-bold text-[#38571a]">
                  <Sparkles className="h-3 w-3 text-[#52ae30]" /> Family Gift Link
                </span>
                <h3 className="mt-2 text-sm font-extrabold ds-text-primary">
                  Gifts for {core.family.childName}
                </h3>
                <p className="mt-0.5 text-[11px] ds-text-muted">
                  Direct to Long Vault Super Bond.
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f2f5f8] text-[#0b2e26]">
                <QrCode className="h-9 w-9" />
              </div>
            </div>

            <div className="ds-card-muted flex items-center justify-between px-3 py-2 text-[11px]">
              <span className="font-mono ds-text-muted">
                otp.hu/gift/{core.family.childName.toLowerCase()}
              </span>
              <span className="font-extrabold text-[#38571a] tabular-nums">
                {formatFt(core.account.totals.gifts)}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'gift-simulate',
        render: () => (
          <div className="ds-card">
            <p className="text-xs font-extrabold ds-text-primary">Simulate Family Gift</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => sendGift('Grandma', 'Birthday Gift', CONFIG.GIFT_AMOUNT)}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn bg-[#38571a] text-xs font-bold text-white"
              >
                <Gift className="h-3.5 w-3.5 text-[#74bf1e]" /> Grandma +15k
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendGift('Uncle Péter', 'Name Day', 10_000)}
                style={{ borderRadius: 'var(--ds-btn-radius)' }}
                className="ds-btn text-xs font-semibold"
              >
                <Gift className="h-3.5 w-3.5 text-[#52ae30]" /> Uncle +10k
              </Button>
            </div>
          </div>
        ),
      },
      {
        id: 'gift-timeline',
        render: () => (
          <div className="ds-card">
            <p className="text-xs font-extrabold ds-text-primary">Gift Timeline</p>
            {core.gifts.length === 0 ? (
              <p className="mt-2 text-xs ds-text-muted">
                No gifts yet — tap above or scrub age forward.
              </p>
            ) : (
              <div className="mt-2.5 space-y-2">
                {core.gifts.slice(0, 5).map((g) => (
                  <div
                    key={g.id}
                    className="ds-card-muted flex items-center justify-between px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b4d6b6] text-[10px] font-extrabold text-[#163117]">
                        {g.from.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-bold ds-text-primary">{g.from}</p>
                        <p className="text-[10px] ds-text-muted">
                          {g.occasion} · Age {Math.floor(g.month / 12)}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-[#38571a] tabular-nums">
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
    [core, sendGift],
  );

  return (
    <div className="pb-2">
      <BlockCanvas screenId="parent-gifting" blocks={blocks} />
    </div>
  );
}
