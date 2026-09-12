// ====================================================================
// MISIÓN — Edge Function: AI Coach (Contextual Action-Oriented Companion)
// ====================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callGeminiStructured } from '../_shared/gemini.ts';

interface CoachInput {
  user_message: string;
  active_goal_title?: string;
  recent_streak?: number;
}

interface CoachOutput {
  coach_reply: string;
  immediate_micro_step: string;
  suggested_minutes: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: CoachInput = await req.json();
    if (!body.user_message) {
      return new Response(
        JSON.stringify({ error: 'El campo "user_message" es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const goal = body.active_goal_title || 'tu meta principal';
    const streak = body.recent_streak ?? 0;

    const systemPrompt = `
Eres el Coach Personal de MISIÓN.
Tu principio es: "Menos discurso, más presencia y acción real."

REGLAS FUNDAMENTALES:
1. Sé empático, cálido y extremadamente conciso. Tu respuesta principal ("coach_reply") NO DEBE superar 70 palabras.
2. NUNCA regañes ni hagas sentir culpable al usuario si ha perdido días o se siente desmotivado.
3. Propón SIEMPRE un único micropaso inmediato ("immediate_micro_step") de 5 a 10 minutos para reactivar el impulso hoy mismo.
4. NO hagas diagnósticos médicos ni psicológicos.
`;

    const userPrompt = `
CONTEXTO DEL USUARIO:
- Meta activa: ${goal}
- Racha reciente: ${streak} días

MENSAJE DEL USUARIO:
"${body.user_message}"

Responde con empatía y define el siguiente micropaso para reanudar el avance.
`;

    const responseSchema = {
      type: 'OBJECT',
      properties: {
        coach_reply: { type: 'STRING' },
        immediate_micro_step: { type: 'STRING' },
        suggested_minutes: { type: 'INTEGER' }
      },
      required: ['coach_reply', 'immediate_micro_step', 'suggested_minutes']
    };

    const aiResult = await callGeminiStructured<CoachOutput>({
      systemPrompt,
      userPrompt,
      responseSchema,
      temperature: 0.35
    });

    return new Response(JSON.stringify({ success: true, coach: aiResult }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('ai-coach error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno en el coach de IA' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
