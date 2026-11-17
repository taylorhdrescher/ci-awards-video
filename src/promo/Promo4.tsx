/**
 * Clique Motion — v4: roteiro novo + "tela rolando para baixo" em 3D.
 * Todo o conteúdo fica num plano inclinado (rotateX) que desce: os elementos nascem no alto/fundo,
 * descem em direção à câmera e saem por baixo. Piso poligonal correndo, partículas caindo, paralaxe.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import VO from "./vo4.json";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { Celular, cl, Cursor, F, Fumaca, glow, Grande, IN, INOUT, MARCA, mix, OUT, P, Pequeno, Voo } from "./Promo3";

type S = { dur: number; voz: number };

// ================================================================== mundo: piso poligonal correndo + partículas caindo
const PTS = new Array(60).fill(0).map((_, i) => [random(`hx${i}`) * 1800 - 360, random(`hy${i}`) * 2400]);
const EDGES: [number, number][] = [];
PTS.forEach((p, i) => {
  const d = PTS.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])] as [number, number]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
  d.slice(0, 3).forEach(([j]) => { if (i < j) EDGES.push([i, j]); });
});
const Malha: React.FC<{ col: string; frame: number }> = ({ col, frame }) => (
  <svg width={1080} height={2400} style={{ overflow: "visible", display: "block" }}>
    {EDGES.slice(0, 34).map(([a, b], k) => (
      <polygon key={"f" + k} points={`${PTS[a].join(",")} ${PTS[b].join(",")} ${PTS[(a + 7) % PTS.length].join(",")}`} fill={col} opacity={0.05 + 0.05 * Math.sin(frame / 25 + k)} />
    ))}
    {EDGES.map(([a, b], k) => (
      <line key={k} x1={PTS[a][0]} y1={PTS[a][1]} x2={PTS[b][0]} y2={PTS[b][1]} stroke={col} strokeOpacity={0.35 + 0.3 * Math.sin(frame / 20 + k * 1.3)} strokeWidth={2} />
    ))}
    {PTS.map((p, k) => <circle key={"p" + k} cx={p[0]} cy={p[1]} r={3} fill={col} opacity={0.7} />)}
  </svg>
);
const Mundo: React.FC<{ red: number }> = ({ red }) => {
  const frame = useCurrentFrame();
  const col = red > 0.5 ? P.red : P.acc;
  const H = 2400;
  const run = (frame * 7) % H; // o piso corre para baixo (em direção à câmera)
  const sway = Math.sin(frame / 70) * 4;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 30%, ${mix(P.bg2, "#3d0714", red)} 0%, ${P.bg1} 78%)`, overflow: "hidden" }}>
      {/* piso inclinado */}
      <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 20%" }}>
        <div style={{ position: "absolute", left: -200, width: 1480, top: 300, height: H * 2, transform: `rotateX(64deg) rotateZ(${sway}deg)`, transformOrigin: "50% 0" }}>
          <div style={{ position: "absolute", left: 200, top: run - H }}><Malha col={col} frame={frame} /></div>
          <div style={{ position: "absolute", left: 200, top: run }}><Malha col={col} frame={frame} /></div>
        </div>
      </AbsoluteFill>
      {/* teto espelhado, mais sutil */}
      <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 80%", opacity: 0.45 }}>
        <div style={{ position: "absolute", left: -200, width: 1480, bottom: 1500, height: H * 2, transform: `rotateX(-64deg) rotateZ(${-sway}deg)`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", left: 200, bottom: run - H }}><Malha col={col} frame={frame} /></div>
          <div style={{ position: "absolute", left: 200, bottom: run }}><Malha col={col} frame={frame} /></div>
        </div>
      </AbsoluteFill>
      {/* horizonte com brilho */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 18% at 50% 42%, ${red > 0.5 ? "rgba(255,45,74,.35)" : "rgba(155,107,255,.35)"}, transparent 70%)` }} />
      {/* partículas caindo em direção à câmera */}
      {new Array(110).fill(0).map((_, i) => {
        const z = random(`dz${i}`);
        const t = ((frame * (0.004 + z * 0.01) + random(`dt${i}`)) % 1);
        const x = 540 + (random(`dx${i}`) - 0.5) * 2400 * (0.15 + t);
        const y = 760 + (t * t) * 1500;
        const s = 1 + t * 9 * (0.4 + z);
        const c = red > 0.5 && i % 2 ? P.red : P.accL;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s * (1 + t * 3), borderRadius: s, background: c, opacity: Math.min(1, t * 3) * (0.3 + 0.5 * z), boxShadow: `0 0 ${s * 2}px ${c}`, filter: t > 0.75 ? `blur(${(t - 0.75) * 12}px)` : undefined }} />;
      })}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 90px rgba(0,0,0,.85)" }} />
    </AbsoluteFill>
  );
};

// ================================================================== câmera: plano de conteúdo inclinado que desce
const RollCtx = React.createContext(0);
const Roll: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 16, dur - 14, dur], [-1300, -80, 90, 1500], { ...cl, easing: Easing.bezier(0.45, 0, 0.25, 1) });
  const tilt = interpolate(frame, [0, 16, dur - 14, dur], [38, 14, 10, -10], cl);
  const sway = Math.sin(frame / 45) * 2.2;
  const blur = interpolate(frame, [0, 10, dur - 10, dur], [14, 0, 0, 18], cl);
  return (
    <AbsoluteFill style={{ perspective: 1300, perspectiveOrigin: "50% 35%" }}>
      <AbsoluteFill style={{ transform: `translateY(${y}px) rotateX(${tilt}deg) rotateZ(${sway}deg)`, transformOrigin: "50% 50%", filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <RollCtx.Provider value={y}>{children}</RollCtx.Provider>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/** camada com paralaxe: k > 1 anda mais que o plano (parece mais perto); k < 1 anda menos */
const Par: React.FC<{ k: number; children: React.ReactNode; float?: number; seed?: number }> = ({ k, children, float = 0, seed = 0 }) => {
  const y = React.useContext(RollCtx);
  const frame = useCurrentFrame();
  const fx = Math.sin(frame / 28 + seed) * float;
  const fy = Math.cos(frame / 34 + seed * 2) * float;
  return <AbsoluteFill style={{ translate: `${fx}px ${(k - 1) * y + fy}px`, scale: String(1 + (k - 1) * 0.08) }}>{children}</AbsoluteFill>;
};

// ================================================================== ícones com brilho
const Ic: React.FC<{ k: string; size?: number; red?: boolean; spin?: number }> = ({ k, size = 200, red, spin = 0 }) => {
  const frame = useCurrentFrame();
  const c = red ? "#ffb3bf" : P.accL;
  const g = red ? P.red : P.acc;
  const st = { fill: "none", stroke: c, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(145deg, ${red ? "rgba(255,45,74,.35)" : "rgba(155,107,255,.38)"}, rgba(20,10,40,.4))`, border: `2px solid ${g}aa`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(g, 0.6), rotate: `${Math.sin(frame / 30 + spin) * 8}deg` }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${c})` }}>
        {k === "roteiro" ? <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" {...st} /> : null}
        {k === "animacao" ? (<><rect x={3} y={5} width={18} height={14} rx={3} {...st} /><path d="M10 9.5v5l4.5-2.5z" {...st} fill={c} /></>) : null}
        {k === "legendas" ? (<><rect x={3} y={5} width={18} height={14} rx={3} {...st} /><path d="M7 14h4M13 14h4M7 10.5h10" {...st} /></>) : null}
        {k === "trilha" ? <path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 9 18zM19 16a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 19 16z" {...st} /> : null}
        {k === "narracao" ? (<><rect x={9} y={3} width={6} height={11} rx={3} {...st} /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" {...st} /></>) : null}
        {k === "olho" ? (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...st} /><circle cx={12} cy={12} r={3} {...st} /></>) : null}
        {k === "olho-x" ? (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...st} /><path d="M4 4l16 16" {...st} /></>) : null}
        {k === "clique" ? <path d="M5 3l7 18 2.5-7.5L22 11z" {...st} /> : null}
        {k === "cliente" ? (<><circle cx={9} cy={8} r={3.2} {...st} /><path d="M3 20a6 6 0 0 1 12 0M16 11l2 2 4-4" {...st} /></>) : null}
        {k === "cifrao" ? <path d="M12 3v18M16.5 7.5c0-1.9-2-3-4.5-3s-4.5 1.2-4.5 3.2c0 4.6 9 2.3 9 7 0 2-2 3.3-4.5 3.3s-4.5-1.2-4.5-3" {...st} strokeWidth={1.8} /> : null}
        {k === "enviar" ? <path d="M3 11l18-8-8 18-2-8z" {...st} /> : null}
        {k === "pausa" ? <path d="M9 5v14M15 5v14" {...st} strokeWidth={2.6} /> : null}
        {k === "zz" ? <path d="M5 7h5l-5 6h5M13 11h6l-6 8h6" {...st} /> : null}
        {k === "raio" ? <path d="M13 2L5 14h6l-1 8 8-12h-6z" {...st} /> : null}
      </svg>
      {k === "relogio" ? null : null}
      {frame < 0 ? null : null}
    </div>
  );
};
const Pop: React.FC<{ at: number; x: number; y: number; children: React.ReactNode; end?: number; spin?: number }> = ({ at, x, y, children, end, spin = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < at || (end !== undefined && frame > end + 10)) return null;
  const s = spring({ frame: frame - at, fps: 30, config: { damping: 11, mass: 0.8 } });
  const o = end !== undefined ? interpolate(frame, [end, end + 10], [0, 1], { ...cl, easing: IN }) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s * (1 + o * 1.6)), opacity: 1 - o, filter: `blur(${o * 18}px)`, rotate: `${(1 - s) * (spin || 25)}deg` }}>
      {children}
    </div>
  );
};

// ================================================================== cenas
const Tres: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const R = 300;
  const C = 2 * Math.PI * R;
  const p = interpolate(frame, [8, dur], [1, 0.15], cl);
  const s = spring({ frame: frame - 6, fps: 30, config: { damping: 11 } });
  return (
    <Roll dur={dur}>
      <Par k={0.85}>
        <Pequeno t="você tem" at={0} y={420} size={60} />
      </Par>
      <Par k={1.15} float={10}>
        <div style={{ position: "absolute", left: 540 - R - 40, top: 900 - R - 40, scale: String(s) }}>
          <svg width={2 * R + 80} height={2 * R + 80} style={{ rotate: "-90deg" }}>
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke="rgba(201,178,255,.15)" strokeWidth={22} />
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={P.accL} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} style={{ filter: `drop-shadow(0 0 16px ${P.acc})` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 420, color: "#fff", textShadow: glow(P.acc, 1), letterSpacing: "-0.06em" }}>3</div>
        </div>
      </Par>
      <Par k={1.3}>
        <Grande t="segundos." at={Math.round(voz * 0.55)} y={1330} size={150} />
      </Par>
    </Roll>
  );
};

const Decide: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [Math.round(voz * 0.55), voz], [0, -2400], { ...cl, easing: Easing.in(Easing.quad) });
  const opt1 = Math.round(voz * 0.32);
  const opt2 = Math.round(voz * 0.62);
  return (
    <Roll dur={dur}>
      <Par k={0.8}>
        <Pequeno t="é o tempo pra alguém decidir" at={2} y={250} size={52} />
      </Par>
      <Par k={1} float={8} seed={1}>
        <div style={{ position: "absolute", left: 270, top: 420, transform: `rotateY(${Math.sin(frame / 40) * 14}deg) rotateZ(${Math.sin(frame / 55) * 3}deg)`, scale: "0.78", transformOrigin: "50% 0" }}>
          <Celular>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, translate: `0 ${scroll}px` }}>
              {new Array(9).fill(0).map((_, i) => <div key={i} style={{ margin: "26px 22px", height: 360, borderRadius: 26, background: `rgba(255,255,255,${0.05 + (i % 3) * 0.03})`, position: "relative" }}><div style={{ position: "absolute", left: 26, bottom: 26, width: 200, height: 18, borderRadius: 9, background: "rgba(255,255,255,.1)" }} /></div>)}
            </div>
          </Celular>
        </div>
      </Par>
      <Par k={1.25} float={14} seed={2}>
        <Pop at={opt1} x={230} y={760}>
          <div style={{ padding: "22px 34px", borderRadius: 999, background: "rgba(155,107,255,.25)", border: `2px solid ${P.acc}`, boxShadow: glow(P.acc, 0.4), fontFamily: F, fontWeight: 800, fontSize: 40, color: "#fff", whiteSpace: "nowrap" }}>para no seu post</div>
        </Pop>
      </Par>
      <Par k={1.4} float={14} seed={3}>
        <Pop at={opt2} x={800} y={1050}>
          <div style={{ padding: "22px 34px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: "2px solid rgba(255,255,255,.3)", fontFamily: F, fontWeight: 800, fontSize: 40, color: "rgba(255,255,255,.75)", whiteSpace: "nowrap" }}>ou continua rolando ↓</div>
        </Pop>
      </Par>
      <Par k={1.5}>
        <Grande t="rolando." at={Math.round(voz * 0.72)} y={1400} size={150} />
      </Par>
    </Roll>
  );
};

const Parado: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const big = Math.round(voz * 0.18);
  const eye = Math.round(voz * 0.55);
  const s = spring({ frame: frame - 2, fps: 30, config: { damping: 15 } });
  return (
    <Roll dur={dur}>
      <Par k={0.9}>
        <div style={{ position: "absolute", left: 290, top: 300, width: 500, height: 500, transform: `rotateY(${-20 + frame * 0.2}deg) rotateX(10deg)`, opacity: s * 0.9, filter: "grayscale(1) brightness(.7)", scale: String(0.7 + 0.3 * s) }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#bbb,#888)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial", fontSize: 70, fontWeight: 900, color: "#555" }}>POST</div>
        </div>
      </Par>
      <Par k={1.2}>
        <Pequeno t="e post" at={0} y={880} size={54} />
        <Grande t="parado..." at={big} y={960} size={190} red underline={false} />
      </Par>
      <Par k={1.45} float={12}>
        <Pop at={eye} x={300} y={1440}><Ic k="olho-x" red size={180} /></Pop>
        <Pequeno t="quase ninguém vê" at={eye + 4} y={1560} size={50} color="#ffb3bf" />
      </Par>
    </Roll>
  );
};

const Concorrente: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const fwd = interpolate(frame, [Math.round(voz * 0.4), Math.round(voz * 0.7)], [0, 1], { ...cl, easing: INOUT });
  const PostMotion = () => (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#2a1260,#0f0820)", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200 }}>
        {[0.4, 0.6, 0.85, 1].map((h, k) => <div key={k} style={{ width: 46, height: 200 * h * (0.45 + 0.55 * Math.abs(Math.sin((frame + k * 8) / 10))), borderRadius: 12, background: P.accL, boxShadow: glow(P.acc, 0.4) }} />)}
      </div>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 60, color: "#fff", rotate: `${Math.sin(frame / 8) * 4}deg` }}>NOVO!</div>
    </AbsoluteFill>
  );
  return (
    <Roll dur={dur}>
      <Par k={0.85}>
        <Pequeno t="enquanto isso, o seu concorrente" at={2} y={230} size={50} />
      </Par>
      <AbsoluteFill style={{ perspective: 1400 }}>
        <Par k={0.95} float={6} seed={4}>
          <div style={{ position: "absolute", left: 40, top: 420, scale: String(0.62 - fwd * 0.1), transformOrigin: "0 0", transform: `rotateY(${18 + fwd * 10}deg)`, filter: `grayscale(1) brightness(${0.6 - fwd * 0.2}) blur(${fwd * 4}px)` }}>
            <Celular><AbsoluteFill style={{ background: "#666", alignItems: "center", justifyContent: "center", fontFamily: "Arial", fontSize: 60, color: "#999", fontWeight: 900 }}>post</AbsoluteFill></Celular>
            <div style={{ textAlign: "center", marginTop: 30, fontFamily: F, fontSize: 46, color: "#aaa" }}>você</div>
          </div>
        </Par>
        <Par k={1.15} float={10} seed={5}>
          <div style={{ position: "absolute", left: 520, top: 380, scale: String(0.66 + fwd * 0.22), transformOrigin: "30% 0", transform: `rotateY(${-18 + fwd * 14}deg) rotateZ(${Math.sin(frame / 30) * 3}deg)` }}>
            <Celular style={{ boxShadow: `0 0 0 2px ${P.accL}, 0 0 ${80 + fwd * 80}px ${P.acc}` }}><PostMotion /></Celular>
            <div style={{ textAlign: "center", marginTop: 30, fontFamily: F, fontSize: 46, fontWeight: 800, color: P.accL }}>concorrente</div>
          </div>
        </Par>
      </AbsoluteFill>
      <Par k={1.45}>
        <Grande t="em movimento." at={Math.round(voz * 0.6)} y={1470} size={130} />
      </Par>
    </Roll>
  );
};

const Solucao: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const logoS = spring({ frame: frame - 2, fps: 30, config: { damping: 12 } });
  const ring = interpolate(frame, [2, 26], [0, 1], { ...cl, easing: OUT });
  const up = interpolate(frame, [Math.round(voz * 0.45), Math.round(voz * 0.6)], [0, 1], { ...cl, easing: INOUT });
  const a = Math.round(voz * 0.66), b = Math.round(voz * 0.78), c = Math.round(voz * 0.9);
  return (
    <Roll dur={dur}>
      <Par k={1} float={6}>
        <div style={{ position: "absolute", left: 540, top: 700 - up * 330, translate: "-50% -50%", scale: String((0.5 + 0.5 * logoS) * (1 - up * 0.35)) }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 1300 * ring, height: 1300 * ring, translate: "-50% -50%", borderRadius: "50%", border: `4px solid ${P.acc}`, opacity: 1 - ring, boxShadow: glow(P.acc, 0.5) }} />
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ width: 170, height: 170, borderRadius: 50, background: `linear-gradient(145deg, ${P.acc}, ${P.deep})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(P.acc, 0.9), rotate: `${(1 - logoS) * -40}deg` }}>
              <svg width={100} height={100} viewBox="0 0 24 24"><path d="M5 3l7 18 2.5-7.5L22 11z" fill="#fff" stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" /></svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, fontFamily: F }}>
              <span style={{ fontWeight: 900, fontSize: 150, color: "#fff", letterSpacing: "-0.06em", textShadow: glow(P.acc, 0.5) }}>{MARCA.nome}</span>
              <span style={{ fontWeight: 500, fontSize: 72, color: P.accL }}>{MARCA.sub}</span>
            </div>
          </div>
        </div>
      </Par>
      <Par k={1.1}>
        <Pequeno t="transforma o seu negócio em vídeo que" at={Math.round(voz * 0.45)} y={820} size={46} />
      </Par>
      <Par k={1.35}>
        <Voo t="prende." at={a - 4} end={b - 6} y={960} size={200} />
        <Voo t="explica." at={b - 4} end={c - 6} y={960} size={200} />
        <Grande t="vende." at={c - 4} y={960} size={220} />
      </Par>
    </Roll>
  );
};

