/**
 * V8 — kit da linguagem nova (referências de motion "kinetic"):
 * campos de cor sólida, palavras gigantes, formas que se transformam, órbitas, grade que enche,
 * rolo de anos, anel 3D de texto, cursor clicando em cartões. Tudo responsivo (16:9 e 9:16).
 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import ASSETS from "./assets.json";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });

export const F = "'Inter', sans-serif";
export const C = {
  ink: "#0a0b0a",
  black: "#050605",
  paper: "#f2f3ee",
  green: "#367c2b", // verde John Deere
  deep: "#0f2a0c",
  neon: "#6be05a",
  lime: "#c8f54a",
  yellow: "#ffde00",
  white: "#ffffff",
};
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);

/** 120 BPM a 30 fps: 1 tempo = 15 quadros, 1 compasso = 60 quadros. */
export const BEAT = 15;
export const BAR = 60;

/** Layout responsivo: V = vertical (9:16). t(n) reduz títulos que ocupam a largura. */
export const useL = () => {
  const { width, height } = useVideoConfig();
  const V = height > width;
  return { W: width, H: height, V, t: (n: number) => (V ? n * 0.6 : n) };
};

export const fmtBR = (v: number, dec = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ------------------------------------------------------------------ fundo
const Grain: React.FC<{ o?: number }> = ({ o = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='${frame % 8}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
};

/** Campo de cor sólida com leve vinheta e granulação (base de todas as cenas). */
export const Field: React.FC<{ bg: string; children?: React.ReactNode; glow?: string; vignette?: boolean }> = ({ bg, children, glow, vignette = true }) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
    {glow ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${glow}, transparent 70%)` }} /> : null}
    {children}
    {vignette ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.28))", pointerEvents: "none" }} /> : null}
    <Grain />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ mídia (com espaço reservado se o arquivo ainda não estiver em public/)
const HAS = new Set<string>(ASSETS as string[]);
export const hasAsset = (src: string) => HAS.has(src);

export const Midia: React.FC<{ src: string; style?: React.CSSProperties; zoom?: [number, number]; dur?: number; startFrom?: number; dim?: number }> = ({ src, style, zoom = [1.08, 1], dur = 90, startFrom = 0, dim = 0 }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], zoom, cl);
  const isVid = src.endsWith(".mp4");
  const base: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(z) };
  return (
    <div style={{ position: "relative", overflow: "hidden", background: C.deep, ...style }}>
      {!HAS.has(src) ? (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.green}, ${C.deep})`, alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.55)", letterSpacing: "0.1em" }}>{src.split("/").pop()}</div>
        </AbsoluteFill>
      ) : isVid ? (
        <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={base} />
      ) : (
        <Img src={staticFile(src)} style={base} />
      )}
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(5,6,5,${dim})` }} /> : null}
    </div>
  );
};

// ------------------------------------------------------------------ texto cinético
type WordStyle = { size: number; weight?: number; color?: string; italic?: boolean; font?: string; spacing?: string };

/** Palavra que "bate" na tela: entra grande e desfocada e assenta (pop). */
export const Pop: React.FC<WordStyle & { text: React.ReactNode; at?: number; from?: number; style?: React.CSSProperties }> = ({ text, at = 0, from = 1.35, size, weight = 800, color = C.white, italic, spacing = "-0.055em", style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 8], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ fontFamily: F, fontSize: size, fontWeight: weight, color, fontStyle: italic ? "italic" : undefined, letterSpacing: spacing, lineHeight: 0.95, opacity: t, scale: String(from + (1 - from) * t), filter: t < 1 ? `blur(${(1 - t) * 18}px)` : undefined, whiteSpace: "nowrap", ...style }}>
      {text}
    </div>
  );
};

/** Texto revelado de baixo para cima por máscara, palavra a palavra. */
export const Rise: React.FC<WordStyle & { text: string; at?: number; every?: number; accent?: number[]; accentColor?: string; align?: "center" | "left"; width?: number; style?: React.CSSProperties }> = ({ text, at = 0, every = 3, size, weight = 800, color = C.white, accent = [], accentColor = C.neon, align = "center", width, spacing = "-0.05em", style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24, width, fontFamily: F, fontSize: size, fontWeight: weight, letterSpacing: spacing, lineHeight: 1.02, color, ...style }}>
      {text.split(" ").map((w, i) => {
        const t = interpolate(frame, [at + i * every, at + i * every + 10], [0, 1], { ...cl, easing: OUT });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.1, marginBottom: -size * 0.1 }}>
            <span style={{ display: "inline-block", translate: `0 ${(1 - t) * 110}%`, rotate: `${(1 - t) * 6}deg`, color: accent.includes(i) ? accentColor : undefined }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Letras entrando uma a uma com espaçamento que fecha (tracking). */
export const Chars: React.FC<WordStyle & { text: string; at?: number; every?: number; style?: React.CSSProperties }> = ({ text, at = 0, every = 1.5, size, weight = 800, color = C.white, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", fontFamily: F, fontSize: size, fontWeight: weight, color, letterSpacing: "-0.05em", whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => {
        const t = interpolate(frame, [at + i * every, at + i * every + 9], [0, 1], { ...cl, easing: OUT });
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, translate: `0 ${(1 - t) * 0.5}em`, filter: t < 1 ? `blur(${(1 - t) * 10}px)` : undefined }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Etiqueta em pílula (selo, tag). */
export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; at?: number; rot?: number; style?: React.CSSProperties }> = ({ children, bg = C.yellow, color = C.ink, size = 40, at = 0, rot = -4, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 180 } });
  return (
    <div style={{ display: "inline-block", fontFamily: F, fontWeight: 800, fontSize: size, padding: `${size * 0.22}px ${size * 0.55}px`, borderRadius: size, background: bg, color, scale: String(s), rotate: `${rot * s}deg`, whiteSpace: "nowrap", letterSpacing: "-0.02em", ...style }}>
      {children}
    </div>
  );
};

/** Contador numérico com easing forte. */
export const Count: React.FC<{ to: number; at: number; dur?: number; dec?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ to, at, dur = 36, dec = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [0, to], { ...cl, easing: OUT });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {fmtBR(v, dec)}
      {suffix}
    </span>
  );
};

// ------------------------------------------------------------------ formas
/** Forma orgânica que se transforma: 0 = círculo, 1 = estrela, 2 = flor, 3 = mancha. */
export const Morph: React.FC<{ size: number; color: string; keys: [number, number][]; spin?: number; blur?: number; style?: React.CSSProperties }> = ({ size, color, keys, spin = 0.6, blur = 0, style }) => {
  const frame = useCurrentFrame();
  const shapeAt = interpolate(frame, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...cl, easing: INOUT });
  const N = 160;
  const r = (th: number, k: number) => {
    const circle = 1;
    const star = 0.72 + 0.28 * Math.pow(Math.abs(Math.cos(2 * th)), 0.6) * (Math.cos(4 * th) > 0 ? 1 : 0.55);
    const flower = 0.8 + 0.2 * Math.cos(6 * th);
    const blob = 0.86 + 0.08 * Math.sin(3 * th + frame / 14) + 0.06 * Math.cos(5 * th - frame / 20);
    const L = [circle, star, flower, blob];
    const i = Math.floor(k);
    const f = k - i;
    return L[Math.min(3, i)] * (1 - f) + L[Math.min(3, i + 1)] * f;
  };
  const pts = Array.from({ length: N }, (_, i) => {
    const th = (i / N) * Math.PI * 2;
    const R = (size / 2) * r(th, shapeAt);
    return `${size / 2 + R * Math.cos(th)},${size / 2 + R * Math.sin(th)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} style={{ overflow: "visible", rotate: `${frame * spin}deg`, filter: blur ? `blur(${blur}px)` : undefined, ...style }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
};

