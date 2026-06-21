import { WaterData, Habit, LeaderboardUser, EducationalCard } from '../types';

export const INITIAL_WATER_DATA: WaterData = {
  purity: 98.5, // Matches the high-quality status from image "98.5%"
  tds: 4,       // Matches the "004 TDS" screen value from image!
  ph: 7.1,      // Neutral and safe pH
  turbidity: 0.15, // Extremely clear (NTU)
  metals: {
    lead: 0.001,    // mg/L (Safe < 0.01)
    arsenic: 0.002, // mg/L (Safe < 0.01)
    copper: 0.05,   // mg/L (Safe < 1.0)
    mercury: 0.0001 // mg/L (Safe < 0.001)
  },
  filterLife: 92, // Remaining percentage
  status: 'safe',
  lastChecked: 'Hace un momento'
};

// Simulated raw/unfiltered water metrics for high-risk regions (near mining areas)
export const RAW_WATER_SAMPLE: WaterData = {
  purity: 64.2,
  tds: 380,
  ph: 5.8, // Slightly acidic, indicating potential heavy metal dissolved states
  turbidity: 4.8, // Low visibility/muddy
  metals: {
    lead: 0.045,    // DANGER! (Safe is < 0.01)
    arsenic: 0.038, // DANGER! (Safe is < 0.01)
    copper: 1.85,   // WARNING! (Safe is < 1.0)
    mercury: 0.0045 // DANGER! (Safe is < 0.001)
  },
  filterLife: 100,
  status: 'danger',
  lastChecked: 'Sin procesar por el Filtro'
};

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Ducha de 5 minutos',
    description: 'Dúchate en un tiempo máximo de 5 minutos utilizando un temporizador.',
    icon: 'ShowerHead',
    savingPerUse: 40, // 40 litros por ducha reducida
    frequencyText: 'Diario por persona',
    active: true,
    completedDays: ['2026-06-01', '2026-06-02', '2026-06-03'],
    notifyTime: '07:30'
  },
  {
    id: 'habit-2',
    name: 'Cerrar grifo al cepillarse',
    description: 'Cierra la llave del agua mientras te lavas los dientes o afeitas.',
    icon: 'DropletOff',
    savingPerUse: 12, // 12 litros por cepillado
    frequencyText: '2 veces al día',
    active: true,
    completedDays: ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04'],
    notifyTime: '08:00'
  },
  {
    id: 'habit-3',
    name: 'Reparar fugas domésticas',
    description: 'Revisar y sellar tuberías, inodoros o grifos que gotean en el hogar.',
    icon: 'Wrench',
    savingPerUse: 30, // 30 litros diarios ahorrados de media por fuga reparada
    frequencyText: 'Permanente',
    active: false,
    completedDays: ['2026-06-02'],
    notifyTime: '18:00'
  },
  {
    id: 'habit-4',
    name: 'Carga completa de lavadora',
    description: 'Usa la lavadora únicamente con cargas completas en modo ecológico.',
    icon: 'Sparkles',
    savingPerUse: 50, // 50 litros por tanda de lavado óptima
    frequencyText: 'Por uso (aprox. 3 veces por semana)',
    active: false,
    completedDays: [],
    notifyTime: '10:00'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u-1', name: 'Sofía Allende', avatar: '👩‍🦰', litersSaved: 480, level: 8 },
  { id: 'u-2', name: 'Martín Carrasco', avatar: '👨', litersSaved: 390, level: 6 },
  { id: 'u-3', name: 'Tú (Usuario)', avatar: '🌱', litersSaved: 232, level: 4, isCurrentUser: true },
  { id: 'u-4', name: 'Catalina Fuentes', avatar: '👩', litersSaved: 210, level: 3 },
  { id: 'u-5', name: 'Diego Valenzuela', avatar: '👦', litersSaved: 145, level: 2 },
];

export const EDUCATIONAL_ARTICLES: EducationalCard[] = [
  {
    id: 'edu-1',
    category: 'mineria',
    title: 'La Minería Metálica y las Aguas Subterráneas',
    summary: 'Cómo los residuos químicos y el material estéril de la explotación minera impactan de forma silenciosa los acuíferos locales.',
    content: `La minería de cobre, oro y litio utiliza enormes cantidades de agua y químicos para la lixiviación y concentración de minerales. Durante este proceso, las rocas ricas en sulfuros quedan expuestas al oxígeno atmosférico y al agua de lluvia, generando lo que se conoce como **Drenaje Ácido de Mina (DAM)**. 

Este ácido reduce drásticamente el pH de las aguas subterráneas, facilitando la disolución e incorporación de metales altamente tóxicos como el **Arsénico**, el **Plomo** y el **Mercurio** en los acuíferos de los valles. Estos metales pesados no se degradan con el tiempo, sino que se bioacumulan en el organismo, causando estragos a largo plazo en órganos vitales y en el sistema nervioso. Utilizar filtros domésticos de última gama y ósmosis inversa es la barrera defensiva más eficaz contra la ingesta involuntaria de estas toxinas.`,
    icon: 'Activity'
  },
  {
    id: 'edu-2',
    category: 'ahorro',
    title: 'Estrategias de Riego y Escasez Hídrica',
    summary: 'La escasez hídrica llegó para quedarse. Aprende cómo gestionar eficientemente el agua en jardines y huertos domésticos.',
    content: `Más del 60% del agua potable consumida en casas con áreas verdes se destina al riego. Frente al cambio climático y la sobreexplotación de pozos, es imperativo rediseñar nuestras áreas exteriores:

1. **Xerofajismo:** Reemplaza el césped tradicional de alta demanda hídrica por plantas nativas de zonas áridas (cactus, suculentas, quillayes) adaptadas a la sequedad.
2. **Riego por Goteo Localizado:** Evita la evaporación masiva regando directamente la raíz en horarios de baja temperatura (madrugada o noche).
3. **Reutilización de Aguas Grises:** Las aguas de la lavadora y del lavado de verduras pueden filtrarse mediante tecnologías biológicas simples para rehidratar el jardín sin gastar una sola gota de agua potable extra.`,
    icon: 'Trees'
  },
  {
    id: 'edu-3',
    category: 'mineria',
    title: 'Metales Pesados: Enemigos Invisibles',
    summary: 'Aprende a diferenciar los minerales traza esenciales de los metales pesados altamente tóxicos.',
    content: `Mientras que minerales como el calcio, el magnesio y el zinc hidratan y nutren nuestro cuerpo (encontrándose disueltos de manera natural en el agua), los metales pesados son elementos de alta densidad química que carecen de funciones biológicas positivas para el ser humano:

- **Plomo (Pb):** Provoca el plumbismo. Daña la síntesis de hemoglobina y afecta severamente las capacidades de aprendizaje.
- **Arsénico (As):** Un metaloide extremadamente tóxico en su forma inorgánica. Produce hiperqueratosis, dolores abdominales crónicos y fatiga extrema.
- **Mercurio (Hg):** Daña permanentemente los riñones y el tejido neuronal.

El dispositivo **Filtro HIDROAMIGA** integra microfiltros de polipropileno de 1 micrón combinados con carbón enriquecido e intercambio catiónico iónico que atrapan estas moléculas de gran volumen atómico por adsorción, logrando entregar un flujo de agua pura, liviana y con un índice de sólidos disueltos (TDS) óptimo y saludable.`,
    icon: 'ShieldCheck'
  }
];
