import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS } from "./AppShell";

const LABELS: Record<string, string> = {
  "": "Início",
  cursos: "Cursos",
  resumos: "Resumos",
  flashcards: "Flashcards",
  chat: "Chat IA",
  "pdf-ia": "PDF IA",
  esquema: "Esquema IA",
  legis: "Legis",
  discursiva: "Discursiva",
  "prova-oral": "Prova Oral",
  planos: "Planos",
  entrar: "Entrar",
  cadastro: "Cadastro",
};

function labelFor(seg: string) {
  return LABELS[seg] ?? seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: labelFor(seg),
    to: "/" + segments.slice(0, i + 1).join("/"),
    last: i === segments.length - 1,
  }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "/" },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        item: c.to,
      })),
    ],
  };

  return (
    <nav
      aria-label="Você está em"
      className="max-w-5xl mx-auto px-4 md:px-8 pt-4"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <li>
          <Link to="/" className="hover:text-indigo-600 font-medium">
            Início
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.to} className="flex items-center gap-1.5">
            <span className="text-slate-300">/</span>
            {c.last ? (
              <span aria-current="page" className="text-slate-900 font-semibold">
                {c.label}
              </span>
            ) : (
              <Link to={c.to} className="hover:text-indigo-600 font-medium">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </nav>
  );
}

const FEATURE_ROUTES = new Set([
  "/cursos",
  "/resumos",
  "/flashcards",
  "/chat",
  "/pdf-ia",
  "/esquema",
  "/legis",
  "/discursiva",
  "/prova-oral",
]);

const FEATURE_DESC: Record<string, string> = {
  "/cursos": "Trilhas organizadas por objetivo.",
  "/resumos": "Resumos com lacunas geradas por IA.",
  "/flashcards": "Repetição espaçada inteligente.",
  "/chat": "Tire dúvidas com assistentes de IA.",
  "/pdf-ia": "Vire qualquer PDF em material de estudo.",
  "/esquema": "Mapas visuais para memorizar.",
  "/legis": "Leis com modo lacuna artigo a artigo.",
  "/discursiva": "Treine redação com feedback da IA.",
  "/prova-oral": "Simule bancas orais realistas.",
};

export function RelatedFeatures({ current }: { current?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = current ?? pathname;
  const items = NAV_ITEMS.filter(
    (n) => FEATURE_ROUTES.has(n.to) && n.to !== active,
  ).slice(0, 4);

  return (
    <section
      aria-labelledby="related-heading"
      className="max-w-5xl mx-auto px-4 md:px-8 pb-16"
    >
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
            Continue explorando
          </div>
          <h2 id="related-heading" className="mt-1 text-2xl font-black text-slate-900">
            Recursos relacionados
          </h2>
        </div>
        <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Ver tudo →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-md transition"
          >
            <div className="text-2xl">{it.icon}</div>
            <div className="mt-2 font-bold text-slate-900 text-sm group-hover:text-indigo-700">
              {it.label}
            </div>
            <div className="mt-1 text-xs text-slate-500 leading-snug">
              {FEATURE_DESC[it.to]}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
