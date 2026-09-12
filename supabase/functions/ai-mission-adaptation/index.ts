// ====================================================================
// MISIÓN — Edge Function: AI Mission Adaptation (Friction Reduction)
// ====================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callGeminiStructured, VALID_CATEGORIES } from '../_shared/gemini.ts';

interface MissionAdaptationInput {
  mission_title: string;
  mission_description?: string;
  category?: string;
  duration_minutes?: number;
  reason?: string;
}

interface AdaptedMission {
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: 'Fácil' | 'Normal';
}

interface AdaptationOutput {
  encouragement: string;
  adapted_missions: AdaptedMission[];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: MissionAdaptationInput = await req.json();
    if (!body.mission_title) {
      return new Response(
        JSON.stringify({ error: 'El campo "mission_title" es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reason = body.reason || 'Siento que la tarea es muy larga o difícil en este momento.';
    const duration = body.duration_minutes || 30;

    const systemPrompt = `
Eres el Optimizador de Hábitos y Fricción de MISIÓN.
Tu principio es: "Si una misión genera resistencia, no juzgues al usuario; divide la misión en micropasos fáciles de 5 a 15 minutos".

REGLAS:
1. Divide la misión original en 2 o 3 micro-misiones simples, progresivas e inmediatas.
2. Cada micro-misión debe durar entre 5 y 15 minutos máximo.
3. El tono del mensaje de ánimo ("encouragement") debe ser empático, corto y centrado en dar el primer paso.
`;

    const userPrompt = `
MISIÓN ORIGINAL: "${body.mission_title}"
DESCRIPCIÓN: "${body.mission_description || 'Sin descripción'}"
DURACIÓN ORIGINAL: ${duration} minutos
MOTIVO DE FRICCIÓN: "${reason}"

Desglosa esta misión en micropasos de baja fricción para comenzar hoy mismo.
`;

    const responseSchema = {
      type: 'OBJECT',
      properties: {
        encouragement: { type: 'STRING' },
        adapted_missions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              description: { type: 'STRING' },
              duration_minutes: { type: 'INTEGER' },
              difficulty: { type: 'STRING', enum: ['Fácil', 'Normal'] }
            },
            required: ['title', 'description', 'duration_minutes', 'difficulty']
          }
        }
      },
      required: ['encouragement', 'adapted_missions']
    };

    const aiResult = await callGeminiStructured<AdaptationOutput>({
      systemPrompt,
      userPrompt,
      responseSchema,
      temperature: 0.3
    });

    const enriched = aiResult.adapted_missions.map(m => ({
      ...m,
      impulso_reward: m.difficulty === 'Fácil' ? 10 : 25,
      chispas_reward: m.difficulty === 'Fácil' ? 5 : 10
    }));

    return new Response(
      JSON.stringify({
        success: true,
        encouragement: aiResult.encouragement,
        adapted_missions: enriched
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('ai-mission-adaptation error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno al adaptar la misión' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
