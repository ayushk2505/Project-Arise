import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Quest, QuestInput, Difficulty, Priority, RepeatSchedule } from "../types";

interface QuestEditorModalProps {
  quest: Quest | null; // null = creating a new quest
  onClose: () => void;
  onSave: (data: QuestInput, editingId: string | null) => void;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const PRIORITIES: Priority[] = ["low", "normal", "high"];
const REPEATS: RepeatSchedule[] = ["once", "daily", "weekly"];

function inputClass() {
  return "w-full rounded-lg border border-border bg-void/60 px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent/60 focus:outline-none";
}

export default function QuestEditorModal({ quest, onClose, onSave }: QuestEditorModalProps) {
  const [label, setLabel] = useState(quest?.label ?? "");
  const [description, setDescription] = useState(quest?.description ?? "");
  const [category, setCategory] = useState(quest?.category ?? "Custom");
  const [skill, setSkill] = useState(quest?.skill ?? "Focus");
  const [xp, setXp] = useState(quest?.xp ?? 25);
  const [difficulty, setDifficulty] = useState<Difficulty>(quest?.difficulty ?? "medium");
  const [priority, setPriority] = useState<Priority>(quest?.priority ?? "normal");
  const [dueDate, setDueDate] = useState(quest?.due_date ?? "");
  const [startTime, setStartTime] = useState(quest?.start_time ?? "");
  const [endTime, setEndTime] = useState(quest?.end_time ?? "");
  const [repeatSchedule, setRepeatSchedule] = useState<RepeatSchedule>(
    quest?.repeat_schedule ?? "daily"
  );
  const [reminderTime, setReminderTime] = useState(quest?.reminder_time ?? "");
  const [notes, setNotes] = useState(quest?.notes ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canSave = label.trim().length > 0 && xp > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(
      {
        label: label.trim(),
        description,
        category: category.trim() || "Custom",
        skill: skill.trim() || "Focus",
        xp: Number(xp),
        difficulty,
        priority,
        due_date: dueDate || null,
        start_time: startTime || null,
        end_time: endTime || null,
        repeat_schedule: repeatSchedule,
        reminder_time: reminderTime || null,
        notes,
      },
      quest?.id ?? null
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              {quest ? "Edit Quest" : "New Quest"}
            </h2>
            <button onClick={onClose} className="text-ink-muted hover:text-ink">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Quest Name</label>
              <input
                className={inputClass()}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Morning Workout"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Description</label>
              <textarea
                className={inputClass()}
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does completing this involve?"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Category</label>
                <input
                  className={inputClass()}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Fitness"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Skill Tag</label>
                <input
                  className={inputClass()}
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Strength"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">XP Reward</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass()}
                  value={xp}
                  onChange={(e) => setXp(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Difficulty</label>
                <select
                  className={inputClass()}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Priority</label>
                <select
                  className={inputClass()}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Due Date</label>
                <input
                  type="date"
                  className={inputClass()}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">
                  Repeat Schedule
                </label>
                <select
                  className={inputClass()}
                  value={repeatSchedule}
                  onChange={(e) => setRepeatSchedule(e.target.value as RepeatSchedule)}
                >
                  {REPEATS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Start Time</label>
                <input
                  type="time"
                  className={inputClass()}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">End Time</label>
                <input
                  type="time"
                  className={inputClass()}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Reminder</label>
                <input
                  type="time"
                  className={inputClass()}
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Notes</label>
              <textarea
                className={inputClass()}
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else to remember"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="btn-accent rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              {quest ? "Save Changes" : "Create Quest"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
