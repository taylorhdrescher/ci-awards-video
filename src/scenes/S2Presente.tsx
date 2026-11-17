import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_TITLE } from "../theme";
import { PRESENTE } from "../content";
import { clamp, EASE_IN_OUT, EASE_OUT, Eyebrow, goldText, MaskWords, MediaCard, useExit } from "../components/ui";

const CARD_W = 900;
const CARD_H = 506;
const GAP = 60;

const Phrase: React.FC<{ text: string; start: number; end: number }> = ({ text, start, end }) => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [start, start + 18], [100, 0], { ...clamp, easing: EASE_OUT });
  const out = interpolate(frame, [end - 14, end], [0, -100], { ...clamp, easing: EASE_IN_OUT });
  if (frame < start || frame > end) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, translate: `0 ${inn + out}%`, whiteSpace: "nowrap", ...goldText(frame) }}>
      {text}
    </div>
  );
};

export const S2Presente: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  // título grande → canto
  const toCorner = interpolate(frame, [80, 115], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const dots = Math.floor(interpolate(frame, [40, 70], [0, 3.99], clamp));

  // esteira 3D de cards
  const n = PRESENTE.cards.length;
  const startPan = 95;
  const panX = interpolate(frame, [startPan, dur], [1000, 960 - CARD_W / 2 - (n - 1) * (CARD_W + GAP)], { ...clamp, easing: EASE_IN_OUT });

  const fr = PRESENTE.frases;
  const seg = (dur - 160) / fr.length;
  const exit = useExit(dur - 20);

  return (
    <AbsoluteFill style={exit}>
      {/* Título */}
      <div
        style={{
          position: "absolute",
          left: interpolate(toCorner, [0, 1], [200, 110]),
          top: interpolate(toCorner, [0, 1], [380, 80]),
          scale: String(interpolate(toCorner, [0, 1], [1, 0.4])),
          transformOrigin: "left top",
        }}
      >
        <MaskWords
          text="Estar presente"
          delay={4}
          stagger={8}
          style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 250, lineHeight: 1, textTransform: "uppercase", color: "#fff" }}
          wordStyle={(i) => (i === 1 ? goldText(frame) : {})}
        />
        <div style={{ position: "absolute", right: -150, bottom: 10, fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 250, lineHeight: 1, color: C.gold }}>
          {".".repeat(dots)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 40, opacity: toCorner }}>
        <Eyebrow n="01" text="Como atuamos" delay={95} />
      </div>

      {/* Esteira de vídeos/fotos — cada card inclina conforme a posição na tela */}
      <AbsoluteFill style={{ perspective: 1600 }}>
        {PRESENTE.cards.map((c, i) => {
          const x = i * (CARD_W + GAP) + panX;
          const center = x + CARD_W / 2 - 960;
          const ry = interpolate(center, [-1400, 0, 1400], [28, 0, -28], clamp);
          const sc = interpolate(Math.abs(center), [0, 1400], [1, 0.82], clamp);
          return (
            <div key={c.src + i} style={{ position: "absolute", left: x, top: 230 + (i % 2) * 24, width: CARD_W, height: CARD_H, transform: `rotateY(${ry}deg) scale(${sc})` }}>
              <MediaCard
                src={c.src}
                tipo={c.tipo}
                x={0}
                y={0}
                w={CARD_W}
                h={CARD_H}
                delay={startPan + Math.max(0, i - 1) * 50}
                label={c.label}
                from={i % 2 === 0 ? "up" : "down"}
                durationInFrames={dur}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* frase rotativa */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 790,
          height: 140,
          width: 1700,
          overflow: "hidden",
          fontFamily: FONT_TITLE,
          fontWeight: 800,
          fontSize: 124,
          lineHeight: 1.05,
          textTransform: "uppercase",
        }}
      >
        {fr.map((t, i) => (
          <Phrase key={t} text={t} start={150 + i * seg} end={i === fr.length - 1 ? dur + 30 : 150 + (i + 1) * seg} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 940,
          height: 4,
          width: interpolate(frame, [150, dur], [0, 1680], clamp),
          background: `linear-gradient(90deg, ${C.green}, ${C.yellow})`,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};
