import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/ui";
import { BlurWords, cl, Count, Cursor, Dark, Dust, F, Flare, Footage, fmtBR, INOUT, K, OUT, Paper, useWhipIn, useWhipOut, Widget } from "./kit";

type P = { dur: number; voz: number };
const center: React.CSSProperties = { alignItems: "center", justifyContent: "center" };

// ---------------------------------------------------------------- 1
export const Abre1: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cam = interpolate(frame, [0, dur], [1, 1.06]);
  return (
    <Paper>
      <AbsoluteFill style={{ ...center, scale: String(cam), ...useWhipOut(dur, 6, "up") }}>
        <div style={{ position: "relative" }}>
          <BlurWords text="Melhoria contínua não é um projeto." start={18} every={5} size={120} accent={[0, 1]} width={1500} strike={5} strikeAt={46} />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------- 2
export const Abre2: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [16, 34], [1, 0], { ...cl, easing: OUT });
  return (
    <Paper glow="rgba(88,214,74,.18)">
      <AbsoluteFill style={{ ...center, ...useWhipIn(7, "up"), ...useWhipOut(dur, 6) }}>
        <div style={{ position: "relative" }}>
          <BlurWords text="É um jeito de trabalhar." start={2} every={4} size={150} accent={[2]} width={1700} />
          <svg width={420} height={60} viewBox="0 0 420 60" style={{ position: "absolute", left: 455, top: 160 }}>
            <path d="M5 40 C 120 10, 260 10, 415 32" fill="none" stroke={K.neon} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
          </svg>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------- 3 busca
export const Busca: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const q = "CI200";
  const typed = q.slice(0, Math.max(0, Math.floor(interpolate(frame, [30, 52], [0, q.length + 0.99], cl))));
  const barIn = spring({ frame, fps: 30, config: { damping: 14 } });
  const flash = interpolate(frame, [dur - 8, dur - 4, dur], [0, 1, 1], cl);
  return (
    <Paper glow="rgba(88,214,74,.22)">
      <AbsoluteFill style={{ ...center, ...useWhipIn(7) }}>
        <div style={{ position: "absolute", top: 250, width: 1600, left: 160 }}>
          <BlurWords text="Em Montenegro, esse jeito tem nome." start={2} every={4} size={78} weight={600} color="#3a3f39" accent={[1]} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 960 - 520,
            width: 1040,
            height: 130,
            borderRadius: 999,
            background: "#fff",
            boxShadow: "0 30px 80px rgba(30,60,30,.18), 0 0 0 2px rgba(0,0,0,.05)",
            display: "flex",
            alignItems: "center",
            padding: "0 50px",
            gap: 30,
            boxSizing: "border-box",
            scale: String(0.6 + 0.4 * barIn),
            opacity: barIn,
          }}
        >
          <svg width={52} height={52} viewBox="0 0 24 24">
            <circle cx={10.5} cy={10.5} r={7} fill="none" stroke={K.gray} strokeWidth={2.4} />
            <path d="M16 16l5 5" stroke={K.gray} strokeWidth={2.4} strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: F, fontSize: 66, fontWeight: 700, letterSpacing: "-0.03em", color: K.ink, flex: 1 }}>
            {typed || <span style={{ color: "#b9bdb6", fontWeight: 500 }}>Pesquisar…</span>}
            <span style={{ display: "inline-block", width: 5, height: 66, marginLeft: 6, background: K.green, verticalAlign: "middle", opacity: Math.floor(frame / 8) % 2 ? 1 : 0.15 }} />
          </div>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: K.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={40} height={40} viewBox="0 0 24 24">
              <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <Cursor path={[[20, 1500, 900], [56, 1420, 540], [64, 1420, 540]]} clicks={[62]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Paper>
  );
};

// ---------------------------------------------------------------- 4 logo CI200 em contorno
export const Logo: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.04, 0.94], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(zoom) }}>
        <OffthreadVideo src={staticFile("teste/abertura-logo.mp4")} startFrom={Math.max(0, 159 - dur - 10)} muted style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5 presente (luz)