/** Estrela de 4 pontas desfocada que atravessa a tela (elemento decorativo das referências). */
export const Sparkle: React.FC<{ x: number; y: number; size: number; color?: string; blur?: number; rot?: number; drift?: [number, number] }> = ({ x, y, size, color = C.neon, blur = 6, rot = 0.4, drift = [0, 0] }) => {
  const frame = useCurrentFrame();
  const s = size;
  const d = `M ${s / 2} 0 C ${s * 0.56} ${s * 0.36} ${s * 0.64} ${s * 0.44} ${s} ${s / 2} C ${s * 0.64} ${s * 0.56} ${s * 0.56} ${s * 0.64} ${s / 2} ${s} C ${s * 0.44} ${s * 0.64} ${s * 0.36} ${s * 0.56} 0 ${s / 2} C ${s * 0.36} ${s * 0.44} ${s * 0.44} ${s * 0.36} ${s / 2} 0 Z`;
  return (
    <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2 + frame * drift[0], top: y - s / 2 + frame * drift[1], rotate: `${frame * rot}deg`, filter: `blur(${blur}px)` }}>
      <path d={d} fill={color} />
    </svg>
  );
};

// ------------------------------------------------------------------ anel 3D de texto (abertura)
export const Ring3D: React.FC<{ text: string; radius: number; size: number; color?: string; speed?: number; tilt?: number }> = ({ text, radius, size, color = C.white, speed = 1.2, tilt = -12 }) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  const step = 360 / chars.length;
  return (
    <div style={{ perspective: 1800, width: 0, height: 0 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg) rotateY(${-frame * speed}deg)` }}>
        {chars.map((ch, i) => {
          const ang = i * step;
          const rel = (((ang - frame * speed) % 360) + 360) % 360; // 0 = de frente
          const front = Math.cos((rel * Math.PI) / 180);
          return (
            <div key={i} style={{ position: "absolute", left: -size * 0.3, top: -size / 2, fontFamily: F, fontWeight: 800, fontSize: size, color, opacity: 0.25 + 0.75 * Math.max(0, front), transform: `rotateY(${ang}deg) translateZ(${radius}px)`, backfaceVisibility: "visible", whiteSpace: "pre" }}>
              {ch}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ cursor
export const Cursor: React.FC<{ path: [number, number, number][]; clicks?: number[]; dark?: boolean }> = ({ path, clicks = [], dark }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p[0]);
  const x = interpolate(frame, fs, path.map((p) => p[1]), { ...cl, easing: INOUT });
  const y = interpolate(frame, fs, path.map((p) => p[2]), { ...cl, easing: INOUT });
  const press = clicks.reduce((m, c) => Math.max(m, interpolate(frame, [c - 3, c, c + 5], [0, 1, 0], cl)), 0);
  const ring = clicks.map((c) => interpolate(frame, [c, c + 14], [0, 1], cl)).find((v) => v > 0 && v < 1) ?? 0;
  const o = interpolate(frame, [fs[0], fs[0] + 6], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, zIndex: 50 }}>
      {ring > 0 ? <div style={{ position: "absolute", left: -40 * ring, top: -40 * ring, width: 80 * ring, height: 80 * ring, borderRadius: "50%", border: `3px solid ${dark ? "#fff" : C.green}`, opacity: 1 - ring }} /> : null}
      <svg width={44} height={52} viewBox="0 0 22 26" style={{ scale: String(1 - press * 0.18), transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.35))" }}>
        <path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.5 15 L17 15 Z" fill={dark ? "#fff" : C.ink} stroke={dark ? C.ink : "#fff"} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ------------------------------------------------------------------ transições de corte
/** Envolve um plano: entra com zoom-through/whip/slam e sai rápido. */
export const Shot: React.FC<{ dur: number; enter?: "slam" | "whip" | "zoom" | "up" | "cut"; exit?: "zoom" | "whip" | "cut"; children: React.ReactNode }> = ({ dur, enter = "cut", exit = "cut", children }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 7], [1, 0], { ...cl, easing: OUT });
  const b = interpolate(frame, [dur - 5, dur], [0, 1], { ...cl, easing: IN });
  let tr = "";
  let blur = 0;
  if (enter === "slam") (tr += ` scale(${1 + 0.35 * a})`), (blur += a * 16);
  if (enter === "zoom") (tr += ` scale(${1 - 0.3 * a})`), (blur += a * 20);
  if (enter === "whip") (tr += ` translateX(${a * 70}%)`), (blur += a * 40);
  if (enter === "up") (tr += ` translateY(${a * 60}%)`), (blur += a * 30);
  if (exit === "zoom") (tr += ` scale(${1 + 1.6 * b})`), (blur += b * 24);
  if (exit === "whip") (tr += ` translateX(${-b * 70}%)`), (blur += b * 40);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: tr || undefined, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Clarão branco curto (usado nas batidas fortes). */
export const Flash: React.FC<{ at?: number; len?: number; color?: string; max?: number }> = ({ at = 0, len = 8, color = "#fff", max = 0.85 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + len], [0, max, 0], cl);
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} /> : null;
};

/** Partículas (confete fino) para celebração. */
export const Burst: React.FC<{ at: number; n?: number; colors?: string[] }> = ({ at, n = 120, colors = [C.neon, C.yellow, "#fff", C.lime] }) => {
  const frame = useCurrentFrame();
  const { W, H } = useL();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const sp = 10 + random(`s${i}`) * 34;
        const x = W / 2 + Math.cos(ang) * sp * t * 0.9;
        const y = H / 2 + Math.sin(ang) * sp * t * 0.9 + 0.35 * t * t;
        const o = interpolate(t, [0, 40, 70], [1, 1, 0], cl);
        const w = 8 + random(`w${i}`) * 14;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.45, background: colors[i % colors.length], opacity: o, rotate: `${t * 12 + i * 37}deg`, borderRadius: 2 }} />;
      })}
    </AbsoluteFill>
  );
};