const PACOTE = [
  { k: "roteiro", t: "Roteiro", f: 0.0 },
  { k: "animacao", t: "Animação", f: 0.1 },
  { k: "legendas", t: "Legendas", f: 0.2 },
  { k: "trilha", t: "Trilha", f: 0.31 },
  { k: "narracao", t: "Narração", f: 0.41 },
];
const Pacote: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const fin = Math.round(voz * 0.56);
  const recolhe = interpolate(frame, [fin - 6, fin + 10], [0, 1], { ...cl, easing: INOUT });
  return (
    <Roll dur={dur}>
      {PACOTE.map((p, i) => {
        const at = Math.round(voz * p.f) + 2;
        const ang = (i / PACOTE.length) * Math.PI * 2 + frame / 45;
        const rx = 360 * (1 - recolhe * 0.35);
        const x = 540 + Math.cos(ang) * rx;
        const y = 800 + Math.sin(ang) * 430 * (1 - recolhe * 0.5) - recolhe * 200;
        const depth = Math.sin(ang);
        return (
          <Par key={p.k} k={1 + depth * 0.25} seed={i}>
            <Pop at={at} x={x} y={y}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, scale: String((0.75 + 0.25 * (depth + 1) / 2) * (1 - recolhe * 0.25)), filter: depth < -0.4 ? `blur(${(-depth - 0.4) * 6}px)` : undefined }}>
                <Ic k={p.k} size={220} spin={i} />
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 54, color: "#fff", textShadow: glow(P.acc, 0.3) }}>{p.t}</div>
              </div>
            </Pop>
          </Par>
        );
      })}
      <Par k={1.3}>
        <Pequeno t="pronto pra" at={fin} y={1240} size={50} />
        {["reels", "stories", "anúncios"].map((t, i) => (
          <Pop key={t} at={fin + 6 + i * 5} x={250 + i * 290} y={1400} spin={-20}>
            <div style={{ padding: "22px 40px", borderRadius: 999, background: i === 2 ? `linear-gradient(145deg, ${P.acc}, ${P.deep})` : "rgba(155,107,255,.2)", border: `2px solid ${P.acc}`, boxShadow: glow(P.acc, 0.4), fontFamily: F, fontWeight: 800, fontSize: 52, color: "#fff" }}>{t}</div>
          </Pop>
        ))}
      </Par>
    </Roll>
  );
};

