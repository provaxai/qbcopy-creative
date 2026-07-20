import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — EstudaMais" },
      { name: "description", content: "Acesse sua conta EstudaMais." },
    ],
  }),
  component: EntrarPage,
});

function EntrarPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const senha = String(data.get("senha") || "");
    if (!email || senha.length < 6) {
      setError("Preencha e-mail válido e senha com no mínimo 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const existing = localStorage.getItem("estudamais_user");
      const nome = existing
        ? (JSON.parse(existing).nome ?? email.split("@")[0])
        : email.split("@")[0];
      localStorage.setItem(
        "estudamais_user",
        JSON.stringify({ nome, email, entradaEm: new Date().toISOString() }),
      );
      window.dispatchEvent(new Event("estudamais:auth"));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/cursos" });
    }, 500);
  }

  return (
    <AppShell>
      <Breadcrumbs />
      <section className="max-w-md mx-auto px-4 md:px-8 pt-16 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Entrar</h1>
          <p className="mt-1 text-sm text-slate-500">Bem-vindo de volta! Continue seus estudos.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">E-mail</span>
              <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="voce@email.com" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Senha</span>
              <input name="senha" type="password" required minLength={6} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="••••••••" />
            </label>
            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600 text-center">
            Ainda não tem conta? <Link to="/cadastro" className="text-indigo-600 font-semibold">Cadastre-se grátis</Link>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
