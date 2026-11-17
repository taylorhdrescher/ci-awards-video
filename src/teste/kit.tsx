import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, random, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });

export const F = "'Inter', sans-serif";
export const K = {
  paper: "#f4f5f1",
  paper2: "#e8eae4",
  ink: "#0b0d0b",
  black: "#030403",
  green: "#2f8f22",
  jd: "#367c2b",
  neon: "#58d64a",
  yellow: "#ffde00",
  gray: "#8a8f88",
  orange: "#ff7a1a",
};
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Palavras entrando uma a uma com desfoque (estilo das referências). */
export const BlurWords: React.FC<{
  text: string;
  start?: number;
  every?: number;
  size?: number;
  weight?: number;
  color?: string;
  accent?: number[];
  accentColor?: string;
  align?: "center" | "left";
  width?: number;
  upper?: boolean;
  strike?: number;
  strikeAt?: number;
  style?: React.CSSProperties;
}> = ({ strike = -1, strikeAt = 0, text, start = 0, every = 5, size = 110, weight = 700, color = K.ink, accent = [], accentColor = K.green, align = "center", width = 1600, upper, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: F,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: "-0.045em",
        color,
        width,
        textAlign: align,
        textTransform: upper ? "uppercase" : undefined,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t = interpolate(frame, [start + i * every, start + i * every + 12], [0, 1], { ...cl, easing: OUT });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              opacity: t,
              filter: `blur(${(1 - t) * 14}px)`,
              translate: `0 ${(1 - t) * size * 0.35}px`,
              scale: String(0.92 + 0.08 * t),
              color: accent.includes(i) ? accentColor : undefined,
            }}
          >
            {w}
            {i === strike ? (
              <span style={{ position: "absolute", left: -6, right: -6, top: "54%", height: size * 0.08, borderRadius: 6, background: color, scale: `${interpolate(frame, [strikeAt, strikeAt + 10], [0, 1], { ...cl, easing: OUT })} 1`, transformOrigin: "left" }} />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/** Saída rápida com desfoque de movimento (whip) nos últimos frames da cena. */
export const useWhipOut = (dur: number, len = 7, dir: "up" | "left" = "left"): React.CSSProperties => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [dur - len, dur], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  if (t <= 0) return {};
  return {
    translate: dir === "left" ? `${-t * 500}px 0` : `0 ${-t * 300}px`,
    filter: `blur(${t * 30}px)`,
    opacity: 1 - t * 0.6,
  };
};
export const useWhipIn = (len = 8, dir: "up" | "left" = "left"): React.CSSProperties => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, len], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  if (t <= 0) return {};
  return { translate: dir === "left" ? `${t * 500}px 0` : `0 ${t * 300}px`, filter: `blur(${t * 30}px)` };
};

export const Paper: React.FC<{ glow?: string; children?: React.ReactNode; tone?: string }> = ({ glow, children, tone = K.paper }) => (
  <AbsoluteFill style={{ background: tone, overflow: "hidden" }}>
    {glow ? (
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 50% at 50% 55%, ${glow}, transparent 70%)` }} />
    ) : null}
    <Noise />
    {children}
  </AbsoluteFill>
);

/** fundo-lento.mp4 = fundo.mp4 a 60% da velocidade (quadros interpolados): "at" continua em segundos do fundo.mp4 original. */
export const FUNDO_LENTO = 5 / 3;
/** Imagens de força da fábrica (vid/fundo.mp4, o mesmo fundo do vídeo antigo), escurecidas e com zoom lento. */
export const Footage: React.FC<{ at: number; dim?: number }> = ({ at, dim = 0.5 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("vid/fundo-lento.mp4")} startFrom={Math.round(at * 30 * FUNDO_LENTO)} muted style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.04 + frame * 0.0006), filter: "saturate(.85) contrast(1.08)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(3,4,3,${dim}), rgba(3,4,3,${Math.min(1, dim + 0.25)}))` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,.6))" }} />
    </AbsoluteFill>
  );
};

