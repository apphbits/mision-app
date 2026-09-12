// ====================================================================
// MISIÓN — Estado Reactivo y Persistencia (LocalStorage / Supabase Sync)
// ====================================================================

const INITIAL_STATE = {
  profile: {
    fullName: 'Carlos Forjador',
    title: 'Constructor',
    email: 'carlos@mision.app',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    totalImpulso: 730,
    chispas: 85,
    currentStreak: 7,
    bestStreak: 12,
    disciplineRate: 94,
    freezes: 1,
    notificationsEnabled: true
  },
  goals: [
    {
      id: 'g-1',
      title: 'Fluidez y Maestría en Inglés',
      description: 'Alcanzar nivel C1 conversacional para reuniones internacionales.',
      category: 'Crecimiento',
      status: 'active',
      icon: 'language',
      color: '#3A7D63',
      targetDate: '2026-12-31',
      totalMissionsTarget: 40,
      completedMissionsCount: 26,
      progress: 65
    },
    {
      id: 'g-2',
      title: 'Lanzar mi Estudio Digital',
      description: 'Validar producto, adquirir los primeros 10 clientes y facturar sosteniblemente.',
      category: 'Finanzas',
      status: 'active',
      icon: 'rocket_launch',
      color: '#B87547',
      targetDate: '2026-10-15',
      totalMissionsTarget: 30,
      completedMissionsCount: 12,
      progress: 40
    },
    {
      id: 'g-3',
      title: 'Vitalidad Física & Fuerza',
      description: 'Construir masa muscular magra, resistencia cardiovascular y flexibilidad.',
      category: 'Cuerpo',
      status: 'active',
      icon: 'fitness_center',
      color: '#4A7C59',
      targetDate: '2026-11-30',
      totalMissionsTarget: 50,
      completedMissionsCount: 38,
      progress: 76
    },
    {
      id: 'g-4',
      title: 'Claridad Mental y Presencia',
      description: 'Cultivar una mente enfocada y serena mediante meditación y desconexión.',
      category: 'Mente',
      status: 'active',
      icon: 'spa',
      color: '#4B8FB2',
      targetDate: '2026-09-30',
      totalMissionsTarget: 20,
      completedMissionsCount: 17,
      progress: 85
    }
  ],
  dailyMissions: [
    {
      id: 'm-1',
      goalId: 'g-4',
      title: 'Meditación Matutina Silenciosa',
      description: 'Observar la respiración durante 10 minutos al despertar.',
      category: 'Mente',
      difficulty: 'Fácil',
      durationMinutes: 10,
      impulso: 10,
      chispas: 5,
      isCompleted: true,
      completedAt: '2026-09-11T08:15:00Z'
    },
    {
      id: 'm-2',
      goalId: 'g-3',
      title: 'Caminata Consciente de 20 Minutos',
      description: 'Sal a caminar al aire libre a ritmo constante activando tu energía.',
      category: 'Cuerpo',
      difficulty: 'Normal',
      durationMinutes: 20,
      impulso: 25,
      chispas: 10,
      isCompleted: false,
      completedAt: null
    },
    {
      id: 'm-3',
      goalId: 'g-1',
      title: 'Lectura Profunda en Inglés (15 min)',
      description: 'Leer artículo o libro subrayando 5 expresiones nuevas.',
      category: 'Crecimiento',
      difficulty: 'Normal',
      durationMinutes: 15,
      impulso: 25,
      chispas: 10,
      isCompleted: false,
      completedAt: null
    },
    {
      id: 'm-4',
      goalId: 'g-2',
      title: 'Bloque de Enfoque Profundo (Deep Work)',
      description: '45 minutos ininterrumpidos en la arquitectura del proyecto.',
      category: 'Finanzas',
      difficulty: 'Difícil',
      durationMinutes: 45,
      impulso: 50,
      chispas: 20,
      isCompleted: false,
      completedAt: null
    },
    {
      id: 'm-5',
      goalId: null,
      title: 'Desconexión Digital 45m antes de dormir',
      description: 'Preparar el santuario del sueño sin pantallas luminosas.',
      category: 'Bienestar',
      difficulty: 'Fácil',
      durationMinutes: 15,
      impulso: 10,
      chispas: 5,
      isCompleted: false,
      completedAt: null
    }
  ],
  completions: [
    {
      id: 'c-1',
      missionId: 'm-1',
      goalId: 'g-4',
      impulso: 10,
      chispas: 5,
      completedAt: '2026-09-11T08:15:00Z'
    }
  ],
  unlockedAchievements: ['FIRST_MISSION', 'STREAK_3', 'STREAK_7', 'LEVEL_4', 'FIRST_GOAL'],
  rewards: [
    {
      id: 'r-1',
      title: 'Protector de Racha (1 Congelador)',
      description: 'Protege tu racha durante 24h ante emergencias.',
      cost: 60,
      icon: 'ac_unit'
    },
    {
      id: 'r-2',
      title: 'Tarde Libre de Desconexión',
      description: 'Premio personal: 3 horas de lectura y café sereno.',
      cost: 120,
      icon: 'spa'
    },
    {
      id: 'r-3',
      title: 'Insignia de Aura Dorada',
      description: 'Destaca tu avatar en el perfil.',
      cost: 180,
      icon: 'stars'
    }
  ],
  userRewards: []
};

