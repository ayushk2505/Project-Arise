import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { SkillTotal } from "../types";

interface SkillRadarProps {
  skillTotals: SkillTotal[];
  accentColor?: string;
  title?: string;
}

const ALL_SKILLS = ["Strength", "Intelligence", "Knowledge", "Focus", "Health", "Appearance"];

export default function SkillRadar({ skillTotals, accentColor = "#2DD4BF", title = "Evolution Matrix" }: SkillRadarProps) {
  const xpBySkill = new Map(skillTotals.map((s) => [s.skill, s.xp]));
  const data = ALL_SKILLS.map((skill) => ({ skill, xp: xpBySkill.get(skill) ?? 0 }));
  const maxXp = Math.max(50, ...data.map((d) => d.xp));

  return (
    <div className="region">
      <div className="region-divider">
        <p className="eyebrow">{title}</p>
        <span className="text-[10px] text-ink-muted">Core Attributes</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="rgb(var(--color-border))" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "rgb(var(--color-ink-muted))", fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, maxXp]} tick={{ fontSize: 0 }} axisLine={false} />
            <Radar dataKey="xp" stroke={accentColor} strokeWidth={1.6} fill={accentColor} fillOpacity={0.22} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
