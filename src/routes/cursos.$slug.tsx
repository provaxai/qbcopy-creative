import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { getCursoBySlug, CURSOS, type Curso } from "../lib/cursos-data";

export const Route = createFileRoute("/cursos/$slug")({
  loader: ({ params }) => {
    const curso = getCursoBySlug(params.slug);
    if (!curso) throw notFound();
    return { curso };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.curso.titulo} — EstudaMais` },
          { name: "description", content: loaderData.curso.descricao },
          { property: "og:title", content: `${loaderData.curso.titulo} — EstudaMais` },
          { property: "og:description", content: loaderData.curso.descricao },
        ]
      : [{ title: "Curso — EstudaMais" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: CursoNotFound,
  errorComponent: () => <CursoNotFound />,
  component: CursoDetalhe,
});

function CursoNotFound() {
  return (
    <AppShell>
      <section className="max-w-3xl mx-auto px-4 md:px-8 pt-24 pb-32 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Curso não encontrado</h1>
        <p className="mt-2 text-slate-600">O curso que você procura não existe ou foi movido.</p>
        <Link to="/cursos" className="mt-6 inline-flex items-center rounded-full bg-indigo-600 text-white font-semibold px-6 py-3">
          Ver todos os cursos
        </Link>
      </section>
    </AppShell>
  );
}

type Marks = Record<string, { estudado?: boolean; revisado?: boolean }>;

function CursoDetalhe() {
  const { curso } = Route.useLoaderData() as { curso: Curso };
  const storageKey = `estudamais_edital_${curso.slug}`;
  const [marks, setMarks] = useState<Marks>({});
  const [dataProva, setDataProva] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMarks(JSON.parse(raw));
      const dp = localStorage.getItem(`${storageKey}_data`);
      if (dp) setDataProva(dp);
    } catch {}
  }, [storageKey]);

  function persist(next: Marks) {
    setMarks(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  }

  function toggle(numero: string, key: "estudado" | "revisado") {
    const next = { ...marks, [numero]: { ...marks[numero], [key]: !marks[numero]?.[key] } };
    persist(next);
  }

  const totalItens = useMemo(
    () => curso.edital.flatMap((b) => b.itens.filter((i) => !i.isTitulo)).length,
    [curso],
  );
  const estudados = useMemo(
    () =>
      curso.edital
        .flatMap((b) => b.itens)
        .filter((i) => !i.isTitulo && marks[i.numero]?.estudado).length,
    [curso, marks],
  );
  const revisados = useMemo(
    () =>
      curso.edital
        .flatMap((b) => b.itens)
        .filter((i) => !i.isTitulo && marks[i.numero]?.revisado).length,
    [curso, marks],
  );
  const pct = totalItens ? Math.round((estudados / totalItens) * 100) : 0;

  return (
    <AppShell>
      <Breadcrumbs />

      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${curso.cor} grid place-items-center text-3xl shrink-0`}>
            {curso.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">{curso.subtitulo}</div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">{curso.titulo}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-2 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-semibold px-4 py-2 text-sm cursor-pointer">
              📅 Data da prova
              <input
                type="date"
                value={dataProva}
                onChange={(e) => {
                  setDataProva(e.target.value);
                  try { localStorage.setItem(`${storageKey}_data`, e.target.value); } catch {}
                }}
                className="bg-transparent outline-none text-xs"
              />
            </label>
            <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 text-sm">
              🔒 Planejamento
              <span className="text-[9px] bg-amber-400 text-amber-950 rounded px-1.5 py-0.5">PRO</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold px-4 py-2 text-sm hover:bg-rose-100"
            >
              📄 Baixar PDF
            </button>
            <Link to="/cursos" className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-4 py-2 text-sm hover:bg-slate-200">
              ← Voltar
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-6">
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            ["Progresso", `${pct}%`, `${estudados}/${totalItens} itens estudados`],
            ["Revisados", `${revisados}`, `de ${totalItens} itens`],
            ["Blocos", `${curso.edital.length}`, "no edital verticalizado"],
          ].map(([k, v, s]) => (
            <div key={k} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="text-xs text-slate-500">{k}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{v}</div>
              <div className="text-[11px] text-slate-500">{s}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        {curso.edital.map((bloco) => (
          <div key={bloco.titulo} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 flex items-center justify-between">
              <div className="font-bold flex items-center gap-2">📚 {bloco.titulo}</div>
              <button className="text-xs bg-white/15 hover:bg-white/25 rounded px-2.5 py-1 font-semibold">+ Coluna</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-2.5 w-16">Item</th>
                    <th className="text-left px-4 py-2.5">Conteúdo</th>
                    <th className="text-center px-4 py-2.5 w-24">Estudado</th>
                    <th className="text-center px-4 py-2.5 w-24">Revisado</th>
                  </tr>
                </thead>
                <tbody>
                  {bloco.itens.map((item) => (
                    <tr
                      key={item.numero}
                      className={`border-t border-slate-100 ${
                        item.isTitulo ? "bg-indigo-50/60" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className={`px-4 py-2.5 tabular-nums ${item.isTitulo ? "font-black text-indigo-700" : "text-slate-500"}`}>
                        {item.numero}
                      </td>
                      <td className={`px-4 py-2.5 ${item.isTitulo ? "font-bold text-indigo-800 uppercase tracking-wide text-xs" : "text-slate-700"}`}>
                        {item.texto}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {!item.isTitulo && (
                          <input
                            type="checkbox"
                            checked={!!marks[item.numero]?.estudado}
                            onChange={() => toggle(item.numero, "estudado")}
                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {!item.isTitulo && (
                          <input
                            type="checkbox"
                            checked={!!marks[item.numero]?.revisado}
                            onChange={() => toggle(item.numero, "revisado")}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <Link to="/flashcards" className="inline-flex items-center rounded-full bg-white border border-slate-200 hover:border-indigo-300 text-slate-800 font-semibold px-5 py-2.5 text-sm">
            🃏 Flashcards deste curso
          </Link>
          <Link to="/resumos" className="inline-flex items-center rounded-full bg-white border border-slate-200 hover:border-indigo-300 text-slate-800 font-semibold px-5 py-2.5 text-sm">
            📝 Resumos gerados por IA
          </Link>
          <Link to="/chat" className="inline-flex items-center rounded-full bg-white border border-slate-200 hover:border-indigo-300 text-slate-800 font-semibold px-5 py-2.5 text-sm">
            💬 Tirar dúvida no Chat
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Outros cursos</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CURSOS.filter((c) => c.slug !== curso.slug).slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              to="/cursos/$slug"
              params={{ slug: c.slug }}
              className="rounded-xl bg-white border border-slate-200 p-4 hover:border-indigo-300 transition"
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="mt-2 font-bold text-slate-900 text-sm">{c.titulo}</div>
              <div className="text-xs text-slate-500">{c.subtitulo}</div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
