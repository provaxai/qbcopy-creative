import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { CURSOS } from "../lib/cursos-data";

export const Route = createFileRoute("/cursos")({
  head: () => ({
    meta: [
      { title: "Cursos — EstudaMais" },
      { name: "description", content: "Explore os cursos da EstudaMais: PRF, PLF, Crimes Hediondos e mais, com edital verticalizado e estudo ativo." },
      { property: "og:title", content: "Cursos — EstudaMais" },
      { property: "og:description", content: "Cursos com edital verticalizado, flashcards e questões integradas." },
      { property: "og:url", content: "/cursos" },
    ],
    links: [{ rel: "canonical", href: "/cursos" }],
  }),
  component: CursosPage,
});

function CursosPage() {
  return (
    <AppShell>
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white min-h-[calc(100vh-4rem)]">
        <section className="max-w-6xl mx-auto px-4 md:px-8 pt-16 pb-10 text-center">
          <div className="inline-block text-xs font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5">
            ✦ Estudo ativo de verdade
          </div>
          <h1 className="mt-5 text-5xl md:text-6xl font-black tracking-tight">Cursos</h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Trilhas completas com edital verticalizado, flashcards, questões e áudios integrados.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 grid place-items-center text-2xl shrink-0">ℹ️</div>
            <div className="flex-1">
              <div className="font-bold">Navegue e conheça os cursos</div>
              <p className="text-sm text-slate-300 mt-1">
                Você está navegando como visitante. Para se inscrever em um curso e ter acesso completo, faça login ou crie uma conta gratuita.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to="/entrar" className="inline-flex items-center gap-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 text-sm">
                ↪ Fazer login
              </Link>
              <Link to="/cadastro" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 text-sm">
                ✦ Criar conta grátis
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CURSOS.map((c) => (
              <Link
                key={c.slug}
                to="/cursos/$slug"
                params={{ slug: c.slug }}
                className="group relative rounded-2xl overflow-hidden bg-slate-800/60 border border-slate-700 hover:border-indigo-400/60 hover:-translate-y-0.5 transition shadow-lg shadow-black/30"
              >
                <div className={`relative h-44 bg-gradient-to-br ${c.cor} grid place-items-center`}>
                  <div className="text-6xl drop-shadow-lg">{c.emoji}</div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase bg-emerald-500 text-emerald-950 rounded-full px-2.5 py-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-950" /> Ativo
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest">
                    {c.subtitulo}
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-bold text-white">{c.titulo}</div>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">{c.descricao}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-500 group-hover:bg-indigo-600 text-white font-semibold px-4 py-2 text-xs w-full justify-center">
                    → Abrir curso
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
