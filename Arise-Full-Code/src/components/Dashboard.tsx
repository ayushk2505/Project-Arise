import { motion } from "framer-motion";
import type { AppState, Quest } from "../types";
import { getAccentPreset } from "../lib/theme";
import { getLevelInfo } from "../lib/xp";
import GreetingHeader from "./GreetingHeader";
import AnatomyFigure from "./AnatomyFigure";
import EvolutionRing from "./EvolutionRing";
import UpcomingChallengeCard from "./UpcomingChallengeCard";
import StatsStrip from "./StatsStrip";
import QuestList from "./QuestList";
import XPChart from "./XPChart";
import SkillRadar from "./SkillRadar";
import GenomeActivityChart from "./GenomeActivityChart";
import AchievementsRow from "./AchievementsRow";
import ReflectionWidgets from "./ReflectionWidgets";

interface DashboardProps {
  appState: AppState;
  onToggleQuest: (id: string) => void;
  onCreateQuest: () => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (id: string) => void;
  onViewAllQuests: () => void;
}

const cardIn = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

function Reveal({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <motion.div variants={cardIn} initial="hidden" animate="show" custom={i}>
      {children}
    </motion.div>
  );
}

export default function Dashboard({
  appState,
  onToggleQuest,
  onCreateQuest,
  onEditQuest,
  onDeleteQuest,
  onViewAllQuests,
}: DashboardProps) {
  const accent = getAccentPreset(appState.profile.accent_color, appState.profile.theme);
  const info = getLevelInfo(appState.profile.total_xp);
  const questsCompletedToday = appState.quests.filter((q) => q.completedToday).length;
  const achievementsUnlocked = appState.achievements.filter((a) => a.unlocked_at).length;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8 p-6 lg:p-8">
      {/* Top row: greeting + protocols | anatomy figure | evolution ring + challenge */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Reveal i={0}>
            <GreetingHeader name={appState.profile.display_name} />
          </Reveal>
          <Reveal i={1}>
            <QuestList
              quests={appState.quests}
              onToggle={onToggleQuest}
              onEdit={onEditQuest}
              onDelete={onDeleteQuest}
              onCreate={onCreateQuest}
              onViewAll={onViewAllQuests}
              accentColor={accent.primary}
              limit={4}
            />
          </Reveal>
        </div>

        <div className="hidden flex-col items-center justify-center gap-6 lg:col-span-4 lg:flex">
          <Reveal i={2}>
            <AnatomyFigure accentColor={accent.primary} />
          </Reveal>
          <Reveal i={3}>
            <ReflectionWidgets />
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <Reveal i={4}>
            <div className="flex justify-center">
              <EvolutionRing
                pct={info.rankProgressPct}
                label="Evolution Progress"
                accentColor={accent.primary}
                xpIntoRank={info.totalXp - info.rank.xpRequired}
                xpForRank={
                  info.nextRank ? info.nextRank.xpRequired - info.rank.xpRequired : info.totalXp - info.rank.xpRequired
                }
              />
            </div>
          </Reveal>
          <Reveal i={5}>
            <XPChart data={appState.last7Days} accentColor={accent.secondary} title="Neural Activity" compact />
          </Reveal>
          <Reveal i={6}>
            <UpcomingChallengeCard totalXp={appState.profile.total_xp} />
          </Reveal>
        </div>
      </div>

      <Reveal i={7}>
        <StatsStrip
          streak={appState.profile.current_streak}
          questsCompletedToday={questsCompletedToday}
          totalXp={appState.profile.total_xp}
          achievementsUnlocked={achievementsUnlocked}
        />
      </Reveal>

      {/* Bottom row: evolution matrix | genome activity | research archive */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Reveal i={8}>
          <SkillRadar skillTotals={appState.skillTotals} accentColor={accent.primary} />
        </Reveal>
        <Reveal i={9}>
          <GenomeActivityChart heatmap={appState.heatmap} accentColor={accent.secondary} />
        </Reveal>
        <Reveal i={10}>
          <AchievementsRow achievements={appState.achievements} accentColor={accent.primary} />
        </Reveal>
      </div>
    </div>
  );
}
