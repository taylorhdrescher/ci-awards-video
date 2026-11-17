/**
 * V9 — "Grandeza". Mesmo roteiro e mesmas durações da v7 (CIAwardsV6) → trilha orquestral e sinos sincronizados.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EFEITOS, MUSICA } from "../content";
import { Abertura, D, Educa, Presente } from "./cenas-a";
import { Depoimento, Detalhes, Encerramento, Eventos, Pilares, Reconhecimento, Totais } from "./cenas-b";

type TrType = "none" | "sweep" | "bloom" | "dissolve";
const SCENES: { C: React.FC<D>; dur: number; name: string; tr: TrType }[] = [
  { C: Abertura, dur: 300, name: "Abertura", tr: "none" },
  { C: Presente, dur: 660, name: "Estar presente", tr: "sweep" },
  { C: Educa, dur: 570, name: "Educar", tr: "bloom" },
  { C: Totais, dur: 270, name: "Totais", tr: "sweep" },
  { C: Pilares, dur: 480, name: "Pilares", tr: "dissolve" },
  { C: Detalhes, dur: 390, name: "Detalhes", tr: "sweep" },
  { C: Reconhecimento, dur: 660, name: "Reconhecimento", tr: "bloom" },
  { C: Eventos, dur: 420, name: "Eventos", tr: "sweep" },
  { C: Depoimento, dur: 600, name: "Depoimento", tr: "dissolve" },
  { C: Encerramento, dur: 330, name: "Encerramento", tr: "bloom" },
];
const OVERLAP = 14;
const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - OVERLAP);
  return acc;
}, []);
export const V9_TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

/** Entrada da cena: varredura com borda de luz, mergulho na luz ou dissolução. */
const Tr: React.FC<{ type: TrType; children: React.ReactNode }> = ({ type, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, OVERLAP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  if (type === "none" || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (type === "sweep") {
    const x = -20 + p * 140; // borda percorre a tela da esquerda para a direita
    const mask = `linear-gradient(90deg, #000 ${x - 20}%, transparent ${x}%)`;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>{children}</AbsoluteFill>
        <AbsoluteFill style={{ mixBlendMode: "screen", background: `linear-gradient(90deg, transparent ${x - 16}%, rgba(255,240,205,${0.9 * Math.sin(p * Math.PI)}) ${x - 8}%, transparent ${x}%)`, filter: "blur(6px)" }} />
      </AbsoluteFill>
    );
  }
  if (type === "bloom") {
    const glow = Math.sin(p * Math.PI);
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ opacity: p, scale: String(1.06 - 0.06 * p), filter: `blur(${(1 - p) * 14}px)` }}>{children}</AbsoluteFill>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(255,247,225,${0.85 * glow}), rgba(255,240,200,${0.45 * glow}))` }} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{ opacity: p }}>{children}</AbsoluteFill>;
};

export const CIAwardsV9: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map(({ C, dur, name, tr }, i) => (
      <Sequence key={name} name={name} from={STARTS[i]} durationInFrames={dur}>
        <Tr type={tr}>
          <C dur={dur} />
        </Tr>
      </Sequence>
    ))}
    {MUSICA ? <Audio src={staticFile(MUSICA)} volume={0.9} /> : null}
    {EFEITOS ? <Audio src={staticFile(EFEITOS)} volume={1} /> : null}
  </AbsoluteFill>
);
