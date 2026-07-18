import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/legis")({
  head: () => ({
    meta: [
      { title: "Legis — EstudaMais" },
      { name: "description", content: "Estude legislação de forma estruturada com lacunas para memorizar." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="⚖️ Legis"
      title="Legislação estruturada com lacunas"
      subtitle="Constituição, códigos, leis e decretos organizados por artigo, com modo lacuna e revisão espaçada."
      bullets={[
        "Base atualizada da Constituição, códigos e leis",
        "Modo lacuna artigo por artigo",
        "Grifos e anotações pessoais preservados",
        "Revisão inteligente do que você mais erra",
      ]}
    />
  ),
});
