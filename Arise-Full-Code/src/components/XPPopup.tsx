import { AnimatePresence, motion } from "framer-motion";

export interface XPPopupItem {
  id: number;
  amount: number;
}

interface XPPopupProps {
  popups: XPPopupItem[];
}

export default function XPPopup({ popups }: XPPopupProps) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2">
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-xl font-bold text-accent-secondary"
            style={{ textShadow: "0 0 16px rgb(var(--color-accent-2) / 0.8)" }}
          >
            +{p.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
