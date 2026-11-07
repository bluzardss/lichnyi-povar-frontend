import React, { useState, useEffect } from 'react';
import { useTelegram } from '../telegram/useTelegram';
import { useRecipeStore } from '../store/useRecipeStore';
import { useNavigate } from 'react-router-dom';
import { PhotoUpload } from '../components/PhotoUpload';
import { TextInput } from '../components/TextInput';
import { Chip } from '../components/Chip';
import { RecipeCard } from '../components/RecipeCard';
import { Loader } from '../components/Loader';
import { ErrorBanner } from '../components/ErrorBanner';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';

const MainPage: React.FC = () => {
  const { user } = useTelegram();
  const { currentRecipe, history, isLoading, error, analyzeDish, fetchHistory, clearCurrent, setDemoRecipe } = useRecipeStore();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const demoRecipe = {
    id: 'demo',
    название_блюда: 'Идеальная паста Карбонара',
    описание: 'Классическая итальянская паста с нежным соусом из яиц, пармезана, гуанчиале и черного перца. Без сливок — только техника и качественные ингредиенты.',
    время_готовки_минут: 25,
    сложность: 'Средняя',
    порций: 2,
    кухня: 'Итальянская',
    ингредиенты: [
      { название: 'Спагетти', количество: '200 г', обязательный: true, калории_на_100г: 131, белки_на_100г: 5, жиры_на_100г: 1.5, углеводы_на_100г: 25, калории_итого: 262, белки_итого_г: 10, жиры_итого_г: 3, углеводы_итого_г: 50 },
      { название: 'Гуанчиале', количество: '100 г', обязательный: true, калории_на_100г: 400, белки_на_100г: 15, жиры_на_100г: 35, углеводы_на_100г: 0, калории_итого: 400, белки_итого_г: 15, жиры_итого_г: 35, углеводы_итого_г: 0 },
      { название: 'Яйца (желтки)', количество: '4 шт.', обязательный: true, калории_на_100г: 322, белки_на_100г: 16, жиры_на_100г: 28, углеводы_на_100г: 1, калории_итого: 258, белки_итого_г: 13, жиры_итого_г: 22, углеводы_итого_г: 1 },
      { название: 'Пармезан', количество: '50 г', обязательный: true, калории_на_100г: 392, белки_на_100г: 38, жиры_на_100г: 25, углеводы_на_100г: 0, калории_итого: 196, белки_итого_г: 19, жиры_итого_г: 12.5, углеводы_итого_г: 0 },
      { название: 'Черный перец', количество: 'по вкусу', обязательный: true, калории_на_100г: 251, белки_на_100г: 10, жиры_на_100г: 3, углеводы_на_100г: 64, калории_итого: 5, белки_итого_г: 0.2, жиры_итого_г: 0.1, углеводы_итого_г: 1.3 },
    ],
    шаги: [
      { номер: 1, текст: 'Нарежьте гуанчиале кубиками 1х1 см. Обжарьте до хрустящей корочки (5-7 мин).', длительность_секунд: 420, подсказка: 'Не добавляйте масло — гуанчиале сам даст достаточно жира' },
      { номер: 2, текст: 'Взбейте яйца с тертым пармезаном до однородной массы. Добавьте черный перец.', длительность_секунд: 120, подсказка: 'Только желтки для более густого соуса' },
      { номер: 3, текст: 'Варите спагетти на 1-2 мин меньше, чем на пачке. Заберите 150 мл пастой воды.', длительность_секунд: 600, подсказка: 'Паста должна быть аль денте' },
      { номер: 4, текст: 'Переложите пасту к гуанчиале. Добавьте 50 мл пастой воды и быстро перемешайте. Снимите с огня!', длительность_секунд: 60, подсказка: 'Сковорода горячая, но не на огне — яйца не сварятся' },
      { номер: 5, текст: 'Влейте яйчно-сырную смесь, интенсивно перемешивая. Добавьте пастой воду для консистенции.', длительность_секунд: 120, подсказка: 'Движения быстрые — соус станет глянцевым' },
      { номер: 6, текст: 'Выложите на тарелки, посыпьте пармезаном и перцем. Подавайте сразу!', длительность_секунд: 30, подсказка: 'Карбонара не терпит ожидания' },
    ],
    совет_шефа: 'Главный секрет — не перегреть яйца. Сковорода снята с огня перед добавлением яичной смеси.',
    рекомендация_подачи: 'Подавайте на разогретых тарелках, посыпав пармезаном и перцем. Идеально — белое вино.',
    image_prompt: 'Perfect Italian pasta carbonara, creamy glossy sauce, professional food photography',
    пищевая_ценность: { калории_всего: 1121, калории_на_порцию: 560, белки_всего_г: 38, жиры_всего_г: 42, углеводы_всего_г: 115, белки_на_порцию_г: 19, жиры_на_порцию_г: 21, углеводы_на_порцию_г: 57.5, процент_белков: 14, процент_жиров: 34, процент_углеводов: 52, теги: ['высокобелковое'] },
  };

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleImageChange = (file: File) => setSelectedImage(file);
  const handleAnalyze = async (text: string) => { if (!text.trim() && !selectedImage) return; await analyzeDish(text, selectedImage ?? undefined); setSelectedImage(null); if (currentRecipe && currentRecipe.id !== 'demo') { navigate(`/recipe/${currentRecipe.id}`); } };
  const handleDemoMode = () => { setDemoRecipe(demoRecipe); navigate('/recipe/demo'); };
  const handleChipClick = (label: string) => handleAnalyze(label);

  if (isLoading) { return <div className="flex flex-col items-center justify-center min-h-[60vh]"><Loader text="Повар колдует..." size="lg" /></div>; }
  if (error) { return <div className="flex flex-col items-center justify-center py-12"><ErrorBanner message={error} onRetry={() => {}} onClose={() => {}} /></div>; }

  return (
    <div className="min-h-screen pb-24 safe-bottom">
      {/* Aero Glass Taskbar Header */}
      <header className="taskbar-style sticky top-0 z-50 px-4 py-3 safe-top">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖥️</span>
            <h1 className="text-display text-xl sm:text-2xl whitespace-nowrap">Личный Повар</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-text-dim text-xs px-2 py-1 win95-inset rounded">💾 Сохранено: {history.length}</span>
            <button onClick={handleDemoMode} className="win95-raised px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1">
              <span>🧪</span> Демо
            </button>
          </div>
        </div>
      </header>

      <main className="container-main pt-6 pb-8">
        {/* Welcome Panel */}
        <div className="card-glass mb-6 animate-slide-up">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-headline text-2xl sm:text-3xl">Что готовим сегодня? ☕</h2>
              <p className="text-body text-text-muted mt-1">Твой персональный шеф-повар с ИИ — фото или текст, и рецепт готов</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2">
              <div className="win95-inset px-3 py-2 rounded text-xs text-text-dim">📁 История: {history.length} рецептов</div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Win95 Style Buttons */}
        <div className="card-glass mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <h3 className="text-headline text-lg mb-4 flex items-center gap-2"><span>📁</span> Быстрые запросы</h3>
          <div className="flex flex-wrap gap-2">
            {['🍳 Завтрак', '🥗 ПП-блюдо', '⚡ До 30 мин', '🍽️ Из того, что есть', '🍷 Ужин на двоих', '🍰 Десерт'].map((label, i) => (
              <button
                key={label}
                onClick={() => handleAnalyze(label.replace(/^[^\s]+\s/, ''))}
                className="win95-raised px-4 py-2 text-sm font-medium rounded transition-all duration-150 hover:bg-white/30 active:scale-[0.98]"
                style={{ borderColor: '#FFF #808080 #808080 #FFF' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="card-glass mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-headline text-lg mb-4 flex items-center gap-2"><span>📸</span> Фото блюда</h3>
          <PhotoUpload onImageReady={(file) => setSelectedImage(file)} />
        </div>

        {/* Text Input */}
        <div className="card-glass mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-headline text-lg mb-4 flex items-center gap-2"><span>⌨️</span> Текст запроса</h3>
          <TextInput onSend={handleAnalyze} />
        </div>

        {/* Generate Button */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => { if (selectedImage || true) { handleAnalyze('Приготовь пасту карбонара'); } }}
            disabled={isLoading}
            className="w-full max-w-lg mx-auto btn-glass text-lg py-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
                <span>Генерирую...</span>
              </span>
            ) : (
              <>
                <span>✨ Сгенерировать рецепт</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <section className="mt-10 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-headline text-xl">Последние рецепты 📁</h2>
              <span className="win95-inset px-2 py-1 text-xs text-text-dim">{history.length} всего</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {history.slice(0, 6).map((recipe, i) => (
                <div key={recipe.id} style={{ animationDelay: `${300 + i * 50}ms` }}>
                  <RecipeCard recipe={recipe} onClick={() => navigate(`/recipe/${recipe.id}`)} onDelete={() => {}} />
                </div>
              ))}
            </div>
          </section>
        )}

        {history.length === 0 && (
          <div className="mt-10 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <EmptyState
              icon="🍳"
              title="Твоя кулинарная книга пуста"
              description="Сгенерируй первый рецепт — и он появится здесь. История сохраняется автоматически."
              actionLabel="💾 Сгенерировать первый рецепт"
              onAction={() => handleAnalyze('Приготовь что-нибудь вкусное')}
            />
          </div>
        )}

        {/* Status Bar - Windows 95 Style */}
        <div className="fixed bottom-0 left-0 right-0 taskbar-style px-4 py-2 safe-bottom z-40">
          <div className="container-main flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-text-dim">
              <span className="win95-inset px-2 py-0.5">🖥️ Личный Повар v1.0</span>
              <span className="win95-inset px-2 py-0.5">💾 Готов</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-dim">
              <span className="win95-inset px-2 py-0.5">☕ Ожидание ввода...</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
