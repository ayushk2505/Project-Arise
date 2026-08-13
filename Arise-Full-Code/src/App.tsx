import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useAppStore } from "./store/useAppStore";
import { getLevelInfo } from "./lib/xp";
import type { Quest, QuestInput } from "./types";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import QuestList from "./components/QuestList";
import QuestEditorModal from "./components/QuestEditorModal";
import SkillRadar from "./components/SkillRadar";
import AchievementsRow from "./components/AchievementsRow";
import XPChart from "./components/XPChart";
import ActivityHeatmap from "./components/ActivityHeatmap";
import SettingsPage from "./components/SettingsPage";
import FriendsPage from "./components/FriendsPage";
import LevelUpModal from "./components/LevelUpModal";
import RankUpModal from "./components/RankUpModal";
import OnboardingFlow from "./components/OnboardingFlow";
import AnimatedBackground from "./components/AnimatedBackground";
import XPPopup from "./components/XPPopup";
import { getAccentPreset } from "./lib/theme";

export type View =
  | "dashboard"
  | "quests"
  | "skills"
  | "achievements"
  | "stats"
  | "friends"
  | "ai"
  | "settings";

export default function App() {
  const {
    state,
    loading,
    error,
    pendingLevelUp,
    pendingRankUp,
    xpPopups,
    appVersion,
    load,
    toggleQuest,
    createQuest,
    updateQuest,
    archiveQuest,
    updateProfile,
    pickProfileImage,
    addFriend,
    clearLevelUp,
    clearRankUp,
  } = useAppStore();
  const [view, setView] = useState<View>("dashboard");
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [showQuestEditor, setShowQuestEditor] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!state) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", state.profile.theme);
    root.setAttribute("data-accent", state.profile.accent_color);
    const scale = state.profile.font_size === "sm" ? "0.9" : state.profile.font_size === "lg" ? "1.125" : "1";
    root.style.setProperty("--font-scale", scale);
  }, [state?.profile.theme, state?.profile.accent_color, state?.profile.font_size]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="font-display text-sm uppercase tracking-widest text-ink-muted">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="flex h-screen items-center justify-center bg-void">
        <div className="max-w-sm text-center">
          <p className="font-display text-lg text-danger">Arise Error</p>
          <p className="mt-2 text-sm text-ink-muted">
            {error ?? "Could not connect to the local database."}
          </p>
        </div>
      </div>
    );
  }

  if (!state.profile.onboarding_complete) {
    return (
      <OnboardingFlow
        onComplete={(name, age) => {
          updateProfile({
            display_name: name,
            ...(age ? { age } : {}),
            onboarding_complete: 1,
          });
        }}
      />
    );
  }

  const info = getLevelInfo(state.profile.total_xp);
  const accent = getAccentPreset(state.profile.accent_color, state.profile.theme);

  const openCreateQuest = () => {
    setEditingQuest(null);
    setShowQuestEditor(true);
  };
  const openEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setShowQuestEditor(true);
  };
  const handleSaveQuest = (data: QuestInput, editingId: string | null) => {
    if (editingId) {
      updateQuest(editingId, data);
    } else {
      createQuest(data);
    }
    setShowQuestEditor(false);
  };
  const handleDeleteQuest = (id: string) => {
    if (confirm("Remove this quest? Your past completions and XP stay recorded.")) {
      archiveQuest(id);
    }
  };

  return (
    <div className="flex h-screen bg-void">
      <AnimatedBackground />

      <Sidebar
        active={view}
        onNavigate={setView}
        displayName={state.profile.display_name}
        totalXp={state.profile.total_xp}
        rank={info.rank}
        appVersion={appVersion}
      />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar
          totalXp={state.profile.total_xp}
          streak={state.profile.current_streak}
          displayName={state.profile.display_name}
          avatarPath={state.profile.avatar_path}
          onOpenSettings={() => setView("settings")}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {view === "dashboard" && (
              <Dashboard
                appState={state}
                onToggleQuest={toggleQuest}
                onCreateQuest={openCreateQuest}
                onEditQuest={openEditQuest}
                onDeleteQuest={handleDeleteQuest}
                onViewAllQuests={() => setView("quests")}
              />
            )}

            {view === "quests" && (
              <div className="mx-auto w-full max-w-3xl p-6">
                <QuestList
                  quests={state.quests}
                  onToggle={toggleQuest}
                  onEdit={openEditQuest}
                  onDelete={handleDeleteQuest}
                  onCreate={openCreateQuest}
                  accentColor={accent.primary}
                  title="All Missions"
                />
              </div>
            )}

            {view === "skills" && (
              <div className="mx-auto w-full max-w-3xl p-6">
                <SkillRadar skillTotals={state.skillTotals} accentColor={accent.primary} />
              </div>
            )}

            {view === "achievements" && (
              <div className="mx-auto w-full max-w-5xl p-6">
                <AchievementsRow achievements={state.achievements} />
              </div>
            )}

            {view === "stats" && (
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-6">
                <XPChart data={state.last7Days} accentColor={accent.secondary} />
                <ActivityHeatmap heatmap={state.heatmap} />
              </div>
            )}

            {view === "friends" && (
              <FriendsPage profile={state.profile} friends={state.friends} onAddFriend={addFriend} />
            )}

            {view === "ai" && (
              <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 p-10 py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                  <Bot size={28} />
                </div>
                <h1 className="font-display text-xl font-bold text-ink">AI Assistant</h1>
                <p className="max-w-md text-sm text-ink-muted">
                  Local analysis of your quest history — skipped habits, streak trends,
                  consistency insights — computed entirely from data already on your device. Not
                  built yet; a natural next IPC handler to add on top of this foundation.
                </p>
                <span className="rounded-full border border-border bg-cardhi/60 px-3 py-1 text-xs uppercase tracking-widest text-ink-muted">
                  Coming Soon
                </span>
              </div>
            )}

            {view === "settings" && (
              <SettingsPage
                profile={state.profile}
                stats={state.stats}
                appVersion={appVersion}
                onSave={updateProfile}
                onPickImage={pickProfileImage}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <XPPopup popups={xpPopups} />

      {showQuestEditor && (
        <QuestEditorModal
          quest={editingQuest}
          onClose={() => setShowQuestEditor(false)}
          onSave={handleSaveQuest}
        />
      )}

      {pendingRankUp && (
        <RankUpModal
          fromRank={pendingRankUp.fromRank}
          toRank={pendingRankUp.toRank}
          onDismiss={clearRankUp}
        />
      )}

      {!pendingRankUp && pendingLevelUp && (
        <LevelUpModal
          fromLevel={pendingLevelUp.fromLevel}
          toLevel={pendingLevelUp.toLevel}
          onDismiss={clearLevelUp}
        />
      )}
    </div>
  );
}
