import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { RECONHECIMENTO } from "../content";
import { clamp, Confetti, EASE_IN_OUT, EASE_OUT, Eyebrow, goldText, MaskWords, MediaCard, Rays, useExit, useSpring } from "../components/ui";

const PhotoColumn: React.FC<{ fotos: string[]; x: number; speed: number; offset: number }> = ({ fotos, x, speed, offset }) => {
  const frame = useCurrentFrame();
  const H = 420;
  const loop = fotos.length * (H + 30);
  const y = -((frame * speed + offset) % loop) - (speed < 0 ? loop : 0);
  const list = [...fotos, ...fotos, ...fotos];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560 }}>
      {list.map((f, i) => (
        <div key={i} style={{ width: 560, height: H, marginBottom: 30, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.5), 0 0 0 2px rgba(227,185,63,.4)" }}>
          <Img src={staticFile(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
    </div>
  );
};

const BigWord: React.FC<{ word: string; len: number }> = ({ word, len }) => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 12, 0.8);
  const out = interpolate(frame, [len - 10, len], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: FONT_TITLE,
          fontWeight: 800,
          fontSize: 260,
          textTransform: "uppercase",
          letterSpacing: interpolate(frame, [0, len], [4, 20]),
          scale: String(interpolate(s, [0, 1], [1.8, 1]) + out * 0.3),
          opacity: Math.min(1, s * 1.5) * (1 - out),
          filter: `blur(${(1 - s) * 20 + out * 20}px) drop-shadow(0 10px 40px rgba(0,0,0,.8))`,
          ...goldText(frame + 40),
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

const Badge: React.FC<{ title: string; x: number; delay: number; color: string }> = ({ title, x, delay, color }) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 520,
        width: 360,
        height: 330,
        borderRadius: 30,
        padding: 30,
        boxSizing: "border-box",
        background: "linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03))",
        border: "1px solid rgba(255,255,255,.16)",
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 30px 70px rgba(0,0,0,.5)",
        opacity: s,
        scale: String(0.7 + 0.3 * s),
      }}
    >
      <svg width={84} height={84} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>
        <path
          d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginTop: 10 }}>Projeto destaque</div>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 70, lineHeight: 1, color: "#fff", textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
          const on = interpolate(frame, [delay + 25 + i * 10, delay + 35 + i * 10], [0, 1], clamp);
          return (
            <div
              key={q}
              style={{
                width: 66,
                height: 44,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_TITLE,
                fontWeight: 700,
                fontSize: 26,
                background: on > 0.5 ? color : "rgba(255,255,255,.1)",
                color: on > 0.5 ? C.ink : "rgba(255,255,255,.5)",
                scale: String(1 + Math.sin(on * Math.PI) * 0.25),
              }}
            >
              {q}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const S5Reconhecimento: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const words = RECONHECIMENTO.palavras;
  const wLen = 80;
  const wStart = 20;
  const partB = wStart + words.length * wLen + 20; // ~360
  const toB = interpolate(frame, [partB - 20, partB + 20], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const fotos = RECONHECIMENTO.fotos;
  const exit = useExit(dur - 20);
  const wallIn = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: EASE_OUT });
  const flash = words.map((_, i) => interpolate(frame, [wStart + i * wLen, wStart + i * wLen + 3, wStart + i * wLen + 14], [0, 0.35, 0], clamp)).reduce((a, b) => a + b, 0);

  return (
    <AbsoluteFill style={exit}>
      {/* mural de fotos 3D */}
      <AbsoluteFill style={{ perspective: 1600, opacity: wallIn * (1 - toB * 0.8) }}>
        <div
          style={{
            position: "absolute",
            left: -200,
            top: -300,
            width: 2400,
            height: 1700,
            transform: `rotateX(24deg) rotateZ(-10deg) scale(${1.05 + frame * 0.0005})`,
          }}
        >
          <PhotoColumn fotos={fotos} x={0} speed={1.6} offset={0} />
          <PhotoColumn fotos={[...fotos].reverse()} x={600} speed={-1.6} offset={200} />
          <PhotoColumn fotos={fotos.slice(2).concat(fotos.slice(0, 2))} x={1200} speed={1.6} offset={500} />
          <PhotoColumn fotos={fotos.slice(4).concat(fotos.slice(0, 4))} x={1800} speed={-1.6} offset={100} />
        </div>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(13,10,6,.55), rgba(13,10,6,.92))" }} />
      </AbsoluteFill>

      {/* palavras */}
      {words.map((w, i) => (
        <Sequence key={w} from={wStart + i * wLen} durationInFrames={wLen}>
          <BigWord word={w} len={wLen} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: C.goldLight, opacity: flash, mixBlendMode: "screen" }} />
      <Confetti start={wStart + 3 * wLen} count={110} />

      {/* parte B: destaques trimestrais */}
      {frame >= partB - 20 ? (
        <AbsoluteFill style={{ opacity: toB }}>
          <Rays size={2000} opacity={0.4} x="25%" y="60%" />
          <div style={{ position: "absolute", left: 110, top: 80 }}>
            <Eyebrow n="04" text="Reconhecimento" delay={partB} />
          </div>
          <div style={{ position: "absolute", left: 110, top: 150, width: 800 }}>
            <MaskWords
              text="Destaques trimestrais"
              delay={partB + 6}
              stagger={6}
              style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 130, lineHeight: 0.95, textTransform: "uppercase", color: "#fff" }}
              wordStyle={(i) => (i === 1 ? goldText(frame) : {})}
            />
          </div>
          <div style={{ position: "absolute", left: 110, top: 430, width: 760 }}>
            <MaskWords
              text="A cada trimestre, os melhores projetos são reconhecidos no Gemba."
              delay={partB + 24}
              stagger={2}
              style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 34, lineHeight: 1.3, color: C.cream }}
            />
          </div>
          <Badge title="A3" x={110} delay={partB + 40} color={C.lime} />
          <Badge title="Ver e Agir" x={500} delay={partB + 55} color={C.amber} />

          <MediaCard src="img/reconhecimento-dto-solda.jpg" x={960} y={150} w={620} h={465} delay={partB + 20} rot={-3} from="right" durationInFrames={300} />
          <MediaCard src="img/reconhecimento-log.jpg" x={1230} y={470} w={580} h={435} delay={partB + 36} rot={4} from="right" durationInFrames={300} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
