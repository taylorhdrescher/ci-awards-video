import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { EDUCAR } from "../content";
import { clamp, EASE_IN_OUT, EASE_OUT, Eyebrow, MaskWords, Media, useExit } from "../components/ui";

const Word: React.FC<{ palavra: string; texto: string; len: number; last: boolean }> = ({ palavra, texto, len, last }) => {
  const frame = useCurrentFrame();
  const out = last ? 0 : interpolate(frame, [len - 16, len], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  return (
    <div style={{ opacity: 1 - out, translate: `0 ${-out * 60}px`, filter: `blur(${out * 10}px)` }}>
      <MaskWords
        text={palavra}
        delay={4}
        style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 210, lineHeight: 1, textTransform: "uppercase" }}
        gold
      />
      <div style={{ marginTop: 28, width: 680 }}>
        <MaskWords
          text={texto}
          delay={16}
          stagger={2}
          style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 46, lineHeight: 1.25, color: C.cream }}
        />
      </div>
    </div>
  );
};

const Slide: React.FC<{ src: string; tipo: "img" | "video"; len: number }> = ({ src, tipo, len }) => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [0, 28], [0, 150], { ...clamp, easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}% at 100% 50%)` }}>
      <Media src={src} tipo={tipo} style={{ width: "100%", height: "100%" }} zoom={[1.15, 1.0]} durationInFrames={len + 40} />
    </AbsoluteFill>
  );
};

export const S3Educar: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const seg = Math.floor(dur / EDUCAR.length);
  const active = Math.min(EDUCAR.length - 1, Math.floor(frame / seg));
  const frameIn = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: EASE_OUT });
  const exit = useExit(dur - 20);
  const rotY = interpolate(frame, [0, dur], [-12, -4], clamp);

  return (
    <AbsoluteFill style={exit}>
      <div style={{ position: "absolute", left: 110, top: 80 }}>
        <Eyebrow n="02" text="Como educamos" delay={4} />
      </div>

      {/* texto */}
      <div style={{ position: "absolute", left: 110, top: 300 }}>
        {EDUCAR.map((e, i) => (
          <Sequence key={e.palavra} from={i * seg} durationInFrames={i === EDUCAR.length - 1 ? dur - i * seg : seg} layout="none">
            <Word palavra={e.palavra} texto={e.texto} len={seg} last={i === EDUCAR.length - 1} />
          </Sequence>
        ))}
      </div>

      {/* indicador */}
      <div style={{ position: "absolute", left: 114, top: 860, display: "flex", gap: 14 }}>
        {EDUCAR.map((e, i) => {
          const fill = interpolate(frame, [i * seg, (i + 1) * seg], [0, 1], clamp);
          return (
            <div key={i} style={{ width: 160 }}>
              <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,.18)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${fill * 100}%`, background: C.gold }} />
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: i === active ? C.gold : "rgba(255,255,255,.45)",
                }}
              >
                {String(i + 1).padStart(2, "0")} {e.palavra}
              </div>
            </div>
          );
        })}
      </div>

      {/* mídia */}
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 190,
            width: 900,
            height: 660,
            rotate: `y ${rotY}deg`,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 40px 120px rgba(0,0,0,.6), 0 0 0 3px rgba(227,185,63,.6)",
            clipPath: `inset(0 ${(1 - frameIn) * 100}% 0 0 round 28px)`,
          }}
        >
          {EDUCAR.map((e, i) => (
            <Sequence key={e.src} from={i * seg} layout="none">
              <Slide src={e.src} tipo={e.tipo} len={seg} />
            </Sequence>
          ))}
          <AbsoluteFill style={{ background: "linear-gradient(200deg, transparent 50%, rgba(13,18,15,.6))" }} />
        </div>
        {/* moldura decorativa */}
        <div
          style={{
            position: "absolute",
            left: 940,
            top: 230,
            width: 900,
            height: 660,
            rotate: `y ${rotY}deg`,
            borderRadius: 28,
            border: `2px solid ${C.green}`,
            opacity: 0.7 * frameIn,
            zIndex: -1,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
