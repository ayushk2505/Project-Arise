import type { HeatmapDay } from "../types";

interface ActivityHeatmapProps {
  heatmap: HeatmapDay[];
}

function intensityClass(xp: number, max: number): string {
  if (xp <= 0) return "bg-cardhi";
  const ratio = xp / Math.max(max, 1);
  if (ratio > 0.75) return "bg-accent-secondary";
  if (ratio > 0.5) return "bg-accent-secondary/70";
  if (ratio > 0.25) return "bg-accent/60";
  return "bg-accent/30";
}

export default function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const max = Math.max(1, ...heatmap.map((d) => d.xp));

  // Group into weeks (columns), Sunday-first, so it renders like a
  // GitHub contribution graph.
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];
  heatmap.forEach((day, i) => {
    const dow = new Date(day.date + "T00:00:00").getDay();
    if (i === 0) {
      for (let j = 0; j < dow; j++) currentWeek.push({ date: "", xp: -1 });
    }
    currentWeek.push(day);
    if (dow === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length) weeks.push(currentWeek);

  return (
    <div className="region">
      <div className="region-divider flex items-center justify-between">
        <p className="eyebrow">Mutation Grid</p>
        <span className="text-[10px] text-ink-muted">Last 12 weeks</span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) =>
              day.xp === -1 ? (
                <div key={di} className="h-3 w-3" />
              ) : (
                <div
                  key={di}
                  title={`${day.date}: ${day.xp} XP`}
                  className={`h-3 w-3 rounded-sm ${intensityClass(day.xp, max)}`}
                />
              )
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink-muted">
        <span>Less</span>
        <span className="h-3 w-3 rounded-sm bg-cardhi" />
        <span className="h-3 w-3 rounded-sm bg-accent/30" />
        <span className="h-3 w-3 rounded-sm bg-accent/60" />
        <span className="h-3 w-3 rounded-sm bg-accent-secondary/70" />
        <span className="h-3 w-3 rounded-sm bg-accent-secondary" />
        <span>More</span>
      </div>
    </div>
  );
}
