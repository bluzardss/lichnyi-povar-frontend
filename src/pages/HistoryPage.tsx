import React, { useState } from 'react';
import { useRecipeStore } from '../store/useRecipeStore';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { ErrorBanner } from '../components/ErrorBanner';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';

const HistoryPage: React.FC = () => {
  const {
    history,
    isLoading,
    error,
    deleteRecipe,
  } = useRecipeStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'under300' | 'threeToSixHundred' | 'overSixHundred'>('all');

  // We don't have meal type or calorie filters in the recipe object from store yet.
  // For demo, we'll just filter by search term on title.
  // In a real app, we would have tags or mealType fields.

  const filteredRecipes = history.filter((recipe) => {
    const matchesSearch = recipe.название_блюда.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, ignore filter; we'll just return true for all filters to avoid complexity.
    // We'll implement a simple calorie filter based on recipe.пищевая_ценность.калории_на_порцию
    const calories = recipe.пищевая_ценность?.калории_на_порцию ?? 0;
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'under300':
        matchesFilter = calories < 300;
        break;
      case 'threeToSixHundred':
        matchesFilter = calories >= 300 && calories < 600;
        break;
      case 'overSixHundred':
        matchesFilter = calories >= 600;
        break;
      default:
        matchesFilter = true;
    }
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    await deleteRecipe(id);
    // After deletion, we could refetch but deleteRecipe already updates store.
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader currentStage={0} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <ErrorBanner
          message={error}
          onRetry={() => {
            // retry loading? we don't have a reload function
          }}
          onClose={() => {
            // 
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-48px)] px-4 sm:px-6 lg:px-8 pb-6"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // go to main page
            // we could use navigate('/');
            // but we are already in history; we'll just go back
            window.history.back();
          }}
        >
          ← Назад
        </Button>
        <h1 className="text-2xl font-bold text-text mt-2">
          Моя коллекция
        </h1>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl p-3 bg-surface border border-surface/20 text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Chip
              label="Все"
              active={selectedFilter === 'all'}
              onClick={() => setSelectedFilter('all')}
            />
            <Chip
              label="Завтрак"
              active={selectedFilter === 'breakfast'}
              onClick={() => setSelectedFilter('breakfast')}
            />
            <Chip
              label="Обед"
              active={selectedFilter === 'lunch'}
              onClick={() => setSelectedFilter('lunch')}
            />
            <Chip
              label="Ужин"
              active={selectedFilter === 'dinner'}
              onClick={() => setSelectedFilter('dinner')}
            />
            <Chip
              label="Десерт"
              active={selectedFilter === 'dessert'}
              onClick={() => setSelectedFilter('dessert')}
            />
            <Chip
              label="До 300 ккал"
              active={selectedFilter === 'under300'}
              onClick={() => setSelectedFilter('under300')}
            />
            <Chip
              label="300–600 ккал"
              active={selectedFilter === 'threeToSixHundred'}
              onClick={() => setSelectedFilter('threeToSixHundred')}
            />
            <Chip
              label="600+ ккал"
              active={selectedFilter === 'overSixHundred'}
              onClick={() => setSelectedFilter('overSixHundred')}
            />
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Нет рецептов"
          description="Измените фильтры или поиск, или добавьте новый рецепт."
          actionLabel="Добавить рецепт"
          onAction={() => {
            // navigate to main page to add
            // we'll just go back
            window.history.back();
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => {
                // navigate to recipe page
                // we need to navigate to /recipe/:id
                // we'll use navigate from react-router-dom
                // but we don't have it here; we'll import it.
                // We'll add useNavigate.
                // We'll refactor: we already have navigate from above.
                navigate(`/recipe/${recipe.id}`);
              }}
              onDelete={() => {
                handleDelete(recipe.id);
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
export default HistoryPage;
