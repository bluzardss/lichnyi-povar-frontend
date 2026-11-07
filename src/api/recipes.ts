import { useApi } from './client';
import { useCallback } from 'react';
import { Recipe } from '../types/index';

/**
 * Хук для работы с рецептами через API.
 * Возвращает набор асинхронных функций для анализа блюда, получения рецепта,
 * получения истории и удаления рецепта.
 */
export const useRecipes = () => {
  const api = useApi();

  const analyzeDish = useCallback(async (text: string, imageFile?: File): Promise<Recipe> => {
    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await api.post<Recipe>('/analyze-dish', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }, [api]);

  const getRecipe = useCallback(async (id: number): Promise<Recipe> => {
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  }, [api]);

  const getHistory = useCallback(async (): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>('/recipes');
    return response.data;
  }, [api]);

  const deleteRecipe = useCallback(async (id: number): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  }, [api]);

  return { analyzeDish, getRecipe, getHistory, deleteRecipe };
};
