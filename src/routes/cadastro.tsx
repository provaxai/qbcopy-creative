import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";

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
  return (
    <AppShell>
      <section className="max-w-md mx-auto px-4 md:px-8 pt-16 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Criar conta grátis</h1>
          <p className="mt-1 text-sm text-slate-500">7 dias de teste sem cartão de crédito.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Nome</span>
              <input required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="Seu nome" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">E-mail</span>
              <input type="email" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="voce@email.com" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Senha</span>
              <input type="password" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-400" placeholder="Crie uma senha" />
            </label>
            <button className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold py-3 shadow-md hover:shadow-lg">
              Criar conta
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600 text-center">
            Já tem conta? <Link to="/entrar" className="text-indigo-600 font-semibold">Entrar</Link>
          </p>
        </div>
      </section>
    </AppShell>
  );
}
