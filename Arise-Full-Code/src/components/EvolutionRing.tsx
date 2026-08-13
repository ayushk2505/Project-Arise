import { motion } from "framer-motion";

interface EvolutionRingProps {
  pct: number; // 0-100
  label: string;
  accentColor: string;
  xpIntoRank: number;
  xpForRank: number;
  size?: number;
}

export default function EvolutionRing({
  pct,
  label,
  accentColor,
  xpIntoRank,
  xpForRank,
  size = 128,
}: EvolutionRingProps) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, pct)) / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="eyebrow">{label}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgb(var(--color-border))"
            strokeWidth={4}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-num text-2xl font-bold text-ink">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="font-mono-num text-xs text-ink-muted">
        {xpIntoRank.toLocaleString()} / {xpForRank.toLocaleString()}
      </p>
    </div>
  );
}
