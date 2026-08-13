import { motion } from "framer-motion";

interface XPBarProps {
  current: number;
  max: number;
  height?: "sm" | "lg";
}

export default function XPBar({ current, max, height = "lg" }: XPBarProps) {
  const pct = Math.min(100, Math.max(0, (current / max) * 100));
  const barHeight = height === "lg" ? "h-3" : "h-1.5";

  return (
    <div className={`relative w-full overflow-hidden rounded-full bg-black/50 ${barHeight}`}>
      <motion.div
        className="h-full rounded-full bg-accent-gradient shadow-glow-accent"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}
