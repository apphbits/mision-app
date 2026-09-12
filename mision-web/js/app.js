// ====================================================================
// MISIÓN — Controlador Principal de la Aplicación (UI / Eventos / Render)
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'hoy';
  let activeCategoryFilter = 'all';

  // Confetti Particle System
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#3A7D63', '#F3A871', '#22C55E', '#FEB06D', '#B8DFCD'];
    const particles = Array.from({ length: 55 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1.2) * 14,
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
    }, 2900);
  }

  // Render Functions
  function renderAll() {
    const state = window.appStore.getState();
    const progression = window.GamificationEngine.calculateProgression(state.profile.totalImpulso);

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
      const categories = ['all', 'Mente', 'Cuerpo', 'Crecimiento', 'Finanzas', 'Bienestar'];
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
            <span class="material-symbols-outlined text-4xl text-[#3A7D63]/50 mb-2">check_circle</span>
            <p class="font-bold text-sm">No hay misiones en esta categoría</p>
            <p class="text-xs text-[#8A96A3] mt-1">Explora otra categoría o agrega una nueva acción.</p>
          </div>
        `;
      } else {
        missionsList.innerHTML = filtered.map(mission => {
          const isDone = mission.isCompleted;
          const goal = mission.goalId ? state.goals.find(g => g.id === mission.goalId) : null;
          return `
            <div data-id="${mission.id}" class="mission-card relative overflow-hidden rounded-2xl bg-white p-4 soft-shadow border border-[#EAECE6] flex items-center justify-between gap-3 ${isDone ? 'is-completed' : ''}">
              <div class="flex items-center gap-3.5 flex-1 min-w-0">
                <button data-id="${mission.id}" class="btn-check-mission w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isDone 
                    ? 'bg-[#22C55E] border-[#22C55E] text-white shadow-glow-leaf' 
                    : 'border-[#D7DDD4] bg-[#F8F9F7] text-transparent hover:border-[#3A7D63]'
                }">
                  <span class="material-symbols-outlined text-[18px]">check</span>
                </button>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="px-2 py-0.5 rounded-md bg-[#F2F3EE] text-[10px] font-bold text-[#3A7D63] uppercase tracking-wide">
                      ${mission.category}
                    </span>
                    ${goal ? `<span class="text-[11px] font-medium text-[#8A96A3] truncate">· ${goal.title}</span>` : ''}
                  </div>
                  <h4 class="font-bold text-[14px] text-[#27303A] truncate leading-tight">${mission.title}</h4>
                  <p class="text-[12px] text-[#596573] truncate mt-0.5">${mission.description}</p>
                </div>
              </div>
              
              <div class="flex flex-col items-end shrink-0 gap-1">
                <div class="flex items-center gap-1.5 text-xs font-bold text-[#3A7D63] bg-[#F0F7F4] px-2 py-0.5 rounded-lg border border-[#DBEFE6]">
                  <span>+${mission.impulso}</span>
                  <span class="text-[10px]">⚡</span>
                </div>
                <div class="flex items-center gap-1 text-[11px] font-semibold text-[#B87547]">
                  <span>+${mission.chispas}</span>
                  <span class="text-[10px]">✨</span>
                </div>
              </div>
            </div>
          `;
        }).join('');

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
      goalsStrip.innerHTML = state.goals.slice(0, 2).map(goal => `
        <div class="p-3.5 rounded-2xl bg-white soft-shadow border border-[#EAECE6] flex flex-col justify-between space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-[#3A7D63] uppercase tracking-wider">${goal.category}</span>
            <span class="text-xs font-bold text-[#27303A]">${goal.progress}%</span>
          </div>
          <div>
            <h5 class="font-bold text-[13.5px] text-[#27303A] truncate leading-tight">${goal.title}</h5>
            <p class="text-[11px] text-[#596573] truncate mt-0.5">${goal.completedMissionsCount}/${goal.totalMissionsTarget} acciones</p>
          </div>
          <div class="w-full h-1.5 rounded-full bg-[#EAECE6] overflow-hidden">
            <div class="h-full rounded-full bg-[#3A7D63] transition-all duration-500" style="width: ${goal.progress}%;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  function renderMetasView(state) {
    const goalsList = document.getElementById('vital-goals-list');
    if (!goalsList) return;

    goalsList.innerHTML = state.goals.map(goal => `
      <div class="w-full bg-white rounded-3xl p-5 soft-shadow border border-[#EAECE6] flex flex-col space-y-3.5 relative overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#F0F7F4] border border-[#DBEFE6] flex items-center justify-center text-[#3A7D63]">
              <span class="material-symbols-outlined text-[22px]">${goal.icon || 'flag'}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-[#3A7D63] uppercase tracking-wider">${goal.category}</span>
              <h3 class="font-display font-bold text-[16px] text-[#27303A] leading-tight">${goal.title}</h3>
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
          <span class="text-[11px] font-medium text-[#8A96A3]">Árbol de Progreso Vital</span>
          <button data-goal-id="${goal.id}" class="btn-add-mission-to-goal text-xs font-bold text-[#3A7D63] hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Vincular Misión</span>
          </button>
        </div>
      </div>
    `).join('');

    goalsList.querySelectorAll('.btn-add-mission-to-goal').forEach(btn => {
      btn.addEventListener('click', () => {
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
    const evoNext = document.getElementById('evo-next-rank');

    if (evoTitle) evoTitle.textContent = `${progression.title}`;
    if (evoSub) evoSub.textContent = `Nivel ${progression.level} · Camino a Nv. ${progression.level + 1}`;
    if (evoImpulsoTotal) evoImpulsoTotal.textContent = `${progression.totalImpulso.toLocaleString()} Impulso Total`;
    if (evoImpulsoProg) evoImpulsoProg.textContent = `${progression.currentXPInLevel} / ${progression.xpNeededInLevel} (${progression.percentage}%)`;
    if (evoBar) evoBar.style.width = `${progression.percentage}%`;
    if (evoStreak) evoStreak.textContent = `${state.profile.currentStreak} Días`;
    if (evoDiscipline) evoDiscipline.textContent = `${state.profile.disciplineRate}%`;
    if (evoNext) evoNext.textContent = `Próximo: ${progression.nextTitle}`;

    // Achievements list
    const achContainer = document.getElementById('achievements-grid');
    if (achContainer) {
      achContainer.innerHTML = window.GamificationEngine.ACHIEVEMENTS_CATALOG.map(ach => {
        const isUnlocked = state.unlockedAchievements.includes(ach.code);
        return `
          <div class="p-3.5 rounded-2xl border transition-all ${
            isUnlocked 
              ? 'bg-white border-[#DBEFE6] soft-shadow' 
              : 'bg-[#F4F4F0]/60 border-[#EAECE6] opacity-60'
          } flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isUnlocked ? 'bg-[#F0F7F4] text-[#3A7D63]' : 'bg-[#EAECE6] text-[#8A96A3]'
            }">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' ${isUnlocked ? 1 : 0};">${ach.icon}</span>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-[13px] text-[#27303A] truncate">${ach.title}</h4>
                <span class="text-[10px] font-bold text-[#B87547]">+${ach.reward}✨</span>
              </div>
              <p class="text-[11px] text-[#596573] line-clamp-2 leading-tight mt-0.5">${ach.description}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Rewards bazaar
    const rewardsContainer = document.getElementById('rewards-bazaar');
    if (rewardsContainer) {
      rewardsContainer.innerHTML = state.rewards.map(rew => `
        <div class="p-4 rounded-2xl bg-white border border-[#EAECE6] soft-shadow flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#FFF8F3] border border-[#FCD9C2] text-[#F3A871] flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">${rew.icon}</span>
            </div>
            <div>
              <h4 class="font-bold text-[13.5px] text-[#27303A] leading-tight">${rew.title}</h4>
              <p class="text-[11.5px] text-[#596573] mt-0.5">${rew.description}</p>
            </div>
          </div>
          <button data-id="${rew.id}" class="btn-buy-reward px-3.5 py-2 rounded-xl bg-[#FFF8F3] hover:bg-[#FDEEE3] border border-[#FCD9C2] text-[#B87547] font-bold text-xs shrink-0 active:scale-95 transition-all flex items-center gap-1">
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

    if (profileName) profileName.textContent = state.profile.fullName;
    if (profileEmail) profileEmail.textContent = state.profile.email;
    if (profileRank) profileRank.textContent = `Nivel ${progression.level} · ${progression.title}`;
    if (totalComps) totalComps.textContent = state.completions.length;
    if (totalImpulso) totalImpulso.textContent = state.profile.totalImpulso;
    if (bestStreak) bestStreak.textContent = `${state.profile.bestStreak} Días`;
  }

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

  // Form Submissions
  const formGoal = document.getElementById('form-goal');
  if (formGoal) {
    formGoal.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('form-goal-title').value;
      const desc = document.getElementById('form-goal-desc').value;
      const cat = document.getElementById('form-goal-cat').value;
      const targetDate = document.getElementById('form-goal-date').value;
      const targetCount = document.getElementById('form-goal-count').value;

      if (!title) return;

      const res = window.appStore.addGoal({
        title,
        description: desc,
        category: cat,
        targetDate,
        totalMissionsTarget: targetCount
      });

      window.soundEngine.playSpark();
      launchConfetti();
      showToast('¡Meta creada con éxito!');
      closeGoalModal();
      formGoal.reset();
      renderAll();
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
  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    if (confirm('¿Deseas reiniciar los datos de ejemplo del MVP?')) {
      window.appStore.resetData();
      showToast('Datos reiniciados');
      renderAll();
    }
  });

  // Tab Navigation System
  function switchTab(target) {
    if (!target) return;
    activeTab = target;

    // Update bottom navigation bar items
    document.querySelectorAll('nav .bottom-nav-link').forEach(l => {
      const isTarget = l.dataset.tab === target;
      if (isTarget) {
        l.classList.remove('text-charcoal-muted', 'w-10', 'h-10');
        l.classList.add('bg-[#27303A]', 'text-leaf-500', 'px-3.5', 'py-2', 'shadow-sm');
        l.querySelector('.nav-label')?.classList.remove('hidden');
      } else {
        l.classList.remove('bg-[#27303A]', 'text-leaf-500', 'px-3.5', 'py-2', 'shadow-sm');
        l.classList.add('text-charcoal-muted', 'w-10', 'h-10');
        l.querySelector('.nav-label')?.classList.add('hidden');
      }
    });

    // Hide all view panels and show target panel
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`view-${target}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind click on any element with data-tab (navigation pills, view all buttons, header chips)
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.soundEngine.playClick();
      switchTab(el.dataset.tab);
    });
  });

  // Initial Store Subscription and Render
  window.appStore.subscribe(renderAll);
  renderAll();
});
