/**
 * V10 — estilo "produto/interface" (referência estilo Vercel/v0):
 * fundo preto com foco de luz, interface escura monocromática, um único verde de destaque com brilho,
 * câmera macro contínua que voa pela interface (desfoque de movimento + profundidade de campo),
 * passagens por foco (desfoca → foca), digitação com cursor, botão branco "↗", marca CI200 em branco.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Midia } from "../v8/kit";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });

export { Midia };
export const F = "'Inter', sans-serif";
export const U = {
  text: "#ededed",
  muted: "#8f8f8f",
  dim: "#5a5a5a",
  line: "#262626",
  panel: "#0b0b0b",
  panel2: "#141414",
  green: "#5ee39a",
  greenGlow: "rgba(94,227,154,.55)",
};
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const IO = Easing.bezier(0.7, 0, 0.2, 1); // movimento de câmera: arranca e assenta
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const useL = () => {
  const { width, height } = useVideoConfig();
  return { W: width, H: height, V: height > width };
};
export const fmtBR = (v: number, dec = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ------------------------------------------------------------------ fundo
export const Void: React.FC<{ children?: React.ReactNode; glow?: string; spot?: number }> = ({ children, glow, spot = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 58% at 50% 46%, rgba(40,40,40,${0.55 * spot}), rgba(12,12,12,${0.6 * spot}) 55%, #000 85%)` }} />
      {glow ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 50% at 50% 50%, ${glow}, transparent 70%)` }} /> : null}
      {children}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          mixBlendMode: "screen",
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' seed='${frame % 8}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ câmera
/** [quadro, x, y, zoom, rotX, rotY] — x/y em coordenadas do "mundo" (origem no centro da tela). */
export type Key = [number, number, number, number, number?, number?];
const pose = (keys: Key[], f: number) => {
  const fs = keys.map((k) => k[0]);
  const g = (i: number, d = 0) => interpolate(f, fs, keys.map((k) => (k[i] as number | undefined) ?? d), { ...cl, easing: IO });
  return { x: g(1), y: g(2), z: g(3, 1), rx: g(4), ry: g(5) };
};

/**
 * Câmera que voa pelo "mundo". Desfoque de movimento automático pela velocidade;
 * `focus` = desfoque extra (passagem de foco). `dof` = bordas desfocadas (profundidade de campo).
 */
