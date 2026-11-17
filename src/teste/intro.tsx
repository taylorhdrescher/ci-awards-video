import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BlurWords, cl, F, K, OUT } from "./kit";

export const LOGO_LEN = 159;
export const ENTRADA_LEN = 157;
export const INTRO = LOGO_LEN + ENTRADA_LEN;
const SIGN = 65; // duração do plano da placa

const LogoAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [LOGO_LEN - 10, LOGO_LEN], [1, 1.6], { ...cl, easing: (t) => t * t * t });
  const b = interpolate(frame, [LOGO_LEN - 8, LOGO_LEN], [0, 18], cl);
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <OffthreadVideo src={staticFile("teste/abertura-logo.mp4")} muted style={{ width: "100%", height: "100%", scale: String(z), filter: `blur(${b}px)` }} />
    </AbsoluteFill>
  );
};

const Entrada: React.FC = () => {
  const frame = useCurrentFrame();
  const eb = interpolate(frame, [8, 22], [0, 1], { ...cl, easing: OUT });
  const ebOut = interpolate(frame, [SIGN - 8, SIGN], [1, 0], cl);
  const dim = interpolate(frame, [SIGN, SIGN + 14], [0, 0.45], cl);
  const sub = interpolate(frame, [SIGN + 34, SIGN + 48], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(frame, [ENTRADA_LEN - 7, ENTRADA_LEN], [0, 1], cl);
  const whipIn = interpolate(frame, [0, 7], [1, 0], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${whipIn * 24}px)`, translate: `${whipIn * 300}px 0` }}>
        <OffthreadVideo src={staticFile("teste/abertura-entrada.mp4")} muted style={{ width: "100%", height: "100%", scale: String(interpolate(frame, [0, ENTRADA_LEN], [1.04, 1.12])) }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.55), transparent 45%)" }} />
      <AbsoluteFill style={{ background: "#020302", opacity: dim }} />
      {/* plano da placa */}
      <div style={{ position: "absolute", left: 110, bottom: 110, opacity: eb * ebOut, translate: `0 ${(1 - eb) * 20}px`, fontFamily: F, color: "#fff" }}>
        <div style={{ width: 90 * eb, height: 4, background: K.yellow, marginBottom: 22 }} />
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.3em" }}>JOHN DEERE · MONTENEGRO</div>
        <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 8 }}>Onde a melhoria acontece.</div>
      </div>
      {/* plano das bandeiras: título */}
      <Sequence from={SIGN} layout="none">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", textShadow: "0 10px 40px rgba(0,0,0,.5)" }}>
          <BlurWords text="CI Awards" start={6} every={7} size={230} weight={800} color="#fff" accent={[1]} accentColor={K.neon} />
          <div style={{ marginTop: 24, display: "flex", gap: 28, alignItems: "center", opacity: sub, translate: `0 ${(1 - sub) * 20}px`, fontFamily: F }}>
            <div style={{ fontSize: 44, fontWeight: 800, padding: "10px 30px", borderRadius: 999, background: K.yellow, color: K.ink }}>2026</div>
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "0.25em", color: "#fff" }}>MELHORIA CONTÍNUA · CI200</div>
          </div>
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: K.paper, opacity: flash }} />
    </AbsoluteFill>
  );
};

export const Intro: React.FC = () => (
  <>
    <Sequence durationInFrames={LOGO_LEN}>
      <LogoAnim />
    </Sequence>
    <Sequence from={LOGO_LEN} durationInFrames={ENTRADA_LEN}>
      <Entrada />
    </Sequence>
  </>
);
