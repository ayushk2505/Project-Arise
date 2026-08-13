import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";

interface LevelUpModalProps {
  fromLevel: number;
  toLevel: number;
  onDismiss: () => void;
}

export default function LevelUpModal({ fromLevel, toLevel, onDismiss }: LevelUpModalProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3400);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        angle: (360 / 24) * i,
        delay: Math.random() * 0.3,
      })),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <div className="relative flex flex-col items-center">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute h-1.5 w-1.5 rounded-full bg-accent-secondary"
              style={{ top: "50%", left: "50%" }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * 180,
                y: Math.sin((p.angle * Math.PI) / 180) * 180,
                opacity: 0,
              }}
              transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-accent-secondary">
              Level Up
            </span>
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl font-bold text-ink-muted">{fromLevel}</span>
              <span className="text-2xl text-accent">&rarr;</span>
              <span
                className="font-display text-6xl font-extrabold text-ink"
                style={{ textShadow: "0 0 24px rgb(var(--color-accent-2) / 0.8)" }}
              >
                {toLevel}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-muted">Click anywhere to continue</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
