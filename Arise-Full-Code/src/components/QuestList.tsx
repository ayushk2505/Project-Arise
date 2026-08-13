import { Plus, ScrollText } from "lucide-react";
import type { Quest } from "../types";
import QuestItem from "./QuestItem";

interface QuestListProps {
  quests: Quest[];
  onToggle: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  accentColor: string;
  title?: string;
  limit?: number;
  onViewAll?: () => void;
}

export default function QuestList({
  quests,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
  accentColor,
  title = "Today's Protocols",
  limit,
  onViewAll,
}: QuestListProps) {
  const completedCount = quests.filter((q) => q.completedToday).length;
  const visible = limit ? quests.slice(0, limit) : quests;
  const isTruncated = Boolean(limit && quests.length > limit);

  return (
    <div className="region">
      <div className="region-divider flex items-center justify-between">
        <p className="eyebrow">{title}</p>
        <span className="font-mono-num text-[10px] text-ink-muted">
          {completedCount}/{quests.length}
        </span>
      </div>

      {quests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <ScrollText size={22} className="text-ink-muted" />
          <p className="text-xs text-ink-muted">No protocols logged yet.</p>
          <button onClick={onCreate} className="btn-accent rounded-lg px-4 py-2 text-xs font-medium">
            Create Protocol
          </button>
        </div>
      ) : (
        <div>
          {visible.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={quest}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}

      {quests.length > 0 && (
        <button
          onClick={isTruncated ? onViewAll ?? onCreate : onCreate}
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-muted hover:text-ink"
        >
          <Plus size={12} />
          {isTruncated ? "View All Protocols" : "New Protocol"}
        </button>
      )}
    </div>
  );
}
