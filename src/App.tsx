import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Droplet, 
  DropletOff,
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  BarChart2, 
  BookOpen, 
  Users, 
  Bell, 
  PlusCircle, 
  X, 
  CheckCircle2, 
  Clock, 
  Compass, 
  HelpCircle,
  TrendingDown,
  Info,
  Calendar,
  Layers,
  Flame,
  UserCheck,
  User,
  Lock,
  Mail,
  RefreshCw,
  LogOut,
  Key,
  Shuffle,
  Volume2,
  Wifi,
  Check
} from 'lucide-react';
import { WaterData, Habit, LeaderboardUser, EducationalCard, NotificationAlert } from './types';
import { INITIAL_WATER_DATA, DEFAULT_HABITS, INITIAL_LEADERBOARD, EDUCATIONAL_ARTICLES, RAW_WATER_SAMPLE } from './utils/mockData';
import WaterMonitoring from './components/WaterMonitoring';

const CONCIENCIA_MESSAGES = [
  {
    title: "🛁 Conciencia: Ducha Corta",
    message: "Reducir tu ducha a 5 minutos ahorra más de 40 litros de agua limpia. ¡Un pequeño cambio de hábito tiene un enorme impacto!"
  },
  {
    title: "🪥 Conciencia: Cepillado Inteligente",
    message: "No dejes correr el agua al cepillarte. Cerrar el grifo permite salvar hasta 12 litros por minuto. ¡Ahorra en cada cepillado!"
  },
  {
    title: "🔧 Conciencia: Reparación de Fugas",
    message: "Una gota por segundo equivale a 30 litros perdidos por día. Revisa tus tuberías y empaquetaduras hoy para cuidar las napas."
  },
  {
    title: "🧺 Conciencia: Lavado de Carga Plena",
    message: "Utiliza tu lavadora de ropa solo a carga completa. Optimizarás hasta 80 litros de agua por cada ciclo ejecutado."
  },
  {
    title: "🌋 Conciencia Minera: Drenaje Ácido",
    message: "La minería desvía aguas cordilleranas. Al registrar tus hábitos, evitas la sobre-explotación del escaso recurso hídrico."
  },
  {
    title: "🌾 Conciencia: Riego al Atardecer",
    message: "Riega tu jardín durante la noche o al amanecer. Reduce un 30% la evaporación directa y aprovecha cada gota de agua."
  },
  {
    title: "🥗 Conciencia: Reutilización de Agua",
    message: "El agua usada para enjuagar verduras es rica en nutrientes básicos. ¡Úsala para regar tus macetas y plantas del patio!"
  },
  {
    title: "🧼 Conciencia: Detergentes Biodegradables",
    message: "El jabón normal daña los ecosistemas acuáticos de ríos subterráneos. Prefiere fórmulas ecológicas libres de fosfato."
  },
  {
    title: "🍼 Conciencia: Sin Botellas PET",
    message: "Consumir agua pura filtrada en tu grifo HidroAmigo evita fabricar plásticos de un solo uso que duran 500 años en descomponerse."
  },
  {
    title: "🍽️ Conciencia: Lavavajillas Lleno",
    message: "Al lavar los platos, remoja las piezas en un bol en vez de usar agua continua. Logras un ahorro de hasta 20 litros por lavado."
  },
  {
    title: "💧 Conciencia: Agua Pluvial",
    message: "Aprovecha los chubascos de junio reuniendo agua de lluvia en barriles para la limpieza de patios y descargas sanitarias terrestres."
  },
  {
    title: "🍎 Conciencia: Huella Hídrica Oculta",
    message: "La producción de una sola manzana consume 70 litros de agua indirecta. Comer local reduce la huella industrial global."
  },
  {
    title: "🏭 Conciencia Minera: Derrame de Relaves",
    message: "Los depósitos de relave minero contienen trazas de sulfato, plomo y cobre disueltos que pueden infiltrar sutilmente las napas freáticas en valles agrícolas."
  },
  {
    title: "🏔️ Conciencia Glaciar: Preservación de Cumbres",
    message: "La gran minería de altura remueve glaciares subterráneos de roca, alterando los reservorios naturales que proveen agua a nuestros valles durante las sequías."
  },
  {
    title: "🚜 Conciencia Agrícola: Metales en Suelo",
    message: "El riego doméstico con aguas ácidas moviliza metales insolubles en los cultivos. Al usar el filtro inteligente HidroAmigo, evitas ingerir estas trazas tóxicas."
  },
  {
    title: "🧪 Conciencia: Adsorción Catiónica",
    message: "Los gránulos iónicos de carbón activo de HidroAmigo atrapan moléculas disueltas contaminantes que son indetectables a simple vista."
  },
  {
    title: "🛰️ Conciencia Satelital de Cuencas",
    message: "Toda telemetría reportada ayuda a mapear la acidez biológica del distrito minero para alertar de forma colaborativa a la comunidad."
  },
  {
    title: "🧬 Conciencia: Peligro de Bioacumulación",
    message: "¡Cuidado! Hervir el agua no remueve metales pesados; solo mata bacterias. Única solución efectiva es usar purificación física por carbón iónico."
  }
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'monitoreo' | 'consume' | 'mineria' | 'educacion'>('dashboard');
  
  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('hidroamiga_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover' | 'none'>('none');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPasswordConfirm, setAuthPasswordConfirm] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Password Recovery state machine
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [generatedRecoveryCode, setGeneratedRecoveryCode] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'initial' | 'sent' | 'reset'>('initial');
  const [newPassword, setNewPassword] = useState('');

  // --- NOTIFICATION COMPASS / RANDOM REMINDER STATES ---
  const [autoRandomizerEnabled, setAutoRandomizerEnabled] = useState<boolean>(false);
  const [lastRandomToast, setLastRandomToast] = useState<{title: string, message: string, visible: boolean}>({
    title: '',
    message: '',
    visible: false
  });

  // --- BLUETOOTH / "HIDROAMIGO" DEVICE SYNC STATE ---
  const [isBluetoothConnected, setIsBluetoothConnected] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hidroamiga_bt_connected');
      return saved !== 'false'; // Defaults to connected (true) on first launch
    } catch {
      return true;
    }
  });
  const [isBluetoothModalOpen, setIsBluetoothModalOpen] = useState<boolean>(false);

  // Bluetooth connection persistence layer
  useEffect(() => {
    try {
      localStorage.setItem('hidroamiga_bt_connected', String(isBluetoothConnected));
    } catch (e) {
      // localStorage sandboxed backup
    }
  }, [isBluetoothConnected]);

  const [waterData, setWaterData] = useState<WaterData>(INITIAL_WATER_DATA);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: 'n-1',
      title: '🚨 Alerta Ambientall',
      message: 'Ligera infiltración en tranque de relave del Sector 14. Se aumentó preventivamente la sensibilidad en el filtro AP-990-PRO.',
      timestamp: 'Hace 5 minutos',
      read: false,
    },
    {
      id: 'n-2',
      title: '💧 Meta Diaria Alcanzada',
      message: '¡Excelente! Lograste completar tu hábito de "Ducha de 5 minutos", ahorrando 40L.',
      timestamp: 'Hoy, 08:00 AM',
      read: true,
    }
  ]);

  // For adding custom habits
  const [showNewHabitModal, setShowNewHabitModal] = useState<boolean>(false);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [newHabitSaving, setNewHabitSaving] = useState<number>(30);
  const [newHabitDesc, setNewHabitDesc] = useState<string>('');
  const [newHabitTime, setNewHabitTime] = useState<string>('08:00');

  // Interactive AI Expert for Minerals & Mining
  const [miningQuery, setMiningQuery] = useState<string>('');
  const [miningAiResult, setMiningAiResult] = useState<string>('');
  const [miningLoading, setMiningLoading] = useState<boolean>(false);

  // General app metrics calculated dynamically
  const [personalStreak, setPersonalStreak] = useState<number>(5);

  const currentDateStr = '2026-06-04'; // Simulated current date matching platform metadata

  // Initialize predefined users list if empty
  useEffect(() => {
    try {
      const savedUsersArr = localStorage.getItem('hidroamiga_users');
      if (!savedUsersArr) {
        const initialUsers = [
          { email: 'vecino@hidroamiga.cl', password: 'clave123', name: 'Vecino Vigilante' },
          { email: 'vicentequirozcastillo18@gmail.com', password: 'password', name: 'Vicente Quiroz' }
        ];
        localStorage.setItem('hidroamiga_users', JSON.stringify(initialUsers));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Update current user name on leaderboard
  useEffect(() => {
    if (currentUser) {
      setLeaderboard(prev => {
        return prev.map(u => {
          if (u.isCurrentUser) {
            return { ...u, name: currentUser.name };
          }
          return u;
        });
      });
    } else {
      setLeaderboard(prev => {
        return prev.map(u => {
          if (u.isCurrentUser) {
            return { ...u, name: 'Invitado' };
          }
          return u;
        });
      });
    }
  }, [currentUser]);

  // --- NOTIFICATION RANDOMIZER FUNCTION ---
  const triggerRandomNotification = () => {
    const randomIndex = Math.floor(Math.random() * CONCIENCIA_MESSAGES.length);
    const chosen = CONCIENCIA_MESSAGES[randomIndex];
    
    // Play dual dynamic tone beep
    playBeep(750, 0.1);
    setTimeout(() => playBeep(950, 0.08), 80);

    const newAlert: NotificationAlert = {
      id: `random-n-${Date.now()}`,
      title: chosen.title,
      message: chosen.message,
      timestamp: 'Ahora mismo',
      read: false
    };

    setNotifications(prev => [newAlert, ...prev]);

    // Live screen toast feedback
    setLastRandomToast({
      title: chosen.title,
      message: chosen.message,
      visible: true
    });

    // Auto-hide after 5.5 seconds to clear screen
    setTimeout(() => {
      setLastRandomToast(prev => ({ ...prev, visible: false }));
    }, 5500);
  };

  // Automated intercalating cron simulated every 30 seconds
  useEffect(() => {
    if (!autoRandomizerEnabled) return;
    
    const interval = setInterval(() => {
      triggerRandomNotification();
    }, 28000); // 28s interval
    
    return () => clearInterval(interval);
  }, [autoRandomizerEnabled]);

  // --- REGISTRATION / SIGN UP HANDLER ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail || !authPassword || !authName) {
      setAuthError('Por favor complete todos los campos requeridos.');
      playBeep(330, 0.15);
      return;
    }

    if (authPassword !== authPasswordConfirm) {
      setAuthError('Las contraseñas ingresadas no coinciden.');
      playBeep(330, 0.15);
      return;
    }

    if (authPassword.length < 4) {
      setAuthError('La clave secreta debe tener al menos 4 caracteres.');
      playBeep(330, 0.15);
      return;
    }

    try {
      const existing = localStorage.getItem('hidroamiga_users');
      const usersList = existing ? JSON.parse(existing) : [];
      
      const emailLower = authEmail.trim().toLowerCase();
      if (usersList.some((u: any) => u.email.toLowerCase() === emailLower)) {
        setAuthError('Este correo electrónico ya está registrado con otra cuenta.');
        playBeep(330, 0.15);
        return;
      }

      const newUser = {
        email: emailLower,
        password: authPassword,
        name: authName.trim()
      };

      usersList.push(newUser);
      localStorage.setItem('hidroamiga_users', JSON.stringify(usersList));
      
      // Update session
      localStorage.setItem('hidroamiga_current_user', JSON.stringify({ email: newUser.email, name: newUser.name }));
      setCurrentUser({ email: newUser.email, name: newUser.name });

      setAuthSuccess('¡Cuenta registrada con éxito! Bienvenido a HIDROAMIGA.');
      playBeep(880, 0.15);
      
      // Reset form variables
      setAuthEmail('');
      setAuthPassword('');
      setAuthPasswordConfirm('');
      setAuthName('');
      
      // Dismiss Auth Modal
      setTimeout(() => {
        setAuthMode('none');
        setAuthSuccess('');
      }, 1500);

      addSystemNotification(
        '🎉 Bienvenido Registrado',
        `Hola ${newUser.name}, has creado tu cuenta con el correo ${newUser.email}. Tus mediciones se guardarán de forma permanente.`
      );

    } catch (err) {
      setAuthError('Error crítico de almacenamiento local.');
    }
  };

  // --- LOGIN HANDLER ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authEmail || !authPassword) {
      setAuthError('Por favor ingrese su correo electrónico y contraseña.');
      playBeep(330, 0.15);
      return;
    }

    try {
      const existing = localStorage.getItem('hidroamiga_users');
      const usersList = existing ? JSON.parse(existing) : [];
      const emailLower = authEmail.trim().toLowerCase();
      
      const found = usersList.find((u: any) => u.email.toLowerCase() === emailLower && u.password === authPassword);
      
      if (!found) {
        setAuthError('Credenciales incorrectas. Verifique el correo o contraseña.');
        playBeep(330, 0.15);
        return;
      }

      localStorage.setItem('hidroamiga_current_user', JSON.stringify({ email: found.email, name: found.name }));
      setCurrentUser({ email: found.email, name: found.name });

      setAuthSuccess(`¡Bienvenido de vuelta, ${found.name}!`);
      playBeep(750, 0.15);

      setAuthEmail('');
      setAuthPassword('');

      setTimeout(() => {
        setAuthMode('none');
        setAuthSuccess('');
      }, 1250);

      addSystemNotification(
        '🔐 Sesión Iniciada',
        `Hola de nuevo, ${found.name}. Se han restablecido de forma integrada tus configuraciones del filtro IoT.`
      );

    } catch (err) {
      setAuthError('Error al iniciar sesión localmente.');
    }
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    playBeep(440, 0.1);
    localStorage.removeItem('hidroamiga_current_user');
    setCurrentUser(null);
    addSystemNotification('🚪 Sesión Cerrada', 'Has cerrado tu sesión actual. El dispositivo HIDROAMIGA continua operando en versión de Invitado.');
  };

  // --- RECOVERY PROCESS ---
  const handleInitiateRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!recoveryEmail) {
      setAuthError('Ingrese su dirección de correo electrónico.');
      return;
    }

    try {
      const existing = localStorage.getItem('hidroamiga_users');
      const usersList = existing ? JSON.parse(existing) : [];
      const emailLower = recoveryEmail.trim().toLowerCase();

      const found = usersList.find((u: any) => u.email.toLowerCase() === emailLower);
      if (!found) {
        setAuthError('No encontramos ninguna cuenta asociada a este correo.');
        playBeep(330, 0.15);
        return;
      }

      // Generate a random 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedRecoveryCode(code);
      setRecoveryStep('sent');
      setRecoveryCodeInput('');
      playBeep(620, 0.12);

      // Instantly generate a system notification to allow the user to easily read/copy the code!
      addSystemNotification(
        '🔑 Recuperación de Cuenta',
        `Código de reinicio enviado a ${emailLower} -> Código de Verificación: ${code}`
      );
      
      setAuthSuccess(`Código enviado a las notificaciones y simulador.`);

    } catch (e) {
      setAuthError('Ocurrió un error al procesar la recuperación de contraseña.');
    }
  };

  const handleVerifyRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (recoveryCodeInput.trim() === generatedRecoveryCode && generatedRecoveryCode !== '') {
      setRecoveryStep('reset');
      setNewPassword('');
      playBeep(880, 0.1);
    } else {
      setAuthError('Código de verificación incorrecto. Revise sus notificaciones.');
      playBeep(330, 0.15);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (newPassword.length < 4) {
      setAuthError('La nueva contraseña debe tener un mínimo de 4 letras.');
      return;
    }

    try {
      const existing = localStorage.getItem('hidroamiga_users');
      const usersList = existing ? JSON.parse(existing) : [];
      const emailLower = recoveryEmail.trim().toLowerCase();

      const updatedList = usersList.map((u: any) => {
        if (u.email.toLowerCase() === emailLower) {
          return { ...u, password: newPassword };
        }
        return u;
      });

      localStorage.setItem('hidroamiga_users', JSON.stringify(updatedList));
      setAuthSuccess('¡Contraseña actualizada correctamente! Intenta iniciar sesión ahora.');
      playBeep(990, 0.2);

      // Clean state
      setRecoveryStep('initial');
      setGeneratedRecoveryCode('');
      setRecoveryEmail('');

      setTimeout(() => {
        setAuthMode('login');
        setAuthSuccess('');
      }, 1500);

    } catch (e) {
      setAuthError('Error guardando la nueva contraseña en el soporte local.');
    }
  };

  // Play micro beep for physical/IoT aesthetic feedback
  const playBeep = (freq = 600, duration = 0.08) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext sandboxed/blocked
    }
  };

  // Toggle habit completion on current day
  const handleToggleHabitCompletion = (habitId: string) => {
    playBeep(580, 0.1);
    setHabits(prevHabits => {
      return prevHabits.map(h => {
        if (h.id === habitId) {
          const completed = h.completedDays.includes(currentDateStr);
          let newCompleted = [...h.completedDays];
          if (completed) {
            newCompleted = newCompleted.filter(d => d !== currentDateStr);
          } else {
            newCompleted.push(currentDateStr);
            // Trigger transient notification about savings
            addSystemNotification(
              '🌿 Ahorro Registrado',
              `Sumaste un ahorro de ${h.savingPerUse}L hoy con el hábito de "${h.name}".`
            );
          }
          return { ...h, completedDays: newCompleted };
        }
        return h;
      });
    });
  };

  const addSystemNotification = (title: string, message: string) => {
    const newAlert: NotificationAlert = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: 'Ahora mismo',
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // Calculate global savings based on simulated user history + current ticks
  const getLitersSavedByUser = () => {
    // Basic history savings + today's interactive status
    const historicalSaved = 210; // Liters
    const todaySavings = habits.reduce((acc, h) => {
      // Calculate finished days * savingPerUse
      const daysCount = h.completedDays.length;
      return acc + (daysCount * h.savingPerUse);
    }, 0);
    return historicalSaved + todaySavings;
  };

  const userSavedLiters = getLitersSavedByUser();

  // Dynamic ranking recalculation based on user's live actions
  useEffect(() => {
    setLeaderboard(prev => {
      return prev.map(u => {
        if (u.isCurrentUser) {
          return { ...u, litersSaved: userSavedLiters, level: Math.floor(userSavedLiters / 80) + 1 };
        }
        return u;
      }).sort((a, b) => b.litersSaved - a.litersSaved);
    });
  }, [userSavedLiters]);

  // Handle adding new habit custom template
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newH: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabitName,
      description: newHabitDesc || 'Hábito de cuidado hídrico diario configurado por el usuario.',
      icon: 'Droplet',
      savingPerUse: Number(newHabitSaving) || 10,
      frequencyText: 'Diario',
      active: true,
      completedDays: [],
      notifyTime: newHabitTime
    };

    setHabits(prev => [...prev, newH]);
    setShowNewHabitModal(false);
    playBeep(700, 0.15);
    addSystemNotification(
      '⏰ Recordatorio Configurado',
      `Se programó alarma diaria a las ${newHabitTime} para: "${newHabitName}".`
    );

    // Reset fields
    setNewHabitName('');
    setNewHabitDesc('');
    setNewHabitSaving(30);
  };

  // Trigger mining AI response
  const handleQueryMiningImpact = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || miningQuery || "¿Cómo afecta la minería metálica los pozos agrícolas?";
    if (!finalPrompt.trim()) return;

    setMiningLoading(true);
    setMiningAiResult('');
    playBeep(440, 0.1);

    try {
      const response = await fetch('/api/water-adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          contextType: 'mineria'
        })
      });
      const data = await response.json();
      setMiningAiResult(data.text);
      playBeep(650, 0.15);
    } catch (err) {
      console.error(err);
      setMiningAiResult("Error hídrico local: No se pudo contactar al HidroAsesor AI para el reporte de minería.");
    } finally {
      setMiningLoading(false);
    }
  };

  // Calculate carbon and material ecological impacts
  const plasticBottlesSaved = Math.round(userSavedLiters * 2); // 1 Liter water saves approx 2 500ml bottles
  const moneySavedClp = Math.round(userSavedLiters * 15.5); // Average municipal cost per liter including filtration
  const carbonOffsetKg = (userSavedLiters * 0.12).toFixed(2); // estimated CO2 reduction from processing/transport

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    playBeep(500, 0.05);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="app-root">
      
      {/* HEADER SECTION (Responsive & High Density Styling) */}
      <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs" id="main-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-md shadow-sky-500/20">
            <Droplets className="text-white h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base uppercase">HIDROAMIGA</span>
              <span className="text-[10px] font-mono text-sky-600 font-black bg-sky-105 px-1.5 py-0.5 rounded">Iquique, Chile</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none">Monitoreo Inteligente y Huella Hídrica - Clima Desértico Tarapacá</p>
          </div>
        </div>

        {/* Center System Status details */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full transition-all ${isBluetoothConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
            <button
              onClick={() => { playBeep(500, 0.08); setIsBluetoothModalOpen(true); }}
              className="text-xs text-slate-800 font-mono font-bold uppercase hover:text-sky-600 transition-all cursor-pointer flex items-center gap-1.5"
              title="Click para sincronizar Filtro HidroAmigo vía Bluetooth"
            >
              <span>Filtro HidroAmigo:</span>
              <span className={isBluetoothConnected ? 'text-emerald-600' : 'text-rose-500'}>
                {isBluetoothConnected ? 'Conectado (BT)' : 'Desconectado'}
              </span>
            </button>
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Simulación: {currentDateStr}</span>
          </div>
        </div>

        {/* Right Info, Profile and Notifications Widgets */}
        <div className="flex items-center gap-4">
          
          {/* Notification Button */}
          <div className="relative">
            <button
              id="btn-notification-bell"
              onClick={() => { playBeep(520, 0.05); setShowNotificationCenter(!showNotificationCenter); }}
              className="p-2 bg-slate-100 hover:bg-slate-250 rounded-xl text-slate-600 transition-all relative"
            >
              <Bell className="h-4.5 w-4.5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Center Popover */}
            {showNotificationCenter && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4" id="notification-center-popover">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Notificaciones</h4>
                  <button 
                    onClick={handleMarkNotificationsRead}
                    className="text-[10px] text-sky-600 hover:underline font-bold"
                  >
                    Marcar leídas
                  </button>
                </div>
                
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl border transition-all text-xs ${
                        n.read ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-sky-50/50 border-sky-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold">{n.title}</span>
                        <span className="text-[8px] text-slate-400 font-mono font-bold">{n.timestamp}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                  <span className="text-[10px] text-slate-400">Total Alertas Diarias: {notifications.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Session Controls */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
                <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-[11px] text-white uppercase font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] font-bold text-slate-700 block max-w-[110px] truncate">{currentUser.name}</span>
                  <span className="text-[8px] text-slate-400 block font-mono max-w-[110px] truncate">{currentUser.email}</span>
                </div>
                <button
                  id="btn-auth-logout"
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-all ml-1 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* User Score Tag */}
              <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs">
                  🌱
                </div>
                <div className="text-left leading-none">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-tight">Mi Ahorro</span>
                  <span className="text-xs font-black text-slate-800 font-mono block leading-none mt-0.5">{userSavedLiters} L</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-auth-trigger"
                onClick={() => { playBeep(550, 0.08); setAuthMode('login'); }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-slate-700 hover:from-sky-600 hover:to-slate-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:shadow-sky-500/10 active:scale-95 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Crear Cuenta</span>
              </button>

              <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs text-white">
                  👤
                </div>
                <div className="text-left leading-none">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-tight">Invitado</span>
                  <span className="text-xs font-black text-slate-800 font-mono block leading-none mt-0.5">{userSavedLiters} L</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* DASHBOARD LAYOUT GRID (High Density Sidebar + Main Frame) */}
      <div className="flex-1 lg:grid lg:grid-cols-12 overflow-hidden">
        
        {/* SIDEBAR FOR NAVIGATION & OVERVIEW */}
        <aside className="lg:col-span-3 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between border-r border-slate-950" id="sidebar-panel">
          <div>
            <div className="mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-lg">💧</span>
                <span className="text-xs font-semibold text-slate-300">ESTADO DE INTEGRIDAD</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-[10px] font-mono text-slate-400">Desgaste de Membranas:</span>
                  <span className="font-mono font-bold text-sky-400">{waterData.filterLife}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-sky-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${waterData.filterLife}%` }}
                  />
                </div>
              </div>
              <p className="text-[8px] text-slate-400 font-mono mt-2 leading-relaxed">
                *Reemplazar por Repuesto Oficial en ~{Math.round(waterData.filterLife * 1.8)} días de uso constante.
              </p>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0" id="sidebar-navigation">
              <button
                id="nav-tab-dashboard"
                onClick={() => { playBeep(450, 0.05); setSelectedTab('dashboard'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold ${
                  selectedTab === 'dashboard'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span>Panel Principal</span>
              </button>

              <button
                id="nav-tab-monitoreo"
                onClick={() => { playBeep(500, 0.05); setSelectedTab('monitoreo'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold ${
                  selectedTab === 'monitoreo'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <img 
                  src="https://img.icons8.com/color/48/000000/water-filter.png" 
                  alt="filtro" 
                  className="w-4 h-4 object-contain filter brightness-90 bg-white/20 rounded p-0.5" 
                />
                <span>Simulador de Filtro IoT</span>
              </button>

              <button
                id="nav-tab-consume"
                onClick={() => { playBeep(550, 0.05); setSelectedTab('consume'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold ${
                  selectedTab === 'consume'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Clock className="h-4 w-4 shrink-0" />
                <span>Hábitos & Alertas</span>
              </button>

              <button
                id="nav-tab-mineria"
                onClick={() => { playBeep(600, 0.05); setSelectedTab('mineria'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold ${
                  selectedTab === 'mineria'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <BarChart2 className="h-4 w-4 shrink-0" />
                <span>Impacto de Minería</span>
              </button>

              <button
                id="nav-tab-educacion"
                onClick={() => { playBeep(650, 0.05); setSelectedTab('educacion'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-xs font-bold ${
                  selectedTab === 'educacion'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Educación & Consejos</span>
              </button>
            </nav>
          </div>

          {/* Environmental Slogan Info Box in Sidebar matching the High-Density look */}
          <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-sky-950 p-4 rounded-xl border border-sky-900/40 text-left shadow-inner">
            <span className="text-[10px] font-bold text-sky-400 block uppercase tracking-wider mb-1">Impacto en Tarapacá</span>
            <div className="flex items-center gap-1.5 text-xs text-sky-200 mt-1 font-bold">
              <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-spin" />
              <span>{carbonOffsetKg} kg CO₂ mitigados</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">
              Tus ahorros acumulados equivalen a respaldar la sustentabilidad en la árida ciudad de Iquique, Chile, optimizando el consumo en la costa desértica.
            </p>
          </div>
        </aside>

        {/* MAIN VIEWPORT FRAME */}
        <main className="lg:col-span-9 p-6 overflow-y-auto flex flex-col gap-6" id="main-viewport-content">
          
          {/* TAB 1: MASTER DASHBOARD PANEL */}
          {selectedTab === 'dashboard' && (
            <div className="flex flex-col gap-6" id="dashboard-tab">
              
              {/* Dynamic Welcome Hero Card with integrated metrics summary */}
              <div className="bg-gradient-to-r from-sky-700 via-slate-800 to-slate-900 border border-slate-700/60 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 opacity-10 p-4">
                  <Droplet className="h-48 w-48" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-extrabold mb-3">
                    <Flame className="h-3.5 w-3.5" />
                    Racha Semanal: {personalStreak} días seguidos
                  </div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                    Pureza Hídrica para Iquique: Tu Filtro HidroAmigo.
                  </h1>
                  <p className="text-xs text-sky-150 mt-2 leading-relaxed font-medium">
                    Controla en tiempo real la calidad del agua en el desierto de Tarapacá. Evita la ingesta de boro, sulfatos o residuos de drenajes ácidos de minería de altura mediante purificación inteligente.
                  </p>
                </div>
              </div>

              {/* Grid 1: Water Quality Quick Glance + Environmental ROI */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual Water Indicator Card (Left Span 5) */}
                <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Porcentaje de Pureza</span>
                    
                    <div className="my-6 text-center">
                      <div className="w-32 h-32 rounded-full border-8 border-sky-400 flex items-center justify-center mx-auto shadow-inner bg-sky-50/20">
                        <div className="text-center">
                          <span className="text-3xl font-black text-slate-800 font-mono tracking-tighter">
                            {waterData.purity}%
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold block tracking-wider uppercase">
                            {waterData.status === 'safe' ? 'Excelente' : 'Riesgoso'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">TDS Sólidos</span>
                        <span className="text-xs font-black text-slate-700 font-mono mt-0.5 block">{waterData.tds} ppm</span>
                        <span className="text-[8px] text-slate-500 font-mono">Lím. Saludable ~100</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Acidez (pH)</span>
                        <span className="text-xs font-black text-slate-700 font-mono mt-0.5 block">{waterData.ph}</span>
                        <span className="text-[8px] text-emerald-600 font-bold font-mono">Neutro</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTab('monitoreo')}
                      className="w-full text-center mt-3 bg-sky-50 text-sky-600 hover:bg-sky-100 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all"
                    >
                      Configurar Filtro Físico IoT →
                    </button>
                  </div>
                </div>

                {/* Environmental ROI (Right Span 7) */}
                <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Retorno Ambiental y Económico Mensual</span>
                    <p className="text-xs text-slate-500 mt-1">Estimación automática de beneficios logrados por persona tras aplicar el consumo inteligente.</p>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {/* Item 1: Liters Saved */}
                      <div className="bg-emerald-50/45 p-4 rounded-xl border border-emerald-100 text-center">
                        <span className="text-[28px] block mb-1">💧</span>
                        <span className="text-xl font-mono font-bold text-emerald-800 block">{userSavedLiters} Litros</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-mono block">Ahorro Neto Total</span>
                        <p className="text-[10px] text-emerald-700 mt-1">Equivalente a {Math.round(userSavedLiters / 60)} bañeras llenas</p>
                      </div>

                      {/* Item 2: Money Saved */}
                      <div className="bg-blue-50/45 p-4 rounded-xl border border-blue-100 text-center">
                        <span className="text-[28px] block mb-1">💵</span>
                        <span className="text-xl font-mono font-bold text-blue-800 block">${moneySavedClp} CLP</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-mono block">Retorno Estimado</span>
                        <p className="text-[10px] text-blue-700 mt-1">Reinvertido en mantención del filtro</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-600">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-bold block">Botella Plástico</span>
                      <span className="text-xs font-mono font-black text-slate-800 block">+{plasticBottlesSaved} ud</span>
                      <span className="text-[8px] text-slate-400">Evitados</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-bold block">Huella de Carbono</span>
                      <span className="text-xs font-mono font-black text-slate-800 block">-{carbonOffsetKg} kg</span>
                      <span className="text-[8px] text-slate-400">CO₂ Reducido</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider font-bold block">Ahorro Social</span>
                      <span className="text-xs font-mono font-black text-slate-800 block">+{Math.floor(userSavedLiters * 1.5)} pts</span>
                      <span className="text-[8px] text-slate-400">Para el vecindario</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid 2: Active Habits Quick Panel + Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Habits & Click to Mark Done (Span 7) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Hábitos Responsables Activos</h4>
                      <p className="text-[11px] text-slate-500">¿Lograste cumplir tu meta diaria? Toca para marcarlo.</p>
                    </div>
                    <button 
                      onClick={() => setSelectedTab('consume')}
                      className="text-xs text-sky-500 hover:underline font-bold"
                    >
                      Añadir Hábito +
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="active-habits-container">
                    {habits.slice(0, 4).map(habit => {
                      const completedToday = habit.completedDays.includes(currentDateStr);
                      return (
                        <div 
                          key={habit.id}
                          className={`p-3.5 rounded-xl border transition-all text-left flex justify-between items-start ${
                            completedToday
                              ? 'bg-emerald-50/40 border-emerald-250 ring-1 ring-emerald-100'
                              : 'bg-slate-50 border-slate-150 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {/* Habit icon simulator map */}
                              <span className="text-lg">
                                {habit.name.includes('Ducha') ? '🛁' : habit.name.includes('cepillarse') ? '🪥' : habit.name.includes('Fuga') ? '🔧' : '🧺'}
                              </span>
                              <span className="font-bold text-xs text-slate-800">{habit.name}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-1">{habit.description}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[8px] font-mono font-bold rounded">
                                +{habit.savingPerUse}L Ahorro
                              </span>
                              <span className="text-[8px] text-slate-500 font-mono">Alarma: {habit.notifyTime}</span>
                            </div>
                          </div>

                          <button
                            id={`tick-habit-${habit.id}`}
                            onClick={() => handleToggleHabitCompletion(habit.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              completedToday
                                ? 'bg-emerald-500 text-white border-transparent'
                                : 'bg-white hover:bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Leaderboard Preview (Span 4) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tabla de Clasificación Vecinal</span>
                    <p className="text-[10px] text-slate-500 leading-tight">Comparando tus litros mensuales ahorrados con otros vecinos del sector.</p>

                    <div className="space-y-3 mt-4" id="leaderboard-ranking-list">
                      {leaderboard.map((user, idx) => (
                        <div 
                          key={user.id} 
                          className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                            user.isCurrentUser 
                              ? 'bg-sky-50 border-sky-200 ring-1 ring-sky-100' 
                              : 'bg-white border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 text-xs flex items-center justify-center font-bold font-mono">
                              {idx + 1}
                            </span>
                            <span className="text-lg">{user.avatar}</span>
                            <div>
                              <span className={`text-xs block ${user.isCurrentUser ? 'font-black text-indigo-900' : 'font-medium text-slate-700'}`}>
                                {user.name} {user.isCurrentUser && '(Tú)'}
                              </span>
                              <span className="text-[8px] text-slate-400 font-semibold uppercase font-mono leading-none">Nivel {user.level} Guardián</span>
                            </div>
                          </div>

                          <span className="text-xs font-bold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {user.litersSaved} L
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 mt-4 text-center font-mono uppercase tracking-wide">
                    Basado en eficiencia hídrica semanal local
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DETAILED WATER QUALITY & PHYSICAL IOT SIMULATOR */}
          {selectedTab === 'monitoreo' && (
            <div className="flex flex-col gap-6" id="monitoreo-tab">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔬</span>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">Simulador de Filtro y Monitoreo IoT</h2>
                    <p className="text-xs text-slate-500">Comprueba la filtración de metales pesados en tiempo real manipulando las fuentes hídricas.</p>
                  </div>
                </div>
              </div>

              {/* Load the pristine physical cylinder simulator card and telemetry dials */}
              <WaterMonitoring 
                waterData={waterData} 
                setWaterData={setWaterData} 
                isBluetoothConnected={isBluetoothConnected}
                setIsBluetoothConnected={setIsBluetoothConnected}
                openBluetoothModal={() => { playBeep(450, 0.05); setIsBluetoothModalOpen(true); }}
              />
            </div>
          )}

          {/* TAB 3: WATER SAVING HABITS & NOTIFICATIONS PLANNER */}
          {selectedTab === 'consume' && (
            <div className="flex flex-col gap-6" id="habits-notifications-tab">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">Higiene Hídrica & Alertas Diarias</h2>
                    <p className="text-xs text-slate-500">Planifica tus hábitos diarios de reducción de desperdicio. Las alarmas te enviarán alertas a la vida real.</p>
                  </div>
                  <button
                    onClick={() => { playBeep(600, 0.08); setShowNewHabitModal(true); }}
                    className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Crear Hábito Personalizado
                  </button>
                </div>
              </div>

              {/* INTERACTIVE CONSCIENCE REMINDERS RANDOMIZER */}
              <div className="bg-gradient-to-r from-sky-50 to-slate-100 border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-sky-600 rounded-2xl flex items-center justify-center text-lg shrink-0 mt-0.5 text-sky-100 shadow-md">
                    <Shuffle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Intercalador de Conciencia Hídrica</h3>
                    <p className="text-xs text-slate-650 mt-1 leading-relaxed">
                      Genera notificaciones de conciencia aleatorias e intercala consejos breves para entrenar hábitos en tiempo real en Tarapacá.
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${autoRandomizerEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span className="text-[10px] font-mono text-slate-600">
                        {autoRandomizerEnabled ? 'Auto-Intercalador Activo (Ciclo de ~28 s)' : 'Auto-Intercalador Apagado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => { playBeep(450, 0.05); setAutoRandomizerEnabled(!autoRandomizerEnabled); }}
                    className={`px-4 py-2 border font-mono text-xs font-bold uppercase rounded-xl transition cursor-pointer ${
                      autoRandomizerEnabled 
                        ? 'bg-amber-100 border-amber-300 text-amber-750 hover:bg-amber-200' 
                        : 'bg-white border-sky-300 text-sky-700 hover:bg-sky-50'
                    }`}
                  >
                    {autoRandomizerEnabled ? 'Pausar Auto' : 'Activar Auto'}
                  </button>

                  <button
                    onClick={triggerRandomNotification}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/10 cursor-pointer"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    <span>Lanzar Consejo Aleatorio</span>
                  </button>
                </div>
              </div>

              {/* Interactive Habits Core Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Reminders List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-sky-500" />
                    Reloj de Recordatorios Activos
                  </h3>

                  <div className="space-y-4">
                    {habits.map(habit => {
                      const completedToday = habit.completedDays.includes(currentDateStr);
                      return (
                        <div key={habit.id} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/45 flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">
                              {habit.name.includes('Ducha') ? '🛁' : habit.name.includes('cepillarse') ? '🪥' : habit.name.includes('Fuga') ? '🔧' : '🧺'}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">{habit.name}</span>
                              <span className="text-[10px] text-slate-500 block leading-tight">{habit.description}</span>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="bg-sky-150 text-sky-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                  Hábito activo
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">Alarma diaria: {habit.notifyTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleHabitCompletion(habit.id)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                                completedToday
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {completedToday ? '¡Logrado!' : '¿Logrado?'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Practical Advice Desk for reducing water waste */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-500" />
                      Consejos Prácticos Frente a la Escasez
                    </h3>

                    <div className="space-y-3.5 text-xs text-slate-600">
                      <div className="flex items-start gap-2 border-b border-slate-100 pb-2.5">
                        <span className="text-base">1️⃣</span>
                        <div>
                          <span className="font-bold text-slate-800 block">Optimiza las descargas del inodoro</span>
                          <span className="text-[11px] text-slate-500">Coloca una botella de arena de 1 litro dentro del tanque del inodoro para ahorrar 1 litro de agua en cada descarga.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 border-b border-slate-100 pb-2.5">
                        <span className="text-base">2️⃣</span>
                        <div>
                          <span className="font-bold text-slate-800 block">Detección de Fugas con colorante</span>
                          <span className="text-[11px] text-slate-500">Verte colorante vegetal en el tanque del inodoro; si el color aparece en la taza sin tirar de la palanca, hay una fuga silenciosa.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-base">3️⃣</span>
                        <div>
                          <span className="font-bold text-slate-800 block">Reutiliza el agua de lavado de vegetales</span>
                          <span className="text-[11px] text-slate-500">Usa un recipiente para recoger el agua con la que lavas frutas y verduras y úsala para rehidratar las plantas ornamentales.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-slate-900 text-slate-100 p-4 rounded-xl text-xs text-left">
                    <span className="font-extrabold block text-sky-400">¿Sabías Qué?</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Un grifo que gotea solo una gota por segundo puede provocar una fuga acumulada de más de **30 litros de agua al día**. ¡Revisar periódicamente tus llaves combate la escasez hídrica local!
                    </p>
                  </div>
                </div>

              </div>

              {/* Add Habit Modal Overlay */}
              {showNewHabitModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => setShowNewHabitModal(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 pointer-events-auto"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Crear Hábito Sustentable</h3>
                    <p className="text-xs text-slate-500 mb-4">Ingresa un hábito de ahorro para trackear en el hogar diariamente.</p>

                    <form onSubmit={handleCreateHabit} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre del Hábito</label>
                        <input 
                          type="text" 
                          required
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                          placeholder="Ej: Lavado ecológico de vajilla"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500Outline outline-none text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Litros ahorrados / uso</label>
                          <input 
                            type="number" 
                            required
                            min="1"
                            value={newHabitSaving}
                            onChange={(e) => setNewHabitSaving(Number(e.target.value))}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hora de Notificación</label>
                          <input 
                            type="time" 
                            required
                            value={newHabitTime}
                            onChange={(e) => setNewHabitTime(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Descripción Corta</label>
                        <textarea 
                          rows={2}
                          value={newHabitDesc}
                          onChange={(e) => setNewHabitDesc(e.target.value)}
                          placeholder="Ej: Utilizar un balde para jabonar antes de enjuagar rápido."
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500Outline outline-none text-slate-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-sky-450 to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md"
                      >
                        Programar Alerta & Guardar
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: MINING TRANSIT & LOCAL WATER AQUACULTURE WATCH */}
          {selectedTab === 'mineria' && (
            <div className="flex flex-col gap-6" id="mineria-transparency-tab">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⛰️</span>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">Conciencia Minera & Impacto de Metales Pesados</h2>
                    <p className="text-xs text-slate-500">Transparencia hídrica e informe científico de napas subterráneas afectadas por actividades agropecuarias e industriales.</p>
                  </div>
                </div>
              </div>

              {/* Grid with intake telemetry chart + Gemini educational scanner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual copper extraction intake chart (Span 5) */}
                <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Actividad de Extracción Hídrica de Industrias</span>
                    <h3 className="text-sm font-bold text-sky-400 mt-2">Cobre Sector Cuenca Norte (m³/s)</h3>
                    
                    {/* Visual bar chart inside. Representation from High Density Spec */}
                    <div className="h-44 bg-slate-950 rounded-xl p-4 my-4 flex items-end gap-2.5 border border-slate-800">
                      {[
                        { label: 'Ene', val: 40, normal: true },
                        { label: 'Feb', val: 55, normal: true },
                        { label: 'Mar', val: 95, normal: false }, // dangerous limit
                        { label: 'Abr', val: 75, normal: true },
                        { label: 'May', val: 45, normal: true },
                        { label: 'Jun', val: 30, normal: true }
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[8px] font-mono font-bold text-slate-300">{bar.val}%</span>
                          <div 
                            className={`w-full rounded-t-xs transition-all duration-1000 ${
                              bar.normal ? 'bg-sky-400' : 'bg-rose-500 animate-pulse'
                            }`}
                            style={{ height: `${bar.val}%` }}
                          />
                          <span className="text-[9px] font-mono text-slate-500 mt-1">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-350 leading-relaxed mb-4">
                      La explotación metalúrgica en la cordillera desvía un promedio del **18% de las napas superficiales**, reduciendo la velocidad de recarga natural de los pozos de consumo rural y facilitando la solubilización del mineral.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/45 text-[9px] font-mono text-sky-300">
                      📣 <b className="text-white">Alerta de Vecindad:</b> Apoya el Programa de Transparencia de Aguas de Iquique en la votación vecinal de este fin de semana.
                    </div>
                  </div>
                </div>

                {/* Gemini-powered Intelligent Acid Drainage Consultant */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
                      Consultor del Ecosistema Hídrico (Gemini AI)
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Pregúntale a nuestro modelo experto cuáles son los efectos del drenaje de mina en la agricultura del valle o cómo opera el carbón activado magnético.
                    </p>

                    {/* Pre-suggested quick queries */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        "¿Cómo se origina el Drenaje Ácido de Mina (DAM)?",
                        "¿Por qué el Arsénico es peligroso en el agua?",
                        "¿Qué retienen la Ósmosis y el Carbón Activo?"
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => { setMiningQuery(q); handleQueryMiningImpact(q); }}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-lg text-[10px] text-slate-700 text-left transition-all font-medium block"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={miningQuery}
                        onChange={(e) => setMiningQuery(e.target.value)}
                        placeholder="Escribe tu consulta científica sobre el impacto minero..."
                        className="flex-1 px-3.5 py-2 border border-slate-250 bg-slate-50 rounded-xl text-xs outline-none text-slate-800"
                        onKeyDown={(e) => e.key === 'Enter' && handleQueryMiningImpact()}
                      />
                      <button
                        id="btn-mining-expert-send"
                        onClick={() => handleQueryMiningImpact()}
                        disabled={miningLoading}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 disabled:bg-slate-350 transition-all cursor-pointer hover:shadow-sky-500/10"
                      >
                        {miningLoading ? 'Analizando...' : 'Consultar'}
                      </button>
                    </div>
                  </div>

                  {/* Scientific response text panel */}
                  {miningAiResult && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 leading-relaxed max-h-52 overflow-y-auto" id="mining-expert-response">
                      <div className="space-y-1 whitespace-pre-wrap font-mono text-[10px]">
                        {miningAiResult}
                      </div>
                    </div>
                  )}

                  {!miningAiResult && !miningLoading && (
                    <div className="mt-4 p-3 bg-indigo-50 text-indigo-700/80 rounded-xl text-[10px] flex items-center gap-2">
                      <Info className="h-4 w-4 shrink-0 text-indigo-500" />
                      <span>El consultor utiliza el modelo gemini-3.5-flash optimizado en toxicidad de metales e ingeniería hídrica.</span>
                    </div>
                  )}
                </div>

              </div>
              
            </div>
          )}

          {/* TAB 5: EDUCATIONAL EDUCATION & SCIENTIFIC TIPS */}
          {selectedTab === 'educacion' && (
            <div className="flex flex-col gap-6" id="education-articles-tab">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h2 className="text-base font-extrabold text-slate-800">Repositorio Científico & Consejos Prácticos</h2>
                <p className="text-xs text-slate-500">Aprende sobre la toxicidad de metales pesados en las cadenas alimenticias y cómo los filtros domésticos limpian compuestos químicos.</p>
              </div>

              {/* Render high-contrast educational cards matching design spec */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {EDUCATIONAL_ARTICLES.map(article => (
                  <div key={article.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-1 text-[8px] font-mono tracking-widest font-black rounded-full uppercase ${
                          article.category === 'mineria' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {article.category === 'mineria' ? 'Ecosistemas & Minería' : 'Uso Eficiente'}
                        </span>
                        <span className="text-xl">
                          {article.category === 'mineria' ? '🔬' : '🌱'}
                        </span>
                      </div>

                      <h3 className="text-xs font-extrabold text-slate-900 leading-snug mb-2">{article.title}</h3>
                      <p className="text-[11px] text-slate-500 font-medium mb-3 leading-relaxed">{article.summary}</p>
                      
                      <div className="text-[10px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/80 leading-relaxed font-sans whitespace-pre-line">
                        {article.content}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/85">
                      <span className="text-[8px] text-slate-400 font-mono">Índice: Biblioteca HIDROAMIGA 2026</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-[10px] text-slate-500 font-mono mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Diseñado para el bienestar eco-sustentable comunal • Licencia Apache-2.0</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-bold text-slate-600 uppercase">Filtro HIDROAMIGA AP-990-PRO Activo</span>
        </div>
      </footer>

      {/* --- FLOATING CONSCIENCE REMINDERS TOAST --- */}
      {lastRandomToast.visible && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900 border border-slate-800 text-white rounded-3xl p-4 shadow-2xl z-55 flex items-start gap-3 animate-in slide-in-from-right-10 duration-200">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5 text-white shadow-lg">
            💡
          </div>
          <div className="flex-1 text-left">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-extrabold text-[9px] text-sky-450 font-mono uppercase tracking-widest">
                ¡Alerta de Conciencia!
              </span>
              <button 
                onClick={() => setLastRandomToast(prev => ({ ...prev, visible: false }))}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <h5 className="text-xs font-black text-white leading-tight mb-1">{lastRandomToast.title}</h5>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans">{lastRandomToast.message}</p>
          </div>
        </div>
      )}

      {/* --- BLUETOOTH / HIDROAMIGO COUPLING MODAL --- */}
      {isBluetoothModalOpen && (
        <BluetoothSyncModal
          onClose={() => setIsBluetoothModalOpen(false)}
          isBluetoothConnected={isBluetoothConnected}
          setIsBluetoothConnected={setIsBluetoothConnected}
          playBeep={playBeep}
          addSystemNotification={addSystemNotification}
        />
      )}

      {/* --- AUTHENTICATION OVERLAY / MODAL GATEWAY --- */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-in fade-in duration-200" id="auth-modal-overlay">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-150 text-left">
            <button
              onClick={() => setAuthMode('none')}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
              title="Cerrar"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white shadow-md">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                {authMode === 'login' ? 'Iniciar Sesión' : authMode === 'register' ? 'Crear Cuenta' : 'Recuperar Cuenta'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login' 
                  ? 'Accede para sincronizar tu filtro IoT y estadísticas de ahorro.' 
                  : authMode === 'register'
                  ? 'Regístrate hoy para guardar tu progreso de guardián del agua.'
                  : 'Recuperar el acceso a tu cuenta HIDROAMIGA por correo.'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{authSuccess}</span>
              </div>
            )}

            {/* FORM 1: LOGIN MODE */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Correo Electrónico (Usuario)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="usuario@correo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Clave Secreta</label>
                    <button
                      type="button"
                      onClick={() => { playBeep(450, 0.05); setAuthMode('recover'); setRecoveryStep('initial'); setAuthError(''); }}
                      className="text-[10px] text-indigo-600 hover:underline font-bold cursor-pointer"
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-slate-700 hover:from-sky-600 hover:to-slate-800 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Entrar a Mi Cuenta
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500">¿No tienes una cuenta? </span>
                  <button
                    type="button"
                    onClick={() => { playBeep(500, 0.05); setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                    className="text-xs text-sky-600 hover:underline font-extrabold cursor-pointer"
                  >
                    Crear cuenta gratis
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: REGISTER MODE */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="text" 
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Ej: Vicente Quiroz"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Correo Electrónico (Será tu Usuario)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="usuario@correo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Clave Secreta</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Confirmar Clave</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input 
                      type="password" 
                      required
                      value={authPasswordConfirm}
                      onChange={(e) => setAuthPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-slate-700 hover:from-sky-600 hover:to-slate-800 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Registrar Cuenta Nueva
                </button>

                <div className="text-center pt-1">
                  <span className="text-xs text-slate-500">¿Ya tienes una cuenta? </span>
                  <button
                    type="button"
                    onClick={() => { playBeep(500, 0.05); setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                    className="text-xs text-sky-600 hover:underline font-extrabold cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </form>
            )}

            {/* FORM 3: PASSWORD RECOVERY STATE FLOWS */}
            {authMode === 'recover' && (
              <div className="space-y-4">
                
                {/* STEP A: Email intake */}
                {recoveryStep === 'initial' && (
                  <form onSubmit={handleInitiateRecovery} className="space-y-4">
                    <p className="text-[11px] text-slate-500">
                      Te enviaremos un código de validación numérica de 6 dígitos que se mostrará aquí para restablecer tu contraseña.
                    </p>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tu Correo Registrado</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                        <input 
                          type="email" 
                          required
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="ingresa@tu-correo.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-850 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Enviar Código de Recuperación
                    </button>
                  </form>
                )}

                {/* STEP B: Verification Code with simulation block */}
                {recoveryStep === 'sent' && (
                  <form onSubmit={handleVerifyRecoveryCode} className="space-y-4">
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Key className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Simulador de Correo Seguro:</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-tight">
                        Hemos enviado el código de verificación al correo <b className="font-semibold block break-all">{recoveryEmail}</b>
                      </p>
                      <div className="bg-white p-2 rounded-xl text-center border border-amber-100 font-mono text-base font-black tracking-widest text-slate-800 shadow-xs">
                        {generatedRecoveryCode}
                      </div>
                      <span className="text-[9px] text-amber-600 block">Copie e ingrese el código de validación abajo para reestablecer la clave.</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ingresa el Código de 6 dígitos</label>
                      <input 
                        type="text" 
                        required
                        maxLength={6}
                        value={recoveryCodeInput}
                        onChange={(e) => setRecoveryCodeInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Código recibido"
                        className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tracking-widest font-mono text-slate-800 font-black outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Verificar Identidad
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { playBeep(400, 0.05); setRecoveryStep('initial'); }}
                      className="w-full text-center text-xs text-slate-400 hover:underline cursor-pointer"
                    >
                      ← Volver a ingresar correo
                    </button>
                  </form>
                )}

                {/* STEP C: Reset Password */}
                {recoveryStep === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-[11px] text-slate-500">
                      Identidad verificada. Por favor escribe tu nueva contraseña de acceso.
                    </p>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 font-mono">Nueva Clave Secreta</label>
                      <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 focus:ring-1 focus:ring-sky-500 transition font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Actualizar Clave & Entrar
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <button
                    onClick={() => { playBeep(500, 0.05); setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                    className="text-xs text-sky-600 hover:underline font-extrabold cursor-pointer"
                  >
                    Volver a Iniciar Sesión
                  </button>
                </div>

              </div>
            )}

            {/* Simulated default accounts indicator to guide developers/users */}
            <div className="mt-5 border-t border-slate-100 pt-3 flex flex-col gap-1 bg-slate-50 p-3 rounded-2xl">
              <span className="text-[9px] text-slate-400 uppercase font-black text-center tracking-wider">Cuentas creadas por defecto:</span>
              <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono">
                <span>👤 vecino@hidroamiga.cl</span>
                <span className="text-[8px] bg-sky-100 text-sky-700 px-1 rounded">clave123</span>
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono">
                <span>👤 vicentequirozcastillo18@gmail.com</span>
                <span className="text-[8px] bg-sky-100 text-sky-700 px-1 rounded">password</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// --- HIDROAMIGO BLUETOOTH SYNC MODAL IMPLEMENTATION ---
function BluetoothSyncModal({
  onClose,
  isBluetoothConnected,
  setIsBluetoothConnected,
  playBeep,
  addSystemNotification
}: {
  onClose: () => void;
  isBluetoothConnected: boolean;
  setIsBluetoothConnected: (val: boolean) => void;
  playBeep: (freq?: number, duration?: number) => void;
  addSystemNotification: (title: string, message: string) => void;
}) {
  const [step, setStep] = useState<'initial' | 'scanning' | 'discovered' | 'pairing' | 'paired'>('initial');
  const [scanProgress, setScanProgress] = useState(0);
  const [pairingProgress, setPairingProgress] = useState(0);

  // Start scanning effect
  useEffect(() => {
    if (isBluetoothConnected) {
      setStep('paired');
    } else {
      setStep('initial');
    }
  }, [isBluetoothConnected]);

  useEffect(() => {
    let interval: any;
    if (step === 'scanning') {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('discovered');
            playBeep(880, 0.15);
            return 100;
          }
          // play radar sweep sound occasionally
          if (prev % 20 === 0) {
            playBeep(1200, 0.02);
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    let interval: any;
    if (step === 'pairing') {
      setPairingProgress(0);
      interval = setInterval(() => {
        setPairingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsBluetoothConnected(true);
            setStep('paired');
            playBeep(600, 0.1);
            setTimeout(() => playBeep(800, 0.15), 100);
            addSystemNotification(
              '📶 Filtro HidroAmigo Sincronizado',
              'Sincronización por Bluetooth LE exitosa. Los sensores están listos para el monitoreo.'
            );
            return 100;
          }
          if (prev % 20 === 0) {
            playBeep(700, 0.05);
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleStartScan = () => {
    playBeep(520, 0.08);
    setStep('scanning');
  };

  const handleDisconnect = () => {
    playBeep(300, 0.2);
    setIsBluetoothConnected(false);
    setStep('initial');
    addSystemNotification(
      '⚠️ Filtro Desconectado',
      'Se ha desvinculado el dispositivo HidroAmigo. Reconectar para ver métricas.'
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-in fade-in duration-200" id="bluetooth-modal-overlay">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-150 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-705 transition cursor-pointer"
          title="Cerrar"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-10 h-10 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white shadow-md shadow-sky-600/20">
            <Wifi className="h-5 w-5 animate-pulse" />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Sincronizador Bluetooth "HidroAmigo"
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-tight">
            Vincula y sincroniza el sensor físico de tu grifo inteligente mediante tecnología Bluetooth Low Energy.
          </p>
        </div>

        {/* STEP 1: INITIAL STATE (READY TO SCAN) */}
        {step === 'initial' && (
          <div className="space-y-4 text-center py-4">
            <div className="flex justify-center my-2">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border border-sky-100 animate-ping duration-1000" />
                <div className="absolute w-16 h-16 rounded-full border border-sky-200 animate-ping duration-700" />
                <div className="w-12 h-12 rounded-full bg-sky-50 border-2 border-sky-100 flex items-center justify-center text-sky-500 font-black text-sm">
                  BT
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Asegúrate de que tu filtro <b className="font-bold text-slate-800">HidroAmigo</b> esté encendido y que la luz azul de emparejamiento esté parpadeando rápidamente.
            </p>
            <button
              onClick={handleStartScan}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-md cursor-pointer"
            >
              Iniciar Búsqueda Bluetooth
            </button>
          </div>
        )}

        {/* STEP 2: SCANNING STATE with animated Sonar Radar block */}
        {step === 'scanning' && (
          <div className="space-y-4 text-center py-4 animate-in fade-in">
            <div className="flex justify-center my-2">
              <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)] animate-pulse" />
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-sky-500 animate-spin flex items-center justify-center" style={{ animationDuration: '3s' }}>
                  <div className="w-2 h-2 bg-sky-600 rounded-full" />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Buscando dispositivos...</span>
                <span className="text-xs font-mono font-bold text-sky-600">{scanProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-sky-600 rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono italic">Escaneando múltiples frecuencias LE (2.4GHz)...</p>
          </div>
        )}

        {/* STEP 3: DISCOVERED DEVICES LIST */}
        {step === 'discovered' && (
          <div className="space-y-4 py-2 animate-in fade-in">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Dispositivos Encontrados:</span>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {/* Target Device (HidroAmigo) */}
              <button
                onClick={() => { playBeep(580, 0.1); setStep('pairing'); }}
                className="w-full p-3 bg-gradient-to-r from-slate-50 to-sky-50/70 hover:from-sky-50 hover:to-sky-100 border border-sky-200 hover:border-sky-400 rounded-xl transition-all text-left flex justify-between items-center group cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl shrink-0">💧</span>
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block font-mono">HidroAmigo AP-990-PRO</span>
                    <span className="text-[10px] text-sky-600 block mt-0.5 font-mono">MAC: B4:72:9A:80:55:01</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-1.5">
                  <div className="flex items-end gap-[2px] h-3">
                    <span className="w-[3px] bg-emerald-500 h-[4px] rounded-xs" />
                    <span className="w-[3px] bg-emerald-500 h-[7px] rounded-xs" />
                    <span className="w-[3px] bg-emerald-500 h-[10px] rounded-xs" />
                    <span className="w-[3px] bg-emerald-500 h-[13px] rounded-xs" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-sky-600 group-hover:underline">Vincular</span>
                </div>
              </button>

              {/* Distractors compatibility items */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl opacity-60 flex justify-between items-center text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0">📺</span>
                  <div>
                    <span className="font-bold block text-slate-700">SmartTV Samsung (75")</span>
                    <span className="text-[9px] text-slate-400 block font-mono font-bold">MAC: C1:20:9C:3B:AA:05</span>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold bg-slate-250 text-slate-500 px-1.5 py-0.5 rounded uppercase">Incompatible</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl opacity-60 flex justify-between items-center text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0">📡</span>
                  <div>
                    <span className="font-bold block text-slate-700">Beacon_SensorTemp_XYZ</span>
                    <span className="text-[9px] text-slate-400 block font-mono font-bold">MAC: F4:E1:1F:B4:90:3C</span>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold bg-slate-250 text-slate-500 px-1.5 py-0.5 rounded uppercase">Incompatible</span>
              </div>
            </div>

            <button
              onClick={() => { playBeep(450, 0.05); setStep('scanning'); }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-xs font-bold uppercase rounded-xl transition text-center cursor-pointer"
            >
              Volver a Escanear
            </button>
          </div>
        )}

        {/* STEP 4: PAIRING/SECURITY GENERATION */}
        {step === 'pairing' && (
          <div className="space-y-4 text-center py-4 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 text-xs font-mono flex flex-col gap-2">
              <div className="text-sky-400 text-lg animate-bounce">🔑</div>
              <p className="text-[11px] text-slate-300">Generando cifrado iónico seguro AES-128 con el filtro hardware HidroAmigo...</p>
              
              <div className="my-2 bg-slate-950 p-2 text-base font-black tracking-widest text-emerald-400 rounded-xl border border-slate-800 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-pulse" />
                PIN: 489 120
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Estableciendo Túnel Seguro...</span>
                <span className="text-xs font-mono font-bold text-sky-600">{pairingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-150" style={{ width: `${pairingProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONNECTED STATE */}
        {step === 'paired' && (
          <div className="space-y-4 text-center py-4 animate-in fade-in">
            <div className="flex justify-center my-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-250 flex items-center justify-center text-emerald-500 shadow-md shadow-emerald-500/10">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm">Dispositivo HidroAmigo Sincronizado</h4>
              <p className="text-xs text-emerald-600 font-mono font-bold select-none">CONEXIÓN BLUETOOTH ACTIVA</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1.5 text-left font-mono">
              <div className="flex justify-between"><span className="text-slate-400 font-semibold">Modelo:</span><span className="font-bold text-slate-800">HidroAmigo AP-990-PRO</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-semibold">Calidad Señal:</span><span className="font-bold text-emerald-600">-42 dBm (Excelente)</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-semibold">Canal de Datos:</span><span className="font-bold text-slate-800">BLE Stream Canal 4</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-semibold">Frecuencia:</span><span className="font-bold text-slate-800">0.5 Hz (Realtime)</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={handleDisconnect}
                className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-mono text-xs font-bold uppercase rounded-xl transition cursor-pointer"
              >
                Desvincular
              </button>
              <button
                onClick={onClose}
                className="py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-md cursor-pointer"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
