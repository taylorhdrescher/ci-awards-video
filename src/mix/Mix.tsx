import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import plan from "./mix.json";
import * as T from "../teste/cenas";
import { Intro } from "../teste/intro";
import { FinalMontagem, MoralRings, PresenteMask, Premio, ProdDetalhe } from "./novas";

export const MIX_TOTAL = plan.total;
type Seg = { id: string; cena: string; dur: number; from: number; tr: string; vo: [string, number][] } & Record<string, any>;

const TESTE: Record<string, React.FC<{ dur: number; voz: number }>> = {
  abre1: T.Abre1, abre2: T.Abre2, busca: T.Busca, logo: T.Logo, educa: T.Educa, inclui: T.Inclui, pergunta: T.Pergunta,
  num1: T.Num1, num2: T.Num2, widgets: T.Widgets, virada: T.Virada, palavras: T.Palavras, trimestre: T.Trimestre,
  eventos: T.Eventos, mentor: T.Mentor, pessoas: T.Pessoas,
};

/** Transição de entrada de cada cena (zoom, subida, chicote ou flash). */
const Tr: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  let style: React.CSSProperties = {};
  if (type === "zoom") style = { scale: String(1 + 0.22 * t), filter: t > 0.01 ? `blur(${t * 18}px)` : undefined };
  if (type === "up") style = { translate: `0 ${t * 420}px`, filter: t > 0.01 ? `blur(${t * 20}px)` : undefined };
  if (type === "whip") style = { translate: `${t * 700}px 0`, filter: t > 0.01 ? `blur(${t * 28}px)` : undefined };
  const flash = type === "flash" ? interpolate(frame, [0, 7], [0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

const Body: React.FC<{ s: Seg }> = ({ s }) => {
  if (s.cena === "intro") return <Intro />;
  if (s.cena === "presente") return <PresenteMask dur={s.dur} fase2={s.fase2} vozFase2={s.vozFase2} />;
  if (s.cena === "prod") return <ProdDetalhe dur={s.dur} voz={s.voz} lead={s.lead} />;
  if (s.cena === "moral") return <MoralRings dur={s.dur} voz={s.voz} lead={s.lead} />;
  if (s.cena === "premio") return <Premio dur={s.dur} voz={s.voz} lead={s.lead} />;
  if (s.cena === "final") return <FinalMontagem dur={s.dur} per={s.per} />;
  const C = TESTE[s.cena];
  return <C dur={s.dur} voz={s.voz} />;
};

export const CIAwardsMix: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {(plan.seg as unknown as Seg[]).map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
        <Tr type={s.tr}>
          <Body s={s} />
        </Tr>
        {s.vo.map(([f, at]: [string, number]) => (
          <Sequence key={f} from={at} layout="none">
            <Audio src={staticFile(`teste/vo/${f}.wav`)} />
          </Sequence>
        ))}
      </Sequence>
    ))}
    <Audio src={staticFile("mix/musica.wav")} volume={0.9} />
    <Audio src={staticFile("mix/efeitos.wav")} volume={0.8} />
  </AbsoluteFill>
);
