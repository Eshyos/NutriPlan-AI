
import { GoogleGenAI, Type } from "@google/genai";
import { Meal, DayMenu, MenuPlan } from "../types";

export async function generateMenuPlan(
  meals: Meal[], 
  startDate: string, 
  days: number,
  history: MenuPlan[] = []
): Promise<DayMenu[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const lunchOptions = meals.filter(m => m.canBeLunch);
  const dinnerOptions = meals.filter(m => m.canBeDinner);

  if (lunchOptions.length === 0 || dinnerOptions.length === 0) {
    throw new Error("Faltan platos. Asegúrate de tener platos configurados para comida y cena.");
  }

  // Extraer los últimos platos usados para informar a la IA sobre la rotación
  const lastDishes = history
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3) // Tomar los últimos 3 planes
    .flatMap(p => p.plan)
    .flatMap(d => [d.lunch.name, d.dinner.name]);

  const historyContext = lastDishes.length > 0 
    ? `HISTORIAL RECIENTE (Intenta NO repetir estos platos a menos que sea estrictamente necesario para la variedad):
       ${Array.from(new Set(lastDishes)).join(', ')}` 
    : 'No hay historial previo. Empieza una rotación nueva.';

  const prompt = `
    Eres un experto nutricionista. Tu objetivo es crear un menú saludable y equilibrado de ${days} días empezando el ${startDate}.
    
    ${historyContext}

    REGLA CRÍTICA DE DISPONIBILIDAD:
    - Solo puedes usar para LUNCH los platos de la lista de COMIDAS.
    - Solo puedes usar para DINNER los platos de la lista de CENAS.

    LISTA DE COMIDAS DISPONIBLES (LUNCH):
    ${lunchOptions.map(m => `- ${m.name} [ID: ${m.id}]`).join('\n')}
    
    LISTA DE CENAS DISPONIBLES (DINNER):
    ${dinnerOptions.map(m => `- ${m.name} [ID: ${m.id}]`).join('\n')}
    
    INSTRUCCIONES DE DISEÑO:
    1. Equilibrio: Alterna proteínas (pescado, carne, legumbres) y tipos de platos (pasta, arroz, verdura).
    2. Rotación: Da prioridad a los platos que NO están en el historial reciente.
    3. Formato: Devuelve un ARRAY JSON con objetos { date, lunchId, dinnerId }.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              lunchId: { type: Type.STRING },
              dinnerId: { type: Type.STRING }
            },
            required: ["date", "lunchId", "dinnerId"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((item: any) => {
      let lunchMeal = meals.find(m => m.id === item.lunchId);
      if (!lunchMeal || !lunchMeal.canBeLunch) {
        lunchMeal = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
      }

      let dinnerMeal = meals.find(m => m.id === item.dinnerId);
      if (!dinnerMeal || !dinnerMeal.canBeDinner) {
        dinnerMeal = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
      }

      return {
        date: item.date,
        lunch: lunchMeal,
        dinner: dinnerMeal
      };
    });
  } catch (error) {
    console.error("Error generating menu:", error);
    const plan: DayMenu[] = [];
    const start = new Date(startDate);
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      plan.push({
        date: d.toISOString().split('T')[0],
        lunch: lunchOptions[i % lunchOptions.length],
        dinner: dinnerOptions[i % dinnerOptions.length]
      });
    }
    return plan;
  }
}
