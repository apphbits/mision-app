// ====================================================================
// MISIÓN — Gemini AI Client for Supabase Edge Functions (Deno / TS)
// ====================================================================

export const VALID_CATEGORIES = [
  'Mente',
  'Cuerpo',
  'Relaciones',
  'Crecimiento',
  'Finanzas',
  'Creatividad',
  'Experiencias',
  'Bienestar'
] as const;

export type Category = typeof VALID_CATEGORIES[number];

export interface GeminiStructuredOptions {
  systemPrompt: string;
  userPrompt: string;
  responseSchema?: Record<string, any>;
  temperature?: number;
}

export async function callGeminiStructured<T>(options: GeminiStructuredOptions): Promise<T> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY secret is not set in Supabase');
  }

  const model = 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody: Record<string, any> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${options.systemPrompt}\n\n${options.userPrompt}` }]
      }
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      responseMimeType: 'application/json'
    }
  };

  if (options.responseSchema) {
    requestBody.generationConfig.responseSchema = options.responseSchema;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', response.status, errorText);
    throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Gemini API returned empty response candidates');
  }

  try {
    return JSON.parse(textOutput) as T;
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', textOutput);
    throw new Error('Invalid JSON format received from Gemini');
  }
}
