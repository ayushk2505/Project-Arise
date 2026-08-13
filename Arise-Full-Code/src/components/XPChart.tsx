import { AreaChart, Area, XAxis, ResponsiveContainer } from "recharts";
import type { DayXp } from "../types";

interface XPChartProps {
  data: DayXp[];
  accentColor?: string;
  title?: string;
  compact?: boolean;
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1);
}

export default function XPChart({ data, accentColor = "#2DD4BF", title = "Neural Activity", compact = false }: XPChartProps) {
  const chartData = data.map((d) => ({ ...d, label: formatDay(d.date) }));

  return (
    <div className="region">
      <div className="region-divider flex items-center justify-between">
        <p className="eyebrow">{title}</p>
        <span className="text-[10px] text-ink-muted">Last 7 Days</span>
      </div>
      <div className={compact ? "h-20" : "h-56"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            {!compact && (
              <XAxis
                dataKey="label"
                stroke="rgb(var(--color-ink-muted))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="xp"
              stroke={accentColor}
              strokeWidth={1.4}
              fill="url(#xpFill)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
