import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

export const NAV_ITEMS = [
  { to: "/", icon: "🏠", label: "Início" },
  { to: "/cursos", icon: "🎓", label: "Cursos" },
  { to: "/resumos", icon: "📝", label: "Resumos" },
  { to: "/flashcards", icon: "🃏", label: "Flashcards" },
  { to: "/chat", icon: "💬", label: "Chat IA" },
  { to: "/pdf-ia", icon: "📚", label: "PDF IA" },
  { to: "/esquema", icon: "🧠", label: "Esquema IA" },
  { to: "/legis", icon: "⚖️", label: "Legis" },
  { to: "/discursiva", icon: "✍️", label: "Discursiva" },
  { to: "/prova-oral", icon: "🎙️", label: "Prova Oral" },
  { to: "/planos", icon: "💎", label: "Planos" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_285)] text-slate-800">
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white font-bold">
              E+
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">
              EstudaMais<span className="text-indigo-600">.app</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((it) => {
              const active =
                it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/entrar"
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ↪ Entrar
            </Link>
            <Link
              to="/cadastro"
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              ✦ Cadastrar
            </Link>
            <button
              aria-label="Alternar menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 ml-1"
            >
              <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
              <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
              <span className="block w-5 h-0.5 bg-slate-700" />
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-wrap gap-1">
            {NAV_ITEMS.map((it) => {
              const active =
                it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="mr-1">{it.icon}</span>
                  {it.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <main className="pt-16">{children}</main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 pt-10 pb-6">
      {eyebrow && (
        <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
          {eyebrow}
        </div>
      )}
      <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-slate-600 text-lg max-w-3xl">{subtitle}</p>
      )}
    </section>
  );
}
