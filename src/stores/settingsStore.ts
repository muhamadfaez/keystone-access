import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface NotificationPreferences {
  overdueKeys: boolean;
  keyReturns: boolean;
  keyIssues: boolean;
}
interface SettingsState {
  notifications: NotificationPreferences;
  toggleOverdueKeys: () => void;
  toggleKeyReturns: () => void;
  toggleKeyIssues: () => void;
}
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: {
        overdueKeys: true,
        keyReturns: true,
        keyIssues: false,
      },
      toggleOverdueKeys: () =>
        set((state) => ({
          notifications: { ...state.notifications, overdueKeys: !state.notifications.overdueKeys },
        })),
      toggleKeyReturns: () =>
        set((state) => ({
          notifications: { ...state.notifications, keyReturns: !state.notifications.keyReturns },
        })),
      toggleKeyIssues: () =>
        set((state) => ({
          notifications: { ...state.notifications, keyIssues: !state.notifications.keyIssues },
        })),
    }),
    {
      name: 'keystone-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);