export const Presente: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fx = interpolate(frame, [0, dur], [300, 1500], { ...cl, easing: INOUT });
  return (
    <Dark video={6.0} dim={0.5}>
      <Dust />
      <Flare x={fx} y={470} scale={1.1} />
      <AbsoluteFill style={{ ...center, ...useWhipOut(dur, 6) }}>
        <BlurWords text="ESTAR PRESENTE." start={4} every={7} size={170} weight={800} color="#fff" accent={[1]} accentColor={K.neon} />
      </AbsoluteFill>
    </Dark>
  );
};

// ---------------------------------------------------------------- 6 tela curva com vídeos
const TILES = [
  { src: "vid/grupo-gemba.mp4", label: "No Gemba" },
  { src: "vid/paineis.mp4", label: "Na gestão diária" },
  { src: "img/gemba-estande.jpg", label: "" },
  { src: "vid/facilitando.mp4", label: "Ao lado de cada time" },
];
export const Tela: React.FC<P> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [0.92, 1.08]);
  const rot = interpolate(frame, [0, dur], [10, -6]);
  const seg = voz / 3;
  const active = Math.min(2, Math.floor(frame / seg));
  const labels = ["No Gemba.", "Na gestão diária.", "Ao lado de cada time."];
  const focus = [0, 1, 3][active];
  return (
    <Dark glow="rgba(88,214,74,.22)">
      <AbsoluteFill style={{ perspective: 1400, ...useWhipIn(8) }}>
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 120,
            width: 1500,
            height: 760,
            transform: `rotateY(${rot}deg) rotateX(6deg) scale(${push})`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            borderRadius: "46% 46% 46% 46% / 9% 9% 9% 9%",
            overflow: "hidden",
            boxShadow: "0 0 120px rgba(88,214,74,.45), 0 0 0 3px rgba(255,255,255,.08)",
          }}
        >
          {TILES.map((t, i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden" }}>
              <Media src={t.src} style={{ width: "100%", height: "100%" }} durationInFrames={dur} zoom={[1.15, 1]} />
              <AbsoluteFill style={{ background: "#000", opacity: i === focus ? 0 : 0.55 }} />
            </div>
          ))}
        </div>
        {/* linhas tracejadas da curvatura */}
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: 0.5 }}>
          <path d="M150 90 Q960 10 1770 90" stroke="#fff" strokeDasharray="10 12" strokeWidth={2} fill="none" />
          <path d="M150 990 Q960 1070 1770 990" stroke="#fff" strokeDasharray="10 12" strokeWidth={2} fill="none" />
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center" }}>
        <div
          key={active}
          style={{
            fontFamily: F,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "-0.03em",
            color: K.ink,
            background: "#fff",
            borderRadius: 999,
            padding: "18px 44px",
            boxShadow: "0 20px 50px rgba(0,0,0,.4)",
            scale: String(interpolate(frame - active * seg, [0, 8], [0.7, 1], { ...cl, easing: OUT })),
          }}
        >
          {labels[active]}
        </div>
      </div>
    </Dark>
  );
};

