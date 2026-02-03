
export enum MealType {
  LUNCH = 'comida',
  DINNER = 'cena'
}

export interface Meal {
  id: string;
  name: string;
  canBeLunch: boolean;
  canBeDinner: boolean;
  category?: string;
  isSaturdayOnly?: boolean;
  isSundayOnly?: boolean;
}

export interface DayMenu {
  date: string; // ISO string
  lunch: Meal;
  dinner: Meal;
}

export interface MenuPlan {
  id: string;
  name: string;
  createdAt: string;
  startDate: string;
  days: number;
  plan: DayMenu[];
  origin?: 'local' | 'cloud'; // Indica dónde está guardado
}

export interface MealStats {
  name: string;
  count: number;
}
