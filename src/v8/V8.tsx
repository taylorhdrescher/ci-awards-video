import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Abertura, D, Educa, Presente } from "./cenas1";
import { Resultados } from "./cenas2";
import { Depoimento, Encerramento, Eventos, Reconhecimento } from "./cenas3";
import { hasAsset } from "./kit";

/** Blocos alinhados à grade da trilha nova (120 BPM → 1 compasso = 60 quadros). Cortes secos, sem sobreposição. */
export const SECOES: { C: React.FC<D>; dur: number; name: string }[] = [
  { C: Abertura, dur: 360, name: "1 Abertura" },
  { C: Presente, dur: 480, name: "2 Estar presente" },
  { C: Educa, dur: 540, name: "3 Educar · Incluir · Inspirar" },
  { C: Resultados, dur: 900, name: "4 Resultados FY26" },
  { C: Reconhecimento, dur: 600, name: "5 Reconhecimento" },
  { C: Eventos, dur: 360, name: "6 Feiras e eventos" },
  { C: Depoimento, dur: 300, name: "7 Depoimento" },
  { C: Encerramento, dur: 420, name: "8 Encerramento" },
];
export const V8_TOTAL = SECOES.reduce((s, x) => s + x.dur, 0);

const TRILHA = "audio/trilha8.wav";
const SFX = "audio/sfx8.wav";

export const CIAwardsV8: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SECOES.map(({ C, dur, name }) => {
        const from = t;
        t += dur;
        return (
          <Sequence key={name} name={name} from={from} durationInFrames={dur}>
            <C dur={dur} />
          </Sequence>
        );
      })}
      {hasAsset(TRILHA) ? <Audio src={staticFile(TRILHA)} volume={0.9} /> : null}
      {hasAsset(SFX) ? <Audio src={staticFile(SFX)} volume={0.8} /> : null}
    </AbsoluteFill>
  );
};