// ---------------------------------------------------------------- 7 educa (cards UI com brilho)
const Pill: React.FC<{ text: string; on: number; x: number; y: number }> = ({ text, on, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: F,
      fontWeight: 700,
      fontSize: 44,
      letterSpacing: "-0.02em",
      padding: "20px 40px",
      borderRadius: 999,
      background: on > 0.5 ? K.green : "#fff",
      color: on > 0.5 ? "#fff" : K.ink,
      boxShadow: on > 0.5 ? `0 0 ${60 * on}px rgba(88,214,74,.7)` : "0 14px 40px rgba(0,0,0,.12)",
      scale: String(1 + Math.sin(on * Math.PI) * 0.08),
    }}
  >
    {text}
  </div>
);
export const Educa: React.FC<P> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const c1 = Math.round(voz * 0.55);
  const c2 = Math.round(voz * 0.85);
  const on1 = interpolate(frame, [c1, c1 + 6], [0, 1], cl);
  const on2 = interpolate(frame, [c2, c2 + 6], [0, 1], cl);
  const card = (d: number) => spring({ frame: frame - d, fps: 30, config: { damping: 15 } });
  return (
    <Paper glow="rgba(88,214,74,.2)">
      <AbsoluteFill style={{ ...useWhipIn(8, "up"), ...useWhipOut(dur, 6) }}>
        <div style={{ position: "absolute", left: 140, top: 150 }}>
          <BlurWords text="A gente educa." start={0} every={5} size={130} align="left" width={800} accent={[2]} />
          <div style={{ marginTop: 30, fontFamily: F, fontSize: 40, fontWeight: 500, color: "#555b54", width: 640, opacity: interpolate(frame, [14, 26], [0, 1], cl) }}>
            Formando pessoas para resolver problemas de verdade.
          </div>
        </div>
        <div style={{ position: "absolute", left: 1000, top: 140, width: 760, height: 520, borderRadius: 40, overflow: "hidden", scale: String(0.8 + 0.2 * card(6)), opacity: card(6), rotate: `${(1 - card(6)) * 6}deg`, boxShadow: "0 0 0 10px #fff, 0 40px 100px rgba(30,60,30,.25)" }}>
          <Media src="img/a3-apresentacao.jpg" style={{ width: "100%", height: "100%" }} durationInFrames={dur} zoom={[1.1, 1]} />
        </div>
        <Pill text="Pensamento A3" on={on1} x={180} y={640} />
        <Pill text="Ver e Agir" on={on2} x={700} y={640} />
        <Cursor path={[[10, 1500, 950], [c1 - 4, 380, 690], [c2 - 6, 830, 690], [dur, 860, 720]]} clicks={[c1, c2]} />
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------- 8 inclui (órbita de pessoas)
const AVATARES = [
  ["img/reconhecimento-grupo.jpg", "30% 30%"],
  ["img/time-selfie.jpg", "50% 30%"],
  ["img/reconhecimento-dupla.jpg", "40% 30%"],
  ["img/estande-apresentacao.jpg", "50% 20%"],
  ["img/reconhecimento-log.jpg", "60% 30%"],
  ["img/m-evento-plateia.jpg", "50% 40%"],
  ["img/reconhecimento-dto-solda.jpg", "50% 30%"],
  ["img/m-feira-estande.jpg", "50% 40%"],
];
export const Inclui: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const R = 330;
  const spin = frame * 0.6;
  const ring = interpolate(frame, [0, 20], [0, 1], { ...cl, easing: OUT });
  return (
    <Paper glow="rgba(88,214,74,.16)">
      <AbsoluteFill style={{ ...useWhipIn(7), ...useWhipOut(dur, 6) }}>
        <div style={{ position: "absolute", left: 140, top: 360 }}>
          <BlurWords text="Todo mundo." start={4} every={5} size={120} align="left" width={800} />
          <BlurWords text="Todas as áreas." start={22} every={5} size={110} align="left" width={900} accent={[2]} />
        </div>
        <div style={{ position: "absolute", left: 1420, top: 540 }}>
          <svg width={2 * R + 40} height={2 * R + 40} style={{ position: "absolute", left: -R - 20, top: -R - 20 }}>
            <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={K.green} strokeOpacity={0.5} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
          </svg>
          <div style={{ position: "absolute", left: -150, top: -150, width: 300, height: 300, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 8px #fff, 0 0 80px rgba(88,214,74,.5)", scale: String(ring) }}>
            <Img src={staticFile("img/time-ci.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {AVATARES.map(([src, pos], i) => {
            const a = ((i / AVATARES.length) * 360 + spin) * (Math.PI / 180);
            const s = spring({ frame: frame - 6 - i * 3, fps: 30, config: { damping: 12 } });
            return (
              <div key={i} style={{ position: "absolute", left: Math.cos(a) * R - 70, top: Math.sin(a) * R - 70, width: 140, height: 140, borderRadius: "50%", overflow: "hidden", scale: String(s), boxShadow: "0 0 0 6px #fff, 0 16px 40px rgba(0,0,0,.2)" }}>
                <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------- 9 pergunta
export const Pergunta: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Dark video={9.0} dim={0.5}>
      <Dust />
      <Flare x={interpolate(frame, [0, dur], [1500, 500])} y={300} scale={0.8} opacity={0.8} />
      <AbsoluteFill style={{ ...center }}>
        <BlurWords text="E o resultado de FY26?" start={2} every={5} size={140} color="#fff" accent={[4]} accentColor={K.neon} />
      </AbsoluteFill>
    </Dark>
  );
};

// ---------------------------------------------------------------- 10/11 números (anel)
const Ring: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const R = 300;
  const C = 2 * Math.PI * R;
  return (
    <svg width={2 * R + 80} height={2 * R + 80} style={{ position: "absolute", left: 960 - R - 40, top: 520 - R - 40, rotate: "-90deg" }}>
      <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke="#dfe2dc" strokeWidth={44} />
      <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={K.green} strokeWidth={44} strokeLinecap="round" strokeDasharray={`${C * a} ${C}`} />
      {b > 0 ? (
        <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={K.yellow} strokeWidth={44} strokeLinecap="round" strokeDasharray={`${C * b} ${C}`} strokeDashoffset={-C * (a + 0.012)} />
      ) : null}
    </svg>
  );
};
const PCT = 6066 / 9044;
export const Num1: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [4, 50], [0, PCT], { ...cl, easing: OUT });
  return (
    <Paper>
      <AbsoluteFill style={{ ...useWhipIn(6, "up") }}>
        <Ring a={a} b={0} />
        <AbsoluteFill style={{ ...center, flexDirection: "column", translate: "0 -20px" }}>
          <Count to={6066} start={4} dur={46} style={{ fontFamily: F, fontWeight: 800, fontSize: 190, letterSpacing: "-0.06em", color: K.ink, lineHeight: 1 }} />
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: 40, color: K.green, marginTop: 10 }}>projetos concluídos</div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Paper>
  );
};
export const Num2: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const b = interpolate(frame, [6, 60], [0, 1 - PCT - 0.024], { ...cl, easing: OUT });
  const swap = interpolate(frame, [0, 10], [0, 1], { ...cl, easing: OUT });
  const tot = interpolate(frame, [dur - 40, dur - 28], [0, 1], { ...cl, easing: OUT });
  return (
    <Paper>
      <Ring a={PCT} b={b} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", translate: "0 -20px", opacity: 1 - tot }}>
        <div style={{ filter: `blur(${(1 - swap) * 10}px)`, opacity: swap, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Count to={2978} start={6} dur={50} style={{ fontFamily: F, fontWeight: 800, fontSize: 190, letterSpacing: "-0.06em", color: K.ink, lineHeight: 1 }} />
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: 40, color: "#b08f00", marginTop: 10 }}>em andamento</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ ...center, flexDirection: "column", translate: "0 -20px", opacity: tot, filter: `blur(${(1 - tot) * 10}px)` }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 190, letterSpacing: "-0.06em", color: K.ink, lineHeight: 1 }}>{fmtBR(9044)}</div>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 40, color: K.ink, marginTop: 10 }}>projetos em FY26</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 120, fontFamily: F, fontWeight: 600, fontSize: 30, letterSpacing: "0.2em", color: K.gray }}>RESULTADOS · FY26</div>
    </Paper>
  );
};

