import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import type { HeatmapDay } from "../types";

interface GenomeActivityChartProps {
  heatmap: HeatmapDay[];
  accentColor: string;
}

// Renders daily activity as a smooth mountain-range silhouette instead of
// a grid heatmap — same underlying data, different read: a skyline you
// watch grow rather than a calendar you scan.
export default function GenomeActivityChart({ heatmap, accentColor }: GenomeActivityChartProps) {
  const data = heatmap.map((d, i) => ({ i, xp: d.xp }));
  const max = Math.max(10, ...data.map((d) => d.xp));

  return (
    <div className="region">
      <div className="region-divider flex items-center justify-between">
        <p className="eyebrow">Genome Activity</p>
        <span className="text-[10px] text-ink-muted">Last 12 weeks</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="genomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.45} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, max]} />
            <Area
              type="monotone"
              dataKey="xp"
              stroke={accentColor}
              strokeWidth={1.4}
              fill="url(#genomeFill)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
