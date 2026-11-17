/**
 * Clique Motion — vídeo de apresentação (versão profissional).
 * Estrutura: problema no escuro → virada roxa com a marca → soluções em UI clara (estilo app) → oferta → CTA.
 * Transições com @remotion/transitions, ícones Lucide, Plus Jakarta Sans, legendas palavra a palavra,
 * efeitos sonoros Kenney (CC0) e desfoque de movimento de câmera.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { linearTiming, TransitionSeries, type TransitionPresentationComponentProps } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { CameraMotionBlur } from "@remotion/motion-blur";
import {
  BadgeCheck, CalendarCheck2, Captions, ChevronsDown, Clapperboard, FileText, Megaphone, MousePointer2, MousePointerClick, Music2,
  PenTool, Send, ShoppingBag, Sparkles, Star, TrendingUp, Wallet,
} from "lucide-react";
import ROTEIRO from "./roteiro-f.json";

loadFont({ family: "Jakarta", url: staticFile("fonts/Jakarta.woff2"), weight: "200 800" });
loadFont({ family: "Jakarta", url: staticFile("fonts/Jakarta-italic.woff2"), weight: "200 800", style: "italic" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });

const H = "'Jakarta', sans-serif";
const B = "'Inter', sans-serif";
export const CM = { acc: "#7c3aed", acc2: "#9f67ff", lilas: "#c4b5fd", nevoa: "#ede9fe", bg: "#f7f5ff", ink: "#140b2b", noite: "#0b0617", red: "#ff3b5c" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.76, 0, 0.24, 1);
const sp = (f: number, damping = 14, mass = 0.8) => spring({ frame: f, fps: 30, config: { damping, mass } });
const shadowSoft = "0 30px 60px -20px rgba(60,20,140,.35), 0 12px 24px -12px rgba(20,10,40,.25)";

// ================================================================ tempo (a partir do roteiro)
const GAP = 5; // entre frases
const LEAD: Record<string, number> = { gancho: 8, rolagem: 2, virada: 10, explica: 4, pacote: 4, formatos: 4, preco: 4, cta: 4 };
const TAIL: Record<string, number> = { gancho: 18, rolagem: 18, virada: 26, explica: 20, pacote: 24, formatos: 22, preco: 30, cta: 40 };
const T = 16; // duração das transições
const FIM = 96;
type Frase = { f: string; leg: string; frames: number; at: number };
type Cena = { id: string; dur: number; frases: Frase[] };
export const CENAS: Cena[] = ROTEIRO.map((c) => {
  let t = LEAD[c.id] ?? 4;
  const frases = c.frases.map((f) => {
    const r = { ...f, at: t };
    t += f.frames + GAP;
    return r;
  });
  return { id: c.id, frases, dur: t - GAP + (TAIL[c.id] ?? 20) };
});
const STARTS = CENAS.reduce<number[]>((a, c, i) => (a.push(i ? a[i - 1] + CENAS[i - 1].dur - T : 0), a), []);
export const CM_TOTAL_F = STARTS[STARTS.length - 1] + CENAS[CENAS.length - 1].dur - T + FIM;
/** frame (relativo à cena) em que uma palavra/fração de uma frase é falada */
const quando = (cena: string, i: number, frac = 0) => {
  const c = CENAS.find((x) => x.id === cena)!;
  const f = c.frases[i];
  return Math.round(f.at + f.frames * frac);
};

