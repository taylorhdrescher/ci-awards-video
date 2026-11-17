import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { EVENTO } from "../content";
import { clamp, EASE_IN_OUT, EASE_OUT, goldText, Rays, Shine, TrackIn, useExit, useSpring } from "../components/ui";

const Bulb: React.FC<{ size: number; glow: number }> = ({ size, glow }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 80 100" style={{ filter: `drop-shadow(0 0 ${glow}px ${C.gold})` }}>
    <defs>
      <linearGradient id="bg" x1="0" x2="1">
        <stop offset="0" stopColor={C.goldDeep} />
        <stop offset=".5" stopColor={C.goldLight} />
        <stop offset="1" stopColor={C.gold} />
      </linearGradient>
    </defs>
    <path d="M40 6a28 28 0 0 0-17 50c4 3 6 7 6 12v4h22v-4c0-5 2-9 6-12A28 28 0 0 0 40 6z" fill="url(#bg)" />
    <rect x="28" y="76" width="24" height="6" rx="3" fill={C.gold} />
    <rect x="31" y="85" width="18" height="6" rx="3" fill={C.goldDeep} />
  </svg>
);

export const S1Abertura: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // linha dourada que se abre
  const line = interpolate(frame, [6, 40], [0, 1100], { ...clamp, easing: EASE_IN_OUT });
  const lineFade = interpolate(frame, [120, 150], [1, 0], clamp);

  // fase 1: CI200
  const ciIn = useSpring(30, 20);
  const ciUp = interpolate(frame, [130, 165], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  // fase 2: CI Awards
  const bulb = useSpring(150, 12, 1);
  const awards = useSpring(160, 20);
  const rays = interpolate(frame, [140, 200], [0, 0.7], clamp);
  const flash = interpolate(frame, [148, 152, 175], [0, 0.9, 0], clamp);
  const exit = useExit(dur - 22);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...exit }}>
      <AbsoluteFill style={{ opacity: rays }}>
        <Rays size={2600} opacity={1} />
      </AbsoluteFill>

      {/* linha */}
      <div
        style={{
          position: "absolute",
          top: 540,
          width: line,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.goldLight}, transparent)`,
          opacity: lineFade,
          boxShadow: `0 0 30px ${C.gold}`,
        }}
      />

      {/* CI200 */}
      <div
        style={{
          position: "absolute",
          top: interpolate(ciUp, [0, 1], [372, 120]),
          scale: String(interpolate(ciUp, [0, 1], [1, 0.42])),
          textAlign: "center",
          opacity: ciIn,
        }}
      >
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 240,
            lineHeight: 1,
            color: "#fff",
            letterSpacing: interpolate(ciIn, [0, 1], [80, 6]),
            clipPath: `inset(${(1 - ciIn) * 100}% 0 0 0)`,
          }}
        >
          CI200
        </div>
        <div style={{ height: 6, width: 560 * ciIn, background: "#fff", margin: "14px auto" }} />
        <TrackIn
          text="CONTINUOUS IMPROVEMENT"
          delay={50}
          style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, letterSpacing: 8, color: "#fff" }}
        />
      </div>

      {/* CI Awards */}
      <div style={{ position: "absolute", top: 380, display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 230,
            lineHeight: 1,
            ...goldText(frame),
            opacity: awards,
            translate: `${(1 - awards) * -120}px 0`,
            filter: `blur(${(1 - awards) * 16}px)`,
          }}
        >
          CI
        </div>
        <div style={{ scale: String(bulb), opacity: Math.min(1, bulb * 2), marginTop: -10 }}>
          <Bulb size={150} glow={20 + Math.sin(frame / 6) * 10} />
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: FONT_TITLE,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 230,
            lineHeight: 1,
            ...goldText(frame),
            opacity: awards,
            translate: `${(1 - awards) * 120}px 0`,
            filter: `blur(${(1 - awards) * 16}px)`,
          }}
        >
          Awards
        </div>
      </div>
      <div style={{ position: "absolute", top: 380, width: 1100, height: 240, mixBlendMode: "screen" }}>
        <Shine at={190} dur={36} />
      </div>

      <div style={{ position: "absolute", top: 650, textAlign: "center" }}>
        <TrackIn
          text={EVENTO.slogan}
          delay={185}
          style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontWeight: 500, fontSize: 46, color: C.cream, letterSpacing: 1 }}
        />
        <div
          style={{
            marginTop: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: 24,
            opacity: interpolate(frame, [215, 240], [0, 1], clamp),
            translate: `0 ${interpolate(frame, [215, 240], [20, 0], { ...clamp, easing: EASE_OUT })}px`,
          }}
        >
          <div style={{ width: 80, height: 2, background: C.gold }} />
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, letterSpacing: 10, color: C.gold }}>
            {EVENTO.unidade.toUpperCase()} · {EVENTO.ano}
          </div>
          <div style={{ width: 80, height: 2, background: C.gold }} />
        </div>
      </div>

      <AbsoluteFill style={{ background: C.goldLight, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
