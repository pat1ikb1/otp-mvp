import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { buildChartSeries, formatCompactFt, formatFt } from '@/engine/finance';
import type { LifestartCoreState } from '@/types/lifestart';

export function GrowthChart({ core }: { core: LifestartCoreState }) {
  const data = buildChartSeries(core);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-xs">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#0b2e26]">0 → 25 Wealth Trajectory</p>
          <p className="text-[10px] text-[#4c665f]">
            Solid = realized · Dashed = projected to 25
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#4c665f]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#74BF1E]" /> Realized
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full border border-dashed border-[#74BF1E] bg-[#74BF1E]/20" /> Proj
          </span>
        </div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="otpActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#74BF1E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#74BF1E" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="otpProjGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#74BF1E" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#74BF1E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5ece9" vertical={false} />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fill: '#4c665f' }}
              tickLine={false}
              axisLine={false}
              ticks={[0, 7, 15, 18, 25]}
              tickFormatter={(v) => `${v}y`}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#4c665f' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${Math.round(v / 1000)}k`
              }
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatFt(value),
                name === 'actualTotal' ? 'Realized' : 'Projected',
              ]}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #dce5e1',
                fontSize: '11px',
              }}
            />
            <Area
              type="monotone"
              dataKey="actualTotal"
              stroke="#74BF1E"
              strokeWidth={2.5}
              fill="url(#otpActualGrad)"
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="projectedTotal"
              stroke="#74BF1E"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#otpProjGrad)"
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1.5 flex items-center justify-between border-t border-black/5 pt-1.5 text-[10px] text-[#4c665f]">
        <span>Age 18 Est: {formatCompactFt(data[18]?.actualTotal ?? data[18]?.projectedTotal ?? 0)}</span>
        <span className="font-semibold text-[#74BF1E]">
          Age 25 Est: {formatCompactFt(data[25]?.actualTotal ?? data[25]?.projectedTotal ?? 0)}
        </span>
      </div>
    </div>
  );
}
