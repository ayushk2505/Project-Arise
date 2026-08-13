import { motion } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Quest } from "../types";

interface QuestItemProps {
  quest: Quest;
  onToggle: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
  accentColor: string;
}

export default function QuestItem({ quest, onToggle, onEdit, onDelete, accentColor }: QuestItemProps) {
  return (
    <motion.div layout className="group flex items-center gap-3 border-b border-border/60 py-3 last:border-0">
      <button
        onClick={() => onToggle(quest.id)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors"
        style={{
          borderColor: quest.completedToday ? accentColor : "rgb(var(--color-border))",
          backgroundColor: quest.completedToday ? accentColor : "transparent",
        }}
      >
        {quest.completedToday && <Check size={12} strokeWidth={3} className="text-void" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${quest.completedToday ? "text-ink-muted line-through" : "text-ink"}`}>
          {quest.label}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-ink-muted">{quest.skill}</p>
      </div>

      <span className="font-mono-num shrink-0 text-xs text-ink-muted">
        +{quest.xp} <span className="opacity-60">XP</span>
      </span>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={() => onEdit(quest)} className="rounded p-1 text-ink-muted hover:text-ink" title="Edit">
          <Pencil size={12} />
        </button>
        <button onClick={() => onDelete(quest.id)} className="rounded p-1 text-ink-muted hover:text-danger" title="Remove">
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
}
