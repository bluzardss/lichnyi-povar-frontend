import { create } from 'zustand';
import { Recipe } from '../types/index';
import { api } from '../api/plainClient';

interface RecipeState {
  currentRecipe: Recipe | null;
  history: Recipe[];
  isLoading: boolean;
  error: string | null;
  // Actions
  analyzeDish: (text: string, imageFile?: File) => Promise<void>;
  fetchRecipe: (id: number) => Promise<void>;
  fetchHistory: () => Promise<void>;
  deleteRecipe: (id: number) => Promise<void>;
  clearCurrent: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  currentRecipe: null,
  history: [],
  isLoading: false,
  error: null,

  analyzeDish: async (text, imageFile) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const response = await api.post<Recipe>('/analyze-dish', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ currentRecipe: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
    }
  },

  fetchRecipe: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Recipe>(`/recipes/${id}`);
      set({ currentRecipe: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Recipe[]>('/recipes');
      set({ history: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
    }
  },

  deleteRecipe: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/recipes/${id}`);
      const { history, currentRecipe } = get();
      set({
        history: history.filter((r) => r?.id !== id),
        currentRecipe: currentRecipe?.id === id ? null : currentRecipe,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
    }
  },

  clearCurrent: () => {
    set({ currentRecipe: null });
  },
}));