// ================================================================ primitivas
const Words: React.FC<{ t: string; at: number; size: number; color?: string; weight?: number; every?: number; hi?: number[]; hiColor?: string; italic?: number[]; align?: "center" | "left"; width?: number; ls?: string }> = ({
  t, at, size, color = CM.ink, weight = 800, every = 3, hi = [], hiColor = CM.acc, italic = [], align = "center", width = 940, ls = "-0.045em",
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24, fontFamily: H, fontWeight: weight, fontSize: size, lineHeight: 1.02, letterSpacing: ls, color }}>
      {t.split(" ").map((w, i) => {
        const s = sp(frame - at - i * every, 16, 0.7);
        return (
          <span key={i} style={{ display: "inline-block", opacity: Math.min(1, s * 1.4), translate: `0 ${(1 - s) * size * 0.55}px`, filter: `blur(${(1 - Math.min(1, s)) * 10}px)`, color: hi.includes(i) ? hiColor : undefined, fontStyle: italic.includes(i) ? "italic" : undefined, fontWeight: italic.includes(i) ? 600 : undefined }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
/** sublinhado "feito à mão" que se desenha */
const Swoosh: React.FC<{ at: number; w: number; color?: string; style?: React.CSSProperties }> = ({ at, w, color = CM.acc, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 14], [0, 1], { ...cl, easing: OUT });
  return (
    <svg width={w} height={40} viewBox={`0 0 ${w} 40`} style={{ overflow: "visible", ...style }}>
      <path d={`M6 28 C ${w * 0.3} 8, ${w * 0.65} 8, ${w - 6} 22`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
/** placa de ícone em vidro */
const Tile: React.FC<{ Icon: React.FC<any>; size?: number; dark?: boolean; tint?: string }> = ({ Icon, size = 150, dark, tint = CM.acc }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "linear-gradient(150deg, rgba(159,103,255,.45), rgba(124,58,237,.12))" : "linear-gradient(150deg,#ffffff,#f1ecff)", border: dark ? "1.5px solid rgba(196,181,253,.55)" : "1.5px solid rgba(124,58,237,.12)", boxShadow: dark ? "0 0 40px rgba(124,58,237,.55), inset 0 1px 0 rgba(255,255,255,.35)" : shadowSoft }}>
    <Icon size={size * 0.46} color={dark ? "#fff" : tint} strokeWidth={2.1} />
  </div>
);
const Cursor: React.FC<{ path: [number, number, number][]; click: number; dark?: boolean }> = ({ path, click, dark }) => {
  const frame = useCurrentFrame();
  if (frame < path[0][0]) return null;
  const fs = path.map((p) => p[0]);
  const x = interpolate(frame, fs, path.map((p) => p[1]), { ...cl, easing: INOUT });
  const y = interpolate(frame, fs, path.map((p) => p[2]), { ...cl, easing: INOUT });
  const press = interpolate(frame, [click - 3, click, click + 6], [0, 1, 0], cl);
  const r = frame >= click && frame < click + 20 ? (frame - click) / 20 : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 30, opacity: interpolate(frame, [fs[0], fs[0] + 5], [0, 1], cl) }}>
      {r >= 0 ? <div style={{ position: "absolute", left: -70 * r, top: -70 * r, width: 140 * r, height: 140 * r, borderRadius: "50%", background: `rgba(124,58,237,${0.35 * (1 - r)})` }} /> : null}
      <MousePointer2 size={78} fill={dark ? "#fff" : CM.ink} color={dark ? CM.ink : "#fff"} strokeWidth={1.4} style={{ scale: String(1 - press * 0.18), transformOrigin: "0 0", filter: "drop-shadow(0 8px 14px rgba(0,0,0,.35))" }} />
    </div>
  );
};
const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; w?: number; h?: number; rim?: string }> = ({ children, style, w = 560, h = 1110, rim = "rgba(196,181,253,.6)" }) => (
  <div style={{ width: w, height: h, borderRadius: 84, padding: 14, boxSizing: "border-box", background: "linear-gradient(150deg,#2b2340,#09070f)", boxShadow: `0 0 0 2px ${rim}, 0 60px 120px -30px rgba(0,0,0,.7)`, position: "relative", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 70, overflow: "hidden", position: "relative", background: "#fff" }}>
      {children}
      <div style={{ position: "absolute", left: "50%", top: 16, width: 150, height: 40, borderRadius: 20, background: "#000", translate: "-50% 0", zIndex: 5 }} />
    </div>
  </div>
);
const Grain: React.FC<{ o?: number }> = ({ o = 0.05 }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: o, mixBlendMode: "overlay", pointerEvents: "none", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${frame % 7}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }} />;
};
const NoiteBg: React.FC<{ red?: number }> = ({ red = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CM.noite, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 50% at 50% ${40 + Math.sin(frame / 50) * 6}%, ${red ? `rgba(255,59,92,${0.28 * red})` : "rgba(124,58,237,.32)"}, transparent 70%)` }} />
      {/* grade em perspectiva correndo */}
      <AbsoluteFill style={{ perspective: 700, opacity: 0.55 }}>
        <div style={{ position: "absolute", left: -1200, right: -1200, top: 1180, height: 2400, rotate: "x 70deg", transformOrigin: "50% 0", backgroundImage: `linear-gradient(${red ? "rgba(255,59,92,.35)" : "rgba(159,103,255,.35)"} 2px, transparent 2px), linear-gradient(90deg, ${red ? "rgba(255,59,92,.35)" : "rgba(159,103,255,.35)"} 2px, transparent 2px)`, backgroundSize: "110px 110px", backgroundPosition: `0 ${(frame * 6) % 110}px`, WebkitMaskImage: "linear-gradient(180deg, transparent, #000 25%, #000 60%, transparent)" }} />
      </AbsoluteFill>
      {new Array(50).fill(0).map((_, i) => {
        const z = random(`n${i}`);
        const y = (((random(`ny${i}`) * 2000 - frame * (0.6 + z * 2)) % 2000) + 2000) % 2000;
        const s = 2 + z * 5;
        return <div key={i} style={{ position: "absolute", left: random(`nx${i}`) * 1080, top: y, width: s, height: s, borderRadius: "50%", background: red && i % 2 ? CM.red : CM.lilas, opacity: 0.15 + z * 0.5, boxShadow: `0 0 ${s * 3}px ${CM.acc2}` }} />;
      })}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 280px 80px rgba(0,0,0,.85)" }} />
    </AbsoluteFill>
  );
};
const ClaroBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CM.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + Math.sin(frame / 60) * 10}% 20%, rgba(159,103,255,.18), transparent 45%), radial-gradient(circle at 80% ${85 + Math.cos(frame / 70) * 5}%, rgba(124,58,237,.12), transparent 45%)` }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(124,58,237,.10) 2px, transparent 2px)", backgroundSize: "54px 54px", backgroundPosition: `0 ${frame * 0.6}px`, WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000, transparent)" }} />
      {children}
    </AbsoluteFill>
  );
};
const RoxoBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #8b4dff 0%, ${CM.acc} 45%, #3b0f8c 100%)`, overflow: "hidden" }}>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: "absolute", left: 540 - (700 + k * 380) / 2, top: 960 - (700 + k * 380) / 2, width: 700 + k * 380, height: 700 + k * 380, borderRadius: "50%", border: "2px solid rgba(255,255,255,.12)", scale: String(1 + 0.04 * Math.sin(frame / 20 + k)) }} />
      ))}
      {children}
    </AbsoluteFill>
  );
};

