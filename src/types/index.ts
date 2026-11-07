// Типы для рецепта и связанных сущностей

export interface Ingredient {
  название: string;
  количество: string; // Например, "200 г", "2 шт."
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

export interface Step {
  номер: number;
  текст: string;
  длительность_секунд: number;
  подсказка?: string;
}

export interface NutritionValue {
  калории_всего: number;
  калории_на_порцию: number;
  белки_всего_г: number;
  жиры_всего_г: number;
  углеводы_всего_г: number;
  белки_на_порцию_г: number;
  жиры_на_порцию_г: number;
  углеводы_на_порцию_г: number;
  процент_белков: number;
  процент_жиров: number;
  процент_углеводов: number;
  теги: string[]; // Например, ["низкокалорийное", "высокобелковое", "пп"]
}

export interface Recipe {
  название_блюда: string;
  описание: string;
  время_готовки_минут: number;
  сложность: string;
  порций: number;
  кухня: string;
  ингредиенты: Ingredient[];
  шаги: Step[];
  пищевая_ценность: NutritionValue;
  совет_шефа: string;
  рекомендация_подачи: string;
  image_prompt: string; // На английском для генерации изображения
}

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

// Общий тип для ответов API
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
