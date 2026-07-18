import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/prova-oral")({
  head: () => ({
    meta: [
      { title: "Prova Oral — EstudaMais" },
      { name: "description", content: "Simule bancas de prova oral com avaliação instantânea." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="🎙️ Prova oral"
      title="Simule bancas de prova oral"
      subtitle="Perguntas realistas por área, resposta por voz e avaliação instantânea de clareza, conteúdo e postura."
      bullets={[
        "Simulação por voz com transcrição em tempo real",
        "Perguntas realistas por área de concurso ou entrevista",
        "Avaliação de clareza, conteúdo e ritmo",
        "Gravações salvas para revisar depois",
      ]}
    />
  ),
});
