import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/cursos")({
  head: () => ({
    meta: [
      { title: "Cursos — EstudaMais" },
      { name: "description", content: "Trilhas de estudo organizadas com materiais exclusivos para você evoluir com foco." },
      { property: "og:title", content: "Cursos — EstudaMais" },
      { property: "og:description", content: "Trilhas completas de estudo com materiais exclusivos." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="🎓 Cursos"
      title="Trilhas de estudo com foco em aprovação"
      subtitle="Cursos cuidadosamente organizados, com aulas, materiais e revisões inteligentes integrados à sua rotina."
      bullets={[
        "Trilhas específicas por concurso, vestibular e área de estudo",
        "Aulas curtas e objetivas, com foco em fixação",
        "Materiais de apoio em PDF e slides para download",
        "Progresso individual sincronizado com flashcards e resumos",
      ]}
    />
  ),
});
