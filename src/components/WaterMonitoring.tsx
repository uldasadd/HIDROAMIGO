import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, 
  Cpu, 
  RotateCw, 
  AlertCircle, 
  ShieldCheck, 
  Wifi, 
  MessageSquare,
  Send,
  Sliders,
  Check,
  Zap
} from 'lucide-react';
import { WaterData } from '../types';
import { INITIAL_WATER_DATA, RAW_WATER_SAMPLE } from '../utils/mockData';

interface WaterMonitoringProps {
  waterData: WaterData;
  setWaterData: React.Dispatch<React.SetStateAction<WaterData>>;
  isBluetoothConnected: boolean;
  setIsBluetoothConnected: (val: boolean) => void;
  openBluetoothModal: () => void;
}

export default function WaterMonitoring({ 
  waterData, 
  setWaterData, 
  isBluetoothConnected, 
  setIsBluetoothConnected, 
  openBluetoothModal 
}: WaterMonitoringProps) {
  const isConnected = isBluetoothConnected;
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeSampleType, setActiveSampleType] = useState<'filtered' | 'raw'>('filtered');
  
  // AI query loading state
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Sound/Vibration effect simulation via Web Audio
  const playSimulatedBeep = (freq: number, duration: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext blocked or not supported, ignore
    }
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsBluetoothConnected(false);
      playSimulatedBeep(300, 0.15);
    } else {
      openBluetoothModal();
    }
  };

  const handleStartScan = () => {
    if (!isConnected) return;
    setIsScanning(true);
    setAiResponse(null);
    playSimulatedBeep(520, 0.08);
    
    // Interval beeps during analysis
    const interval = setInterval(() => {
      playSimulatedBeep(700, 0.03);
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setIsScanning(false);
      playSimulatedBeep(880, 0.25);
      
      // Update stats based on sample type
      if (activeSampleType === 'filtered') {
        setWaterData(INITIAL_WATER_DATA);
      } else {
        setWaterData(RAW_WATER_SAMPLE);
      }
    }, 3000);
  };

  const handleSelectSample = (type: 'filtered' | 'raw') => {
    setActiveSampleType(type);
    playSimulatedBeep(type === 'filtered' ? 500 : 350, 0.1);
    
    // Auto-scan after switching sample if connected
    if (isConnected) {
      setIsScanning(true);
      setAiResponse(null);
      setTimeout(() => {
        setIsScanning(false);
        playSimulatedBeep(650, 0.15);
        if (type === 'filtered') {
          setWaterData(INITIAL_WATER_DATA);
        } else {
          setWaterData(RAW_WATER_SAMPLE);
        }
      }, 1500);
    } else {
      if (type === 'filtered') {
        setWaterData(INITIAL_WATER_DATA);
      } else {
        setWaterData(RAW_WATER_SAMPLE);
      }
    }
  };

  // Ask AI about this water metrics
  const handleAskAIAboutWater = async () => {
    setAiLoading(true);
    setAiResponse(null);
    playSimulatedBeep(500, 0.05);
    try {
      const response = await fetch('/api/water-adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analiza estas métricas actuales de agua, explicando qué significa cada nivel, la concentración de metales pesados y si recomiendas consumir este agua directa del filtro.`,
          waterData: waterData,
          contextType: 'analisis'
        })
      });
      const data = await response.json();
      setAiResponse(data.text);
      playSimulatedBeep(750, 0.15);
    } catch (error) {
      console.error(error);
      setAiResponse("Hubo un problema al conectarse con el HidroAsesor AI. Por favor, revisa tu conexión.");
    } finally {
      setAiLoading(false);
    }
  };

  const isWaterSafe = waterData.status === 'safe';
  const isWaterWarning = waterData.status === 'warning';
  const isWaterDanger = waterData.status === 'danger';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="section-water-purity">
      {/* LEFT COLUMN: Physical Device Simulation */}
      <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Connection status overlay */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full transition-all ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`} />
            <span className="text-xs font-mono tracking-wider uppercase text-slate-300">
              {isConnected ? 'Filtro Sincronizado' : 'Filtro Desconectado'}
            </span>
          </div>
          <button 
            id="btn-bluetooth-connect"
            onClick={handleToggleConnection}
            disabled={isConnecting}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
              isConnected 
                ? 'bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-rose-900/30' 
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
          >
            <Wifi className={`h-3 w-3 ${isConnecting ? 'animate-spin' : ''}`} />
            {isConnecting ? 'Buscando...' : isConnected ? 'Desconectar' : 'Vincular Filtro'}
          </button>
        </div>

        {/* Ambient grid glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent_60%)] pointer-events-none" />

        {/* Virtual 3D-styled Cylinder Filter rendering from the image mockup */}
        <div className="relative py-8 flex flex-col items-center justify-center w-full min-h-[380px]">
          
          {/* Top connection nozzle */}
          <div className="w-10 h-6 bg-slate-700 border-x border-t border-slate-600 rounded-t-lg shadow-inner z-10" />

          {/* Main Upper Cap */}
          <div className="w-40 h-8 bg-slate-800 border border-slate-650 rounded-lg shadow-md flex items-center justify-center z-10">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* Upper Chamber (Transparent glass with active charcoal filter layer inside) */}
          <div className="w-36 h-28 bg-sky-950/20 border-x border-slate-700/50 backdrop-blur-xs relative flex flex-col items-center justify-center overflow-hidden">
            {/* Water Flow Animation (bubbles) */}
            {isConnected && (
              <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-0">
                <div id="bubbles-particles" className="absolute bottom-0 w-2 h-2 bg-sky-400/40 rounded-full animate-bounce left-1/4" style={{ animationDuration: '2.5s' }} />
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-sky-400/30 rounded-full animate-bounce left-2/4" style={{ animationDuration: '1.8s' }} />
                <div className="absolute bottom-2 w-2.5 h-2.5 bg-sky-300/30 rounded-full animate-bounce left-3/4" style={{ animationDuration: '3s' }} />
              </div>
            )}
            
            {/* Filter Mesh Layer */}
            <div className="w-28 h-6 bg-slate-650 border border-slate-500 rounded-sm z-10 opacity-70 flex items-center justify-center text-[8px] font-mono tracking-widest text-slate-300">
              MALLA ACERO INOX
            </div>
            
            {/* Charcoal Filter Layer */}
            <div className="w-28 h-12 bg-slate-900 border border-slate-800 rounded-sm z-10 mt-2 shadow-inner flex flex-col justify-center items-center">
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Carbón Activo</span>
              <span className="text-[7px] font-mono text-sky-400">Micro-Gránulos iónicos</span>
            </div>
          </div>

          {/* MIDDLE SMART CONTROL HUB WITH SCREEN (Dynamic circular LED monitor matching image!) */}
          <div className="w-48 h-24 bg-slate-800 border-y-2 border-x border-slate-700 rounded-xl z-20 flex items-center justify-between px-3 relative shadow-xl">
            {/* Left radiator ribs */}
            <div className="flex flex-col gap-1.5 justify-center py-2 h-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2.5 h-1.5 bg-slate-900 rounded-l-xs border-y border-l border-slate-700" />
              ))}
            </div>

            {/* Smart Screen panel */}
            <div className="flex-1 mx-2 h-20 rounded-full bg-slate-950 border border-slate-700 flex flex-col items-center justify-center p-2 relative shadow-inner overflow-hidden">
              {/* Virtual screen glowing light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_80%)]" />
              
              <AnimatePresence mode="wait">
                {!isConnected ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center flex flex-col items-center"
                    key="disconnected-screen"
                  >
                    <span className="text-rose-500 animate-pulse text-[10px] font-mono font-black">OFFLINE</span>
                    <span className="text-[8px] font-mono text-slate-500">CONECTAR DISP</span>
                  </motion.div>
                ) : isScanning ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center flex flex-col items-center relative w-full"
                    key="analyzing-screen"
                  >
                    <RotateCw className="h-4 w-4 text-sky-400 animate-spin mb-1" />
                    <span className="text-[9px] font-mono text-sky-400 tracking-wider font-extrabold animate-pulse">ANALIZANDO...</span>
                    {/* Visual laser scanner line */}
                    <div className="absolute h-0.5 w-full bg-sky-400 left-0 animate-bounce" style={{ top: '35%' }} />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center w-full h-full flex flex-col justify-between py-1 relative z-10"
                    key="active-screen"
                  >
                    {/* Purity vs TDS reading */}
                    <div className="flex justify-around items-center mt-0.5">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-mono font-black text-emerald-400 leading-none">
                          {waterData.purity}%
                        </span>
                        <span className="text-[7px] font-mono text-slate-400 scale-[0.9]">PUREZA</span>
                      </div>
                      <div className="h-6 w-[1px] bg-slate-800" />
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-mono font-black text-sky-400 leading-none">
                          {String(waterData.tds).padStart(3, '0')}
                        </span>
                        <span className="text-[7px] font-mono text-slate-400 scale-[0.9]">TDS ppm</span>
                      </div>
                    </div>

                    {/* Quality bar indicator */}
                    <div className="w-full px-1.5">
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px]">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isWaterSafe ? 'bg-gradient-to-r from-teal-400 to-emerald-400' :
                            isWaterWarning ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                            'bg-gradient-to-r from-red-500 to-rose-600'
                          }`} 
                          style={{ width: `${waterData.purity}%` }}
                        />
                      </div>
                    </div>

                    {/* Mini physical UI power buttons representation */}
                    <div className="flex justify-center gap-1.5 text-[6px] font-mono text-slate-500 mt-0.5 scale-[0.85]">
                      <span className="text-sky-400 flex items-center gap-0.5">⬤ IoT</span>
                      <span className={`${isWaterSafe ? 'text-emerald-400' : 'text-rose-500'}`}>⬤ POTABLE</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right radiator ribs */}
            <div className="flex flex-col gap-1.5 justify-center py-2 h-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2.5 h-1.5 bg-slate-900 rounded-r-xs border-y border-r border-slate-700" />
              ))}
            </div>
          </div>

          {/* Lower Chamber (Pre-filter sand & mineralizing cores) */}
          <div className="w-36 h-28 bg-sky-950/20 border-x border-slate-700/50 backdrop-blur-xs relative flex flex-col items-center justify-center overflow-hidden">
            {/* Silicate Sand mineral beads layer */}
            <div className="w-28 h-10 bg-amber-900/40 border border-amber-800/60 rounded-sm z-10 flex flex-col justify-center items-center overflow-hidden relative">
              <div className="absolute inset-0 bg-repeat opacity-40 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:4px_4px]" />
              <span className="text-[8px] font-mono tracking-widest text-amber-200 uppercase relative z-10">Filtro Sílice</span>
              <span className="text-[6px] font-mono text-amber-300 relative z-10">Minerales Traza</span>
            </div>

            {/* Microfiltration Polypropylene cartridge core */}
            <div className="w-24 h-12 bg-slate-200 border border-slate-350 rounded-xs z-10 mt-2 shadow-sm flex flex-col justify-center items-center">
              <div className="w-full h-1/4 border-b border-dashed border-slate-300" />
              <span className="text-[8px] font-mono tracking-widest text-slate-700 uppercase">PP 1 MICRÓN</span>
              <div className="w-full h-1/4 border-t border-dashed border-slate-300" />
            </div>
          </div>

          {/* Lower Cap */}
          <div className="w-40 h-8 bg-slate-800 border border-slate-650 rounded-lg shadow-md flex items-center justify-center z-10">
            <div className="w-16 h-2 bg-slate-900 rounded-full" />
          </div>

          {/* Water outflow nozzle tube */}
          <div className="w-8 h-8 bg-slate-700 border-x border-b border-slate-600 rounded-b-lg shadow-inner z-10 flex items-center justify-center relative overflow-hidden">
            {isConnected && !isScanning && (
              <div className="absolute top-0 h-20 w-1 bg-sky-400/80 animate-pulse" />
            )}
          </div>
        </div>

        {/* Trigger Analysis Button */}
        <div className="w-full text-center mt-4">
          <button
            id="btn-trigger-scan"
            onClick={handleStartScan}
            disabled={!isConnected || isScanning}
            className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all ${
              !isConnected 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800' 
                : isScanning 
                ? 'bg-sky-950 text-sky-400 border border-sky-850' 
                : 'bg-gradient-to-r from-sky-550 to-sky-600 text-white shadow-lg hover:shadow-sky-550/20 active:scale-95'
            }`}
          >
            {isScanning ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Analizando Agua en Tiempo Real...
              </>
            ) : (
              <>
                <Cpu className="h-4 w-4" />
                Ejecutar Análisis Técnico
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-wide">
            {waterData.lastChecked === 'Hace un momento' ? 'Lecturas actualizadas' : `Último test: ${waterData.lastChecked}`}
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Controls & Analytical Gauges */}
      <div className="lg:col-span-7 flex flex-col gap-6" id="digital-gauges-panel">
        
        {/* Toggle Sample Type Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 mb-3 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-sky-400" />
            Simulación de Fuentes Hídricas
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Cambia la fuente de agua para comprobar cómo actúa el filtro ante la presencia de contaminación por metales pesados en zonas de influencia minera.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              id="source-filtered"
              onClick={() => handleSelectSample('filtered')}
              className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all relative overflow-hidden ${
                activeSampleType === 'filtered'
                  ? 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/20'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-850/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${activeSampleType === 'filtered' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className={`text-xs font-bold ${activeSampleType === 'filtered' ? 'text-emerald-300' : 'text-slate-300'}`}>
                  Muestra Filtrada
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Óptimo para consumo. Filtrado activo.</span>
              {activeSampleType === 'filtered' && (
                <div className="absolute right-1 bottom-1 text-emerald-400">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>

            <button
              id="source-raw"
              onClick={() => handleSelectSample('raw')}
              className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all relative overflow-hidden ${
                activeSampleType === 'raw'
                  ? 'bg-rose-950/30 border-rose-500/60 ring-2 ring-rose-500/20'
                  : 'bg-slate-950/50 border-slate-800 hover:bg-slate-850/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${activeSampleType === 'raw' ? 'bg-rose-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className={`text-xs font-bold ${activeSampleType === 'raw' ? 'text-rose-300' : 'text-slate-300'}`}>
                  Muestra de Pozo (Cruda)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1">Ecosistema minero sin tratar.</span>
              {activeSampleType === 'raw' && (
                <div className="absolute right-1 bottom-1 text-rose-400">
                  <AlertCircle className="h-4 w-4 animate-bounce" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Gauges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Gauge 1: Pureza */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Índice de Pureza</span>
                <h4 className="text-3xl font-black text-slate-100 font-mono mt-1">{waterData.purity}%</h4>
              </div>
              <span className={`p-1.5 rounded-lg ${isWaterSafe ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                {isWaterSafe ? <ShieldCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </span>
            </div>
            
            {/* Status explanation */}
            <div className="mt-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isWaterSafe ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                isWaterWarning ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
                'bg-rose-955 text-rose-400 border border-rose-800/40'
              }`}>
                {isWaterSafe ? 'Agua Potable - Segura' : isWaterWarning ? 'Filtrado Intermedio' : '¡CRÍTICO! Metales Excedidos'}
              </span>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                {isWaterSafe 
                  ? 'Filtro operando con la mayor eficiencia química. No hay trazas dañinas de minerales.' 
                  : 'Presencia de plomo o arsénico inorgánico libre. Se prohíbe el consumo directo sin filtración.'}
              </p>
            </div>
          </div>

          {/* Gauge 2: TDS Sólidos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Sólidos Disueltos (TDS)</span>
                <h4 className="text-3xl font-black text-sky-400 font-mono mt-1">{waterData.tds} <span className="text-xs text-slate-400 font-normal">ppm</span></h4>
              </div>
              <span className="p-1.5 rounded-lg bg-sky-900/20 text-sky-400">
                <Droplet className="h-5 w-5" />
              </span>
            </div>
            
            {/* Range bar */}
            <div className="mt-2">
              <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-1">
                <span>Excelente (&lt;50)</span>
                <span>Normal (150)</span>
                <span>Mineralizado (&gt;300)</span>
              </div>
              <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    waterData.tds < 50 ? 'bg-sky-400' :
                    waterData.tds <= 200 ? 'bg-teal-400' :
                    'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, (waterData.tds / 400) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                {waterData.tds < 10 
                  ? 'Agua de altísima pureza ultra-filtrada. Ideal para preparación de fórmulas infantiles.' 
                  : 'Niveles de sólidos totales elevados por presencia de minerales en las napas profundas.'}
              </p>
            </div>
          </div>

          {/* Gauge 3: pH & Turbidez */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">pH y Química del Agua</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-black text-slate-200 font-mono">{waterData.ph}</h4>
                <span className="text-[10px] font-mono text-slate-400">pH {waterData.ph < 6.5 ? '(Ácido)' : waterData.ph > 7.5 ? '(Alcalino)' : '(Neutro)'}</span>
              </div>
            </div>

            {/* pH gradient track */}
            <div className="mt-3">
              <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-red-400 via-emerald-400 to-sky-600">
                {/* Pointer Indicator */}
                <div 
                  className="absolute -top-1 w-2.5 h-4 bg-white border border-slate-900 rounded-xs shadow-md transition-all duration-1000 -translate-x-1/2" 
                  style={{ left: `${(waterData.ph / 14) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                <span>Ácido (0)</span>
                <span>Neutro (7)</span>
                <span>Básico (14)</span>
              </div>
            </div>
          </div>

          {/* Gauge 4: Vida del Filtro */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Vida útil del Filtro</span>
                <h4 className="text-2xl font-black text-sky-300 font-mono mt-1">{waterData.filterLife}%</h4>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-sky-900/40 text-sky-400">
                Operativo
              </span>
            </div>

            <div className="mt-3">
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-400 rounded-full transition-all duration-1000"
                  style={{ width: `${waterData.filterLife}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Cambiar cartucho cada 6 meses o al llegar al 10%. Restante: {Math.round(waterData.filterLife * 1.8)} días.
              </p>
            </div>
          </div>
        </div>

        {/* Heavy Metals Detail Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            Concentración de Metales Pesados Detectados (mg/L)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Plomo (Pb)', val: waterData.metals.lead, max: 0.01, desc: 'Dísc. Neuronal' },
              { name: 'Arsénico (As)', val: waterData.metals.arsenic, max: 0.01, desc: 'Lesión dérmica' },
              { name: 'Cobre (Cu)', val: waterData.metals.copper, max: 1.0, desc: 'Dolor estomacal' },
              { name: 'Mercurio (Hg)', val: waterData.metals.mercury, max: 0.001, desc: 'Daño Renal' },
            ].map((metal, index) => {
              const isOverLimit = metal.val > metal.max;
              return (
                <div key={index} className="bg-slate-950 p-3 rounded-xl border border-slate-800 relative overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-300 block">{metal.name}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-base font-black font-mono ${isOverLimit ? 'text-rose-400' : 'text-slate-200'}`}>
                      {metal.val}
                    </span>
                    <span className="text-[8px] text-slate-500">mg/L</span>
                  </div>
                  <span className="text-[8px] text-slate-400 block mt-1 leading-none">{metal.desc}</span>
                  
                  {/* Status chip */}
                  <div className="absolute right-2 top-2">
                    <span className={`h-2 w-2 rounded-full inline-block ${isOverLimit ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  </div>
                  
                  {/* Progress bar visual indicator */}
                  <div className="w-full h-1 bg-slate-900 mt-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isOverLimit ? 'bg-rose-500' : 'bg-sky-400'}`}
                      style={{ width: `${Math.min(100, (metal.val / (metal.max * 1.5)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[7px] text-slate-500 font-mono mt-1 block">Lím. OMS: {metal.max}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTEGRATED AI WATER ADVISOR INTERACTION */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 border border-sky-900/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <MessageSquare className="h-20 w-20 text-sky-400" />
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <span className="h-8 w-8 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
              <span className="text-sky-450 text-xs font-black">AI</span>
            </span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200">¿Dudas sobre estos niveles?</h4>
              <p className="text-[10px] text-slate-400 font-mono leading-none">Pregúntale a nuestro asesor científico hídrico</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Envía esta telemetría actual de tu sensor al **HidroAsesor AI**. Obtendrás un diagnóstico inmediato y consejos específicos para tu salud celular y el mantenimiento de las membranas de filtrado.
          </p>

          <button
            id="btn-ask-ai-water"
            onClick={handleAskAIAboutWater}
            disabled={aiLoading}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white disabled:text-slate-500 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            {aiLoading ? (
              <>
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
                Procesando con Gemini AI...
              </>
            ) : (
              <>
                <MessageSquare className="h-3.5 w-3.5" />
                Solicitar Diagnóstico AI
              </>
            )}
          </button>

          {/* AI Response Box */}
          <AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 rounded-xl bg-slate-950 border border-sky-900/30 text-xs text-slate-300 leading-relaxed"
                id="ai-assessment-box"
              >
                {/* Simulated Markdown renderer */}
                <div className="space-y-2 whitespace-pre-wrap font-sans text-slate-300">
                  {aiResponse}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
