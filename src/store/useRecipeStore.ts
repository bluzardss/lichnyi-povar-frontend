import { create } from 'zustand';
import { Recipe } from '../types/index';
import { apiClient } from '../api/client';

const STORAGE_KEY = 'saved_recipes';
const MAX_STORED_RECIPES = 10;

const loadFromStorage = (): Recipe[] => {
  try {
    const data = localStorage.getItem('saved_recipes');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (recipes: Recipe[]) => {
  try {
    localStorage.setItem('saved_recipes', JSON.stringify(recipes.slice(-MAX_STORED_RECIPES)));
  } catch {
    // ignore storage errors
  }
};

// Helper to save individual recipe by ID
const saveRecipeToStorage = (recipe: Recipe) => {
  try {
    localStorage.setItem(`recipe_${recipe.id}`, JSON.stringify(recipe));
  } catch {
    // ignore storage errors
  }
};

const loadRecipeFromStorage = (id: number): Recipe | null => {
  try {
    const data = localStorage.getItem(`recipe_${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

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
      const response = await apiClient.post<Recipe>('/api/recipes/analyze-dish', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newRecipe = response.data;
      set({ currentRecipe: newRecipe, isLoading: false });
      
      // Save to localStorage - both individual recipe by ID and history array
      saveRecipeToStorage(newRecipe);
      const stored = loadFromStorage();
      const updated = [...stored, newRecipe].slice(-MAX_STORED_RECIPES);
      saveToStorage(updated);
      set({ history: updated });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
    }
  },

  fetchRecipe: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Recipe>(`/api/recipes/${id}`);
      set({ currentRecipe: response.data, isLoading: false });
    } catch (err: any) {
      // Fallback to localStorage if API fails (e.g., 404)
      const cached = loadRecipeFromStorage(id);
      if (cached) {
        set({ currentRecipe: cached, isLoading: false });
      } else {
        // Fallback to old storage format
        const stored = loadFromStorage();
        const cachedOld = stored.find((r: Recipe) => r.id === id);
        if (cachedOld) {
          set({ currentRecipe: cachedOld, isLoading: false });
        } else {
          set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
        }
      }
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Recipe[]>('/api/recipes');
      if (response.data && response.data.length > 0) {
        set({ history: response.data, isLoading: false });
        saveToStorage(response.data);
      } else {
        // Fallback to localStorage if API returns empty
        const stored = loadFromStorage();
        set({ history: stored, isLoading: false });
      }
    } catch (err: any) {
      // Fallback to localStorage on error
      const stored = loadFromStorage();
      if (stored.length > 0) {
        set({ history: stored, isLoading: false });
      } else {
        set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
      }
    }
  },

  deleteRecipe: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/recipes/${id}`);
      const { history, currentRecipe } = get();
      set({
        history: history.filter((r) => r?.id !== id),
        currentRecipe: currentRecipe?.id === id ? null : currentRecipe,
        isLoading: false,
      });
      // Also remove from localStorage
      try {
        localStorage.removeItem(`recipe_${id}`);
      } catch {
        // ignore
      }
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Неизвестная ошибка', isLoading: false });
    }
  },

  clearCurrent: () => {
    set({ currentRecipe: null });
  },
}));
