import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — EstudaMais" },
      { name: "description", content: "Crie sua conta grátis na EstudaMais e comece hoje seu teste de 7 dias." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const nome = String(data.get("nome") || "");
    if (!email || !nome) return;
    setLoading(true);
    try {
      localStorage.setItem(
        "estudamais_user",
        JSON.stringify({ nome, email, criadoEm: new Date().toISOString() }),
      );
      window.dispatchEvent(new Event("estudamais:auth"));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => navigate({ to: "/cursos" }), 900);
    }, 600);
  }

  return (
    <AppShell>
      <Breadcrumbs />
      <section className="max-w-md mx-auto px-4 md:px-8 pt-16 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Criar conta grátis</h1>
          <p className="mt-1 text-sm text-slate-500">7 dias de teste sem cartão de crédito.</p>

          {done ? (
            <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-sm">
              ✅ Conta criada! Redirecionando para os cursos…
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">Nome</span>
                <input name="nome" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="Seu nome" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">E-mail</span>
                <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="voce@email.com" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-700">Senha</span>
                <input name="senha" type="password" required minLength={6} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="Crie uma senha (mín. 6)" />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {loading ? "Criando conta…" : "Criar conta"}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-slate-600 text-center">
            Já tem conta? <Link to="/entrar" className="text-indigo-600 font-semibold">Entrar</Link>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
