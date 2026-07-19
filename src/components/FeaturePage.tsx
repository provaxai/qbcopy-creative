import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { Breadcrumbs, RelatedFeatures } from "./Breadcrumbs";

export type FeaturePageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta?: string;
  ctaTo?: string;
  extra?: ReactNode;
};

export function FeaturePage({
  eyebrow,
  title,
  subtitle,
  bullets,
  cta = "Começar agora",
  ctaTo = "/cadastro",
  extra,
}: FeaturePageProps) {
  return (
    <AppShell>
      <Breadcrumbs />
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />


      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="font-bold text-slate-900 mb-4">O que você recebe</div>
            <ul className="space-y-3 text-sm text-slate-700">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                to={ctaTo}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-md hover:shadow-lg transition"
              >
                {cta}
              </Link>
              <Link
                to="/planos"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
              >
                Ver planos
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 min-h-[240px]">
            {extra ?? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <span className="text-6xl opacity-60">✨</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-8 pb-20">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black">Pronto para experimentar?</h2>
          <p className="mt-3 text-slate-300">7 dias de teste grátis. Sem cartão de crédito.</p>
          <Link
            to="/cadastro"
            className="mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 font-bold text-slate-900 bg-white hover:bg-slate-100"
          >
            Criar conta grátis
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
