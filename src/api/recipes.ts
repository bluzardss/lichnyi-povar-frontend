import { apiClient } from './client'
import { useCallback } from 'react'
import { Recipe } from '../types/index'

/**
 * Хук для работы с рецептами через API.
 * Возвращает набор асинхронных функций для анализа блюда, получения рецепта,
 * получения истории и удаления рецепта.
 */
export const useRecipes = () => {
  const analyzeDish = useCallback(async (text: string, imageFile?: File): Promise<Recipe> => {
    const formData = new FormData()
    formData.append('text', text)
    if (imageFile) {
      formData.append('image', imageFile)
    }
    const response = await apiClient.post<Recipe>('/api/recipes/analyze-dish', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }, [])

  const getRecipe = useCallback(async (id: number): Promise<Recipe> => {
    const response = await apiClient.get<Recipe>(`/api/recipes/${id}`)
    return response.data
  }, [])

  const getHistory = useCallback(async (): Promise<Recipe[]> => {
    const response = await apiClient.get<Recipe[]>('/api/recipes')
    return response.data
  }, [])

  const deleteRecipe = useCallback(async (id: number): Promise<void> => {
    await apiClient.delete(`/api/recipes/${id}`)
  }, [])

  return { analyzeDish, getRecipe, getHistory, deleteRecipe }
}