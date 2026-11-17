import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EDUCAR, EVENTO, PRESENTE } from "../content";
import { Bloom, C, cl, Dust, Eyebrow, Fade, Footage, Frame, Grade, Hair, Hud, INOUT, Letterbox, Midia, OUT, Plate, Rays, SANS, Stage, Streak, Title, Track, useL } from "./kit";

export type D = { dur: number };
export const center: React.CSSProperties = { alignItems: "center", justifyContent: "center" };

/** Bloco de texto posicionado: canto inferior esquerdo (16:9) ou base centralizada (9:16). */
export const Block: React.FC<{ children: React.ReactNode; top?: number; bottom?: number; vTop?: number; vBottom?: number; left?: number }> = ({ children, top, bottom, vTop, vBottom, left = 150 }) => {
  const { V } = useL();
  return V ? (
    <div style={{ position: "absolute", left: 70, right: 70, top: vTop, bottom: vBottom ?? (vTop === undefined ? 300 : undefined), display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" }}>{children}</div>
  ) : (
    <div style={{ position: "absolute", left, top, bottom: bottom ?? (top === undefined ? 170 : undefined), display: "flex", flexDirection: "column", gap: 28 }}>{children}</div>
  );
};

// =================================================================== 1 · ABERTURA (300) — logo CI200 → bandeiras com título dourado
const LOGO_END = 150; // pancada da trilha em 5,0 s
export const Abertura: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const z = interpolate(frame, [LOGO_END - 16, LOGO_END], [1, 1.35], { ...cl, easing: (x) => x * x * x });
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {frame < LOGO_END ? (
        <AbsoluteFill style={{ scale: String(z * interpolate(frame, [0, LOGO_END], [1, 1.04])), filter: `blur(${interpolate(frame, [LOGO_END - 10, LOGO_END], [0, 14], cl)}px)` }}>
          <OffthreadVideo src={staticFile("teste/abertura-logo.mp4")} startFrom={9} muted style={{ width: "100%", height: "100%", objectFit: V ? "contain" : "cover" }} />
          <Hud at={12} color="rgba(20,40,20,.55)" label="CONTINUOUS IMPROVEMENT" />
        </AbsoluteFill>
      ) : (
        <Sequence from={LOGO_END} layout="none">
          <Titulo dur={dur - LOGO_END} />
        </Sequence>
      )}
      <Streak at={LOGO_END - 14} y={50} dur={20} />
      <Bloom at={LOGO_END} len={18} max={1} />
    </AbsoluteFill>
  );
};

const Titulo: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const sub = interpolate(frame, [48, 66], [0, 1], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile("teste/entrada-bandeiras-lenta.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [0, dur], [1.04, 1.12])), filter: "saturate(.8) contrast(1.05)" }} />
        <Grade dim={0.55} />
      </AbsoluteFill>
      <Rays opacity={0.45} />
      <Dust n={60} />
      <Letterbox from={0} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: V ? 24 : 18 }}>
        <Eyebrow text="John Deere Montenegro apresenta" at={4} color={C.gold} center />
        <Title lines={[[{ t: "CI Awards", w: 700, gold: true }]]} size={t(230)} at={10} align="center" tracking="-0.05em" />
        <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: sub }}>
          <Hair w={V ? 120 : 180} at={44} color="rgba(216,180,90,.7)" />
          <div style={{ fontFamily: SANS, fontWeight: 200, fontSize: V ? 64 : 64, letterSpacing: "0.5em", color: C.white, marginRight: "-0.5em" }}>{EVENTO.ano}</div>
          <Hair w={V ? 120 : 180} at={44} color="rgba(216,180,90,.7)" />
        </div>
        <div style={{ marginTop: 10 }}>
          <Fade text={EVENTO.slogan} at={62} every={2} size={V ? 40 : 42} serif color="rgba(255,255,255,.88)" width={V ? 900 : 1300} align="center" />
        </div>
      </AbsoluteFill>
      <Hud at={20} />
    </AbsoluteFill>
  );
};