// ================================================================ cenas
const Gancho: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a1 = quando("gancho", 1);
  const ring = interpolate(frame, [a1, dur], [1, 0.12], { ...cl });
  const s = sp(frame - a1 + 4, 11);
  const R = 300;
  const C = 2 * Math.PI * R;
  const num = frame < a1 + 14 ? 3 : frame < a1 + 26 ? 2 : 1;
  return (
    <AbsoluteFill>
      <NoiteBg />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Words t="Seu cliente decide" at={4} size={96} color="#fff" hi={[1]} hiColor={CM.lilas} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - R - 50, top: 1000 - R - 50, width: 2 * R + 100, height: 2 * R + 100, scale: String(0.6 + 0.4 * s), opacity: s }}>
        <svg width={2 * R + 100} height={2 * R + 100} style={{ rotate: "-90deg", position: "absolute" }}>
          {new Array(60).fill(0).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            const on = i / 60 < ring;
            return <line key={i} x1={R + 50 + Math.cos(a) * (R + 30)} y1={R + 50 + Math.sin(a) * (R + 30)} x2={R + 50 + Math.cos(a) * (R + (i % 5 ? 42 : 52))} y2={R + 50 + Math.sin(a) * (R + (i % 5 ? 42 : 52))} stroke={on ? CM.lilas : "rgba(196,181,253,.18)"} strokeWidth={i % 5 ? 4 : 7} strokeLinecap="round" />;
          })}
          <circle cx={R + 50} cy={R + 50} r={R} fill="none" stroke="rgba(196,181,253,.12)" strokeWidth={26} />
          <circle cx={R + 50} cy={R + 50} r={R} fill="none" stroke={CM.acc2} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${C * ring} ${C}`} style={{ filter: `drop-shadow(0 0 18px ${CM.acc})` }} />
        </svg>
        <div key={num} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: H, fontWeight: 800, fontSize: 380, color: "#fff", letterSpacing: "-0.06em", textShadow: `0 0 60px ${CM.acc}`, scale: String(interpolate(frame % 12, [0, 6], [1.15, 1], cl)) }}>
          {num}
          <span style={{ fontSize: 120, color: CM.lilas, marginLeft: 8, marginTop: 140 }}>s</span>
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const Rolagem: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [0, dur], [0, -3600], { easing: Easing.in(Easing.quad) });
  const fora = quando("rolagem", 1);
  const red = interpolate(frame, [fora - 6, fora + 4], [0, 1], cl);
  const chip = sp(frame - fora, 12);
  return (
    <AbsoluteFill>
      <NoiteBg red={red} />
      <div style={{ position: "absolute", left: 260, top: 330, rotate: `${interpolate(frame, [0, dur], [-4, 3])}deg`, scale: "0.9" }}>
        <Phone rim={red > 0.5 ? "rgba(255,59,92,.7)" : "rgba(196,181,253,.6)"}>
          <div style={{ position: "absolute", inset: 0, background: "#f2f0f7" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, translate: `0 ${scroll}px`, filter: `blur(${interpolate(frame, [0, dur], [1, 6])}px)` }}>
              {new Array(16).fill(0).map((_, i) => (
                <div key={i} style={{ margin: "22px 20px", borderRadius: 26, background: "#fff", padding: 18, boxShadow: "0 6px 16px rgba(0,0,0,.06)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: `hsl(${(i * 47) % 360},20%,80%)` }} />
                    <div style={{ width: 160, height: 14, borderRadius: 7, background: "#e5e2ee" }} />
                  </div>
                  <div style={{ height: 300, borderRadius: 18, marginTop: 16, background: `linear-gradient(135deg, hsl(${(i * 47) % 360},12%,88%), hsl(${(i * 47 + 30) % 360},12%,80%))` }} />
                </div>
              ))}
            </div>
          </div>
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, display: "flex", justifyContent: "center", scale: String(chip), opacity: chip }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 46px", borderRadius: 999, background: "rgba(255,59,92,.16)", border: `2px solid ${CM.red}`, boxShadow: `0 0 50px rgba(255,59,92,.5)`, fontFamily: H, fontWeight: 800, fontSize: 58, color: "#fff" }}>
          <ChevronsDown size={60} color={CM.red} strokeWidth={2.6} style={{ translate: `0 ${Math.sin(frame / 3) * 6}px` }} />
          passa direto
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const Virada: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const click = 14;
  const r = interpolate(frame, [click, click + 26], [0, 1], { ...cl, easing: OUT });
  const logo = sp(frame - click - 4, 12);
  const letters = "clique".split("");
  const sub = interpolate(frame, [quando("virada", 1, 0.3), quando("virada", 1, 0.3) + 12], [0, 1], { ...cl, easing: OUT });
  return (
    <RoxoBg>
      {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 540, top: 900, width: 2000 * r * (1 - k * 0.25), height: 2000 * r * (1 - k * 0.25), translate: "-50% -50%", borderRadius: "50%", border: `${5 - k}px solid rgba(255,255,255,${0.7 * (1 - r)})` }} />)}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, translate: "0 -60px" }}>
        <div style={{ width: 230, height: 230, borderRadius: 66, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 40px 80px -20px rgba(20,0,60,.6)", scale: String(logo), rotate: `${(1 - logo) * -25}deg` }}>
          <MousePointerClick size={130} color={CM.acc} strokeWidth={2.2} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", fontFamily: H, color: "#fff" }}>
          {letters.map((c, i) => {
            const s = sp(frame - click - 10 - i * 2, 14, 0.6);
            return <span key={i} style={{ fontWeight: 800, fontSize: 190, letterSpacing: "-0.06em", display: "inline-block", opacity: s, translate: `0 ${(1 - s) * 80}px`, filter: `blur(${(1 - s) * 8}px)` }}>{c}</span>;
          })}
          <span style={{ fontWeight: 500, fontSize: 100, marginLeft: 18, opacity: sub, color: CM.nevoa, letterSpacing: "-0.03em" }}>motion</span>
        </div>
      </AbsoluteFill>
      <Cursor path={[[0, 880, 1500], [click - 3, 560, 960], [dur, 600, 1050]]} click={click} dark />
      <Grain o={0.04} />
    </RoxoBg>
  );
};

/** cartões de exemplo (marcas fictícias) */
const CardProduto: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 640, borderRadius: 48, background: "#fff", boxShadow: shadowSoft, padding: 34, fontFamily: B }}>
      <div style={{ height: 360, borderRadius: 32, background: "linear-gradient(140deg,#efe9ff,#d8c8ff)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <ShoppingBag size={190} color={CM.acc} strokeWidth={1.5} style={{ rotate: `${Math.sin(frame / 14) * 6}deg`, translate: `0 ${Math.sin(frame / 10) * 8}px` }} />
        <Sparkles size={58} color={CM.acc2} style={{ position: "absolute", right: 60, top: 50, scale: String(0.8 + 0.2 * Math.sin(frame / 6)) }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <div>
          <div style={{ fontSize: 40, fontWeight: 800, color: CM.ink }}>Tênis Aurora</div>
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={28} fill="#f5b301" color="#f5b301" />)}</div>
        </div>
        <div style={{ fontFamily: H, fontWeight: 800, fontSize: 52, color: CM.acc }}>R$ 249</div>
      </div>
      <div style={{ marginTop: 26, padding: "24px 0", borderRadius: 24, background: CM.acc, color: "#fff", textAlign: "center", fontWeight: 800, fontSize: 36 }}>Comprar agora</div>
    </div>
  );
};
const CardServico: React.FC = () => {
  const frame = useCurrentFrame();
  const sel = frame > 22;
  return (
    <div style={{ width: 640, borderRadius: 48, background: "#fff", boxShadow: shadowSoft, padding: 40, fontFamily: B }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Tile Icon={CalendarCheck2} size={96} />
        <div>
          <div style={{ fontSize: 40, fontWeight: 800, color: CM.ink }}>Studio Vita</div>
          <div style={{ fontSize: 28, color: "#7a7090" }}>Agende sua avaliação</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 34 }}>
        {["09:00", "10:30", "13:00", "14:30", "16:00", "18:00"].map((t, i) => {
          const on = sel && i === 3;
          return <div key={t} style={{ padding: "22px 0", textAlign: "center", borderRadius: 20, fontWeight: 800, fontSize: 32, background: on ? CM.acc : CM.nevoa, color: on ? "#fff" : CM.acc, scale: on ? String(1 + 0.08 * Math.max(0, 1 - (frame - 22) / 8)) : "1" }}>{t}</div>;
        })}
      </div>
      <div style={{ marginTop: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "22px 0", borderRadius: 24, background: sel ? "#16a34a" : "#e8e4f2", color: sel ? "#fff" : "#9a91ad", fontWeight: 800, fontSize: 34 }}>
        <BadgeCheck size={40} /> {sel ? "Horário confirmado" : "Escolha um horário"}
      </div>
    </div>
  );
};
const CardResultado: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 40], [0, 1], { ...cl, easing: OUT });
  const pts = [0.1, 0.18, 0.15, 0.32, 0.3, 0.48, 0.55, 0.72, 0.9];
  const W = 560, Hh = 260;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * W},${Hh - v * Hh}`).join(" ");
  return (
    <div style={{ width: 640, borderRadius: 48, background: "#fff", boxShadow: shadowSoft, padding: 40, fontFamily: B }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 30, color: "#7a7090", fontWeight: 600 }}>Vendas no mês</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, background: "#dcfce7", color: "#15803d", fontWeight: 800, fontSize: 28 }}><TrendingUp size={30} /> +{Math.round(p * 38)}%</div>
      </div>
      <div style={{ fontFamily: H, fontWeight: 800, fontSize: 84, color: CM.ink, marginTop: 6, letterSpacing: "-0.04em" }}>R$ {(Math.round(p * 84300)).toLocaleString("pt-BR")}</div>
      <svg width={W} height={Hh + 10} style={{ marginTop: 20, overflow: "visible" }}>
        <defs><linearGradient id="cmg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={CM.acc2} stopOpacity={0.35} /><stop offset="1" stopColor={CM.acc2} stopOpacity={0} /></linearGradient></defs>
        <path d={`${d} L${W},${Hh} L0,${Hh} Z`} fill="url(#cmg)" opacity={p} />
        <path d={d} fill="none" stroke={CM.acc} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
      <div style={{ fontSize: 20, color: "#a39bb6", marginTop: 8 }}>dados ilustrativos</div>
    </div>
  );
};
const Explica: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ats = [quando("explica", 0, 0.35), quando("explica", 1), quando("explica", 2)];
  const kws = ["explica", "valoriza", "mostra"];
  const cards = [CardProduto, CardServico, CardResultado];
  const i = ats.filter((a) => frame >= a - 6).length - 1;
  return (
    <ClaroBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: H, fontWeight: 600, fontSize: 52, color: "#6b6185", opacity: interpolate(frame, [0, 10], [0, 1], cl) }}>Vídeo que</div>
        <div style={{ position: "relative", height: 170, width: 900, overflow: "hidden" }}>
          {kws.map((k, j) => {
            if (j > Math.max(i, 0) || j < Math.max(i, 0) - 1) return null;
            const inn = interpolate(frame, [ats[j] - 6, ats[j] + 6], [1, 0], { ...cl, easing: INOUT });
            const out = j < i ? interpolate(frame, [ats[j + 1] - 6, ats[j + 1] + 6], [0, 1], { ...cl, easing: INOUT }) : 0;
            return <div key={k} style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: H, fontWeight: 800, fontSize: 150, letterSpacing: "-0.05em", color: CM.acc, translate: `0 ${(inn - out) * 100}%` }}>{k}</div>;
          })}
        </div>
        <Swoosh at={ats[0] + 4} w={430} style={{ marginTop: -14 }} />
      </div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        {cards.map((Card, j) => {
          const a = ats[j] - 6;
          if (frame < a) return null;
          const inn = sp(frame - a, 15, 0.9);
          const nxt = ats[j + 1] !== undefined ? ats[j + 1] - 6 : 99999;
          const out = interpolate(frame, [nxt, nxt + 14], [0, 1], { ...cl, easing: INOUT });
          if (out >= 1) return null;
          return (
            <div key={j} style={{ position: "absolute", left: 220, top: 640, translate: `${(1 - inn) * 900 - out * 900}px ${Math.sin(frame / 25 + j) * 10}px`, rotate: `${(1 - inn) * 8 - out * 8}deg`, transform: `rotateY(${(1 - inn) * -30 + out * 30}deg)`, opacity: 1 - out * 0.5 }}>
              <Sequence from={a} layout="none">
                <Card />
              </Sequence>
            </div>
          );
        })}
      </AbsoluteFill>
      <Grain o={0.03} />
    </ClaroBg>
  );
};