const Funil: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const it = [
    { k: "olho", t: "atenção", f: 0.02 },
    { k: "clique", t: "cliques", f: 0.36 },
    { k: "cliente", t: "clientes", f: 0.68 },
  ];
  const line = interpolate(frame, [4, voz * 0.75], [0, 1], { ...cl, easing: INOUT });
  return (
    <Roll dur={dur}>
      <Par k={1}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M240 520 C 240 760, 240 760, 240 960 S 240 1200, 240 1400" stroke={P.accL} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} style={{ filter: `drop-shadow(0 0 12px ${P.acc})` }} />
        </svg>
      </Par>
      {it.map((x, i) => {
        const at = Math.round(voz * x.f);
        const y = 520 + i * 440;
        return (
          <Par key={x.k} k={1 + i * 0.18} float={8} seed={i}>
            <Pop at={at} x={240} y={y}><Ic k={x.k} size={190} /></Pop>
            {frame >= at ? (
              <div style={{ position: "absolute", left: 400, top: y - 110, fontFamily: F, opacity: interpolate(frame, [at, at + 10], [0, 1], cl), translate: `${interpolate(frame, [at, at + 14], [120, 0], { ...cl, easing: OUT })}px 0`, filter: `blur(${interpolate(frame, [at, at + 10], [12, 0], cl)}px)` }}>
                <div style={{ fontSize: 54, fontWeight: 400, color: "rgba(255,255,255,.8)" }}>mais</div>
                <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 0.95, color: "#fff", textShadow: glow(P.acc, i === 2 ? 1 : 0.6) }}>{x.t}</div>
              </div>
            ) : null}
          </Par>
        );
      })}
    </Roll>
  );
};

