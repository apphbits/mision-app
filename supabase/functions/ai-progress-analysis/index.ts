// ====================================================================
// MISIÓN — Edge Function: AI Progress Analysis (Pattern Recognition)
// ====================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callGeminiStructured } from '../_shared/gemini.ts';
import { getSupabaseUserClient } from '../_shared/supabase.ts';

interface ProgressAnalysisOutput {
  summary_headline: string;
  strongest_pattern: string;
  key_observation: string;
  recommended_adjustment: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    let userCompletionsCount = 0;
    let streakDays = 0;
    let topCategory = 'Crecimiento';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const userClient = getSupabaseUserClient(authHeader);
        const { data: { user } } = await userClient.auth.getUser();

        if (user) {
          const { data: comps } = await userClient
            .from('mission_completions')
            .select('id, impulso_earned, completed_at')
            .order('completed_at', { ascending: false })
            .limit(20);

          const { data: streakData } = await userClient
            .from('streaks')
            .select('current_streak')
            .single();

          userCompletionsCount = comps?.length || 0;
          streakDays = streakData?.current_streak || 0;
        }
      } catch (e) {
        console.warn('Could not load user history for analysis, using payload stats:', e);
      }
    }

    const systemPrompt = `
Eres el Analista de Progreso y Patrones de MISIÓN.
Tu objetivo es analizar el ritmo de constancia del usuario e identificar patrones clave para felicitar su disciplina o sugerir 1 ajuste estratégico simple.

REGLAS:
1. Sé conciso, alentador y fundamentado en la acción real.
2. Destaca el patrón más fuerte y da exactamente 1 recomendación accionable.
3. Máximo 150 palabras en total.
`;

    const userPrompt = `
DATOS DE RENDIMIENTO:
- Misiones completadas recientes: ${userCompletionsCount}
- Racha actual: ${streakDays} días
- Categoría de mayor enfoque: ${topCategory}

Genera un análisis sintético del ritmo de progreso.
`;

    const responseSchema = {
      type: 'OBJECT',
      properties: {
        summary_headline: { type: 'STRING' },
        strongest_pattern: { type: 'STRING' },
        key_observation: { type: 'STRING' },
        recommended_adjustment: { type: 'STRING' }
      },
      required: ['summary_headline', 'strongest_pattern', 'key_observation', 'recommended_adjustment']
    };

    const aiResult = await callGeminiStructured<ProgressAnalysisOutput>({
      systemPrompt,
      userPrompt,
      responseSchema,
      temperature: 0.3
    });

    return new Response(JSON.stringify({ success: true, analysis: aiResult }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('ai-progress-analysis error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno al analizar el progreso' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
