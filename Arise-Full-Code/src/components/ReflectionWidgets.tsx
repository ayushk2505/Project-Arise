import { CalendarDays, ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pad = (value: number) => String(value).padStart(2, "0");
const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function ReflectionWidgets() {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(dateKey(today));
  const [thought, setThought] = useState("");

  useEffect(() => {
    setThought(localStorage.getItem("arise-motivation-thought") ?? "");
  }, []);

  const saveThought = (value: string) => {
    setThought(value);
    localStorage.setItem("arise-motivation-thought", value);
  };

  const firstDay = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : index - firstDay + 1);
  const monthName = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const todayKey = dateKey(today);

  return (
    <div className="flex w-full max-w-[340px] flex-col gap-5">
      <section className="region">
        <div className="region-divider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-accent" />
            <p className="eyebrow">Calendar</p>
          </div>
          <div className="flex items-center gap-1">
            <button aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-md p-1 text-ink-muted hover:bg-cardhi hover:text-ink">
              <ChevronLeft size={15} />
            </button>
            <button aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-md p-1 text-ink-muted hover:bg-cardhi hover:text-ink">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
        <p className="mb-3 text-center text-sm font-medium text-ink">{monthName}</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((day) => <span key={day} className="pb-1 text-[10px] font-medium text-ink-muted">{day}</span>)}
          {days.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} />;
            const key = `${month.getFullYear()}-${pad(month.getMonth() + 1)}-${pad(day)}`;
            const isToday = key === todayKey;
            const isSelected = key === selected;
            return <button key={key} onClick={() => setSelected(key)} className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs ${isSelected ? "bg-accent text-void" : isToday ? "border border-accent/60 text-accent" : "text-ink-muted hover:bg-cardhi hover:text-ink"}`}>
              {day}
            </button>;
          })}
        </div>
      </section>

      <section className="region">
        <div className="region-divider flex items-center gap-2">
          <NotebookPen size={14} className="text-accent-secondary" />
          <p className="eyebrow">Motivation thought</p>
        </div>
        <textarea
          value={thought}
          onChange={(event) => saveThought(event.target.value)}
          maxLength={280}
          placeholder="Write something that keeps you moving..."
          className="h-20 w-full resize-none rounded-xl border border-border bg-card/70 p-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-muted/70 focus:border-accent/60"
        />
        <p className="mt-1.5 text-right text-[10px] text-ink-muted">{thought.length}/280 · saved automatically</p>
      </section>
    </div>
  );
}
