import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { EVENTOS } from "../content";
import { clamp, EASE_IN_OUT, EASE_OUT, Eyebrow, goldText, MaskWords, useExit } from "../components/ui";

export const S6Eventos: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fotos = EVENTOS.fotos;
  const n = fotos.length;
  const R = 1150;
  const W = 820;
  const H = 540;
  const spinIn = interpolate(frame, [0, 70], [0, 1], { ...clamp, easing: EASE_OUT });
  const angle = interpolate(frame, [0, dur], [-140, 200], { easing: EASE_IN_OUT }) ;
  const exit = useExit(dur - 20);

  return (
    <AbsoluteFill style={exit}>
      <div style={{ position: "absolute", left: 110, top: 80, zIndex: 2 }}>
        <Eyebrow n="05" text="Feiras e eventos" delay={4} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 140, zIndex: 2 }}>
        <MaskWords
          text="Onde a melhoria contínua acontece junto"
          delay={10}
          stagger={4}
          style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 92, lineHeight: 1, textTransform: "uppercase", color: "#fff", width: 1750 }}
          wordStyle={(i) => (i >= 4 ? goldText(frame) : {})}
        />
      </div>

      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 555,
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `translateZ(${-R + 300 - (1 - spinIn) * 1500}px) rotateX(-8deg) rotateY(${-angle}deg)`,
          }}
        >
          {fotos.map((f, i) => {
            const a = (360 / n) * i;
            // quão de frente está o card (1 = frente)
            const rel = (((a - angle) % 360) + 540) % 360 - 180;
            const front = Math.max(0, Math.cos((rel * Math.PI) / 180));
            return (
              <div
                key={f + i}
                style={{
                  position: "absolute",
                  left: -W / 2,
                  top: -H / 2,
                  width: W,
                  height: H,
                  transform: `rotateY(${a}deg) translateZ(${R}px)`,
                  backfaceVisibility: "hidden",
                  borderRadius: 26,
                  overflow: "hidden",
                  boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 0 ${2 + front * 3}px rgba(227,185,63,${0.3 + front * 0.6})`,
                }}
              >
                <Img src={staticFile(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <AbsoluteFill style={{ background: "#0b0a07", opacity: 0.65 * (1 - front) }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* reflexo no chão */}
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 930,
          width: 1200,
          height: 60,
          borderRadius: "50%",
          background: C.gold,
          filter: "blur(60px)",
          opacity: 0.25 * spinIn,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 34,
          display: "flex",
          justifyContent: "center",
          gap: 22,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: C.cream,
          opacity: interpolate(frame, [60, 90], [0, 1], clamp),
        }}
      >
        <span>Feiras</span>
        <span style={{ color: C.gold }}>•</span>
        <span>Eventos</span>
        <span style={{ color: C.gold }}>•</span>
        <span>Gemba</span>
        <span style={{ color: C.gold }}>•</span>
        <span>Pessoas</span>
      </div>
    </AbsoluteFill>
  );
};
