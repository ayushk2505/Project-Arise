import { Award, Lock } from "lucide-react";
import type { Achievement } from "../types";

interface AchievementsRowProps {
  achievements: Achievement[];
  accentColor?: string;
}

const RARITY_LABEL: Record<Achievement["rarity"], string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
};

export default function AchievementsRow({ achievements, accentColor = "#2DD4BF" }: AchievementsRowProps) {
  const sorted = [...achievements].sort((a, b) => {
    if (!!a.unlocked_at === !!b.unlocked_at) {
      return (b.unlocked_at ?? "").localeCompare(a.unlocked_at ?? "");
    }
    return a.unlocked_at ? -1 : 1;
  });

  return (
    <div className="region">
      <div className="region-divider">
        <p className="eyebrow">Research Archive</p>
        <span className="text-[10px] text-ink-muted">Recent Unlocks</span>
      </div>
      <div className="space-y-3">
        {sorted.slice(0, 5).map((a) => {
          const unlocked = !!a.unlocked_at;
          return (
            <div key={a.id} title={a.description} className="flex items-center gap-3">
              {unlocked ? (
                <Award size={16} style={{ color: accentColor }} />
              ) : (
                <Lock size={14} className="text-ink-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`truncate text-xs font-medium ${unlocked ? "text-ink" : "text-ink-muted"}`}>
                  {a.label}
                </p>
              </div>
              <span className="text-[9px] uppercase tracking-wide text-ink-muted">
                {RARITY_LABEL[a.rarity]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
