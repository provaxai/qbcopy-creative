export type EditalItem = {
  numero: string;
  texto: string;
  isTitulo?: boolean;
};

export type EditalBloco = {
  titulo: string;
  itens: EditalItem[];
};

export type Curso = {
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  emoji: string;
  cor: string;
  ativo: boolean;
  edital: EditalBloco[];
};

export const CURSOS: Curso[] = [
  {
    slug: "crimes-hediondos",
    titulo: "Crimes Hediondos",
    subtitulo: "Lei nº 8.072/1990",
    descricao:
      "Domine a Lei nº 8.072/1990 do jeito que a banca cobra. Estude o rol taxativo dos crimes hediondos, causas de aumento e regime de cumprimento.",
    emoji: "🚨",
    cor: "from-rose-600 to-orange-500",
    ativo: true,
    edital: [
      {
        titulo: "LEI DOS CRIMES HEDIONDOS",
        itens: [
          { numero: "1", texto: "Introdução e natureza da Lei nº 8.072/1990", isTitulo: true },
          { numero: "1.1", texto: "Conceito de crime hediondo no ordenamento jurídico brasileiro" },
          { numero: "1.2", texto: "Rol taxativo do art. 1º e crimes equiparados a hediondos" },
          { numero: "1.3", texto: "Bem jurídico protegido e política criminal" },
          { numero: "2", texto: "Regime de cumprimento e progressão", isTitulo: true },
          { numero: "2.1", texto: "Regime inicial fechado e progressão diferenciada" },
          { numero: "2.2", texto: "Livramento condicional em crimes hediondos" },
          { numero: "2.3", texto: "Vedação à anistia, graça e indulto" },
          { numero: "3", texto: "Causas de aumento e agravantes específicas", isTitulo: true },
          { numero: "3.1", texto: "Aumento por associação e organização criminosa" },
          { numero: "3.2", texto: "Reincidência específica e seus efeitos" },
        ],
      },
    ],
  },
  {
    slug: "temas-relevantes",
    titulo: "Temas Relevantes para Provas",
    subtitulo: "Conteúdos que caem em concurso",
    descricao:
      "Conteúdos relevantes para provas de concurso público, revisados de acordo com o padrão das principais bancas.",
    emoji: "⚖️",
    cor: "from-amber-500 to-yellow-500",
    ativo: true,
    edital: [
      {
        titulo: "CONTEÚDO DO EDITAL",
        itens: [
          { numero: "1", texto: "LÍNGUA PORTUGUESA", isTitulo: true },
          { numero: "1.1", texto: "Compreensão e interpretação de textos de gêneros variados" },
          { numero: "1.2", texto: "Reconhecimento de tipos e gêneros textuais" },
          { numero: "1.3", texto: "Domínio da ortografia oficial" },
          { numero: "1.4", texto: "Mecanismos de coesão textual: referenciação, substituição, repetição e conectores" },
          { numero: "1.5", texto: "Estrutura morfossintática do período; regência verbal e nominal; crase; colocação pronominal" },
          { numero: "2", texto: "RACIOCÍNIO LÓGICO-MATEMÁTICO", isTitulo: true },
          { numero: "2.1", texto: "Modelagem de situações-problema por equações do 1º e 2º graus" },
          { numero: "2.2", texto: "Noção de função: análise gráfica, afim, quadrática, exponencial e logarítmica" },
          { numero: "2.3", texto: "Taxas de variação: razão e proporção; regra de três simples e composta" },
          { numero: "2.4", texto: "Porcentagem" },
          { numero: "2.5", texto: "Sequências numéricas, progressão aritmética e geométrica" },
        ],
      },
    ],
  },
  {
    slug: "prf-interativo",
    titulo: "Extensivo PRF Interativo",
    subtitulo: "PRF do Zero",
    descricao:
      "Curso completo para a PRF com planejamento de estudos, flashcards, questões, áudios e gamificação integrados.",
    emoji: "🚔",
    cor: "from-yellow-500 to-amber-600",
    ativo: true,
    edital: [
      {
        titulo: "CONTEÚDO DO EDITAL — PRF",
        itens: [
          { numero: "1", texto: "LÍNGUA PORTUGUESA", isTitulo: true },
          { numero: "1.1", texto: "Compreensão e interpretação de textos" },
          { numero: "1.2", texto: "Tipologia e gêneros textuais" },
          { numero: "1.3", texto: "Ortografia oficial e acentuação gráfica" },
          { numero: "1.4", texto: "Coesão e coerência textuais" },
          { numero: "2", texto: "LEGISLAÇÃO DE TRÂNSITO", isTitulo: true },
          { numero: "2.1", texto: "Código de Trânsito Brasileiro (Lei nº 9.503/1997)" },
          { numero: "2.2", texto: "Sistema Nacional de Trânsito e competências da PRF" },
          { numero: "2.3", texto: "Infrações, penalidades e medidas administrativas" },
          { numero: "2.4", texto: "Habilitação, documentação e registro de veículos" },
          { numero: "3", texto: "DIREITO CONSTITUCIONAL", isTitulo: true },
          { numero: "3.1", texto: "Princípios fundamentais e direitos e garantias individuais" },
          { numero: "3.2", texto: "Organização político-administrativa do Estado" },
          { numero: "3.3", texto: "Administração pública: princípios e servidores" },
          { numero: "4", texto: "DIREITO ADMINISTRATIVO", isTitulo: true },
          { numero: "4.1", texto: "Regime jurídico administrativo" },
          { numero: "4.2", texto: "Poderes da administração pública" },
          { numero: "4.3", texto: "Atos administrativos: conceito, elementos e classificação" },
        ],
      },
    ],
  },
  {
    slug: "direito-antidiscriminatorio-prf",
    titulo: "Direito Antidiscriminatório e Combate ao Racismo",
    subtitulo: "PRF — Teoria e Questões",
    descricao:
      "Curso teórico com questões voltado à Polícia Rodoviária Federal, cobrindo legislação antidiscriminatória e combate ao racismo.",
    emoji: "🤝",
    cor: "from-blue-600 to-slate-800",
    ativo: true,
    edital: [
      {
        titulo: "CONTEÚDO PROGRAMÁTICO",
        itens: [
          { numero: "1", texto: "Fundamentos constitucionais", isTitulo: true },
          { numero: "1.1", texto: "Princípio da igualdade e dignidade da pessoa humana" },
          { numero: "1.2", texto: "Objetivos fundamentais da República" },
          { numero: "2", texto: "Legislação antidiscriminatória", isTitulo: true },
          { numero: "2.1", texto: "Lei nº 7.716/1989 — Crimes de racismo" },
          { numero: "2.2", texto: "Injúria racial e distinção com o crime de racismo" },
          { numero: "2.3", texto: "Estatuto da Igualdade Racial (Lei nº 12.288/2010)" },
          { numero: "3", texto: "Direitos das populações vulneráveis", isTitulo: true },
          { numero: "3.1", texto: "Povos indígenas e comunidades quilombolas" },
          { numero: "3.2", texto: "Direitos LGBTQIA+ e enfrentamento à LGBTfobia" },
        ],
      },
    ],
  },
  {
    slug: "plf-camara",
    titulo: "PLF — Câmara dos Deputados",
    subtitulo: "Polícia Legislativa Federal",
    descricao:
      "Preparação pós-edital para a Polícia Legislativa Federal da Câmara dos Deputados, com foco nos pontos de maior incidência.",
    emoji: "🛡️",
    cor: "from-slate-700 to-blue-900",
    ativo: true,
    edital: [
      {
        titulo: "CONTEÚDO DO EDITAL — PLF",
        itens: [
          { numero: "1", texto: "DIREITO CONSTITUCIONAL", isTitulo: true },
          { numero: "1.1", texto: "Poder Legislativo: estrutura e funcionamento" },
          { numero: "1.2", texto: "Processo legislativo" },
          { numero: "1.3", texto: "Prerrogativas dos parlamentares" },
          { numero: "2", texto: "DIREITO PENAL", isTitulo: true },
          { numero: "2.1", texto: "Aplicação da lei penal" },
          { numero: "2.2", texto: "Crimes contra a administração pública" },
          { numero: "2.3", texto: "Crimes contra a fé pública" },
          { numero: "3", texto: "SEGURANÇA INSTITUCIONAL", isTitulo: true },
          { numero: "3.1", texto: "Segurança de dignitários e instalações" },
          { numero: "3.2", texto: "Uso progressivo da força" },
          { numero: "3.3", texto: "Gerenciamento de crises" },
        ],
      },
    ],
  },
];

export function getCursoBySlug(slug: string): Curso | undefined {
  return CURSOS.find((c) => c.slug === slug);
}