const Preco: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [Math.round(voz * 0.22), Math.round(voz * 0.3)], [0, 1], { ...cl, easing: OUT });
  const pre = Math.round(voz * 0.38);
  const big = Math.round(voz * 0.58);
  const n = Math.round(interpolate(frame, [big, big + 28], [0, MARCA.preco], { ...cl, easing: OUT }));
  const ic = Math.round(voz * 0.82);
  return (
    <Roll dur={dur}>
      <Par k={0.85}>
        <Pequeno t="e não custa" at={0} y={330} size={52} />
        {frame >= 6 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", opacity: interpolate(frame, [6, 14], [0, 1], cl) }}>
            <div style={{ position: "relative", fontFamily: F, fontWeight: 900, fontSize: 130, color: P.red, textShadow: glow(P.red, 0.6) }}>
              caro
              <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 14, borderRadius: 7, background: "#fff", scale: `${strike} 1`, transformOrigin: "left", boxShadow: glow(P.acc, 0.6) }} />
            </div>
          </div>
        ) : null}
      </Par>
      <Par k={1.15}>
        <Pequeno t="criativos a partir de" at={pre} y={760} size={56} />
        <Grande t={`R$ ${n}`} at={big} y={850} size={250} />
      </Par>
      <Par k={1.45} float={12}>
        <Pop at={ic} x={540} y={1460}><Ic k="cifrao" size={220} /></Pop>
      </Par>
      <Cursor path={[[ic + 2, 940, 1820], [ic + 16, 560, 1480], [dur, 580, 1500]]} click={ic + 18} />
    </Roll>
  );
};

