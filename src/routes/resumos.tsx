import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/resumos")({
  head: () => ({
    meta: [
      { title: "Resumo Inteligente — EstudaMais" },
      { name: "description", content: "Gere resumos com lacunas interativas a partir de textos ou PDFs." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="📝 Resumo inteligente"
      title="Resumos com lacunas geradas por IA"
      subtitle="Cole um texto ou envie um PDF: a IA extrai o essencial e transforma em resumo com lacunas para você preencher."
      bullets={[
        "Resumos automáticos a partir de qualquer texto ou PDF",
        "Modo lacunas para praticar recuperação ativa",
        "Exporte, compartilhe e transforme em flashcards",
        "Áudio narrado dos resumos para revisar sem ler",
      ]}
    />
  ),
});
