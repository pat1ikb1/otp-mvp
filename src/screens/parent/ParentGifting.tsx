import { Gift, QrCode, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/engine/config';
import { formatFt } from '@/engine/finance';
import { useLifestart } from '@/state/store';

export function ParentGifting() {
  const { state, sendGift } = useLifestart();
  const { core } = state;

  return (
    <div className="space-y-3 pb-2">
      {/* Shareable QR Gift Card */}
      <div className="rounded-2xl bg-[#74BF1E] p-4 text-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
              <Sparkles className="h-3 w-3 text-[#ffffff]" /> Family Gift Link
            </span>
            <h3 className="mt-1.5 text-sm font-bold">
              Send {core.family.childName} a gift that grows
            </h3>
            <p className="mt-1 text-[11px] text-emerald-100/90">
              No bank account details needed. Gifts go straight into the Long-Term Super Bond.
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b2e26]">
            <QrCode className="h-11 w-11" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs">
          <span className="font-mono text-[11px] text-emerald-100">
            otp.hu/gift/{core.family.childName.toLowerCase()}
          </span>
          <span className="font-bold text-[#ffffff] tabular-nums">
            Total: {formatFt(core.account.totals.gifts)}
          </span>
        </div>
      </div>

      {/* Demo Gift Simulator */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="text-xs font-bold text-[#0b2e26]">Simulate Incoming Family Gift</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => sendGift('Grandma', 'Birthday Gift', CONFIG.GIFT_AMOUNT)}
            className="rounded-xl bg-[#74BF1E] text-xs font-bold text-white hover:bg-[#62a318]"
          >
            <Gift className="h-3.5 w-3.5" /> Grandma +15k
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendGift('Uncle Péter', 'Name Day', 10_000)}
            className="rounded-xl text-xs font-semibold"
          >
            🎁 Uncle +10k
          </Button>
        </div>
      </div>

      {/* Gift History Feed */}
      <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-xs">
        <p className="text-xs font-bold text-[#0b2e26]">Gift Timeline</p>
        {core.gifts.length === 0 ? (
          <p className="mt-2 text-xs text-[#4c665f]">
            No gifts yet. Tap above or jump forward to see automatic Birthday & Christmas gifts!
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {core.gifts.slice(0, 6).map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl bg-[#f6f8f7] px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#0b2e26]">🎁 {g.from}</p>
                  <p className="text-[10px] text-[#4c665f]">
                    {g.occasion} · Age {Math.floor(g.month / 12)}
                  </p>
                </div>
                <span className="font-bold text-[#74BF1E] tabular-nums">
                  +{formatFt(g.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
