import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, Loop } from "remotion";
import { C } from "../theme";

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(110).fill(0).map((_, i) => {
        const r = random(`p${i}`);
        const size = 2 + r * 6;
        const speed = 0.25 + random(`s${i}`) * 0.9;
        const x = random(`x${i}`) * 1920 + Math.sin((frame + i * 40) / (60 + i)) * 30;
        const y = (((random(`y${i}`) * 1200 - frame * speed) % 1200) + 1200) % 1200 - 60;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin((frame + i * 17) / (20 + (i % 9) * 4)));
        const gold = i % 4 !== 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: gold ? C.gold : C.greenBright,
              opacity: (0.15 + r * 0.55) * tw,
              boxShadow: size > 5 ? `0 0 ${size * 3}px ${gold ? C.gold : C.greenBright}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Glow: React.FC<{ color: string; x: number; y: number; r: number; seed: number }> = ({ color, x, y, r, seed }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / (120 + seed * 20) + seed) * 160;
  const dy = Math.cos(frame / (150 + seed * 15) + seed) * 110;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx - r,
        top: y + dy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: color,
        filter: "blur(140px)",
        opacity: 0.38,
      }}
    />
  );
};

export const Background: React.FC<{ video: string | null; fixed?: number }> = ({ video, fixed }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #2a2416 0%, ${C.brown} 45%, #0b0a07 100%)` }}>
      {video ? (
        <AbsoluteFill style={{ opacity: fixed ?? interpolate(frame, [0, 50, 130, 180], [0, 0.6, 0.6, 0.26], { extrapolateRight: "clamp" }) }}>
          <Loop durationInFrames={1100}>
            <OffthreadVideo src={staticFile(video)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Loop>
        </AbsoluteFill>
      ) : null}
      <Glow color={C.green} x={300} y={250} r={420} seed={1} />
      <Glow color={C.goldDeep} x={1600} y={800} r={460} seed={2} />
      <Glow color="#1f4d1a" x={1500} y={150} r={360} seed={3} />
      {/* grade sutil em perspectiva */}
      <AbsoluteFill style={{ perspective: 900, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: -1000,
            right: -1000,
            top: 560,
            height: 1400,
            rotate: "x 72deg",
            transformOrigin: "50% 0",
            backgroundImage:
              "linear-gradient(rgba(227,185,63,.10) 2px, transparent 2px), linear-gradient(90deg, rgba(227,185,63,.10) 2px, transparent 2px)",
            backgroundSize: "120px 120px",
            backgroundPosition: `0 ${(frame * 1.2) % 120}px`,
            WebkitMaskImage: "linear-gradient(180deg, transparent, #000 30%, #000 60%, transparent)",
            maskImage: "linear-gradient(180deg, transparent, #000 30%, #000 60%, transparent)",
          }}
        />
      </AbsoluteFill>
      <Particles />
      {/* vinheta */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px 60px rgba(0,0,0,.85)" }} />
    </AbsoluteFill>
  );
};

/** Elementos que ficam por cima de tudo: grão e marca d'água */
export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='${frame % 8}' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />
    </AbsoluteFill>
  );
};
