import { createFileRoute, Link } from "@tanstack/react-router";
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
  return (
    <AppShell>
      <Breadcrumbs />
      <section className="max-w-md mx-auto px-4 md:px-8 pt-16 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Entrar</h1>
          <p className="mt-1 text-sm text-slate-500">Bem-vindo de volta! Continue seus estudos.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">E-mail</span>
              <input type="email" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="voce@email.com" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Senha</span>
              <input type="password" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="••••••••" />
            </label>
            <button className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 shadow-md hover:shadow-lg">
              Entrar
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