class Store {
  constructor() {
    this.storageKey = 'mision_app_state_v1';
    this.listeners = [];
    this.state = this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading from localStorage, using initial state', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  _save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
    this._notify();
  }

  _notify() {
    this.listeners.forEach(cb => cb(this.state));
  }

  subscribe(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  getState() {
    return this.state;
  }

  resetData() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this._save();
  }

  toggleMission(missionId) {
    const mission = this.state.dailyMissions.find(m => m.id === missionId);
    if (!mission) return { success: false };

    if (!mission.isCompleted) {
      // Complete mission
      mission.isCompleted = true;
      mission.completedAt = new Date().toISOString();

      // Rewards
      this.state.profile.totalImpulso += mission.impulso;
      this.state.profile.chispas += mission.chispas;

      // Register completion
      this.state.completions.push({
        id: 'comp-' + Date.now(),
        missionId: mission.id,
        goalId: mission.goalId,
        impulso: mission.impulso,
        chispas: mission.chispas,
        completedAt: new Date().toISOString()
      });

      // Recalculate linked goal if any
      if (mission.goalId) {
        const goal = this.state.goals.find(g => g.id === mission.goalId);
        if (goal) {
          goal.completedMissionsCount = (goal.completedMissionsCount || 0) + 1;
          goal.progress = Math.min(100, Math.round((goal.completedMissionsCount / (goal.totalMissionsTarget || 20)) * 100));
        }
      }

      // Check achievements
      const newlyUnlocked = window.GamificationEngine.evaluateAchievements(this.state);
      newlyUnlocked.forEach(ach => {
        this.state.unlockedAchievements.push(ach.code);
        this.state.profile.chispas += ach.reward;
      });

      this._save();
      return { success: true, mission, newlyUnlocked, wasCompleted: true };
    } else {
      // Revert completion
      mission.isCompleted = false;
      mission.completedAt = null;
      this.state.profile.totalImpulso = Math.max(0, this.state.profile.totalImpulso - mission.impulso);
      this.state.profile.chispas = Math.max(0, this.state.profile.chispas - mission.chispas);

      if (mission.goalId) {
        const goal = this.state.goals.find(g => g.id === mission.goalId);
        if (goal && goal.completedMissionsCount > 0) {
          goal.completedMissionsCount -= 1;
          goal.progress = Math.min(100, Math.round((goal.completedMissionsCount / (goal.totalMissionsTarget || 20)) * 100));
        }
      }

      this._save();
      return { success: true, mission, newlyUnlocked: [], wasCompleted: false };
    }
  }

  addGoal({ title, description, category, targetDate, totalMissionsTarget, icon, color }) {
    const newGoal = {
      id: 'g-' + Date.now(),
      title,
      description: description || 'Sin descripción',
      category: category || 'Crecimiento',
      status: 'active',
      icon: icon || 'flag',
      color: color || '#3A7D63',
      targetDate: targetDate || '2026-12-31',
      totalMissionsTarget: parseInt(totalMissionsTarget) || 20,
      completedMissionsCount: 0,
      progress: 0
    };
    this.state.goals.unshift(newGoal);

    // Check achievement for first goal
    const newlyUnlocked = window.GamificationEngine.evaluateAchievements(this.state);
    newlyUnlocked.forEach(ach => {
      this.state.unlockedAchievements.push(ach.code);
      this.state.profile.chispas += ach.reward;
    });

    this._save();
    return { newGoal, newlyUnlocked };
  }

  addMission({ title, description, category, difficulty, durationMinutes, goalId }) {
    const diff = difficulty || 'Normal';
    let impulso = 25;
    let chispas = 10;
    if (diff === 'Fácil') { impulso = 10; chispas = 5; }
    else if (diff === 'Difícil') { impulso = 50; chispas = 20; }
    else if (diff === 'Épica') { impulso = 100; chispas = 50; }

    const newMission = {
      id: 'm-' + Date.now(),
      goalId: goalId || null,
      title,
      description: description || '',
      category: category || 'Mente',
      difficulty: diff,
      durationMinutes: parseInt(durationMinutes) || 15,
      impulso,
      chispas,
      isCompleted: false,
      completedAt: null
    };

    this.state.dailyMissions.unshift(newMission);
    this._save();
    return newMission;
  }

  buyReward(rewardId) {
    const reward = this.state.rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, reason: 'Recompensa no encontrada' };

    if (this.state.profile.chispas < reward.cost) {
      return { success: false, reason: 'No tienes suficientes Chispas ✨' };
    }

    this.state.profile.chispas -= reward.cost;
    this.state.userRewards.push({
      id: 'ur-' + Date.now(),
      rewardId: reward.id,
      title: reward.title,
      purchasedAt: new Date().toISOString()
    });

    if (reward.id === 'r-1') {
      this.state.profile.freezes = (this.state.profile.freezes || 0) + 1;
    }

    this._save();
    return { success: true, reward };
  }
}

window.appStore = new Store();
