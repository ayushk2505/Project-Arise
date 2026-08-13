import { useMemo } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 14 + Math.random() * 14,
        delay: Math.random() * 10,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(var(--color-accent)) 0%, transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(var(--color-accent-2)) 0%, transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-accent-secondary/40"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, bottom: -10 }}
          animate={{ y: ["0vh", "-110vh"], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
