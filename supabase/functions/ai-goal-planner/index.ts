// ====================================================================
// MISIÓN — Edge Function: AI Goal Planner (Dream → Goal + Roadmap + Missions)
// ====================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callGeminiStructured, VALID_CATEGORIES } from '../_shared/gemini.ts';
import { getSupabaseAdmin, getSupabaseUserClient } from '../_shared/supabase.ts';

interface GoalPlanInput {
  dream: string;
  daily_minutes?: number;
  current_level?: string;
  meaning?: string;
  category?: string;
}

interface GeneratedMission {
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Normal' | 'Difícil';
  duration_minutes: number;
}

interface GeneratedRoadmapStage {
  stage: number;
  title: string;
}

interface GeneratedPlanOutput {
  goal: {
    title: string;
    description: string;
    category: string;
    target_weeks: number;
    icon: string;
    color: string;
  };
  roadmap: GeneratedRoadmapStage[];
  first_missions: GeneratedMission[];
}

const CATEGORY_ICONS: Record<string, string> = {
  Mente: 'spa',
  Cuerpo: 'fitness_center',
  Relaciones: 'favorite',
  Crecimiento: 'language',
  Finanzas: 'savings',
  Creatividad: 'palette',
  Experiencias: 'flight_takeoff',
  Bienestar: 'local_florist'
};

