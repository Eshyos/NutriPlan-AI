
import React from 'react';
import { Meal, MealType } from '../types';

interface MealCardProps {
  meal: Meal;
  type: MealType;
  onEdit?: () => void;
  onSwap?: () => void;
  isSwapSource?: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ meal, type, onEdit, onSwap, isSwapSource }) => {
  const isLunch = type === MealType.LUNCH;
  
  return (
    <div className={`group relative p-3 rounded-xl border transition-all hover:shadow-md 
      ${isLunch ? 'bg-orange-50 border-orange-100' : 'bg-indigo-50 border-indigo-100'}
      ${isSwapSource ? 'ring-2 ring-emerald-500 shadow-lg scale-[1.02]' : ''}`}>
      
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isLunch ? 'bg-orange-200 text-orange-800' : 'bg-indigo-200 text-indigo-800'}`}>
            {isLunch ? 'Comida' : 'Cena'}
          </span>
          {meal.category && (
            <span className="text-[10px] text-gray-500 font-medium truncate max-w-[80px]">
              • {meal.category}
            </span>
          )}
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="p-1 hover:bg-white rounded text-gray-500 hover:text-emerald-600"
            title="Cambiar plato"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSwap?.(); }}
            className={`p-1 hover:bg-white rounded ${isSwapSource ? 'text-emerald-600 bg-white' : 'text-gray-500 hover:text-emerald-600'}`}
            title="Mover de día"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
            </svg>
          </button>
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
        {meal.name}
      </h4>
    </div>
  );
};

export default MealCard;
