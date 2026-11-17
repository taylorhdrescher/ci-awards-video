import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timeline from "./timeline.json";
import * as S from "./cenas";
import { INTRO, Intro } from "./intro";

const MAP: Record<string, React.FC<{ dur: number; voz: number }>> = {
  abre1: S.Abre1, abre2: S.Abre2, busca: S.Busca, logo: S.Logo, presente: S.Presente, tela: S.Tela,
  educa: S.Educa, inclui: S.Inclui, pergunta: S.Pergunta, num1: S.Num1, num2: S.Num2, widgets: S.Widgets,
  virada: S.Virada, trimestre: S.Trimestre, eventos: S.Eventos, palavras: S.Palavras, mentor: S.Mentor,
  pessoas: S.Pessoas, final: S.Final,
};
export const TESTE_TOTAL = INTRO + timeline.total;
export const TESTE_AUDIO = { musica: "teste/musica.wav", efeitos: "teste/efeitos.wav" };

export const CIAwardsTeste: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={INTRO}>
      <Intro />
    </Sequence>
    <Sequence from={INTRO}>
    {timeline.linhas.map((l, i) => {
      const C = MAP[l.cena];
      const from = i === 0 ? 0 : l.from;
      const next = i < timeline.linhas.length - 1 ? timeline.linhas[i + 1].from : timeline.total;
      const dur = next - from;
      return (
        <Sequence key={l.cena} from={from} durationInFrames={dur} name={l.cena}>
          <C dur={dur} voz={l.voz + (l.from - from)} />
        </Sequence>
      );
    })}
    <Audio src={staticFile("teste/narracao.wav")} />
    </Sequence>
    <Audio src={staticFile(TESTE_AUDIO.efeitos)} volume={0.8} />
    <Audio src={staticFile(TESTE_AUDIO.musica)} volume={0.9} />
  </AbsoluteFill>
);
