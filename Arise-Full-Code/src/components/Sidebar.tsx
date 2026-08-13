import {
  LayoutDashboard,
  ScrollText,
  Dna,
  TrendingUp,
  BarChart3,
  Users,
  Archive,
  Settings as SettingsIcon,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { View } from "../App";
import type { RankDef } from "../data/ranks";
import { getLevelInfo } from "../lib/xp";
import RankBadge from "./RankBadge";
import XPBar from "./XPBar";

interface NavItem {
  id: View;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "quests", label: "Missions", icon: ScrollText },
  { id: "skills", label: "Genome", icon: Dna },
  { id: "stats", label: "Evolution", icon: TrendingUp },
  { id: "ai", label: "Analytics", icon: BarChart3 },
  { id: "friends", label: "Network", icon: Users },
  { id: "achievements", label: "Archive", icon: Archive },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

interface SidebarProps {
  active: View;
  onNavigate: (view: View) => void;
  displayName: string;
  totalXp: number;
  rank: RankDef;
  appVersion: string;
}

export default function Sidebar({ active, onNavigate, displayName, totalXp, rank, appVersion }: SidebarProps) {
  const info = getLevelInfo(totalXp);

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-md">
      <div className="flex items-center gap-3 px-6 pb-6 pt-7">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <polygon
            points="13,2 23,8 23,18 13,24 3,18 3,8"
            stroke={rank.primary}
            strokeWidth="1.4"
            style={{ filter: `drop-shadow(0 0 4px ${rank.primary})` }}
          />
          <circle cx="13" cy="13" r="3" fill={rank.primary} opacity="0.85" />
        </svg>
        <div>
          <p className="font-display text-sm font-bold leading-none tracking-wide text-ink">
            SYSTEM.EXE
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-ink-muted">
            Evolve. Adapt. Ascend.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium uppercase tracking-wide transition-all duration-200 ${
                isActive ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {isActive && (
                <span
                  className="absolute -left-4 h-5 w-0.5 rounded-full"
                  style={{ background: rank.primary, boxShadow: `0 0 6px ${rank.primary}` }}
                />
              )}
              {isActive && <span className="absolute inset-0 rounded-lg bg-accent/10" />}
              <Icon size={15} className="relative" style={{ color: isActive ? rank.primary : undefined }} />
              <span className="relative flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={12} className="relative" style={{ color: rank.primary }} />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border px-5 py-5">
        <button onClick={() => onNavigate("settings")} className="mb-4 flex w-full items-center gap-3 text-left">
          <RankBadge rank={rank} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            <p className="truncate text-[10px] uppercase tracking-wide text-ink-muted">
              {rank.name} &middot; {rank.title}
            </p>
          </div>
        </button>
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] text-ink-muted">
            <span className="uppercase tracking-wide">Level {info.level}</span>
            <span className="font-mono-num">
              {info.xpIntoLevel}/{info.xpForThisLevel} XP
            </span>
          </div>
          <XPBar current={info.xpIntoLevel} max={info.xpForThisLevel} height="sm" />
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          System Stable &middot; Ver. {appVersion || "1.0.0"}
        </p>
      </div>
    </aside>
  );
}
