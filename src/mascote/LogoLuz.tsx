/**
 * Transição com o logo CI200 (substitui a do mascote): a montagem original do logo
 * (public/ci200seq/f000–f141.png, recortada do vídeo 4K enviado, com fundo transparente)
 * é reprogramada no tempo para que cada peça surja numa palavra:
 *   Melhorar → pessoas · Avançar → engrenagem · Reconhecer → fábrica, folhas e mãos · Celebrar → "CI200".
 * Uma bolinha de luz voa até cada peça e a "acende"; no final, clarão e o logo dourado com brilho.
 * 80 quadros por palavra (um compasso da trilha da v7/v12).
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-800-normal.woff2"), weight: "800" });

export const LOGO_LUZ_DUR = 330;
const LW = 740; // tamanho dos quadros do logo
const LH = 845;
const LAST = 141;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const GOLD_TXT = "linear-gradient(180deg, #fff3c4 0%, #f2cf63 45%, #c99a2e 100%)";
const GOLD_LOGO = "linear-gradient(115deg, #b8862a 0%, #f0cd6a 30%, #fff6d8 45%, #e9c25a 58%, #a97a22 80%, #f3d47a 100%)";

const W0 = [0, 80, 160, 240];
const BURST = 256;
/** quadro local → quadro da montagem original */
const SRC_KEYS: [number, number][] = [
  [0, 0],
  [14, 6],
  [64, 48], // pessoas prontas
  [92, 50],
  [140, 72], // engrenagem pronta
  [172, 74],
  [205, 104], // fábrica e folhas
  [226, 118], // mãos
  [BURST, 119],
  [BURST + 26, LAST], // "CI200 · Continuous Improvement"
];
/** caminho da bolinha em coordenadas do logo (740×845): [quadro, x, y] */
const ORB: [number, number, number][] = [
  [0, -900, 900],
  [16, 170, 150],
  [64, 170, 150],
  [80, 260, 190],
  [94, 520, 50],
  [140, 520, 50], // (circula a engrenagem, ver abaixo)
  [160, 540, 120],
  [174, 420, 140],
  [200, 560, 250],
  [212, 70, 250],
  [226, 700, 310],
  [240, 600, 420],
  [254, 375, 640],
];

type P = { x: number; y: number };

