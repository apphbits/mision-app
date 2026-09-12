-- ====================================================================
-- MISIÓN — SUPABASE AI TABLES MIGRATION
-- ====================================================================

-- 1. Rutas de progreso de metas
CREATE TABLE IF NOT EXISTS public.ai_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    stage_order INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Recomendaciones de adaptación e insights
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('adaptation', 'pattern_insight', 'coach_tip')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_applied BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.ai_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own roadmaps' AND tablename = 'ai_roadmaps') THEN
        CREATE POLICY "Users manage own roadmaps" ON public.ai_roadmaps FOR ALL USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own recommendations' AND tablename = 'ai_recommendations') THEN
        CREATE POLICY "Users manage own recommendations" ON public.ai_recommendations FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;
