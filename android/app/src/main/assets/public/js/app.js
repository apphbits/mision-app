// ====================================================================
// MISIÓN — Controlador Principal de la Aplicación (UI / Eventos / Render)
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'hoy';
  let activeCategoryFilter = 'all';

  // Supabase Global Client Initialization
  const SUPABASE_URL = "https://bxgdaqcnphulhfchfqnf.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_IExyjYiifrQe-_pWU5qgpw_HqZnZNhm";
  let sbClient = null;
  if (window.supabase) {
    try {
      sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      window.sbClient = sbClient;
    } catch (e) {
      console.warn('Supabase initialization notice:', e);
    }
  }

  // Onboarding Workflow State
  const onboardingState = {
    step: 1,
    category: 'Crecimiento',
    dream: 'Aprender inglés con fluidez',
    icon: 'language',
    meaning: 'Poder mantener una conversación y viajar con confianza',
    dailyMinutes: 5,
    missionTitle: 'Aprender 5 palabras nuevas en inglés',
    isCustom: false
  };

  // Meanings Catalog per Category / Dream
  const MEANINGS_CATALOG = {
    Cuerpo: [
      'Sentirme con vitalidad y energía cada mañana',
      'Sentirme seguro, ligero y en armonía con mi cuerpo',
      'Superar mis límites físicos y cuidar mi salud futura',
      'Liberar estrés mediante el movimiento'
    ],
    Crecimiento: [
      'Poder mantener una conversación y viajar con confianza',
      'Entender libros, películas y contenidos sin barreras',
      'Conseguir mejores oportunidades profesionales y proyectos',
      'Expandir mi mente y dominar una nueva habilidad'
    ],
    Finanzas: [
      'Construir tranquilidad y libertad financiera sin estrés',
      'Ahorrar con propósito para mis metas más queridas',
      'Tener autonomía para decidir cómo vivo mi tiempo',
      'Invertir en mi futuro y el de mi familia'
    ],
    Experiencias: [
      'Vivir momentos memorables y conocer nuevas culturas',
      'Cumplir una meta que llevo soñando mucho tiempo',
      'Salir de la rutina y expandir mis horizontes',
      'Crear anécdotas e historias para toda la vida'
    ],
    Mente: [
      'Vivir con mayor serenidad, presencia y paz interior',
      'Reducir el ruido mental y el estrés cotidiano',
      'Tener un enfoque limpio en lo que realmente importa',
      'Aprender a disfrutar el momento presente'
    ],
    Relaciones: [
      'Estar verdaderamente presente con las personas que amo',
      'Fortalecer vínculos sinceros con familia y amigos',
      'Comunicarme con empatía y autenticidad',
      'Compartir momentos de calidad sin distracciones'
    ]
  };

  // Confetti Particle System
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#3A7D63', '#F3A871', '#22C55E', '#FEB06D', '#B8DFCD'];
    const particles = Array.from({ length: 65 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2 + 80,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1.2) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1
    }));

    let animationId;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;
        p.opacity -= 0.015;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  // Toast Notification
  function showToast(message, icon = 'check_circle', isSpark = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl ${
      isSpark ? 'bg-[#FFF8F3] border border-[#FCD9C2] text-[#B87547]' : 'bg-[#27303A] text-white'
    } shadow-float font-medium text-xs md:text-sm tracking-tight`;

    toast.innerHTML = `
      <span class="material-symbols-outlined text-[20px] ${isSpark ? 'text-[#F3A871]' : 'text-[#22C55E]'}" style="font-variation-settings: 'FILL' 1;">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  // ====================================================================
  // ONBOARDING CONTROLLER LOGIC
  // ====================================================================

  function initOnboardingUI() {
    const dreamCards = document.querySelectorAll('#dream-presets-list .dream-card');
    const customDreamInput = document.getElementById('input-custom-dream');
    const clearCustomBtn = document.getElementById('btn-clear-custom-dream');
    const btnToStep2 = document.getElementById('btn-onboarding-to-step2');
    const btnBackToStep1 = document.getElementById('btn-back-to-step1');
    const btnToStep3 = document.getElementById('btn-onboarding-to-step3');
    const btnBackToStep2 = document.getElementById('btn-back-to-step2');
    const btnCompleteOnboarding = document.getElementById('btn-complete-onboarding');

    // Preset selection
    dreamCards.forEach(card => {
      card.addEventListener('click', () => {
        window.soundEngine.playClick();
        dreamCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        if (customDreamInput) customDreamInput.value = '';
        if (clearCustomBtn) clearCustomBtn.classList.add('hidden');

        onboardingState.category = card.dataset.category || 'Crecimiento';
        onboardingState.dream = card.dataset.dream || card.querySelector('h4').textContent.trim();
        onboardingState.icon = card.dataset.icon || 'flag';
        onboardingState.meaning = card.dataset.meaning || 'Avanzar con constancia diaria';
        onboardingState.missionTitle = card.dataset.mission || `Primer paso para: ${onboardingState.dream}`;
        onboardingState.isCustom = false;
      });
    });

    // Default select first card if none
    if (dreamCards.length > 0 && !document.querySelector('#dream-presets-list .dream-card.selected')) {
      dreamCards[1].classList.add('selected'); // Default on English / Learning
      onboardingState.category = dreamCards[1].dataset.category;
      onboardingState.dream = dreamCards[1].dataset.dream;
      onboardingState.icon = dreamCards[1].dataset.icon;
      onboardingState.meaning = dreamCards[1].dataset.meaning;
      onboardingState.missionTitle = dreamCards[1].dataset.mission;
    }

    // Custom Dream input
    if (customDreamInput) {
      customDreamInput.addEventListener('input', () => {
        const val = customDreamInput.value.trim();
        if (val.length > 0) {
          dreamCards.forEach(c => c.classList.remove('selected'));
          if (clearCustomBtn) clearCustomBtn.classList.remove('hidden');
          onboardingState.dream = val;
          onboardingState.isCustom = true;
          onboardingState.category = detectCategoryFromText(val);
          onboardingState.icon = 'flag';
          onboardingState.meaning = `Alcanzar mi meta de: ${val}`;
          onboardingState.missionTitle = `Primer bloque de enfoque para ${val}`;
        } else {
          if (clearCustomBtn) clearCustomBtn.classList.add('hidden');
          if (dreamCards.length > 0) {
            dreamCards[0].classList.add('selected');
            onboardingState.dream = dreamCards[0].dataset.dream;
            onboardingState.isCustom = false;
          }
        }
      });

      clearCustomBtn?.addEventListener('click', () => {
        customDreamInput.value = '';
        clearCustomBtn.classList.add('hidden');
        if (dreamCards.length > 0) {
          dreamCards[0].click();
        }
      });
    }

    // Navigation Step 1 -> Step 2
    btnToStep2?.addEventListener('click', () => {
      if (!onboardingState.dream) {
        showToast('Por favor elige o escribe tu sueño para comenzar', 'info');
        return;
      }
      window.soundEngine.playSpark();
      goToOnboardingStep(2);
    });

    // Navigation Step 2 -> Step 1
    btnBackToStep1?.addEventListener('click', () => {
      window.soundEngine.playClick();
      goToOnboardingStep(1);
    });

    // Navigation Step 2 -> Step 3
    btnToStep3?.addEventListener('click', () => {
      const customMeaningInput = document.getElementById('input-custom-meaning');
      if (customMeaningInput && customMeaningInput.value.trim()) {
        onboardingState.meaning = customMeaningInput.value.trim();
      }
      window.soundEngine.playSpark();
      generateSmartFirstMission();
      goToOnboardingStep(3);
    });

    // Navigation Step 3 -> Step 2
    btnBackToStep2?.addEventListener('click', () => {
      window.soundEngine.playClick();
      goToOnboardingStep(2);
    });

    // Time option pills in Step 2
    const timePills = document.querySelectorAll('#time-options-container .time-pill');
    timePills.forEach(pill => {
      pill.addEventListener('click', () => {
        window.soundEngine.playClick();
        timePills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        onboardingState.dailyMinutes = parseInt(pill.dataset.minutes) || 5;
      });
    });

    // Final Onboarding Completion
    btnCompleteOnboarding?.addEventListener('click', () => {
      finishOnboarding();
    });
  }

  function detectCategoryFromText(text) {
    const lower = text.toLowerCase();
    if (lower.includes('peso') || lower.includes('ejercicio') || lower.includes('salud') || lower.includes('correr') || lower.includes('gimnasio') || lower.includes('dieta') || lower.includes('comer')) return 'Cuerpo';
    if (lower.includes('dinero') || lower.includes('ahorrar') || lower.includes('finanzas') || lower.includes('inversion') || lower.includes('deuda') || lower.includes('gasto')) return 'Finanzas';
    if (lower.includes('negocio') || lower.includes('proyecto') || lower.includes('empresa') || lower.includes('cliente') || lower.includes('vender') || lower.includes('startup')) return 'Finanzas';
    if (lower.includes('viajar') || lower.includes('viaje') || lower.includes('conocer') || lower.includes('mundo') || lower.includes('avion') || lower.includes('playa')) return 'Experiencias';
    if (lower.includes('medit') || lower.includes('paz') || lower.includes('ansiedad') || lower.includes('calma') || lower.includes('estres') || lower.includes('mente')) return 'Mente';
    if (lower.includes('pareja') || lower.includes('amigo') || lower.includes('familia') || lower.includes('hijo') || lower.includes('relacion')) return 'Relaciones';
    return 'Crecimiento';
  }

  function goToOnboardingStep(stepNum) {
    onboardingState.step = stepNum;
    window.soundEngine.playScreenTransition();
    
    // Switch slide visibility cleanly to fit content height without blank space
    for (let s = 1; s <= 3; s++) {
      const slide = document.getElementById(`onboarding-step-${s}`);
      if (slide) {
        if (s === stepNum) {
          slide.classList.remove('hidden');
          slide.style.display = 'flex';
          slide.classList.remove('onboarding-step-animate');
          // Trigger reflow to restart CSS animation
          void slide.offsetWidth;
          slide.classList.add('onboarding-step-animate');
        } else {
          slide.classList.add('hidden');
          slide.style.display = 'none';
          slide.classList.remove('onboarding-step-animate');
        }
      }
    }

    if (stepNum === 2) {
      populateStep2();
    } else if (stepNum === 3) {
      populateStep3();
    }

    const mainContent = document.getElementById('app-main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const screenEl = document.querySelector('.simulator-screen');
    if (screenEl) {
      screenEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function populateStep2() {
    const previewEl = document.getElementById('step2-dream-preview');
    if (previewEl) previewEl.textContent = onboardingState.dream;

    const meaningContainer = document.getElementById('meaning-options-container');
    if (meaningContainer) {
      const suggestions = MEANINGS_CATALOG[onboardingState.category] || MEANINGS_CATALOG.Crecimiento;
      meaningContainer.innerHTML = suggestions.map((sug, idx) => `
        <div class="meaning-option p-2.5 rounded-xl border border-[#EAECE6] bg-[#FAFAF8] text-xs font-medium text-charcoal hover:border-[#3A7D63] cursor-pointer transition-all flex items-center justify-between ${idx === 0 ? 'selected-meaning bg-[#F0F7F4] border-[#3A7D63] text-primary-700 font-bold' : ''}" data-meaning="${sug}">
          <span>${sug}</span>
          <span class="material-symbols-outlined text-[16px] text-primary-600">${idx === 0 ? 'check_circle' : 'radio_button_unchecked'}</span>
        </div>
      `).join('');

      onboardingState.meaning = suggestions[0];

      meaningContainer.querySelectorAll('.meaning-option').forEach(opt => {
        opt.addEventListener('click', () => {
          window.soundEngine.playClick();
          meaningContainer.querySelectorAll('.meaning-option').forEach(o => {
            o.classList.remove('selected-meaning', 'bg-[#F0F7F4]', 'border-[#3A7D63]', 'text-primary-700', 'font-bold');
            o.querySelector('.material-symbols-outlined').textContent = 'radio_button_unchecked';
          });
          opt.classList.add('selected-meaning', 'bg-[#F0F7F4]', 'border-[#3A7D63]', 'text-primary-700', 'font-bold');
          opt.querySelector('.material-symbols-outlined').textContent = 'check_circle';
          onboardingState.meaning = opt.dataset.meaning;
        });
      });
    }
  }

  async function generateSmartFirstMission() {
    const dream = onboardingState.dream;
    const minutes = onboardingState.dailyMinutes;
    const meaning = onboardingState.meaning;
    const category = onboardingState.category;

    // Set immediate default heuristic with concrete step-by-step instructions
    const dreamLower = dream.toLowerCase();
    if (dreamLower.includes('inglés') || dreamLower.includes('idioma')) {
      onboardingState.missionTitle = `Aprender y pronunciar 5 palabras nuevas en inglés`;
      onboardingState.aiMissionDesc = `1. Elige 5 palabras útiles en inglés sobre tu día.\n2. Escribe su significado y una frase de ejemplo.\n3. Repítelas en voz alta 3 veces para fijar tu memoria.`;
      onboardingState.icon = 'language';
    } else if (dreamLower.includes('peso') || dreamLower.includes('salud') || dreamLower.includes('ejercicio') || dreamLower.includes('correr') || dreamLower.includes('gimnasio')) {
      onboardingState.missionTitle = `Caminata activa y estiramiento consciente`;
      onboardingState.aiMissionDesc = `1. Sal a caminar ${minutes} minutos a ritmo constante.\n2. Presta atención a tu respiración y postura corporal.\n3. Finaliza con 2 minutos de estiramiento suave para activar tu energía.`;
      onboardingState.icon = 'fitness_center';
    } else if (dreamLower.includes('finanza') || dreamLower.includes('ahorro') || dreamLower.includes('dinero')) {
      onboardingState.missionTitle = `Registro de los 3 gastos clave de hoy`;
      onboardingState.aiMissionDesc = `1. Revisa tus movimientos o recibos del día.\n2. Anota los 3 gastos principales y clasifícalos (Necesario / Deseo).\n3. Identifica una oportunidad de ahorro para mañana.`;
      onboardingState.icon = 'savings';
    } else if (dreamLower.includes('negocio') || dreamLower.includes('proyecto') || dreamLower.includes('emprender')) {
      onboardingState.missionTitle = `Redactar la propuesta de valor en 3 frases`;
      onboardingState.aiMissionDesc = `1. Define a quién ayuda tu proyecto y qué problema resuelve.\n2. Escribe en 3 líneas simples por qué un cliente te elegiría.\n3. Léelo en voz alta para comprobar que sea claro e inspirador.`;
      onboardingState.icon = 'rocket_launch';
    } else if (dreamLower.includes('viaj') || dreamLower.includes('mundo')) {
      onboardingState.missionTitle = `Investigar 1 destino y calcular presupuesto inicial`;
      onboardingState.aiMissionDesc = `1. Elige 1 lugar al que desees viajar este año.\n2. Revisa costos promedio de transporte y estadía por 3 días.\n3. Define una cifra meta mensual para hacer realidad el viaje.`;
      onboardingState.icon = 'flight_takeoff';
    } else if (dreamLower.includes('medit') || dreamLower.includes('mente') || dreamLower.includes('calma')) {
      onboardingState.missionTitle = `Sesión de respiración 4-6 en silencio (${minutes} min)`;
      onboardingState.aiMissionDesc = `1. Siéntate con la espalda recta en un lugar tranquilo.\n2. Inhala por la nariz en 4 segundos y exhala en 6 segundos.\n3. Mantén este ritmo durante ${minutes} minutos cultivando calma mental.`;
      onboardingState.icon = 'spa';
    } else if (dreamLower.includes('libro') || dreamLower.includes('leer')) {
      onboardingState.missionTitle = `Lectura enfocada de 5 páginas con notas`;
      onboardingState.aiMissionDesc = `1. Abre tu libro y pon un temporizador de ${minutes} minutos.\n2. Lee 5 páginas sin mirar notificaciones ni el móvil.\n3. Anota la idea más valiosa en tus notas para aplicarla hoy.`;
      onboardingState.icon = 'menu_book';
    } else {
      onboardingState.missionTitle = `Acción de enfoque (${minutes} min) para: ${onboardingState.dream}`;
      onboardingState.aiMissionDesc = `1. Dedica ${minutes} minutos ininterrumpidos a avanzar en este objetivo.\n2. Realiza el primer paso concreto sin postergar.\n3. Marca la misión como completada para ganar tu Impulso del día.`;
      onboardingState.icon = 'flag';
    }

    // Try Real-time Gemini AI Generation
    const geminiKey = window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
        const prompt = `Eres el Arquitecto de Metas de MISIÓN. Convierte este sueño en una primera micromisión concreta de ${minutes} minutos en el mundo real:
Sueño: "${dream}"
Significado: "${meaning}"
Categoría: "${category}"

Responde en formato JSON con la siguiente estructura:
{
  "goal_title": "Título conciso de la meta",
  "goal_description": "Descripción motivadora y clara",
  "mission_title": "Título de la primera micromisión ultra-específica",
  "mission_description": "Instrucción de paso simple paso a paso",
  "category": "${category}"
}`;

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed.mission_title) {
              onboardingState.missionTitle = parsed.mission_title;
              if (parsed.mission_description) {
                onboardingState.aiMissionDesc = parsed.mission_description;
              }
              if (parsed.goal_title) {
                onboardingState.aiGoalTitle = parsed.goal_title;
              }
              populateStep3();
            }
          }
        }
      } catch (aiErr) {
        console.warn('AI live call failed, using heuristic:', aiErr);
      }
    }
  }

  function populateStep3() {
    const titleEl = document.getElementById('step3-mission-title');
    const descEl = document.getElementById('step3-mission-desc');
    const categoryBadgeEl = document.getElementById('step3-category-badge');
    const timeLabelEl = document.getElementById('step3-time-label');

    if (titleEl) titleEl.textContent = onboardingState.missionTitle;
    if (descEl) {
      descEl.textContent = onboardingState.aiMissionDesc || `Paso inicial de ${onboardingState.dailyMinutes} minutos para construir tu meta: ${onboardingState.dream}`;
    }
    if (categoryBadgeEl) categoryBadgeEl.textContent = onboardingState.category;
    if (timeLabelEl) timeLabelEl.textContent = `${onboardingState.dailyMinutes} min`;
  }

  function finishOnboarding() {
    const state = window.appStore.getState();
    const name = state.profile.fullName || 'Carlos';
    const descEl = document.getElementById('step3-mission-desc');
    const missionDesc = onboardingState.aiMissionDesc || descEl?.textContent || `Paso inicial de ${onboardingState.dailyMinutes} minutos para construir tu meta: ${onboardingState.dream}.`;

    window.appStore.completeOnboarding({
      name,
      dream: onboardingState.aiGoalTitle || onboardingState.dream,
      meaning: onboardingState.meaning,
      dailyMinutes: onboardingState.dailyMinutes,
      missionTitle: onboardingState.missionTitle,
      missionDescription: missionDesc,
      category: onboardingState.category,
      icon: onboardingState.icon,
      color: '#3A7D63'
    });

    window.soundEngine.playLevelUp();
    launchConfetti();
    showToast(`¡Bienvenido a MISIÓN! Tu primera meta y misión están listas 🚀`, 'rocket_launch', false);

    switchTab('hoy');
    renderAll();
  }

  // ====================================================================
  // RENDER APP & AUTH STATE
  // ====================================================================

  function renderAll() {
    const state = window.appStore.getState();
    const progression = window.GamificationEngine.calculateProgression(state.profile.totalImpulso);

    const mainHeader = document.getElementById('app-main-header');
    const viewAuth = document.getElementById('view-auth');
    const viewOnboarding = document.getElementById('view-onboarding');
    const headerWidgets = document.getElementById('header-user-widgets');
    const bottomNav = document.getElementById('bottom-nav-bar');

    // 1. If not authenticated, always show Auth View first
    if (!state.isAuthenticated) {
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      if (viewAuth) viewAuth.classList.add('active');
      if (mainHeader) mainHeader.classList.add('hidden');
      if (headerWidgets) headerWidgets.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
      return;
    }

    // 2. If authenticated but onboarding not completed, show Onboarding
    if (!state.isOnboardingCompleted) {
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      if (viewOnboarding) viewOnboarding.classList.add('active');
      if (mainHeader) mainHeader.classList.add('hidden');
      if (headerWidgets) headerWidgets.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
      goToOnboardingStep(onboardingState.step || 1);
      return;
    }

    // 3. Authenticated and Onboarding completed -> Full Dashboard
    if (viewAuth) viewAuth.classList.remove('active');
    if (viewOnboarding) viewOnboarding.classList.remove('active');
    if (mainHeader) mainHeader.classList.remove('hidden');
    if (headerWidgets) headerWidgets.classList.remove('hidden');
    if (bottomNav) bottomNav.classList.remove('hidden');

    // Ensure the active tab view is active
    document.querySelectorAll('.view-panel').forEach(panel => {
      if (panel.id !== `view-${activeTab || 'hoy'}`) {
        panel.classList.remove('active');
      }
    });
    const currentPanel = document.getElementById(`view-${activeTab || 'hoy'}`);
    if (currentPanel) {
      currentPanel.classList.add('active');
    }

    renderHeader(state, progression);
    renderHoyView(state, progression);
    renderMetasView(state);
    renderEvolucionView(state, progression);
    renderPerfilView(state, progression);
  }

  function renderHeader(state, progression) {
    const sparkCountEls = document.querySelectorAll('.header-spark-count');
    sparkCountEls.forEach(el => el.textContent = state.profile.chispas);

    const levelBadgeEls = document.querySelectorAll('.header-level-badge');
    levelBadgeEls.forEach(el => el.textContent = `Nv. ${progression.level} · ${progression.title}`);

    const streakCountEls = document.querySelectorAll('.header-streak-count');
    streakCountEls.forEach(el => el.textContent = state.profile.currentStreak);

    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar && state.profile.avatarUrl) {
      headerAvatar.src = state.profile.avatarUrl;
    }

    const onboardingNameDisplay = document.getElementById('onboarding-name-display');
    if (onboardingNameDisplay) onboardingNameDisplay.textContent = state.profile.fullName;
  }

  function renderHoyView(state, progression) {
    // Hero bento
    const heroLevel = document.getElementById('hoy-hero-level');
    const heroTitle = document.getElementById('hoy-hero-title');
    const heroImpulso = document.getElementById('hoy-hero-impulso');
    const heroBar = document.getElementById('hoy-hero-bar');
    const heroStreak = document.getElementById('hoy-hero-streak');
    const heroSparks = document.getElementById('hoy-hero-sparks');

    if (heroLevel) heroLevel.textContent = `NIVEL ${progression.level}`;
    if (heroTitle) heroTitle.textContent = progression.title;
    if (heroImpulso) heroImpulso.textContent = `${progression.currentXPInLevel} / ${progression.xpNeededInLevel} ⚡ (${progression.percentage}%)`;
    if (heroBar) heroBar.style.width = `${progression.percentage}%`;
    if (heroStreak) heroStreak.textContent = state.profile.currentStreak;
    if (heroSparks) heroSparks.textContent = state.profile.chispas;

    // Filter Chips
    const chipsContainer = document.getElementById('category-chips');
    if (chipsContainer) {
      const categories = ['all', 'Mente', 'Cuerpo', 'Crecimiento', 'Finanzas', 'Bienestar', 'Experiencias', 'Relaciones'];
      chipsContainer.innerHTML = categories.map(cat => {
        const isActive = activeCategoryFilter === cat;
        const label = cat === 'all' ? 'Todas' : cat;
        return `
          <button data-cat="${cat}" class="category-chip px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            isActive 
              ? 'bg-[#3A7D63] text-white shadow-sm' 
              : 'bg-white text-[#596573] border border-[#EAECE6] hover:bg-[#F2F3EE]'
          }">
            ${label}
          </button>
        `;
      }).join('');

      chipsContainer.querySelectorAll('.category-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          window.soundEngine.playClick();
          activeCategoryFilter = btn.dataset.cat;
          renderHoyView(state, progression);
        });
      });
    }

    // Daily Missions List
    const missionsList = document.getElementById('daily-missions-list');
    if (missionsList) {
      const filtered = state.dailyMissions.filter(m => {
        if (activeCategoryFilter === 'all') return true;
        return m.category === activeCategoryFilter;
      });

      if (filtered.length === 0) {
        missionsList.innerHTML = `
          <div class="p-8 text-center bg-white rounded-3xl border border-[#EAECE6] text-[#596573]">
            <span class="material-symbols-outlined text-4xl text-[#3A7D63]/50 mb-2">task_alt</span>
            <p class="font-bold text-sm">No hay misiones en esta categoría</p>
            <p class="text-xs text-[#8A96A3] mt-1">Explora otra categoría o agrega una nueva acción.</p>
          </div>
        `;
      } else {
        missionsList.innerHTML = filtered.map(mission => {
          const isDone = mission.isCompleted;
          const goal = mission.goalId ? state.goals.find(g => g.id === mission.goalId) : null;
          return `
            <div data-id="${mission.id}" class="mission-card relative overflow-hidden rounded-2xl bg-white p-4 soft-shadow border border-[#EAECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 cursor-pointer hover:border-[#3A7D63] transition-all ${isDone ? 'is-completed' : ''}">
              <div class="flex items-start gap-3.5 flex-1 min-w-0">
                <button data-id="${mission.id}" class="btn-check-mission w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isDone 
                    ? 'bg-[#22C55E] border-[#22C55E] text-white shadow-glow-leaf' 
                    : 'border-[#D7DDD4] bg-[#F8F9F7] text-transparent hover:border-[#3A7D63]'
                }">
                  <span class="material-symbols-outlined text-[18px]">check</span>
                </button>
                <div class="flex flex-col flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded-md bg-[#F2F3EE] text-[10px] font-bold text-[#3A7D63] uppercase tracking-wide">
                      ${mission.category}
                    </span>
                    <span class="px-2 py-0.5 rounded-md bg-[#F0F7F4] text-[10px] font-semibold text-[#3A7D63]">
                      ⏱️ ${mission.durationMinutes || mission.duration || 5} min
                    </span>
                    ${goal ? `<span class="text-[11px] font-medium text-[#8A96A3]">· ${goal.title}</span>` : ''}
                  </div>
                  <h4 class="font-bold text-[14.5px] text-[#27303A] leading-snug">${mission.title}</h4>
                  <p class="text-[12.5px] text-[#596573] leading-relaxed mt-1 whitespace-pre-line">${mission.description || 'Paso diario enfocado para avanzar con constancia.'}</p>
                </div>
              </div>
              
              <div class="flex items-center sm:flex-col items-end shrink-0 gap-1.5 self-end sm:self-center">
                <div class="flex items-center gap-1.5 text-xs font-bold text-[#3A7D63] bg-[#F0F7F4] px-2.5 py-1 rounded-lg border border-[#DBEFE6]">
                  <span>+${mission.impulso}</span>
                  <span class="text-[11px]">⚡</span>
                </div>
                <div class="flex items-center gap-1 text-[11px] font-semibold text-[#B87547] bg-[#FFF8F3] px-2 py-0.5 rounded-lg border border-[#FCD9C2]">
                  <span>+${mission.chispas}</span>
                  <span class="text-[10px]">✨</span>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Card Click -> Open Detail Modal
        missionsList.querySelectorAll('.mission-card').forEach(card => {
          card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-check-mission')) return;
            const id = card.dataset.id;
            if (id) openMissionDetailModal(id);
          });
        });

        missionsList.querySelectorAll('.btn-check-mission').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const res = window.appStore.toggleMission(id);
            if (res.success) {
              if (res.wasCompleted) {
                window.soundEngine.playMissionComplete();
                launchConfetti();
                showToast(`¡Misión cumplida! +${res.mission.impulso}⚡ +${res.mission.chispas}✨`);
                if (res.newlyUnlocked.length > 0) {
                  setTimeout(() => {
                    window.soundEngine.playLevelUp();
                    showToast(`🏆 ¡Logro desbloqueado: ${res.newlyUnlocked[0].title}! +${res.newlyUnlocked[0].reward}✨`, 'workspace_premium', true);
                  }, 600);
                }
              } else {
                window.soundEngine.playClick();
                showToast('Misión marcada como pendiente', 'undo');
              }
              renderAll();
            }
          });
        });
      }
    }

    // Goals preview strip in Hoy
    const goalsStrip = document.getElementById('hoy-goals-preview');
    if (goalsStrip) {
      if (state.goals.length === 0) {
        goalsStrip.innerHTML = `
          <div class="col-span-2 p-4 text-center rounded-2xl bg-white border border-[#EAECE6] text-xs text-charcoal-muted">
            No tienes metas activas aún.
          </div>
        `;
      } else {
        goalsStrip.innerHTML = state.goals.slice(0, 2).map(goal => `
          <div data-goal-id="${goal.id}" class="goal-card-clickable p-3.5 rounded-2xl bg-white soft-shadow border border-[#EAECE6] flex flex-col justify-between space-y-2 group">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-[#3A7D63] uppercase tracking-wider">${goal.category}</span>
              <span class="text-xs font-bold text-[#27303A]">${goal.progress}%</span>
            </div>
            <div>
              <h5 class="font-bold text-[13.5px] text-[#27303A] truncate leading-tight group-hover:text-[#3A7D63] transition-colors">${goal.title}</h5>
              <p class="text-[11px] text-[#596573] truncate mt-0.5">${goal.completedMissionsCount}/${goal.totalMissionsTarget} acciones</p>
            </div>
            <div class="w-full h-1.5 rounded-full bg-[#EAECE6] overflow-hidden">
              <div class="h-full rounded-full bg-[#3A7D63] transition-all duration-500" style="width: ${goal.progress}%;"></div>
            </div>
          </div>
        `).join('');

        goalsStrip.querySelectorAll('.goal-card-clickable').forEach(card => {
          card.addEventListener('click', () => {
            const gid = card.dataset.goalId;
            if (gid) openGoalDetailModal(gid);
          });
        });
      }
    }
  }

  function renderMetasView(state) {
    const goalsList = document.getElementById('vital-goals-list');
    if (!goalsList) return;

    if (state.goals.length === 0) {
      goalsList.innerHTML = `
        <div class="p-8 text-center bg-white rounded-3xl border border-[#EAECE6] text-[#596573]">
          <span class="material-symbols-outlined text-4xl text-[#3A7D63]/50 mb-2">flag</span>
          <p class="font-bold text-sm">Aún no has creado metas</p>
          <p class="text-xs text-[#8A96A3] mt-1">Plantea un nuevo sueño con el botón superior.</p>
        </div>
      `;
      return;
    }

    goalsList.innerHTML = state.goals.map(goal => `
      <div data-goal-id="${goal.id}" class="goal-card-clickable w-full bg-white rounded-3xl p-5 soft-shadow border border-[#EAECE6] flex flex-col space-y-3.5 relative overflow-hidden group">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#F0F7F4] border border-[#DBEFE6] flex items-center justify-center text-[#3A7D63]">
              <span class="material-symbols-outlined text-[22px]">${goal.icon || 'flag'}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-[#3A7D63] uppercase tracking-wider">${goal.category}</span>
              <h3 class="font-display font-bold text-[16px] text-[#27303A] leading-tight group-hover:text-[#3A7D63] transition-colors">${goal.title}</h3>
            </div>
          </div>
          <div class="px-2.5 py-1 rounded-full bg-[#F2F3EE] text-xs font-bold text-[#27303A]">
            ${goal.progress}%
          </div>
        </div>

        <p class="text-[13px] text-[#596573] leading-relaxed">${goal.description}</p>

        <!-- Progress Bar -->
        <div class="flex flex-col space-y-1.5">
          <div class="flex items-center justify-between text-[11px] font-semibold text-[#8A96A3]">
            <span>${goal.completedMissionsCount} de ${goal.totalMissionsTarget} misiones realizadas</span>
            <span>Objetivo: ${goal.targetDate || 'En curso'}</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#F2F3EE] overflow-hidden">
            <div class="h-full rounded-full bg-[#3A7D63] transition-all duration-500" style="width: ${goal.progress}%;"></div>
          </div>
        </div>

        <div class="pt-2 border-t border-[#EAECE6]/60 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-[#3A7D63] flex items-center gap-1 group-hover:underline">
            <span>Ver Ruta & Misiones</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </span>
          <button data-goal-id="${goal.id}" class="btn-add-mission-to-goal text-xs font-bold text-[#3A7D63] hover:bg-[#F0F7F4] px-2.5 py-1 rounded-xl border border-[#DBEFE6] flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Vincular Misión</span>
          </button>
        </div>
      </div>
    `).join('');

    goalsList.querySelectorAll('.goal-card-clickable').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicked on the add mission button specifically, ignore card click
        if (e.target.closest('.btn-add-mission-to-goal')) return;
        const gid = card.dataset.goalId;
        if (gid) openGoalDetailModal(gid);
      });
    });

    goalsList.querySelectorAll('.btn-add-mission-to-goal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundEngine.playClick();
        const goalId = btn.dataset.goalId;
        openMissionModal(goalId);
      });
    });
  }

  function renderEvolucionView(state, progression) {
    const evoTitle = document.getElementById('evo-level-title');
    const evoSub = document.getElementById('evo-level-sub');
    const evoImpulsoTotal = document.getElementById('evo-impulso-total');
    const evoImpulsoProg = document.getElementById('evo-impulso-prog');
    const evoBar = document.getElementById('evo-progress-bar');
    const evoStreak = document.getElementById('evo-streak-days');
    const evoDiscipline = document.getElementById('evo-discipline-rate');

    if (evoTitle) evoTitle.textContent = `${progression.title}`;
    if (evoSub) evoSub.textContent = `Nivel ${progression.level} · Camino a Nv. ${progression.level + 1}`;
    if (evoImpulsoTotal) evoImpulsoTotal.textContent = `${progression.totalImpulso.toLocaleString()} Impulso Total`;
    if (evoImpulsoProg) evoImpulsoProg.textContent = `${progression.currentXPInLevel} / ${progression.xpNeededInLevel} (${progression.percentage}%)`;
    if (evoBar) evoBar.style.width = `${progression.percentage}%`;
    if (evoStreak) evoStreak.textContent = `${state.profile.currentStreak} Días`;
    if (evoDiscipline) evoDiscipline.textContent = `${state.profile.disciplineRate}%`;

    // Achievements list
    const achContainer = document.getElementById('achievements-grid');
    if (achContainer) {
      achContainer.innerHTML = window.GamificationEngine.ACHIEVEMENTS_CATALOG.map(ach => {
        const isUnlocked = state.unlockedAchievements.includes(ach.code);
        return `
          <div class="p-3.5 rounded-2xl border transition-all ${
            isUnlocked 
              ? 'bg-white dark:bg-[#131D17] border-[#DBEFE6] dark:border-[#23352B] soft-shadow' 
              : 'bg-[#F4F4F0]/60 dark:bg-[#101713] border-[#EAECE6] dark:border-[#1E2E25] opacity-75'
          } flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isUnlocked ? 'bg-[#F0F7F4] dark:bg-[#182C22] text-[#3A7D63] dark:text-[#4ADE80]' : 'bg-[#EAECE6] dark:bg-[#19271F] text-[#8A96A3] dark:text-[#64748B]'
            }">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' ${isUnlocked ? 1 : 0};">${ach.icon}</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-[13px] text-charcoal dark:text-slate-100 truncate">${ach.title}</h4>
                <span class="text-[10px] font-bold text-[#B87547] dark:text-amber-400">+${ach.reward}✨</span>
              </div>
              <p class="text-[11px] text-charcoal-muted dark:text-slate-300 line-clamp-2 leading-tight mt-0.5">${ach.description}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Rewards bazaar
    const rewardsContainer = document.getElementById('rewards-bazaar');
    if (rewardsContainer) {
      rewardsContainer.innerHTML = state.rewards.map(rew => `
        <div class="p-4 rounded-2xl bg-white dark:bg-[#131D17] border border-[#EAECE6] dark:border-[#23352B] soft-shadow flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#FFF8F3] dark:bg-[#261D12] border border-[#FCD9C2] dark:border-[#3D2D1B] text-[#F3A871] dark:text-amber-400 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">${rew.icon}</span>
            </div>
            <div>
              <h4 class="font-bold text-[13.5px] text-charcoal dark:text-slate-100 leading-tight">${rew.title}</h4>
              <p class="text-[11.5px] text-charcoal-muted dark:text-slate-300 mt-0.5">${rew.description}</p>
            </div>
          </div>
          <button data-id="${rew.id}" class="btn-buy-reward px-3.5 py-2 rounded-xl bg-[#FFF8F3] dark:bg-[#2D2114] hover:bg-[#FDEEE3] dark:hover:bg-[#3D2D1B] border border-[#FCD9C2] dark:border-[#4D3818] text-[#B87547] dark:text-amber-300 font-bold text-xs shrink-0 active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
            <span>${rew.cost}</span>
            <span class="text-[10px]">✨</span>
          </button>
        </div>
      `).join('');

      rewardsContainer.querySelectorAll('.btn-buy-reward').forEach(btn => {
        btn.addEventListener('click', () => {
          const res = window.appStore.buyReward(btn.dataset.id);
          if (res.success) {
            window.soundEngine.playSpark();
            launchConfetti();
            showToast(`¡Canjeado exitosamente: ${res.reward.title}!`, 'celebration', true);
            renderAll();
          } else {
            showToast(res.reason, 'info');
          }
        });
      });
    }
  }

  function renderPerfilView(state, progression) {
    const profileName = document.getElementById('perfil-name');
    const profileEmail = document.getElementById('perfil-email');
    const profileRank = document.getElementById('perfil-rank');
    const totalComps = document.getElementById('perfil-total-completions');
    const totalImpulso = document.getElementById('perfil-total-impulso');
    const bestStreak = document.getElementById('perfil-best-streak');
    const perfilAvatar = document.getElementById('perfil-avatar');

    if (profileName) profileName.textContent = state.profile.fullName;
    if (profileEmail) profileEmail.textContent = state.profile.email;
    if (profileRank) profileRank.textContent = `Nivel ${progression.level} · ${progression.title}`;
    if (totalComps) totalComps.textContent = state.completions.length;
    if (totalImpulso) totalImpulso.textContent = state.profile.totalImpulso;
    if (bestStreak) bestStreak.textContent = `${state.profile.bestStreak} Días`;
    if (perfilAvatar && state.profile.avatarUrl) perfilAvatar.src = state.profile.avatarUrl;
  }

  // ====================================================================
  // GOAL DETAIL MODAL CONTROLLER
  // ====================================================================
  let activeDetailGoalId = null;
  const modalGoalDetail = document.getElementById('modal-goal-detail');

  function openGoalDetailModal(goalId) {
    window.soundEngine.playClick();
    const state = window.appStore.getState();
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal || !modalGoalDetail) return;

    activeDetailGoalId = goalId;

    // Header info
    const iconEl = document.getElementById('goal-detail-icon');
    const catEl = document.getElementById('goal-detail-category');
    const titleEl = document.getElementById('goal-detail-title');
    const descEl = document.getElementById('goal-detail-desc');
    const pctEl = document.getElementById('goal-detail-pct');
    const barEl = document.getElementById('goal-detail-bar');
    const countEl = document.getElementById('goal-detail-count');
    const dateEl = document.getElementById('goal-detail-date');

    if (iconEl) iconEl.textContent = goal.icon || 'flag';
    if (catEl) catEl.textContent = goal.category;
    if (titleEl) titleEl.textContent = goal.title;
    if (descEl) descEl.textContent = goal.description || 'Sin descripción detallada';
    if (pctEl) pctEl.textContent = `${goal.progress}%`;
    if (barEl) barEl.style.width = `${goal.progress}%`;
    if (countEl) countEl.textContent = `${goal.completedMissionsCount || 0} de ${goal.totalMissionsTarget || 20} acciones realizadas`;
    if (dateEl) dateEl.textContent = `Objetivo: ${goal.targetDate || 'En curso'}`;

    // Roadmap Stages
    const roadmapContainer = document.getElementById('goal-detail-roadmap-list');
    if (roadmapContainer) {
      const stages = (goal.roadmap && Array.isArray(goal.roadmap) && goal.roadmap.length > 0)
        ? goal.roadmap
        : [
            { stage: 1, title: 'Etapa 1: Activación y ritmo base diario', status: 'En progreso', description: 'Crear el hábito diario y dar los primeros pasos sin fricción.' },
            { stage: 2, title: 'Etapa 2: Consistencia e incremento de intensidad', status: 'Próxima', description: 'Profundizar en la práctica y superar los primeros obstáculos.' },
            { stage: 3, title: 'Etapa 3: Consolidación y maestría vital', status: 'Futura', description: 'Integrar la habilidad como parte natural de tu identidad.' }
          ];

      roadmapContainer.innerHTML = stages.map((st, i) => `
        <div class="roadmap-step-line flex items-start gap-3 p-3.5 rounded-2xl ${i === 0 ? 'bg-[#F0F7F4] border border-[#DBEFE6] dark:bg-[#16261D] dark:border-[#23382C]' : 'bg-[#FAFAF8] border border-[#EAECE6] dark:bg-[#151D18] dark:border-[#202E24] opacity-85'}">
          <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i === 0 ? 'bg-[#3A7D63] text-white' : 'bg-[#EAECE6] text-[#596573] dark:bg-[#273D30] dark:text-slate-300'}">
            ${st.stage || (i + 1)}
          </div>
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h5 class="font-bold text-xs text-[#27303A] dark:text-slate-100 truncate">${st.title}</h5>
              <span class="text-[10px] font-bold shrink-0 ${i === 0 ? 'text-[#3A7D63] dark:text-emerald-400' : 'text-[#8A96A3]'}">${st.status || (i === 0 ? 'En progreso' : 'Próxima')}</span>
            </div>
            ${st.description ? `<p class="text-[11px] text-[#596573] dark:text-slate-400 mt-0.5 leading-snug">${st.description}</p>` : ''}
          </div>
        </div>
      `).join('');
    }

    // Linked Missions List
    const missionsContainer = document.getElementById('goal-detail-missions-list');
    const countBadge = document.getElementById('goal-detail-missions-count-badge');
    if (missionsContainer) {
      const linkedMissions = state.dailyMissions.filter(m => m.goalId === goalId);
      if (countBadge) countBadge.textContent = `${linkedMissions.length} misiones`;

      if (linkedMissions.length === 0) {
        missionsContainer.innerHTML = `
          <div class="p-4 rounded-2xl bg-canvas border border-[#EAECE6] dark:bg-[#151D18] dark:border-[#202E24] text-center text-xs text-charcoal-muted dark:text-slate-400">
            Aún no has generado misiones para esta meta. Pulsa el botón inferior para crear la siguiente con IA.
          </div>
        `;
      } else {
        missionsContainer.innerHTML = linkedMissions.map(m => `
          <div data-mission-id="${m.id}" class="goal-linked-mission-item p-3.5 rounded-2xl bg-white dark:bg-[#18261E] border border-[#EAECE6] dark:border-[#273D30] soft-shadow flex items-start justify-between gap-3 cursor-pointer hover:border-[#3A7D63] transition-all ${m.isCompleted ? 'opacity-70 bg-[#F4F6F2] dark:bg-[#121A15]' : ''}">
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <button data-id="${m.id}" class="btn-check-detail-mission w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                m.isCompleted ? 'bg-[#22C55E] border-[#22C55E] text-white' : 'border-[#D7DDD4] bg-[#F8F9F7] text-transparent hover:border-[#3A7D63]'
              }">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </button>
              <div class="flex flex-col min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <span class="text-[10px] font-bold text-[#3A7D63] dark:text-emerald-400 uppercase tracking-wide">${m.difficulty || 'Normal'}</span>
                  <span class="text-[10px] text-[#8A96A3]">· ⏱️ ${m.durationMinutes} min</span>
                </div>
                <h5 class="font-bold text-xs text-[#27303A] dark:text-slate-100 ${m.isCompleted ? 'line-through text-[#8A96A3]' : ''}">${m.title}</h5>
                <p class="text-[11.5px] text-[#596573] dark:text-slate-300 mt-1 line-clamp-2 leading-snug whitespace-pre-line">${m.description || 'Paso guiado de acción.'}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 text-[11px] font-bold text-[#3A7D63] dark:text-emerald-400 shrink-0 mt-1">
              <span>+${m.impulso}⚡</span>
            </div>
          </div>
        `).join('');

        // Card Click opens Mission Detail Modal (instructions)
        missionsContainer.querySelectorAll('.goal-linked-mission-item').forEach(item => {
          item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-check-detail-mission')) return;
            const mid = item.dataset.missionId;
            if (mid) openMissionDetailModal(mid);
          });
        });

        missionsContainer.querySelectorAll('.btn-check-detail-mission').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mid = btn.dataset.id;
            const res = window.appStore.toggleMission(mid);
            if (res.success) {
              if (res.wasCompleted) {
                window.soundEngine.playMissionComplete();
                launchConfetti();
                showToast(`¡Misión cumplida! +${res.mission.impulso}⚡`);
              } else {
                window.soundEngine.playClick();
              }
              openGoalDetailModal(goalId);
              renderAll();
            }
          });
        });
      }
    }

    modalGoalDetail.classList.remove('hidden');
  }

  function closeGoalDetailModal() {
    if (modalGoalDetail) modalGoalDetail.classList.add('hidden');
    activeDetailGoalId = null;
  }

  // ====================================================================
  // MISSION DETAIL MODAL CONTROLLER
  // ====================================================================
  const modalMissionDetail = document.getElementById('modal-mission-detail');

  function openMissionDetailModal(missionId) {
    const state = window.appStore.getState();
    const mission = state.dailyMissions.find(m => m.id === missionId);
    if (!mission || !modalMissionDetail) return;

    window.soundEngine.playClick();

    const catBadge = document.getElementById('modal-detail-cat-badge');
    const timeBadge = document.getElementById('modal-detail-time-badge');
    const titleEl = document.getElementById('modal-detail-title');
    const goalEl = document.getElementById('modal-detail-goal');
    const descEl = document.getElementById('modal-detail-desc');
    const impulsoEl = document.getElementById('modal-detail-impulso');
    const chispasEl = document.getElementById('modal-detail-chispas');
    const toggleBtn = document.getElementById('btn-modal-toggle-mission');
    const toggleText = document.getElementById('btn-modal-toggle-text');

    if (catBadge) catBadge.textContent = mission.category || 'Mente';
    if (timeBadge) timeBadge.textContent = `⏱️ ${mission.durationMinutes || mission.duration || 10} min`;
    if (titleEl) titleEl.textContent = mission.title;
    
    const goal = mission.goalId ? state.goals.find(g => g.id === mission.goalId) : null;
    if (goalEl) {
      goalEl.textContent = goal ? `Meta: ${goal.title}` : 'Acción diaria de progreso';
    }

    if (descEl) {
      descEl.textContent = mission.description || 'Dedica este bloque de tiempo a avanzar enfocado en tu meta con presencia.';
    }

    if (impulsoEl) impulsoEl.textContent = `+${mission.impulso} ⚡`;
    if (chispasEl) chispasEl.textContent = `+${mission.chispas} ✨`;

    if (toggleBtn && toggleText) {
      toggleBtn.dataset.missionId = mission.id;
      if (mission.isCompleted) {
        toggleText.textContent = 'Marcar como Pendiente';
        toggleBtn.className = 'flex-1 py-3.5 rounded-2xl bg-[#596573] hover:bg-[#3F4944] text-white font-display font-bold text-xs float-shadow active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer';
      } else {
        toggleText.textContent = 'Completar Misión Ahora';
        toggleBtn.className = 'flex-1 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-display font-bold text-xs float-shadow active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer';
      }
    }

    modalMissionDetail.classList.remove('hidden');
  }

  function closeMissionDetailModal() {
    if (modalMissionDetail) modalMissionDetail.classList.add('hidden');
  }

  // Button Listeners for Mission Detail Modal
  document.getElementById('btn-close-mission-detail-modal')?.addEventListener('click', closeMissionDetailModal);

  document.getElementById('btn-modal-toggle-mission')?.addEventListener('click', () => {
    const toggleBtn = document.getElementById('btn-modal-toggle-mission');
    const mid = toggleBtn?.dataset.missionId;
    if (!mid) return;

    const res = window.appStore.toggleMission(mid);
    if (res.success) {
      if (res.wasCompleted) {
        window.soundEngine.playMissionComplete();
        launchConfetti();
        showToast(`¡Misión cumplida! +${res.mission.impulso}⚡ +${res.mission.chispas}✨`);
        if (res.newlyUnlocked.length > 0) {
          setTimeout(() => {
            window.soundEngine.playLevelUp();
            showToast(`🏆 ¡Logro desbloqueado: ${res.newlyUnlocked[0].title}! +${res.newlyUnlocked[0].reward}✨`, 'workspace_premium', true);
          }, 600);
        }
      } else {
        window.soundEngine.playClick();
        showToast('Misión marcada como pendiente', 'undo');
      }
      closeMissionDetailModal();
      renderAll();
    }
  });

  // Button Listeners for Goal Detail Modal
  document.getElementById('btn-close-goal-detail-modal')?.addEventListener('click', closeGoalDetailModal);
  
  document.getElementById('btn-add-manual-mission-from-detail')?.addEventListener('click', () => {
    const gid = activeDetailGoalId;
    closeGoalDetailModal();
    openMissionModal(gid);
  });

  // ====================================================================
  // AI GOAL & MISSIONS PLANNER (Gemini AI + Contextual Heuristic Engine)
  // ====================================================================
  const getGeminiKey = () => window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';

  function generateContextualHeuristicPlan({ title, description, category }) {
    const t = (title || '').toLowerCase();
    const d = (description || '').toLowerCase();
    const cat = category || 'Crecimiento';

    let stages = [
      { stage: 1, title: 'Etapa 1: Activación y Fundamentos', status: 'En progreso', description: 'Establecer el espacio, herramientas y las primeras sesiones sin fricción.' },
      { stage: 2, title: 'Etapa 2: Práctica Deliberada & Ritmo', status: 'Próxima', description: 'Incrementar la intensidad y superar los puntos de bloqueo.' },
      { stage: 3, title: 'Etapa 3: Consolidación y Maestría Vital', status: 'Futura', description: 'Integrar los resultados de forma natural y duradera.' }
    ];

    let missions = [];

    if (t.includes('guitar') || t.includes('piano') || t.includes('músic') || t.includes('instrumento') || d.includes('cantar') || d.includes('acordes')) {
      stages = [
        { stage: 1, title: 'Etapa 1: Postura, afinación y primeros acordes', status: 'En progreso', description: 'Familiarizarse con el instrumento y memorizar las posiciones básicas.' },
        { stage: 2, title: 'Etapa 2: Transiciones fluidas y ritmo constante', status: 'Próxima', description: 'Practicar cambios de acordes con metrónomo y rasgueos.' },
        { stage: 3, title: 'Etapa 3: Tu primera canción completa', status: 'Futura', description: 'Interpretar melodías de inicio a fin con soltura.' }
      ];
      missions = [
        {
          title: 'Paso 1: Afinación y calentamiento de dedos (10 min)',
          description: '1. Descarga una app de afinador (o usa tu afinador) y afina cada cuerda con calma.\n2. Siéntate con la espalda recta y coloca el instrumento en posición cómoda.\n3. Realiza ejercicios de digitación (1-2-3-4) en el mástil durante 5 minutos para calentar articulaciones.',
          durationMinutes: 10,
          difficulty: 'Fácil',
          category: cat
        },
        {
          title: 'Paso 2: Práctica del primer acorde básico (15 min)',
          description: '1. Coloca los dedos con precisión sobre los trastes correspondientes (ej: Mi Menor o La Menor).\n2. Toca cuerda por cuerda asegurando que ninguna trastee o suene apagada.\n3. Haz 10 repeticiones: coloca el acorde, rasguea, suelta la mano y vuelve a colocarlo.',
          durationMinutes: 15,
          difficulty: 'Normal',
          category: cat
        },
        {
          title: 'Paso 3: Transición rítmica entre 2 acordes (15 min)',
          description: '1. Elige dos acordes sencillos y practica el cambio lento sin perder la postura del pulgar.\n2. Pon un ritmo suave (o metrónomo a 60 bpm) y cambia de acorde cada 4 pulsos.\n3. Mantén el rasgueo constante hacia abajo durante 10 minutos.',
          durationMinutes: 15,
          difficulty: 'Normal',
          category: cat
        }
      ];
    } else if (t.includes('inglés') || t.includes('idioma') || t.includes('francés') || t.includes('alemán') || t.includes('vocabulario') || d.includes('hablar') || d.includes('viajar')) {
      stages = [
        { stage: 1, title: 'Etapa 1: Vocabulario esencial y oído activo', status: 'En progreso', description: 'Aprender las 100 palabras más frecuentes y entrenar la comprensión.' },
        { stage: 2, title: 'Etapa 2: Frases cotidianas y pronunciación', status: 'Próxima', description: 'Construir preguntas y respuestas de la vida diaria.' },
        { stage: 3, title: 'Etapa 3: Fluidez conversacional', status: 'Futura', description: 'Mantener intercambios orales de más de 10 minutos con seguridad.' }
      ];
      missions = [
        {
          title: 'Paso 1: Inmersión y 5 frases esenciales (15 min)',
          description: '1. Elige 5 frases cotidianas útiles para tu objetivo (ej: presentaciones o preguntas de viaje).\n2. Escríbelas en una libreta anotando su significado y contexto de uso.\n3. Pronúncialas en voz alta 3 veces grabándote con tu teléfono para escuchar tu entonación.',
          durationMinutes: 15,
          difficulty: 'Fácil',
          category: cat
        },
        {
          title: 'Paso 2: Escucha activa con subtítulos (15 min)',
          description: '1. Busca un podcast o video de 3 a 5 minutos en el idioma objetivo con subtítulos.\n2. Escúchalo una primera vez prestando atención a la idea general.\n3. Escúchalo una segunda vez pausando para anotar 3 palabras nuevas que no conocías.',
          durationMinutes: 15,
          difficulty: 'Normal',
          category: cat
        },
        {
          title: 'Paso 3: Monólogo de 2 minutos frente al espejo (10 min)',
          description: '1. Selecciona un tema sencillo: cómo fue tu día o por qué quieres alcanzar esta meta.\n2. Habla durante 2 minutos continuos sin detenerte por errores gramaticales.\n3. Felicítate por el esfuerzo y anota una palabra que te haya hecho falta.',
          durationMinutes: 10,
          difficulty: 'Normal',
          category: cat
        }
      ];
    } else if (t.includes('leer') || t.includes('libro') || t.includes('lectura') || t.includes('estudi') || d.includes('aprender') || d.includes('conocimiento')) {
      stages = [
        { stage: 1, title: 'Etapa 1: Hábito de lectura diaria sin fricción', status: 'En progreso', description: 'Bloquear 15 minutos al día en un horario sagrado.' },
        { stage: 2, title: 'Etapa 2: Lectura comprensiva y notas clave', status: 'Próxima', description: 'Extraer las ideas principales y reflexionar sobre su aplicación.' },
        { stage: 3, title: 'Etapa 3: Síntesis y aplicación práctica', status: 'Futura', description: 'Convertir las lecturas en proyectos y cambios reales.' }
      ];
      missions = [
        {
          title: 'Paso 1: Preparar tu espacio y leer 10 páginas (15 min)',
          description: '1. Deja el teléfono en otra habitación o en modo silencio.\n2. Siéntate con buena iluminación y tu libro o material seleccionado.\n3. Lee 10 páginas completas a ritmo relajado y subraya 1 idea que resuene contigo.',
          durationMinutes: 15,
          difficulty: 'Fácil',
          category: cat
        },
        {
          title: 'Paso 2: Registro de 1 idea transformadora (10 min)',
          description: '1. Abre tu cuaderno de notas o app de notas.\n2. Escribe con tus propias palabras la lección más valiosa de lo que leíste hoy.\n3. Formula una acción concreta de cómo puedes aplicarla en tu vida esta semana.',
          durationMinutes: 10,
          difficulty: 'Fácil',
          category: cat
        },
        {
          title: 'Paso 3: Sesión de lectura continua y mapa mental (20 min)',
          description: '1. Realiza una lectura de 15 minutos profundizando en el capítulo actual.\n2. Dedica los últimos 5 minutos a trazar un pequeño esquema o resumen visual de los conceptos clave.',
          durationMinutes: 20,
          difficulty: 'Normal',
          category: cat
        }
      ];
    } else if (t.includes('fuerza') || t.includes('gym') || t.includes('ejercicio') || t.includes('correr') || t.includes('cuerpo') || t.includes('peso') || t.includes('salud') || cat === 'Cuerpo') {
      stages = [
        { stage: 1, title: 'Etapa 1: Acondicionamiento y constancia', status: 'En progreso', description: 'Despertar la musculatura y activar el sistema cardiovascular.' },
        { stage: 2, title: 'Etapa 2: Sobrecarga progresiva y técnica', status: 'Próxima', description: 'Aumentar repeticiones, intensidad y cuidar la recuperación.' },
        { stage: 3, title: 'Etapa 3: Rendimiento óptimo y vitalidad', status: 'Futura', description: 'Consolidar fuerza, flexibilidad y resistencia duraderas.' }
      ];
      missions = [
        {
          title: 'Paso 1: Activación física y movilidad articular (15 min)',
          description: '1. Viste ropa cómoda y ten a mano una botella de agua fresca.\n2. Realiza 5 minutos de movilidad: rotación de hombros, cadera, tobillos y cuello.\n3. Completa 3 series de 10 sentadillas suaves y 10 elevaciones de talones para activar las piernas.',
          durationMinutes: 15,
          difficulty: 'Fácil',
          category: cat
        },
        {
          title: 'Paso 2: Circuito de fuerza funcional básica (20 min)',
          description: '1. Realiza 3 rondas del siguiente circuito: 10 flexiones (en suelo o pared), 15 sentadillas y 20 segundos de plancha isométrica.\n2. Descansa 45 segundos entre cada ronda manteniendo respiración profunda.\n3. Finaliza con 3 minutos de estiramientos suaves.',
          durationMinutes: 20,
          difficulty: 'Normal',
          category: cat
        },
        {
          title: 'Paso 3: Caminata a paso ligero o trote suave (20 min)',
          description: '1. Sal al exterior o usa la caminadora.\n2. Mantén un paso rápido y constante durante 20 minutos con la vista al frente.\n3. Conéctate con la sensación de energía y oxigenación en todo tu cuerpo.',
          durationMinutes: 20,
          difficulty: 'Normal',
          category: cat
        }
      ];
    } else {
      // General adaptable blueprint
      stages = [
        { stage: 1, title: `Etapa 1: Fundamentos y arranque de "${title}"`, status: 'En progreso', description: 'Establecer los primeros pasos prácticos y vencer la inercia inicial.' },
        { stage: 2, title: 'Etapa 2: Consistencia deliberada y profundización', status: 'Próxima', description: 'Construir ritmo regular y medir avances concretos.' },
        { stage: 3, title: 'Etapa 3: Integración y maestría del objetivo', status: 'Futura', description: 'Alcanzar el propósito trazado y celebrarlo con orgullo.' }
      ];
      missions = [
        {
          title: `Paso 1: Definir tu espacio y primer bloque de acción (15 min)`,
          description: `1. Prepara todos los materiales y el espacio necesario para avanzar en "${title}".\n2. Elimina cualquier distracción (notificaciones, pantallas innecesarias).\n3. Ejecuta los primeros 10 minutos de trabajo concentrado en este objetivo específico.`,
          durationMinutes: 15,
          difficulty: 'Fácil',
          category: cat
        },
        {
          title: `Paso 2: Sesión de práctica enfocada en "${title}" (20 min)`,
          description: `1. Pon un temporizador de 20 minutos y concéntrate exclusivamente en una tarea concreta de tu meta.\n2. Si surgen dudas, anótalas brevemente y continúa ejecutando sin perder el flujo.\n3. Registra tu avance al terminar para ver tu progreso tangible.`,
          durationMinutes: 20,
          difficulty: 'Normal',
          category: cat
        },
        {
          title: `Paso 3: Revisión de avance y siguiente victoria rápida (15 min)`,
          description: `1. Revisa lo logrado hasta ahora en "${title}" y anota qué funcionó mejor.\n2. Realiza un ejercicio complementario o ajuste de 10 minutos para reforzar el aprendizaje.\n3. Define con claridad el siguiente paso que darás mañana.`,
          durationMinutes: 15,
          difficulty: 'Normal',
          category: cat
        }
      ];
    }

    return { roadmap: stages, missions };
  }

  async function generateAIGoalPlan({ title, description, category, targetDate, totalMissionsTarget }) {
    const goalTitle = title.trim();
    const goalDesc = description ? description.trim() : `Objetivo en ${category} para transformar mi vida.`;
    const cat = category || 'Crecimiento';

    const geminiKey = getGeminiKey();
    
    // 1. Try Gemini AI Live Call
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${geminiKey}`;
        const prompt = `Eres el Arquitecto de Metas de MISIÓN, una aplicación de desarrollo personal gamificada.
Convierte la siguiente Meta Vital en:
1. Una Ruta clara en 3 o 4 etapas secuenciales.
2. Las primeras 3 o 4 micromisiones diarias concretas, físicas y realizables (10-20 min cada una).
Cada misión DEBE incluir en "description" instrucciones claras numeradas paso a paso ("1. ...\\n2. ...\\n3. ...") que guíen al usuario sobre qué hacer exactamente.

DATOS DE LA META:
- Título: "${goalTitle}"
- Propósito / Descripción: "${goalDesc}"
- Categoría: "${cat}"

Responde ÚNICAMENTE en formato JSON con esta estructura exacta:
{
  "roadmap": [
    { "stage": 1, "title": "Etapa 1: ...", "description": "Resumen de esta etapa" },
    { "stage": 2, "title": "Etapa 2: ...", "description": "Resumen de esta etapa" },
    { "stage": 3, "title": "Etapa 3: ...", "description": "Resumen de esta etapa" }
  ],
  "missions": [
    {
      "title": "Paso 1: [Acción clara y concreta]",
      "description": "1. [Primer paso]\\n2. [Segundo paso]\\n3. [Verificación o conclusión]",
      "duration_minutes": 15,
      "difficulty": "Fácil"
    },
    {
      "title": "Paso 2: [Segunda acción específica]",
      "description": "1. [Primer paso]\\n2. [Segundo paso]\\n3. [Conclusión]",
      "duration_minutes": 15,
      "difficulty": "Normal"
    },
    {
      "title": "Paso 3: [Tercera acción específica]",
      "description": "1. [Primer paso]\\n2. [Segundo paso]\\n3. [Conclusión]",
      "duration_minutes": 20,
      "difficulty": "Normal"
    }
  ]
}`;

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed.missions && parsed.missions.length > 0) {
              return {
                roadmap: (parsed.roadmap && parsed.roadmap.length > 0) ? parsed.roadmap : [
                  { stage: 1, title: 'Etapa 1: Activación y ritmo base diario', status: 'En progreso', description: 'Crear el hábito diario.' },
                  { stage: 2, title: 'Etapa 2: Consistencia y profundización', status: 'Próxima', description: 'Profundizar en la práctica.' },
                  { stage: 3, title: 'Etapa 3: Consolidación y maestría', status: 'Futura', description: 'Integrar la habilidad.' }
                ],
                missions: parsed.missions.map((m, idx) => ({
                  title: m.title || `Paso #${idx + 1}: Avanzar en ${goalTitle}`,
                  description: m.description || `1. Dedica ${m.duration_minutes || 15} min a practicar.\n2. Concéntrate sin distracciones.\n3. Marca la misión como completada.`,
                  durationMinutes: m.duration_minutes || 15,
                  difficulty: m.difficulty || (idx === 0 ? 'Fácil' : 'Normal'),
                  category: cat
                }))
              };
            }
          }
        }
      } catch (err) {
        console.warn('Gemini Goal Planner API call notice, activating contextual heuristic planner:', err);
      }
    }

    // 2. Intelligent Contextual Heuristic Planner fallback
    return generateContextualHeuristicPlan({ title: goalTitle, description: goalDesc, category: cat });
  }

  // Button: Generate next AI mission from inside Goal Detail Modal
  document.getElementById('btn-ai-generate-next-mission')?.addEventListener('click', async () => {
    if (!activeDetailGoalId) return;
    const state = window.appStore.getState();
    const goal = state.goals.find(g => g.id === activeDetailGoalId);
    if (!goal) return;

    const btn = document.getElementById('btn-ai-generate-next-mission');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined text-[17px] animate-spin">sync</span><span>Diseñando siguiente paso con IA...</span>';
    btn.disabled = true;

    // Smart mission generator
    const existingCount = state.dailyMissions.filter(m => m.goalId === goal.id).length;
    const stepNumber = existingCount + 1;
    
    let generatedTitle = `Paso #${stepNumber}: Sesión de enfoque en ${goal.title}`;
    let generatedDesc = `1. Dedica 15 minutos continuos a avanzar en tu meta "${goal.title}".\n2. Realiza una acción concreta sin postergar.\n3. Marca la misión como completada para ganar tu Impulso del día.`;
    let duration = 15;
    let difficulty = 'Normal';

    const geminiKey = getGeminiKey();
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${geminiKey}`;
        const prompt = `Eres el Arquitecto de Metas de MISIÓN. El usuario ya ha completado ${existingCount} misiones de su meta "${goal.title}" (Categoría: ${goal.category}, Propósito: ${goal.description}).
Genera la siguiente micromisión accionable #${stepNumber} de 15 minutos en el mundo real.
La misión DEBE incluir en "description" una guía paso a paso numerada ("1. ...\\n2. ...\\n3. ...") explicando claramente qué tiene que hacer.

Responde en formato JSON:
{
  "mission_title": "Paso #${stepNumber}: [Título de la micromisión concreta]",
  "mission_description": "1. [Paso uno concreto]\\n2. [Paso dos concreto]\\n3. [Paso tres de cierre]",
  "duration_minutes": 15,
  "difficulty": "Normal"
}`;

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.35, responseMimeType: 'application/json' }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
          if (parsed.mission_title) {
            generatedTitle = parsed.mission_title;
            if (parsed.mission_description) generatedDesc = parsed.mission_description;
            if (parsed.duration_minutes) duration = parsed.duration_minutes;
            if (parsed.difficulty) difficulty = parsed.difficulty;
          }
        }
      } catch (err) {
        console.warn('AI call for next mission fallback:', err);
      }
    }

    // Add to Store
    window.appStore.addMission({
      title: generatedTitle,
      description: generatedDesc,
      category: goal.category,
      difficulty: difficulty,
      durationMinutes: duration,
      goalId: goal.id
    });

    btn.innerHTML = originalText;
    btn.disabled = false;

    window.soundEngine.playSpark();
    launchConfetti();
    showToast(`¡Misión #${stepNumber} añadida a tu día!`, 'auto_awesome', true);

    openGoalDetailModal(goal.id);
    renderAll();
  });

  // Modals Management
  const modalGoal = document.getElementById('modal-create-goal');
  const modalMission = document.getElementById('modal-create-mission');

  function openGoalModal() {
    window.soundEngine.playClick();
    if (modalGoal) modalGoal.classList.remove('hidden');
  }

  function closeGoalModal() {
    if (modalGoal) modalGoal.classList.add('hidden');
  }

  function openMissionModal(preselectedGoalId = null) {
    window.soundEngine.playClick();
    if (modalMission) {
      const select = document.getElementById('form-mission-goal');
      if (select) {
        const state = window.appStore.getState();
        select.innerHTML = '<option value="">Ninguna (Misión Libre)</option>' + 
          state.goals.map(g => `<option value="${g.id}" ${g.id === preselectedGoalId ? 'selected' : ''}>${g.title}</option>`).join('');
      }
      modalMission.classList.remove('hidden');
    }
  }

  function closeMissionModal() {
    if (modalMission) modalMission.classList.add('hidden');
  }

  // Form Submissions: CREATE GOAL WITH AI
  const formGoal = document.getElementById('form-goal');
  if (formGoal) {
    formGoal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('form-goal-title').value;
      const desc = document.getElementById('form-goal-desc').value;
      const cat = document.getElementById('form-goal-cat').value;
      const targetDate = document.getElementById('form-goal-date').value;
      const targetCount = document.getElementById('form-goal-count').value;

      if (!title) return;

      const btnSubmit = document.getElementById('btn-submit-goal');
      const btnSubmitText = document.getElementById('btn-submit-goal-text');
      const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="material-symbols-outlined text-[17px] animate-spin">sync</span><span>Diseñando ruta y misiones con IA...</span>';
      }

      try {
        // Generate AI Roadmap and Missions
        const aiPlan = await generateAIGoalPlan({
          title,
          description: desc,
          category: cat,
          targetDate,
          totalMissionsTarget: targetCount
        });

        // Add Goal & Missions to Reactive Store
        const { newGoal, createdMissions } = window.appStore.addGoalWithMissions({
          title,
          description: desc,
          category: cat,
          targetDate,
          totalMissionsTarget: targetCount,
          roadmap: aiPlan.roadmap,
          missions: aiPlan.missions
        });

        // Background sync to Supabase if authenticated
        if (sbClient) {
          try {
            const { data: { user } } = await sbClient.auth.getUser();
            if (user) {
              sbClient.from('goals').insert({
                user_id: user.id,
                title: newGoal.title,
                description: newGoal.description,
                category: newGoal.category,
                target_date: newGoal.targetDate,
                total_missions_target: newGoal.totalMissionsTarget,
                completed_missions_count: 0,
                progress_percentage: 0
              }).then(() => console.log('Goal synced to Supabase')).catch(err => console.warn('Supabase goal sync notice:', err));
            }
          } catch (syncErr) {
            console.warn('Background sync error:', syncErr);
          }
        }

        window.soundEngine.playSpark();
        launchConfetti();
        showToast('¡Meta creada! La IA ha generado tu ruta y misiones guiadas ✨', 'auto_awesome', true);
        
        closeGoalModal();
        formGoal.reset();
        renderAll();

        // Immediately open Goal Detail Modal so the user can inspect the generated roadmap and missions!
        setTimeout(() => {
          if (newGoal && newGoal.id) {
            openGoalDetailModal(newGoal.id);
          }
        }, 300);

      } catch (err) {
        console.error('Error creating goal with AI:', err);
        showToast('Se creó la meta con ruta inicial.', 'info');
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalBtnHtml || '<span class="material-symbols-outlined text-[17px]">auto_awesome</span><span>Crear Meta Vital con IA</span>';
        }
      }
    });
  }

  const formMission = document.getElementById('form-mission');
  if (formMission) {
    formMission.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('form-mission-title').value;
      const desc = document.getElementById('form-mission-desc').value;
      const cat = document.getElementById('form-mission-cat').value;
      const diff = document.getElementById('form-mission-diff').value;
      const duration = document.getElementById('form-mission-duration').value;
      const goalId = document.getElementById('form-mission-goal').value;

      if (!title) return;

      window.appStore.addMission({
        title,
        description: desc,
        category: cat,
        difficulty: diff,
        durationMinutes: duration,
        goalId: goalId || null
      });

      window.soundEngine.playSpark();
      showToast('¡Nueva misión agregada a tu día!');
      closeMissionModal();
      formMission.reset();
      renderAll();
    });
  }

  // Button Listeners
  document.getElementById('btn-open-goal-creator')?.addEventListener('click', openGoalModal);
  document.getElementById('btn-open-mission-creator')?.addEventListener('click', () => openMissionModal());
  document.getElementById('btn-quick-new-action')?.addEventListener('click', () => openMissionModal());
  document.getElementById('btn-close-goal-modal')?.addEventListener('click', closeGoalModal);
  document.getElementById('btn-close-mission-modal')?.addEventListener('click', closeMissionModal);

  // ====================================================================
  // AUTH & PROFILE PICTURE CONTROLLER (< 500 KB IMAGE VALIDATION)
  // ====================================================================

  let selectedRegisterAvatarData = null;

  function validateAvatarFile(file) {
    const MAX_BYTES = 500 * 1024; // 500 KB = 512,000 bytes
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!file) {
      return { valid: false, error: 'No se seleccionó ningún archivo.' };
    }

    // 1. Image Type Check
    if (!file.type.startsWith('image/') || !ALLOWED_MIME_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Formato inválido. Solo se admiten archivos de imagen (PNG, JPG, JPEG, WEBP, GIF).' 
      };
    }

    // 2. File Size Check (< 500 KB)
    if (file.size > MAX_BYTES) {
      const sizeKb = (file.size / 1024).toFixed(1);
      return { 
        valid: false, 
        error: `La imagen pesa ${sizeKb} KB. El tamaño máximo permitido es de 500 KB.` 
      };
    }

    return { valid: true, sizeKb: (file.size / 1024).toFixed(1) };
  }

  function initAuthUI() {
    const tabBtnLogin = document.getElementById('tab-btn-login');
    const tabBtnRegister = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('form-auth-login');
    const formRegister = document.getElementById('form-auth-register');
    const btnGoogle = document.getElementById('btn-google-auth');

    // Tab Switcher Login / Register
    tabBtnLogin?.addEventListener('click', () => {
      window.soundEngine.playClick();
      tabBtnLogin.classList.add('bg-white', 'text-charcoal', 'shadow-sm');
      tabBtnLogin.classList.remove('text-charcoal-muted');
      tabBtnRegister.classList.remove('bg-white', 'text-charcoal', 'shadow-sm');
      tabBtnRegister.classList.add('text-charcoal-muted');

      formLogin?.classList.remove('hidden');
      formRegister?.classList.add('hidden');
    });

    tabBtnRegister?.addEventListener('click', () => {
      window.soundEngine.playClick();
      tabBtnRegister.classList.add('bg-white', 'text-charcoal', 'shadow-sm');
      tabBtnRegister.classList.remove('text-charcoal-muted');
      tabBtnLogin.classList.remove('bg-white', 'text-charcoal', 'shadow-sm');
      tabBtnLogin.classList.add('text-charcoal-muted');

      formRegister?.classList.remove('hidden');
      formLogin?.classList.add('hidden');
    });

    // Password show/hide toggle
    document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('.material-symbols-outlined');
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.textContent = 'visibility_off';
          } else {
            input.type = 'password';
            if (icon) icon.textContent = 'visibility';
          }
        }
      });
    });

    // Google Sign-In / Register Handler (Strict OAuth for Web & Native Mobile Deep Links)
    btnGoogle?.addEventListener('click', async () => {
      window.soundEngine.playSpark();
      const googleBtnText = document.getElementById('google-btn-text');
      if (googleBtnText) googleBtnText.textContent = 'Conectando con Google...';

      if (!sbClient) {
        showToast('Error: Servicio de autenticación Supabase no disponible', 'error');
        if (googleBtnText) googleBtnText.textContent = 'Continuar con Google';
        return;
      }

      try {
        const isNative = (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) || 
                         window.location.protocol === 'capacitor:' || 
                         window.location.protocol === 'ionic:';

        // Direct web return to current origin + path (works both locally and in production)
        const redirectUrl = isNative 
          ? 'app.mision.santuario://login-callback' 
          : (window.location.origin + window.location.pathname);

        const { data, error } = await sbClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: isNative
          }
        });

        if (error) {
          console.error('Supabase Google OAuth error:', error);
          showToast(`Error al conectar con Google: ${error.message || error}`, 'error');
          if (googleBtnText) googleBtnText.textContent = 'Continuar con Google';
          return;
        }

        if (isNative && data?.url) {
          if (window.Capacitor?.Plugins?.Browser?.open) {
            await window.Capacitor.Plugins.Browser.open({ url: data.url, windowName: '_system' });
          } else {
            window.location.href = data.url;
          }
        }
      } catch (err) {
        console.error('Google OAuth exception:', err);
        showToast(`Error de conexión: ${err.message || err}`, 'error');
        if (googleBtnText) googleBtnText.textContent = 'Continuar con Google';
      }
    });

    // Login Form Submit (Supabase Auth + Fallback)
    formLogin?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      if (!email || !password) {
        showToast('Por favor completa todos los campos', 'info');
        return;
      }

      const submitBtn = formLogin.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[17px] animate-spin">sync</span><span>Iniciando sesión...</span>';
      submitBtn.disabled = true;

      try {
        if (sbClient) {
          const { data, error } = await sbClient.auth.signInWithPassword({
            email: email,
            password: password
          });

          if (error) {
            console.warn('Supabase Auth error:', error);
            // If user doesn't exist on remote yet or invalid password
            if (error.message.includes('Invalid login credentials')) {
              showToast('Credenciales incorrectas. Verifica correo o contraseña.', 'error');
              submitBtn.innerHTML = origText;
              submitBtn.disabled = false;
              return;
            }
          } else if (data?.user) {
            // Fetch profile
            const { data: profileData } = await sbClient
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const fullName = profileData?.full_name || data.user.user_metadata?.full_name || email.split('@')[0];
            const avatarUrl = profileData?.avatar_url || data.user.user_metadata?.avatar_url;

            window.appStore.loginUser({
              email: email,
              fullName: fullName,
              avatarUrl: avatarUrl
            });

            window.soundEngine.playSpark();
            launchConfetti();
            showToast(`¡Bienvenido de vuelta, ${fullName}!`, 'login', true);

            const state = window.appStore.getState();
            if (state.isOnboardingCompleted) {
              switchTab('hoy');
            }
            renderAll();
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
            return;
          }
        }
      } catch (err) {
        console.warn('Live login fallback:', err);
      }

      // Local / Offline fallback
      window.soundEngine.playSpark();
      window.appStore.loginUser({
        email: email,
        fullName: email.split('@')[0]
      });

      launchConfetti();
      showToast('¡Bienvenido de vuelta!', 'login', true);

      const state = window.appStore.getState();
      if (state.isOnboardingCompleted) {
        switchTab('hoy');
      }
      renderAll();
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    });

    // Register Form Submit (Supabase Auth + Fallback)
    formRegister?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name')?.value.trim();
      const email = document.getElementById('register-email')?.value.trim();
      const password = document.getElementById('register-password')?.value;

      if (!name || !email || !password) {
        showToast('Por favor completa todos los campos requeridos', 'info');
        return;
      }

      if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'info');
        return;
      }

      const submitBtn = formRegister.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-[17px] animate-spin">sync</span><span>Creando cuenta en Supabase...</span>';
      submitBtn.disabled = true;

      let finalAvatarUrl = selectedRegisterAvatarData || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

      try {
        if (sbClient) {
          const { data, error } = await sbClient.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                full_name: name,
                avatar_url: finalAvatarUrl
              }
            }
          });

          if (error) {
            console.warn('Supabase signup note:', error);
          } else if (data?.user) {
            console.log('User signed up successfully to Supabase:', data.user.id);
          }
        }
      } catch (err) {
        console.warn('Supabase remote signup error:', err);
      }

      window.soundEngine.playSpark();
      window.appStore.registerUser({
        fullName: name,
        email: email,
        avatarUrl: finalAvatarUrl
      });

      launchConfetti();
      showToast(`¡Cuenta creada con éxito, ${name}! Vamos al paso 1`, 'how_to_reg', true);

      onboardingState.step = 1;
      renderAll();
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    });

    // Perfil View Avatar Change with < 500 KB Validation & Supabase Sync
    const perfilAvatarWrap = document.getElementById('perfil-avatar-wrap');
    const btnPerfilChangePhoto = document.getElementById('btn-perfil-change-photo');
    const perfilAvatarFile = document.getElementById('perfil-avatar-file');

    perfilAvatarWrap?.addEventListener('click', () => perfilAvatarFile?.click());
    btnPerfilChangePhoto?.addEventListener('click', () => perfilAvatarFile?.click());

    perfilAvatarFile?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const check = validateAvatarFile(file);
      if (!check.valid) {
        window.soundEngine.playClick();
        showToast(check.error, 'error');
        perfilAvatarFile.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const dataUrl = evt.target.result;
        window.appStore.updateUserProfile({ avatarUrl: dataUrl });
        window.soundEngine.playSpark();
        launchConfetti();
        showToast(`¡Foto de perfil actualizada y guardada! (${check.sizeKb} KB)`, 'photo_camera', true);
        renderAll();

        // Sync with Supabase DB
        if (sbClient) {
          try {
            const { data: { user } } = await sbClient.auth.getUser();
            if (user) {
              const currentName = window.appStore.getState().profile.fullName;
              await sbClient.from('profiles').upsert({
                id: user.id,
                email: user.email,
                full_name: currentName,
                avatar_url: dataUrl,
                updated_at: new Date().toISOString()
              });
              await sbClient.auth.updateUser({
                data: { avatar_url: dataUrl }
              });
            }
          } catch (err) {
            console.warn('Supabase avatar update notice:', err);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Edit Profile Name Modal Handler
    const modalEditName = document.getElementById('modal-edit-profile-name');
    const btnEditProfileName = document.getElementById('btn-edit-profile-name');
    const btnCloseEditNameModal = document.getElementById('btn-close-edit-name-modal');
    const formEditProfileName = document.getElementById('form-edit-profile-name');
    const inputEditProfileName = document.getElementById('input-edit-profile-name');

    btnEditProfileName?.addEventListener('click', () => {
      window.soundEngine.playClick();
      const currentName = window.appStore.getState().profile.fullName || '';
      if (inputEditProfileName) inputEditProfileName.value = currentName;
      modalEditName?.classList.remove('hidden');
      inputEditProfileName?.focus();
    });

    btnCloseEditNameModal?.addEventListener('click', () => {
      modalEditName?.classList.add('hidden');
    });

    modalEditName?.addEventListener('click', (e) => {
      if (e.target === modalEditName) modalEditName.classList.add('hidden');
    });

    formEditProfileName?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = inputEditProfileName?.value.trim();
      if (!newName) return;

      window.soundEngine.playSpark();
      window.appStore.updateUserProfile({ fullName: newName });
      modalEditName?.classList.add('hidden');
      showToast(`¡Nombre actualizado a ${newName}! ✨`, 'badge', true);
      renderAll();

      // Persist in Supabase DB
      if (sbClient) {
        try {
          const { data: { user } } = await sbClient.auth.getUser();
          if (user) {
            const currentAvatar = window.appStore.getState().profile.avatarUrl;
            await sbClient.from('profiles').upsert({
              id: user.id,
              email: user.email,
              full_name: newName,
              avatar_url: currentAvatar,
              updated_at: new Date().toISOString()
            });
            await sbClient.auth.updateUser({
              data: { full_name: newName }
            });
          }
        } catch (err) {
          console.warn('Supabase name update notice:', err);
        }
      }
    });

    // Logout Button (Smooth without modal freeze)
    document.getElementById('btn-logout')?.addEventListener('click', async () => {
      window.soundEngine.playClick();
      try {
        if (sbClient) {
          await sbClient.auth.signOut();
        }
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
      window.appStore.logoutUser();
      showToast('Sesión cerrada con éxito', 'logout');
      renderAll();
    });
  }

  // Simulator Reset & Replay Listeners
  document.getElementById('btn-replay-onboarding')?.addEventListener('click', () => {
    window.soundEngine.playClick();
    onboardingState.step = 1;
    window.appStore.resetToOnboarding();
    showToast('Simulador en modo Onboarding', 'play_circle');
    renderAll();
  });

  document.getElementById('btn-load-demo')?.addEventListener('click', () => {
    window.soundEngine.playSpark();
    window.appStore.loadDemoData();
    showToast('Datos de demo completos cargados', 'dataset');
    switchTab('hoy');
    renderAll();
  });

  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    window.soundEngine.playClick();
    onboardingState.step = 1;
    window.appStore.resetData();
    showToast('Aplicación reiniciada a pantalla de Login/Registro', 'restart_alt');
    renderAll();
  });

  // Tab Navigation System
  function switchTab(target) {
    if (!target) return;
    if (activeTab !== target) {
      window.soundEngine.playTabSwitch();
    }
    activeTab = target;

    // Update bottom navigation bar items
    document.querySelectorAll('#bottom-nav-bar .bottom-nav-link').forEach(l => {
      const isTarget = l.dataset.tab === target;
      l.classList.toggle('active', isTarget);
    });

    // Hide all view panels and show target panel with entrance animation
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`view-${target}`);
    if (targetPanel) {
      // Trigger reflow to restart entrance animation
      void targetPanel.offsetWidth;
      targetPanel.classList.add('active');
    }

    const mainScroll = document.getElementById('app-main-content');
    if (mainScroll) {
      mainScroll.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const screenEl = document.querySelector('.simulator-screen');
    if (screenEl) {
      screenEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind click on any element with data-tab
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(el.dataset.tab);
    });
  });

  // Auto-detect native mobile / APK / standalone mode
  const isMobileEnvironment = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                              window.innerWidth <= 768 || 
                              window.matchMedia('(display-mode: standalone)').matches ||
                              window.Capacitor !== undefined;
  if (isMobileEnvironment) {
    document.body.classList.add('native-mobile');
    const stage = document.getElementById('simulator-stage');
    if (stage) stage.classList.add('mode-fullscreen');
  }

  // Theme System (Dark Sanctuary vs Light Sanctuary)
  function initThemeSystem() {
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('mision_theme');

    function applyTheme(theme) {
      const isDark = theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark-theme', isDark);
      if (themeIcon) {
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
      }
      localStorage.setItem('mision_theme', theme);
    }

    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }

    btnToggleTheme?.addEventListener('click', () => {
      window.soundEngine.playClick();
      const currentIsDark = document.body.classList.contains('dark-theme');
      const nextTheme = currentIsDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(nextTheme === 'dark' ? 'Modo Oscuro activado 🌙' : 'Modo Claro activado ☀️', nextTheme === 'dark' ? 'dark_mode' : 'light_mode');
    });
  }

  // Supabase Session Listener (Web & Native Mobile App Deep Links)
  async function checkSupabaseSession() {
    if (!sbClient) return;
    try {
      // 1. Check if returning from web OAuth redirect with access_token (implicit flow)
      if (window.location.hash && window.location.hash.includes('access_token')) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          const { data, error } = await sbClient.auth.setSession({ access_token, refresh_token });
          if (data?.session?.user) {
            handleSupabaseUser(data.session.user);
            try { window.history.replaceState(null, null, window.location.pathname); } catch (_) {}
            return;
          }
        }
      }

      // 2. Check for PKCE auth code in URL search parameters (?code=...)
      if (window.location.search && window.location.search.includes('code=')) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
          const { data, error } = await sbClient.auth.exchangeCodeForSession(code);
          if (data?.session?.user) {
            handleSupabaseUser(data.session.user);
            try { window.history.replaceState(null, null, window.location.pathname); } catch (_) {}
            return;
          }
        }
      }

      // 3. Listen for native Android deep link appUrlOpen
      if (window.Capacitor?.Plugins?.App?.addListener) {
        window.Capacitor.Plugins.App.addListener('appUrlOpen', async (event) => {
          if (window.Capacitor?.Plugins?.Browser?.close) {
            try { await window.Capacitor.Plugins.Browser.close(); } catch (_) {}
          }
          const url = event?.url;
          if (url) {
            handleOAuthCallbackUrl(url);
          }
        });
      }

      // 4. Regular active session check
      const { data: { session }, error } = await sbClient.auth.getSession();
      if (session?.user) {
        handleSupabaseUser(session.user);
      }

      // 5. Active session state changes listener
      sbClient.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && session?.user) {
          handleSupabaseUser(session.user);
        }
      });
    } catch (e) {
      console.warn('Supabase session check notice:', e);
    }
  }

  async function handleOAuthCallbackUrl(urlStr) {
    try {
      if (urlStr.includes('access_token')) {
        const hashIdx = urlStr.indexOf('#');
        if (hashIdx !== -1) {
          const params = new URLSearchParams(urlStr.substring(hashIdx + 1));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          if (access_token && refresh_token && sbClient) {
            const { data } = await sbClient.auth.setSession({ access_token, refresh_token });
            if (data?.session?.user) {
              handleSupabaseUser(data.session.user);
              return;
            }
          }
        }
      }
      if (sbClient) {
        const { data: { session } } = await sbClient.auth.getSession();
        if (session?.user) {
          handleSupabaseUser(session.user);
        }
      }
    } catch (err) {
      console.warn('Deep link handling notice:', err);
    }
  }

  async function handleSupabaseUser(user) {
    if (!user) return;
    const meta = user.user_metadata || {};
    let fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Aventurero';
    const email = user.email || 'usuario@mision.app';
    let avatarUrl = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

    // Check Supabase profiles table for customized profile name & avatar
    if (sbClient) {
      try {
        const { data: dbProfile } = await sbClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (dbProfile) {
          if (dbProfile.full_name) fullName = dbProfile.full_name;
          if (dbProfile.avatar_url) avatarUrl = dbProfile.avatar_url;
          if (typeof dbProfile.total_impulso === 'number') {
            window.appStore.updateUserProfile({
              totalImpulso: dbProfile.total_impulso,
              chispas: dbProfile.chispas
            });
          }
        } else {
          // Upsert initial profile in DB
          await sbClient.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: avatarUrl,
            total_impulso: 0,
            chispas: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Profile fetch notice:', err);
      }
    }

    const nameDisplay = document.getElementById('onboarding-name-display');
    if (nameDisplay) {
      nameDisplay.textContent = fullName.split(' ')[0] || fullName;
    }

    const state = window.appStore.getState();
    window.appStore.loginUser({ email, fullName, avatarUrl });
    showToast(`¡Sesión iniciada como ${fullName}! 🌿`, 'check_circle', true);
    
    if (state.isOnboardingCompleted) {
      switchTab('hoy');
    } else {
      onboardingState.step = 1;
      goToOnboardingStep(1);
    }
    renderAll();
  }

  // Header Avatar / User Widget Click -> Switch to Perfil tab
  const openProfileView = (e) => {
    if (e.target.closest('#btn-toggle-theme')) return;
    window.soundEngine.playClick();
    switchTab('perfil');
  };
  document.getElementById('header-avatar-btn')?.addEventListener('click', openProfileView);
  document.getElementById('header-avatar')?.addEventListener('click', openProfileView);

  // Init Theme, Auth, Session and Onboarding UI Bindings
  initThemeSystem();
  initAuthUI();
  initOnboardingUI();
  checkSupabaseSession();

  // Initial Store Subscription and Render
  window.appStore.subscribe(renderAll);
  renderAll();
});