const ITENS = [
  { Icon: FileText, t: "Roteiro", w: 0, f: 0.0 },
  { Icon: PenTool, t: "Design", w: 0, f: 0.4 },
  { Icon: Clapperboard, t: "Animação", w: 0, f: 0.72 },
  { Icon: Music2, t: "Trilha", w: 1, f: 0.0 },
  { Icon: Captions, t: "Legendas", w: 1, f: 0.55 },
];
const Pacote: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const junta = quando("pacote", 2, 0.1);
  const j = interpolate(frame, [junta, junta + 18], [0, 1], { ...cl, easing: INOUT });
  const check = sp(frame - junta - 14, 11);
  return (
    <ClaroBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", opacity: 1 - j }}>
        <Words t="O que está incluso" at={2} size={78} color={CM.ink} hi={[3]} />
      </div>
      {ITENS.map((it, i) => {
        const a = quando("pacote", it.w, it.f);
        if (frame < a) return null;
        const s = sp(frame - a, 13);
        const y0 = 470 + i * 200;
        const y = interpolate(j, [0, 1], [y0, 820 + i * 8]);
        return (
          <div key={it.t} style={{ position: "absolute", left: 130, right: 130, top: y, display: "flex", alignItems: "center", gap: 34, padding: "26px 34px", borderRadius: 40, background: "#fff", boxShadow: shadowSoft, translate: `${(1 - s) * 700}px 0`, opacity: s * (1 - j * 0.9), scale: String(1 - j * 0.1) }}>
            <Tile Icon={it.Icon} size={110} />
            <div style={{ fontFamily: H, fontWeight: 800, fontSize: 64, color: CM.ink, letterSpacing: "-0.03em", flex: 1 }}>{it.t}</div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: CM.acc, display: "flex", alignItems: "center", justifyContent: "center", scale: String(sp(frame - a - 8, 10)) }}>
              <BadgeCheck size={40} color="#fff" />
            </div>
          </div>
        );
      })}
      {frame >= junta + 10 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
          <div style={{ width: 300, height: 300, borderRadius: 90, background: `linear-gradient(150deg, ${CM.acc2}, ${CM.acc})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 40px 90px -20px rgba(124,58,237,.7)", scale: String(check), rotate: `${(1 - check) * 30}deg` }}>
            <Sparkles size={150} color="#fff" strokeWidth={1.8} />
          </div>
          <Words t="tudo num só lugar." at={junta + 16} size={100} hi={[1, 2, 3]} />
        </AbsoluteFill>
      ) : null}
      <Grain o={0.03} />
    </ClaroBg>
  );
};

const Formatos: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fmts = [
    { t: "Reels", Icon: Clapperboard, f: 0.32, rot: -14, x: -330 },
    { t: "Stories", Icon: Sparkles, f: 0.5, rot: 0, x: 0 },
    { t: "Anúncios", Icon: Megaphone, f: 0.7, rot: 14, x: 330 },
  ];
  return (
    <RoxoBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <Words t="Pronto pra postar" at={2} size={92} color="#fff" hi={[2]} hiColor={CM.nevoa} />
      </div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        {fmts.map((f, i) => {
          const a = quando("formatos", 0, f.f) - 4;
          const s = sp(frame - a, 13, 0.9);
          if (frame < a) return null;
          return (
            <div key={f.t} style={{ position: "absolute", left: 540 - 170, top: 560, width: 340, height: 600, borderRadius: 44, background: "rgba(255,255,255,.12)", border: "2px solid rgba(255,255,255,.45)", boxShadow: "0 40px 80px -20px rgba(20,0,60,.6), inset 0 1px 0 rgba(255,255,255,.4)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, translate: `${f.x * s}px ${(1 - s) * 700 + Math.abs(f.rot) * 3 * s + Math.sin(frame / 20 + i) * 10}px`, rotate: `${f.rot * s}deg`, transform: `rotateY(${-f.rot * 0.8 * s}deg)`, zIndex: i === 1 ? 2 : 1 }}>
              <div style={{ width: 150, height: 150, borderRadius: 46, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <f.Icon size={80} color={CM.acc} strokeWidth={2} />
              </div>
              <div style={{ fontFamily: H, fontWeight: 800, fontSize: 56, color: "#fff" }}>{f.t}</div>
              <div style={{ fontFamily: B, fontSize: 26, color: CM.nevoa }}>9:16 · 1080p</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Grain o={0.04} />
    </RoxoBg>
  );
};

const Preco: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = quando("preco", 1, 0.15);
  const v = interpolate(frame, [a + 6, quando("preco", 1, 0.95)], [0, 297], { ...cl, easing: OUT });
  const card = sp(frame - 2, 15, 0.9);
  const knob = v / 297;
  return (
    <ClaroBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center" }}>
        <Words t="Cabe no seu bolso" at={2} size={96} hi={[3]} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 560, borderRadius: 56, background: "#fff", boxShadow: shadowSoft, padding: 60, translate: `0 ${(1 - card) * 600}px`, opacity: card, fontFamily: B }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Tile Icon={Wallet} size={100} />
          <div style={{ fontSize: 36, fontWeight: 700, color: "#6b6185" }}>Criativos a partir de</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginTop: 30, fontFamily: H, color: CM.ink }}>
          <span style={{ fontSize: 80, fontWeight: 700, marginTop: 40, color: CM.acc }}>R$</span>
          <span style={{ fontSize: 260, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(v)}</span>
        </div>
        <div style={{ marginTop: 40, height: 22, borderRadius: 22, background: CM.nevoa, position: "relative" }}>
          <div style={{ width: `${knob * 100}%`, height: "100%", borderRadius: 22, background: `linear-gradient(90deg, ${CM.acc2}, ${CM.acc})` }} />
          <div style={{ position: "absolute", left: `calc(${knob * 100}% - 30px)`, top: -19, width: 60, height: 60, borderRadius: "50%", background: "#fff", border: `6px solid ${CM.acc}`, boxShadow: shadowSoft }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontSize: 28, color: "#8a80a0" }}>
          <span>por criativo</span><span>entrega rápida</span>
        </div>
      </div>
      <Grain o={0.03} />
    </ClaroBg>
  );
};

const CTA: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const msg = "Quero meu vídeo!";
  const t0 = 6;
  const typed = msg.slice(0, Math.max(0, Math.floor((frame - t0) * 1.1)));
  const click = quando("cta", 0, 0.95);
  const sent = frame > click + 4;
  const big = quando("cta", 1, 0.2);
  const card = sp(frame - 2, 15);
  return (
    <AbsoluteFill>
      <NoiteBg />
      <div style={{ position: "absolute", left: 110, right: 110, top: 300, borderRadius: 52, background: "rgba(255,255,255,.96)", padding: 40, boxShadow: "0 0 80px rgba(124,58,237,.45)", translate: `0 ${(1 - card) * 500}px`, opacity: card, fontFamily: B }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 24, borderBottom: "2px solid #eee" }}>
          <div style={{ width: 84, height: 84, borderRadius: 26, background: `linear-gradient(150deg, ${CM.acc2}, ${CM.acc})`, display: "flex", alignItems: "center", justifyContent: "center" }}><MousePointerClick size={46} color="#fff" /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 36, color: CM.ink }}>@clique.motion</div>
            <div style={{ fontSize: 24, color: "#22a35a" }}>● online agora</div>
          </div>
        </div>
        <div style={{ height: 180, position: "relative" }}>
          {sent ? <div style={{ position: "absolute", right: 0, bottom: 20, padding: "22px 30px", borderRadius: "30px 30px 8px 30px", background: CM.acc, color: "#fff", fontSize: 36, fontWeight: 700, scale: String(sp(frame - click - 4, 12)), transformOrigin: "right bottom" }}>{msg}</div> : null}
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ flex: 1, padding: "24px 30px", borderRadius: 999, background: "#f3f0fa", fontSize: 34, color: sent ? "#a39bb6" : CM.ink }}>{sent ? "Mensagem…" : typed || "Mensagem…"}</div>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: CM.acc, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 - interpolate(frame, [click - 2, click, click + 6], [0, 0.12, 0], cl)) }}><Send size={44} color="#fff" /></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Words t="e dá o primeiro" at={big} size={80} color="#fff" weight={600} />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Words t="clique." at={big + 8} size={200} color="#fff" width={640} />
          {frame > big + 12 ? <MousePointerClick size={150} color={CM.lilas} strokeWidth={2} style={{ scale: String(sp(frame - big - 12, 9)), filter: `drop-shadow(0 0 30px ${CM.acc})` }} /> : null}
        </div>
      </div>
      <Cursor path={[[t0, 900, 1500], [click - 3, 920, 790], [dur, 940, 820]]} click={click} />
      <Grain />
    </AbsoluteFill>
  );
};

const Fim: React.FC = () => {
  const frame = useCurrentFrame();
  const l = sp(frame - 4, 12);
  const sub = interpolate(frame, [22, 36], [0, 1], { ...cl, easing: OUT });
  return (
    <ClaroBg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, scale: String(0.7 + 0.3 * l), opacity: l }}>
          <div style={{ width: 170, height: 170, borderRadius: 50, background: `linear-gradient(150deg, ${CM.acc2}, ${CM.acc})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px -15px rgba(124,58,237,.6)", rotate: `${(1 - l) * -30}deg` }}>
            <MousePointerClick size={96} color="#fff" strokeWidth={2.2} />
          </div>
          <div style={{ fontFamily: H, lineHeight: 0.9 }}>
            <div style={{ fontWeight: 800, fontSize: 150, color: CM.ink, letterSpacing: "-0.06em" }}>clique</div>
            <div style={{ fontWeight: 500, fontSize: 76, color: CM.acc, letterSpacing: "-0.03em" }}>motion</div>
          </div>
        </div>
        <div style={{ opacity: sub, translate: `0 ${(1 - sub) * 20}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, fontFamily: B }}>
          <div style={{ fontSize: 40, color: "#6b6185" }}>motion design para empresas</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 44px", borderRadius: 999, background: CM.ink, color: "#fff", fontWeight: 800, fontSize: 42 }}>
            <Send size={36} color={CM.lilas} /> @clique.motion
          </div>
        </div>
      </AbsoluteFill>
    </ClaroBg>
  );
};

// ================================================================ transições personalizadas
type NoProps = Record<string, unknown>;
/** cortina roxa que sobe cobrindo a tela e revela a próxima cena (estilo da referência) */
const Cortina: React.FC<TransitionPresentationComponentProps<NoProps>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ scale: String(1 - p * 0.06), filter: `blur(${p * 6}px)` }}>{children}</AbsoluteFill>;
  }
  const e = Easing.bezier(0.76, 0, 0.24, 1)(p);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(${(1 - e) * 100}% 0 0 0)` }}>{children}</AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: `${(1 - e) * 100}%`, height: 260, translate: "0 -100%", background: `linear-gradient(180deg, transparent, ${CM.acc})`, opacity: 1 - e }} />
    </AbsoluteFill>
  );
};
/** círculo que cresce a partir do centro */
const Circulo: React.FC<TransitionPresentationComponentProps<NoProps>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ scale: String(1 + p * 0.08) }}>{children}</AbsoluteFill>;
  const e = Easing.bezier(0.65, 0, 0.35, 1)(p);
  return <AbsoluteFill style={{ clipPath: `circle(${e * 120}% at 50% 52%)` }}>{children}</AbsoluteFill>;
};
/** zoom com desfoque: a cena atual "passa pela câmera" e a nova chega do fundo */
const ZoomBlur: React.FC<TransitionPresentationComponentProps<NoProps>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const e = Easing.bezier(0.65, 0, 0.35, 1)(p);
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ scale: String(1 + e * 0.6), filter: `blur(${e * 24}px)`, opacity: 1 - e }}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ scale: String(0.75 + 0.25 * e), filter: `blur(${(1 - e) * 20}px)`, opacity: e }}>{children}</AbsoluteFill>;
};
const pres = (c: React.FC<TransitionPresentationComponentProps<NoProps>>) => ({ component: c, props: {} as NoProps });

