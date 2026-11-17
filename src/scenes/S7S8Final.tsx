import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { DEPOIMENTO, EVENTO } from "../content";
import { clamp, Confetti, EASE_IN_OUT, EASE_OUT, Eyebrow, goldText, MaskWords, Rays, Shine, TrackIn, useExit, useSpring } from "../components/ui";

// ==================================================================
// 7 — Depoimento do mentor
// ==================================================================
export const S7Depoimento: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const box = interpolate(frame, [10, 45], [0, 1], { ...clamp, easing: EASE_OUT });
  const lower = useSpring(50, 18);
  const exit = useExit(dur - 20);
  const quote = useSpring(20, 12);
  return (
    <AbsoluteFill style={exit}>
      <div style={{ position: "absolute", left: 110, top: 80 }}>
        <Eyebrow n="06" text="Palavra do mentor" delay={4} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 260,
          top: 150,
          width: 1400,
          height: 788,
          borderRadius: 30,
          overflow: "hidden",
          background: "rgba(255,255,255,.04)",
          boxShadow: "0 40px 120px rgba(0,0,0,.6), 0 0 0 3px rgba(227,185,63,.65)",
          clipPath: `inset(${(1 - box) * 50}% ${(1 - box) * 50}% round 30px)`,
        }}
      >
        {DEPOIMENTO.video ? (
          <OffthreadVideo src={staticFile(DEPOIMENTO.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", border: "3px dashed rgba(227,185,63,.35)", borderRadius: 30 }}>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 340, lineHeight: 0.6, height: 170, color: C.gold, opacity: 0.9, scale: String(quote) }}>“</div>
            <div style={{ width: 1100, textAlign: "center" }}>
              <MaskWords
                text={DEPOIMENTO.frase}
                delay={40}
                stagger={4}
                style={{ justifyContent: "center", fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 90, lineHeight: 1.05, color: "#fff", textTransform: "uppercase" }}
              />
            </div>
            <div style={{ position: "absolute", bottom: 40, fontFamily: FONT_BODY, fontSize: 22, letterSpacing: 6, color: "rgba(255,255,255,.35)" }}>
              [ ESPAÇO PARA O VÍDEO DO DEPOIMENTO ]
            </div>
          </AbsoluteFill>
        )}
      </div>

      {/* lower third */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 800,
          display: "flex",
          alignItems: "stretch",
          translate: `${(1 - lower) * -200}px 0`,
          opacity: lower,
        }}
      >
        <div style={{ width: 14, background: C.yellow, borderRadius: 4 }} />
        <div style={{ padding: "18px 34px", background: "rgba(13,18,15,.88)", backdropFilter: "blur(6px)", borderRadius: "0 14px 14px 0" }}>
          <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 64, lineHeight: 1, textTransform: "uppercase", ...goldText(frame) }}>{DEPOIMENTO.nome}</div>
          <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 26, letterSpacing: 5, textTransform: "uppercase", color: C.cream }}>{DEPOIMENTO.cargo}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==================================================================
// 8 — Encerramento
// ==================================================================
const TODAS = ["Estar presente", "Educar", "Incluir", "Inspirar", "Melhorar", "Avançar", "Reconhecer", "Celebrar"];

export const S8Encerramento: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const per = 11;
  const montageEnd = TODAS.length * per + 10;
  const idx = Math.min(TODAS.length - 1, Math.floor(frame / per));
  const logo = useSpring(montageEnd, 16);
  const fadeOut = interpolate(frame, [dur - 30, dur], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const words = interpolate(frame, [montageEnd - 8, montageEnd], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: interpolate(frame, [montageEnd, montageEnd + 40], [0, 1], clamp) }}>
        <Rays size={2800} opacity={0.75} />
      </AbsoluteFill>

      {/* montagem rápida de palavras */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: words }}>
        <div
          key={idx}
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 200,
            textTransform: "uppercase",
            color: idx % 2 ? "#fff" : undefined,
            ...(idx % 2 ? {} : goldText(frame)),
            scale: String(interpolate(frame % per, [0, per], [1.15, 1])),
          }}
        >
          {TODAS[idx]}
        </div>
      </AbsoluteFill>

      {/* logo final */}
      {frame >= montageEnd ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", scale: String(0.6 + 0.4 * logo), opacity: logo, textAlign: "center" }}>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 250, lineHeight: 1, ...goldText(frame) }}>
              CI <span style={{ fontStyle: "italic", fontWeight: 600 }}>Awards</span>
            </div>
            <Shine at={montageEnd + 20} dur={34} />
          </div>
          <div style={{ marginTop: 10 }}>
            <TrackIn
              text={EVENTO.ano}
              delay={montageEnd + 20}
              style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 90, letterSpacing: 40, color: "#fff" }}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <TrackIn
              text={EVENTO.slogan}
              delay={montageEnd + 40}
              style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontWeight: 500, fontSize: 40, color: C.cream }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 70,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: 10,
              color: C.gold,
              opacity: interpolate(frame, [montageEnd + 60, montageEnd + 80], [0, 1], clamp),
            }}
          >
            CI200 · {EVENTO.unidade.toUpperCase()}
          </div>
        </AbsoluteFill>
      ) : null}
      <Confetti start={montageEnd} count={120} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
