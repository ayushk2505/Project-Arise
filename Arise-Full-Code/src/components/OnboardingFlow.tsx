import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Award, ArrowRight } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

interface OnboardingFlowProps {
  onComplete: (name: string, age: number | null) => void;
}

type Step = "welcome" | "form" | "beginning" | "loading" | "unlocked";

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const goToForm = () => setStep("form");

  const handleSubmit = () => {
    if (!name.trim()) return;
    setStep("beginning");
    setTimeout(() => setStep("loading"), 1800);
    setTimeout(() => setStep("unlocked"), 3400);
    setTimeout(() => onComplete(name.trim(), age ? Number(age) : null), 5600);
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-void">
      <AnimatedBackground />

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              animate={{ boxShadow: ["0 0 30px rgba(139,92,246,0.4)", "0 0 60px rgba(34,211,238,0.5)", "0 0 30px rgba(139,92,246,0.4)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-gradient"
            >
              <Sparkles size={36} className="text-void" />
            </motion.div>
            <div>
              <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink">
                Welcome to Arise
              </h1>
              <p className="mt-3 max-w-md text-sm text-ink-muted">
                Your personal RPG starts here. Create your player identity.
              </p>
            </div>
            <motion.button
              onClick={goToForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn-accent mt-2 flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-widest"
            >
              Begin <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="panel-glow p-8">
              <h2 className="mb-1 text-center font-display text-xl font-bold text-ink">
                Create Your Player Card
              </h2>
              <p className="mb-6 text-center text-xs text-ink-muted">
                Choose the identity shown throughout your campaign.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-muted">Name</label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-accent/30 bg-void/60 px-4 py-3 text-sm text-ink shadow-[0_0_0_1px_rgba(139,92,246,0.1)] outline-none transition-shadow focus:border-accent focus:shadow-[0_0_16px_rgba(139,92,246,0.35)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-muted">Age</label>
                  <input
                    type="number"
                    min={1}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    className="w-full rounded-lg border border-accent/30 bg-void/60 px-4 py-3 text-sm text-ink shadow-[0_0_0_1px_rgba(139,92,246,0.1)] outline-none transition-shadow focus:border-accent focus:shadow-[0_0_16px_rgba(139,92,246,0.35)]"
                  />
                </div>
              </div>

              <motion.button
                onClick={handleSubmit}
                disabled={!name.trim()}
                whileHover={{ scale: name.trim() ? 1.02 : 1 }}
                whileTap={{ scale: name.trim() ? 0.98 : 1 }}
                className="btn-accent mt-6 w-full rounded-lg py-3 text-sm font-semibold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "beginning" && (
          <motion.div
            key="beginning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="font-display text-2xl font-bold text-ink"
            >
              Your journey begins today<span className="text-accent-secondary">...</span>
            </motion.p>
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-muted">
              Preparing your world...
            </p>
          </motion.div>
        )}

        {step === "unlocked" && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-gold/10 shadow-glow-gold"
            >
              <Award size={34} className="text-gold" />
            </motion.div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Achievement Unlocked
            </p>
            <p className="font-display text-2xl font-bold text-ink">The Journey Begins</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
