import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTelegram } from '../telegram/useTelegram';
import { motion, useTransform } from 'framer-motion';
import { format } from 'date-fns';

type NutritionData = {
  name: string;
  value: number;
  color: string;
};

interface NutritionCircleProps {
  nutrition: {
    белки_на_порцию_г: number;
    жиры_на_порцию_г: number;
    углеводы_на_порцию_г: number;
    калории_на_порцию: number;
  } | null;
  totalNutrition?: {
    белки_всего_г: number;
    жиры_всего_г: number;
    углеводы_всего_г: number;
    калории_всего: number;
  };
  perServing: boolean; // true - на порцию, false - на всё блюдо
}

export const NutritionCircle: React.FC<NutritionCircleProps> = ({
  nutrition,
  totalNutrition,
  perServing = true,
}) => {
  const { hapticFeedback } = useTelegram();

  // Determine which data to show
  const dataSource = perServing ? nutrition : totalNutrition;

  if (!dataSource) {
    return <div className="text-text-muted">Нет данных о пищевой ценности</div>;
  }

  // Calculate calories per serving or total
  const calories = perServing
    ? dataSource.калории_на_порцию
    : dataSource.калории_всего;

  // Determine color based on calories
  let calorieColor = '#4CAF50'; // green <300
  if (calories >= 300 && calories < 600) calorieColor = '#F7B801'; // yellow
  else if (calories >= 600 && calories < 900) calorieColor = '#FF6B35'; // orange
  else calorieColor = '#E63946'; // red >900

  // Prepare data for Pie chart
  const pieData: NutritionData[] = [
    { name: 'Белки', value: dataSource.белки_на_порцию_г || 0, color: '#FF6B35' },
    { name: 'Жиры', value: dataSource.жиры_на_порцию_г || 0, color: '#F7B801' },
    { name: 'Углеводы', value: dataSource.углеводы_на_порцию_г || 0, color: '#2EC4B6' },
  ];

  // Animation for the calorie number
  const calorieVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Toggle between per serving and total
  const handleToggle = () => {
    hapticFeedback?.impactOccurred('light');
    // In a real app, we would toggle a state passed from parent via callback
    // For this component, we assume the parent controls perServing prop
    // So we just emit an event or call a callback if provided via context.
    // We'll leave it as a comment; the parent should handle the toggle.
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
            perServing
              ? 'bg-[#FF6B35]/20 text-[#FF6B35] hover:bg-[#FF6B35]/30'
              : 'bg-[#242428]/20 text-[#FFFFFF] hover:bg-[#242428]/30'
          }`}
        >
          На порцию
        </button>
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
            !perServing
              ? 'bg-[#FF6B35]/20 text-[#FF6B35] hover:bg-[#FF6B35]/30'
              : 'bg-[#242428]/20 text-[#FFFFFF] hover:bg-[#242428]/30'
          }`}
        >
          На всё блюдо
        </button>
      </div>

      <div className="relative">
        {/* Pie Chart */}
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx={90}
              cy={90}
              innerRadius={60}
              outerRadius={80}
              labelLine={false}
              label={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value} г`}
              contentStyle={{ backgroundColor: '#242428', color: '#FFFFFF', padding: '6px 8px', borderRadius: '4px' }}
              wrapperStyle={{ pointerEvents: 'none' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ cursor: 'default' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Calorie count in the center */}
        <motion.div
          variants={calorieVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className={`text-3xl font-bold tracking-tight`} style={{ color: calorieColor }}>
            {Math.round(calories)} ккал
          </div>
          <div className="text-text-muted text-sm">калорий</div>
        </motion.div>
      </div>

      {/* Macronutrients breakdown */}
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {pieData.map((item) => (
          <span
            key={item.name}
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              item.value > 0
                ? 'bg-[var(--bg-surface, #242428)]/30 text-text'
                : 'bg-transparent text-text-muted'
            }`}
          >
            {item.name}: {Math.round(item.value)} г
          </span>
        ))}
      </div>
    </div>
  );
};
