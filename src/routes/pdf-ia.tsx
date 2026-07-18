import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "../components/FeaturePage";

export const Route = createFileRoute("/pdf-ia")({
  head: () => ({
    meta: [
      { title: "PDF IA — EstudaMais" },
      { name: "description", content: "Envie um PDF e transforme em flashcards, quizzes, resumos em áudio e muito mais." },
    ],
  }),
  component: () => (
    <FeaturePage
      eyebrow="📚 PDF IA"
      title="Transforme qualquer PDF em estudo ativo"
      subtitle="Envie apostilas, livros e artigos. A IA extrai o conteúdo e gera resumos, flashcards, quizzes gamificados e áudio."
      bullets={[
        "Upload de PDFs de até 500 páginas",
        "Geração automática de resumos, flashcards e quizzes",
        "Áudio narrado por capítulo para escutar no trânsito",
        "Chat contextual conversando diretamente com o PDF",
      ]}
    />
  ),
});
