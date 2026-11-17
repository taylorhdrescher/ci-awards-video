/**
 * Clique Motion — vídeo de apresentação v3, no estilo da referência:
 * mundo escuro contínuo (linhas poligonais + partículas + câmera em movimento), texto em dois níveis
 * (frase pequena + palavra grande brilhante), elementos que vêm do fundo e passam pela câmera,
 * momentos de "dor" em vermelho neon, objetos 3D com brilho, cursor e fumaça no final.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import VO from "./vo.json";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });

export const MARCA = { nome: "clique", sub: "motion", arroba: "@clique.motion", preco: 297 };
export const F = "'Inter', sans-serif";
export const P = { acc: "#9b6bff", accL: "#c9b2ff", deep: "#5b2bd6", red: "#ff2d4a", bg1: "#06040f", bg2: "#1a0b3d" };
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN = Easing.in(Easing.cubic);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
type S = { dur: number; voz: number };
export const glow = (c: string, k = 1) => `0 0 ${18 * k}px ${c}, 0 0 ${50 * k}px ${c}, 0 0 ${110 * k}px ${c}88`;

// ================================================================== mundo de fundo contínuo
const PTS = new Array(46).fill(0).map((_, i) => [random(`gx${i}`) * 2200 - 560, random(`gy${i}`) * 2900 - 500]);
const EDGES: [number, number][] = [];
PTS.forEach((p, i) => {
  const d = PTS.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])] as [number, number]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
  d.slice(0, 3).forEach(([j]) => { if (i < j) EDGES.push([i, j]); });
});
const Mundo: React.FC<{ red: number }> = ({ red }) => {
  const frame = useCurrentFrame();
  const rot = frame * 0.03;
  const sc = 1.1 + 0.08 * Math.sin(frame / 200);
  const tx = Math.sin(frame / 160) * 60;
  const ty = Math.cos(frame / 190) * 80;
  const lineCol = red > 0.5 ? P.red : P.acc;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 45%, ${red > 0 ? mix(P.bg2, "#3d0714", red) : P.bg2} 0%, ${P.bg1} 75%)` }}>
      {/* raios poligonais */}
      <AbsoluteFill style={{ rotate: `${rot}deg`, scale: String(sc), translate: `${tx}px ${ty}px`, opacity: 0.95 }}>
        <svg width={1080} height={1920} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="fac" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor={lineCol} stopOpacity={0.3} />
              <stop offset="1" stopColor={lineCol} stopOpacity={0} />
            </linearGradient>
          </defs>
          {EDGES.slice(0, 26).map(([a, b], k) => (
            <polygon key={"f" + k} points={`${PTS[a].join(",")} ${PTS[b].join(",")} 540,${960 + Math.sin(k) * 400}`} fill="url(#fac)" opacity={0.25 + 0.2 * Math.sin(frame / 40 + k)} />
          ))}
          {EDGES.map(([a, b], k) => (
            <line key={k} x1={PTS[a][0]} y1={PTS[a][1]} x2={PTS[b][0]} y2={PTS[b][1]} stroke={lineCol} strokeOpacity={0.35 + 0.25 * Math.sin(frame / 30 + k * 1.7)} strokeWidth={1.8} />
          ))}
        </svg>
      </AbsoluteFill>
      {/* partículas em 3 profundidades */}
      {new Array(90).fill(0).map((_, i) => {
        const z = random(`z${i}`);
        const x = ((random(`x${i}`) * 1300 - 110 + Math.sin(frame / (50 + i) + i) * 30 * z) % 1300);
        const y = (((random(`y${i}`) * 2100 - frame * (0.3 + z * 1.4)) % 2100) + 2100) % 2100 - 90;
        const s = 1.5 + z * 6;
        const c = red > 0.5 && i % 2 ? P.red : P.accL;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: c, opacity: (0.2 + 0.6 * z) * (0.6 + 0.4 * Math.sin(frame / 9 + i)), filter: z > 0.85 ? "blur(3px)" : undefined, boxShadow: `0 0 ${s * 3}px ${c}` }} />;
      })}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${red > 0 ? `rgba(255,45,74,${0.18 * red})` : "rgba(155,107,255,.12)"}, transparent 70%)` }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 80px rgba(0,0,0,.8)" }} />
    </AbsoluteFill>
  );
};
export function mix(a: string, b: string, t: number) {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
}
export const Fumaca: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [start, start + 40], [0, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: o, mixBlendMode: "screen" }}>
      {new Array(9).fill(0).map((_, i) => {
        const t = frame - start + i * 30;
        const y = 2000 - ((t * (1.5 + random(`sm${i}`))) % 2300);
        const x = random(`sx${i}`) * 1080 + Math.sin(t / 40 + i) * 80;
        const w = 300 + random(`sw${i}`) * 400;
        return <div key={i} style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: w * 1.8, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,178,255,.35), transparent 65%)", filter: "blur(40px)", rotate: `${Math.sin(t / 50 + i) * 20}deg` }} />;
      })}
    </AbsoluteFill>
  );
};

// ================================================================== tipografia
/** vem do fundo (pequeno, desfocado) e, na saída, passa pela câmera */
export const useDepth = (start: number, end?: number) => {
  const frame = useCurrentFrame();
  const i = interpolate(frame, [start, start + 14], [0, 1], { ...cl, easing: OUT });
  const o = end !== undefined ? interpolate(frame, [end, end + 9], [0, 1], { ...cl, easing: IN }) : 0;
  return {
    visible: frame >= start && (end === undefined || frame < end + 9),
    style: {
      opacity: i * (1 - o),
      scale: String((0.55 + 0.45 * i) * (1 + o * 2.2)),
      filter: `blur(${(1 - i) * 18 + o * 26}px)`,
    } as React.CSSProperties,
  };
};
export const Pequeno: React.FC<{ t: string; at: number; end?: number; y: number; size?: number; color?: string }> = ({ t, at, end, y, size = 52, color = "rgba(255,255,255,.88)" }) => {
  const frame = useCurrentFrame();
  const d = useDepth(at, end);
  if (!d.visible) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", ...d.style }}>
      <div style={{ display: "flex", gap: size * 0.26, fontFamily: F, fontWeight: 400, fontSize: size, color, letterSpacing: "-0.02em" }}>
        {t.split(" ").map((w, i) => {
          const k = interpolate(frame, [at + i * 2, at + i * 2 + 10], [0, 1], { ...cl, easing: OUT });
          return <span key={i} style={{ opacity: k, filter: `blur(${(1 - k) * 8}px)`, translate: `0 ${(1 - k) * 20}px`, display: "inline-block" }}>{w}</span>;
        })}
      </div>
    </div>
  );
};
export const Grande: React.FC<{ t: string; at: number; end?: number; y: number; size?: number; red?: boolean; underline?: boolean; echo?: boolean }> = ({ t, at, end, y, size = 150, red, underline = true, echo = true }) => {
  const frame = useCurrentFrame();
  const d = useDepth(at, end);
  if (!d.visible) return null;
  const c = red ? P.red : P.accL;
  const g = red ? P.red : P.acc;
  const flick = red ? (random(`fl${Math.floor(frame / 2)}`) > 0.85 ? 0.45 : 1) : 1;
  const u = interpolate(frame, [at + 8, at + 22], [0, 1], { ...cl, easing: OUT });
  const txt: React.CSSProperties = { fontFamily: F, fontWeight: 800, fontSize: size, letterSpacing: "-0.05em", lineHeight: 1, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", ...d.style }}>
      <div style={{ position: "relative" }}>
        {echo ? <div style={{ ...txt, position: "absolute", left: 0, top: 0, color: c, opacity: 0.35, filter: "blur(10px)", scale: String(1 + interpolate(frame - at, [0, 30], [0.25, 0.04], cl)) }}>{t}</div> : null}
        {red ? <div style={{ ...txt, position: "absolute", left: 6, top: 0, color: "#00e5ff", opacity: 0.35 * (1 - flick + 0.3), mixBlendMode: "screen" }}>{t}</div> : null}
        <div style={{ ...txt, color: red ? "#ffd6dc" : "#fff", textShadow: glow(g, red ? 1 : 0.8), opacity: flick }}>{t}</div>
      </div>
      {underline ? <div style={{ height: 6, width: `${u * 70}%`, borderRadius: 6, background: c, boxShadow: glow(g, 0.5), marginTop: 18 }} /> : null}
    </div>
  );
};
/** palavra gigante que passa rente à câmera e assenta */
export const Voo: React.FC<{ t: string; at: number; end?: number; y: number; size?: number }> = ({ t, at, end, y, size = 210 }) => {
  const frame = useCurrentFrame();
  if (frame < at || (end !== undefined && frame > end + 9)) return null;
  const k = interpolate(frame, [at, at + 16], [0, 1], { ...cl, easing: OUT });
  const o = end !== undefined ? interpolate(frame, [end, end + 9], [0, 1], { ...cl, easing: IN }) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", scale: String(interpolate(k, [0, 1], [3.6, 1]) * (1 + o * 2.5)), filter: `blur(${(1 - k) * 22 + o * 24}px)`, opacity: Math.min(1, k * 2) * (1 - o), translate: `${(1 - k) * 260}px 0` }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: size, letterSpacing: "-0.06em", color: "#fff", textShadow: glow(P.acc, 0.9), whiteSpace: "nowrap" }}>{t}</div>
    </div>
  );
};

// ================================================================== objetos
export const Cursor: React.FC<{ path: [number, number, number][]; click: number }> = ({ path, click }) => {
  const frame = useCurrentFrame();
  if (frame < path[0][0]) return null;
  const fs = path.map((p) => p[0]);
  const x = interpolate(frame, fs, path.map((p) => p[1]), { ...cl, easing: INOUT });
  const y = interpolate(frame, fs, path.map((p) => p[2]), { ...cl, easing: INOUT });
  const press = interpolate(frame, [click - 3, click, click + 5], [0, 1, 0], cl);
  const r = frame >= click && frame < click + 22 ? (frame - click) / 22 : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 9 }}>
      {r >= 0 ? <div style={{ position: "absolute", left: -80 * r, top: -80 * r, width: 160 * r, height: 160 * r, borderRadius: "50%", border: `4px solid ${P.accL}`, opacity: 1 - r, boxShadow: glow(P.acc, 0.4) }} /> : null}
      <svg width={84} height={84} viewBox="0 0 24 24" style={{ scale: String(1 - press * 0.2), transformOrigin: "0 0", filter: `drop-shadow(0 0 12px ${P.acc})` }}>
        <path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill="#fff" stroke={P.deep} strokeWidth={1} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
export const IconeGlow: React.FC<{ k: string; size?: number; color?: string }> = ({ k, size = 200, color = P.accL }) => {
  const frame = useCurrentFrame();
  const st = { fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "linear-gradient(145deg, rgba(155,107,255,.35), rgba(91,43,214,.15))", border: `2px solid ${P.acc}aa`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(P.acc, 0.6) }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
        {k === "cc" ? (<><rect x={3} y={5} width={18} height={14} rx={3} {...st} /><path d="M10 10.5a2 2 0 1 0 0 3M16 10.5a2 2 0 1 0 0 3" {...st} /></>) : null}
        {k === "som" ? new Array(5).fill(0).map((_, i) => { const h = 3 + 6 * Math.abs(Math.sin(frame / 5 + i)); return <path key={i} d={`M${5 + i * 3.5} ${12 - h / 2}v${h}`} {...st} strokeWidth={2} />; }) : null}
        {k === "mic" ? (<><rect x={9} y={3} width={6} height={11} rx={3} {...st} /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" {...st} /></>) : null}
        {k === "relogio" ? (<><circle cx={12} cy={13} r={8} {...st} /><path d={`M12 13 L${12 + 5 * Math.sin(frame / 6)} ${13 - 5 * Math.cos(frame / 6)}`} {...st} /><path d="M12 13V8.5M5 4l-2 2M19 4l2 2" {...st} /></>) : null}
        {k === "cifrao" ? <path d="M12 3v18M16.5 7.5c0-1.9-2-3-4.5-3s-4.5 1.2-4.5 3.2c0 4.6 9 2.3 9 7 0 2-2 3.3-4.5 3.3s-4.5-1.2-4.5-3" {...st} strokeWidth={1.8} /> : null}
        {k === "raio" ? <path d="M13 2L5 14h6l-1 8 8-12h-6z" {...st} /> : null}
        {k === "enviar" ? <path d="M3 11l18-8-8 18-2-8z" {...st} /> : null}
      </svg>
    </div>
  );
};
export const Celular: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ width: 560, height: 1080, borderRadius: 80, padding: 14, boxSizing: "border-box", background: "linear-gradient(145deg,#3a3550,#0d0b16)", boxShadow: `0 0 0 2px rgba(201,178,255,.35), 0 50px 120px rgba(0,0,0,.6), 0 0 80px rgba(155,107,255,.25)`, ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 66, overflow: "hidden", position: "relative", background: "#0f0c18" }}>{children}</div>
  </div>
);
export const useEnter3D = (at: number, end?: number) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - at, fps: 30, config: { damping: 16, mass: 0.9 } });
  const o = end !== undefined ? interpolate(frame, [end, end + 10], [0, 1], { ...cl, easing: IN }) : 0;
  return { s, o, show: frame >= at && (end === undefined || frame < end + 10) };
};

// ================================================================== cenas (sem fundo próprio)
const Gancho: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const { s, o } = useEnter3D(6, dur - 10);
  const big = Math.round(voz * 0.5);
  return (
    <AbsoluteFill>
      <Pequeno t="Sua empresa ainda posta" at={2} end={dur - 10} y={300} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: 190, top: 620, width: 700, height: 700, transform: `rotateY(${-28 + frame * 0.15}deg) rotateX(12deg) scale(${(0.6 + 0.4 * s) * (1 + o * 2)})`, opacity: s * (1 - o), filter: `blur(${(1 - s) * 14 + o * 20 + (frame > big ? 2 : 0)}px)` }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#d9d9d9,#b5b5b5)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: "Arial, sans-serif", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
            <div style={{ fontSize: 110, fontWeight: 900, color: "#e02020", textShadow: "4px 4px 0 #ffeb3b", rotate: "-6deg" }}>PROMOÇÃO!!</div>
            <div style={{ fontSize: 56, color: "#333", fontWeight: 700 }}>10% OFF em tudo</div>
            <div style={{ fontSize: 32, color: "#555" }}>ligue já (00) 0000-0000</div>
          </div>
        </div>
      </AbsoluteFill>
      <Grande t="vídeo assim?" at={big} end={dur - 10} y={1420} size={170} red />
    </AbsoluteFill>
  );
};

const Feed: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const { s, o } = useEnter3D(4, dur - 10);
  const stop = Math.round(voz * 0.6);
  const scroll = interpolate(frame, [4, stop], [0, -2300], { ...cl, easing: Easing.out(Easing.cubic) });
  const hl = interpolate(frame, [stop - 4, stop + 10], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Pequeno t="quem usa motion design" at={Math.round(voz * 0.12)} end={Math.round(voz * 0.55)} y={240} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 260, top: 420, transform: `rotateY(${interpolate(frame, [0, dur], [24, -8])}deg) rotateX(8deg) scale(${(0.6 + 0.28 * s) * (1 + o * 1.8)})`, transformOrigin: "50% 40%", opacity: s * (1 - o), filter: `blur(${(1 - s) * 14 + o * 20}px)` }}>
          <Celular>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, translate: `0 ${scroll}px` }}>
              {new Array(7).fill(0).map((_, i) => {
                const m = i === 5;
                return (
                  <div key={i} style={{ margin: "26px 22px", height: 380, borderRadius: 26, background: m ? "linear-gradient(160deg,#2a1260,#0f0820)" : `rgba(255,255,255,${0.06 + (i % 3) * 0.03})`, position: "relative", overflow: "hidden", boxShadow: m ? `0 0 ${60 * hl}px ${P.acc}, inset 0 0 0 2px ${P.acc}` : undefined }}>
                    {m ? (
                      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
                          {[0.4, 0.6, 0.85, 1].map((h, k) => <div key={k} style={{ width: 38, height: 150 * h * (0.45 + 0.55 * Math.abs(Math.sin((frame + k * 8) / 12))), borderRadius: 10, background: P.accL, boxShadow: glow(P.acc, 0.4) }} />)}
                        </div>
                        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 50, color: "#fff" }}>+vendas</div>
                      </AbsoluteFill>
                    ) : <div style={{ position: "absolute", left: 26, bottom: 26, width: 220, height: 20, borderRadius: 10, background: "rgba(255,255,255,.1)" }} />}
                  </div>
                );
              })}
            </div>
          </Celular>
        </div>
      </AbsoluteFill>
      <Pequeno t="faz as pessoas" at={Math.round(voz * 0.55)} end={dur - 10} y={1330} size={48} />
      <Grande t="pararem de rolar." at={Math.round(voz * 0.66)} end={dur - 10} y={1410} size={120} />
    </AbsoluteFill>
  );
};

const Vende: React.FC<S> = ({ dur, voz }) => {
  const a = Math.round(voz * 0.4), b = Math.round(voz * 0.6), c = Math.round(voz * 0.8);
  return (
    <AbsoluteFill>
      <Pequeno t="Motion design" at={0} end={dur - 10} y={640} size={64} />
      <Voo t="explica." at={a - 4} end={b - 6} y={820} />
      <Voo t="prende." at={b - 4} end={c - 6} y={820} />
      <Grande t="vende." at={c - 4} end={dur - 10} y={820} size={220} />
    </AbsoluteFill>
  );
};

const CardEx: React.FC<{ tipo: number }> = ({ tipo }) => {
  const frame = useCurrentFrame();
  if (tipo === 0)
    return (
      <AbsoluteFill style={{ background: "linear-gradient(160deg,#4a2a1a,#1e110a)", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 92, color: "#f3d8b5" }}>Aurora Café</div>
        <div style={{ fontFamily: F, fontSize: 32, color: "#f3d8b5", opacity: 0.8 }}>novo blend · peça já</div>
      </AbsoluteFill>
    );
  if (tipo === 1)
    return (
      <AbsoluteFill style={{ background: "#eaf2ff", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, fontFamily: F }}>
        <div style={{ fontWeight: 900, fontSize: 76, color: "#1856c9" }}>Clínica Vita</div>
        <div style={{ display: "flex", gap: 14 }}>
          {["09:00", "14:00", "16:30"].map((t, i) => <div key={t} style={{ padding: "18px 34px", borderRadius: 18, background: i === 1 ? "#1856c9" : "#fff", color: i === 1 ? "#fff" : "#1856c9", fontWeight: 800, fontSize: 36 }}>{t}</div>)}
        </div>
      </AbsoluteFill>
    );
  const v = Math.round(interpolate(frame, [0, 30], [0, 38], { ...cl, easing: OUT }));
  return (
    <AbsoluteFill style={{ background: "#0d0a14", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, fontFamily: F }}>
      <div style={{ fontSize: 26, letterSpacing: "0.2em", color: "rgba(255,255,255,.6)", fontWeight: 700 }}>NORTE LOGÍSTICA</div>
      <div style={{ fontWeight: 900, fontSize: 150, color: "#fff", textShadow: glow(P.acc, 0.6) }}>+{v}%</div>
      <div style={{ fontSize: 36, color: P.accL, fontWeight: 700 }}>entregas no prazo</div>
    </AbsoluteFill>
  );
};
const Exemplos: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const at = [2, Math.round(voz * 0.2), Math.round(voz * 0.36)];
  const txt = Math.round(voz * 0.6);
  const rec = interpolate(frame, [txt - 6, txt + 12], [0, 1], { ...cl, easing: INOUT });
  const labels = ["Produto", "Serviço", "Resultados"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1600 }}>
        {at.map((a, i) => {
          const s = spring({ frame: frame - a, fps: 30, config: { damping: 16 } });
          if (frame < a) return null;
          const depth = (at.filter((x) => frame >= x).length - 1 - i); // 0 = mais à frente
          const z = -depth * 260 - rec * 500;
          return (
            <div key={i} style={{ position: "absolute", left: 140, top: 560 - depth * 70, width: 800, height: 520, borderRadius: 40, overflow: "hidden", transform: `translateZ(${z}px) rotateY(${-16 + depth * 6}deg) rotateX(10deg) translateX(${(1 - s) * 700}px)`, opacity: s * (1 - rec * 0.7), filter: `blur(${depth * 3 + rec * 8}px)`, boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 2px rgba(201,178,255,.4)` }}>
              <Sequence from={a} layout="none">
                <CardEx tipo={i} />
              </Sequence>
              <div style={{ position: "absolute", left: 24, top: 24, padding: "10px 22px", borderRadius: 999, background: "rgba(13,10,20,.75)", color: P.accL, fontFamily: F, fontWeight: 700, fontSize: 26 }}>{labels[i]} · exemplo</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Pequeno t="seu negócio contado em" at={txt} end={dur - 10} y={430} size={52} />
      <Grande t="poucos segundos" at={txt + 8} end={dur - 10} y={510} size={112} />
      {frame >= txt ? (
        <div style={{ position: "absolute", left: 540 - 110, top: 1250, scale: String(spring({ frame: frame - txt - 6, fps: 30, config: { damping: 12 } }) * (1 + interpolate(frame, [dur - 10, dur], [0, 2], cl))), opacity: 1 - interpolate(frame, [dur - 10, dur], [0, 1], cl) }}>
          <IconeGlow k="relogio" size={220} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Recursos: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const items = [
    { k: "cc", t: "Legendas dinâmicas", f: 0.05 },
    { k: "som", t: "Efeitos sonoros", f: 0.2 },
    { k: "mic", t: "Narração", f: 0.36 },
  ];
  const txt = Math.round(voz * 0.58);
  const up = interpolate(frame, [txt - 6, txt + 12], [0, 1], { ...cl, easing: INOUT });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1400 }}>
        {items.map((it, i) => {
          const a = Math.round(voz * it.f);
          const s = spring({ frame: frame - a, fps: 30, config: { damping: 13 } });
          if (frame < a) return null;
          const out = interpolate(frame, [dur - 10, dur], [0, 1], { ...cl, easing: IN });
          return (
            <div key={i} style={{ position: "absolute", left: 120, right: 120, top: 520 + i * 270 - up * 260, display: "flex", alignItems: "center", gap: 40, transform: `rotateY(${-14 + i * 4}deg) translateZ(${(1 - s) * -600}px)`, opacity: s * (1 - out), filter: `blur(${(1 - s) * 12 + out * 20}px)`, scale: String(1 - up * 0.2 + out) }}>
              <IconeGlow k={it.k} size={190} />
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 64, color: "#fff", letterSpacing: "-0.04em", textShadow: glow(P.acc, 0.3) }}>{it.t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Pequeno t="pronto para" at={txt} end={dur - 10} y={1330} size={50} />
      <Grande t="reels e anúncios" at={txt + 6} end={dur - 10} y={1410} size={124} />
    </AbsoluteFill>
  );
};

const Caro: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const big = Math.round(voz * 0.55);
  const strike = interpolate(frame, [voz - 4, voz + 8], [0, 1], { ...cl, easing: OUT });
  return (
    <AbsoluteFill>
      <Pequeno t="e o melhor:" at={0} end={dur - 10} y={520} size={46} color="rgba(255,255,255,.6)" />
      <Pequeno t="você não precisa pagar" at={Math.round(voz * 0.18)} end={dur - 10} y={600} size={58} />
      {[0, 1, 2].map((i) => {
        const a = big + i * 5;
        const s = spring({ frame: frame - a, fps: 30, config: { damping: 9 } });
        if (frame < a) return null;
        const pos = [[110, 1180, -14], [820, 620, 12], [760, 1380, 8]][i];
        return <div key={i} style={{ position: "absolute", left: pos[0], top: pos[1], fontFamily: F, fontWeight: 900, fontSize: 200 - i * 40, color: P.red, textShadow: glow(P.red, 0.8), scale: String(s), rotate: `${pos[2]}deg`, opacity: (random(`q${Math.floor(frame / 3)}${i}`) > 0.9 ? 0.4 : 0.9) * (1 - interpolate(frame, [dur - 10, dur], [0, 1], cl)) }}>?</div>;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
        <Grande t="CARO" at={big} end={dur - 10} y={760} size={260} red underline={false} />
      </div>
      {frame >= voz - 4 && frame < dur ? <div style={{ position: "absolute", left: 230, top: 900, width: 620 * strike, height: 22, borderRadius: 11, background: "#fff", boxShadow: glow(P.acc, 0.7), rotate: "-4deg", opacity: 1 - interpolate(frame, [dur - 10, dur], [0, 1], cl) }} /> : null}
    </AbsoluteFill>
  );
};

const Preco: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const big = Math.round(voz * 0.4);
  const n = Math.round(interpolate(frame, [big, big + 30], [0, MARCA.preco], { ...cl, easing: OUT }));
  const ic = Math.round(voz * 0.72);
  const icS = spring({ frame: frame - ic, fps: 30, config: { damping: 12 } });
  const out = interpolate(frame, [dur - 10, dur], [0, 1], { ...cl, easing: IN });
  return (
    <AbsoluteFill>
      <Pequeno t="criativos a partir de" at={2} end={dur - 10} y={520} size={58} />
      <Grande t={`R$ ${n}`} at={big} end={dur - 10} y={620} size={250} />
      {frame >= ic ? (
        <div style={{ position: "absolute", left: 540 - 120, top: 1150, scale: String(icS * (1 + out * 2)), opacity: 1 - out, filter: `blur(${out * 18}px)` }}>
          <IconeGlow k="cifrao" size={240} />
        </div>
      ) : null}
      <Cursor path={[[ic + 4, 900, 1600], [ic + 20, 560, 1290], [dur, 580, 1310]]} click={ic + 22} />
    </AbsoluteFill>
  );
};

const Entrega: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const big = Math.round(voz * 0.32);
  const fill = interpolate(frame, [big, voz * 0.9], [0, 1], { ...cl, easing: INOUT });
  const out = interpolate(frame, [dur - 10, dur], [0, 1], { ...cl, easing: IN });
  const show = interpolate(frame, [big + 4, big + 14], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Pequeno t="do roteiro ao" at={0} end={dur - 10} y={600} size={58} />
      <Grande t="vídeo pronto" at={big} end={dur - 10} y={690} size={150} underline={false} />
      <div style={{ position: "absolute", left: 190, right: 190, top: 900, opacity: show * (1 - out), filter: `blur(${out * 16}px)` }}>
        <div style={{ height: 20, borderRadius: 20, background: "rgba(201,178,255,.15)", overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(201,178,255,.3)" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 20, background: `linear-gradient(90deg, ${P.deep}, ${P.accL})`, boxShadow: glow(P.acc, 0.5) }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: F, fontSize: 32, color: "rgba(255,255,255,.75)" }}>
          <span>briefing</span>
          <span>roteiro</span>
          <span style={{ color: fill > 0.98 ? P.accL : undefined, fontWeight: fill > 0.98 ? 800 : 400 }}>pronto ✓</span>
        </div>
      </div>
      {frame >= Math.round(voz * 0.62) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: 1 - out, scale: String(spring({ frame: frame - Math.round(voz * 0.62), fps: 30, config: { damping: 12 } }) * (1 + out)) }}>
          <IconeGlow k="raio" size={150} />
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 70, color: "#fff", textShadow: glow(P.acc, 0.4) }}>entrega rápida</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const CTA: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const big = Math.round(voz * 0.3);
  const ic = Math.round(voz * 0.55);
  const icS = spring({ frame: frame - ic, fps: 30, config: { damping: 12 } });
  const click = ic + 30;
  const out = interpolate(frame, [dur - 10, dur], [0, 1], { ...cl, easing: IN });
  return (
    <AbsoluteFill>
      <Pequeno t="chama no" at={0} end={dur - 10} y={560} size={60} />
      <Grande t="direct" at={big} end={dur - 10} y={650} size={210} />
      {frame >= ic ? (
        <div style={{ position: "absolute", left: 540 - 120, top: 1130, scale: String(icS * (1 + out * 2) * (1 + interpolate(frame, [click, click + 6, click + 14], [0, 0.12, 0], cl))), opacity: 1 - out }}>
          <IconeGlow k="enviar" size={240} />
        </div>
      ) : null}
      <Pequeno t="e peça o seu" at={Math.round(voz * 0.7)} end={dur - 10} y={1440} size={54} />
      <Cursor path={[[ic + 4, 900, 1700], [click - 4, 560, 1270], [dur, 580, 1300]]} click={click} />
    </AbsoluteFill>
  );
};

const Fim: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - 4, fps: 30, config: { damping: 13 } });
  const sub = interpolate(frame, [22, 36], [0, 1], { ...cl, easing: OUT });
  const ring = interpolate(frame, [2, 26], [0, 1], { ...cl, easing: OUT });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 1500 * ring, height: 1500 * ring, borderRadius: "50%", border: `4px solid ${P.acc}`, opacity: 1 - ring, boxShadow: glow(P.acc, 0.6) }} />
      <div style={{ display: "flex", alignItems: "center", gap: 28, scale: String(0.6 + 0.4 * p), opacity: p, filter: `blur(${(1 - p) * 14}px)` }}>
        <div style={{ width: 170, height: 170, borderRadius: 50, background: `linear-gradient(145deg, ${P.acc}, ${P.deep})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(P.acc, 0.9) }}>
          <svg width={100} height={100} viewBox="0 0 24 24"><path d="M5 3l7 18 2.5-7.5L22 11z" fill="#fff" stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, fontFamily: F }}>
          <span style={{ fontWeight: 900, fontSize: 150, color: "#fff", letterSpacing: "-0.06em", textShadow: glow(P.acc, 0.5) }}>{MARCA.nome}</span>
          <span style={{ fontWeight: 500, fontSize: 72, color: P.accL, letterSpacing: "-0.02em" }}>{MARCA.sub}</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1220, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: sub, translate: `0 ${(1 - sub) * 20}px`, fontFamily: F }}>
        <div style={{ fontSize: 46, color: "rgba(255,255,255,.85)" }}>em vídeos que <b style={{ color: P.accL }}>vendem</b></div>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", padding: "16px 38px", borderRadius: 999, border: `2px solid ${P.acc}`, boxShadow: glow(P.acc, 0.3) }}>{MARCA.arroba}</div>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================== linha do tempo (mesma narração e tempos da v2)
const GAP = 8, LEAD = 6, FIM = 90;
const EXTRA: Record<string, number> = { gancho: 6, vende: 10, exemplos: 10, preco: 30, cta: 40 };
const MAP: Record<string, React.FC<S>> = { gancho: Gancho, feed: Feed, vende: Vende, exemplos: Exemplos, recursos: Recursos, caro: Caro, preco: Preco, entrega: Entrega, cta: CTA };
const PLAN = (() => {
  let t = 0;
  return VO.map((v, i) => {
    const lead = i === 0 ? LEAD : 0;
    const dur = lead + v.voz + GAP + (EXTRA[v.id] ?? 0);
    const r = { ...v, from: t, dur, lead };
    t += dur;
    return r;
  });
})();
const last = PLAN[PLAN.length - 1];
export const PROMO3_TOTAL = last.from + last.dur + FIM;
const OV = 6;

const Raiz: React.FC = () => {
  const frame = useCurrentFrame();
  const g = PLAN.find((p) => p.id === "gancho")!;
  const c = PLAN.find((p) => p.id === "caro")!;
  const red = Math.max(
    interpolate(frame, [g.from + g.voz * 0.45, g.from + g.voz * 0.55, g.from + g.dur - 4, g.from + g.dur + 6], [0, 1, 1, 0], cl),
    interpolate(frame, [c.from + c.voz * 0.5, c.from + c.voz * 0.6, c.from + c.voz - 4, c.from + c.voz + 8], [0, 1, 1, 0], cl),
  );
  return <Mundo red={red} />;
};

export const PromoVideo3: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg1 }}>
    <Raiz />
    {PLAN.map((s, i) => {
      const C = MAP[s.id];
      const ov = i === 0 ? 0 : OV;
      return (
        <Sequence key={s.id} from={s.from - ov} durationInFrames={s.dur + ov + 4} name={s.id}>
          <C dur={s.dur + ov} voz={s.lead + s.voz + ov} />
          <Sequence from={ov + s.lead} layout="none">
            <Audio src={staticFile(`promo/vo/${s.f}.wav`)} />
          </Sequence>
        </Sequence>
      );
    })}
    <Sequence from={last.from + last.dur - 4} durationInFrames={FIM + 4}>
      <Fim dur={FIM} />
    </Sequence>
    <Sequence from={PLAN.find((p) => p.id === "cta")!.from}>
      <Fumaca start={0} />
    </Sequence>
    <Audio src={staticFile("promo/musica3.wav")} volume={0.9} />
    <Audio src={staticFile("promo/efeitos3.wav")} volume={0.85} />
  </AbsoluteFill>
);
