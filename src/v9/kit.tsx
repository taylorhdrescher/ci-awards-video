/**
 * V9 — "Grandeza": linguagem cinematográfica e precisa.
 * Imagens da fábrica como protagonistas (grade de cor, letterbox, flare anamórfico),
 * tipografia fina + negrito + serifa itálica, camada técnica (marcas de corte, coordenadas, linhas finas),
 * dourado metálico para o prêmio, painéis de vidro para os dados.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { hasAsset, Midia } from "../v8/kit";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/Playfair.woff2"), weight: "400 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/Playfair-italic.woff2"), weight: "400 900", style: "italic" });

export { Midia, hasAsset };
export const SANS = "'Inter', sans-serif";
export const SERIF = "'Playfair Display', serif";
export const C = {
  night: "#050b07",
  night2: "#0a1610",
  green: "#367c2b",
  leaf: "#7cc66c",
  yellow: "#ffde00",
  gold: "#d8b45a",
  white: "#ffffff",
  dim: "rgba(255,255,255,.62)",
  hair: "rgba(255,255,255,.22)",
};
export const GOLD_GRAD = "linear-gradient(100deg, #8a6a22 0%, #e9cf86 22%, #fff6d6 34%, #d4af55 48%, #8f6c25 66%, #e3c578 84%, #fff1c4 100%)";
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.33, 0, 0.2, 1);

export const useL = () => {
  const { width, height } = useVideoConfig();
  const V = height > width;
  return { W: width, H: height, V, t: (n: number) => (V ? n * 0.62 : n) };
};
export const fmtBR = (v: number, dec = 0) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ------------------------------------------------------------------ imagem cinematográfica
/** fundo-lento.mp4 = fundo.mp4 a 60% da velocidade; "at" em segundos do fundo.mp4 original. */
export const Footage: React.FC<{ at: number; dim?: number; push?: [number, number]; dur?: number; blur?: number; grade?: boolean }> = ({ at, dim = 0.35, push = [1.04, 1.12], dur = 300, blur = 0, grade = true }) => {
  const frame = useCurrentFrame();
  const slow = hasAsset("vid/fundo-lento.mp4");
  const src = slow ? "vid/fundo-lento.mp4" : "vid/fundo.mp4";
  const start = Math.round(at * 30 * (slow ? 5 / 3 : 1));
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [0, dur], push)), filter: `saturate(.82) contrast(1.08) brightness(.95)${blur ? ` blur(${blur}px)` : ""}` }} />
      {grade ? <Grade dim={dim} /> : null}
    </AbsoluteFill>
  );
};

/** Foto/vídeo em tela cheia com o mesmo tratamento. */
export const Plate: React.FC<{ src: string; dim?: number; dur?: number; zoom?: [number, number]; blur?: number }> = ({ src, dim = 0.35, dur = 200, zoom = [1.12, 1.02], blur = 0 }) => (
  <AbsoluteFill style={{ background: C.night }}>
    <Midia src={src} dur={dur} zoom={zoom} style={{ position: "absolute", inset: 0, filter: `saturate(.85) contrast(1.06)${blur ? ` blur(${blur}px)` : ""}` }} />
    <Grade dim={dim} />
  </AbsoluteFill>
);

/** Correção de cor: sombras verde-petróleo, vinheta, granulação fina. */
export const Grade: React.FC<{ dim?: number }> = ({ dim = 0.35 }) => (
  <>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(5,11,7,${dim * 0.7}) 0%, rgba(5,11,7,${dim}) 55%, rgba(5,11,7,${Math.min(0.95, dim + 0.35)}) 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(135deg, rgba(20,60,40,.18), rgba(120,90,30,.10))", mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.55))" }} />
    <Grain />
  </>
);

