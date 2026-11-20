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
    <div className="ds-card">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-extrabold ds-text-primary">0 → 25 Growth Curve</p>
        <div className="flex items-center gap-2 text-[10px] font-semibold ds-text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#38571a]" /> Actual
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#52ae30]" /> Proj
          </span>
        </div>
      </div>

      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
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
                borderRadius: '12px',
                border: '1px solid #e4e9f0',
                fontSize: '11px',
              }}
            />
            <Area
              type="monotone"
              dataKey="actualTotal"
              stroke="#38571a"
              strokeWidth={2.5}
              fill="#e8f5e4"
              fillOpacity={0.75}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="projectedTotal"
              stroke="#52ae30"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="#e8f5e4"
              fillOpacity={0.35}
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-black/6 pt-2 text-[10px] ds-text-muted tabular-nums">
        <span>Age 18: {formatCompactFt(data[18]?.actualTotal ?? data[18]?.projectedTotal ?? 0)}</span>
        <span className="font-extrabold text-[#38571a]">
          Age 25: {formatCompactFt(data[25]?.actualTotal ?? data[25]?.projectedTotal ?? 0)}
        </span>
      </div>
    </div>
  );
}