// ---------------------------------------------------------------- 12 widgets (bento iOS)
const Bar: React.FC<{ v: number; color: string; h?: number }> = ({ v, color, h = 22 }) => (
  <div style={{ height: h, borderRadius: h, background: "rgba(127,127,127,.18)", overflow: "hidden" }}>
    <div style={{ width: `${v * 100}%`, height: "100%", borderRadius: h, background: color }} />
  </div>
);
const Label: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontSize: 30, fontWeight: 600, color: dark ? "rgba(255,255,255,.65)" : "#6b7069", letterSpacing: "-0.01em" }}>{children}</div>
);
export const Widgets: React.FC<P> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  // pontos de foco sincronizados com as três frases
  const f1 = 0;
  const f2 = Math.round(voz * 0.36);
  const f3 = Math.round(voz * 0.62);
  const f4 = voz + 4;
  const cams: [number, number, number, number][] = [
    // frame, x, y, zoom (centro da câmera no "mundo")
    [f1, 700, 430, 1.55],
    [f1 + 50, 760, 450, 1.45],
    [f2, 1420, 400, 1.6],
    [f2 + 40, 1440, 420, 1.5],
    [f3, 1290, 860, 1.6],
    [f3 + 40, 1280, 840, 1.5],
    [f4, 1100, 640, 0.86],
    [dur, 1100, 640, 0.82],
  ];
  const fs = cams.map((c) => c[0]);
  const cx = interpolate(frame, fs, cams.map((c) => c[1]), { ...cl, easing: INOUT });
  const cy = interpolate(frame, fs, cams.map((c) => c[2]), { ...cl, easing: INOUT });
  const z = interpolate(frame, fs, cams.map((c) => c[3]), { ...cl, easing: INOUT });
  const pilares = [
    ["Segurança", 1239, "#ff7a1a"],
    ["Qualidade", 1165, "#f2b705"],
    ["Produtividade", 2697, K.green],
    ["Meio Amb.", 451, "#7cc46a"],
    ["Custos", 479, "#c47b3d"],
    ["Moral", 35, "#2fb5ac"],
  ] as const;
  const grow = (d: number) => interpolate(frame, [d, d + 40], [0, 1], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ background: K.paper2, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #fbfcf9, #dfe2db 80%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 2200, height: 1280, transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }}>
        {/* Produtividade */}
        <Widget x={340} y={180} w={760} h={500} dark>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: K.green, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30 }}>P</div>
            <Label dark>Produtividade</Label>
          </div>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.06em", marginTop: 40, lineHeight: 1 }}>
            <Count to={580.14} dec={2} start={f1 + 4} dur={45} />
            <span style={{ fontSize: 56, color: K.neon, letterSpacing: "-0.01em" }}> mil min</span>
          </div>
          <div style={{ marginTop: 50 }}>
            <Bar v={grow(f1 + 4) * 0.82} color={K.neon} h={28} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 26, color: "rgba(255,255,255,.6)" }}>
            <span>2.697 concluídos</span>
            <span>881 em andamento</span>
          </div>
        </Widget>
        {/* Custos */}
        <Widget x={1140} y={180} w={560} h={500} bg={K.green} style={{ color: "#fff" }}>
          <Label dark>Custos</Label>
          <div style={{ fontSize: 170, fontWeight: 800, letterSpacing: "-0.06em", marginTop: 60, lineHeight: 1 }}>
            <Count to={3} start={f2 + 2} dur={30} prefix="R$ " />
            <span style={{ fontSize: 80, letterSpacing: "-0.01em" }}> mi</span>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
            <div style={{ flex: 1.21, height: 70, borderRadius: 18, background: "rgba(255,255,255,.35)", scale: `${grow(f2 + 8)} 1`, transformOrigin: "left" }} />
            <div style={{ flex: 1.98, height: 70, borderRadius: 18, background: K.yellow, scale: `${grow(f2 + 14)} 1`, transformOrigin: "left" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 24, opacity: 0.8 }}>
            <span>Estrutural 1,21</span>
            <span>Avoidance 1,98</span>
          </div>
        </Widget>
        {/* Projetos por pilar */}
        <Widget x={340} y={720} w={760} h={420}>
          <Label>Projetos concluídos por pilar</Label>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 250, marginTop: 30 }}>
            {pilares.map(([n, v, c], i) => (
              <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{fmtBR(v)}</div>
                <div style={{ width: "100%", height: (v / 2697) * 170 * grow(10 + i * 4), minHeight: 6, borderRadius: 14, background: c }} />
                <div style={{ fontSize: 18, color: "#6b7069", whiteSpace: "nowrap" }}>{n}</div>
              </div>
            ))}
          </div>
        </Widget>
        {/* Segurança */}
        <Widget x={1140} y={720} w={360} h={420}>
          <Label>Segurança</Label>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.05em", marginTop: 30, color: K.orange }}>
            <Count to={5716} start={f3 + 2} dur={36} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#6b7069" }}>pontos de RPN</div>
          <div style={{ display: "flex", gap: 8, marginTop: 40, alignItems: "flex-end", height: 90 }}>
            {[0.4, 0.6, 0.75, 0.9, 1].map((h, i) => (
              <div key={i} style={{ flex: 1, height: 90 * h * grow(f3 + 6 + i * 3), borderRadius: 10, background: i < 4 ? K.orange : "#ffd2b0" }} />
            ))}
          </div>
        </Widget>
        {/* Qualidade + Meio ambiente + Moral */}
        <Widget x={1540} y={720} w={360} h={200}>
          <Label>Qualidade</Label>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.05em", color: "#d39c00" }}>
            972 <span style={{ fontSize: 28, color: "#6b7069", letterSpacing: "0.02em" }}>RPN</span>
          </div>
        </Widget>
        <Widget x={1540} y={940} w={360} h={200} dark>
          <Label dark>Meio Ambiente</Label>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.05em", color: "#8fd16f" }}>
            1 mil <span style={{ fontSize: 28, color: "rgba(255,255,255,.6)", letterSpacing: "0.02em" }}>RPN</span>
          </div>
        </Widget>
        <Widget x={1740} y={180} w={360} h={500} bg="#e9f6e4">
          <Label>Moral</Label>
          <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.05em", color: "#1d7f77", marginTop: 20 }}>35</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#6b7069" }}>projetos</div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 10, fontSize: 24 }}>
            <span>Ambiente · 18</span>
            <span>Educação · 9</span>
            <span>Bem-Estar · 8</span>
          </div>
        </Widget>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 13 virada