export const Dark: React.FC<{ children?: React.ReactNode; glow?: string; video?: number; dim?: number }> = ({ children, glow, video, dim }) => (
  <AbsoluteFill style={{ background: K.black, overflow: "hidden" }}>
    {video !== undefined ? <Footage at={video} dim={dim} /> : null}
    {glow ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 60%, ${glow}, transparent 70%)` }} /> : null}
    <Noise dark />
    {children}
  </AbsoluteFill>
);

const Noise: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: dark ? 0.06 : 0.05,
        mixBlendMode: dark ? "screen" : "multiply",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${frame % 6}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
};

/** Feixe de luz (lens flare) que atravessa a tela. */
export const Flare: React.FC<{ x: number; y: number; scale?: number; color?: string; opacity?: number }> = ({ x, y, scale = 1, color = "#bfffb0", opacity = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = 0.85 + 0.15 * Math.sin(frame / 3);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity, mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: -1200 * scale, top: -3 * scale, width: 2400 * scale, height: 6 * scale, background: `linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent)`, filter: "blur(2px)", opacity: 0.7 * pulse }} />
      <div style={{ position: "absolute", left: -160 * scale, top: -160 * scale, width: 320 * scale, height: 320 * scale, borderRadius: "50%", background: `radial-gradient(circle, #fff 0%, ${color} 12%, transparent 60%)`, opacity: pulse }} />
      <div style={{ position: "absolute", left: -500 * scale, top: -500 * scale, width: 1000 * scale, height: 1000 * scale, borderRadius: "50%", background: `radial-gradient(circle, ${color}55 0%, transparent 60%)` }} />
    </div>
  );
};

/** Cursor de mouse com clique. */
export const Cursor: React.FC<{ path: [number, number, number][]; clicks?: number[]; dark?: boolean }> = ({ path, clicks = [], dark }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p[0]);
  const x = interpolate(frame, fs, path.map((p) => p[1]), { ...cl, easing: INOUT });
  const y = interpolate(frame, fs, path.map((p) => p[2]), { ...cl, easing: INOUT });
  let press = 0;
  let ripple = -1;
  for (const c of clicks) {
    press = Math.max(press, interpolate(frame, [c - 3, c, c + 5], [0, 1, 0], cl));
    if (frame >= c && frame < c + 18) ripple = (frame - c) / 18;
  }
  const appear = interpolate(frame, [fs[0], fs[0] + 6], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: appear, zIndex: 50 }}>
      {ripple >= 0 ? (
        <div style={{ position: "absolute", left: -40 * ripple - 4, top: -40 * ripple - 4, width: 80 * ripple + 8, height: 80 * ripple + 8, borderRadius: "50%", border: `3px solid ${K.green}`, opacity: 1 - ripple }} />
      ) : null}
      <svg width={54} height={54} viewBox="0 0 24 24" style={{ scale: String(1 - press * 0.18), transformOrigin: "0 0", filter: "drop-shadow(0 4px 8px rgba(0,0,0,.3))" }}>
        <path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill={dark ? "#fff" : K.ink} stroke={dark ? K.ink : "#fff"} strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Card de interface (widget). */
export const Widget: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  dark?: boolean;
  bg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, dark, bg, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 46,
      background: bg ?? (dark ? "#0e100e" : "#fbfbf9"),
      color: dark ? "#fff" : K.ink,
      boxShadow: dark ? "0 30px 60px rgba(0,0,0,.35)" : "0 30px 60px rgba(30,40,30,.14), inset 0 -2px 0 rgba(0,0,0,.04)",
      padding: 40,
      boxSizing: "border-box",
      fontFamily: F,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const fmtBR = (v: number, dec = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const Count: React.FC<{ to: number; start: number; dur?: number; dec?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ to, start, dur = 40, dec = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + dur], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {fmtBR(to * t, dec)}
      {suffix}
    </span>
  );
};

/** Partículas sutis para fundos escuros. */
export const Dust: React.FC<{ n?: number; color?: string }> = ({ n = 60, color = "#cfe9c8" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const x = random(`dx${i}`) * 1920;
        const y = ((random(`dy${i}`) * 1080 - frame * (0.2 + random(`ds${i}`) * 0.6)) % 1080 + 1080) % 1080;
        const s = 1 + random(`dz${i}`) * 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: color, opacity: 0.15 + random(`do${i}`) * 0.4 }} />;
      })}
    </AbsoluteFill>
  );
};
