// ====================================================================
// MISIÓN — Motor de Gamificación Determinista
// ====================================================================

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Iniciado', min: 0, max: 100, icon: 'spa' },
  { level: 2, title: 'Explorador', min: 100, max: 300, icon: 'explore' },
  { level: 3, title: 'Practicante', min: 300, max: 600, icon: 'self_improvement' },
  { level: 4, title: 'Constructor', min: 600, max: 1000, icon: 'military_tech' },
  { level: 5, title: 'Forjador Constante', min: 1000, max: 1500, icon: 'auto_awesome' },
  { level: 6, title: 'Guardián del Ritmo', min: 1500, max: 2200, icon: 'shield' },
  { level: 7, title: 'Maestro de Hábitos', min: 2200, max: 3000, icon: 'emoji_events' },
  { level: 8, title: 'Arquitecto Vital', min: 3000, max: 4000, icon: 'workspace_premium' },
  { level: 9, title: 'Filósofo en Acción', min: 4000, max: 5500, icon: 'psychology' },
  { level: 10, title: 'Trascendente', min: 5500, max: 100000, icon: 'stars' }
];

const ACHIEVEMENTS_CATALOG = [
  {
    code: 'FIRST_MISSION',
    title: 'Primer Paso',
    description: 'Completa tu primera misión diaria en la aplicación.',
    icon: 'military_tech',
    category: 'Inicio',
    reward: 10,
    check: (state) => state.completions.length >= 1
  },
  {
    code: 'STREAK_3',
    title: 'Chispa Inicial',
    description: 'Mantén una racha constante durante 3 días seguidos.',
    icon: 'local_fire_department',
    category: 'Racha',
    reward: 15,
    check: (state) => state.profile.currentStreak >= 3
  },
  {
    code: 'STREAK_7',
    title: 'Hábito Forjado',
    description: 'Alcanza 7 días ininterrumpidos de constancia y presencia.',
    icon: 'local_fire_department',
    category: 'Racha',
    reward: 30,
    check: (state) => state.profile.currentStreak >= 7
  },
  {
    code: 'STREAK_30',
    title: 'Maestro del Ritmo',
    description: 'Consigue 30 días de disciplina y transformación real.',
    icon: 'workspace_premium',
    category: 'Racha',
    reward: 100,
    check: (state) => state.profile.currentStreak >= 30
  },
  {
    code: 'TEN_MISSIONS',
    title: 'Compromiso Sólido',
    description: 'Completa 10 misiones a lo largo de tu viaje vital.',
    icon: 'verified',
    category: 'Progreso',
    reward: 25,
    check: (state) => state.completions.length >= 10
  },
  {
    code: 'FIFTY_MISSIONS',
    title: 'Inquebrantable',
    description: 'Supera la marca de 50 misiones cumplidas.',
    icon: 'shield',
    category: 'Progreso',
    reward: 75,
    check: (state) => state.completions.length >= 50
  },
  {
    code: 'LEVEL_4',
    title: 'Constructor Vital',
    description: 'Alcanza el Nivel 4 en la evolución de tu perfil.',
    icon: 'emoji_events',
    category: 'Nivel',
    reward: 50,
    check: (state) => calculateProgression(state.profile.totalImpulso).level >= 4
  },
  {
    code: 'FIRST_GOAL',
    title: 'Visionario',
    description: 'Crea tu primer sueño o meta en el árbol vital.',
    icon: 'flag',
    category: 'Metas',
    reward: 15,
    check: (state) => state.goals.length >= 1
  }
];

function calculateProgression(totalImpulso) {
  const current = LEVEL_THRESHOLDS.find(l => totalImpulso >= l.min && totalImpulso < l.max) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const currentXPInLevel = totalImpulso - current.min;
  const xpNeededInLevel = current.max - current.min;
  const percentage = Math.min(100, Math.max(0, Math.round((currentXPInLevel / xpNeededInLevel) * 100)));
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === current.level + 1) || null;

  return {
    level: current.level,
    title: current.title,
    icon: current.icon,
    min: current.min,
    max: current.max,
    currentXPInLevel,
    xpNeededInLevel,
    percentage,
    nextTitle: nextLevel ? nextLevel.title : 'Nivel Máximo',
    totalImpulso
  };
}

function evaluateAchievements(state) {
  const newlyUnlocked = [];
  ACHIEVEMENTS_CATALOG.forEach(ach => {
    const alreadyUnlocked = state.unlockedAchievements.includes(ach.code);
    if (!alreadyUnlocked && ach.check(state)) {
      newlyUnlocked.push(ach);
    }
  });
  return newlyUnlocked;
}

window.GamificationEngine = {
  LEVEL_THRESHOLDS,
  ACHIEVEMENTS_CATALOG,
  calculateProgression,
  evaluateAchievements
};