// =================================================================== 2 · ESTAR PRESENTE (660)
/** Plano de imagem da fábrica com alvo rastreado e título. */
const Momento: React.FC<{ dur: number; at: number; lines: Parameters<typeof Title>[0]["lines"]; box: [number, number, number, number]; vbox: [number, number, number, number]; label: string; sub: string; n: string }> = ({ dur, at, lines, box, vbox, label, sub, n }) => {
  const { V, t } = useL();
  const b = V ? vbox : box;
  return (
    <AbsoluteFill>
      <Footage at={at} dim={0.3} dur={dur} push={[1.06, 1.14]} />
      <Letterbox from={-30} />
      <Track x={b[0]} y={b[1]} w={b[2]} h={b[3]} at={10} label={label} sub={sub} />
      <Block>
        <Eyebrow n={n} text="Como atuamos" at={4} />
        <Title lines={lines} size={t(124)} at={8} every={5} align={V ? "center" : "left"} />
      </Block>
      <Hud at={0} />
      <Streak at={0} y={V ? 30 : 42} dur={18} />
    </AbsoluteFill>
  );
};

const PresenteIntro: React.FC<D> = ({ dur }) => {
  const { V, t } = useL();
  return (
    <AbsoluteFill>
      <Footage at={6.4} dim={0.45} dur={dur} push={[1.02, 1.1]} />
      <Letterbox from={0} />
      <Block>
        <Eyebrow n="01" text="Como atuamos" at={6} />
        <Title lines={[[{ t: "Estar", w: 300 }], [{ t: "presente.", serif: true, color: C.leaf }]]} size={t(210)} at={12} every={8} align={V ? "center" : "left"} />
        <Fade text="No chão de fábrica, ao lado das pessoas, nos resultados." at={46} every={2} size={V ? 38 : 36} width={V ? 900 : 900} align={V ? "center" : "left"} />
      </Block>
      <Hud at={10} />
    </AbsoluteFill>
  );
};

