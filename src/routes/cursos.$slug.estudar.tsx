import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { getCursoBySlug, type Curso } from "../lib/cursos-data";

export const Route = createFileRoute("/cursos/$slug/estudar")({
  loader: ({ params }) => {
    const curso = getCursoBySlug(params.slug);
    if (!curso) throw notFound();
    return { curso };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Estudar: ${loaderData.curso.titulo} — EstudaMais` },
          { name: "description", content: `Painel de estudos e planejamento do curso ${loaderData.curso.titulo}.` },
          { property: "og:title", content: `Estudar: ${loaderData.curso.titulo}` },
          { property: "og:description", content: `Painel de estudos do curso ${loaderData.curso.titulo}.` },
          { name: "robots", content: "noindex" },
        ]
      : [{ title: "Estudar — EstudaMais" }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-32 text-center">
        <div className="text-6xl">🔎</div>
        <h1 className="mt-4 text-3xl font-black">Curso não encontrado</h1>
        <Link to="/cursos" className="mt-6 inline-flex rounded-full bg-indigo-600 text-white font-semibold px-6 py-3">
          Ver cursos
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: () => null,
  component: EstudarCurso,
});

type Marks = Record<string, { estudado?: boolean; revisado?: boolean }>;
type StudyLog = { id: string; date: string; materia: string; minutos: number; notas?: string };
type Sessao = { id: string; materia: string; topico: string; minutos: number; concluida: boolean; cor: string };

const CORES_MATERIAS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500",
  "bg-teal-500", "bg-sky-500", "bg-indigo-500", "bg-violet-500", "bg-pink-500",
];

function EstudarCurso() {
  const { curso } = Route.useLoaderData() as { curso: Curso };
  const storageKey = `estudamais_edital_${curso.slug}`;
  const logKey = `estudamais_log_${curso.slug}`;
  const cicloKey = `estudamais_ciclo_${curso.slug}`;

  const [tab, setTab] = useState<"painel" | "plano">("painel");
  const [marks, setMarks] = useState<Marks>({});
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [openBlocos, setOpenBlocos] = useState<Record<string, boolean>>({});

  // form
  const [formMateria, setFormMateria] = useState("");
  const [formMin, setFormMin] = useState<number>(60);
  const [formNotas, setFormNotas] = useState("");

  useEffect(() => {
    try {
      const m = localStorage.getItem(storageKey);
      if (m) setMarks(JSON.parse(m));
      const l = localStorage.getItem(logKey);
      if (l) setLogs(JSON.parse(l));
      const c = localStorage.getItem(cicloKey);
      if (c) setSessoes(JSON.parse(c));
      else setSessoes(gerarCicloInicial(curso));
    } catch {}
  }, [storageKey, logKey, cicloKey, curso]);

  function saveMarks(next: Marks) {
    setMarks(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }
  function saveLogs(next: StudyLog[]) {
    setLogs(next);
    try { localStorage.setItem(logKey, JSON.stringify(next)); } catch {}
  }
  function saveSessoes(next: Sessao[]) {
    setSessoes(next);
    try { localStorage.setItem(cicloKey, JSON.stringify(next)); } catch {}
  }

  const todosItens = useMemo(
    () => curso.edital.flatMap((b) => b.itens.filter((i) => !i.isTitulo)),
    [curso],
  );
  const estudados = todosItens.filter((i) => marks[i.numero]?.estudado).length;
  const total = todosItens.length;
  const pct = total ? Math.round((estudados / total) * 100) : 0;

  const materias = useMemo(() => {
    const titulos = curso.edital.flatMap((b) => b.itens.filter((i) => i.isTitulo));
    return titulos.length ? titulos.map((t) => t.texto) : [curso.titulo];
  }, [curso]);

  // Próxima sessão = primeira não concluída
  const proximaSessao = sessoes.find((s) => !s.concluida);
  const concluidas = sessoes.filter((s) => s.concluida).length;
  const restantes = sessoes.length - concluidas;
  const totalMinutos = logs.reduce((s, l) => s + l.minutos, 0);

  function toggleMark(numero: string, key: "estudado" | "revisado") {
    saveMarks({ ...marks, [numero]: { ...marks[numero], [key]: !marks[numero]?.[key] } });
  }
  function marcarSessaoConcluida(id: string) {
    saveSessoes(sessoes.map((s) => (s.id === id ? { ...s, concluida: !s.concluida } : s)));
  }
  function registrarEstudo(e: React.FormEvent) {
    e.preventDefault();
    if (!formMateria || !formMin) return;
    const novo: StudyLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      materia: formMateria,
      minutos: Number(formMin),
      notas: formNotas || undefined,
    };
    saveLogs([novo, ...logs]);
    setFormNotas("");
  }

  // Heatmap últimos 90 dias
  const heatmap = useMemo(() => {
    const map: Record<string, number> = {};
    logs.forEach((l) => { map[l.date] = (map[l.date] || 0) + l.minutos; });
    const dias: { date: string; minutos: number }[] = [];
    const hoje = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const s = d.toISOString().slice(0, 10);
      dias.push({ date: s, minutos: map[s] || 0 });
    }
    return dias;
  }, [logs]);

  function heatColor(min: number) {
    if (min === 0) return "bg-slate-800";
    if (min < 30) return "bg-indigo-900";
    if (min < 60) return "bg-indigo-700";
    if (min < 120) return "bg-indigo-500";
    return "bg-indigo-400";
  }

  return (
    <AppShell>
      <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 px-4 md:px-6 py-6">
          {/* SIDEBAR */}
          <aside className="space-y-4">
            <Link to="/cursos" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1">
              ← Voltar aos Cursos
            </Link>
            <div>
              <h2 className="text-lg font-black leading-tight">{curso.titulo}</h2>
              <div className="text-xs text-slate-400 mt-1">{total} de {total} tópicos disponíveis</div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Seu progresso</span>
                <span className="text-sky-400 font-semibold">{estudados}/{total} ({pct}%)</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-200">
              🔒 Acesso gratuito, com limitação de aulas e funções
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setTab("painel")}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 ${tab === "painel" ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/50"}`}
              >
                📊 Painel de Estudos
              </button>
              <button
                onClick={() => setTab("plano")}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 ${tab === "plano" ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-800/50"}`}
              >
                📅 Planejamento de Estudos
              </button>
            </nav>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">Índice do curso</div>
              <div className="space-y-1">
                {curso.edital.map((bloco, bi) => (
                  <div key={bloco.titulo}>
                    <button
                      onClick={() => setOpenBlocos({ ...openBlocos, [bloco.titulo]: !openBlocos[bloco.titulo] })}
                      className="w-full text-left px-2 py-2 rounded hover:bg-slate-800/50 text-sm flex items-center gap-2"
                    >
                      <span className={`w-5 h-5 rounded ${CORES_MATERIAS[bi % CORES_MATERIAS.length]} grid place-items-center text-[10px] font-bold text-white`}>
                        {bi + 1}
                      </span>
                      <span className="flex-1 truncate text-slate-200">{bloco.titulo}</span>
                      <span className="text-slate-500 text-xs">{openBlocos[bloco.titulo] ? "▾" : "▸"}</span>
                    </button>
                    {openBlocos[bloco.titulo] && (
                      <div className="ml-7 mt-1 space-y-0.5">
                        {bloco.itens.filter(i => !i.isTitulo).map((it) => (
                          <label key={it.numero} className="flex items-start gap-2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800/50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!marks[it.numero]?.estudado}
                              onChange={() => toggleMark(it.numero, "estudado")}
                              className="mt-0.5 accent-sky-500"
                            />
                            <span><span className="tabular-nums text-slate-500">{it.numero}</span> {it.texto}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/cursos/$slug"
              params={{ slug: curso.slug }}
              className="block text-center text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg py-2"
            >
              Ver edital verticalizado completo →
            </Link>
          </aside>

          {/* MAIN */}
          <main className="space-y-4 min-w-0">
            {tab === "painel" ? (
              <PainelView
                curso={curso}
                proximaSessao={proximaSessao}
                onConcluir={marcarSessaoConcluida}
                heatmap={heatmap}
                heatColor={heatColor}
                totalMinutos={totalMinutos}
                pct={pct}
                logs={logs}
              />
            ) : (
              <PlanoView
                curso={curso}
                sessoes={sessoes}
                onToggle={marcarSessaoConcluida}
                onSave={saveSessoes}
                concluidas={concluidas}
                restantes={restantes}
                totalMinutos={totalMinutos}
                materias={materias}
                formMateria={formMateria}
                setFormMateria={setFormMateria}
                formMin={formMin}
                setFormMin={setFormMin}
                formNotas={formNotas}
                setFormNotas={setFormNotas}
                onRegistrar={registrarEstudo}
                logs={logs}
              />
            )}
          </main>
        </div>
      </div>
    </AppShell>
  );
}

function gerarCicloInicial(curso: Curso): Sessao[] {
  const titulos = curso.edital.flatMap((b) => b.itens.filter((i) => i.isTitulo));
  const base = titulos.length ? titulos : [{ numero: "1", texto: curso.titulo, isTitulo: true }];
  return base.slice(0, 9).map((t, i) => ({
    id: `s${i}`,
    materia: t.texto,
    topico: `Introdução — ${t.texto}`,
    minutos: 60,
    concluida: false,
    cor: CORES_MATERIAS[i % CORES_MATERIAS.length],
  }));
}

function PainelView({
  curso, proximaSessao, onConcluir, heatmap, heatColor, totalMinutos, pct, logs,
}: {
  curso: Curso;
  proximaSessao?: Sessao;
  onConcluir: (id: string) => void;
  heatmap: { date: string; minutos: number }[];
  heatColor: (m: number) => string;
  totalMinutos: number;
  pct: number;
  logs: StudyLog[];
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          <span className="text-emerald-400 font-bold">✓ {pct}%</span> concluído
        </div>
      </div>

      {proximaSessao ? (
        <section className="rounded-xl bg-slate-900 border-l-4 border-sky-500 border-y border-r border-slate-800 p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-sky-400">📘 Próxima sessão de estudo</div>
              <div className="text-xs text-slate-400 mt-2 uppercase">{proximaSessao.materia}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-amber-500 text-amber-950 text-xs font-black rounded px-2 py-0.5">2.1</span>
                <span className="font-bold text-lg">{proximaSessao.topico}</span>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1 bg-slate-800 rounded px-2 py-1">📘 Sessão 1/1</span>
                <span className="inline-flex items-center gap-1 bg-slate-800 rounded px-2 py-1 text-orange-300">⚡ {proximaSessao.minutos} min</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 text-sm">
                ▶ Estudar
              </button>
              <button
                onClick={() => onConcluir(proximaSessao.id)}
                className="rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold px-5 py-2 text-sm"
              >
                ✓ Marcar Concluída
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl bg-slate-900 border border-slate-800 p-5 text-center text-slate-400">
          🎉 Todas as sessões do ciclo estão concluídas!
        </section>
      )}

      <section className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-start gap-3">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Dica do dia · Quem acerta mais, ganha mais XP
          </div>
          <div className="text-sm text-slate-300 mt-1">
            Acima de 70% de acerto seu XP em questões objetivas começa a ser multiplicado. Acima de 90%, multiplica por 3.
          </div>
        </div>
        <button className="text-xs text-sky-400 hover:text-sky-300">📘 outra</button>
      </section>

      {logs.length === 0 ? (
        <section className="rounded-xl bg-slate-900 border border-slate-800 p-10 text-center text-slate-400 text-sm">
          <div>Você ainda não tem atividade neste curso.</div>
          <div className="mt-1">Comece resolvendo questões, revisando flashcards ou abrindo um tópico no índice.</div>
        </section>
      ) : (
        <section className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-sm font-bold mb-3">Atividade recente</div>
          <div className="space-y-1.5">
            {logs.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between text-xs bg-slate-800/50 rounded px-3 py-2">
                <div className="truncate"><span className="text-slate-400">{l.date}</span> · <span className="font-semibold">{l.materia}</span></div>
                <div className="text-sky-400 font-bold">{l.minutos} min</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold flex items-center gap-2">📅 Questões nos últimos 90 dias</div>
          <div className="text-xs text-slate-400">{logs.length} sessões</div>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-[10px] grid-rows-7 gap-[3px]">
            {heatmap.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.minutos} min`}
                className={`w-[10px] h-[10px] rounded-sm ${heatColor(d.minutos)}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-slate-500">
          Menos
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-900" />
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-700" />
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
          Mais
        </div>
      </section>

      <section className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-between">
        <div className="text-sm font-bold flex items-center gap-2">⏱️ Tempo de Estudo</div>
        <div className="text-lg font-black tabular-nums">
          {Math.floor(totalMinutos / 60)}h {totalMinutos % 60}min
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Link to="/flashcards" className="rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 p-3 text-sm text-center">🃏 Flashcards</Link>
        <Link to="/resumos" className="rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 p-3 text-sm text-center">📝 Resumos</Link>
        <Link to="/chat" className="rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 p-3 text-sm text-center">💬 Chat IA</Link>
      </div>

      <div className="text-[11px] text-slate-500 text-center">Curso: {curso.titulo}</div>
    </>
  );
}

function PlanoView({
  curso, sessoes, onToggle, onSave, concluidas, restantes, totalMinutos, materias,
  formMateria, setFormMateria, formMin, setFormMin, formNotas, setFormNotas, onRegistrar, logs,
}: {
  curso: Curso;
  sessoes: Sessao[];
  onToggle: (id: string) => void;
  onSave: (s: Sessao[]) => void;
  concluidas: number;
  restantes: number;
  totalMinutos: number;
  materias: string[];
  formMateria: string;
  setFormMateria: (v: string) => void;
  formMin: number;
  setFormMin: (v: number) => void;
  formNotas: string;
  setFormNotas: (v: string) => void;
  onRegistrar: (e: React.FormEvent) => void;
  logs: StudyLog[];
}) {
  const totalCiclo = sessoes.length;
  const proxima = sessoes.find((s) => !s.concluida);
  const volta = Math.min(1 + Math.floor(concluidas / Math.max(totalCiclo, 1)), 3);

  // Wheel: distribute sessions as pie slices
  const slice = 360 / Math.max(sessoes.length, 1);

  // Aggregate by materia
  const porMateria = useMemo(() => {
    const map: Record<string, { cor: string; count: number }> = {};
    sessoes.forEach((s) => {
      if (!map[s.materia]) map[s.materia] = { cor: s.cor, count: 0 };
      map[s.materia].count++;
    });
    return Object.entries(map);
  }, [sessoes]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
      <div className="space-y-4 min-w-0">
        <div className="rounded-xl bg-white text-slate-900 border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-lg flex items-center gap-2">📘 Meu Planejamento</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {curso.titulo} · <span className="bg-emerald-100 text-emerald-700 rounded px-1.5 py-0.5 font-semibold">Modo Ciclo</span>
              </div>
            </div>
            <button className="text-xs bg-rose-100 text-rose-700 rounded px-3 py-1.5 font-bold">← Voltar</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <StatCard icon="✓" label="Concluídas" value={String(concluidas)} tone="emerald" />
            <StatCard icon="⏳" label="Restantes" value={String(restantes)} tone="slate" />
            <StatCard icon="🔁" label="Voltas" value={`${volta}/3`} tone="sky" />
            <StatCard icon="⏱️" label="Estudadas" value={`${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}min`} tone="violet" />
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-500 mb-1">Progresso Geral</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${totalCiclo ? Math.round((concluidas / totalCiclo) * 100) : 0}%` }} />
            </div>
          </div>
        </div>

        {/* Wheel */}
        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 text-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-sm flex items-center gap-2">🎯 Ciclo de Estudos</div>
            <div className="flex gap-2 text-xs">
              <span className="bg-white border border-slate-200 rounded px-2 py-1">📅 Início: {new Date().toLocaleDateString("pt-BR")}</span>
              <span className="bg-white border border-slate-200 rounded px-2 py-1">🔁 Volta {volta}/3</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-xs text-slate-500">Volta {volta}</div>
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {sessoes.map((s, i) => {
                  const a1 = (i * slice) * Math.PI / 180;
                  const a2 = ((i + 1) * slice) * Math.PI / 180;
                  const x1 = 50 + 45 * Math.cos(a1);
                  const y1 = 50 + 45 * Math.sin(a1);
                  const x2 = 50 + 45 * Math.cos(a2);
                  const y2 = 50 + 45 * Math.sin(a2);
                  const large = slice > 180 ? 1 : 0;
                  const colorMap: Record<string, string> = {
                    "bg-red-500": "#ef4444", "bg-orange-500": "#f97316", "bg-amber-500": "#f59e0b",
                    "bg-emerald-500": "#10b981", "bg-teal-500": "#14b8a6", "bg-sky-500": "#0ea5e9",
                    "bg-indigo-500": "#6366f1", "bg-violet-500": "#8b5cf6", "bg-pink-500": "#ec4899",
                  };
                  return (
                    <path
                      key={s.id}
                      d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${large} 1 ${x2} ${y2} Z`}
                      fill={colorMap[s.cor] || "#6366f1"}
                      opacity={s.concluida ? 0.35 : 0.9}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="18" fill="#fff" />
              </svg>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-black">{volta}</div>
                  <div className="text-[10px] text-slate-500">Volta</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próxima sessão card */}
        {proxima && (
          <div className="rounded-xl bg-white border border-slate-200 text-slate-900 p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">▶ Próxima Sessão</div>
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-14 rounded-full ${proxima.cor}`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold">{proxima.materia}</div>
                <div className="text-sm text-slate-500 truncate">{proxima.topico}</div>
                <div className="text-xs text-slate-400 mt-1">Sessão 1/1 · {proxima.minutos} minutos</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button className="rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2">📘 Estudar</button>
                <button
                  onClick={() => onToggle(proxima.id)}
                  className="rounded border border-slate-200 hover:border-slate-400 text-slate-600 text-xs px-4 py-1.5"
                >
                  ✓ Marcar Concluída
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Próximas no ciclo */}
        <div className="rounded-xl bg-white border border-slate-200 text-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">📅 Próximas no Ciclo</div>
            <div className="text-xs bg-slate-100 rounded px-2 py-0.5">{restantes} pendentes</div>
          </div>
          <div className="space-y-1.5">
            {sessoes.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-3 rounded-lg border p-2.5 ${s.concluida ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200"}`}>
                <input
                  type="checkbox"
                  checked={s.concluida}
                  onChange={() => onToggle(s.id)}
                  className="accent-emerald-500"
                />
                <div className="w-7 h-7 grid place-items-center rounded bg-slate-100 text-xs font-bold tabular-nums">{i + 1}</div>
                <div className={`w-1 h-8 rounded ${s.cor}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${s.concluida ? "line-through" : ""}`}>{s.materia}</div>
                  <div className="text-xs text-slate-500 truncate">{s.topico}</div>
                </div>
                <div className="text-xs text-slate-400">1/1</div>
                <button
                  onClick={() => onToggle(s.id)}
                  className="rounded bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2.5 py-1 font-bold"
                  title="Iniciar"
                >
                  ▶
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const nova: Sessao = {
                id: crypto.randomUUID(),
                materia: materias[0] || curso.titulo,
                topico: "Nova sessão personalizada",
                minutos: 60,
                concluida: false,
                cor: CORES_MATERIAS[sessoes.length % CORES_MATERIAS.length],
              };
              onSave([...sessoes, nova]);
            }}
            className="mt-3 text-xs text-sky-600 hover:text-sky-700 font-semibold"
          >
            + Adicionar sessão ao ciclo
          </button>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 text-slate-900 p-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">✓ Concluídas Recentemente</div>
          {logs.length === 0 ? (
            <div className="text-sm text-slate-400">Nenhuma sessão concluída ainda.</div>
          ) : (
            <div className="space-y-1">
              {logs.slice(0, 6).map((l) => (
                <div key={l.id} className="flex items-center justify-between text-sm border-b border-slate-100 py-1.5">
                  <div><span className="text-slate-400 text-xs">{l.date}</span> · {l.materia}</div>
                  <div className="text-emerald-600 font-bold text-xs">{l.minutos} min</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <form onSubmit={onRegistrar} className="rounded-xl bg-white border border-slate-200 text-slate-900 p-4">
          <div className="text-sm font-bold mb-3 flex items-center gap-2">✏️ Registrar Estudo</div>
          <label className="block text-xs text-slate-500 mb-1">Selecione a Matéria</label>
          <select
            value={formMateria}
            onChange={(e) => setFormMateria(e.target.value)}
            className="w-full border border-slate-200 rounded px-2 py-2 text-sm mb-3"
            required
          >
            <option value="">Escolha...</option>
            {materias.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <label className="block text-xs text-slate-500 mb-1">Tempo estudado (minutos)</label>
          <input
            type="number"
            min={1}
            value={formMin}
            onChange={(e) => setFormMin(Number(e.target.value))}
            className="w-full border border-slate-200 rounded px-2 py-2 text-sm mb-3"
          />
          <label className="block text-xs text-slate-500 mb-1">Notas (opcional)</label>
          <textarea
            value={formNotas}
            onChange={(e) => setFormNotas(e.target.value)}
            placeholder="Observações..."
            className="w-full border border-slate-200 rounded px-2 py-2 text-sm mb-3"
            rows={2}
          />
          <button type="submit" className="w-full rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5">
            ✓ Registrar Estudo
          </button>
        </form>

        <div className="rounded-xl bg-white border border-slate-200 text-slate-900 p-4">
          <div className="text-sm font-bold mb-3">📊 Por Matéria</div>
          <div className="space-y-2">
            {porMateria.map(([nome, info]) => (
              <div key={nome} className="flex items-center gap-2 text-sm">
                <span className={`w-2.5 h-2.5 rounded-sm ${info.cor}`} />
                <span className="flex-1 truncate">{nome}</span>
                <span className="text-xs text-slate-400 tabular-nums">{info.count}×</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 text-slate-900 p-4">
          <div className="text-sm font-bold mb-2">📘 Seu Ciclo</div>
          <div className="text-xs text-slate-500 mb-2">{sessoes.length} sessões por volta</div>
          <div className="space-y-1.5">
            {porMateria.slice(0, 6).map(([nome, info], i) => (
              <div key={nome} className="flex items-center gap-2 text-xs">
                <span className="w-4 h-4 rounded bg-slate-100 grid place-items-center font-bold text-slate-500">{i + 1}</span>
                <span className={`w-2 h-2 rounded ${info.cor}`} />
                <span className="flex-1 truncate">{nome}</span>
                <span className="text-slate-400">×{info.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: "emerald" | "slate" | "sky" | "violet" }) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <div className={`rounded-lg border p-3 ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-semibold opacity-80">
        <span>{icon}</span> {label}
      </div>
      <div className="text-2xl font-black mt-1 tabular-nums">{value}</div>
    </div>
  );
}
