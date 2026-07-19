import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "../components/AppShell";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — EstudaMais" },
      { name: "description", content: "Escolha o plano ideal para acelerar seus estudos. Cancele quando quiser." },
    ],
  }),
  component: PlanosPage,
});

const PLANS = [
  {
    name: "Inicial",
    tag: "Gratuito para sempre",
    price: "R$ 0",
    per: "/mês",
    bullets: ["5 questões simuladas por dia", "Cronograma padrão genérico", "Chat IA limitado (3 mensagens)"],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Essencial",
    tag: "Evolução focada",
    price: "R$ 49,90",
    per: "/mês",
    bullets: ["Simulados ilimitados", "Cronograma dinâmico e missão diária", "Todos os flashcards e revisões", "Chat IA com 50 mensagens/dia"],
    cta: "Iniciar teste grátis",
    highlight: true,
  },
  {
    name: "Supremo",
    tag: "Acesso ilimitado",
    price: "R$ 97,00",
    per: "/mês",
    bullets: ["Chat IA ilimitado 24h/dia", "Simulados inéditos sob demanda", "Diagnóstico preditivo de aprovação", "PDF IA e novos módulos primeiro"],
    cta: "Garantir acesso",
    highlight: false,
  },
];

function PlanosPage() {
  return (
    <AppShell>
      <Breadcrumbs />
      <PageHeader
        eyebrow="💎 Planos"
        title="Acelere sua rota até a aprovação"
        subtitle="Escolha o plano ideal para seu momento de estudos. Cancele quando quiser."
      />
      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 shadow-sm bg-white flex flex-col ${p.highlight ? "border-indigo-400 ring-2 ring-indigo-200" : "border-slate-200"}`}>
              {p.highlight && (
                <div className="self-start text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-600 rounded-full px-2 py-1 mb-3">
                  Mais popular
                </div>
              )}
              <div className="font-bold text-slate-900 text-lg">{p.name}</div>
              <div className="text-xs text-slate-500">{p.tag}</div>
              <div className="mt-4">
                <span className="text-4xl font-black text-slate-900">{p.price}</span>
                <span className="text-slate-500">{p.per}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-700 flex-1">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2"><span className="text-emerald-500">✓</span>{b}</li>
                ))}
              </ul>
              <Link to="/cadastro" className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold transition ${p.highlight ? "text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-lg" : "text-slate-800 bg-slate-100 hover:bg-slate-200"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Pagamento seguro · Cancelamento em 1 clique · 7 dias de garantia
        </p>
      </section>
    </AppShell>
  );
}
