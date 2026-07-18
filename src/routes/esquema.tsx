import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/esquema")({
  head: () => ({
    meta: [
      { title: "Esquema IA — EstudaMais" },
      { name: "description", content: "Transforme conteúdos densos em mapas visuais organizados." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="🧠 Esquema IA"
      title="Mapas mentais gerados automaticamente"
      subtitle="Dê à IA um tema, um texto ou um PDF e receba um esquema visual pronto para memorizar."
      bullets={[
        "Mapas mentais e esquemas visuais em segundos",
        "Personalize cores, ramificações e destaque",
        "Exporte em PNG, PDF ou compartilhe direto",
        "Reveja com modo cascata e modo lacuna",
      ]}
    />
  ),
});