export const LogoLuz: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: SW, height: SH } = useVideoConfig();
  const V = SH > SW;

  // posição do logo na tela
  const lh = V ? 960 : 820;
  const s = lh / LH;
  const lw = LW * s;
  const cx = V ? SW / 2 : 1330;
  const left = cx - lw / 2;
  const top = V ? 700 : (SH - lh) / 2 + 10;
  const toScreen = (x: number, y: number): P => ({ x: left + x * s, y: top + y * s });

  const srcAt = (f: number) => Math.round(interpolate(f, SRC_KEYS.map((k) => k[0]), SRC_KEYS.map((k) => k[1]), cl));
  const idx = srcAt(frame);
  const file = staticFile(`ci200seq/f${String(idx).padStart(3, "0")}.png`);

  const orbAt = (f: number): P => {
    const fs = ORB.map((k) => k[0]);
    let x = interpolate(f, fs, ORB.map((k) => k[1]), { ...cl, easing: IO });
    let y = interpolate(f, fs, ORB.map((k) => k[2]), { ...cl, easing: IO });
    if (f >= 94 && f <= 140) {
      // volta completa em torno da engrenagem enquanto ela se desenha
      const a = interpolate(f, [94, 140], [-Math.PI / 2, Math.PI * 1.5], { ...cl, easing: IO });
      x = 520 + Math.cos(a) * 125;
      y = 175 + Math.sin(a) * 125;
    }
    if (f >= 16 && f <= 64) {
      // desenha as pessoas com um pequeno laço
      const a = interpolate(f, [16, 64], [Math.PI, Math.PI * 3], { ...cl, easing: IO });
      x = 240 + Math.cos(a) * 70;
      y = 150 + Math.sin(a) * 80;
    }
    return toScreen(x, y);
  };

  const burst = interpolate(frame, [BURST, BURST + 24], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(frame, [BURST - 4, BURST, BURST + 16], [0, 1, 0], cl);
  const orbOn = frame < BURST ? interpolate(frame, [2, 10], [0, 1], cl) : 0;
  const orb = orbAt(frame);
  // brilho de "acender" a cada chegada
  const sparkAt = [16, 94, 174, 200, 226];
  const spark = sparkAt.reduce((m, a) => Math.max(m, interpolate(frame, [a, a + 3, a + 14], [0, 1, 0], cl)), 0);
  const glow = 0.35 + 0.4 * spark + 0.9 * burst * interpolate(frame, [BURST + 24, LOGO_LUZ_DUR], [1, 0.55], cl);
  const sheen = interpolate(frame, [0, LOGO_LUZ_DUR], [0, 260]);
  const center = toScreen(375, 400);
  const focusP = toScreen(380, 250);
  const camT = interpolate(frame, [236, BURST + 20], [1, 0], { ...cl, easing: IO });
  const textC = toScreen(375, 640);

  // palavra
  const wi = Math.min(3, Math.floor(frame / 80));
  const wl = frame - W0[wi];
  const wordIn = interpolate(wl, [0, 10], [0, 1], { ...cl, easing: OUT });
  const wordOut = wi < 3 ? interpolate(wl, [70, 80], [0, 1], cl) : 0;
  const words = ["Melhorar", "Avançar", "Reconhecer", "Celebrar"];

  const mask: React.CSSProperties = { WebkitMaskImage: `url(${file})`, maskImage: `url(${file})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" };

  return (
    <AbsoluteFill style={{ background: "#050b07", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 55% at ${(center.x / SW) * 100}% ${(center.y / SH) * 100}%, rgba(54,124,43,${0.2 + 0.25 * burst}), transparent 70%)` }} />
      {/* feixes de luz no final */}
      {burst > 0 ? (
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.45 * burst }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: center.x, top: -200, width: 180 + (i % 3) * 80, height: SH * 1.6, translate: "-50% 0", transformOrigin: "50% 0", rotate: `${-27 + i * 9 + Math.sin(frame / 40 + i) * 1.5}deg`, background: "linear-gradient(180deg, rgba(255,232,170,.5), transparent 70%)", filter: "blur(30px)" }} />
          ))}
        </AbsoluteFill>
      ) : null}
      {/* poeira dourada */}
      {Array.from({ length: 70 }, (_, i) => {
        const r = (k: string) => random(`c${k}${i}`);
        const x = r("x") * SW + Math.sin(frame / 40 + i) * 20;
        const y = ((((r("y") * SH - frame * (0.3 + r("v")) * 0.8) % SH) + SH) % SH);
        const o = (0.2 + 0.5 * r("o")) * (0.5 + 0.5 * Math.sin(frame / 9 + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3 + r("s") * 4, height: 3 + r("s") * 4, borderRadius: "50%", background: `rgba(255,220,130,${o})`, boxShadow: "0 0 8px rgba(255,210,110,.6)" }} />;
      })}

      {/* câmera: perto dos ícones durante a montagem, abre para o logo inteiro no "CI200" */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${focusP.x}px ${focusP.y}px`, transform: `translate(${camT * (cx - focusP.x)}px, ${camT * (SH * (V ? 0.42 : 0.5) - focusP.y)}px) scale(${1 + camT * 0.38})` }}>
      {/* garante que o quadro do logo esteja carregado antes da captura (a máscara CSS não espera sozinha) */}
      <Img src={file} style={{ position: "absolute", width: 2, height: 2, opacity: 0 }} />
      {/* logo: brilho (camada desfocada) + traço dourado nítido */}
      <div style={{ position: "absolute", left, top, width: lw, height: lh, scale: String(1 + 0.04 * burst + interpolate(frame, [BURST + 24, LOGO_LUZ_DUR], [0, 0.02], cl)) }}>
        <div style={{ position: "absolute", inset: 0, ...mask, background: "#ffd86a", filter: `blur(${10 + 14 * glow}px)`, opacity: Math.min(1, glow) }} />
        <div style={{ position: "absolute", inset: 0, ...mask, backgroundImage: GOLD_LOGO, backgroundSize: "300% 100%", backgroundPosition: `${sheen}% 0`, filter: `brightness(${1 + flash * 1.5 + spark * 0.4})` }} />
      </div>

      {/* cauda de cometa + bolinha */}
      {orbOn > 0
        ? Array.from({ length: 22 }, (_, k) => {
            const p = orbAt(frame - k * 0.8);
            const f = 1 - k / 22;
            const size = 34 * f + 4;
            return <div key={k} style={{ position: "absolute", left: p.x - size / 2, top: p.y - size / 2, width: size, height: size, borderRadius: "50%", background: `rgba(255,${200 + 40 * f},${110 + 80 * f},${0.5 * f * f * orbOn})`, filter: `blur(${4 + (1 - f) * 8}px)` }} />;
          })
        : null}
      {orbOn > 0 ? (
        <>
          <div style={{ position: "absolute", left: orb.x - 120, top: orb.y - 120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,170,.55), rgba(255,210,90,.15) 40%, transparent 70%)", opacity: orbOn, scale: String(1 + 0.15 * Math.sin(frame / 3) + spark * 0.6) }} />
          <div style={{ position: "absolute", left: orb.x - 14, top: orb.y - 14, width: 28, height: 28, borderRadius: "50%", background: "#fffdf4", boxShadow: "0 0 18px 6px rgba(255,240,190,.95), 0 0 50px 18px rgba(255,214,90,.55)", opacity: orbOn }} />
        </>
      ) : null}

      </div>
      {/* clarão, onda e faíscas quando o "CI200" se forma */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${(textC.x / SW) * 100}% ${(textC.y / SH) * 100}%, rgba(255,246,214,${flash}), transparent ${30 + 50 * burst}%)`, pointerEvents: "none" }} />
      {burst > 0 && burst < 1 ? <div style={{ position: "absolute", left: textC.x - 900 * burst, top: textC.y - 900 * burst, width: 1800 * burst, height: 1800 * burst, borderRadius: "50%", border: "3px solid rgba(255,230,150,.6)", opacity: 1 - burst }} /> : null}
      {frame >= BURST
        ? Array.from({ length: 60 }, (_, i) => {
            const t = frame - BURST;
            const a = random(`sa${i}`) * Math.PI * 2;
            const v = 6 + random(`sv${i}`) * 16;
            const x = textC.x + Math.cos(a) * v * t * (1 - t / 140);
            const y = textC.y + Math.sin(a) * v * t * (1 - t / 140) + 0.08 * t * t;
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: 5, height: 5, borderRadius: "50%", background: "#ffe9a8", boxShadow: "0 0 10px #ffd35a", opacity: interpolate(t, [0, 50], [1, 0], cl) }} />;
          })
        : null}

      {/* sons (pacote enviado: public/sfx) */}
      {sparkAt.map((a, i) => (
        <Sequence key={i} from={a} durationInFrames={40} layout="none">
          <Audio src={staticFile("sfx/glass_002.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={BURST} durationInFrames={70} layout="none">
        <Audio src={staticFile("sfx/impactBell_heavy_000.wav")} volume={0.7} />
        <Audio src={staticFile("sfx/lowFrequency_explosion_000.wav")} volume={0.5} />
      </Sequence>
      {/* palavra */}
      <div style={{ position: "absolute", left: V ? 0 : 110, right: V ? 0 : undefined, top: V ? 260 : 0, height: V ? undefined : SH, width: V ? undefined : 760, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 150, letterSpacing: "0.02em", textTransform: "uppercase", backgroundImage: GOLD_TXT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: wordIn * (1 - wordOut), filter: `blur(${(1 - wordIn) * 14 + wordOut * 16}px) drop-shadow(0 4px 24px rgba(242,207,99,.25))`, scale: String(1.08 - 0.08 * wordIn) }}>
          {words[wi]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
