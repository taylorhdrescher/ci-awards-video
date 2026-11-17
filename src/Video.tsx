import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background, Overlay } from "./components/Background";
import { clamp, EASE_IN_OUT } from "./components/ui";
import { EFEITOS, MUSICA, VIDEO_FUNDO } from "./content";
import { S1Abertura } from "./scenes/S1Abertura";
import { S2Presente } from "./scenes/S2Presente";
import { S3Educar } from "./scenes/S3Educar";
import { S4aTotais, S4bPilares, S4cDetalhes } from "./scenes/S4Resultados";
import { S5Reconhecimento } from "./scenes/S5Reconhecimento";
import { S6Eventos } from "./scenes/S6Eventos";
import { S7Depoimento, S8Encerramento } from "./scenes/S7S8Final";

// duração de cada cena em frames (30 fps)
const SCENES: { C: React.FC<{ dur: number }>; dur: number; name: string }[] = [
  { C: S1Abertura, dur: 300, name: "Abertura" },
  { C: S2Presente, dur: 660, name: "Estar presente" },
  { C: S3Educar, dur: 570, name: "Educar" },
  { C: S4aTotais, dur: 270, name: "Resultados - totais" },
  { C: S4bPilares, dur: 480, name: "Resultados - pilares" },
  { C: S4cDetalhes, dur: 390, name: "Resultados - detalhes" },
  { C: S5Reconhecimento, dur: 660, name: "Reconhecimento" },
  { C: S6Eventos, dur: 420, name: "Feiras e eventos" },
  { C: S7Depoimento, dur: 600, name: "Depoimento" },
  { C: S8Encerramento, dur: 330, name: "Encerramento" },
];
const OVERLAP = 14;

export const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - OVERLAP);
  return acc;
}, []);
export const TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

/** faixa de luz dourada que cruza a tela entre cenas */
const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 26], [-40, 140], { ...clamp, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        background: `linear-gradient(110deg, transparent ${p - 25}%, rgba(227,185,63,.25) ${p - 8}%, rgba(255,240,190,.55) ${p}%, rgba(94,194,74,.2) ${p + 8}%, transparent ${p + 25}%)`,
      }}
    />
  );
};

export const CIAwardsVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background video={VIDEO_FUNDO} />
      {SCENES.map(({ C, dur, name }, i) => (
        <Sequence key={name} name={name} from={STARTS[i]} durationInFrames={dur}>
          <C dur={dur} />
        </Sequence>
      ))}
      {STARTS.slice(1).map((s, i) => (
        <Sequence key={"sw" + i} from={s - 13} durationInFrames={26} name="transição">
          <LightSweep />
        </Sequence>
      ))}
      <Overlay />
      {MUSICA ? <Audio src={staticFile(MUSICA)} volume={0.9} /> : null}
      {EFEITOS ? <Audio src={staticFile(EFEITOS)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
