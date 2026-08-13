import { create } from "zustand";
import type { AppState, QuestInput, ProfileUpdateInput, FriendAddResult } from "../types";
import { getLevelInfo } from "../lib/xp";
import type { RankDef } from "../data/ranks";
import type { XPPopupItem } from "../components/XPPopup";

interface PendingLevelUp {
  fromLevel: number;
  toLevel: number;
}

interface PendingRankUp {
  fromRank: RankDef;
  toRank: RankDef;
}

let popupIdCounter = 0;

interface AppStore {
  state: AppState | null;
  loading: boolean;
  error: string | null;
  pendingLevelUp: PendingLevelUp | null;
  pendingRankUp: PendingRankUp | null;
  xpPopups: XPPopupItem[];
  appVersion: string;
  load: () => Promise<void>;
  toggleQuest: (questId: string) => Promise<void>;
  createQuest: (data: QuestInput) => Promise<void>;
  updateQuest: (questId: string, data: Partial<QuestInput>) => Promise<void>;
  archiveQuest: (questId: string) => Promise<void>;
  updateProfile: (fields: ProfileUpdateInput) => Promise<void>;
  pickProfileImage: (kind: "avatar" | "cover") => Promise<void>;
  addFriend: (code: string) => Promise<FriendAddResult>;
  clearLevelUp: () => void;
  clearRankUp: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  state: null,
  loading: true,
  error: null,
  pendingLevelUp: null,
  pendingRankUp: null,
  xpPopups: [],
  appVersion: "",

  load: async () => {
    try {
      set({ loading: true, error: null });
      const [state, appVersion] = await Promise.all([
        window.api.getState(),
        window.api.getAppVersion(),
      ]);
      set({ state, appVersion, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load state", loading: false });
    }
  },

  toggleQuest: async (questId: string) => {
    const prevState = get().state;
    const prevInfo = prevState ? getLevelInfo(prevState.profile.total_xp) : null;

    try {
      const { state, justAwardedXp } = await window.api.toggleQuest(questId);
      const newInfo = getLevelInfo(state.profile.total_xp);
      set({ state });

      if (justAwardedXp && justAwardedXp > 0) {
        const popup: XPPopupItem = { id: ++popupIdCounter, amount: justAwardedXp };
        set((s) => ({ xpPopups: [...s.xpPopups, popup] }));
        setTimeout(() => {
          set((s) => ({ xpPopups: s.xpPopups.filter((p) => p.id !== popup.id) }));
        }, 1500);
      }

      if (prevInfo && newInfo.level > prevInfo.level) {
        if (newInfo.rank.id !== prevInfo.rank.id) {
          set({ pendingRankUp: { fromRank: prevInfo.rank, toRank: newInfo.rank } });
        } else {
          set({ pendingLevelUp: { fromLevel: prevInfo.level, toLevel: newInfo.level } });
        }
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update quest" });
    }
  },

  createQuest: async (data) => {
    try {
      const state = await window.api.createQuest(data);
      set({ state });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to create quest" });
    }
  },

  updateQuest: async (questId, data) => {
    try {
      const state = await window.api.updateQuest(questId, data);
      set({ state });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update quest" });
    }
  },

  archiveQuest: async (questId) => {
    try {
      const state = await window.api.archiveQuest(questId);
      set({ state });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to remove quest" });
    }
  },

  updateProfile: async (fields) => {
    try {
      const state = await window.api.updateProfile(fields);
      set({ state });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update profile" });
    }
  },

  pickProfileImage: async (kind) => {
    try {
      const state = await window.api.pickProfileImage(kind);
      if (state) set({ state });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update image" });
    }
  },

  addFriend: async (code) => {
    const result = await window.api.addFriend(code);
    set({ state: result.state });
    return result;
  },

  clearLevelUp: () => set({ pendingLevelUp: null }),
  clearRankUp: () => set({ pendingRankUp: null }),
}));