/** Galeria em profundidade: a câmera atravessa os 6 registros de presença. */
const Galeria: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, H, t } = useL();
  const cards = PRESENTE.cards;
  const cam = interpolate(frame, [0, dur], [-600, 2500], { easing: INOUT });
  const cw = V ? 620 : 560;
  const ch = V ? 780 : 360;
  const pos = (i: number) => {
    const side = i % 2 ? 1 : -1;
    return { x: side * (V ? 240 : 520), y: (i % 3 - 1) * (V ? 260 : 120), z: -i * 520 };
  };
  return (
    <Stage glow="rgba(54,124,43,.4)">
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: W / 2, top: H / 2, transformStyle: "preserve-3d", transform: `translateZ(${cam}px)` }}>
          {cards.map((c, i) => {
            const p = pos(i);
            const zRel = p.z + cam; // > 0 = passou da câmera
            const o = interpolate(zRel, [-2600, -1800, 300, 900], [0, 1, 1, 0], cl);
            return (
              <div key={i} style={{ position: "absolute", transform: `translate3d(${p.x - cw / 2}px, ${p.y - ch / 2}px, ${p.z}px) rotateY(${-Math.sign(p.x) * 14}deg)`, opacity: o }}>
                <Frame src={c.src} w={cw} h={ch} dur={dur} label={c.label} style={{ position: "relative" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Dust n={40} color="200,255,190" rise={0.3} max={0.6} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 45% 30% at 50% 50%, rgba(5,11,7,.85), transparent 75%)", opacity: interpolate(frame, [16, 34], [0, 1], cl) }} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 18 }}>
        <Title lines={[[{ t: "Presença que ", w: 300 }, { t: "gera resultado.", serif: true, color: C.leaf }]]} size={t(96)} at={24} align="center" />
      </AbsoluteFill>
      <Hud at={0} label="01 · ESTAR PRESENTE" />
    </Stage>
  );
};

export const Presente: React.FC<D> = () => {
  // cortes na grade da trilha (1 tempo = 20 quadros)
  const shots: [number, number, React.ReactNode][] = [
    [0, 180, <PresenteIntro dur={180} />],
    [180, 120, <Momento dur={120} at={12.0} n="01" label="Gemba" sub="CHÃO DE FÁBRICA" lines={[[{ t: "No chão ", w: 300 }], [{ t: "de " , w: 300 }, { t: "fábrica.", serif: true, color: C.leaf }]]} box={[880, 140, 520, 640]} vbox={[260, 380, 560, 760]} />],
    [300, 120, <Momento dur={120} at={23.4} n="01" label="Time" sub="AO LADO DAS PESSOAS" lines={[[{ t: "Ao lado ", w: 300 }], [{ t: "das ", w: 300 }, { t: "pessoas.", serif: true, color: C.leaf }]]} box={[560, 120, 900, 620]} vbox={[90, 400, 900, 700]} />],
    [420, 120, <Momento dur={120} at={29.6} n="01" label="Gestão diária" sub="NOS RESULTADOS" lines={[[{ t: "Nos ", w: 300 }, { t: "resultados.", serif: true, color: C.leaf }]]} box={[1000, 130, 520, 520]} vbox={[420, 330, 560, 640]} />],
    [540, 120, <Galeria dur={120} />],
  ];
  return (
    <AbsoluteFill>
      {shots.map(([from, d, el], i) => (
        <Sequence key={i} from={from} durationInFrames={d}>
          {el}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// =================================================================== 3 · EDUCAR · INCLUIR · INSPIRAR (570 = 3 × 190)
const Metodo: React.FC<{ n: string; name: string; desc: string; at: number; w: number }> = ({ n, name, desc, at, w }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const p = interpolate(frame, [at, at + 18], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ width: w, fontFamily: SANS, opacity: p, translate: `0 ${(1 - p) * 20}px` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 22, justifyContent: V ? "center" : "flex-start" }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: C.yellow, letterSpacing: "0.2em" }}>{n}</span>
        <span style={{ fontSize: V ? 50 : 46, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>{name}</span>
      </div>
      <Hair w={w} at={at + 4} dur={24} color="rgba(255,255,255,.25)" style={{ margin: "16px 0 12px" }} />
      <div style={{ fontSize: V ? 26 : 24, fontWeight: 500, letterSpacing: "0.22em", color: "rgba(255,255,255,.6)", textAlign: V ? "center" : "left" }}>{desc.toUpperCase()}</div>
    </div>
  );
};

const Educar: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, t } = useL();
  const ph = interpolate(frame, [6, 40], [0, 1], { ...cl, easing: OUT });
  const fw = V ? 900 : 720;
  const fh = V ? 640 : 860;
  return (
    <Stage glow="rgba(54,124,43,.38)" at={[V ? 50 : 70, 45]}>
      <div style={{ position: "absolute", left: V ? (W - fw) / 2 : 1080, top: V ? 170 : 110, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${V ? 0 : interpolate(frame, [0, dur], [-16, -6])}deg) rotateX(${V ? interpolate(frame, [0, dur], [8, 2]) : 0}deg)`, opacity: ph, scale: String(0.92 + 0.08 * ph) }}>
          <Frame src={EDUCAR[0].src} w={fw} h={fh} dur={dur} style={{ position: "relative" }} label="Formação A3" />
        </div>
      </div>
      <Block top={V ? undefined : 200} vTop={880} left={150}>
        <Eyebrow n="02" text="Como educamos" at={2} />
        <Title lines={[[{ t: "Educar", w: 800 }, { t: ".", w: 800, color: C.leaf }]]} size={t(190)} at={6} align={V ? "center" : "left"} />
        <Fade text={EDUCAR[0].texto} at={20} every={1.6} size={V ? 38 : 36} width={V ? 900 : 760} align={V ? "center" : "left"} />
        <div style={{ display: "flex", flexDirection: "column", gap: V ? 40 : 34, marginTop: V ? 20 : 34 }}>
          <Metodo n="01" name="Pensamento A3" desc="Problema · Causa raiz · Contramedida" at={54} w={V ? 900 : 740} />
          <Metodo n="02" name="Ver e Agir" desc="Enxergar o desperdício · Agir" at={74} w={V ? 900 : 740} />
        </div>
      </Block>
      <Hud at={0} label="02 · EDUCAR" />
    </Stage>
  );
};

const AV = ["img/reconhecimento-grupo.jpg", "img/time-selfie.jpg", "img/reconhecimento-dupla.jpg", "img/estande-apresentacao.jpg", "img/reconhecimento-log.jpg", "img/m-evento-plateia.jpg", "img/reconhecimento-dto-solda.jpg", "img/m-feira-estande.jpg"];
/** Constelação: retratos ligados ao centro por linhas finas (todos conectados). */
const Incluir: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, H, t } = useL();
  const cx = V ? W / 2 : 1380;
  const cy = V ? 1290 : H / 2 + 20;
  const RX = V ? 400 : 400;
  const RY = V ? 400 : 340;
  const nodes = AV.map((src, i) => {
    const a = (i / AV.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.0025;
    return { src, x: cx + Math.cos(a) * RX, y: cy + Math.sin(a) * RY, at: 14 + i * 5 };
  });
  return (
    <AbsoluteFill>
      <Plate src={EDUCAR[1].src} dim={0.72} dur={dur} blur={4} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {nodes.map((n, i) => {
          const p = interpolate(frame, [n.at, n.at + 18], [0, 1], { ...cl, easing: OUT });
          const nx = nodes[(i + 1) % nodes.length];
          const q = interpolate(frame, [n.at + 10, n.at + 30], [0, 1], { ...cl, easing: OUT });
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={cx + (n.x - cx) * p} y2={cy + (n.y - cy) * p} stroke="rgba(255,255,255,.28)" strokeWidth={1.5} />
              <line x1={n.x} y1={n.y} x2={n.x + (nx.x - n.x) * q} y2={n.y + (nx.y - n.y) * q} stroke="rgba(124,198,108,.35)" strokeWidth={1.5} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={10 + 4 * Math.sin(frame / 8)} fill={C.yellow} opacity={0.9} />
        <circle cx={cx} cy={cy} r={40 + (frame % 40) * 2} fill="none" stroke={C.yellow} strokeOpacity={Math.max(0, 0.5 - (frame % 40) / 80)} />
      </svg>
      {nodes.map((n, i) => {
        const p = interpolate(frame, [n.at + 8, n.at + 22], [0, 1], { ...cl, easing: OUT });
        const s = V ? 150 : 132;
        return (
          <div key={i} style={{ position: "absolute", left: n.x - s / 2, top: n.y - s / 2, width: s, height: s, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,.85), 0 20px 50px rgba(0,0,0,.5)", opacity: p, scale: String(0.7 + 0.3 * p) }}>
            <Midia src={n.src} dur={dur} style={{ width: "100%", height: "100%" }} />
          </div>
        );
      })}
      <Block top={V ? undefined : 330} vTop={190}>
        <Eyebrow n="02" text="Como incluímos" at={2} />
        <Title lines={[[{ t: "Incluir", w: 800 }, { t: ".", w: 800, color: C.leaf }]]} size={t(190)} at={6} align={V ? "center" : "left"} />
        <Fade text={EDUCAR[1].texto} at={20} every={1.6} size={V ? 38 : 36} width={V ? 900 : 700} align={V ? "center" : "left"} />
      </Block>
      <Hud at={0} label="02 · INCLUIR" />
    </AbsoluteFill>
  );
};

const Inspirar: React.FC<D> = ({ dur }) => {
  const { V, t } = useL();
  return (
    <AbsoluteFill>
      <Plate src={EDUCAR[2].src} dim={0.42} dur={dur} zoom={[1.16, 1.03]} />
      <Rays opacity={0.3} x={V ? 50 : 70} />
      <Dust n={45} />
      <Letterbox from={-30} />
      <Block>
        <Eyebrow n="02" text="Como inspiramos" at={4} color={C.gold} />
        <Title lines={[[{ t: "Inspirar", w: 800, gold: true }]]} size={t(200)} at={8} align={V ? "center" : "left"} />
        <Fade text={EDUCAR[2].texto} at={24} every={2.4} size={V ? 52 : 50} serif color={C.white} width={V ? 900 : 900} align={V ? "center" : "left"} />
      </Block>
      <Streak at={0} y={V ? 60 : 55} />
      <Hud at={0} label="02 · INSPIRAR" />
    </AbsoluteFill>
  );
};

/** Corte suave interno (luz) entre as três partes. */
export const Parte: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 12], [0, 1], { ...cl, easing: OUT });
  return <AbsoluteFill style={{ opacity: p, filter: p < 1 ? `blur(${(1 - p) * 12}px) brightness(${1 + (1 - p) * 0.8})` : undefined, scale: String(1.04 - 0.04 * p) }}>{children}</AbsoluteFill>;
};

export const Educa: React.FC<D> = ({ dur }) => {
  const seg = Math.floor(dur / 3);
  const parts = [Educar, Incluir, Inspirar];
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {parts.map((P, i) => {
        const d = i === 2 ? dur - 2 * seg : seg;
        return (
          <Sequence key={i} from={i * seg} durationInFrames={d}>
            <Parte>
              <P dur={d} />
            </Parte>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
