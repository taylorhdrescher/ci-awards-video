// ============================================================
//  CONTEÚDO EDITÁVEL DO VÍDEO — textos, números e mídias
//  (troque aqui sem precisar mexer nas animações)
// ============================================================

export const EVENTO = {
  ano: "2026",
  fiscal: "FY26",
  unidade: "John Deere · Montenegro",
  slogan: "O Oscar da Melhoria Contínua de Montenegro",
};

// Vídeo de fundo: coloque o arquivo em public/vid/ e informe o nome aqui
// ex.: "vid/fundo.mp4". Enquanto for null, usa o fundo animado.
export const VIDEO_FUNDO: string | null = "vid/fundo.mp4";

/** Trilha sonora (public/audio). Para trocar, substitua o arquivo ou mude o caminho. null = sem música. */
export const MUSICA: string | null = "audio/trilha.wav";
/** Efeitos sonoros dos indicadores (gerados por scripts/efeitos.py). null = sem efeitos. */
export const EFEITOS: string | null = "audio/efeitos.wav";

// Depoimento do mentor: coloque o vídeo em public/vid/ e informe aqui.
export const DEPOIMENTO = {
  nome: "Mercio Ruyz",
  cargo: "Mentor · Melhoria Contínua",
  video: null as string | null, // ex.: "vid/depoimento-mercio.mp4"
  frase: "Melhoria contínua é feita de pessoas.", // usada enquanto não há vídeo
};

// ----- Cena "Estar presente" -----
export const PRESENTE = {
  frases: ["No chão de fábrica", "Ao lado das pessoas", "Nos resultados"],
  cards: [
    { src: "img/m-feira-gemba.jpg", tipo: "img", label: "No Gemba" }, // vid/grupo-gemba.mp4 não veio no pacote
    { src: "vid/paineis.mp4", tipo: "video", label: "Na gestão diária" },
    { src: "img/gemba-estande.jpg", tipo: "img", label: "Com os times" },
    { src: "img/estande-apresentacao.jpg", tipo: "img", label: "Engajando" },
    { src: "vid/facilitando.mp4", tipo: "video", label: "Facilitando" },
    { src: "vid/inovar.mp4", tipo: "video", label: "Inovando" },
  ] as const,
};

// ----- Cena "Educar / Incluir / Inspirar" -----
export const EDUCAR = [
  {
    palavra: "Educar",
    texto: "Formamos pessoas no Pensamento A3 e no Ver e Agir.",
    src: "img/a3-apresentacao.jpg",
    tipo: "img",
  },
  {
    palavra: "Incluir",
    texto: "Melhoria contínua feita por todos, em todas as áreas.",
    src: "vid/facilitando.mp4",
    tipo: "video",
  },
  {
    palavra: "Inspirar",
    texto: "Um time que vive a melhoria todos os dias.",
    src: "img/time-selfie.jpg",
    tipo: "img",
  },
] as const;

// ----- Resultados FY26 (tabela do painel; Evolução desconsiderada) -----
export type Pilar = {
  letra: string;
  nome: string;
  cor: string;
  concluidos: number;
  andamento: number;
  valor: number;
  casas: number;
  prefixo?: string;
  sufixo: string;
  unidade: string;
};

export const PILARES: Pilar[] = [
  { letra: "S", nome: "Segurança", cor: "#f28c28", concluidos: 1239, andamento: 663, valor: 5716, casas: 0, sufixo: "", unidade: "RPN" },
  { letra: "Q", nome: "Qualidade", cor: "#ffc72c", concluidos: 1165, andamento: 682, valor: 972, casas: 0, sufixo: "", unidade: "RPN" },
  { letra: "P", nome: "Produtividade", cor: "#5ec24a", concluidos: 2697, andamento: 881, valor: 580.14, casas: 2, sufixo: " mil", unidade: "minutos" },
  { letra: "leaf", nome: "Meio Ambiente", cor: "#8fd16f", concluidos: 451, andamento: 263, valor: 1, casas: 0, sufixo: " mil", unidade: "RPN" },
  { letra: "$", nome: "Custos", cor: "#d9965b", concluidos: 479, andamento: 420, valor: 3, casas: 0, prefixo: "R$ ", sufixo: " mi", unidade: "total" },
  { letra: "heart", nome: "Moral", cor: "#2fb5ac", concluidos: 35, andamento: 69, valor: 35, casas: 0, sufixo: "", unidade: "projetos" },
];

export const TOTAL_CONCLUIDOS = PILARES.reduce((s, p) => s + p.concluidos, 0); // 6.066
export const TOTAL_ANDAMENTO = PILARES.reduce((s, p) => s + p.andamento, 0); // 2.978

export const DETALHE = {
  produtividade: {
    total: 580.14,
    op: 365.98,
    estrutural: 29.19,
    waste: 336.79,
    adm: 214.16,
  },
  custos: { total: 3, estrutural: 1.21, avoidance: 1.98 },
  moral: [
    { nome: "Ambiente", valor: 18 },
    { nome: "Educação", valor: 9 },
    { nome: "Bem-Estar", valor: 8 },
  ],
};

// ----- Reconhecimento -----
export const RECONHECIMENTO = {
  palavras: ["Melhorar", "Avançar", "Reconhecer", "Celebrar"],
  fotos: [
    "img/reconhecimento-log.jpg",
    "img/reconhecimento-grupo.jpg",
    "img/reconhecimento-dto-solda.jpg",
    "img/m-evento-premiacao.jpg",
    "img/reconhecimento-dupla.jpg",
    "img/a3-apresentacao.jpg",
    "img/m-evento-linha.jpg",
  ],
};

// ----- Feiras e eventos -----
export const EVENTOS = {
  fotos: [
    "img/concurso-brasileiro.jpg",
    "img/m-feira-estande.jpg",
    "img/gemba-estande.jpg",
    "img/m-feira-quadro.jpg",
    "img/m-evento-plateia.jpg",
    "img/m-feira-gemba.jpg",
    "img/time-ci.jpg",
    "img/m-evento-palco.jpg",
  ],
};
