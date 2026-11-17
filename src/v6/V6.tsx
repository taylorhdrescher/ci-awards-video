import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EFEITOS, MUSICA } from "../content";
import * as S from "./cenas";

// mesmas durações e sobreposição da v5 → trilha e efeitos sincronizados
const SCENES: { C: React.FC<{ dur: number }>; dur: number; name: string; tr: string }[] = [
  { C: S.V6Abertura, dur: 300, name: "Abertura", tr: "none" },
  { C: S.V6Presente, dur: 660, name: "Estar presente", tr: "zoom" },
  { C: S.V6Educar, dur: 570, name: "Educar", tr: "up" },
  { C: S.V6Totais, dur: 270, name: "Totais", tr: "flash" },
  { C: S.V6Pilares, dur: 480, name: "Pilares", tr: "zoom" },
  { C: S.V6Detalhes, dur: 390, name: "Detalhes", tr: "whip" },
  { C: S.V6Reconhecimento, dur: 660, name: "Reconhecimento", tr: "zoom" },
  { C: S.V6Eventos, dur: 420, name: "Eventos", tr: "whip" },
  { C: S.V6Depoimento, dur: 600, name: "Depoimento", tr: "up" },
  { C: S.V6Encerramento, dur: 330, name: "Encerramento", tr: "flash" },
];
const OVERLAP = 14;
const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - OVERLAP);
  return acc;
}, []);
export const V6_TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

const Tr: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, OVERLAP], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const o = interpolate(frame, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let style: React.CSSProperties = {};
  if (type === "zoom") style = { scale: String(1 + 0.25 * t), filter: t > 0.01 ? `blur(${t * 20}px)` : undefined, opacity: o };
  if (type === "up") style = { translate: `0 ${t * 600}px`, filter: t > 0.01 ? `blur(${t * 20}px)` : undefined };
  if (type === "whip") style = { translate: `${t * 1000}px 0`, filter: t > 0.01 ? `blur(${t * 30}px)` : undefined };
  const flash = type === "flash" ? interpolate(frame, [0, 4, 12], [0, 0.95, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

export const CIAwardsV6: React.FC = () => (
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
