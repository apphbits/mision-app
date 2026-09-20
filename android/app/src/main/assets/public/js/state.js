// ====================================================================
// MISIÓN — Estado Reactivo y Persistencia (LocalStorage / Supabase Sync)
// ====================================================================

const INITIAL_STATE = {
  isAuthenticated: false,
  isOnboardingCompleted: false,
  profile: {
    fullName: 'Carlos',
    title: 'Aspirante',
    email: 'carlos@mision.app',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    totalImpulso: 0,
    chispas: 10,
    currentStreak: 0,
    bestStreak: 0,
    disciplineRate: 100,
    freezes: 0,
    notificationsEnabled: true
  },
  goals: [],
  dailyMissions: [],
  completions: [],
  unlockedAchievements: [],
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

const DEMO_FULL_STATE = {
  isAuthenticated: true,
  isOnboardingCompleted: true,
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
      title: 'Maestría y Fluidez en Inglés',
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
      title: 'Meditación Matutina Silenciosa (10 min)',
      description: '1. Siéntate con la espalda erguida en un lugar tranquilo.\n2. Cierra los ojos y enfócate en el ritmo de tu respiración.\n3. Si tu mente se distrae, regresa con serenidad a la respiración durante 10 min.',
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
      title: 'Caminata Consciente y Vitalidad (20 min)',
      description: '1. Sal al aire libre y camina a ritmo constante durante 20 minutos.\n2. Mantén hombros relajados y respiración profunda por la nariz.\n3. Conéctate con tu entorno sin revisar el celular durante el trayecto.',
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
      title: 'Lectura Profunda y Vocabulario en Inglés',
      description: '1. Lee 15 minutos un artículo, libro o lección en inglés.\n2. Anota 5 expresiones o palabras nuevas con su significado.\n3. Pronuncia cada palabra en voz alta y crea una frase de ejemplo.',
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
      title: 'Bloque de Enfoque Profundo (Deep Work 45m)',
      description: '1. Define el objetivo específico a resolver en esta sesión.\n2. Silencia notificaciones y pon el temporizador en 45 minutos.\n3. Trabaja sin interrupciones hasta completar la entrega prioritaria.',
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
      title: 'Desconexión Digital Nocturna (15 min)',
      description: '1. Apaga pantallas luminosas (móvil, laptop, TV) 45 min antes de dormir.\n2. Deja tu espacio en penumbra y bebe agua o té relajante.\n3. Realiza 5 respiraciones profundas preparando tu descanso.',
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
    this.storageKey = 'mision_app_state_v4';
    this.listeners = [];
    this.state = this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && (parsed.isOnboardingCompleted || (parsed.goals && parsed.goals.length > 0) || (parsed.dailyMissions && parsed.dailyMissions.length > 0))) {
          parsed.isOnboardingCompleted = true;
        }
        return parsed;
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

  loadDemoData() {
    this.state = JSON.parse(JSON.stringify(DEMO_FULL_STATE));
    this.state.isAuthenticated = true;
    this.state.isOnboardingCompleted = true;
    this._save();
  }

  loginUser({ email, fullName, avatarUrl } = {}) {
    this.state.isAuthenticated = true;
    this.state.isOnboardingCompleted = true;
    if (email) this.state.profile.email = email;
    if (fullName) this.state.profile.fullName = fullName;
    if (avatarUrl) this.state.profile.avatarUrl = avatarUrl;
    this._save();
    return this.state.profile;
  }

  syncSupabaseUserData({ dbProfile, dbGoals } = {}) {
    if (dbProfile) {
      if (dbProfile.full_name) this.state.profile.fullName = dbProfile.full_name;
      if (dbProfile.avatar_url) this.state.profile.avatarUrl = dbProfile.avatar_url;
      if (typeof dbProfile.total_impulso === 'number') this.state.profile.totalImpulso = dbProfile.total_impulso;
      if (typeof dbProfile.chispas === 'number') this.state.profile.chispas = dbProfile.chispas;
      if (typeof dbProfile.current_streak === 'number') this.state.profile.currentStreak = dbProfile.current_streak;
      if (typeof dbProfile.best_streak === 'number') this.state.profile.bestStreak = dbProfile.best_streak;
      if (typeof dbProfile.discipline_rate === 'number') this.state.profile.disciplineRate = dbProfile.discipline_rate;
    }
    if (Array.isArray(dbGoals) && dbGoals.length > 0) {
      this.state.goals = dbGoals.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        category: g.category || 'Crecimiento',
        status: g.status || 'active',
        icon: g.icon || 'flag',
        color: g.color || '#3A7D63',
        targetDate: g.target_date || '2026-12-31',
        totalMissionsTarget: g.total_missions_target || 20,
        completedMissionsCount: g.completed_missions_count || 0,
        progress: parseFloat(g.progress) || 0,
        roadmap: Array.isArray(g.roadmap) ? g.roadmap : [],
        missions: Array.isArray(g.missions) ? g.missions : []
      }));

      const allExtractedMissions = [];
      dbGoals.forEach(g => {
        if (Array.isArray(g.missions) && g.missions.length > 0) {
          g.missions.forEach((m, idx) => {
            const isDone = m.isCompleted === true || m.is_completed === true;
            allExtractedMissions.push({
              id: m.id || `m-sync-${g.id}-${idx}`,
              goalId: g.id,
              title: m.title || `Paso #${idx + 1}: Avanzar en ${g.title}`,
              description: m.description || `Acción diaria para tu meta: ${g.title}.`,
              category: m.category || g.category || 'Crecimiento',
              difficulty: m.difficulty || 'Normal',
              durationMinutes: m.durationMinutes || m.duration_minutes || 15,
              impulso: m.impulso || 25,
              chispas: m.chispas || 10,
              isCompleted: isDone,
              completedAt: m.completedAt || m.completed_at || (isDone ? new Date().toISOString() : null)
            });
          });
        }
      });

      if (allExtractedMissions.length > 0) {
        this.state.dailyMissions = allExtractedMissions;
      } else if (!this.state.dailyMissions || this.state.dailyMissions.length === 0) {
        this.state.dailyMissions = this.state.goals.map((g, idx) => ({
          id: 'm-sync-' + Date.now() + '-' + idx,
          goalId: g.id,
          title: `Avanzar en: ${g.title}`,
          description: g.description || `Acción diaria para tu meta: ${g.title}.`,
          category: g.category || 'Crecimiento',
          difficulty: 'Normal',
          durationMinutes: 15,
          impulso: 25,
          chispas: 10,
          isCompleted: false,
          completedAt: null
        }));
      }

      // Re-verify per-goal progress accurately
      this.state.goals.forEach(goal => {
        const linked = this.state.dailyMissions.filter(m => m.goalId === goal.id);
        if (linked.length > 0) {
          const done = linked.filter(m => m.isCompleted).length;
          goal.completedMissionsCount = done;
          const target = goal.totalMissionsTarget || linked.length;
          goal.progress = Math.min(100, Math.round((done / target) * 100));
        }
      });

      // Recalculate discipline rate
      const totalDaily = this.state.dailyMissions.length;
      const completedDaily = this.state.dailyMissions.filter(m => m.isCompleted).length;
      if (totalDaily > 0) {
        this.state.profile.disciplineRate = Math.round((completedDaily / totalDaily) * 100);
      }
    }
    this.state.isOnboardingCompleted = true;
    this._save();
  }

  registerUser({ email, fullName, avatarUrl } = {}) {
    this.state.isAuthenticated = true;
    this.state.isOnboardingCompleted = false;
    this.state.profile.email = email || 'usuario@mision.app';
    this.state.profile.fullName = fullName || 'Carlos';
    if (avatarUrl) this.state.profile.avatarUrl = avatarUrl;
    this.state.profile.totalImpulso = 0;
    this.state.profile.chispas = 10;
    this.state.profile.currentStreak = 0;
    this.state.goals = [];
    this.state.dailyMissions = [];
    this.state.completions = [];
    this.state.unlockedAchievements = [];
    this._save();
    return this.state.profile;
  }

  logoutUser() {
    this.state.isAuthenticated = false;
    this._save();
  }

  updateUserProfile({ fullName, avatarUrl, email } = {}) {
    if (fullName) this.state.profile.fullName = fullName;
    if (avatarUrl) this.state.profile.avatarUrl = avatarUrl;
    if (email) this.state.profile.email = email;
    this._save();
    return this.state.profile;
  }

  resetToOnboarding() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.state.isAuthenticated = true;
    this.state.isOnboardingCompleted = false;
    this._save();
  }

  completeOnboarding({ name, dream, meaning, dailyMinutes, missionTitle, missionDescription, category, icon, color }) {
    const goalId = 'g-' + Date.now();
    const newGoal = {
      id: goalId,
      title: dream,
      description: meaning || `Dedicación: ${dailyMinutes} min al día.`,
      category: category || 'Crecimiento',
      status: 'active',
      icon: icon || 'flag',
      color: color || '#3A7D63',
      targetDate: '2026-12-31',
      totalMissionsTarget: 20,
      completedMissionsCount: 0,
      progress: 0
    };

    const newMission = {
      id: 'm-' + Date.now(),
      goalId: goalId,
      title: missionTitle || `Dar el primer paso en: ${dream}`,
      description: missionDescription || `Paso inicial de ${dailyMinutes} minutos para construir tu meta: ${dream}.`,
      category: category || 'Crecimiento',
      difficulty: 'Fácil',
      durationMinutes: parseInt(dailyMinutes) || 5,
      impulso: 10,
      chispas: 5,
      isCompleted: false,
      completedAt: null
    };

    this.state.profile.fullName = name || 'Carlos';
    this.state.profile.title = 'Aspirante';
    this.state.profile.totalImpulso = 0;
    this.state.profile.chispas = 10;
    this.state.profile.currentStreak = 0;
    this.state.profile.bestStreak = 0;
    this.state.profile.disciplineRate = 100;

    this.state.goals = [newGoal];
    this.state.dailyMissions = [newMission];
    this.state.completions = [];
    this.state.unlockedAchievements = [];
    this.state.isOnboardingCompleted = true;

    this._save();
    return { newGoal, newMission };
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

      // Update Streak (starts at 1 upon completing first mission)
      if (!this.state.profile.currentStreak || this.state.profile.currentStreak === 0) {
        this.state.profile.currentStreak = 1;
      }
      if (this.state.profile.currentStreak > (this.state.profile.bestStreak || 0)) {
        this.state.profile.bestStreak = this.state.profile.currentStreak;
      }

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
          const linkedMissions = this.state.dailyMissions.filter(m => m.goalId === goal.id);
          const doneCount = linkedMissions.filter(m => m.isCompleted).length;
          goal.completedMissionsCount = doneCount;
          const target = goal.totalMissionsTarget || (linkedMissions.length > 0 ? linkedMissions.length : 20);
          goal.progress = Math.min(100, Math.round((doneCount / target) * 100));
        }
      }

      // Recalculate overall discipline rate
      const totalDaily = this.state.dailyMissions.length;
      const completedDaily = this.state.dailyMissions.filter(m => m.isCompleted).length;
      if (totalDaily > 0) {
        this.state.profile.disciplineRate = Math.round((completedDaily / totalDaily) * 100);
      }

      // Check achievements
      const newlyUnlocked = window.GamificationEngine.evaluateAchievements(this.state);
      newlyUnlocked.forEach(ach => {
        if (!this.state.unlockedAchievements.includes(ach.code)) {
          this.state.unlockedAchievements.push(ach.code);
          this.state.profile.chispas += ach.reward;
        }
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
        if (goal) {
          const linkedMissions = this.state.dailyMissions.filter(m => m.goalId === goal.id);
          const doneCount = linkedMissions.filter(m => m.isCompleted).length;
          goal.completedMissionsCount = doneCount;
          const target = goal.totalMissionsTarget || (linkedMissions.length > 0 ? linkedMissions.length : 20);
          goal.progress = Math.min(100, Math.round((doneCount / target) * 100));
        }
      }

      const totalDaily = this.state.dailyMissions.length;
      const completedDaily = this.state.dailyMissions.filter(m => m.isCompleted).length;
      if (totalDaily > 0) {
        this.state.profile.disciplineRate = Math.round((completedDaily / totalDaily) * 100);
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

  addGoalWithMissions({ title, description, category, targetDate, totalMissionsTarget, icon, color, roadmap, missions }) {
    const goalId = 'g-' + Date.now();
    const catIcons = {
      Mente: 'spa', Cuerpo: 'fitness_center', Relaciones: 'favorite', Crecimiento: 'language',
      Finanzas: 'savings', Creatividad: 'palette', Experiencias: 'flight_takeoff', Bienestar: 'local_florist'
    };
    const catColors = {
      Mente: '#4B8FB2', Cuerpo: '#4A7C59', Relaciones: '#E05A47', Crecimiento: '#3A7D63',
      Finanzas: '#B87547', Creatividad: '#8E54A2', Experiencias: '#2D82B7', Bienestar: '#22C55E'
    };

    const newGoal = {
      id: goalId,
      title,
      description: description || 'Sin descripción',
      category: category || 'Crecimiento',
      status: 'active',
      icon: icon || catIcons[category] || 'flag',
      color: color || catColors[category] || '#3A7D63',
      targetDate: targetDate || '2026-12-31',
      totalMissionsTarget: parseInt(totalMissionsTarget) || (missions && missions.length ? missions.length : 20),
      completedMissionsCount: 0,
      progress: 0,
      roadmap: Array.isArray(roadmap) && roadmap.length > 0 ? roadmap : [
        { stage: 1, title: 'Etapa 1: Activación y ritmo base diario', status: 'En progreso' },
        { stage: 2, title: 'Etapa 2: Consistencia e incremento de intensidad', status: 'Próxima' },
        { stage: 3, title: 'Etapa 3: Consolidación y maestría vital', status: 'Futura' }
      ]
    };
    this.state.goals.unshift(newGoal);

    const createdMissions = [];
    if (Array.isArray(missions) && missions.length > 0) {
      missions.forEach((m, idx) => {
        const diff = m.difficulty || 'Normal';
        let impulso = 25;
        let chispas = 10;
        if (diff === 'Fácil') { impulso = 10; chispas = 5; }
        else if (diff === 'Difícil') { impulso = 50; chispas = 20; }
        else if (diff === 'Épica') { impulso = 100; chispas = 50; }

        const newMission = {
          id: 'm-' + (Date.now() + idx + 1),
          goalId: goalId,
          title: m.title || `Paso #${idx + 1}: Avanzar en ${title}`,
          description: m.description || `Instrucciones paso a paso para avanzar en tu meta: ${title}.`,
          category: m.category || category || 'Crecimiento',
          difficulty: diff,
          durationMinutes: parseInt(m.durationMinutes || m.duration_minutes) || 15,
          impulso,
          chispas,
          isCompleted: false,
          completedAt: null
        };
        createdMissions.push(newMission);
      });
      // Prepend all new missions preserving their natural 1->2->3->4->5 order
      this.state.dailyMissions = [...createdMissions, ...this.state.dailyMissions];
    }

    // Check achievement for first goal
    const newlyUnlocked = window.GamificationEngine.evaluateAchievements(this.state);
    newlyUnlocked.forEach(ach => {
      this.state.unlockedAchievements.push(ach.code);
      this.state.profile.chispas += ach.reward;
    });

    this._save();
    return { newGoal, createdMissions, newlyUnlocked };
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

  deleteGoal(goalId) {
    const goalIndex = this.state.goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return { success: false };

    const [deletedGoal] = this.state.goals.splice(goalIndex, 1);
    // Also delete linked missions
    this.state.dailyMissions = this.state.dailyMissions.filter(m => m.goalId !== goalId);

    this._save();
    return { success: true, deletedGoal };
  }

  deleteMission(missionId) {
    const missionIndex = this.state.dailyMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) return { success: false };

    const [deletedMission] = this.state.dailyMissions.splice(missionIndex, 1);

    // If mission was linked to a goal and completed, adjust goal counters
    if (deletedMission.goalId) {
      const goal = this.state.goals.find(g => g.id === deletedMission.goalId);
      if (goal && deletedMission.isCompleted) {
        goal.completedMissionsCount = Math.max(0, (goal.completedMissionsCount || 1) - 1);
        goal.progress = Math.min(100, Math.round((goal.completedMissionsCount / (goal.totalMissionsTarget || 20)) * 100));
      }
    }

    this._save();
    return { success: true, deletedMission };
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
