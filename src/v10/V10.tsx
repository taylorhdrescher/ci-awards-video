/**
 * V10 — estilo "produto/interface" (referência estilo Vercel/v0) sobre o roteiro e os tempos da v7.
 * Mesmas durações/sobreposição → trilha orquestral e sinos da v7 continuam sincronizados.
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EFEITOS, MUSICA } from "../content";
import { Abertura, D, Depoimento, Detalhes, Educa, Encerramento, Eventos, Pilares, Presente, Reconhecimento, Totais } from "./cenas";

const SCENES: { C: React.FC<D>; dur: number; name: string }[] = [
  { C: Abertura, dur: 300, name: "Abertura" },
  { C: Presente, dur: 660, name: "Estar presente" },
  { C: Educa, dur: 570, name: "Educar" },
  { C: Totais, dur: 270, name: "Totais" },
  { C: Pilares, dur: 480, name: "Pilares" },
  { C: Detalhes, dur: 390, name: "Detalhes" },
  { C: Reconhecimento, dur: 660, name: "Reconhecimento" },
  { C: Eventos, dur: 420, name: "Eventos" },
  { C: Depoimento, dur: 600, name: "Depoimento" },
  { C: Encerramento, dur: 330, name: "Encerramento" },
];
const OVERLAP = 14;
const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - OVERLAP);
  return acc;
}, []);
export const V10_TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

/** Passagem por foco: a cena entra desfocada e um pouco maior, e assenta nítida. */
const FocusIn: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const frame = useCurrentFrame();
  if (first) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(frame, [0, OVERLAP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: p, filter: p < 1 ? `blur(${(1 - p) * 22}px)` : undefined, scale: String(1.05 - 0.05 * p) }}>{children}</AbsoluteFill>;
};

export const CIAwardsV10: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map(({ C, dur, name }, i) => (
      <Sequence key={name} name={name} from={STARTS[i]} durationInFrames={dur}>
        <FocusIn first={i === 0}>
          <C dur={dur} />
        </FocusIn>
      </Sequence>
    ))}
    {MUSICA ? <Audio src={staticFile(MUSICA)} volume={0.85} /> : null}
    {EFEITOS ? <Audio src={staticFile(EFEITOS)} volume={1} /> : null}
  </AbsoluteFill>
);
