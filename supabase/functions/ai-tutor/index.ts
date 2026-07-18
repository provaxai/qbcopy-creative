import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é Sócrates, tutor socrático especializado em concursos públicos brasileiros (PRF, PF, Receita Federal, INSS, Tribunais).

Missão: guiar o aluno a construir o raciocínio sozinho — nunca entregar a resposta pronta na primeira pergunta.

Regras obrigatórias:
- Responda SEMPRE em português brasileiro, tom direto e encorajador
- Máximo 3 parágrafos por resposta
- Ao final de cada resposta, faça UMA pergunta que aprofunde a compreensão
- Quando o aluno estiver no caminho certo, valide e aprofunde
- Use analogias do cotidiano (trânsito, futebol, mercado) para abstrações jurídicas
- NUNCA invente dados estatísticos, bancas ou percentuais

Comportamento por ação:
- explicar: explique o conceito com clareza, depois pergunte se faz sentido
- simplificar: use uma analogia do cotidiano, evite jargão
- resumo: bullet points concisos (máximo 5), ordene do mais ao menos importante
- flashcard: formato exato → "Frente: [pergunta direta] | Verso: [resposta em 1-2 linhas]" (crie 2 flashcards)
- questao: crie questão estilo CESPE (certo/errado) com gabarito e comentário de 2 linhas
- duvida: responda a dúvida guiando pelo método socrático`;

function buildPrompt(action: string, text: string, question: string, lessonTitle: string): string {
  const ctx = lessonTitle ? `Aula: "${lessonTitle}"\n` : "";
  const sel = text ? `Trecho:\n"${text}"\n\n` : "";
  const map: Record<string, string> = {
    explicar:    `${ctx}${sel}Explique este conceito de forma clara e didática.`,
    simplificar: `${ctx}${sel}Simplifique com uma analogia do cotidiano.`,
    resumo:      `${ctx}${sel}Crie um resumo em bullet points concisos (máximo 5 pontos).`,
    flashcard:   `${ctx}${sel}Crie 2 flashcards: "Frente: [pergunta] | Verso: [resposta curta]".`,
    questao:     `${ctx}${sel}Crie uma questão estilo CESPE (certo/errado) com gabarito e comentário.`,
    duvida:      `${ctx}${sel}Dúvida: "${question}"\nResponda guiando pelo método socrático.`,
  };
  return map[action] ?? `${ctx}${sel}${question || "Explique este conteúdo."}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  if (!GEMINI_KEY) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY não configurada." }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }

  try {
    const { action, text, question, lessonTitle } = await req.json();
    const userPrompt = buildPrompt(action, text ?? "", question ?? "", lessonTitle ?? "");

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const status = res.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Aguarde alguns segundos e tente novamente." }),
          { status: 429, headers: { ...CORS, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: data?.error?.message ?? `Gemini retornou ${status}` }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sem resposta.";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
