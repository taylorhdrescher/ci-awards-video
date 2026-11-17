/**
 * Eduardo Veículos (Montenegro/RS) — motion vertical no estilo cinematográfico da referência:
 * mundo escuro contínuo (raios poligonais + partículas), texto em dois níveis com brilho, dores em vermelho,
 * objetos em 3D, cartões dos carros girando, cartão de crédito 3D, fachada da loja, fumaça no final.
 * Fotos e textos tirados do perfil @eduardoeveiculos.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { ArrowLeftRight, BadgeCheck, CreditCard, FileX2, Landmark, MapPin, Percent, ShieldCheck } from "lucide-react";
import ROTEIRO from "./roteiro.json";

loadFont({ family: "Jakarta", url: staticFile("fonts/Jakarta.woff2"), weight: "200 800" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });
const H = "'Jakarta', sans-serif";
const B = "'Inter', sans-serif";
const P = { bg1: "#04061a", bg2: "#111a52", acc: "#6d74ff", accL: "#c3c7ff", deep: "#3a3fc4", red: "#ff3b4e" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN = Easing.in(Easing.cubic);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const sp = (f: number, d = 14, m = 0.8) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const glow = (c: string, k = 1) => `0 0 ${16 * k}px ${c}, 0 0 ${46 * k}px ${c}, 0 0 ${100 * k}px ${c}88`;

// ---------------------------------------------------------------- tempo
const GAP = 5, OV = 10, FIM_EXTRA = 70;
const LEAD: Record<string, number> = { gancho: 8 };
const TAIL: Record<string, number> = { gancho: 16, dor: 16, marca: 26, estoque: 24, pagamento: 22, troca: 22, loja: 24, fim: FIM_EXTRA };
type Frase = { f: string; leg: string; frames: number; at: number };
const CENAS = ROTEIRO.map((c) => {
  let t = LEAD[c.id] ?? 4;
  const frases: Frase[] = c.frases.map((f) => { const r = { ...f, at: t }; t += f.frames + GAP; return r; });
  return { id: c.id, frases, dur: t - GAP + (TAIL[c.id] ?? 20) };
});
const START = CENAS.reduce<number[]>((a, c, i) => (a.push(i ? a[i - 1] + CENAS[i - 1].dur : 0), a), []);
export const EDU_TOTAL = START[START.length - 1] + CENAS[CENAS.length - 1].dur;
const q = (id: string, i: number, frac = 0) => { const c = CENAS.find((x) => x.id === id)!; return Math.round(c.frases[i].at + c.frases[i].frames * frac) + OV; };

// ---------------------------------------------------------------- mundo contínuo
const PTS = new Array(44).fill(0).map((_, i) => [random(`ex${i}`) * 2200 - 560, random(`ey${i}`) * 2900 - 500]);
const EDGES: [number, number][] = [];
PTS.forEach((p, i) => {
  const d = PTS.map((o, j) => [j, Math.hypot(p[0] - o[0], p[1] - o[1])] as [number, number]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
  d.slice(0, 3).forEach(([j]) => { if (i < j) EDGES.push([i, j]); });
});
const Mundo: React.FC<{ red: number }> = ({ red }) => {
  const frame = useCurrentFrame();
  const col = red > 0.5 ? P.red : P.acc;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 42%, ${red > 0.5 ? "#3a0712" : P.bg2} 0%, ${P.bg1} 75%)` }}>
      <AbsoluteFill style={{ rotate: `${frame * 0.03}deg`, scale: String(1.12 + 0.06 * Math.sin(frame / 180)), translate: `${Math.sin(frame / 150) * 60}px ${Math.cos(frame / 170) * 70}px` }}>
        <svg width={1080} height={1920} style={{ overflow: "visible" }}>
          {EDGES.slice(0, 26).map(([a, b], k) => <polygon key={"f" + k} points={`${PTS[a].join(",")} ${PTS[b].join(",")} 540,${960 + Math.sin(k) * 420}`} fill={col} opacity={0.035 + 0.035 * Math.sin(frame / 40 + k)} />)}
          {EDGES.map(([a, b], k) => <line key={k} x1={PTS[a][0]} y1={PTS[a][1]} x2={PTS[b][0]} y2={PTS[b][1]} stroke={col} strokeOpacity={0.3 + 0.25 * Math.sin(frame / 30 + k * 1.7)} strokeWidth={1.8} />)}
        </svg>
      </AbsoluteFill>
      {new Array(80).fill(0).map((_, i) => {
        const z = random(`ez${i}`);
        const y = (((random(`ey2${i}`) * 2100 - frame * (0.3 + z * 1.6)) % 2100) + 2100) % 2100 - 90;
        const s = 1.5 + z * 6;
        const c = red > 0.5 && i % 2 ? P.red : P.accL;
        return <div key={i} style={{ position: "absolute", left: random(`ex2${i}`) * 1080, top: y, width: s, height: s, borderRadius: "50%", background: c, opacity: (0.2 + 0.55 * z) * (0.6 + 0.4 * Math.sin(frame / 9 + i)), boxShadow: `0 0 ${s * 3}px ${c}`, filter: z > 0.85 ? "blur(3px)" : undefined }} />;
      })}
      {/* faixas diagonais da marca passando ao fundo */}
      {[0, 1, 2].map((k) => {
        const x = ((frame * (2 + k) + k * 600) % 2600) - 1300;
        return <div key={k} style={{ position: "absolute", left: x, top: 300 + k * 520, width: 900, height: 10 - k * 2, borderRadius: 6, background: `linear-gradient(90deg, transparent, ${P.acc}, transparent)`, rotate: "-12deg", opacity: 0.35 }} />;
      })}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 80px rgba(0,0,0,.85)" }} />
    </AbsoluteFill>
  );
};
const Fumaca: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 30], [0, 1], cl), mixBlendMode: "screen" }}>
      {new Array(9).fill(0).map((_, i) => {
        const t = frame + i * 30;
        const y = 2000 - ((t * (1.6 + random(`sm${i}`))) % 2300);
        const w = 320 + random(`sw${i}`) * 420;
        return <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080 - w / 2 + Math.sin(t / 40 + i) * 80, top: y, width: w, height: w * 1.8, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(195,199,255,.32), transparent 65%)", filter: "blur(40px)" }} />;
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- tipografia
const useDepth = (start: number, end?: number) => {
  const frame = useCurrentFrame();
  const i = interpolate(frame, [start, start + 14], [0, 1], { ...cl, easing: OUT });
  const o = end !== undefined ? interpolate(frame, [end, end + 9], [0, 1], { ...cl, easing: IN }) : 0;
  return { visible: frame >= start && (end === undefined || frame < end + 9), style: { opacity: i * (1 - o), scale: String((0.55 + 0.45 * i) * (1 + o * 2.2)), filter: `blur(${(1 - i) * 18 + o * 26}px)` } as React.CSSProperties };
};
const Pequeno: React.FC<{ t: string; at: number; end?: number; y: number; size?: number; color?: string }> = ({ t, at, end, y, size = 52, color = "rgba(255,255,255,.88)" }) => {
  const frame = useCurrentFrame();
  const d = useDepth(at, end);
  if (!d.visible) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", ...d.style }}>
      <div style={{ display: "flex", gap: size * 0.26, fontFamily: B, fontWeight: 400, fontSize: size, color, letterSpacing: "-0.01em" }}>
        {t.split(" ").map((w, i) => {
          const k = interpolate(frame, [at + i * 2, at + i * 2 + 10], [0, 1], { ...cl, easing: OUT });
          return <span key={i} style={{ opacity: k, filter: `blur(${(1 - k) * 8}px)`, translate: `0 ${(1 - k) * 20}px`, display: "inline-block" }}>{w}</span>;
        })}
      </div>
    </div>
  );
};
const Grande: React.FC<{ t: string; at: number; end?: number; y: number; size?: number; red?: boolean; underline?: boolean }> = ({ t, at, end, y, size = 150, red, underline = true }) => {
  const frame = useCurrentFrame();
  const d = useDepth(at, end);
  if (!d.visible) return null;
  const c = red ? P.red : P.accL;
  const g = red ? P.red : P.acc;
  const flick = red ? (random(`fl${Math.floor(frame / 2)}`) > 0.85 ? 0.45 : 1) : 1;
  const u = interpolate(frame, [at + 8, at + 22], [0, 1], { ...cl, easing: OUT });
  const txt: React.CSSProperties = { fontFamily: H, fontWeight: 800, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", ...d.style }}>
      <div style={{ position: "relative" }}>
        <div style={{ ...txt, position: "absolute", inset: 0, color: c, opacity: 0.35, filter: "blur(10px)", scale: String(1 + interpolate(frame - at, [0, 30], [0.25, 0.04], cl)) }}>{t}</div>
        {red ? <div style={{ ...txt, position: "absolute", left: 6, top: 0, color: "#00e5ff", opacity: 0.3 * (1.3 - flick), mixBlendMode: "screen" }}>{t}</div> : null}
        <div style={{ ...txt, color: red ? "#ffd6dc" : "#fff", textShadow: glow(g, red ? 1 : 0.75), opacity: flick }}>{t}</div>
      </div>
      {underline ? <div style={{ height: 6, width: `${u * 70}%`, borderRadius: 6, background: c, boxShadow: glow(g, 0.5), marginTop: 18 }} /> : null}
    </div>
  );
};
const Voo: React.FC<{ t: string; at: number; end?: number; y: number; size?: number }> = ({ t, at, end, y, size = 220 }) => {
  const frame = useCurrentFrame();
  if (frame < at || (end !== undefined && frame > end + 9)) return null;
  const k = interpolate(frame, [at, at + 14], [0, 1], { ...cl, easing: OUT });
  const o = end !== undefined ? interpolate(frame, [end, end + 9], [0, 1], { ...cl, easing: IN }) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", scale: String(interpolate(k, [0, 1], [3.6, 1]) * (1 + o * 2.5)), filter: `blur(${(1 - k) * 22 + o * 24}px)`, opacity: Math.min(1, k * 2) * (1 - o), translate: `${(1 - k) * 260}px 0` }}>
      <div style={{ fontFamily: H, fontWeight: 800, fontSize: size, letterSpacing: "-0.05em", color: "#fff", textShadow: glow(P.acc, 0.9), whiteSpace: "nowrap" }}>{t}</div>
    </div>
  );
};
const IcGlow: React.FC<{ Icon: React.FC<any>; size?: number; red?: boolean }> = ({ Icon, size = 200, red }) => {
  const frame = useCurrentFrame();
  const g = red ? P.red : P.acc;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(145deg, ${red ? "rgba(255,59,78,.35)" : "rgba(109,116,255,.4)"}, rgba(10,12,40,.4))`, border: `2px solid ${g}aa`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(g, 0.6), rotate: `${Math.sin(frame / 30) * 6}deg` }}>
      <Icon size={size * 0.5} color={red ? "#ffc2ca" : "#fff"} strokeWidth={1.8} style={{ filter: `drop-shadow(0 0 8px ${g})` }} />
    </div>
  );
};
const Pop: React.FC<{ at: number; end?: number; x: number; y: number; children: React.ReactNode }> = ({ at, end, x, y, children }) => {
  const frame = useCurrentFrame();
  if (frame < at || (end !== undefined && frame > end + 10)) return null;
  const s = sp(frame - at, 11);
  const o = end !== undefined ? interpolate(frame, [end, end + 10], [0, 1], { ...cl, easing: IN }) : 0;
  return <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s * (1 + o * 1.6)), opacity: 1 - o, filter: `blur(${o * 18}px)`, rotate: `${(1 - s) * 20}deg` }}>{children}</div>;
};
/** logo recriado: faixas diagonais + EDUARDO espaçado + VEÍCULOS */
const Logo: React.FC<{ at: number; s?: number }> = ({ at, s = 1 }) => {
  const frame = useCurrentFrame();
  const l = "EDUARDO".split("");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", scale: String(s) }}>
      <div style={{ position: "relative", width: 900, height: 60 }}>
        {[0, 1, 2].map((k) => {
          const p = interpolate(frame, [at + k * 3, at + 14 + k * 3], [0, 1], { ...cl, easing: OUT });
          return <div key={k} style={{ position: "absolute", left: 120 + k * 60, top: k * 18, width: 660 * p, height: 9, borderRadius: 4, background: `linear-gradient(90deg, ${P.acc}, ${P.accL})`, transform: "skewX(-35deg)", boxShadow: glow(P.acc, 0.3) }} />;
        })}
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
        {l.map((c, i) => {
          const k = sp(frame - at - 8 - i * 2, 15, 0.6);
          return <span key={i} style={{ fontFamily: H, fontWeight: 700, fontSize: 118, color: "#fff", opacity: k, translate: `0 ${(1 - k) * 60}px`, filter: `blur(${(1 - Math.min(1, k)) * 8}px)`, textShadow: glow(P.acc, 0.35) }}>{c}</span>;
        })}
      </div>
      <div style={{ fontFamily: H, fontWeight: 500, fontSize: 44, letterSpacing: "0.62em", color: P.accL, marginTop: 6, opacity: interpolate(frame, [at + 24, at + 36], [0, 1], cl) }}>VEÍCULOS</div>
      <div style={{ width: 760 * interpolate(frame, [at + 26, at + 44], [0, 1], { ...cl, easing: OUT }), height: 3, background: "rgba(255,255,255,.7)", marginTop: 18 }} />
      <div style={{ fontFamily: B, fontWeight: 500, fontSize: 34, letterSpacing: "0.3em", color: "rgba(255,255,255,.85)", marginTop: 18, opacity: interpolate(frame, [at + 34, at + 46], [0, 1], cl) }}>COMPRO · VENDO · TROCO</div>
    </div>
  );
};
const Foto: React.FC<{ src: string; w: number; h: number; style?: React.CSSProperties }> = ({ src, w, h, style }) => (
  <div style={{ width: w, height: h, borderRadius: 34, overflow: "hidden", boxShadow: `0 0 0 2px ${P.accL}88, 0 40px 90px rgba(0,0,0,.6), 0 0 80px ${P.acc}55`, position: "relative", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(4,6,26,.85))" }} />
  </div>
);

// ---------------------------------------------------------------- cenas
type S = { dur: number };
const exitOf = (dur: number) => dur - 10;
const Gancho: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = q("gancho", 0);
  const car = sp(frame - 2, 16, 1);
  const out = interpolate(frame, [exitOf(dur), dur], [0, 1], { ...cl, easing: IN });
  const streak = interpolate(frame, [4, 30], [-600, 1700], cl);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: streak, top: 980, width: 600, height: 6, borderRadius: 3, background: `linear-gradient(90deg, transparent, #fff, ${P.acc})`, boxShadow: glow(P.acc, 0.6) }} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <div style={{ position: "absolute", left: 90, top: 640, transform: `rotateY(${interpolate(frame, [0, dur], [-18, 8])}deg) rotateX(6deg) translateZ(${(1 - car) * -900}px) scale(${1 + out * 1.8})`, opacity: car * (1 - out), filter: `blur(${out * 18}px) brightness(${0.4 + 0.6 * car})` }}>
          <Foto src="edu/toro.png" w={900} h={680} />
        </div>
      </AbsoluteFill>
      <Pequeno t="procurando o seu" at={a} end={exitOf(dur)} y={300} size={58} />
      <Grande t="próximo carro?" at={a + 10} end={exitOf(dur)} y={390} size={150} />
    </AbsoluteFill>
  );
};
const Dor: React.FC<S> = ({ dur }) => {
  const e = exitOf(dur);
  const a1 = q("dor", 0), a2 = q("dor", 1);
  const Anuncio: React.FC<{ txt: string; rot: number }> = ({ txt, rot }) => (
    <div style={{ width: 520, padding: 30, borderRadius: 16, background: "linear-gradient(135deg,#d7d7d7,#a9a9a9)", rotate: `${rot}deg`, fontFamily: "Arial, sans-serif", boxShadow: "0 30px 70px rgba(0,0,0,.6)", filter: "saturate(.4)" }}>
      <div style={{ height: 200, background: "repeating-linear-gradient(45deg,#999 0 12px,#8a8a8a 12px 24px)", borderRadius: 8 }} />
      <div style={{ fontSize: 40, fontWeight: 900, color: "#c01818", marginTop: 14 }}>{txt}</div>
      <div style={{ fontSize: 26, color: "#444" }}>chama no zap, sem frescura</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Pop at={a1 - 4} end={e} x={330} y={780}><Anuncio txt="VENDO URGENTE!!!" rot={-8} /></Pop>
      <Pop at={a1 + 4} end={e} x={760} y={1010}><Anuncio txt="ÚNICO DONO??" rot={7} /></Pop>
      <Grande t="duvidoso" at={a1 + 12} end={a2 - 4} y={360} size={170} red underline={false} />
      <Pequeno t="carro sem" at={a2} end={e} y={300} size={58} color="#ffc2ca" />
      <Grande t="procedência" at={a2 + 6} end={e} y={380} size={150} red underline={false} />
      <Pop at={a2 + 10} end={e} x={540} y={1430}><IcGlow Icon={FileX2} red size={210} /></Pop>
    </AbsoluteFill>
  );
};
const Marca: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const e = exitOf(dur);
  const out = interpolate(frame, [e, dur], [0, 1], { ...cl, easing: IN });
  const ring = interpolate(frame, [OV, OV + 26], [0, 1], { ...cl, easing: OUT });
  const pin = sp(frame - q("marca", 0, 0.62), 10);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540, top: 820, width: 1600 * ring, height: 1600 * ring, translate: "-50% -50%", borderRadius: "50%", border: `4px solid ${P.acc}`, opacity: 1 - ring, boxShadow: glow(P.acc, 0.5) }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", translate: "0 -120px", scale: String(1 + out * 1.6), opacity: 1 - out, filter: `blur(${out * 20}px)` }}>
        <Logo at={OV + 2} />
      </AbsoluteFill>
      {frame >= q("marca", 0, 0.62) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center", scale: String(pin * (1 + out)), opacity: 1 - out }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 40px", borderRadius: 999, border: `2px solid ${P.acc}`, background: "rgba(109,116,255,.18)", boxShadow: glow(P.acc, 0.35), fontFamily: H, fontWeight: 700, fontSize: 46, color: "#fff" }}>
            <MapPin size={48} color={P.accL} /> Montenegro · RS
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const CARROS = [
  { src: "edu/toro.png", n: "Fiat Toro", a: "2026", p: "R$ 159.990" },
  { src: "edu/compass.png", n: "Jeep Compass", a: "2025", p: "R$ 129.900" },
  { src: "edu/samurai.png", n: "Suzuki Samurai", a: "1994", p: "R$ 49.990" },
  { src: "edu/fiesta.png", n: "Ford Fiesta", a: "2014", p: "R$ 35.990" },
  { src: "edu/zafira.png", n: "Chevrolet Zafira", a: "2008", p: "R$ 31.990" },
  { src: "edu/vectra.png", n: "Chevrolet Vectra", a: "2009", p: "R$ 35.990" },
];
const Estoque: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const e = exitOf(dur);
  const a1 = q("estoque", 0), a2 = q("estoque", 1);
  const enter = sp(frame - OV, 18, 1);
  const out = interpolate(frame, [e, dur], [0, 1], { ...cl, easing: IN });
  const R = 720;
  const rot = interpolate(frame, [OV, dur], [-10, -10 - 300]);
  return (
    <AbsoluteFill>
      <Pequeno t="estoque" at={a1 + 8} end={e} y={240} size={58} />
      <Grande t="selecionado" at={a1 + 18} end={e} y={320} size={150} />
      <AbsoluteFill style={{ perspective: 1500, opacity: enter * (1 - out), filter: `blur(${out * 18}px)` }}>
        <div style={{ position: "absolute", left: 540, top: 1000, transformStyle: "preserve-3d", transform: `translateZ(${-R - 120}px) rotateY(${rot}deg) scale(${0.6 + 0.4 * enter})` }}>
          {CARROS.map((c, i) => {
            const ang = (i / CARROS.length) * 360;
            return (
              <div key={c.src} style={{ position: "absolute", left: -330, top: -260, width: 660, transform: `rotateY(${ang}deg) translateZ(${R}px)`, backfaceVisibility: "hidden" }}>
                <Foto src={c.src} w={660} h={500} />
                <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: H, color: "#fff" }}>
                  <div>
                    <div style={{ fontSize: 26, color: P.accL, fontWeight: 600 }}>{c.a}</div>
                    <div style={{ fontSize: 40, fontWeight: 800 }}>{c.n}</div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, padding: "8px 18px", borderRadius: 14, background: P.acc }}>{c.p}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {frame >= a2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", scale: String(sp(frame - a2, 10) * (1 + out)), opacity: 1 - out }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 48px", borderRadius: 999, background: `linear-gradient(135deg, ${P.acc}, ${P.deep})`, boxShadow: glow(P.acc, 0.6), fontFamily: H, fontWeight: 800, fontSize: 56, color: "#fff" }}>
            <ShieldCheck size={62} /> com garantia
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Cartao: React.FC<{ at: number; end: number }> = ({ at, end }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > end + 10) return null;
  const s = sp(frame - at, 14, 1);
  const o = interpolate(frame, [end, end + 10], [0, 1], { ...cl, easing: IN });
  const ry = interpolate(s, [0, 1], [-120, -14]) + Math.sin(frame / 25) * 8;
  const shine = interpolate((frame - at) % 60, [0, 60], [-60, 160]);
  return (
    <div style={{ position: "absolute", left: 540 - 380, top: 820, perspective: 1400, opacity: 1 - o, scale: String(1 + o * 1.6), filter: `blur(${o * 18}px)` }}>
      <div style={{ width: 760, height: 470, borderRadius: 40, padding: 48, boxSizing: "border-box", background: `linear-gradient(135deg, ${P.acc} 0%, ${P.deep} 55%, #0d1033 100%)`, transform: `rotateY(${ry}deg) rotateX(14deg)`, boxShadow: `0 50px 100px rgba(0,0,0,.6), 0 0 80px ${P.acc}66`, position: "relative", overflow: "hidden", fontFamily: H, color: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${shine - 20}%, rgba(255,255,255,.35) ${shine}%, transparent ${shine + 20}%)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: 96, height: 72, borderRadius: 14, background: "linear-gradient(135deg,#f7d98b,#c9a24a)" }} />
          <CreditCard size={64} color="#fff" />
        </div>
        <div style={{ fontSize: 50, letterSpacing: "0.12em", marginTop: 70, fontWeight: 600 }}>•••• •••• •••• 2026</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, fontSize: 30, fontWeight: 700, letterSpacing: "0.2em" }}>
          <span>EDUARDO VEÍCULOS</span>
          <span style={{ color: P.accL }}>CRÉDITO</span>
        </div>
      </div>
    </div>
  );
};
const Pagamento: React.FC<S> = ({ dur }) => {
  const e = exitOf(dur);
  const a1 = q("pagamento", 0), a2 = q("pagamento", 1);
  return (
    <AbsoluteFill>
      <Pequeno t="financiamento" at={a1} end={a2 - 6} y={300} size={58} />
      <Grande t="facilitado" at={a1 + 8} end={a2 - 6} y={380} size={170} />
      <Pop at={a1 + 4} end={a2 - 6} x={330} y={1050}><IcGlow Icon={Landmark} size={240} /></Pop>
      <Pop at={a1 + 10} end={a2 - 6} x={750} y={1150}><IcGlow Icon={Percent} size={200} /></Pop>
      <Pequeno t="e pagamento no" at={a2 + 2} end={e} y={300} size={58} />
      <Grande t="cartão de crédito" at={a2 + 10} end={e} y={380} size={120} />
      <Cartao at={a2 + 2} end={e} />
    </AbsoluteFill>
  );
};
const Troca: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const e = exitOf(dur);
  const c = CENAS.find((x) => x.id === "troca")!.frases[0];
  const t1 = q("troca", 0, 0.02), t2 = q("troca", 0, 0.36), t3 = q("troca", 0, 0.7);
  const swap = interpolate(frame, [t3 + 4, t3 + 22], [0, 1], { ...cl, easing: INOUT });
  void c;
  return (
    <AbsoluteFill>
      <Voo t="Compro." at={t1} end={t2 - 4} y={700} />
      <Voo t="Vendo." at={t2} end={t3 - 4} y={700} />
      <Grande t="Troco." at={t3} end={e} y={360} size={220} />
      {frame >= t3 ? (
        <>
          <div style={{ position: "absolute", left: interpolate(swap, [0, 1], [70, 570]), top: 980 - Math.sin(swap * Math.PI) * 120, opacity: 1 - interpolate(frame, [e, dur], [0, 1], cl) }}>
            <Foto src="edu/fiesta.png" w={440} h={340} />
          </div>
          <div style={{ position: "absolute", left: interpolate(swap, [0, 1], [570, 70]), top: 980 + Math.sin(swap * Math.PI) * 120, opacity: 1 - interpolate(frame, [e, dur], [0, 1], cl) }}>
            <Foto src="edu/compass.png" w={440} h={340} />
          </div>
          <Pop at={t3 + 2} end={e} x={540} y={1150}><IcGlow Icon={ArrowLeftRight} size={170} /></Pop>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
const Loja: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const e = exitOf(dur);
  const a1 = q("loja", 0), a2 = q("loja", 1);
  const s = sp(frame - 2, 16, 1);
  const out = interpolate(frame, [e, dur], [0, 1], { ...cl, easing: IN });
  const pin = sp(frame - a2, 9);
  return (
    <AbsoluteFill>
      <Pequeno t="venha conhecer a" at={a1} end={e} y={230} size={58} />
      <Grande t="nossa loja" at={a1 + 8} end={e} y={310} size={150} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: 90, top: 640, transform: `rotateY(${interpolate(frame, [a1, dur], [22, -6])}deg) rotateX(6deg) translateZ(${(1 - s) * -800}px) scale(${1 + out * 1.6})`, opacity: s * (1 - out), filter: `blur(${out * 18}px)` }}>
          <Foto src="edu/loja.png" w={900} h={830} />
        </div>
      </AbsoluteFill>
      {frame >= a2 ? (
        <div style={{ position: "absolute", left: 130, right: 130, top: 1330, display: "flex", alignItems: "center", gap: 26, padding: "28px 34px", borderRadius: 36, background: "rgba(10,12,40,.82)", border: `2px solid ${P.acc}`, boxShadow: glow(P.acc, 0.35), scale: String(pin * (1 + out)), opacity: 1 - out, fontFamily: H, color: "#fff" }}>
          <MapPin size={84} color={P.accL} fill={P.acc} style={{ translate: `0 ${-Math.abs(Math.sin((frame - a2) / 6)) * 14}px` }} />
          <div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Entre o SESI e a assistência</div>
            <div style={{ fontSize: 32, color: P.accL, fontWeight: 600 }}>Montenegro · RS</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Fim: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = q("fim", 0);
  const chips = [
    { I: BadgeCheck, t: "Garantia" },
    { I: Landmark, t: "Financiamento" },
    { I: CreditCard, t: "Cartão" },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 520 }}>
        <Logo at={OV + 2} s={0.95} />
      </AbsoluteFill>
      <Pequeno t="o seu próximo carro" at={a} y={1060} size={58} />
      <Grande t="está aqui." at={a + 10} y={1140} size={140} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", gap: 16 }}>
        {chips.map((c, i) => {
          const s = sp(frame - a - 24 - i * 5, 12);
          return (
            <div key={c.t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 26px", borderRadius: 999, background: "rgba(109,116,255,.18)", border: `2px solid ${P.acc}`, fontFamily: H, fontWeight: 700, fontSize: 32, color: "#fff", scale: String(s), opacity: s }}>
              <c.I size={34} color={P.accL} /> {c.t}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1580, display: "flex", justifyContent: "center", opacity: interpolate(frame, [a + 40, a + 54], [0, 1], cl), fontFamily: H, fontWeight: 700, fontSize: 40, color: P.accL }}>@eduardoeveiculos</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- legendas
const Legenda: React.FC<{ texto: string; frames: number }> = ({ texto, frames }) => {
  const frame = useCurrentFrame();
  const words = texto.split(" ");
  const w = words.map((x) => x.replace(/[^\p{L}\p{N}$]/gu, "").length + 1.5);
  const tot = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  const st = w.map((x) => { const s = (acc / tot) * frames * 0.94; acc += x; return s; });
  const out = interpolate(frame, [frames + 2, frames + 8], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1700, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 4, rowGap: 4, fontFamily: H, fontWeight: 800, fontSize: 48, letterSpacing: "-0.01em", lineHeight: 1.15, textShadow: "0 3px 12px rgba(0,0,0,.8)" }}>
        {words.map((x, i) => {
          const on = frame >= st[i];
          const now = on && (i === words.length - 1 || frame < st[i + 1]);
          return <span key={i} style={{ padding: "2px 10px", borderRadius: 12, background: now ? P.acc : "transparent", color: on ? "#fff" : "rgba(255,255,255,.35)", display: "inline-block", scale: now ? "1.05" : "1" }}>{x}</span>;
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- montagem
const COMP: Record<string, React.FC<S>> = { gancho: Gancho, dor: Dor, marca: Marca, estoque: Estoque, pagamento: Pagamento, troca: Troca, loja: Loja, fim: Fim };
const RedCtl: React.FC = () => {
  const frame = useCurrentFrame();
  const i = CENAS.findIndex((c) => c.id === "dor");
  const s0 = START[i], s1 = START[i] + CENAS[i].dur;
  return <Mundo red={interpolate(frame, [s0 - 6, s0 + 6, s1 - 8, s1 + 4], [0, 1, 1, 0], cl)} />;
};
export const SFX = (() => {
  const s: { src: string; t: number; v: number }[] = [];
  const st = (id: string) => START[CENAS.findIndex((c) => c.id === id)] - OV;
  const add = (src: string, id: string, f: number, v = 0.6) => s.push({ src, t: st(id) + f, v });
  add("sfx/forceField_001.wav", "gancho", OV, 0.4);
  add("sfx/glitch_004.wav", "dor", q("dor", 0) + 12, 0.6); add("sfx/error_006.wav", "dor", q("dor", 1) + 6, 0.4); add("sfx/glitch_002.wav", "dor", q("dor", 1) + 8, 0.5);
  add("sfx/powerUp7.wav", "marca", OV + 2, 0.45); add("sfx/glass_002.wav", "marca", q("marca", 0, 0.62), 0.5);
  add("sfx/maximize_006.wav", "estoque", OV, 0.5); add("sfx/confirmation_002.wav", "estoque", q("estoque", 1), 0.6);
  add("sfx/select_006.wav", "pagamento", q("pagamento", 0) + 4, 0.5); add("sfx/select_006.wav", "pagamento", q("pagamento", 0) + 10, 0.5); add("sfx/glass_005.wav", "pagamento", q("pagamento", 1) + 2, 0.55);
  [0.02, 0.36, 0.7].forEach((f) => add("sfx/maximize_006.wav", "troca", q("troca", 0, f), 0.45));
  add("sfx/switch_006.wav", "troca", q("troca", 0, 0.7) + 6, 0.5);
  add("sfx/maximize_006.wav", "loja", q("loja", 0), 0.45); add("sfx/drop_002.wav", "loja", q("loja", 1), 0.6);
  add("sfx/powerUp7.wav", "fim", OV + 2, 0.4); add("sfx/confirmation_004.wav", "fim", q("fim", 0) + 24, 0.5);
  return s;
})();
export const EDU_TIMES = { CENAS, START, OV };

export const EduardoVideo: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg1 }}>
    <RedCtl />
    <CameraMotionBlur shutterAngle={180} samples={5}>
      <AbsoluteFill>
        {CENAS.map((c, i) => {
          const C = COMP[c.id];
          const from = Math.max(0, START[i] - OV);
          const d = c.dur + (i ? OV : 0) + 6;
          return (
            <Sequence key={c.id} from={i ? from : -OV} durationInFrames={d + (i ? 0 : OV)} name={c.id}>
              <C dur={c.dur + OV} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </CameraMotionBlur>
    <Sequence from={START[CENAS.length - 1] - 20}>
      <Fumaca />
    </Sequence>
    {CENAS.map((c, i) => c.frases.map((f) => (
      <Sequence key={f.f} from={START[i] + f.at} durationInFrames={f.frames + 10} name={`fala ${f.f}`}>
        <Audio src={staticFile(`edu/vo/${f.f}.wav`)} />
        <Legenda texto={f.leg} frames={f.frames} />
      </Sequence>
    )))}
    {SFX.map((s, i) => (
      <Sequence key={"s" + i} from={Math.max(0, Math.round(s.t))} durationInFrames={60} layout="none">
        <Audio src={staticFile(s.src)} volume={s.v} />
      </Sequence>
    ))}
    <Audio src={staticFile("edu/musica.wav")} volume={0.85} />
  </AbsoluteFill>
);
