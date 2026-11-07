import React, { useState } from 'react';
import { useTelegram } from '../telegram/useTelegram';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface Ingredient {
  название: string;
  количество: string;
  обязательный: boolean;
  калории_на_100г: number;
  белки_на_100г: number;
  жиры_на_100г: number;
  углеводы_на_100г: number;
  калории_итого: number;
  белки_итого_г: number;
  жиры_итого_г: number;
  углеводы_итого_г: number;
}

interface IngredientListProps {
  ingredients: Ingredient[];
  onCopyShoppingList?: () => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onCopyShoppingList,
}) => {
  const { hapticFeedback } = useTelegram();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Initialize checkedItems array with false for each ingredient
  React.useEffect(() => {
    setCheckedItems(Array(ingredients.length).fill(false));
  }, [ingredients.length]);

  const toggleCheck = (index: number) => {
    hapticFeedback?.impactOccurred('light');
    setCheckedItems((prev) => {
      const newPrev = [...prev];
      newPrev[index] = !newPrev[index];
      return newPrev;
    });
  };

  const handleCopy = () => {
    hapticFeedback?.impactOccurred('light');
    const shoppingList = ingredients
      .filter((_, index) => checkedItems[index])
      .map((ing) => `${ing.название}: ${ing.количество}`)
      .join('\n');
    navigator.clipboard.writeText(shoppingList).then(() => {
      // Optionally show a toast or feedback
      alert('Список покупок скопирован в буфер обмена');
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-text">Ингредиенты</h3>
        {ingredients.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!checkedItems.some((checked) => checked)}
          >
            Скопировать список покупок
          </Button>
        )}
      </div>

      {ingredients.map((ing, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start space-x-3 py-2 border-b border-surface/20 last:border-b-0"
        >
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <input
              type="checkbox"
              checked={checkedItems[index]}
              onChange={() => toggleCheck(index)}
              className="h-4 w-4 text-primary rounded border-gray-600"
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between w-full">
              <span className={`font-medium ${
                checkedItems[index] ? 'line-through text-text-muted' : 'text-text'
              }`}>
                {ing.название}
              </span>
              <span className={`text-text-xs ${
                checkedItems[index] ? 'text-text-muted' : 'text-text'
              }`}>
                {ing.количество}
              </span>
            </div>
            <div className="flex text-text-xs text-text-muted">
              {ing.calories_итого.toFixed(0)} ккал
              {ing.белки_итого_г.toFixed(1)}г б | {ing.жиры_итого_г.toFixed(1)}г ж | {ing.углеводы_итого_г.toFixed(1)}г у
            </div>
            {ing.обязательный && (
              <span className="mt-1 text-xs text-primary">Обязательный</span>
            )}
          </div>
        </motion.div>
      ))}

      {ingredients.length === 0 && (
        <div className="text-text-muted text-center py-4">
          Нет данных об ингредиентах
        </div>
      )}
    </motion.div>
  );
};
