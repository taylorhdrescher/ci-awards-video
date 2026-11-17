import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT_BODY, FONT_TITLE, GOLD_GRADIENT } from "../theme";

// duração (frames a 30fps) de cada vídeo, para repetir em loop sem congelar
export const VIDEO_LEN: Record<string, number> = {
  "vid/paineis.mp4": 248,
  "vid/grupo-gemba.mp4": 119,
  "vid/facilitando.mp4": 176,
  "vid/inovar.mp4": 140,
  "vid/grupo-gemba-lento.mp4": 302,
  "vid/paineis-lento.mp4": 499,
  "vid/facilitando-lento.mp4": 354,
  "vid/inovar-lento.mp4": 282,
};
/** versões em câmera lenta suave (120 fps reais ou quadros interpolados) usadas no lugar dos clipes curtos */
export const LENTO: Record<string, string> = {
  "vid/grupo-gemba.mp4": "vid/grupo-gemba-lento.mp4",
  "vid/paineis.mp4": "vid/paineis-lento.mp4",
  "vid/facilitando.mp4": "vid/facilitando-lento.mp4",
  "vid/inovar.mp4": "vid/inovar-lento.mp4",
};

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useSpring = (delay = 0, damping = 18, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass, stiffness: 120 } });
};

/** fade/blur out ao final da cena */
export const useExit = (start: number, dur = 18) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  return { opacity: 1 - t, filter: `blur(${t * 14}px)`, scale: String(1 + t * 0.06) };
};

