/**
 * Protótipo: "bolinha de luz" que voa deixando rastro, desenha o contorno do mascote (Jornada Lean JDBM)
 * e, no final, o personagem se forma. Sincronizado com as 4 palavras (Melhorar · Avançar · Reconhecer · Celebrar),
 * 80 quadros cada (um compasso da trilha da v7).
 * Imagem provisória (recortada da prévia v12): public/mascote/jornada-lean-provisorio.png — trocar pelo arquivo original.
 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({ family: "Barlow Condensed", url: staticFile("fonts/BarlowCondensed-800-normal.woff2"), weight: "800" });

export const MASCOTE_DUR = 330;
const IMG = "mascote/jornada-lean-provisorio.png";
const IW = 906;
const IH = 1260;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const GOLD = "linear-gradient(180deg, #fff3c4 0%, #f2cf63 45%, #c99a2e 100%)";

// tempos (quadros locais)
const W = [0, 80, 160, 240]; // Melhorar, Avançar, Reconhecer, Celebrar
const T_HEAD = [92, 150]; // contorno da cabeça
const T_BODY = [168, 222]; // contorno do corpo
const T_INNER = [222, 238]; // volta no círculo "Pessoas"
const T_CENTER = [242, 262]; // vai ao centro
const T_BURST = 262; // clarão → personagem se forma

type P = { x: number; y: number };
const lerp = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** Polilinha com comprimento acumulado: ponto em fração t e "d" do SVG. */
const poly = (pts: P[]) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = seg.reduce((a, b) => a + b, 0);
  const at = (t: number): P => {
    let d = Math.max(0, Math.min(1, t)) * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i]) return lerp(pts[i], pts[i + 1], seg[i] ? d / seg[i] : 0);
      d -= seg[i];
    }
    return pts[pts.length - 1];
  };
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return { at, d };
};
const circlePts = (c: P, r: number, a0: number, a1: number, n = 140): P[] => Array.from({ length: n + 1 }, (_, i) => {
  const a = a0 + ((a1 - a0) * i) / n;
  return { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
});

export const MascoteLuz: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: SW, height: SH } = useVideoConfig();
  const V = SH > SW;

  // ---------- geometria do mascote na tela
  const mh = V ? 1000 : 860;
  const s = mh / IH;
  const mw = IW * s;
  const mx = V ? SW / 2 : 1370; // centro horizontal da cabeça
  const left = mx - 453 * s;
  const top = V ? 760 : 110;
  const S = (x: number, y: number): P => ({ x: left + x * s, y: top + y * s });
  const head = { c: S(453, 456), r: 432 * s };
  const inner = { c: S(453, 470), r: 175 * s };
  // cabeça: começa na junção esquerda e dá a volta por cima até a junção direita (e fecha)
  const a0 = (147 * Math.PI) / 180;
  const headPath = poly(circlePts(head.c, head.r, a0, a0 + Math.PI * 2));
  const bodyPath = poly([S(90, 691), S(156, 1086), S(162, 1248), S(744, 1248), S(750, 1086), S(816, 691)]);
  const innerPath = poly(circlePts(inner.c, inner.r, -Math.PI / 2, Math.PI * 1.5, 90));

  // ---------- trajetória da bolinha
  const flight = (t: number): P => {
    // entra pela esquerda/baixo fazendo curvas até a junção esquerda da cabeça
    const start = V ? { x: -80, y: 1700 } : { x: -80, y: 900 };
    const end = headPath.at(0);
    const k = IO(t);
    const base = lerp(start, end, k);
    return { x: base.x + Math.sin(k * Math.PI * 2.2) * (V ? 160 : 140) * (1 - k), y: base.y - Math.sin(k * Math.PI) * (V ? 420 : 300) };
  };
  const orbAt = (f: number): P => {
    if (f < W[1] + 12) return flight(interpolate(f, [8, W[1] + 12], [0, 1], cl));
    if (f < T_HEAD[1]) return headPath.at(interpolate(f, [T_HEAD[0], T_HEAD[1]], [0, 1], { ...cl, easing: IO }));
    if (f < T_BODY[0]) return lerp(headPath.at(1), bodyPath.at(0), interpolate(f, [T_HEAD[1], T_BODY[0]], [0, 1], { ...cl, easing: IO }));
    if (f < T_BODY[1]) return bodyPath.at(interpolate(f, [T_BODY[0], T_BODY[1]], [0, 1], { ...cl, easing: IO }));
    if (f < T_INNER[1]) return lerp(bodyPath.at(1), innerPath.at(interpolate(f, [T_INNER[0], T_INNER[1]], [0, 1], cl)), interpolate(f, [T_INNER[0], T_INNER[0] + 8], [0, 1], cl));
    return lerp(innerPath.at(1), inner.c, interpolate(f, [T_CENTER[0], T_CENTER[1]], [0, 1], { ...cl, easing: IO }));
  };

  const pHead = interpolate(frame, [T_HEAD[0], T_HEAD[1]], [0, 1], { ...cl, easing: IO });
  const pBody = interpolate(frame, [T_BODY[0], T_BODY[1]], [0, 1], { ...cl, easing: IO });
  const pInner = interpolate(frame, [T_INNER[0], T_INNER[1]], [0, 1], cl);
  const burst = interpolate(frame, [T_BURST, T_BURST + 22], [0, 1], { ...cl, easing: OUT });
  const linesFade = interpolate(frame, [T_BURST, T_BURST + 26], [1, 0], cl);
  const orbOn = frame < T_BURST ? interpolate(frame, [6, 14], [0, 1], cl) : 0;
  const orb = orbAt(frame);
  const pulse = 1 + 0.15 * Math.sin(frame / 3);

  // ---------- palavra (lado esquerdo no 16:9; em cima no 9:16)
  const wi = Math.min(3, Math.floor(frame / 80));
  const wl = frame - W[wi];
  const wordIn = interpolate(wl, [0, 10], [0, 1], { ...cl, easing: OUT });
  const wordOut = wi < 3 ? interpolate(wl, [70, 80], [0, 1], cl) : 0;
  const words = ["Melhorar", "Avançar", "Reconhecer", "Celebrar"];

  const glowLine = (d: string, p: number, w: number) =>
    p > 0 ? (
      <>
        <path d={d} pathLength={1} strokeDasharray={`${p} 1`} fill="none" stroke="rgba(255,226,120,.35)" strokeWidth={w * 5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "blur(10px)" }} />
        <path d={d} pathLength={1} strokeDasharray={`${p} 1`} fill="none" stroke="#fff2c2" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px #ffd860)" }} />
      </>
    ) : null;

  return (
    <AbsoluteFill style={{ background: "#050b07", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 60% at ${(mx / SW) * 100}% ${((top + mh / 2) / SH) * 100}%, rgba(54,124,43,${0.18 + 0.25 * burst}), transparent 70%)` }} />
      {/* poeira dourada */}
      {Array.from({ length: 70 }, (_, i) => {
        const r = (k: string) => random(`m${k}${i}`);
        const x = r("x") * SW + Math.sin(frame / 40 + i) * 20;
        const y = ((r("y") * SH - frame * (0.3 + r("v")) * 0.8) % SH + SH) % SH;
        const o = (0.2 + 0.5 * r("o")) * (0.5 + 0.5 * Math.sin(frame / 9 + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3 + r("s") * 4, height: 3 + r("s") * 4, borderRadius: "50%", background: `rgba(255,220,130,${o})`, boxShadow: "0 0 8px rgba(255,210,110,.6)" }} />;
      })}

      {/* personagem se formando: revelação radial a partir do centro + brilho */}
      {frame >= T_BURST - 2 ? (
        <div style={{ position: "absolute", left, top, width: mw, height: mh, WebkitMaskImage: `radial-gradient(circle at 50% 37%, #000 ${burst * 85}%, transparent ${burst * 85 + 14}%)`, maskImage: `radial-gradient(circle at 50% 37%, #000 ${burst * 85}%, transparent ${burst * 85 + 14}%)`, scale: String(0.94 + 0.06 * burst + interpolate(frame, [T_BURST + 22, MASCOTE_DUR], [0, 0.02], cl)), filter: `brightness(${1 + (1 - burst) * 1.6}) drop-shadow(0 0 ${30 + 30 * (1 - burst)}px rgba(255,220,110,.45))` }}>
          <Img src={staticFile(IMG)} style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}

      {/* rastro de luz que desenha o contorno */}
      <svg width={SW} height={SH} style={{ position: "absolute", inset: 0, opacity: linesFade, overflow: "visible" }}>
        {glowLine(headPath.d, pHead, 4)}
        {glowLine(bodyPath.d, pBody, 4)}
        {glowLine(innerPath.d, pInner, 3)}
      </svg>

      {/* cauda de cometa: posições recentes da bolinha */}
      {orbOn > 0
        ? Array.from({ length: 22 }, (_, k) => {
            const p = orbAt(frame - k * 0.8);
            const f = 1 - k / 22;
            const size = 34 * f + 4;
            return <div key={k} style={{ position: "absolute", left: p.x - size / 2, top: p.y - size / 2, width: size, height: size, borderRadius: "50%", background: `rgba(255,${200 + 40 * f},${110 + 80 * f},${0.5 * f * f * orbOn})`, filter: `blur(${4 + (1 - f) * 8}px)` }} />;
          })
        : null}
      {/* a bolinha */}
      {orbOn > 0 ? (
        <>
          <div style={{ position: "absolute", left: orb.x - 120, top: orb.y - 120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,170,.55), rgba(255,210,90,.15) 40%, transparent 70%)", opacity: orbOn, scale: String(pulse) }} />
          <div style={{ position: "absolute", left: orb.x - 14, top: orb.y - 14, width: 28, height: 28, borderRadius: "50%", background: "#fffdf4", boxShadow: "0 0 18px 6px rgba(255,240,190,.95), 0 0 50px 18px rgba(255,214,90,.55)", opacity: orbOn }} />
        </>
      ) : null}

      {/* clarão do nascimento */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${(inner.c.x / SW) * 100}% ${(inner.c.y / SH) * 100}%, rgba(255,246,214,${interpolate(frame, [T_BURST - 4, T_BURST, T_BURST + 18], [0, 1, 0], cl)}), transparent ${30 + 50 * burst}%)`, pointerEvents: "none" }} />
      {/* anel de onda de choque */}
      {burst > 0 && burst < 1 ? <div style={{ position: "absolute", left: inner.c.x - 900 * burst, top: inner.c.y - 900 * burst, width: 1800 * burst, height: 1800 * burst, borderRadius: "50%", border: "3px solid rgba(255,230,150,.6)", opacity: 1 - burst }} /> : null}
      {/* faíscas */}
      {frame >= T_BURST
        ? Array.from({ length: 60 }, (_, i) => {
            const t = frame - T_BURST;
            const a = random(`sa${i}`) * Math.PI * 2;
            const v = 6 + random(`sv${i}`) * 16;
            const x = inner.c.x + Math.cos(a) * v * t * (1 - t / 140);
            const y = inner.c.y + Math.sin(a) * v * t * (1 - t / 140) + 0.08 * t * t;
            const o = interpolate(t, [0, 50], [1, 0], cl);
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: 5, height: 5, borderRadius: "50%", background: "#ffe9a8", boxShadow: "0 0 10px #ffd35a", opacity: o }} />;
          })
        : null}

      {/* palavra */}
      <div style={{ position: "absolute", left: V ? 0 : 120, right: V ? 0 : undefined, top: V ? 250 : 0, height: V ? undefined : SH, width: V ? undefined : 820, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: V ? 150 : 150, letterSpacing: "0.02em", textTransform: "uppercase", backgroundImage: GOLD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: wordIn * (1 - wordOut), filter: `blur(${(1 - wordIn) * 14 + wordOut * 16}px) drop-shadow(0 4px 24px rgba(242,207,99,.25))`, scale: String(1.08 - 0.08 * wordIn) }}>
          {words[wi]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
