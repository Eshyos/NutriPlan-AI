
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Meal, DayMenu, MealType, MenuPlan } from './types';
import { generateMenuPlan } from './services/geminiService';
import { fetchMealsFromMultipleSheets, fetchSavedPlansFromSheet, savePlanToRemote } from './services/sheetService';
import MealCard from './components/MealCard';

const STORAGE_SAVED_PLANS = 'nutriplan_saved_plans';
const STORAGE_CONFIG = 'nutriplan_config';
const STORAGE_CACHED_MEALS = 'nutriplan_cached_meals';

const App: React.FC = () => {
  // Configuración por defecto
  const [lunchGid, setLunchGid] = useState<string>('0');
  const [dinnerGid, setDinnerGid] = useState<string>('438085558');
  const [plansGid, setPlansGid] = useState<string>('1926889222'); 
  const [saveUrl, setSaveUrl] = useState<string>('https://script.google.com/macros/s/AKfycbyIMrg88aQugoE5f0Q6GMhYSrZnr8rW_NSC2oMnoWPKNPDDe1GtwAUZCwE_x79Gt26n/exec'); 
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Estados de datos
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Feedback Visual
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Estados de planificación
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<number>(7);
  const [menuPlan, setMenuPlan] = useState<DayMenu[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Estados de modales
  const [isEditingMeal, setIsEditingMeal] = useState<{ dayIndex: number, type: MealType } | null>(null);
  const [swapSource, setSwapSource] = useState<{ dayIndex: number, type: MealType } | null>(null);
  const [savedPlans, setSavedPlans] = useState<MenuPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(false);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState<boolean>(false);
  const [showSaveNamingModal, setShowSaveNamingModal] = useState<boolean>(false);
  const [dbSearch, setDbSearch] = useState('');
  
  const saveNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_CONFIG);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.lunchGid) setLunchGid(config.lunchGid);
      if (config.dinnerGid) setDinnerGid(config.dinnerGid);
      if (config.plansGid) setPlansGid(config.plansGid);
      if (config.saveUrl) setSaveUrl(config.saveUrl);
    }

    const storedPlans = localStorage.getItem(STORAGE_SAVED_PLANS);
    if (storedPlans) setSavedPlans(JSON.parse(storedPlans));

    const cachedMeals = localStorage.getItem(STORAGE_CACHED_MEALS);
    if (cachedMeals) {
      const parsed = JSON.parse(cachedMeals);
      setMeals(parsed.sort((a: Meal, b: Meal) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })));
      setIsLoadingMeals(false);
    }
  }, []);

  useEffect(() => {
    loadMeals();
    loadRemotePlans();
  }, [lunchGid, dinnerGid, plansGid]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleReset = () => {
    if (menuPlan.length === 0) return;
    if (window.confirm("¿Estás seguro de que quieres limpiar el calendario actual?")) {
      setMenuPlan([]);
      showToast("Calendario reiniciado");
    }
  };

  /**
   * Fix for line 254: Implements the configuration form submit handler.
   */
  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lGid = (document.getElementById('lunchGidInput') as HTMLInputElement).value;
    const dGid = (document.getElementById('dinnerGidInput') as HTMLInputElement).value;
    const pGid = (document.getElementById('plansGidInput') as HTMLInputElement).value;
    const sUrl = (document.getElementById('saveUrlInput') as HTMLInputElement).value;

    setLunchGid(lGid);
    setDinnerGid(dGid);
    setPlansGid(pGid);
    setSaveUrl(sUrl);

    localStorage.setItem(STORAGE_CONFIG, JSON.stringify({
      lunchGid: lGid,
      dinnerGid: dGid,
      plansGid: pGid,
      saveUrl: sUrl
    }));

    setShowConfig(false);
    showToast("Configuración guardada");
  };

  const loadMeals = async () => {
    setIsLoadingMeals(true);
    setSyncError(null);
    try {
      const sheetMeals = await fetchMealsFromMultipleSheets(lunchGid, dinnerGid);
      // Forzar orden alfabético al cargar
      const sortedMeals = sheetMeals.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
      setMeals(sortedMeals);
      localStorage.setItem(STORAGE_CACHED_MEALS, JSON.stringify(sortedMeals));
      if (sortedMeals.length === 0) setSyncError("No se encontraron platos en el Excel.");
    } catch (err: any) {
      setSyncError("Error de sincronización con Google Sheets.");
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const loadRemotePlans = async () => {
    if (!plansGid || plansGid.trim() === '') return;
    setIsLoadingPlans(true);
    try {
      const remotePlans = await fetchSavedPlansFromSheet(plansGid);
      setSavedPlans(prev => {
        // Filtrar solo los locales de la lista anterior
        const localOnly = prev.filter(p => p.origin !== 'cloud');
        // Combinar nuevos remotos con locales
        const combined = [...remotePlans, ...localOnly];
        // Quitar duplicados por ID
        return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      });
    } catch (e) {
      console.warn("Fallo al cargar historial compartido:", e);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const executeSave = async () => {
    if (menuPlan.length === 0) return;
    const name = saveNameRef.current?.value || `Plan ${new Date(startDate).toLocaleDateString()}`;
    const newPlan: MenuPlan = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      startDate,
      days: duration,
      plan: menuPlan,
      origin: 'local'
    };

    setSavedPlans(prev => [newPlan, ...prev]);

    if (saveUrl) {
      showToast("Enviando al Excel...");
      const success = await savePlanToRemote(saveUrl, newPlan);
      if (success) {
        showToast("¡Plan guardado!");
        // Volvemos a cargar para obtener el estado 'cloud'
        setTimeout(loadRemotePlans, 1000);
      } else {
        showToast("Error al subir al Excel (vía Script)", "error");
      }
    } else {
      showToast("Guardado solo localmente");
    }

    setShowSaveNamingModal(false);
  };

  const handleGenerate = async () => {
    if (meals.length === 0) return setShowConfig(true);
    setIsGenerating(true);
    try {
      const plan = await generateMenuPlan(meals, startDate, duration, savedPlans);
      setMenuPlan(plan);
      showToast("Menú generado correctamente");
    } catch (err: any) {
      showToast("Fallo de conexión con la IA", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMealInPlan = (dayIndex: number, type: MealType, newMeal: Meal) => {
    const updatedPlan = [...menuPlan];
    if (type === MealType.LUNCH) updatedPlan[dayIndex].lunch = newMeal;
    else updatedPlan[dayIndex].dinner = newMeal;
    setMenuPlan(updatedPlan);
    setIsEditingMeal(null);
  };

  const handleSwap = (dayIndex: number, type: MealType) => {
    if (!swapSource) {
      setSwapSource({ dayIndex, type });
      showToast("Selecciona el día de destino");
      return;
    }
    const updatedPlan = [...menuPlan];
    const sourceMeal = swapSource.type === MealType.LUNCH ? updatedPlan[swapSource.dayIndex].lunch : updatedPlan[swapSource.dayIndex].dinner;
    const targetMeal = type === MealType.LUNCH ? updatedPlan[dayIndex].lunch : updatedPlan[dayIndex].dinner;
    
    if (swapSource.type === MealType.LUNCH) updatedPlan[swapSource.dayIndex].lunch = targetMeal;
    else updatedPlan[swapSource.dayIndex].dinner = targetMeal;
    
    if (type === MealType.LUNCH) updatedPlan[dayIndex].lunch = sourceMeal;
    else updatedPlan[dayIndex].dinner = sourceMeal;
    
    setMenuPlan(updatedPlan);
    setSwapSource(null);
  };

  const filteredMealsSorted = useMemo(() => {
    return meals
      .filter(m => 
        m.name.toLowerCase().includes(dbSearch.toLowerCase()) || 
        (m.category && m.category.toLowerCase().includes(dbSearch.toLowerCase()))
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [meals, dbSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'bg-red-600 border-red-500 text-white'}`}>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${syncError ? 'bg-red-500 animate-pulse' : meals.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            <div className="cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <h1 className="text-lg font-black tracking-tighter">NutriPlan <span className="text-emerald-600">AI</span></h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{meals.length} platos disponibles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
             <button onClick={() => setShowDatabaseModal(true)} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-500 transition-all" title="Ver Platos (A-Z)">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
             </button>
             <button onClick={() => setShowSavedModal(true)} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-500 transition-all relative" title="Historial">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {isLoadingPlans && <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>}
             </button>
             <button onClick={() => setShowConfig(!showConfig)} className={`p-2.5 rounded-full transition-all ${showConfig || syncError ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-100 text-slate-500'}`} title="Ajustes">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </button>
             <button onClick={() => { loadMeals(); loadRemotePlans(); showToast("Datos sincronizados"); }} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500" title="Sincronizar">
               <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoadingMeals || isLoadingPlans ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
          </div>
        </div>
      </header>

      {showConfig && (
        <div className="bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300 no-print">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest">Configuración de Sheets</h3>
              <form onSubmit={handleConfigSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">GID Pestaña Comidas</label>
                    <input id="lunchGidInput" type="text" defaultValue={lunchGid} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">GID Pestaña Cenas</label>
                    <input id="dinnerGidInput" type="text" defaultValue={dinnerGid} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">GID Pestaña Historial</label>
                    <input id="plansGidInput" type="text" defaultValue={plansGid} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">URL del Apps Script (Save)</label>
                    <input id="saveUrlInput" type="text" defaultValue={saveUrl} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 shadow-sm" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">Aplicar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {syncError && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-800 rounded-3xl flex items-center justify-between no-print shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-bold text-sm">{syncError}</p>
                <p className="text-[11px] opacity-70">Verifica que el archivo está compartido públicamente.</p>
              </div>
            </div>
            <button onClick={() => setShowConfig(true)} className="text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Editar GIDs</button>
          </div>
        )}

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 mb-12 no-print">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desde el día...</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500 shadow-sm transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                Planear por... <span>{duration} días</span>
              </label>
              <input type="range" min="1" max="31" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            </div>
            <button onClick={handleGenerate} disabled={isGenerating || meals.length === 0} className={`py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all ${isGenerating || meals.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98]'}`}>
              {isGenerating ? "Procesando..." : "Calcular Menú"}
            </button>
            <button onClick={handleReset} className="py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Limpiar
            </button>
          </div>
        </div>

        {menuPlan.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menuPlan.map((day, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{new Date(day.date).toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tighter">{new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</h4>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <MealCard meal={day.lunch} type={MealType.LUNCH} onEdit={() => setIsEditingMeal({ dayIndex: idx, type: MealType.LUNCH })} onSwap={() => handleSwap(idx, MealType.LUNCH)} isSwapSource={swapSource?.dayIndex === idx && swapSource?.type === MealType.LUNCH} />
                  <MealCard meal={day.dinner} type={MealType.DINNER} onEdit={() => setIsEditingMeal({ dayIndex: idx, type: MealType.DINNER })} onSwap={() => handleSwap(idx, MealType.DINNER)} isSwapSource={swapSource?.dayIndex === idx && swapSource?.type === MealType.DINNER} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Organiza tu semana</h3>
             <p className="text-slate-400 text-sm mt-3 font-medium max-w-sm px-10">Pulsa "Calcular Menú" para generar un plan equilibrado basado en tus platos del Excel.</p>
          </div>
        )}
      </main>

      {/* Database Modal */}
      {showDatabaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 bg-slate-50 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-black text-3xl text-slate-800 tracking-tight">Mis Platos (A-Z)</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1">Base de datos sincronizada • {filteredMealsSorted.length} platos</p>
                </div>
                <button onClick={() => setShowDatabaseModal(false)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-all text-xl font-black">✕</button>
              </div>
              
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input type="text" placeholder="Filtrar por nombre o categoría..." value={dbSearch} onChange={(e) => setDbSearch(e.target.value)} className="w-full px-12 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-emerald-500 shadow-sm transition-all" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <a href="https://docs.google.com/spreadsheets/d/1h1rVJVcTHmGFropcEI9whfkFxttVwe_wwL_FW7V_ITU/edit" target="_blank" rel="noopener noreferrer" className="px-6 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 flex items-center gap-2 hover:bg-emerald-700 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                  Editar Excel
                </a>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMealsSorted.map(m => (
                  <div key={m.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-emerald-300 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{m.category || 'General'}</span>
                      <div className="flex gap-1.5">
                        {m.canBeLunch && <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm" title="Apto para comida"></div>}
                        {m.canBeDinner && <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-sm" title="Apto para cena"></div>}
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 leading-tight group-hover:text-emerald-800 transition-colors">{m.name}</h4>
                  </div>
                ))}
                {filteredMealsSorted.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-300 font-black text-xl italic">No hay platos que coincidan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-2xl text-slate-800 tracking-tight">Historial de Planes</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Planes guardados en el Excel</p>
              </div>
              <button onClick={() => setShowSavedModal(false)} className="text-slate-400 text-xl font-black p-2 hover:bg-slate-100 rounded-full">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-5 custom-scrollbar">
              {savedPlans.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-300 font-black italic text-lg">Historial vacío.</p>
                </div>
              ) : (
                savedPlans.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-7 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-emerald-300 hover:bg-white transition-all shadow-sm hover:shadow-md">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg leading-tight">{p.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-3">
                        {p.days} días • {new Date(p.createdAt).toLocaleDateString()} 
                        {p.origin === 'cloud' && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded font-black text-[8px]">NUBE</span>}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { setMenuPlan(p.plan); setStartDate(p.startDate); setDuration(p.days); setShowSavedModal(false); showToast("Plan recuperado"); }} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-black/5">Cargar</button>
                      <button onClick={() => { const up = savedPlans.filter(sp => sp.id !== p.id); setSavedPlans(up); localStorage.setItem(STORAGE_SAVED_PLANS, JSON.stringify(up.filter(x => x.origin !== 'cloud'))); showToast("Plan borrado"); }} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      {menuPlan.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl text-white px-10 py-4 rounded-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex items-center gap-12 z-[50] border border-white/10 no-print animate-in slide-in-from-bottom-10 duration-500">
          <button onClick={() => setShowSaveNamingModal(true)} className="flex flex-col items-center gap-1.5 group" title="Guardar Plan">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-emerald-500 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            </div>
            <span className="text-[8px] uppercase font-black tracking-widest text-slate-400 group-hover:text-white">Guardar</span>
          </button>
          
          <div className="w-px h-10 bg-white/10"></div>
          
          <button onClick={() => window.print()} className="flex flex-col items-center gap-1.5 group" title="Imprimir Menú">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-blue-500 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            </div>
            <span className="text-[8px] uppercase font-black tracking-widest text-slate-400 group-hover:text-white">Imprimir</span>
          </button>

          {swapSource && (
            <div className="bg-emerald-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-4 shadow-xl">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
              Selecciona Destino
              <button onClick={() => setSwapSource(null)} className="ml-2 text-sm font-black p-1 hover:bg-white/20 rounded-lg">✕</button>
            </div>
          )}
        </div>
      )}

      {/* Modal Naming */}
      {showSaveNamingModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl p-12 animate-in zoom-in-95">
            <h3 className="text-3xl font-black text-slate-800 mb-8 tracking-tighter text-center">Nombre del Plan</h3>
            <input ref={saveNameRef} type="text" autoFocus className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-lg font-black outline-none focus:border-emerald-500 transition-all text-center focus:bg-white" defaultValue={`Plan ${new Date(startDate).toLocaleDateString()}`} onKeyDown={(e) => e.key === 'Enter' && executeSave()} />
            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowSaveNamingModal(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
              <button onClick={executeSave} className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-95 transition-all">Confirmar Guardado</button>
            </div>
          </div>
        </div>
      )}

      {/* Sustituir Modal */}
      {isEditingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-2xl text-slate-800 tracking-tight uppercase">Sustituir {isEditingMeal.type}</h3>
              <button onClick={() => setIsEditingMeal(null)} className="text-slate-400 text-xl font-black p-4 hover:bg-white rounded-full transition-all">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 gap-3 custom-scrollbar bg-slate-50/20">
              {meals
                .filter(m => isEditingMeal.type === MealType.LUNCH ? m.canBeLunch : m.canBeDinner)
                .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
                .map(m => (
                  <button key={m.id} onClick={() => updateMealInPlan(isEditingMeal.dayIndex, isEditingMeal.type, m)} className="group flex items-center justify-between p-7 rounded-[2rem] border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left shadow-sm hover:shadow-md">
                    <div>
                      <span className="text-sm font-black text-slate-700 block group-hover:text-emerald-700 transition-colors">{m.name}</span>
                      <span className="text-[9px] uppercase font-black text-slate-300 group-hover:text-emerald-400 mt-1 block">{m.category}</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-emerald-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
