import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { RankDef } from "../data/ranks";
import RankBadge from "./RankBadge";

interface RankUpModalProps {
  fromRank: RankDef;
  toRank: RankDef;
  onDismiss: () => void;
}

export default function RankUpModal({ fromRank, toRank, onDismiss }: RankUpModalProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        angle: (360 / 40) * i,
        distance: 160 + Math.random() * 140,
        delay: Math.random() * 0.4,
      })),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
        style={{ background: "rgba(0,0,0,0.85)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${toRank.glow} 0%, transparent 60%)`,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex flex-col items-center">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{ top: "50%", left: "50%", background: toRank.primary }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
              }}
              transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="font-display text-sm font-semibold uppercase tracking-[0.5em] text-ink-muted">
              Rank Promotion
            </span>

            <div className="flex items-center gap-6">
              <div className="opacity-50">
                <RankBadge rank={fromRank} size="lg" animated={false} />
              </div>
              <span className="text-3xl text-ink-muted">&rarr;</span>
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <RankBadge rank={toRank} size="xl" />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2"
            >
              <p className="font-display text-3xl font-extrabold" style={{ color: toRank.primary, textShadow: `0 0 24px ${toRank.glow}` }}>
                {toRank.name}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{toRank.title}</p>
            </motion.div>

            <p className="mt-3 text-xs text-ink-muted">Click anywhere to continue</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
