import { useState } from "react";
import type { ReactNode } from "react";
import { Camera } from "lucide-react";
import type { Profile, ProfileUpdateInput, StatsSummary } from "../types";
import { ACCENT_PRESETS } from "../lib/theme";

interface SettingsPageProps {
  profile: Profile;
  stats: StatsSummary;
  appVersion: string;
  onSave: (fields: ProfileUpdateInput) => void;
  onPickImage: (kind: "avatar" | "cover") => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-muted">{label}</label>
      {children}
    </div>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-border bg-void/60 px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent/60 focus:outline-none";
}

export default function SettingsPage({ profile, stats, appVersion, onSave, onPickImage }: SettingsPageProps) {
  const [form, setForm] = useState<ProfileUpdateInput>({
    username: profile.username ?? "",
    display_name: profile.display_name,
    bio: profile.bio,
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    dob: profile.dob ?? "",
    gender: profile.gender ?? "",
    country: profile.country ?? "",
    timezone: profile.timezone ?? "",
    theme: profile.theme,
    accent_color: profile.accent_color,
    font_size: profile.font_size,
    daily_xp_goal: profile.daily_xp_goal,
    weekly_xp_goal: profile.weekly_xp_goal,
    working_hours_start: profile.working_hours_start,
    working_hours_end: profile.working_hours_end,
    reminder_time: profile.reminder_time,
    notification_style: profile.notification_style,
  });
  const [dirty, setDirty] = useState(false);

  const update = <K extends keyof ProfileUpdateInput>(key: K, value: ProfileUpdateInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const setAppearance = (key: "theme" | "accent_color" | "font_size", value: string) => {
    const next = { ...form, [key]: value } as ProfileUpdateInput;
    setForm(next);
    const root = document.documentElement;
    if (key === "theme") root.setAttribute("data-theme", value);
    if (key === "accent_color") root.setAttribute("data-accent", value);
    if (key === "font_size") root.style.setProperty("--font-scale", value === "sm" ? "0.9" : value === "lg" ? "1.125" : "1");
    // Appearance is saved immediately, so it remains selected after leaving Settings.
    void onSave({ [key]: value } as ProfileUpdateInput);
  };

  const handleSave = () => {
    onSave(form);
    setDirty(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-6">
      {/* Avatar + basic info */}
      <div className="panel p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Profile</h2>
        <div className="mb-5 flex items-center gap-4">
          {profile.avatar_path ? (
            <img src={`file://${profile.avatar_path}`} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cardhi text-2xl font-bold text-ink">
              {(form.display_name || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => onPickImage("avatar")}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-ink hover:border-accent/40"
            >
              <Camera size={13} /> Change Photo
            </button>
            <button
              onClick={() => onPickImage("cover")}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-ink hover:border-accent/40"
            >
              <Camera size={13} /> Cover Banner
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Display Name">
            <input className={inputClass()} value={form.display_name} onChange={(e) => update("display_name", e.target.value)} />
          </Field>
          <Field label="Username">
            <input className={inputClass()} value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="unique-username" />
          </Field>
          <Field label="Email">
            <input type="email" className={inputClass()} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Phone (optional)">
            <input className={inputClass()} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
          <Field label="Date of Birth (optional)">
            <input type="date" className={inputClass()} value={form.dob} onChange={(e) => update("dob", e.target.value)} />
          </Field>
          <Field label="Gender (optional)">
            <input className={inputClass()} value={form.gender} onChange={(e) => update("gender", e.target.value)} />
          </Field>
          <Field label="Country">
            <input className={inputClass()} value={form.country} onChange={(e) => update("country", e.target.value)} />
          </Field>
          <Field label="Time Zone">
            <input className={inputClass()} value={form.timezone} onChange={(e) => update("timezone", e.target.value)} placeholder="e.g. Asia/Kolkata" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio / About Me">
            <textarea className={inputClass()} rows={2} value={form.bio} onChange={(e) => update("bio", e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Appearance */}
      <div className="panel p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Appearance</h2>
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-ink-muted">Theme</label>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAppearance("theme", t)}
                className={`rounded-lg border px-4 py-2 text-sm capitalize ${
                  form.theme === t ? "border-accent bg-accent/10 text-ink" : "border-border text-ink-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-ink-muted">Accent Color</label>
          <div className="flex gap-2">
            {Object.entries(ACCENT_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setAppearance("accent_color", key)}
                title={preset.label}
                className={`h-9 w-9 rounded-full border-2 ${form.accent_color === key ? "border-ink" : "border-transparent"}`}
                style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-ink-muted">Font Size</label>
          <div className="flex gap-2">
            {(["sm", "md", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setAppearance("font_size", size)}
                className={`rounded-lg border px-4 py-2 text-sm uppercase ${
                  form.font_size === size ? "border-accent bg-accent/10 text-ink" : "border-border text-ink-muted"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productivity preferences */}
      <div className="panel p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Productivity Preferences</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Daily XP Goal">
            <input type="number" className={inputClass()} value={form.daily_xp_goal} onChange={(e) => update("daily_xp_goal", Number(e.target.value))} />
          </Field>
          <Field label="Weekly XP Goal">
            <input type="number" className={inputClass()} value={form.weekly_xp_goal} onChange={(e) => update("weekly_xp_goal", Number(e.target.value))} />
          </Field>
          <Field label="Working Hours Start">
            <input type="time" className={inputClass()} value={form.working_hours_start} onChange={(e) => update("working_hours_start", e.target.value)} />
          </Field>
          <Field label="Working Hours End">
            <input type="time" className={inputClass()} value={form.working_hours_end} onChange={(e) => update("working_hours_end", e.target.value)} />
          </Field>
          <Field label="Preferred Reminder Time">
            <input type="time" className={inputClass()} value={form.reminder_time} onChange={(e) => update("reminder_time", e.target.value)} />
          </Field>
          <Field label="Notification Style">
            <select
              className={inputClass()}
              value={form.notification_style}
              onChange={(e) => update("notification_style", e.target.value as ProfileUpdateInput["notification_style"])}
            >
              <option value="popup">Popup</option>
              <option value="sound">Sound</option>
              <option value="silent">Silent</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Auto-computed stats */}
      <div className="panel p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Statistics</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatRow label="Level" value={stats.level} />
          <StatRow label="Total XP" value={stats.totalXp} />
          <StatRow label="Current Streak" value={stats.currentStreak} />
          <StatRow label="Longest Streak" value={stats.longestStreak} />
          <StatRow label="Quests Completed" value={stats.totalQuestsCompleted} />
          <StatRow label="Achievements" value={stats.achievementCount} />
          <StatRow label="Daily Rate" value={`${stats.dailyCompletionRate}%`} />
          <StatRow label="Weekly Rate" value={`${stats.weeklyCompletionRate}%`} />
          <StatRow label="Monthly Rate" value={`${stats.monthlyCompletionRate}%`} />
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Total Focus Hours isn't shown yet — it needs a focus-timer feature that hasn't been
          built, so this app won't report an estimate it can't back up with real data.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-muted">Arise {appVersion && `v${appVersion}`}</p>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className="btn-accent rounded-lg px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-cardhi/40 px-3 py-2">
      <p className="font-display text-base font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}
