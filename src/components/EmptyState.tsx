import React from 'react';

/**
 * Компонент заглушки для отображения пустых состояний.
 * Используется в истории, при ошибках и т.д.
 * @param icon      - Эмодзи или класс иконки (строка)
 * @param title     - Заголовок
 * @param description - Описание
 * @param actionLabel - Текст кнопки действия (опционально)
 * @param onAction   - Обработчик нажатия на кнопку действия (опционально)
 * @param className  - Дополнительные классы для контейнера (опционально)
 */
interface EmptyStateProps {
  icon: string; // emoji or icon class
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 ${className}`}>
      {/* Иконка или эмодзи */}
      <div className="text-6xl mb-4">
        {icon}
      </div>

      {/* Заголовок */}
      <h3 className="font-bold text-text text-xl mb-2">
        {title}
      </h3>

      {/* Описание */}
      <p className="text-text-muted max-w-xl">
        {description}
      </p>

      {/* Кнопка действия (если предоставлены label и обработчик) */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