const CTA: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const big = Math.round(voz * 0.14);
  const ic = Math.round(voz * 0.3);
  const click = ic + 22;
  const fin = Math.round(voz * 0.5);
  const sobe = interpolate(frame, [fin - 6, fin + 12], [0, 1], { ...cl, easing: INOUT });
  return (
    <Roll dur={dur}>
      <Par k={0.9}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -sobe * 260 }}>
          <Pequeno t="chama no" at={0} y={330} size={58} />
          <Grande t="direct" at={big} y={410} size={200} />
        </div>
      </Par>
      <Par k={1.2} float={10}>
        <Pop at={ic} x={540} y={980 - sobe * 250}><Ic k="enviar" size={200} /></Pop>
      </Par>
      <Par k={1.4}>
        <Pequeno t="e faça a sua marca ser" at={fin + 4} y={1060} size={50} />
        <Grande t="o motivo da pausa." at={fin + 12} y={1140} size={104} />
        <Pop at={fin + 22} x={540} y={1530}><Ic k="pausa" size={170} /></Pop>
      </Par>
      <Cursor path={[[ic + 2, 940, 1600], [click - 4, 560, 1000], [dur, 580, 1020]]} click={click} />
    </Roll>
  );
};

const Fim: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - 4, fps: 30, config: { damping: 13 } });
  const sub = interpolate(frame, [22, 36], [0, 1], { ...cl, easing: OUT });
  const tilt = interpolate(frame, [0, 20], [35, 0], { ...cl, easing: OUT });
  const y = interpolate(frame, [0, 20], [-700, 0], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ perspective: 1300 }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${y}px) rotateX(${tilt}deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, scale: String(0.6 + 0.4 * p), opacity: p }}>
          <div style={{ width: 170, height: 170, borderRadius: 50, background: `linear-gradient(145deg, ${P.acc}, ${P.deep})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(P.acc, 0.9) }}>
            <svg width={100} height={100} viewBox="0 0 24 24"><path d="M5 3l7 18 2.5-7.5L22 11z" fill="#fff" stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" /></svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, fontFamily: F }}>
            <span style={{ fontWeight: 900, fontSize: 150, color: "#fff", letterSpacing: "-0.06em", textShadow: glow(P.acc, 0.5) }}>{MARCA.nome}</span>
            <span style={{ fontWeight: 500, fontSize: 72, color: P.accL }}>{MARCA.sub}</span>
          </div>
        </div>
        <div style={{ position: "absolute", top: 1220, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: sub, fontFamily: F }}>
          <div style={{ fontSize: 46, color: "rgba(255,255,255,.85)" }}>motion design para <b style={{ color: P.accL }}>empresas</b></div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", padding: "16px 38px", borderRadius: 999, border: `2px solid ${P.acc}`, boxShadow: glow(P.acc, 0.3) }}>{MARCA.arroba}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================================================================== linha do tempo
const GAP = 6, LEAD = 6, FIM = 96;
const EXTRA: Record<string, number> = { tres: 8, solucao: 14, pacote: 6, funil: 6, preco: 16, cta: 30 };
const MAP: Record<string, React.FC<S>> = { tres: Tres, decide: Decide, parado: Parado, concorrente: Concorrente, solucao: Solucao, pacote: Pacote, funil: Funil, preco: Preco, cta: CTA };
export const PLAN4 = (() => {
  let t = 0;
  return VO.map((v, i) => {
    const lead = i === 0 ? LEAD : 0;
    const dur = lead + v.voz + GAP + (EXTRA[v.id] ?? 0);
    const r = { ...v, from: t, dur, lead };
    t += dur;
    return r;
  });
})();
const last = PLAN4[PLAN4.length - 1];
export const PROMO4_TOTAL = last.from + last.dur + FIM;
const OV = 14; // a próxima cena já vem descendo enquanto a anterior sai por baixo

/** vazamento de luz roxo/rosa atravessando a tela na troca de cena */
const LuzVazada: React.FC<{ seed: number }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 25], [0, 1], cl);
  const o = interpolate(frame, [0, 6, 14, 25], [0, 0.85, 0.7, 0], cl);
  const a = random(`lv${seed}`) * 360;
  const cx = interpolate(p, [0, 1], [-20, 120]);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 70% at ${cx}% ${30 + 40 * random(`ly${seed}`)}%, rgba(201,120,255,.9), rgba(155,107,255,.45) 35%, transparent 70%)`, rotate: `${a}deg`, scale: "1.6", filter: "blur(30px)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 30% 50% at ${120 - cx}% ${60}%, rgba(255,150,220,.6), transparent 70%)`, filter: "blur(40px)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(${100 + a / 4}deg, transparent ${cx - 15}%, rgba(255,255,255,.35) ${cx}%, transparent ${cx + 15}%)` }} />
    </AbsoluteFill>
  );
};

const Raiz: React.FC = () => {
  const frame = useCurrentFrame();
  const p = PLAN4.find((x) => x.id === "parado")!;
  const red = interpolate(frame, [p.from - 4, p.from + 8, p.from + p.dur - 6, p.from + p.dur + 8], [0, 1, 1, 0], cl);
  return <Mundo red={red} />;
};

export const PromoVideo4: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg1 }}>
    <Raiz />
    {PLAN4.map((s, i) => {
      const C = MAP[s.id];
      const ov = i === 0 ? 0 : OV;
      return (
        <Sequence key={s.id} from={s.from - ov} durationInFrames={s.dur + ov + 8} name={s.id}>
          <CameraMotionBlur shutterAngle={200} samples={6}>
            <C dur={s.dur + ov + 8} voz={s.lead + s.voz + ov} />
          </CameraMotionBlur>
          <Sequence from={ov + s.lead} layout="none">
            <Audio src={staticFile(`promo4/vo/${s.f}.wav`)} />
          </Sequence>
        </Sequence>
      );
    })}
    <Sequence from={last.from + last.dur - 8} durationInFrames={FIM + 8}>
      <CameraMotionBlur shutterAngle={200} samples={6}>
        <Fim dur={FIM} />
      </CameraMotionBlur>
    </Sequence>
    {PLAN4.slice(1).map((s, i) => (
      <Sequence key={"luz" + i} from={s.from - OV - 4} durationInFrames={26}>
        <LuzVazada seed={i} />
      </Sequence>
    ))}
    <Sequence from={last.from + last.dur - 12} durationInFrames={26}>
      <LuzVazada seed={9} />
    </Sequence>
    <Sequence from={PLAN4.find((p) => p.id === "cta")!.from}>
      <Fumaca start={0} />
    </Sequence>
    <Audio src={staticFile("promo4/musica.wav")} volume={0.9} />
    <Audio src={staticFile("promo4/efeitos.wav")} volume={0.85} />
  </AbsoluteFill>
);
