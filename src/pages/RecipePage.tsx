import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../telegram/useTelegram';
import { useRecipeStore } from '../store/useRecipeStore';
import { NutritionCircle } from '../components/NutritionCircle';
import { IngredientList } from '../components/IngredientList';
import { StepTimer } from '../components/StepTimer';
import { Loader } from '../components/Loader';
import { ErrorBanner } from '../components/ErrorBanner';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipeId = id;
  const { navigate } = useNavigate();
  const { currentRecipe, demoRecipe, isLoading, error } = useRecipeStore();
  const { hapticFeedback } = useTelegram();

  // Support demo mode
  const recipe = recipeId === 'demo' ? demoRecipe : (currentRecipe && currentRecipe.id === recipeId ? currentRecipe : null);

  const handleRegenerateImage = () => {
    hapticFeedback?.impactOccurred('light');
    alert('Перегенерация фото не реализована в демо');
  };

  const handleSave = () => {
    hapticFeedback?.impactOccurred('light');
    alert('Сохранение не реализовано в демо');
  };

  const handleShare = () => {
    hapticFeedback?.impactOccurred('light');
    alert('Поделиться не реализовано в демо');
  };

  if (isLoading && !recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader text="Повар колдует..." size="lg" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <EmptyState
          icon="📄"
          title="Рецепт не найден"
          description="Рецепт с таким ID не существует или был удален."
          actionLabel="Вернуться домой"
          onAction={() => { navigate('/'); }}
        />
      </div>
    );
  }

  const getCalorieColor = (calories: number) => {
    if (calories < 300) return '#4CAF50';
    if (calories < 600) return '#F7B801';
    if (calories < 900) return '#FF6B35';
    return '#E63946';
  };

  return (
    <div className="min-h-screen pb-24 safe-bottom">
      {/* Aero Glass Taskbar Header */}
      <header className="taskbar-style sticky top-0 z-50 px-4 py-3 safe-top">
        <div className="container-main flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="win95-raised px-3 py-1.5 text-sm font-medium rounded flex items-center gap-1"
            style={{ borderColor: '#FFF #808080 #808080 #FFF' }}
          >
            <span>←</span> Назад
          </button>
          <h1 className="text-display text-lg sm:text-xl whitespace-nowrap truncate max-w-[60%]">
            {recipe.название_блюда}
          </h1>
          <div className="flex items-center gap-2">
            {recipeId === 'demo' && (
              <span className="win95-inset px-2 py-1 text-xs font-medium rounded flex items-center gap-1">
                <span>🧪</span> ДЕМО
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container-main pt-6 pb-20">
        {/* Hero Section - Aero Glass Panel */}
        <div className="card-glass-elevated mb-6 animate-slide-up relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-hover/5 pointer-events-none" />
          <div className="relative p-6 sm:p-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-display text-3xl sm:text-4xl lg:text-5xl leading-tight text-text-primary mb-3"
            >
              {recipe.название_блюда} 🍽️
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-body text-text-muted text-lg max-w-2xl"
            >
              {recipe.описание}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-6 flex flex-wrap items-center gap-3 text-text-muted"
            >
              <span className="win95-raised px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                ⏱ {recipe.время_готовки_минут} мин
              </span>
              <span className="win95-raised px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                👥 {recipe.порций} порций
              </span>
              <span className="win95-raised px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                🍽 {recipe.сложность}
              </span>
              <span className="win95-raised px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                🌍 {recipe.кухня}
              </span>
            </motion.div>
            {/* Calorie badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-4"
            >
              <div className="glass-elevated rounded-card px-5 py-4 text-center animate-pulse-glow" style={{ background: `linear-gradient(180deg, ${getCalorieColor(recipe.пищевая_ценность?.калории_на_порцию ?? 0)}20, transparent)` }}>
                <p className="text-xs text-text-dim uppercase tracking-wider">КАЛОРИИ НА ПОРЦИЮ</p>
                <p
                  className="font-display font-bold text-3xl sm:text-4xl"
                  style={{ color: getCalorieColor(recipe.пищевая_ценность?.калории_на_порцию ?? 0) }}
                >
                  {recipe.пищевая_ценность?.калории_на_порцию ?? 0}
                </p>
                <p className="text-xs text-text-dim">ккал</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="card-glass mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative w-full h-56 sm:h-64 rounded-card overflow-hidden glass">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-hover/10" />
            <div className="absolute inset-0 flex items-center justify-center text-text-muted text-6xl">
              <span>🍽️</span>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleRegenerateImage}
              className="win95-raised px-4 py-2 text-sm font-medium rounded flex items-center gap-2"
              style={{ borderColor: '#FFF #808080 #808080 #FFF' }}
            >
              <span>🔄</span> Перегенерировать фото
            </button>
          </div>
        </div>

        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {/* Nutrition Circle */}
          <div className="card-glass animate-slide-up">
            <h2 className="text-headline text-xl mb-6 flex items-center gap-2"><span>📊</span> Калории и БЖУ</h2>
            <NutritionCircle
              nutrition={{
                белки_на_порцию_г: recipe.пищевая_ценность?.белки_на_порцию_г ?? 0,
                жиры_на_порцию_г: recipe.пищевая_ценность?.жиры_на_порцию_г ?? 0,
                углеводы_на_порцию_г: recipe.пищевая_ценность?.углеводы_на_порцию_г ?? 0,
                калории_на_порцию: recipe.пищевая_ценность?.калории_на_порцию ?? 0,
              }}
              totalNutrition={{
                белки_всего_г: recipe.пищевая_ценность?.белки_всего_г ?? 0,
                жиры_всего_г: recipe.пищевая_ценность?.жиры_всего_г ?? 0,
                углеводы_всего_г: recipe.пищевая_ценность?.углеводы_всего_г ?? 0,
                калории_всего: recipe.пищевая_ценность?.калории_всего ?? 0,
              }}
              perServing={true}
            />
          </div>

          {/* Ingredient List */}
          <div className="card-glass animate-slide-up" style={{ animationDelay: '50ms' }}>
            <h2 className="text-headline text-xl mb-6 flex items-center gap-2"><span>📁</span> Ингредиенты</h2>
            <IngredientList ingredients={recipe.ингредиенты} />
          </div>

          {/* Steps */}
          <div className="card-glass animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-headline text-xl mb-6 flex items-center gap-2"><span>⚙️</span> Пошаговая инструкция</h2>
            <div className="space-y-4">
              {recipe.шаги.map((step) => (
                <StepTimer
                  key={step.номер}
                  step={step}
                  isActive={false}
                  onComplete={() => {}}
                />
              ))}
            </div>
          </div>

          {/* Chef tip */}
          {recipe.совет_шефа && (
            <div className="card-glass border border-accent/30 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <h2 className="text-headline text-xl mb-3 flex items-center gap-2">
                <span className="text-2xl">👨‍🍳</span>
                Совет шефа
              </h2>
              <p className="text-body text-text-primary leading-relaxed">{recipe.совет_шефа}</p>
            </div>
          )}

          {/* Serving suggestion */}
          {recipe.рекомендация_подачи && (
            <div className="card-glass border border-button-gradientStart/30 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-headline text-xl mb-3 flex items-center gap-2">
                <span className="text-2xl">🍷</span>
                Рекомендация по подаче
              </h2>
              <p className="text-body text-text-primary leading-relaxed">{recipe.рекомендация_подачи}</p>
            </div>
          )}
        </div>

        {/* Bottom actions - Windows 7 Taskbar Style */}
        <div className="fixed bottom-0 left-0 right-0 safe-bottom taskbar-style px-4 py-3 z-40 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="container-main flex flex-col sm:flex-row sm:justify-between sm:space-x-3 gap-3">
            <button
              onClick={handleSave}
              className="win95-raised px-6 py-2.5 text-sm font-medium rounded flex items-center justify-center gap-2 flex-1"
              style={{ borderColor: '#FFF #808080 #808080 #FFF' }}
            >
              <span>💾</span> Сохранить
            </button>
            <button
              onClick={handleShare}
              className="win95-raised px-6 py-2.5 text-sm font-medium rounded flex items-center justify-center gap-2 flex-1"
              style={{ borderColor: '#FFF #808080 #808080 #FFF' }}
            >
              <span>📤</span> Поделиться
            </button>
            <button
              onClick={handleRegenerateImage}
              className="win95-raised px-6 py-2.5 text-sm font-medium rounded flex items-center justify-center gap-2 flex-1"
              style={{ borderColor: '#FFF #808080 #808080 #FFF' }}
            >
              <span>🔄</span> Перегенерировать фото
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipePage;
