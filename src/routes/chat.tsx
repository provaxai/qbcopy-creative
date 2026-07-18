import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat IA — EstudaMais" },
      { name: "description", content: "Converse com assistentes de IA treinados para tirar dúvidas de qualquer matéria." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Olá! Sou seu assistente de estudos. Sobre qual matéria você quer conversar hoje?" },
  ]);

  return (
    <FeaturePage
      eyebrow="💬 Chat IA"
      title="Tire dúvidas com um professor virtual 24h"
      subtitle="Assistentes de IA treinados por matéria, com explicações passo a passo, exemplos e exercícios personalizados."
      bullets={[
        "Explicações passo a passo com exemplos",
        "Assistentes especializados por disciplina",
        "Histórico salvo por matéria e tópico",
        "Gera exercícios sob demanda para você praticar",
      ]}
      extra={
        <div className="flex flex-col h-full min-h-[280px]">
          <div className="flex-1 space-y-2 overflow-y-auto">
            {log.map((m, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-xl max-w-[85%] ${m.role === "ai" ? "bg-white border border-slate-200 text-slate-700" : "bg-indigo-600 text-white ml-auto"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!msg.trim()) return;
              const q = msg;
              setLog((l) => [...l, { role: "user", text: q }, { role: "ai", text: "Ótima pergunta! (demo) Cadastre-se para receber a resposta completa da IA." }]);
              setMsg("");
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Pergunte algo…"
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-indigo-400"
            />
            <button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-sm font-semibold">Enviar</button>
          </form>
        </div>
      }
    />
  );
}