const CATEGORY_COLORS: Record<string, string> = {
  Mente: '#4B8FB2',
  Cuerpo: '#4A7C59',
  Relaciones: '#E05A47',
  Crecimiento: '#3A7D63',
  Finanzas: '#B87547',
  Creatividad: '#8E54A2',
  Experiencias: '#2D82B7',
  Bienestar: '#22C55E'
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: GoalPlanInput = await req.json();
    if (!body.dream || typeof body.dream !== 'string' || body.dream.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'El campo "dream" es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dailyMinutes = body.daily_minutes || 10;
    const currentLevel = body.current_level || 'Principiante';
    const meaning = body.meaning || 'Avanzar de forma consistente hacia mi sueño';
    const categoryHint = body.category || '';

    const systemPrompt = `
Eres el Arquitecto de Metas de MISIÓN, una aplicación de desarrollo personal gamificada.
Tu filosofía es: Sueño → Meta Vital → Ruta en Etapas → Pequeñas Misiones de Acción Real.

REGLAS ESTRICTAS:
1. Las misiones DEBEN ser acciones físicas y reales que el usuario pueda completar en su vida cotidiana en ${dailyMinutes} minutos.
2. NO des consejos genéricos ("mejora tu salud", "estudia más"). Sé ultra concreto ("Caminar 10 minutos a ritmo rápido", "Aprender 5 palabras de inglés").
3. La categoría DEBE ser exactamente una de estas 8: ${VALID_CATEGORIES.join(', ')}.
4. Genera de 3 a 5 primeras misiones iniciales realizables y sin fricción (dificultad: "Fácil" o "Normal").
5. La ruta debe contener de 3 a 4 etapas secuenciales claras.
`;

    const userPrompt = `
SUEÑO DEL USUARIO: "${body.dream}"
DEDICACIÓN DIARIA: ${dailyMinutes} minutos al día.
NIVEL ACTUAL: ${currentLevel}
SIGNIFICADO / PROPÓSITO: "${meaning}"
${categoryHint ? `CATEGORÍA SUGERIDA: ${categoryHint}` : ''}

Convierte este sueño en una Meta Vital accionable, su Ruta de etapas y sus primeras 3-5 misiones.
`;

    const responseSchema = {
      type: 'OBJECT',
      properties: {
        goal: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            category: { type: 'STRING', enum: [...VALID_CATEGORIES] },
            target_weeks: { type: 'INTEGER' }
          },
          required: ['title', 'description', 'category', 'target_weeks']
        },
        roadmap: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              stage: { type: 'INTEGER' },
              title: { type: 'STRING' }
            },
            required: ['stage', 'title']
          }
        },
        first_missions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              description: { type: 'STRING' },
              difficulty: { type: 'STRING', enum: ['Fácil', 'Normal', 'Difícil'] },
              duration_minutes: { type: 'INTEGER' }
            },
            required: ['title', 'description', 'difficulty', 'duration_minutes']
          }
        }
      },
      required: ['goal', 'roadmap', 'first_missions']
    };

    const aiResult = await callGeminiStructured<GeneratedPlanOutput>({
      systemPrompt,
      userPrompt,
      responseSchema,
      temperature: 0.3
    });

    // Validate category fallback
    if (!VALID_CATEGORIES.includes(aiResult.goal.category as any)) {
      aiResult.goal.category = 'Crecimiento';
    }

    const icon = CATEGORY_ICONS[aiResult.goal.category] || 'flag';
    const color = CATEGORY_COLORS[aiResult.goal.category] || '#3A7D63';

    // Enrich missions with deterministic gamification rewards
    const enrichedMissions = aiResult.first_missions.map(m => {
      let impulso = 25;
      let chispas = 10;
      if (m.difficulty === 'Fácil') {
        impulso = 10;
        chispas = 5;
      } else if (m.difficulty === 'Difícil') {
        impulso = 50;
        chispas = 20;
      }
      return {
        ...m,
        category: aiResult.goal.category,
        impulso_reward: impulso,
        chispas_reward: chispas
      };
    });

    // Check if user is authenticated to persist automatically
    const authHeader = req.headers.get('Authorization');
    let persistedGoalId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const userClient = getSupabaseUserClient(authHeader);
        const { data: { user } } = await userClient.auth.getUser();

        if (user) {
          const adminClient = getSupabaseAdmin();

          // 1. Insert Goal
          const { data: goalData, error: goalErr } = await adminClient
            .from('goals')
            .insert({
              user_id: user.id,
              title: aiResult.goal.title,
              description: aiResult.goal.description,
              category: aiResult.goal.category,
              icon: icon,
              color: color,
              progress: 0
            })
            .select('id')
            .single();

          if (goalData && !goalErr) {
            persistedGoalId = goalData.id;

            // 2. Insert Roadmap Stages
            if (aiResult.roadmap && aiResult.roadmap.length > 0) {
              const roadmapRows = aiResult.roadmap.map(r => ({
                goal_id: persistedGoalId,
                user_id: user.id,
                title: r.title,
                stage_order: r.stage,
                status: r.stage === 1 ? 'in_progress' : 'pending'
              }));
              await adminClient.from('ai_roadmaps').insert(roadmapRows);
            }

            // 3. Insert Missions & Link to Goal
            for (const mission of enrichedMissions) {
              const { data: mData } = await adminClient
                .from('missions')
                .insert({
                  user_id: user.id,
                  title: mission.title,
                  description: mission.description,
                  category: aiResult.goal.category,
                  difficulty: mission.difficulty,
                  duration_minutes: mission.duration_minutes,
                  impulso_reward: mission.impulso_reward,
                  chispas_reward: mission.chispas_reward,
                  is_system_template: false
                })
                .select('id')
                .single();

              if (mData) {
                await adminClient.from('goal_missions').insert({
                  goal_id: persistedGoalId,
                  mission_id: mData.id
                });
              }
            }
          }
        }
      } catch (dbErr) {
        console.warn('Could not auto-persist plan (proceeding with ephemeral response):', dbErr);
      }
    }

    const payload = {
      success: true,
      goal: {
        id: persistedGoalId,
        title: aiResult.goal.title,
        description: aiResult.goal.description,
        category: aiResult.goal.category,
        target_weeks: aiResult.goal.target_weeks,
        icon,
        color
      },
      roadmap: aiResult.roadmap,
      first_missions: enrichedMissions
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('ai-goal-planner fatal error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno al generar el plan de metas' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