// ------------------------------------------------------------------
// Texto: revelação palavra a palavra com máscara
// ------------------------------------------------------------------
export const MaskWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties;
  gold?: boolean;
}> = ({ text, delay = 0, stagger = 4, style, wordStyle, gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.25em", ...style }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 20, mass: 0.7 } });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" }}>
            <span
              style={{
                display: "inline-block",
                translate: `0 ${(1 - s) * 110}%`,
                rotate: `${(1 - s) * 6}deg`,
                ...(gold ? goldText(frame) : {}),
                ...(wordStyle ? wordStyle(i) : {}),
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const goldText = (frame: number): React.CSSProperties => ({
  backgroundImage: GOLD_GRADIENT,
  backgroundSize: "300% 100%",
  backgroundPosition: `${(frame * 0.6) % 300}% 0`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

/** Letras que entram com tracking e blur */
export const TrackIn: React.FC<{
  text: string;
  delay?: number;
  style?: React.CSSProperties;
  gold?: boolean;
}> = ({ text, delay = 0, style, gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      {text.split("").map((ch, i) => {
        const s = spring({ frame: frame - delay - i * 2, fps, config: { damping: 22 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: s,
              filter: `blur(${(1 - s) * 12}px)`,
              translate: `0 ${(1 - s) * 40}px`,
              ...(gold ? goldText(frame) : {}),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------
export const Eyebrow: React.FC<{ n: string; text: string; delay?: number; style?: React.CSSProperties }> = ({
  n,
  text,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [delay, delay + 20], [0, 90], { ...clamp, easing: EASE_OUT });
  const o = interpolate(frame, [delay + 6, delay + 22], [0, 1], clamp);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, ...style }}>
      <div style={{ width: line, height: 4, background: C.gold, borderRadius: 4 }} />
      <div
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 9,
          textTransform: "uppercase",
          color: C.gold,
          opacity: o,
          translate: `${(1 - o) * -20}px 0`,
        }}
      >
        {n} — {text}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Moldura de mídia (foto ou vídeo) com revelação e Ken Burns
// ------------------------------------------------------------------
export const Media: React.FC<{
  src: string;
  tipo?: "img" | "video";
  style?: React.CSSProperties;
  zoom?: [number, number];
  durationInFrames?: number;
  objectPosition?: string;
}> = ({ src, tipo, style, zoom = [1.08, 1.0], durationInFrames = 300, objectPosition = "center" }) => {
  const frame = useCurrentFrame();
  const kind = tipo ?? (src.endsWith(".mp4") ? "video" : "img");
  src = LENTO[src] ?? src;
  const z = interpolate(frame, [0, durationInFrames], zoom, clamp);
  const common: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition,
    scale: String(z),
  };
  return (
    <div style={{ overflow: "hidden", position: "relative", ...style }}>
      {kind === "video" ? (
        <Loop durationInFrames={VIDEO_LEN[src] ?? 150}>
          <OffthreadVideo src={staticFile(src)} muted style={common} />
        </Loop>
      ) : (
        <Img src={staticFile(src)} style={common} />
      )}
    </div>
  );
};

export const MediaCard: React.FC<{
  src: string;
  tipo?: "img" | "video";
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  rot?: number;
  label?: string;
  radius?: number;
  from?: "left" | "right" | "up" | "down" | "zoom";
  durationInFrames?: number;
  objectPosition?: string;
  z?: number;
}> = ({ src, tipo, x, y, w, h, delay = 0, rot = 0, label, radius = 22, from = "up", durationInFrames, objectPosition, z }) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, 20, 1);
  const reveal = interpolate(frame, [delay, delay + 26], [100, 0], { ...clamp, easing: EASE_OUT });
  const off = (1 - s) * 140;
  const tr =
    from === "left" ? `${-off}px 0` : from === "right" ? `${off}px 0` : from === "down" ? `0 ${-off}px` : from === "zoom" ? "0 0" : `0 ${off}px`;
  const labelS = useSpring(delay + 14, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        translate: tr,
        rotate: `${rot * s}deg`,
        scale: from === "zoom" ? String(0.6 + 0.4 * s) : "1",
        opacity: Math.min(1, s * 1.6),
        zIndex: z,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius,
          overflow: "hidden",
          clipPath: `inset(${reveal}% 0 0 0 round ${radius}px)`,
          boxShadow: "0 30px 80px rgba(0,0,0,.55), 0 0 0 2px rgba(227,185,63,.55)",
        }}
      >
        <Media src={src} tipo={tipo} style={{ width: "100%", height: "100%" }} durationInFrames={durationInFrames} objectPosition={objectPosition} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,.55))" }} />
      </div>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 22,
            padding: "10px 22px",
            borderRadius: 999,
            background: C.yellow,
            color: C.ink,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            scale: String(labelS),
            transformOrigin: "left center",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

// ------------------------------------------------------------------
// Engrenagem com letra/ícone
// ------------------------------------------------------------------
const gearPath = (teeth: number, rOut: number, rIn: number, cx = 50, cy = 50) => {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const angs = [a - step * 0.25, a - step * 0.13, a + step * 0.13, a + step * 0.25];
    const rs = [rIn, rOut, rOut, rIn];
    angs.forEach((an, k) => pts.push(`${cx + Math.cos(an) * rs[k]},${cy + Math.sin(an) * rs[k]}`));
  }
  return `M${pts.join("L")}Z`;
};

export const Gear: React.FC<{ letter: string; color: string; size: number; spin?: number }> = ({ letter, color, size, spin = 0 }) => {
  const icon =
    letter === "leaf" ? (
      <path d="M36 64c0-18 12-28 30-30-1 18-11 30-30 30zM36 64l16-16" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    ) : letter === "heart" ? (
      <path d="M50 66s-16-9-16-20a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 20-16 20z" fill="#fff" />
    ) : (
      <text x="50" y="62" textAnchor="middle" fontFamily={FONT_TITLE} fontWeight={800} fontSize={34} fill={letter === "Q" ? "#1f6b2d" : "#fff"}>
        {letter}
      </text>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g style={{ transformOrigin: "50px 50px", rotate: `${spin}deg` }}>
        <path d={gearPath(10, 48, 39)} fill={color} />
      </g>
      <circle cx="50" cy="50" r="27" fill={color} />
      <circle cx="50" cy="50" r="27" fill="rgba(0,0,0,.12)" />
      {icon}
    </svg>
  );
};

// ------------------------------------------------------------------
// Contador numérico pt-BR
// ------------------------------------------------------------------
export const fmt = (v: number, dec = 0) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const Counter: React.FC<{
  to: number;
  delay?: number;
  dur?: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, delay = 0, dur = 45, dec = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {fmt(to * t, dec)}
      {suffix}
    </span>
  );
};

// ------------------------------------------------------------------
// Raios de luz girando (palco de premiação)
// ------------------------------------------------------------------
export const Rays: React.FC<{ size?: number; opacity?: number; x?: string; y?: string }> = ({ size = 2200, opacity = 0.5, x = "50%", y = "50%" }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        opacity,
        rotate: `${frame * 0.15}deg`,
        background: "repeating-conic-gradient(rgba(227,185,63,.22) 0 6deg, transparent 6deg 20deg)",
        WebkitMaskImage: "radial-gradient(circle, #000 8%, transparent 62%)",
        maskImage: "radial-gradient(circle, #000 8%, transparent 62%)",
      }}
    />
  );
};

/** Faixa de brilho que atravessa um elemento */
export const Shine: React.FC<{ at: number; dur?: number }> = ({ at, dur = 30 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [-60, 160], { ...clamp, easing: EASE_IN_OUT });
  if (frame < at || frame > at + dur) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(105deg, transparent ${p - 18}%, rgba(255,245,200,.55) ${p}%, transparent ${p + 18}%)`,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

/** confete dourado que cai */
export const Confetti: React.FC<{ start: number; count?: number }> = ({ start, count = 90 }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`cx${i}`) * 1920;
        const sp = 4 + random(`cs${i}`) * 7;
        const y = -60 - random(`cy${i}`) * 700 + t * sp;
        const sw = Math.sin((t + i * 13) / 9) * 30;
        const w = 8 + random(`cw${i}`) * 10;
        const col = [C.gold, C.goldLight, C.yellow, C.greenBright, "#fff"][i % 5];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sw,
              top: y,
              width: w,
              height: w * 0.45,
              background: col,
              rotate: `${t * (3 + (i % 5)) + i * 40}deg`,
              opacity: 0.9,
              borderRadius: 2,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
