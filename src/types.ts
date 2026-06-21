export interface HeavyMetals {
  lead: number;      // mg/L
  arsenic: number;   // mg/L
  copper: number;    // mg/L
  mercury: number;   // mg/L
}

export interface WaterData {
  purity: number;      // %
  tds: number;         // ppm (Sólidos Disueltos Totales)
  ph: number;          // pH (0-14)
  turbidity: number;   // NTU (Turbidez)
  metals: HeavyMetals;
  filterLife: number;  // %
  status: 'safe' | 'warning' | 'danger';
  lastChecked: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  savingPerUse: number; // litros ahorrados por uso/día
  frequencyText: string;
  active: boolean;
  completedDays: string[]; // fechas completadas YYYY-MM-DD
  notifyTime: string; // HH:MM
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  litersSaved: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface EducationalCard {
  id: string;
  title: string;
  category: 'ahorro' | 'mineria' | 'general';
  summary: string;
  content: string;
  icon: string;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