// ================================================================ legendas palavra a palavra
const Legenda: React.FC<{ texto: string; frames: number; dark: boolean }> = ({ texto, frames }) => {
  const frame = useCurrentFrame();
  const words = texto.split(" ");
  const w = words.map((x) => x.replace(/[^\p{L}\p{N}$]/gu, "").length + 1.5);
  const tot = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  const st = w.map((x) => { const s = (acc / tot) * frames * 0.94; acc += x; return s; });
  const box = sp(frame, 16, 0.7);
  const out = interpolate(frame, [frames + 2, frames + 8], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1520, display: "flex", justifyContent: "center", zIndex: 50, opacity: 1 - out, translate: `0 ${out * -20}px` }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 6, rowGap: 6, padding: "18px 22px", borderRadius: 30, background: "rgba(16,8,34,.86)", boxShadow: "0 20px 50px -10px rgba(0,0,0,.45)", scale: String(0.9 + 0.1 * box), fontFamily: H, fontWeight: 800, fontSize: 54, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
        {words.map((x, i) => {
          const on = frame >= st[i];
          const now = on && (i === words.length - 1 || frame < st[i + 1]);
          const pop = sp(frame - st[i], 12, 0.5);
          return (
            <span key={i} style={{ padding: "4px 12px", borderRadius: 14, background: now ? CM.acc : "transparent", color: on ? "#fff" : "rgba(255,255,255,.35)", scale: on ? String(0.92 + 0.08 * pop) : "0.92", display: "inline-block" }}>
              {x}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================ montagem
const COMP: Record<string, React.FC<{ dur: number }>> = { gancho: Gancho, rolagem: Rolagem, virada: Virada, explica: Explica, pacote: Pacote, formatos: Formatos, preco: Preco, cta: CTA };
const TRANS = [pres(ZoomBlur), pres(Circulo), pres(Cortina), null, pres(ZoomBlur), pres(Circulo), pres(Cortina), pres(Cortina)];
const ESCURO = new Set(["gancho", "rolagem", "cta"]);

export const SFX_PLAN = (() => {
  const s: { src: string; t: number; v: number }[] = [];
  const add = (src: string, t: number, v = 0.6) => s.push({ src, t, v });
  const st = (id: string) => STARTS[CENAS.findIndex((c) => c.id === id)];
  // transições
  STARTS.slice(1).forEach((t) => add("sfx/maximize_006.wav", t - 2, 0.5));
  add("sfx/maximize_006.wav", STARTS[STARTS.length - 1] + CENAS[CENAS.length - 1].dur - T - 2, 0.5);
  // gancho: tique do relógio
  for (let k = 0; k < 3; k++) add("sfx/tick_002.wav", st("gancho") + quando("gancho", 1) + k * 12, 0.7);
  add("sfx/glitch_004.wav", st("rolagem") + quando("rolagem", 1), 0.55);
  add("sfx/error_006.wav", st("rolagem") + quando("rolagem", 1) + 2, 0.35);
  add("sfx/click_004.wav", st("virada") + 14, 0.8);
  add("sfx/powerUp7.wav", st("virada") + 16, 0.4);
  [quando("explica", 0, 0.35), quando("explica", 1), quando("explica", 2)].forEach((a) => add("sfx/glass_002.wav", st("explica") + a - 6, 0.5));
  add("sfx/toggle_002.wav", st("explica") + quando("explica", 1) - 6 + 22, 0.6);
  ITENS.forEach((it) => add("sfx/select_006.wav", st("pacote") + quando("pacote", it.w, it.f), 0.45));
  add("sfx/confirmation_002.wav", st("pacote") + quando("pacote", 2, 0.1) + 14, 0.6);
  [0.32, 0.5, 0.7].forEach((f) => add("sfx/glass_005.wav", st("formatos") + quando("formatos", 0, f) - 4, 0.5));
  add("sfx/scroll_002.wav", st("preco") + quando("preco", 1, 0.15) + 6, 0.5);
  add("sfx/confirmation_004.wav", st("preco") + quando("preco", 1, 0.95), 0.6);
  add("sfx/click_002.wav", st("cta") + quando("cta", 0, 0.95), 0.8);
  add("sfx/pluck_002.wav", st("cta") + quando("cta", 0, 0.95) + 5, 0.5);
  add("sfx/click_004.wav", st("cta") + quando("cta", 1, 0.2) + 12, 0.7);
  return s;
})();

export const CliqueMotionVideoF: React.FC = () => (
  <AbsoluteFill style={{ background: CM.noite }}>
    <CameraMotionBlur shutterAngle={180} samples={5}>
      <TransitionSeries>
        {CENAS.map((c, i) => {
          const C = COMP[c.id];
          const tr = TRANS[i];
          return (
            <React.Fragment key={c.id}>
              {i > 0 ? (
                <TransitionSeries.Transition presentation={(tr ?? slide({ direction: "from-right" })) as any} timing={linearTiming({ durationInFrames: T })} />
              ) : null}
              <TransitionSeries.Sequence durationInFrames={c.dur} name={c.id}>
                <C dur={c.dur} />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
        <TransitionSeries.Transition presentation={pres(Cortina)} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={FIM + T} name="fim">
          <Fim />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </CameraMotionBlur>
    {/* narração + legendas (tempo absoluto de cada frase) */}
    {CENAS.map((c, i) =>
      c.frases.map((f) => (
        <Sequence key={f.f} from={STARTS[i] + f.at} durationInFrames={f.frames + 10} name={`fala ${f.f}`}>
          <Audio src={staticFile(`cm/vo-f/${f.f}.wav`)} />
          <Legenda texto={f.leg} frames={f.frames} dark={ESCURO.has(c.id)} />
        </Sequence>
      )),
    )}
    {SFX_PLAN.map((s, i) => (
      <Sequence key={"sfx" + i} from={Math.max(0, Math.round(s.t))} durationInFrames={60} layout="none">
        <Audio src={staticFile(s.src)} volume={s.v} />
      </Sequence>
    ))}
    <Audio src={staticFile("cm/musica-f.wav")} volume={0.85} />
  </AbsoluteFill>
);

export const CM_TIMES = { STARTS, CENAS, T, FIM };