export const Cam: React.FC<{ keys: Key[]; children: React.ReactNode; focus?: [number, number][]; dof?: number; mb?: number }> = ({ keys, children, focus, dof = 7, mb = 1 }) => {
  const frame = useCurrentFrame();
  const p = pose(keys, frame);
  const q = pose(keys, frame - 1);
  const speed = Math.abs(p.z - q.z) / p.z * 260 + Math.hypot(p.x - q.x, p.y - q.y) * p.z * 0.07;
  const fb = focus ? interpolate(frame, focus.map((k) => k[0]), focus.map((k) => k[1]), cl) : 0;
  const blur = Math.min(30, speed * mb + fb);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${p.rx}deg) rotateY(${p.ry}deg) scale(${p.z}) translate(${-p.x}px, ${-p.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined }}>
          {children}
        </div>
      </AbsoluteFill>
      {dof > 0 ? (
        <AbsoluteFill style={{ backdropFilter: `blur(${dof}px)`, WebkitBackdropFilter: `blur(${dof}px)`, WebkitMaskImage: "radial-gradient(ellipse 60% 58% at 50% 50%, transparent 50%, #000 100%)", maskImage: "radial-gradient(ellipse 60% 58% at 50% 50%, transparent 50%, #000 100%)", pointerEvents: "none" }} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Objeto posicionado no mundo (x, y = centro do objeto). */
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", ...style }}>{children}</div>
);

// ------------------------------------------------------------------ elementos de interface
export const Panel: React.FC<{ w: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties; pad?: number; r?: number }> = ({ w, h, children, style, pad = 36, r = 22 }) => (
  <div style={{ width: w, height: h, padding: pad, boxSizing: "border-box", borderRadius: r, background: "linear-gradient(180deg, #101010, #0a0a0a)", border: `1.5px solid ${U.line}`, boxShadow: "0 50px 140px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.06)", fontFamily: F, color: U.text, position: "relative", overflow: "hidden", ...style }}>
    {children}
  </div>
);

/** Aparece desfocado → nítido (passagem de foco), opcionalmente some no fim. */
export const Focus: React.FC<{ at?: number; out?: number; children: React.ReactNode; len?: number; style?: React.CSSProperties; rise?: number; fill?: boolean }> = ({ at = 0, out, children, len = 14, style, rise = 0, fill }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [at, at + len], [0, 1], { ...cl, easing: OUT });
  const b = out === undefined ? 0 : interpolate(frame, [out, out + len], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const v = a * (1 - b);
  const bl = (1 - a) * 16 + b * 20;
  return <div style={{ ...(fill ? { position: "absolute", inset: 0 } : {}), opacity: v, filter: bl > 0.3 ? `blur(${bl}px)` : undefined, translate: rise ? `0 ${(1 - a) * rise}px` : undefined, ...style }}>{children}</div>;
};

/** Texto sendo digitado, com cursor piscando. */
export const Typed: React.FC<{ text: string; at: number; speed?: number; style?: React.CSSProperties; caret?: boolean; until?: number }> = ({ text, at, speed = 1.6, style, caret = true, until }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - at) / speed)));
  const typing = frame >= at && (until === undefined || frame < until);
  const on = typing && (n < text.length || Math.floor(frame / 15) % 2 === 0);
  return (
    <span style={{ whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      {caret ? <span style={{ display: "inline-block", width: "0.06em", height: "1em", verticalAlign: "-0.12em", marginLeft: "0.04em", background: "currentColor", opacity: on ? 0.9 : 0 }} /> : null}
    </span>
  );
};

export const Dot: React.FC<{ color?: string; size?: number }> = ({ color = U.green, size = 10 }) => <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 ${size * 1.4}px ${color}` }} />;

export const Chip: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; size?: number; active?: number; style?: React.CSSProperties }> = ({ children, icon, size = 24, active = 0, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, border: `1.5px solid ${active > 0.5 ? "rgba(94,227,154,.6)" : U.line}`, background: active > 0.5 ? "rgba(94,227,154,.08)" : "#0d0d0d", fontFamily: F, fontSize: size, fontWeight: 500, color: active > 0.5 ? U.text : "#bdbdbd", whiteSpace: "nowrap", ...style }}>
    {icon ? <span style={{ color: U.muted, display: "inline-flex" }}>{icon}</span> : null}
    {children}
  </div>
);

/** Botão branco com brilho (o "Visit ↗" da referência). */
export const WhiteButton: React.FC<{ children: React.ReactNode; size?: number; press?: number; glow?: number }> = ({ children, size = 52, press = 0, glow = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3, padding: `${size * 0.42}px ${size * 0.9}px`, borderRadius: size * 0.26, background: "#fff", color: "#0a0a0a", fontFamily: F, fontWeight: 500, fontSize: size, letterSpacing: "-0.02em", whiteSpace: "nowrap", scale: String(1 - press * 0.06), boxShadow: `0 0 ${80 * glow}px rgba(255,255,255,${0.35 * glow}), 0 0 ${20 * glow}px rgba(255,255,255,${0.5 * glow})` }}>
    {children}
  </div>
);

export const Arrow: React.FC<{ size: number; dir?: "up" | "ne"; color?: string }> = ({ size, dir = "ne", color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {dir === "up" ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M7 17L17 7M8 7h9v9" />}
  </svg>
);

/** Botão quadrado branco com seta para cima (enviar). */
export const SendButton: React.FC<{ size: number; press?: number }> = ({ size, press = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", scale: String(1 - press * 0.1), boxShadow: `0 0 ${size * 0.8}px rgba(255,255,255,.35)` }}>
    <Arrow size={size * 0.5} dir="up" />
  </div>
);

/** Anel de pontuação verde com brilho e número no centro. */
export const Ring: React.FC<{ size: number; value: number; at: number; dur?: number; stroke?: number; children?: React.ReactNode; glow?: number }> = ({ size, value, at, dur = 60, stroke, children, glow = 1 }) => {
  const frame = useCurrentFrame();
  const sw = stroke ?? size * 0.075;
  const R = size / 2 - sw;
  const L = 2 * Math.PI * R;
  const p = interpolate(frame, [at, at + dur], [0, value], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", rotate: "-90deg", overflow: "visible" }}>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgba(94,227,154,.12)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={U.green} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} style={{ filter: `drop-shadow(0 0 ${size * 0.06 * glow}px ${U.greenGlow})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, color: U.text }}>{children}</div>
    </div>
  );
};

export const Count: React.FC<{ to: number; at: number; dur?: number; dec?: number; prefix?: string; suffix?: string; style?: React.CSSProperties }> = ({ to, at, dur = 50, dec = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [0, to], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {fmtBR(v, dec)}
      {suffix}
    </span>
  );
};

/** Marca CI200 em branco. */
export const Mark: React.FC<{ h: number; full?: boolean; glow?: number }> = ({ h, full, glow = 0.5 }) => (
  <Img src={staticFile(full ? "v10/ci200-branco.png" : "v10/ci200-icone.png")} style={{ height: h, filter: `drop-shadow(0 0 ${h * 0.12 * glow}px rgba(255,255,255,${0.45 * glow}))` }} />
);

/** Miniatura de foto/vídeo dentro da interface (levemente dessaturada). */
export const Thumb: React.FC<{ src: string; w: number; h: number; r?: number; dur?: number; style?: React.CSSProperties; startFrom?: number }> = ({ src, w, h, r = 12, dur = 200, style, startFrom }) => (
  <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", border: `1.5px solid ${U.line}`, flexShrink: 0, position: "relative", ...style }}>
    <Midia src={src} dur={dur} zoom={[1.08, 1]} startFrom={startFrom} style={{ width: "100%", height: "100%", filter: "saturate(.75) contrast(1.05) brightness(.9)" }} />
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 22, color = U.muted, style }) => <div style={{ fontFamily: F, fontSize: size, fontWeight: 400, color, letterSpacing: "-0.005em", ...style }}>{children}</div>;

/** Efeito sonoro de interface (pacote enviado: public/sfx). */
export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);
/** Tiques de digitação. */
export const TypeSfx: React.FC<{ at: number; chars: number; speed?: number; every?: number; volume?: number }> = ({ at, chars, speed = 1.6, every = 3, volume = 0.18 }) => (
  <>
    {Array.from({ length: Math.floor(chars / every) }, (_, i) => (
      <Sfx key={i} at={at + i * every * speed} src={i % 2 ? "tick_002" : "click_002"} volume={volume} />
    ))}
  </>
);