export const Grain: React.FC<{ o?: number }> = ({ o = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${frame % 10}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
};

/** Fundo escuro "de estúdio": verde-noite com brilho suave. */
export const Stage: React.FC<{ children?: React.ReactNode; glow?: string; at?: [number, number] }> = ({ children, glow = "rgba(54,124,43,.35)", at = [50, 40] }) => (
  <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at ${at[0]}% ${at[1]}%, ${glow}, transparent 70%)` }} />
    {children}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.5))", pointerEvents: "none" }} />
    <Grain />
  </AbsoluteFill>
);

/** Faixas de cinema (2.39:1) que entram e saem. */
export const Letterbox: React.FC<{ from?: number; to?: number; amount?: number }> = ({ from = 0, to = 100000, amount = 1 }) => {
  const frame = useCurrentFrame();
  const { W, H, V } = useL();
  const target = V ? (H - W * 1.25) / 2 : (H - W / 2.39) / 2;
  const k = Math.min(interpolate(frame, [from, from + 18], [0, 1], { ...cl, easing: INOUT }), interpolate(frame, [to - 18, to], [1, 0], { ...cl, easing: INOUT })) * amount;
  const h = target * k;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} />
    </>
  );
};

// ------------------------------------------------------------------ camada técnica (HUD)
/** Marcas de corte nos cantos + legendas técnicas discretas. */
export const Hud: React.FC<{ label?: string; right?: string; at?: number; color?: string; inset?: number }> = ({ label = "CI AWARDS 2026", right = "29°41′S · 51°27′W", at = 0, color = "rgba(255,255,255,.7)", inset }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const m = inset ?? (V ? 56 : 64);
  const L = 34;
  const o = interpolate(frame, [at, at + 14], [0, 1], { ...cl, easing: OUT });
  const len = L * o;
  const corner = (s: React.CSSProperties, bx: string, by: string) => (
    <div style={{ position: "absolute", width: len, height: len, ...s, [bx]: `1.5px solid ${color}`, [by]: `1.5px solid ${color}` }} />
  );
  const txt: React.CSSProperties = { position: "absolute", fontFamily: SANS, fontWeight: 500, fontSize: V ? 20 : 17, letterSpacing: "0.32em", color, opacity: o, whiteSpace: "nowrap" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {corner({ left: m, top: m }, "borderLeft", "borderTop")}
      {corner({ right: m, top: m }, "borderRight", "borderTop")}
      {corner({ left: m, bottom: m }, "borderLeft", "borderBottom")}
      {corner({ right: m, bottom: m }, "borderRight", "borderBottom")}
      <div style={{ ...txt, left: m + 50, top: m + 2 }}>{label}</div>
      <div style={{ ...txt, right: m + 50, top: m + 2 }}>{right}</div>
      <div style={{ ...txt, left: m + 50, bottom: m + 2 }}>JOHN DEERE · MONTENEGRO</div>
      <div style={{ ...txt, right: m + 50, bottom: m + 2, fontVariantNumeric: "tabular-nums" }}>
        CI200 · FY26 · {String(Math.floor(frame / 30)).padStart(2, "0")}:{String(frame % 30).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/** Rótulo de seção: número + linha fina + texto espaçado. */
export const Eyebrow: React.FC<{ n?: string; text: string; at?: number; color?: string; center?: boolean }> = ({ n, text, at = 0, color = C.leaf, center }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const o = interpolate(frame, [at, at + 16], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: center ? "center" : "flex-start", gap: 20, fontFamily: SANS, fontWeight: 600, fontSize: V ? 24 : 22, letterSpacing: "0.38em", color: "rgba(255,255,255,.82)" }}>
      {n ? <span style={{ color, opacity: o, fontVariantNumeric: "tabular-nums" }}>{n}</span> : null}
      <span style={{ width: 80 * o, height: 1.5, background: color }} />
      <span style={{ opacity: o, translate: `${(1 - o) * 20}px 0` }}>{text.toUpperCase()}</span>
    </div>
  );
};

// ------------------------------------------------------------------ tipografia
export type Seg = { t: string; w?: number; serif?: boolean; color?: string; gold?: boolean };
/**
 * Título em linhas: cada linha sobe de trás de uma máscara, com leve desfoque.
 * Cada linha é uma lista de segmentos (peso, serifa itálica, cor, dourado).
 */
export const Title: React.FC<{ lines: Seg[][]; size: number; at?: number; every?: number; align?: "left" | "center"; color?: string; lh?: number; tracking?: string }> = ({ lines, size, at = 0, every = 6, align = "left", color = C.white, lh = 1.0, tracking = "-0.045em" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", textAlign: align }}>
      {lines.map((segs, i) => {
        const p = interpolate(frame, [at + i * every, at + i * every + 22], [0, 1], { ...cl, easing: OUT });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 + size * (lh - 1) }}>
            <div style={{ translate: `0 ${(1 - p) * 105}%`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined, whiteSpace: "nowrap", fontSize: size, lineHeight: 1.02, letterSpacing: tracking, color }}>
              {segs.map((s, k) => (
                <span
                  key={k}
                  style={{
                    fontFamily: s.serif ? SERIF : SANS,
                    fontStyle: s.serif ? "italic" : undefined,
                    fontWeight: s.serif ? 500 : s.w ?? 700,
                    letterSpacing: s.serif ? "-0.02em" : undefined,
                    color: s.color,
                    ...(s.gold ? goldText(frame) : {}),
                  }}
                >
                  {s.t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Texto dourado metálico com brilho que corre. */
export const goldText = (frame: number): React.CSSProperties => ({
  backgroundImage: GOLD_GRAD,
  backgroundSize: "250% 100%",
  backgroundPosition: `${(frame * 0.8) % 250}% 0`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter: "drop-shadow(0 6px 30px rgba(216,180,90,.25))",
});

/** Parágrafo que aparece palavra a palavra (opacidade + leve subida). */
export const Fade: React.FC<{ text: string; size: number; at?: number; every?: number; color?: string; weight?: number; width?: number; align?: "left" | "center"; serif?: boolean }> = ({ text, size, at = 0, every = 1.2, color = C.dim, weight = 400, width, align = "left", serif }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, fontFamily: serif ? SERIF : SANS, fontStyle: serif ? "italic" : undefined, fontSize: size, fontWeight: weight, color, lineHeight: 1.35, letterSpacing: serif ? "-0.01em" : "-0.01em" }}>
      {text.split(" ").map((w, i) => {
        const p = interpolate(frame, [at + i * every, at + i * every + 14], [0, 1], { ...cl, easing: OUT });
        return (
          <span key={i} style={{ opacity: p, translate: `0 ${(1 - p) * 12}px`, filter: p < 1 ? `blur(${(1 - p) * 4}px)` : undefined }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Contador numérico (fino, tabular). */
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

/** Linha fina que se desenha. */
export const Hair: React.FC<{ w: number; at?: number; dur?: number; color?: string; vertical?: boolean; style?: React.CSSProperties }> = ({ w, at = 0, dur = 20, color = C.hair, vertical, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...cl, easing: INOUT });
  return <div style={{ width: vertical ? 1.5 : w * p, height: vertical ? w * p : 1.5, background: color, ...style }} />;
};

// ------------------------------------------------------------------ luz
/** Feixes de luz volumétrica vindos de cima. */
export const Rays: React.FC<{ color?: string; opacity?: number; x?: number; spread?: number; n?: number }> = ({ color = "255,236,190", opacity = 0.35, x = 50, spread = 34, n = 7 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none", opacity }}>
      {Array.from({ length: n }, (_, i) => {
        const a = -spread / 2 + (i / (n - 1)) * spread + Math.sin(frame / 50 + i) * 1.5;
        const o = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 37 + i * 1.7));
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: "-20%", width: 160 + (i % 3) * 90, height: "150%", translate: "-50% 0", transformOrigin: "50% 0", rotate: `${a}deg`, background: `linear-gradient(180deg, rgba(${color},${0.55 * o}), rgba(${color},0) 75%)`, filter: "blur(30px)" }} />;
      })}
    </AbsoluteFill>
  );
};

/** Partículas douradas (bokeh) subindo devagar. */
export const Dust: React.FC<{ n?: number; color?: string; seed?: string; rise?: number; max?: number }> = ({ n = 50, color = "255,226,150", seed = "d", rise = 0.6, max = 1 }) => {
  const frame = useCurrentFrame();
  const { W, H } = useL();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k: string) => random(`${seed}${k}${i}`);
        const size = 2 + r("s") * 9;
        const depth = r("z");
        const x = r("x") * W + Math.sin(frame / (40 + r("w") * 40) + i) * 30;
        const y = (((r("y") * H - frame * rise * (0.4 + depth)) % (H + 40)) + H + 40) % (H + 40) - 20;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame / (8 + r("t") * 14) + i));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: `rgba(${color},${max * tw * (0.35 + depth * 0.65)})`, boxShadow: `0 0 ${size * 3}px rgba(${color},${0.6 * tw})`, filter: depth < 0.3 ? "blur(2px)" : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

/** Reflexo anamórfico horizontal que atravessa a tela (usado nas batidas). */
export const Streak: React.FC<{ at: number; y?: number; dur?: number; color?: string; dir?: 1 | -1 }> = ({ at, y = 50, dur = 22, color = "255,240,200", dir = 1 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], cl);
  if (p <= 0 || p >= 1) return null;
  const a = Math.sin(p * Math.PI);
  const x = dir > 0 ? -30 + p * 160 : 130 - p * 160;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: `${y}%`, height: 3, translate: "0 -50%", background: `linear-gradient(90deg, transparent, rgba(${color},${0.9 * a}) ${x}%, transparent)`, filter: "blur(1px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: `${y}%`, height: 120, translate: "0 -50%", background: `radial-gradient(ellipse 30% 50% at ${x}% 50%, rgba(${color},${0.55 * a}), transparent 70%)` }} />
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 260, height: 260, translate: "-50% -50%", borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${0.8 * a}), rgba(${color},${0.25 * a}) 30%, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

/** Brilho suave (dip to light). */
export const Bloom: React.FC<{ at: number; len?: number; max?: number; color?: string }> = ({ at, len = 16, max = 0.9, color = "255,247,225" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - len * 0.35, at, at + len], [0, max, 0], cl);
  return o > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(${color},${o}), rgba(${color},${o * 0.6}))`, pointerEvents: "none" }} /> : null;
};

