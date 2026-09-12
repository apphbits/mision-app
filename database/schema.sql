-- ====================================================================
-- MISIÓN — SUPABASE / POSTGRESQL SCHEMA (MVP)
-- Arquitectura técnica limpia, RLS y triggers deterministas
-- ====================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla: profiles (Usuarios)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    total_impulso INTEGER DEFAULT 0 CHECK (total_impulso >= 0),
    chispas INTEGER DEFAULT 0 CHECK (chispas >= 0),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Tabla: goals (Sueños y Metas vitales)
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Mente', 'Cuerpo', 'Relaciones', 'Crecimiento', 'Finanzas', 'Creatividad', 'Experiencias', 'Bienestar')),
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    progress NUMERIC(5,2) DEFAULT 0.00 CHECK (progress >= 0.00 AND progress <= 100.00),
    icon TEXT DEFAULT 'flag',
    color TEXT DEFAULT '#3A7D63',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Tabla: missions (Catálogo y plantillas de misiones)
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Mente', 'Cuerpo', 'Relaciones', 'Crecimiento', 'Finanzas', 'Creatividad', 'Experiencias', 'Bienestar')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Fácil', 'Normal', 'Difícil', 'Épica')),
    duration_minutes INTEGER DEFAULT 15,
    impulso_reward INTEGER NOT NULL DEFAULT 25,
    chispas_reward INTEGER NOT NULL DEFAULT 10,
    is_system_template BOOLEAN DEFAULT true,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Tabla: goal_missions (Relación N:M entre metas y misiones)
CREATE TABLE IF NOT EXISTS public.goal_missions (
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, mission_id)
);

-- 6. Tabla: daily_missions (Asignación diaria al usuario)
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    assigned_date DATE DEFAULT CURRENT_DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, mission_id, assigned_date)
);

-- 7. Tabla: mission_completions (Historial de misiones realizadas)
CREATE TABLE IF NOT EXISTS public.mission_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    impulso_earned INTEGER NOT NULL DEFAULT 0,
    chispas_earned INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    notes TEXT
);

-- 8. Tabla: streaks (Rachas y constancia)
CREATE TABLE IF NOT EXISTS public.streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 1,
    best_streak INTEGER DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    freezes_available INTEGER DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 9. Tabla: achievements (Catálogo de logros)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    condition_type TEXT NOT NULL,
    condition_value INTEGER NOT NULL,
    reward_chispas INTEGER DEFAULT 15 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. Tabla: user_achievements (Logros desbloqueados)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- 11. Tabla: rewards (Catálogo de recompensas canjeables)
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cost_chispas INTEGER NOT NULL,
    icon_name TEXT NOT NULL,
    reward_type TEXT DEFAULT 'personal_wellbeing',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 12. Tabla: user_rewards (Recompensas canjeadas por el usuario)
CREATE TABLE IF NOT EXISTS public.user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 13. Tabla: notifications (Notificaciones del sistema)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'reminder',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Sólo el propietario puede ver y editar su perfil
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Goals: Cada usuario gestiona sus metas
CREATE POLICY "Users manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- Missions: Todos ven plantillas de sistema, los usuarios gestionan sus misiones personalizadas
CREATE POLICY "Users see system missions or their own" ON public.missions FOR SELECT USING (is_system_template = true OR auth.uid() = user_id);
CREATE POLICY "Users insert their own missions" ON public.missions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Missions
CREATE POLICY "Users manage own daily missions" ON public.daily_missions FOR ALL USING (auth.uid() = user_id);

-- Mission Completions
CREATE POLICY "Users manage own mission completions" ON public.mission_completions FOR ALL USING (auth.uid() = user_id);

-- Streaks
CREATE POLICY "Users manage own streaks" ON public.streaks FOR ALL USING (auth.uid() = user_id);

-- Achievements & Rewards: Catálogo público autenticado
CREATE POLICY "Achievements read only for authenticated" ON public.achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Rewards read only for authenticated" ON public.rewards FOR SELECT TO authenticated USING (true);

-- User Achievements & User Rewards
CREATE POLICY "Users manage own unlocked achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own redeemed rewards" ON public.user_rewards FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- ÍNDICES DE RENDIMIENTO
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_date ON public.daily_missions(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_mission_completions_user_time ON public.mission_completions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
