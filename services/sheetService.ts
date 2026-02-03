
import { Meal, MenuPlan } from '../types';

function getBaseUrl(spreadsheetId: string) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
}

function parseFullCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;
  
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
        i++;
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
  
  if (cur !== '' || row.length > 0) {
    row.push(cur.trim());
    if (row.some(cell => cell !== '')) {
      result.push(row);
    }
  }

  return result;
}

async function fetchFromGid(spreadsheetId: string, gid: string): Promise<string[][]> {
  const url = `${getBaseUrl(spreadsheetId)}&gid=${gid}&t=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Error ${response.status}: No se pudo acceder a la pestaña ${gid}.`);
  const csvText = await response.text();
  return parseFullCSV(csvText);
}

export async function fetchMealsFromMultipleSheets(spreadsheetId: string, lunchGid: string, dinnerGid: string): Promise<Meal[]> {
  if (!spreadsheetId) return [];
  try {
    const mealMap: Map<string, Meal> = new Map();

    const processRows = (rows: string[][], isLunch: boolean) => {
      if (rows.length === 0) return;
      
      const headers = rows[0].map(h => h.toLowerCase().trim());
      const nameIdx = headers.findIndex(h => 
        h.includes('plato') || h.includes('nombre') || h.includes('comida') || 
        h.includes('cena') || h.includes('listado') || h.includes('receta')
      );
      
      const finalNameIdx = nameIdx !== -1 ? nameIdx : 0;
      const catIdx = headers.findIndex(h => h.includes('categor') || h.includes('tipo') || h.includes('grupo'));
      
      const satIdx = headers.findIndex(h => h.includes('sabado') || h.includes('sábado'));
      const sunIdx = headers.findIndex(h => h.includes('domingo'));

      const startIdx = (nameIdx === -1 && rows[0][0] && rows[0][0].length > 3) ? 0 : 1;

      for (let i = startIdx; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length <= finalNameIdx) continue;
        
        const rawName = row[finalNameIdx];
        if (!rawName || rawName.trim() === '' || rawName.toLowerCase() === 'nombre' || rawName.toLowerCase() === 'plato') continue;
        
        const name = rawName.trim();
        const key = name.toLowerCase();
        
        const isSat = satIdx !== -1 ? (row[satIdx]?.toLowerCase().includes('si') || row[satIdx]?.toLowerCase().includes('true') || row[satIdx] === '1') : false;
        const isSun = sunIdx !== -1 ? (row[sunIdx]?.toLowerCase().includes('si') || row[sunIdx]?.toLowerCase().includes('true') || row[sunIdx] === '1') : false;

        const existing = mealMap.get(key);
        if (existing) {
          if (isLunch) existing.canBeLunch = true;
          else existing.canBeDinner = true;
          existing.isSaturdayOnly = existing.isSaturdayOnly || isSat;
          existing.isSundayOnly = existing.isSundayOnly || isSun;
        } else {
          mealMap.set(key, {
            id: `${isLunch ? 'l' : 'd'}-${i}`,
            name: name,
            canBeLunch: isLunch,
            canBeDinner: !isLunch,
            category: catIdx !== -1 && row[catIdx] ? row[catIdx] : 'General',
            isSaturdayOnly: isSat,
            isSundayOnly: isSun
          });
        }
      }
    };

    if (lunchGid && lunchGid.trim() !== '') {
      const lunchRows = await fetchFromGid(spreadsheetId, lunchGid);
      processRows(lunchRows, true);
    }

    if (dinnerGid && dinnerGid.trim() !== '') {
      const dinnerRows = await fetchFromGid(spreadsheetId, dinnerGid);
      processRows(dinnerRows, false);
    }

    return Array.from(mealMap.values());
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
}

export async function saveMealToRemote(url: string, meal: Meal): Promise<boolean> {
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_MEAL', meal })
    });
    return true;
  } catch (e) {
    console.error("Error updating meal remotely:", e);
    return false;
  }
}

export async function fetchSavedPlansFromSheet(spreadsheetId: string, gid: string): Promise<MenuPlan[]> {
  if (!spreadsheetId || !gid || gid.trim() === '') return [];
  try {
    const rows = await fetchFromGid(spreadsheetId, gid);
    if (rows.length === 0) return [];
    
    const firstRowHasJson = rows[0].some(cell => {
      const c = cell.trim();
      return c.startsWith('{') && c.endsWith('}');
    });

    const dataRows = firstRowHasJson ? rows : rows.slice(1);
    
    return dataRows.map((row, index) => {
      try {
        const planStr = row.find(cell => {
          const c = cell.trim();
          return c.startsWith('{') && c.endsWith('}');
        });
        
        if (!planStr) return null;
        
        const plan = JSON.parse(planStr.trim()) as MenuPlan;
        
        return { 
          ...plan, 
          id: plan.id || `cloud-${Date.now()}-${index}`,
          origin: 'cloud' as const 
        };
      } catch (e) {
        return null;
      }
    }).filter(p => p !== null) as MenuPlan[];
  } catch (e) {
    console.error("Error loading plans:", e);
    return [];
  }
}

export async function savePlanToRemote(url: string, plan: MenuPlan): Promise<boolean> {
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SAVE_PLAN', plan })
    });
    return true;
  } catch (e) {
    console.error("Error saving plan remotely:", e);
    return false;
  }
}
