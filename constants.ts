
import { Meal } from './types';

// Default sample data inspired by typical Spanish meal lists
export const DEFAULT_MEALS: Meal[] = [
  // LUNCHES (Comidas)
  // Fix: Replaced 'type' property with 'canBeLunch' and 'canBeDinner' to match the Meal interface
  { id: '1', name: 'Lentejas con verduras', canBeLunch: true, canBeDinner: false, category: 'legumbres' },
  { id: '2', name: 'Paella de marisco', canBeLunch: true, canBeDinner: false, category: 'arroz' },
  { id: '3', name: 'Pasta boloñesa', canBeLunch: true, canBeDinner: false, category: 'pasta' },
  { id: '4', name: 'Pollo al horno con patatas', canBeLunch: true, canBeDinner: false, category: 'carne' },
  { id: '5', name: 'Garbanzos salteados', canBeLunch: true, canBeDinner: false, category: 'legumbres' },
  { id: '6', name: 'Filete de ternera con ensalada', canBeLunch: true, canBeDinner: false, category: 'carne' },
  { id: '7', name: 'Salmón a la plancha con espárragos', canBeLunch: true, canBeDinner: false, category: 'pescado' },
  { id: '8', name: 'Cocido madrileño', canBeLunch: true, canBeDinner: false, category: 'legumbres' },
  { id: '9', name: 'Risotto de setas', canBeLunch: true, canBeDinner: false, category: 'arroz' },
  { id: '10', name: 'Canelones de carne', canBeLunch: true, canBeDinner: false, category: 'pasta' },
  
  // DINNERS (Cenas)
  // Fix: Replaced 'type' property with 'canBeLunch' and 'canBeDinner' to match the Meal interface
  { id: '101', name: 'Tortilla de patatas', canBeLunch: false, canBeDinner: true, category: 'huevos' },
  { id: '102', name: 'Sopa de picadillo', canBeLunch: false, canBeDinner: true, category: 'sopa' },
  { id: '103', name: 'Ensalada César', canBeLunch: false, canBeDinner: true, category: 'ensalada' },
  { id: '104', name: 'Pescado blanco al vapor', canBeLunch: false, canBeDinner: true, category: 'pescado' },
  { id: '105', name: 'Sandwich mixto vegetal', canBeLunch: false, canBeDinner: true, category: 'ligero' },
  { id: '106', name: 'Verduras al wok', canBeLunch: false, canBeDinner: true, category: 'verdura' },
  { id: '107', name: 'Huevos pasados por agua', canBeLunch: false, canBeDinner: true, category: 'huevos' },
  { id: '108', name: 'Crema de calabacín', canBeLunch: false, canBeDinner: true, category: 'verdura' },
  { id: '109', name: 'Pizza artesana', canBeLunch: false, canBeDinner: true, category: 'ligero' },
  { id: '110', name: 'Brochetas de pavo', canBeLunch: false, canBeDinner: true, category: 'carne' }
];
