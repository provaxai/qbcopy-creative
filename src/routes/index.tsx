import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EstudaMais — Aprenda mais rápido com IA" },
      {
        name: "description",
        content:
          "Plataforma completa de estudos com IA: resumos inteligentes, flashcards, chat IA, PDF IA, esquemas, legislação, discursivas e prova oral.",
      },
      { property: "og:title", content: "EstudaMais — Aprenda mais rápido com IA" },
      {
        property: "og:description",
        content:
          "Ferramentas inteligentes para turbinar seus estudos: resumos, flashcards, chat IA e muito mais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type Feature = {
  icon: string;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: "🎓",
    title: "Cursos",
    desc: "Trilhas de estudo cuidadosamente organizadas com materiais exclusivos para você evoluir com foco.",
  },
  {
    icon: "📝",
    title: "Resumo Inteligente",
    desc: "Gere resumos com lacunas interativas a partir de textos ou PDFs e fixe o conteúdo muito mais rápido.",
  },
  {
    icon: "💬",
    title: "Chat IA",
    desc: "Converse com assistentes de IA treinados para tirar dúvidas e explicar qualquer matéria.",
  },
  {
    icon: "📚",
    title: "PDF IA",
    desc: "Envie um PDF e transforme em flashcards, quizzes gamificados, resumos em áudio e muito mais.",
  },
  {
    icon: "🃏",
    title: "Flashcards",
    desc: "Revise com cartões inteligentes gerados automaticamente e acompanhe sua evolução card a card.",
  },
  {
    icon: "🧠",
    title: "Esquema IA",
    desc: "Transforme conteúdos densos em mapas visuais organizados que facilitam a memorização.",
  },
  {
    icon: "⚖️",
    title: "Legis",
    desc: "Estude legislação de forma estruturada: Constituição, leis e decretos com lacunas para decorar.",
  },
  {
    icon: "✍️",
    title: "Treinador de Discursiva",
    desc: "Pratique questões discursivas e receba feedback detalhado da IA sobre sua redação.",
  },
  {
    icon: "🎙️",
    title: "Prova Oral",
    desc: "Simule bancas de prova oral com perguntas realistas e avaliação instantânea do seu desempenho.",
  },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function Home() {
  // Countdown ~7 days out from mount
  const [target] = useState(() => new Date(Date.now() + 7 * 86400000));
  const { d, h, m, s } = useCountdown(target);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_285)] text-slate-800">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            aria-label="Alternar menu"
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
          >
            <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
            <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
            <span className="block w-5 h-0.5 bg-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white font-bold">
              E+
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">
              EstudaMais<span className="text-indigo-600">.app</span>
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-1 md:gap-2">
          <a
            href="#entrar"
            className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            ↪ Entrar
          </a>
          <a
            href="#cadastro"
            className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            ✦ Cadastrar
          </a>
        </nav>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-20 w-64 bg-white border-r border-slate-200 p-4 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="flex flex-col gap-1">
          <SideItem icon="🏠" label="Início" active />
          <SideItem icon="📖" label="Cursos" />
          <SideItem icon="📝" label="Resumos" />
          <SideItem icon="🃏" label="Flashcards" />
          <SideItem icon="💬" label="Chat IA" />
          <SideItem icon="⚖️" label="Legis" />
        </nav>
        <div className="mt-8">
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 shadow-md shadow-emerald-500/30 transition">
            🎧 Suporte
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="pt-16 md:pl-64">
        <section className="max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-indigo-600">
            EstudaMais
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600">
            Estude com inteligência, aprenda com profundidade.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#trial"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition"
            >
              Comece grátis agora
            </a>
            <a
              href="#planos"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition"
            >
              VER PLANOS PREMIUM
            </a>
          </div>
        </section>

        {/* Promo */}
        <section
          id="planos"
          className="max-w-5xl mx-auto px-4 md:px-8 pb-10"
        >
          <div className="rounded-3xl overflow-hidden border border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-sm">
            <div className="bg-amber-400 text-amber-950 font-bold text-center py-2 text-sm tracking-wide">
              ⚡ OFERTA RELÂMPAGO — TERMINA EM BREVE
            </div>
            <div className="p-6 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                🎯 Plano Anual com Super Desconto!
              </h2>
              <p className="mt-2 text-slate-600">
                Economia real • Acesso total à plataforma EstudaMais
              </p>
              <div className="mt-6">
                <div className="text-4xl md:text-5xl font-black text-indigo-600">
                  12x de R$ 34,90
                </div>
                <div className="mt-1 text-slate-600">
                  Ou R$ 339,00 / ano à vista
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  (assinatura anual com acesso ilimitado)
                </div>
              </div>

              <p className="mt-6 text-slate-700 font-medium">
                ⏰ A oferta especial encerra em:
              </p>
              <div className="mt-3 flex justify-center gap-3">
                <TimeBox n={d} label="Dias" />
                <TimeBox n={h} label="Horas" />
                <TimeBox n={m} label="Minutos" />
                <TimeBox n={s} label="Segundos" />
              </div>

              <a
                href="#garantir"
                className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition"
              >
                🔥 Quero Garantir Meu Desconto
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SideItem({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </a>
  );
}

function TimeBox({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white border border-slate-200 rounded-xl w-16 md:w-20 py-3 shadow-sm">
      <div className="text-2xl md:text-3xl font-black text-slate-900 tabular-nums">
        {String(n).padStart(2, "0")}
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-wider text-slate-500 mt-1">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: Feature) {
  return (
    <a
      href="#"
      className="group block bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200 transition"
    >
      <div className="text-4xl">{icon}</div>
      <div className="mt-4 font-bold text-slate-900 group-hover:text-indigo-700">
        {title}
      </div>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </a>
  );
}
