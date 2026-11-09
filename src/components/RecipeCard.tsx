import React from 'react'
import { useTelegram } from '../telegram/useTelegram'
import { motion } from 'framer-motion'
import { Button } from './Button'

interface Recipe {
  id: number
  название_блюда: string
  время_готовки_минут: number
  пищевая_ценность: {
    калории_на_порцию: number
  }
  image_prompt?: string
}

interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
  onDelete?: () => void
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onClick,
  onDelete,
}) => {
  const { hapticFeedback } = useTelegram()

  const handleClick = () => {
    hapticFeedback?.impactOccurred('light')
    onClick?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    hapticFeedback?.impactOccurred('light')
    onDelete?.()
  }

  // Determine calorie color
  const getCalorieColor = (calories: number) => {
    if (calories < 300) return '#4CAF50'
    if (calories < 600) return '#F7B801'
    if (calories < 900) return '#FF6B35'
    return '#E63946'
  }

  const calories = recipe.пищевая_ценность?.калории_на_порцию ?? 0
  const cookTime = recipe.время_готовки_минут ?? 15

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-4 border border-surface/20 cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        <div className="w-full h-48 bg-surface/30 rounded-lg flex items-center justify-center">
          <div className="text-text-muted text-sm">
            Изображение блюда
          </div>
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-0.5"
            onClick={handleDelete}
          >
            ×
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-bold text-text">{recipe.название_блюда}</h3>
        <div className="flex text-text-xs text-text-muted">
          <span className="mr-4">
            🕒 {cookTime} мин
          </span>
          <span style={{ color: getCalorieColor(calories) }}>
            🔥 {calories} ккал/порция
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-surface/20 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
        >
          Посмотреть рецепт
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-text-muted hover:text-[#E63946]"
          >
            Удалить
          </Button>
        )}
      </div>
    </motion.div>
  )
}