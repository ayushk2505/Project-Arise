import { motion } from "framer-motion";
import type { RankDef } from "../data/ranks";

interface RankBadgeProps {
  rank: RankDef;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const SIZES: Record<NonNullable<RankBadgeProps["size"]>, { box: number; font: number; ring: number }> = {
  sm: { box: 32, font: 14, ring: 2 },
  md: { box: 48, font: 18, ring: 2 },
  lg: { box: 72, font: 26, ring: 3 },
  xl: { box: 112, font: 40, ring: 4 },
};

export default function RankBadge({ rank, size = "md", animated = true }: RankBadgeProps) {
  const dims = SIZES[size];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dims.box, height: dims.box }}>
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${rank.primary}, ${rank.secondary}, ${rank.primary})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div
        className="absolute rounded-full bg-void"
        style={{
          inset: dims.ring,
          boxShadow: `inset 0 0 ${dims.box * 0.25}px rgba(0,0,0,0.6)`,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 ${dims.box * 0.4}px ${rank.glow}` }}
        animate={animated ? { opacity: [0.5, 1, 0.5] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative font-display font-extrabold"
        style={{ fontSize: dims.font, color: rank.primary, textShadow: `0 0 12px ${rank.glow}` }}
      >
        {rank.id}
      </span>
    </div>
  );
}
