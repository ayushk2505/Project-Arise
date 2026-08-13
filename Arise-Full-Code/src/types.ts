export type Difficulty = "easy" | "medium" | "hard";
export type Priority = "low" | "normal" | "high";
export type RepeatSchedule = "once" | "daily" | "weekly";

export interface Quest {
  id: string;
  label: string;
  category: string;
  skill: string;
  xp: number;
  sort_order: number;
  description: string;
  difficulty: Difficulty;
  priority: Priority;
  due_date: string | null;
  start_time: string | null;
  end_time: string | null;
  repeat_schedule: RepeatSchedule;
  reminder_time: string | null;
  notes: string;
  is_archived: number;
  completedToday: boolean;
}

export interface QuestInput {
  label: string;
  category?: string;
  skill?: string;
  xp: number;
  description?: string;
  difficulty?: Difficulty;
  priority?: Priority;
  due_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  repeat_schedule?: RepeatSchedule;
  reminder_time?: string | null;
  notes?: string;
}

export interface Profile {
  id: number;
  total_xp: number;
  gold: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;

  username: string | null;
  display_name: string;
  bio: string;
  email: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  country: string | null;
  timezone: string | null;
  avatar_path: string | null;
  cover_path: string | null;
  theme: "dark" | "light";
  accent_color: string;
  font_size: "sm" | "md" | "lg";
  daily_xp_goal: number;
  weekly_xp_goal: number;
  working_hours_start: string;
  working_hours_end: string;
  reminder_time: string;
  notification_style: "popup" | "sound" | "silent";
  friend_code: string;
  onboarding_complete: number;
  age: number | null;
}

export interface ProfileUpdateInput {
  username?: string;
  display_name?: string;
  bio?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  country?: string;
  timezone?: string;
  theme?: "dark" | "light";
  accent_color?: string;
  font_size?: "sm" | "md" | "lg";
  daily_xp_goal?: number;
  weekly_xp_goal?: number;
  working_hours_start?: string;
  working_hours_end?: string;
  reminder_time?: string;
  notification_style?: "popup" | "sound" | "silent";
  age?: number;
  onboarding_complete?: number;
}

export interface DayXp {
  date: string;
  xp: number;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  unlocked_at: string | null;
  rarity: "common" | "rare" | "epic";
}

export interface SkillTotal {
  skill: string;
  xp: number;
}

export interface HeatmapDay {
  date: string;
  xp: number;
}

export interface StatsSummary {
  level: number;
  totalXp: number;
  weeklyXp: number;
  monthlyXp: number;
  currentStreak: number;
  longestStreak: number;
  totalQuestsCompleted: number;
  dailyCompletionRate: number;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  totalFocusHours: number;
  achievementCount: number;
  achievementPoints: number;
}

export interface Friend {
  id: string;
  friend_code: string;
  display_name: string;
  added_at: string;
}

export interface FriendAddResult {
  success: boolean;
  reason?: string;
  message?: string;
  state: AppState;
}

export interface AppState {
  profile: Profile;
  quests: Quest[];
  last7Days: DayXp[];
  achievements: Achievement[];
  skillTotals: SkillTotal[];
  heatmap: HeatmapDay[];
  stats: StatsSummary;
  friends: Friend[];
}

export interface ToggleQuestResult {
  state: AppState;
  justAwardedXp: number | null;
}

// The API surface exposed by electron/preload.cjs via contextBridge.
export interface ElectronApi {
  getState: () => Promise<AppState>;
  toggleQuest: (questId: string) => Promise<ToggleQuestResult>;
  createQuest: (data: QuestInput) => Promise<AppState>;
  updateQuest: (questId: string, data: Partial<QuestInput>) => Promise<AppState>;
  archiveQuest: (questId: string) => Promise<AppState>;
  updateProfile: (fields: ProfileUpdateInput) => Promise<AppState>;
  pickProfileImage: (kind: "avatar" | "cover") => Promise<AppState | null>;
  addFriend: (code: string) => Promise<FriendAddResult>;
  getDbPath: () => Promise<string>;
  getAppVersion: () => Promise<string>;
}

declare global {
  interface Window {
    api: ElectronApi;
  }
}
