import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — EstudaMais" },
      { name: "description", content: "Cartões inteligentes gerados automaticamente com repetição espaçada." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="🃏 Flashcards"
      title="Repetição espaçada que respeita seu cérebro"
      subtitle="Cartões gerados automaticamente a partir dos seus materiais e revisados no momento exato antes do esquecimento."
      bullets={[
        "Geração automática a partir de resumos, PDFs e cursos",
        "Algoritmo de repetição espaçada inteligente",
        "6 modos de estudo: clássico, digitação, associação e mais",
        "Acompanhamento card a card com métricas de retenção",
      ]}
    />
  ),
});
