import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EstudaMais — Aprenda mais rápido com IA" },
      {
        name: "description",
        content:
          "Plataforma de estudos com IA: resumos, flashcards, chat, PDF IA, esquemas, legislação, discursivas e prova oral.",
      },
    ],
  }),
  component: Home,
});

type Feature = {
  to: string;
  icon: string;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  { to: "/cursos", icon: "🎓", title: "Cursos", desc: "Trilhas organizadas com materiais exclusivos para você evoluir com foco." },
  { to: "/resumos", icon: "📝", title: "Resumo Inteligente", desc: "Gere resumos com lacunas a partir de textos ou PDFs e fixe o conteúdo mais rápido." },
  { to: "/chat", icon: "💬", title: "Chat IA", desc: "Converse com assistentes treinados para tirar dúvidas de qualquer matéria." },
  { to: "/pdf-ia", icon: "📚", title: "PDF IA", desc: "Envie um PDF e transforme em flashcards, quizzes, resumos em áudio e mais." },
  { to: "/flashcards", icon: "🃏", title: "Flashcards", desc: "Revise com cartões inteligentes gerados automaticamente e acompanhe sua evolução." },
  { to: "/esquema", icon: "🧠", title: "Esquema IA", desc: "Transforme conteúdos densos em mapas visuais que facilitam a memorização." },
  { to: "/legis", icon: "⚖️", title: "Legis", desc: "Constituição, leis e decretos com lacunas para memorização estruturada." },
  { to: "/discursiva", icon: "✍️", title: "Treinador de Discursiva", desc: "Pratique questões discursivas e receba feedback detalhado da IA." },
  { to: "/prova-oral", icon: "🎙️", title: "Prova Oral", desc: "Simule bancas orais com perguntas realistas e avaliação instantânea." },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

function Home() {
  const [target] = useState(() => new Date(Date.now() + 7 * 86400000));
  const { d, h, m, s } = useCountdown(target);

  return (
    <AppShell>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-8 text-center">
        <div className="inline-block text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full px-3 py-1">
          ✦ Inteligência de Estudos
        </div>
        <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tight text-indigo-600">
          EstudaMais
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Estude com inteligência, aprenda com profundidade. Nove ferramentas de IA em uma só plataforma.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/cadastro" className="inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition">
            Comece grátis agora
          </Link>
          <Link to="/planos" className="inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition">
            VER PLANOS PREMIUM
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["1.240+", "Alunos em streak ativo"],
            ["82,3%", "Média de acerto real"],
            ["4,2h", "Tempo semanal poupado"],
            ["12.000+", "Questões resolvidas"],
          ].map(([n, l]) => (
            <div key={l} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-black text-indigo-600">{n}</div>
              <div className="text-xs text-slate-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Inteligência educacional</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">Cursos tradicionais dão 1.500 videoaulas. Nós entregamos aprendizado.</h2>
          <p className="mt-3 text-slate-600">A EstudaMais personaliza cada minuto do seu dia para eficiência total.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
            <div className="font-bold text-rose-700 mb-4">Método antigo (estudo passivo)</div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>✕ <b>Volume sem rumo:</b> centenas de horas de vídeo com baixa fixação.</li>
              <li>✕ <b>Cronograma congelado:</b> planilhas genéricas que não se adaptam.</li>
              <li>✕ <b>Curva do esquecimento:</b> sem revisão ativa você perde 70% em 72h.</li>
              <li>✕ <b>Métricas nulas:</b> questões aleatórias sem previsão de desempenho.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <div className="font-bold text-emerald-700 mb-4">EstudaMais (estudo ativo)</div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li>✓ <b>Precisão cirúrgica:</b> foco nos blocos de maior relevância histórica.</li>
              <li>✓ <b>Planejador dinâmico:</b> cronograma que se reconstrói toda semana.</li>
              <li>✓ <b>Repetição espaçada:</b> flashcards acionados no momento certo.</li>
              <li>✓ <b>Probabilidade preditiva:</b> métrica única de aprovação em tempo real.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dashboard mock */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> estudamais.app/painel — ao vivo
            </div>
            <div className="text-xs text-slate-400">Painel</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-slate-900">Bom dia, Estudante 👋</h3>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full">92 dias para a prova</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["Nota líquida", "+12", "pts acumulados"],
                ["Taxa de acerto", "78%", "últimas 20 q."],
                ["Streak", "🔥 5", "dias seguidos"],
              ].map(([k, v, sub]) => (
                <div key={k} className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{v}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-700 mb-2">Missão do dia · 0/3 concluídas</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"><span>📘</span> 10 questões de Legislação de Trânsito</li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"><span>🃏</span> Revisar 5 flashcards de Direito Penal</li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"><span>⏱️</span> Sessão modo foco — 25 minutos</li>
              </ul>
            </div>
            <div className="mt-5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-4 text-sm text-slate-700">
              🦉 <b>Recomendação da IA:</b> ritmo consistente. Foque em <b>Redação</b> esta semana — 15 min/dia fecham o gap antes do próximo simulado.
            </div>
          </div>
        </div>
      </section>

      {/* Promo */}
      <section id="planos" className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <div className="rounded-3xl overflow-hidden border border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-sm">
          <div className="bg-amber-400 text-amber-950 font-bold text-center py-2 text-sm tracking-wide">
            ⚡ OFERTA RELÂMPAGO — TERMINA EM BREVE
          </div>
          <div className="p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">🎯 Plano Anual com Super Desconto!</h2>
            <p className="mt-2 text-slate-600">Economia real · Acesso total à plataforma EstudaMais</p>
            <div className="mt-6">
              <div className="text-4xl md:text-5xl font-black text-indigo-600">12x de R$ 34,90</div>
              <div className="mt-1 text-slate-600">Ou R$ 339,00 / ano à vista</div>
            </div>
            <p className="mt-6 text-slate-700 font-medium">⏰ A oferta especial encerra em:</p>
            <div className="mt-3 flex justify-center gap-3">
              <TimeBox n={d} label="Dias" />
              <TimeBox n={h} label="Horas" />
              <TimeBox n={m} label="Minutos" />
              <TimeBox n={s} label="Segundos" />
            </div>
            <Link to="/planos" className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition">
              🔥 Quero Garantir Meu Desconto
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Tudo integrado</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">Uma suíte completa de inteligência</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to} className="group block bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200 transition">
              <div className="text-4xl">{f.icon}</div>
              <div className="mt-4 font-bold text-slate-900 group-hover:text-indigo-700">{f.title}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              <div className="mt-4 text-sm font-semibold text-indigo-600">Abrir →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Prova social</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">Quem já estuda com a EstudaMais</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Em 2 meses minha média nos simulados foi de 58% para 79%. A IA achou minhas falhas antes de eu perceber.", "LF", "Lucas Ferreira", "Aprovado 2024"],
            ["O cronograma adaptativo mudou tudo. Cada semana tem foco claro e os flashcards reforçam o que eu esqueço.", "CS", "Camila Souza", "Estudante — 6h/dia"],
            ["Aprendi quando vale marcar e quando deixar em branco. Economizei 8 pontos de penalidade na prova real.", "RM", "Rafael Mendes", "Aprovado 2025"],
          ].map(([q, ini, nome, sub]) => (
            <div key={nome} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm text-slate-700 leading-relaxed">"{q}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white font-bold text-sm">{ini}</div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{nome}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-24">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center">Perguntas frequentes</h2>
        <div className="mt-8 space-y-3">
          {[
            ["A EstudaMais é atualizada com os editais mais recentes?", "Sim. Nossa base é revisada continuamente e acompanha mudanças de banca e legislação."],
            ["Posso usar meus próprios materiais?", "Sim. Envie PDFs e textos para gerar resumos, flashcards e quizzes automaticamente."],
            ["Como funciona a garantia?", "7 dias de teste grátis, sem cartão. Se cancelar, você não paga nada."],
            ["Funciona no celular?", "Sim, a plataforma é 100% responsiva no navegador do seu smartphone."],
          ].map(([q, a]) => (
            <details key={q} className="group bg-white rounded-xl border border-slate-200 p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-slate-800">
                {q}
                <span className="text-indigo-600 group-open:rotate-45 transition">＋</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function TimeBox({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white border border-slate-200 rounded-xl w-16 md:w-20 py-3 shadow-sm">
      <div className="text-2xl md:text-3xl font-black text-slate-900 tabular-nums">{String(n).padStart(2, "0")}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-wider text-slate-500 mt-1">{label}</div>
    </div>
  );
}
