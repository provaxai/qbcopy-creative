import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/discursiva")({
  head: () => ({
    meta: [
      { title: "Treinador de Discursiva — EstudaMais" },
      { name: "description", content: "Pratique questões discursivas com feedback detalhado da IA." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="✍️ Discursiva"
      title="Redações e discursivas com feedback da IA"
      subtitle="Escreva. Envie. Receba correção detalhada por competência, com sugestões concretas de melhoria."
      bullets={[
        "Correção por competência estilo banca examinadora",
        "Sugestões de reescrita parágrafo a parágrafo",
        "Banco de temas atualizado semanalmente",
        "Comparativo da sua evolução ao longo do tempo",
      ]}
    />
  ),
});