export const Virada: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Dark video={12.0} dim={0.5}>
      <Flare x={960} y={interpolate(frame, [0, dur], [700, 640])} scale={interpolate(frame, [0, dur], [0.3, 1.2])} opacity={0.9} />
      <AbsoluteFill style={{ ...center }}>
        <BlurWords text="Mas nenhum número acontece sozinho." start={2} every={5} size={110} color="#fff" accent={[4]} accentColor={K.neon} width={1500} />
      </AbsoluteFill>
    </Dark>
  );
};

// ---------------------------------------------------------------- 14 trimestre (widget de calendário)
export const Trimestre: React.FC<P> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const s = (d: number) => spring({ frame: frame - d, fps: 30, config: { damping: 14 } });
  const qOn = (row: number, q: number) => interpolate(frame, [20 + q * 12 + row * 6, 26 + q * 12 + row * 6], [0, 1], cl);
  return (
    <Paper glow="rgba(88,214,74,.14)">
      <AbsoluteFill style={{ ...useWhipIn(8, "up"), ...useWhipOut(dur, 6) }}>
        <div style={{ position: "absolute", left: 140, top: 110 }}>
          <BlurWords text="Destaques trimestrais" start={0} every={6} size={96} align="left" width={1200} accent={[1]} />
        </div>
        <Widget x={140} y={330} w={820} h={600} dark style={{ scale: String(0.85 + 0.15 * s(4)), opacity: s(4) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Reconhecimento</div>
            <div style={{ fontSize: 26, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,.12)" }}>FY26</div>
          </div>
          {["A3", "Ver e Agir"].map((r, row) => (
            <div key={r} style={{ marginTop: 60 }}>
              <div style={{ fontSize: 30, color: "rgba(255,255,255,.65)", marginBottom: 20 }}>{r}</div>
              <div style={{ display: "flex", gap: 26 }}>
                {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
                  const on = qOn(row, i);
                  return (
                    <div
                      key={q}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 40,
                        fontWeight: 800,
                        background: on > 0.5 ? (row ? K.yellow : K.neon) : "transparent",
                        border: `4px solid ${row ? K.yellow : K.neon}`,
                        color: on > 0.5 ? K.ink : "#fff",
                        scale: String(1 + Math.sin(on * Math.PI) * 0.15),
                      }}
                    >
                      {q}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Widget>
        <div style={{ position: "absolute", left: 1040, top: 200, width: 740, height: 440, borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 10px #fff, 0 40px 90px rgba(0,0,0,.2)", scale: String(s(Math.round(voz * 0.4))), rotate: "-2deg" }}>
          <Img src={staticFile("img/reconhecimento-dto-solda.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", left: 1160, top: 600, width: 640, height: 380, borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 10px #fff, 0 40px 90px rgba(0,0,0,.2)", scale: String(s(Math.round(voz * 0.6))), rotate: "3deg" }}>
          <Img src={staticFile("img/reconhecimento-log.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------- 15 eventos (tela curva de fotos)
const EV = ["img/concurso-brasileiro.jpg", "img/m-feira-estande.jpg", "img/m-evento-plateia.jpg", "img/m-feira-quadro.jpg", "img/time-ci.jpg", "img/m-evento-palco.jpg", "img/m-feira-gemba.jpg", "img/gemba-estande.jpg"];
export const Eventos: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const W = 560;
  const pan = interpolate(frame, [0, dur], [0, -(EV.length * (W + 30) - 1700)], { ...cl, easing: INOUT });
  return (
    <Dark glow="rgba(88,214,74,.25)">
      <AbsoluteFill style={{ perspective: 900, ...useWhipIn(8) }}>
        <div style={{ position: "absolute", left: 110, top: 250, display: "flex", gap: 30, translate: `${pan}px 0` }}>
          {EV.map((src, i) => {
            const cx = 110 + pan + i * (W + 30) + W / 2 - 960;
            const ry = interpolate(cx, [-1100, 0, 1100], [-38, 0, 38], cl);
            return (
              <div key={i} style={{ width: W, height: 600, flexShrink: 0, borderRadius: 34, overflow: "hidden", transform: `rotateY(${ry}deg) translateZ(${-Math.abs(cx) * 0.15}px)`, boxShadow: "0 0 60px rgba(88,214,74,.3)" }}>
                <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center" }}>
        <BlurWords text="Feiras. Eventos. Gemba." start={2} every={8} size={84} color="#fff" accent={[1]} accentColor={K.neon} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", fontFamily: F, fontSize: 34, fontWeight: 500, color: "rgba(255,255,255,.7)", opacity: interpolate(frame, [30, 45], [0, 1], cl) }}>
        Do Concurso Brasileiro de Projetos Participativos às feiras internas.
      </div>
    </Dark>
  );
};

// ---------------------------------------------------------------- 16 palavras (cortes secos)
const PAL: { w: string; bg: string; c: string; video?: number }[] = [
  { w: "MELHORAR.", bg: K.paper, c: K.ink },
  { w: "AVANÇAR.", bg: K.black, c: "#fff", video: 19.6 },
  { w: "RECONHECER.", bg: K.green, c: "#fff" },
  { w: "CELEBRAR.", bg: K.black, c: K.neon, video: 23.0 },
];
export const Palavras: React.FC<P> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const seg = voz / 4;
  const i = Math.min(3, Math.floor(frame / seg));
  const local = frame - i * seg;
  const p = PAL[i];
  const t = interpolate(local, [0, 6], [0, 1], { ...cl, easing: OUT });
  const lines = new Array(9).fill(0);
  return (
    <AbsoluteFill style={{ background: p.bg, overflow: "hidden" }}>
      {p.video !== undefined ? (
        <Sequence from={Math.round(i * seg)} layout="none">
          <Footage at={p.video} dim={0.45} />
        </Sequence>
      ) : null}
      {i % 2 === 1
        ? lines.map((_, k) => (
            <div key={k} style={{ position: "absolute", left: 1500 + k * 22, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,.25)", scale: `1 ${interpolate(local, [k, k + 8], [0, 1], cl)}`, transformOrigin: "top" }} />
          ))
        : null}
      <div style={{ position: "absolute", left: 130, top: 120, fontFamily: F, fontWeight: 600, fontSize: 28, letterSpacing: "0.2em", color: p.c, opacity: 0.6 }}>0{i + 1}</div>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 130 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: i === 2 ? 230 : 260, letterSpacing: "-0.06em", color: p.c, opacity: t, filter: `blur(${(1 - t) * 16}px)`, translate: `${(1 - t) * 80}px 0`, scale: String(interpolate(local, [0, seg], [1, 1.04])) }}>
          {p.w}
        </div>
      </AbsoluteFill>
      {frame > voz ? <AbsoluteFill style={{ background: K.paper, opacity: interpolate(frame, [voz, dur], [0, 1], cl) }} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 17 mentor
export const Mentor: React.FC<P> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameIn = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const lower = spring({ frame: frame - voz + 10, fps, config: { damping: 15 } });
  return (
    <Paper glow="rgba(88,214,74,.15)">
      <AbsoluteFill style={{ ...useWhipOut(dur, 6, "up") }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
          <BlurWords text="A palavra do mentor" start={0} every={5} size={64} weight={700} accent={[3]} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 960 - 640,
            top: 190,
            width: 1280,
            height: 720,
            borderRadius: 44,
            background: "#0e100e",
            overflow: "hidden",
            scale: String(0.7 + 0.3 * frameIn),
            opacity: frameIn,
            boxShadow: "0 50px 120px rgba(30,60,30,.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={56} height={56} viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="#fff" />
            </svg>
          </div>
          <div style={{ fontFamily: F, fontSize: 30, letterSpacing: "0.2em", color: "rgba(255,255,255,.5)" }}>ESPAÇO PARA O VÍDEO DO DEPOIMENTO</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 960 - 640 + 50,
            top: 190 + 720 - 160,
            background: "#fff",
            borderRadius: 28,
            padding: "22px 34px",
            fontFamily: F,
            boxShadow: "0 20px 50px rgba(0,0,0,.25)",
            opacity: lower,
            translate: `${(1 - lower) * -60}px 0`,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", color: K.ink }}>Mercio Ruyz</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: K.green }}>Mentor · Melhoria Contínua</div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------- 18 pessoas (mosaico)
const MOS = ["img/reconhecimento-grupo.jpg", "img/time-selfie.jpg", "img/m-evento-premiacao.jpg", "img/reconhecimento-dupla.jpg", "img/time-ci.jpg", "img/a3-apresentacao.jpg", "img/reconhecimento-log.jpg", "img/estande-apresentacao.jpg", "img/m-evento-linha.jpg"];
export const Pessoas: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.25, 1.0], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ background: K.black, overflow: "hidden" }}>
      <AbsoluteFill style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 10, scale: String(zoom) }}>
        {MOS.map((src, i) => {
          const s = interpolate(frame, [i * 2, i * 2 + 10], [0, 1], { ...cl, easing: OUT });
          return (
            <div key={i} style={{ overflow: "hidden", borderRadius: 18, opacity: s, scale: String(0.8 + 0.2 * s) }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(3,4,3,.55), rgba(3,4,3,.85))" }} />
      <AbsoluteFill style={{ ...center }}>
        <BlurWords text="Melhoria contínua é feita de pessoas." start={6} every={5} size={120} color="#fff" accent={[5]} accentColor={K.neon} width={1500} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 19 final
export const Final: React.FC<P> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame, fps, config: { damping: 12 } });
  const slide = interpolate(frame, [14, 30], [0, 1], { ...cl, easing: OUT });
  const year = interpolate(frame, [30, 44], [0, 1], { ...cl, easing: OUT });
  const fade = interpolate(frame, [dur - 20, dur], [0, 1], cl);
  return (
    <Paper glow="rgba(88,214,74,.18)">
      <AbsoluteFill style={{ ...center }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ width: 170, height: 170, borderRadius: 48, background: K.green, display: "flex", alignItems: "center", justifyContent: "center", scale: String(mark), rotate: `${(1 - mark) * -90}deg`, boxShadow: "0 20px 60px rgba(47,143,34,.45)" }}>
            <svg width={100} height={100} viewBox="0 0 24 24">
              <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ overflow: "hidden", width: 1000 * slide }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 200, letterSpacing: "-0.06em", color: K.ink, whiteSpace: "nowrap", lineHeight: 1 }}>
              CI <span style={{ color: K.green }}>Awards</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 30, alignItems: "center", opacity: year, translate: `0 ${(1 - year) * 20}px`, fontFamily: F }}>
          <div style={{ fontSize: 44, fontWeight: 800, padding: "10px 30px", borderRadius: 999, background: K.ink, color: K.yellow }}>2026</div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.25em", color: "#555b54" }}>CI200 · JOHN DEERE · MONTENEGRO</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </Paper>
  );
};
