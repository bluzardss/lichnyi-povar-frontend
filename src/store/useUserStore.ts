import { create } from 'zustand';

interface UserState {
  user: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
  } | null;
  theme: {
    background_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  } | null;
  // Settings (можно расширить)
  settings: {
    notifications: boolean;
    autosave: boolean;
  };
  // Actions
  setUser: (user: UserState['user']) => void;
  setTheme: (theme: UserState['theme']) => void;
  updateSettings: (settings: Partial<UserState['settings']>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  theme: null,
  settings: {
    notifications: true,
    autosave: true,
  },

  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
}));
