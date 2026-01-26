
import { Meal, MenuPlan } from '../types';

const BASE_URL = 'https://docs.google.com/spreadsheets/d/1h1rVJVcTHmGFropcEI9whfkFxttVwe_wwL_FW7V_ITU/export?format=csv';

/**
 * Procesa un texto CSV completo respetando saltos de línea dentro de comillas.
 * Es vital para leer JSON guardado en celdas de Excel.
 */
function parseFullCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;
  
  // Detectar delimitador (punto y coma o coma) basándose en la primera línea física
  const physicalLines = text.split(/\r?\n/);
  const firstLine = physicalLines[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ';' : ',';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cur += '"';
        i++; // Saltar escape ""
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(cur.trim());
      cur = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(cur.trim());
      if (row.length > 0 && row.some(cell => cell !== '')) {
        result.push(row);
      }
      row = [];
      cur = '';
    } else {
      cur += char;
    }
  }
  
  // Procesar última celda/fila si el texto no termina en salto de línea
  if (cur !== '' || row.length > 0) {
    row.push(cur.trim());
    if (row.some(cell => cell !== '')) {
      result.push(row);
    }
  }

  return result;
}

async function fetchFromGid(gid: string): Promise<string[][]> {
  const url = `${BASE_URL}&gid=${gid}&t=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Error ${response.status}: No se pudo acceder a la pestaña ${gid}.`);
  const csvText = await response.text();
  return parseFullCSV(csvText);
}

export async function fetchMealsFromMultipleSheets(lunchGid: string, dinnerGid: string): Promise<Meal[]> {
  try {
    const mealMap: Map<string, Meal> = new Map();

    const processRows = (rows: string[][], isLunch: boolean) => {
      if (rows.length === 0) return;
      
      const headers = rows[0].map(h => h.toLowerCase().trim());
      // Detectar columna de nombre
      const nameIdx = headers.findIndex(h => 
        h.includes('plato') || h.includes('nombre') || h.includes('comida') || 
        h.includes('cena') || h.includes('listado') || h.includes('receta')
      );
      
      const finalNameIdx = nameIdx !== -1 ? nameIdx : 0;
      const catIdx = headers.findIndex(h => h.includes('categor') || h.includes('tipo') || h.includes('grupo'));

      // Si la primera fila parece ser un plato y no una cabecera, empezamos desde 0
      const startIdx = (nameIdx === -1 && rows[0][0] && rows[0][0].length > 3) ? 0 : 1;

      for (let i = startIdx; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length <= finalNameIdx) continue;
        
        const rawName = row[finalNameIdx];
        if (!rawName || rawName.trim() === '' || rawName.toLowerCase() === 'nombre' || rawName.toLowerCase() === 'plato') continue;
        
        const name = rawName.trim();
        const key = name.toLowerCase();
        
        const existing = mealMap.get(key);
        if (existing) {
          if (isLunch) existing.canBeLunch = true;
          else existing.canBeDinner = true;
        } else {
          mealMap.set(key, {
            id: `${isLunch ? 'l' : 'd'}-${i}`,
            name: name,
            canBeLunch: isLunch,
            canBeDinner: !isLunch,
            category: catIdx !== -1 && row[catIdx] ? row[catIdx] : 'General'
          });
        }
      }
    };

    if (lunchGid && lunchGid.trim() !== '') {
      const lunchRows = await fetchFromGid(lunchGid);
      processRows(lunchRows, true);
    }

    if (dinnerGid && dinnerGid.trim() !== '') {
      const dinnerRows = await fetchFromGid(dinnerGid);
      processRows(dinnerRows, false);
    }

    return Array.from(mealMap.values());
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
}

export async function fetchSavedPlansFromSheet(gid: string): Promise<MenuPlan[]> {
  if (!gid || gid.trim() === '') return [];
  try {
    const rows = await fetchFromGid(gid);
    if (rows.length === 0) return [];
    
    // Verificamos si la primera fila ya contiene un JSON (es decir, no hay cabecera)
    const firstRowHasJson = rows[0].some(cell => {
      const c = cell.trim();
      return c.startsWith('{') && c.endsWith('}');
    });

    const dataRows = firstRowHasJson ? rows : rows.slice(1);
    
    return dataRows.map((row, index) => {
      try {
        // Buscamos la celda que contenga el objeto JSON del plan
        const planStr = row.find(cell => {
          const c = cell.trim();
          return c.startsWith('{') && c.endsWith('}');
        });
        
        if (!planStr) return null;
        
        const plan = JSON.parse(planStr.trim()) as MenuPlan;
        
        // Aseguramos que el ID sea único para evitar que el filtro de la App lo ignore
        return { 
          ...plan, 
          id: plan.id || `cloud-${Date.now()}-${index}`,
          origin: 'cloud' as const 
        };
      } catch (e) {
        console.warn("Error parseando fila de plan:", index, e);
        return null;
      }
    }).filter(p => p !== null) as MenuPlan[];
  } catch (e) {
    console.error("Error cargando planes del historial:", e);
    return [];
  }
}

export async function savePlanToRemote(url: string, plan: MenuPlan): Promise<boolean> {
  if (!url) return false;
  try {
    // Usamos el endpoint del Apps Script
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Importante para Google Apps Script Web Apps
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    return true;
  } catch (e) {
    console.error("Error guardando plan remotamente:", e);
    return false;
  }
}