// ------------------------------------------------------------------ painéis e marcadores
/** Painel de vidro fosco com borda fina. */
export const Glass: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; p?: number }> = ({ children, style, p = 1 }) => (
  <div style={{ position: "absolute", borderRadius: 28, background: "linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04))", border: "1.5px solid rgba(255,255,255,.16)", boxShadow: "0 30px 80px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.18)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", opacity: p, translate: `0 ${(1 - p) * 40}px`, fontFamily: SANS, color: C.white, overflow: "hidden", ...style }}>
    {children}
  </div>
);

/** Colchetes de rastreamento ao redor de um alvo na imagem, com rótulo. */
export const Track: React.FC<{ x: number; y: number; w: number; h: number; at: number; label: string; sub?: string; color?: string }> = ({ x, y, w, h, at, label, sub, color = C.yellow }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 14], [0, 1], { ...cl, easing: OUT });
  const jitter = (1 - p) * 30;
  const L = 26;
  const c = (s: React.CSSProperties, bx: string, by: string) => <div style={{ position: "absolute", width: L, height: L, ...s, [bx]: `2px solid ${color}`, [by]: `2px solid ${color}` }} />;
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x - jitter, top: y - jitter, width: w + jitter * 2, height: h + jitter * 2, opacity: p }}>
      {c({ left: 0, top: 0 }, "borderLeft", "borderTop")}
      {c({ right: 0, top: 0 }, "borderRight", "borderTop")}
      {c({ left: 0, bottom: 0 }, "borderLeft", "borderBottom")}
      {c({ right: 0, bottom: 0 }, "borderRight", "borderBottom")}
      <div style={{ position: "absolute", left: 0, top: -54, display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, whiteSpace: "nowrap" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}` }} />
        <span style={{ fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>{label}</span>
        {sub ? <span style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,.6)", letterSpacing: "0.2em" }}>{sub}</span> : null}
      </div>
    </div>
  );
};

/** Anel de medição com marcas (estilo instrumento de precisão). */
export const Gauge: React.FC<{ size: number; value: number; at: number; dur?: number; color?: string; ticks?: number; track?: string; start?: number }> = ({ size, value, at, dur = 60, color = C.leaf, ticks = 120, track = "rgba(255,255,255,.14)", start = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, value], { ...cl, easing: Easing.out(Easing.cubic) });
  const R = size / 2 - 6;
  return (
    <svg width={size} height={size} style={{ position: "absolute", overflow: "visible" }}>
      {Array.from({ length: ticks }, (_, i) => {
        const f = i / ticks;
        const a = (f * 360 - 90) * (Math.PI / 180);
        const on = f >= start && f < start + p;
        const long = i % 10 === 0;
        const r1 = R - (long ? 30 : 18);
        return <line key={i} x1={size / 2 + Math.cos(a) * r1} y1={size / 2 + Math.sin(a) * r1} x2={size / 2 + Math.cos(a) * R} y2={size / 2 + Math.sin(a) * R} stroke={on ? color : track} strokeWidth={long ? 3 : 2} strokeLinecap="round" style={{ filter: on ? `drop-shadow(0 0 6px ${color})` : undefined }} />;
      })}
    </svg>
  );
};

/** Moldura de foto refinada (borda fina + sombra profunda). */
export const Frame: React.FC<{ src: string; w: number; h: number; dur?: number; style?: React.CSSProperties; label?: string; zoom?: [number, number] }> = ({ src, w, h, dur = 200, style, label, zoom = [1.12, 1.02] }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: 18, overflow: "hidden", boxShadow: "0 50px 120px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.28)", ...style }}>
    <Midia src={src} dur={dur} zoom={zoom} style={{ width: "100%", height: "100%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,.6))" }} />
    {label ? <div style={{ position: "absolute", left: 22, bottom: 18, fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: "0.28em", color: C.white }}>{label.toUpperCase()}</div> : null}
  </div>
);
