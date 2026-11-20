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
import { useDesignStudio } from '@/state/designStudio';
import type { LifestartCoreState } from '@/types/lifestart';

export function GrowthChart({ core }: { core: LifestartCoreState }) {
  const { tokens } = useDesignStudio();
  const data = buildChartSeries(core);

  return (
    <div className="ds-card">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold ds-text-primary">0 → 25 Growth Curve</p>
          {tokens.copyDensity !== 'concise' && (
            <p className="text-[10px] ds-text-muted">Solid = realized · Dashed = projected</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium ds-text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#005e48]" /> Actual
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#74bf1e]" /> Proj
          </span>
        </div>
      </div>

      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="otpActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005e48" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#005e48" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="otpProjGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#74bf1e" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#74bf1e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,46,38,0.08)" vertical={false} />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fill: '#4a635c' }}
              tickLine={false}
              axisLine={false}
              ticks={[0, 7, 15, 18, 25]}
              tickFormatter={(v) => `${v}y`}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#4a635c' }}
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
              stroke="#005e48"
              strokeWidth={2.5}
              fill="url(#otpActualGrad)"
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="projectedTotal"
              stroke="#74bf1e"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="url(#otpProjGrad)"
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1.5 flex items-center justify-between border-t border-black/6 pt-1.5 text-[10px] ds-text-muted tabular-nums">
        <span>Age 18: {formatCompactFt(data[18]?.actualTotal ?? data[18]?.projectedTotal ?? 0)}</span>
        <span style={{ color: 'var(--ds-primary)' }} className="font-bold">
          Age 25: {formatCompactFt(data[25]?.actualTotal ?? data[25]?.projectedTotal ?? 0)}
        </span>
      </div>
    </div>
  );
}
