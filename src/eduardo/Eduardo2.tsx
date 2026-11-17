/**
 * Eduardo Veículos — v2 (mais real e persuasiva).
 * Fotos reais do perfil (ampliadas), cartões de preço no padrão dos posts da loja, logo real,
 * fundo de showroom desfocado, layout em grade (título / mídia / legenda), transições com TransitionSeries.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { linearTiming, TransitionSeries, type TransitionPresentationComponentProps } from "@remotion/transitions";
import { AlertTriangle, ArrowLeftRight, BadgeCheck, Check, CheckCheck, CreditCard, Landmark, MapPin, Navigation, Send, ShieldCheck, ThumbsUp } from "lucide-react";
import ROTEIRO from "./roteiro2.json";

loadFont({ family: "Jakarta", url: staticFile("fonts/Jakarta.woff2"), weight: "200 800" });
loadFont({ family: "Jakarta", url: staticFile("fonts/Jakarta-italic.woff2"), weight: "200 800", style: "italic" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });
const H = "'Jakarta', sans-serif";
const B = "'Inter', sans-serif";
const P = { navy: "#0a0f2e", navy2: "#141c52", ind: "#5a5fe0", indL: "#a9adff", red: "#ef4444", bg: "#05081c" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const sp = (f: number, d = 15, m = 0.8) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
const img = (n: string) => staticFile(`edu/hd/${n}.jpg`);
const SH = "0 40px 80px -24px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.08)";

// ---------------------------------------------------------------- tempo
const GAP = 5, T = 12;
const LEAD: Record<string, number> = { gancho: 6 };
const TAIL: Record<string, number> = { gancho: 14, dor: 14, marca: 18, estoque: 18, pagamento: 18, prova: 22, cta: 22, fim: 60 };
type Frase = { f: string; leg: string; frames: number; at: number };
const CENAS = ROTEIRO.map((c) => {
  let t = LEAD[c.id] ?? 4;
  const frases: Frase[] = c.frases.map((f) => { const r = { ...f, at: t }; t += f.frames + GAP; return r; });
  return { id: c.id, frases, dur: t - GAP + (TAIL[c.id] ?? 18) };
});
const STARTS = CENAS.reduce<number[]>((a, c, i) => (a.push(i ? a[i - 1] + CENAS[i - 1].dur - T : 0), a), []);
export const EDU2_TOTAL = STARTS[STARTS.length - 1] + CENAS[CENAS.length - 1].dur;
const q = (id: string, i: number, frac = 0) => { const f = CENAS.find((x) => x.id === id)!.frases[i]; return Math.round(f.at + f.frames * frac); };

// ---------------------------------------------------------------- base
/** fundo: foto real desfocada + gradação na cor da marca */
const Fundo: React.FC<{ src: string; dur: number; tone?: string }> = ({ src, dur, tone = "rgba(5,8,28,.72)" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, dur], [1.25, 1.12])), filter: "blur(38px) saturate(1.1)" }}>
        <Img src={img(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: tone }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 45% at 50% 50%, rgba(90,95,224,.28), transparent 70%)` }} />
      {/* faixas diagonais da marca */}
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: "absolute", left: -200 + ((frame * 3 + k * 400) % 1600) - 400, top: 160 + k * 26, width: 700, height: 8, background: `linear-gradient(90deg, transparent, ${P.ind}, transparent)`, transform: "skewX(-40deg)", opacity: 0.45 }} />
      ))}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,.7)" }} />
    </AbsoluteFill>
  );
};
const Titulo: React.FC<{ linhas: { t: string; at: number; hi?: number[]; italic?: boolean; size?: number; color?: string }[]; y?: number }> = ({ linhas, y = 210 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {linhas.map((l, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: (l.size ?? 96) * 0.24, fontFamily: H, fontWeight: 800, fontStyle: l.italic ? "italic" : undefined, fontSize: l.size ?? 96, lineHeight: 1.04, letterSpacing: "-0.035em", color: l.color ?? "#fff", textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>
          {l.t.split(" ").map((w, i) => {
            const s = sp(frame - l.at - i * 3, 16, 0.7);
            const hi = l.hi?.includes(i);
            return (
              <span key={i} style={{ display: "inline-block", opacity: Math.min(1, s * 1.5), translate: `0 ${(1 - s) * 60}px`, filter: `blur(${(1 - Math.min(1, s)) * 8}px)`, padding: hi ? "0 14px" : undefined, borderRadius: 12, background: hi ? P.ind : undefined }}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
const Foto: React.FC<{ src: string; w: number; h: number; dur: number; pos?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ src, w, h, dur, pos = "center", style, children }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, height: h, borderRadius: 36, overflow: "hidden", boxShadow: SH, position: "relative", ...style }}>
      <Img src={img(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, scale: String(interpolate(frame, [0, dur], [1.08, 1.0])) }} />
      {children}
    </div>
  );
};
const LogoReal: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => <Img src={staticFile("edu/logo-branco.png")} style={{ width: w, ...style }} />;
const Check1: React.FC<{ at: number; t: string; Icon?: React.FC<any> }> = ({ at, t, Icon = BadgeCheck }) => {
  const frame = useCurrentFrame();
  const s = sp(frame - at, 12);
  if (frame < at) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 30px", borderRadius: 999, background: "rgba(255,255,255,.95)", boxShadow: SH, fontFamily: H, fontWeight: 800, fontSize: 40, color: P.navy, scale: String(s), opacity: s }}>
      <Icon size={42} color={P.ind} strokeWidth={2.4} /> {t}
    </div>
  );
};

// ---------------------------------------------------------------- cenas
type S = { dur: number };
const Gancho: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a2 = q("gancho", 1);
  const strike = interpolate(frame, [a2 + 30, a2 + 42], [0, 1], { ...cl, easing: OUT });
  const card = sp(frame, 18, 1);
  return (
    <AbsoluteFill>
      <Fundo src="toro" dur={dur} />
      <div style={{ position: "absolute", left: 90, top: 620, translate: `0 ${(1 - card) * 300}px`, opacity: card }}>
        <Foto src="toro" w={900} h={820} dur={dur} />
      </div>
      <Titulo linhas={[{ t: "Trocar de carro", at: 6, size: 104 }, { t: "não precisa ser", at: a2, size: 72, color: "rgba(255,255,255,.85)" }]} y={190} />
      {frame >= a2 + 10 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", fontFamily: H, fontWeight: 800, fontSize: 104, letterSpacing: "-0.035em", color: "#fff", opacity: sp(frame - a2 - 10, 14), textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>
            dor de cabeça.
            <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 14, borderRadius: 7, background: P.ind, scale: `${strike} 1`, transformOrigin: "left", boxShadow: `0 0 30px ${P.ind}` }} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Dor: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a1 = q("dor", 0), a2 = q("dor", 1);
  const msgs = [{ t: "Oi! O carro ainda tá disponível?", at: a1 - 2 }, { t: "Tem o histórico de revisões?", at: a1 + 14 }, { t: "E a documentação, tá tudo certo?", at: a2 + 2 }, { t: "Olá??", at: a2 + 22 }];
  const card = sp(frame, 16, 0.9);
  return (
    <AbsoluteFill>
      <Fundo src="vectra" dur={dur} tone="rgba(20,4,10,.78)" />
      <Titulo linhas={[{ t: "Carro sem procedência?", at: a1, size: 84, hi: [2] }]} y={200} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 470, borderRadius: 44, background: "#f4f2f7", boxShadow: SH, overflow: "hidden", translate: `0 ${(1 - card) * 500}px`, opacity: card, fontFamily: B }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 30px", background: "#fff", borderBottom: "1px solid #e6e3ec" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "#c9c5d3" }} />
          <div>
            <div style={{ fontSize: 34, fontWeight: 700, color: "#1d1b26" }}>Vendedor (anúncio)</div>
            <div style={{ fontSize: 24, color: frame > a2 + 10 ? P.red : "#8a8597" }}>{frame > a2 + 10 ? "visto por último há 3 dias" : "online"}</div>
          </div>
        </div>
        <div style={{ padding: 30, display: "flex", flexDirection: "column", gap: 18, minHeight: 600 }}>
          {msgs.map((m, i) => {
            if (frame < m.at) return null;
            const s = sp(frame - m.at, 13, 0.6);
            return (
              <div key={i} style={{ alignSelf: "flex-end", maxWidth: 680, padding: "20px 26px", borderRadius: "28px 28px 8px 28px", background: "#dcd9ff", color: "#1d1b26", fontSize: 34, fontWeight: 500, scale: String(s), transformOrigin: "right bottom", display: "flex", alignItems: "flex-end", gap: 10 }}>
                {m.t}
                <CheckCheck size={30} color="#8a8597" />
              </div>
            );
          })}
        </div>
      </div>
      {frame >= a2 + 26 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", scale: String(sp(frame - a2 - 26, 11)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 32px", borderRadius: 999, background: "rgba(239,68,68,.16)", border: `2px solid ${P.red}`, fontFamily: H, fontWeight: 800, fontSize: 40, color: "#fff" }}>
            <AlertTriangle size={44} color={P.red} /> sem resposta
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Marca: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 3, 12], [0, 0.85, 0], cl);
  const card = sp(frame - 2, 18, 1);
  return (
    <AbsoluteFill>
      <Fundo src="loja" dur={dur} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", opacity: sp(frame - 4, 14), scale: String(0.9 + 0.1 * sp(frame - 4, 14)) }}>
        <LogoReal w={760} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 520, translate: `0 ${(1 - card) * 400}px`, opacity: card }}>
        <Foto src="loja" w={940} h={760} dur={dur} pos="50% 30%">
          <div style={{ position: "absolute", left: 24, bottom: 24, display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: "rgba(10,15,46,.8)", fontFamily: H, fontWeight: 700, fontSize: 30, color: "#fff" }}>
            <MapPin size={32} color={P.indL} /> Montenegro · RS
          </div>
        </Foto>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1320, display: "flex", justifyContent: "center", gap: 18 }}>
        <Check1 at={q("marca", 1, 0.5)} t="Selecionado" />
        <Check1 at={q("marca", 2, 0.4)} t="Com garantia" Icon={ShieldCheck} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
const CARROS = [
  { src: "gol", m: "VOLKSWAGEN", n: "GOL 1993", d: "1.6 CHT · RODA DE LIGA", p: 15990 },
  { src: "palio", m: "FIAT", n: "PALIO 2007", d: "1.0 FIRE FLEX · COMPLETA", p: 26900 },
  { src: "zafira", m: "CHEVROLET", n: "ZAFIRA 2008", d: "AUTOMÁTICA · 7 LUGARES", p: 31990 },
  { src: "fiesta", m: "FORD", n: "FIESTA 2014", d: "FLEX · SEDAN", p: 35990 },
  { src: "samurai", m: "SUZUKI", n: "SAMURAI 1994", d: "RODAS OFFSET ARO 16 · JIPE", p: 49990 },
  { src: "compass", m: "JEEP", n: "COMPASS 2025", d: "1.3 FLEX TURBO · SUV", p: 129900 },
  { src: "toro", m: "FIAT", n: "TORO 2026", d: "C/ PPF FULL · ULTRA", p: 159990 },
];
const brl = (v: number) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
/** cartão no padrão dos posts da loja: foto + faixa azul com modelo em itálico e preço */
const CartaoCarro: React.FC<{ c: (typeof CARROS)[number] }> = ({ c }) => (
  <div style={{ width: 880, borderRadius: 34, overflow: "hidden", boxShadow: SH, background: P.navy }}>
    <div style={{ height: 600, overflow: "hidden" }}>
      <Img src={img(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%" }} />
    </div>
    <div style={{ position: "relative", padding: "20px 34px 18px", background: `linear-gradient(90deg, ${P.navy2}, #2a2f8a)`, fontFamily: H, color: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${P.ind}, ${P.indL})` }} />
      <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.8, letterSpacing: "0.04em" }}>{c.m}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 58, fontWeight: 800, fontStyle: "italic", letterSpacing: "-0.02em", lineHeight: 1 }}>{c.n}</div>
          <div style={{ fontSize: 22, fontWeight: 700, fontStyle: "italic", opacity: 0.85, marginTop: 6 }}>{c.d}</div>
        </div>
        <div style={{ fontSize: 50, fontWeight: 800, fontStyle: "italic" }}>{brl(c.p)}</div>
      </div>
    </div>
    <div style={{ padding: "12px 0 14px", display: "flex", justifyContent: "center", background: "#0d1238" }}>
      <LogoReal w={220} />
    </div>
  </div>
);
const Estoque: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a1 = q("estoque", 0), a2 = q("estoque", 1);
  const per = Math.max(10, Math.floor((CENAS.find((c) => c.id === "estoque")!.frases[1].frames + 8) / CARROS.length));
  const k = Math.max(0, Math.min(CARROS.length - 1, Math.floor((frame - a2 + 4) / per)));
  const lo = 15990, hi = 159990;
  const knob = frame < a2 - 4 ? 0 : (CARROS[k].p - lo) / (hi - lo);
  const knobS = interpolate(frame - (a2 - 4 + k * per), [0, 8], [0, 1], { ...cl, easing: OUT });
  const prev = k > 0 ? (CARROS[k - 1].p - lo) / (hi - lo) : 0;
  const kv = prev + (knob - prev) * knobS;
  return (
    <AbsoluteFill>
      <Fundo src={CARROS[k].src} dur={dur} />
      <Titulo linhas={[{ t: "Opção pra todo bolso", at: a1, size: 84, hi: [3] }]} y={190} />
      {/* faixa de preço */}
      <div style={{ position: "absolute", left: 110, right: 110, top: 360, opacity: interpolate(frame, [a1 + 10, a1 + 20], [0, 1], cl) }}>
        <div style={{ height: 14, borderRadius: 14, background: "rgba(255,255,255,.18)", position: "relative" }}>
          <div style={{ width: `${kv * 100}%`, height: "100%", borderRadius: 14, background: `linear-gradient(90deg, ${P.ind}, ${P.indL})` }} />
          <div style={{ position: "absolute", left: `calc(${kv * 100}% - 24px)`, top: -17, width: 48, height: 48, borderRadius: "50%", background: "#fff", boxShadow: `0 0 0 6px ${P.ind}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: H, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,.85)" }}>
          <span>R$ 15.990</span><span>R$ 159.990</span>
        </div>
      </div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        {CARROS.map((c, i) => {
          const at = i === 0 ? 2 : a2 - 4 + i * per;
          if (frame < at - 1) return null;
          const s = i === 0 ? sp(frame - 2, 16, 0.9) : interpolate(frame, [at, at + 9], [0, 1], { ...cl, easing: OUT });
          const nx = i < CARROS.length - 1 ? a2 - 4 + (i + 1) * per : 9999;
          const o = interpolate(frame, [nx, nx + 9], [0, 1], { ...cl, easing: INOUT });
          if (o >= 1) return null;
          return (
            <div key={c.src} style={{ position: "absolute", left: 100, top: 520, translate: `0 ${(1 - s) * 260 - o * 160}px`, scale: String((0.94 + 0.06 * s) * (1 - o * 0.08)), opacity: s * (1 - o), filter: o > 0.01 ? `blur(${o * 10}px)` : undefined, zIndex: i }}>
              <CartaoCarro c={c} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Pagamento: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const opts = [
    { I: Landmark, t: "Financiamento", d: "Parcele o seu próximo carro", at: q("pagamento", 0) },
    { I: CreditCard, t: "Cartão de crédito", d: "Pague no cartão", at: q("pagamento", 1) },
    { I: ArrowLeftRight, t: "Seu usado na troca", d: "Compro · Vendo · Troco", at: q("pagamento", 2, 0.3) },
  ];
  return (
    <AbsoluteFill>
      <Fundo src="compass" dur={dur} />
      <Titulo linhas={[{ t: "Do jeito que", at: 2, size: 84 }, { t: "fica melhor pra você", at: 10, size: 84, hi: [3] }]} y={190} />
      <div style={{ position: "absolute", left: 100, right: 100, top: 560, display: "flex", flexDirection: "column", gap: 26 }}>
        {opts.map((o, i) => {
          const s = sp(frame - o.at + 4, 14);
          const on = interpolate(frame, [o.at + 8, o.at + 14], [0, 1], cl);
          return (
            <div key={o.t} style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 34px", borderRadius: 36, background: "rgba(255,255,255,.96)", boxShadow: SH, translate: `${(1 - s) * 700}px 0`, opacity: s, fontFamily: H }}>
              <div style={{ width: 110, height: 110, borderRadius: 30, background: `linear-gradient(150deg, ${P.ind}, #2a2f8a)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><o.I size={56} color="#fff" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 50, fontWeight: 800, color: P.navy, letterSpacing: "-0.02em" }}>{o.t}</div>
                <div style={{ fontSize: 28, fontWeight: 500, color: "#6b6f8f", fontFamily: B }}>{o.d}</div>
              </div>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: on > 0.5 ? "#16a34a" : "#e5e7f0", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + Math.sin(on * Math.PI) * 0.25) }}>
                {on > 0.5 ? <Check size={40} color="#fff" strokeWidth={3} /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
const Prova: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = q("prova", 0);
  const p1 = sp(frame - 2, 16, 0.9), p2 = sp(frame - 12, 16, 0.9);
  const badge = sp(frame - a - 30, 10);
  return (
    <AbsoluteFill>
      <Fundo src="entrega" dur={dur} />
      <Titulo linhas={[{ t: "Seja mais um", at: a, size: 80 }, { t: "cliente satisfeito", at: a + 10, size: 100, hi: [1] }]} y={170} />
      <div style={{ position: "absolute", left: 470, top: 560, rotate: `${6 * p2}deg`, translate: `${(1 - p2) * 500}px 0`, opacity: p2 }}>
        <div style={{ padding: 20, paddingBottom: 70, background: "#fff", borderRadius: 18, boxShadow: SH }}>
          <Img src={img("edu_peugeot")} style={{ width: 480, height: 600, objectFit: "cover", objectPosition: "30% 40%", borderRadius: 8, display: "block" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 600, rotate: `${-5 * p1}deg`, translate: `${(1 - p1) * -500}px 0`, opacity: p1 }}>
        <div style={{ padding: 22, paddingBottom: 80, background: "#fff", borderRadius: 18, boxShadow: SH }}>
          <Img src={img("entrega")} style={{ width: 560, height: 680, objectFit: "cover", objectPosition: "50% 40%", borderRadius: 8, display: "block", scale: String(interpolate(frame, [0, dur], [1.06, 1])) }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: H, fontWeight: 700, fontStyle: "italic", fontSize: 34, color: P.navy }}>entrega das chaves</div>
        </div>
      </div>
      {frame >= a + 30 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1370, display: "flex", justifyContent: "center", scale: String(badge) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 40px", borderRadius: 999, background: `linear-gradient(135deg, ${P.ind}, #2a2f8a)`, boxShadow: `0 20px 50px -10px ${P.ind}`, fontFamily: H, fontWeight: 800, fontSize: 50, color: "#fff" }}>
            <ThumbsUp size={52} /> +1 cliente satisfeito
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const CTA: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a1 = q("cta", 0), a2 = q("cta", 1), a3 = q("cta", 2);
  const msg = "Oi! Quero saber mais sobre o Compass.";
  const typed = msg.slice(0, Math.max(0, Math.floor((frame - 4) * 1.6)));
  const sent = frame > a1 + 22;
  const dm = sp(frame, 16, 0.9);
  const dmOut = interpolate(frame, [a2 - 4, a2 + 10], [0, 1], { ...cl, easing: INOUT });
  const map = interpolate(frame, [a2 - 4, a2 + 12], [0, 1], { ...cl, easing: OUT });
  const pin = sp(frame - a3, 9);
  return (
    <AbsoluteFill>
      <Fundo src="loja2" dur={dur} />
      <Titulo linhas={[{ t: frame < a2 - 4 ? "Chama no direct" : "Vem conhecer a loja", at: frame < a2 - 4 ? a1 : a2 - 2, size: 88, hi: [2] }]} y={200} />
      {dmOut < 1 ? (
        <div style={{ position: "absolute", left: 100, right: 100, top: 480, borderRadius: 44, background: "#fff", boxShadow: SH, padding: 34, translate: `${-dmOut * 1100}px ${(1 - dm) * 500}px`, opacity: dm, fontFamily: B }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 22, borderBottom: "1px solid #eceaf2" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#fff", boxShadow: "0 0 0 3px #e1306c", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("edu/logo-cor.png")} style={{ width: 74 }} />
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#16142a" }}>eduardoeveiculos</div>
              <div style={{ fontSize: 24, color: "#16a34a" }}>● online</div>
            </div>
          </div>
          <div style={{ height: 260, position: "relative" }}>
            {sent ? <div style={{ position: "absolute", right: 0, bottom: 110, maxWidth: 640, padding: "20px 26px", borderRadius: "28px 28px 8px 28px", background: "#3b5bdb", color: "#fff", fontSize: 32, fontWeight: 600, scale: String(sp(frame - a1 - 22, 13)), transformOrigin: "right bottom" }}>{msg}</div> : null}
            {frame > a1 + 40 ? <div style={{ position: "absolute", left: 0, bottom: 14, padding: "20px 26px", borderRadius: "28px 28px 28px 8px", background: "#efedf5", color: "#16142a", fontSize: 32, fontWeight: 600, scale: String(sp(frame - a1 - 40, 13)), transformOrigin: "left bottom" }}>Opa! Vem ver de perto, te espero na loja.</div> : null}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ flex: 1, padding: "20px 26px", borderRadius: 999, background: "#f3f1f8", fontSize: 30, color: sent ? "#9a96a8" : "#16142a", whiteSpace: "nowrap", overflow: "hidden" }}>{sent ? "Mensagem…" : typed || "Mensagem…"}</div>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#3b5bdb", display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={38} color="#fff" /></div>
          </div>
        </div>
      ) : null}
      {map > 0 ? (
        <div style={{ position: "absolute", left: 100, right: 100, top: 470, borderRadius: 44, overflow: "hidden", background: "#fff", boxShadow: SH, translate: `${(1 - map) * 1100}px 0`, fontFamily: H }}>
          <div style={{ height: 560, position: "relative", overflow: "hidden" }}>
            <Img src={img("loja2")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", scale: String(interpolate(frame, [a2, dur], [1.1, 1])) }} />
            <div style={{ position: "absolute", left: "50%", top: "55%", translate: `-50% ${-100 - Math.abs(Math.sin((frame - a3) / 5)) * 18 * (frame > a3 ? 1 : 0)}%`, scale: String(pin) }}>
              <MapPin size={110} color="#fff" fill="#e11d48" strokeWidth={1.5} style={{ filter: "drop-shadow(0 10px 18px rgba(0,0,0,.5))" }} />
            </div>
          </div>
          <div style={{ padding: "26px 32px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: P.navy }}>Entre o SESI e a assistência</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#6b6f8f", fontFamily: B }}>Montenegro · RS</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 26px", borderRadius: 999, background: P.ind, color: "#fff", fontWeight: 800, fontSize: 30, scale: String(sp(frame - a3 - 12, 12)) }}>
              <Navigation size={30} /> Como chegar
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Fim: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a1 = q("fim", 0), a2 = q("fim", 1);
  const l = sp(frame - a1 + 4, 14);
  const chips = [{ I: ShieldCheck, t: "Garantia" }, { I: Landmark, t: "Financiamento" }, { I: CreditCard, t: "Cartão" }, { I: ArrowLeftRight, t: "Troca" }];
  return (
    <AbsoluteFill>
      <Fundo src="edu_toro" dur={dur} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", scale: String(0.85 + 0.15 * l), opacity: l }}>
        <LogoReal w={880} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: interpolate(frame, [a1 + 10, a1 + 22], [0, 1], cl), fontFamily: H, fontWeight: 500, fontSize: 40, letterSpacing: "0.32em", color: "rgba(255,255,255,.85)" }}>COMPRO · VENDO · TROCO</div>
      <Titulo linhas={[{ t: "O seu próximo carro", at: a2, size: 76 }, { t: "está aqui.", at: a2 + 10, size: 120, hi: [1] }]} y={820} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1170, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {chips.map((c, i) => {
          const s = sp(frame - a2 - 24 - i * 4, 12);
          return <div key={c.t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 24px", borderRadius: 999, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.35)", fontFamily: H, fontWeight: 700, fontSize: 32, color: "#fff", scale: String(s), opacity: s }}><c.I size={32} color={P.indL} /> {c.t}</div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", opacity: interpolate(frame, [a2 + 40, a2 + 52], [0, 1], cl) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 34px", borderRadius: 999, background: "#fff", fontFamily: H, fontWeight: 800, fontSize: 38, color: P.navy }}>@eduardoeveiculos</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- transições
type NP = Record<string, unknown>;
const Whip: React.FC<TransitionPresentationComponentProps<NP>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const e = Easing.bezier(0.7, 0, 0.3, 1)(p);
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ translate: `0 ${-e * 40}%`, filter: `blur(${e * 30}px)`, opacity: 1 - e * 0.6 }}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ translate: `0 ${(1 - e) * 60}%`, filter: `blur(${(1 - e) * 30}px)` }}>{children}</AbsoluteFill>;
};
const Zoom: React.FC<TransitionPresentationComponentProps<NP>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const e = Easing.bezier(0.65, 0, 0.35, 1)(p);
  if (presentationDirection === "exiting") return <AbsoluteFill style={{ scale: String(1 + e * 0.5), filter: `blur(${e * 22}px)`, opacity: 1 - e }}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ scale: String(0.8 + 0.2 * e), filter: `blur(${(1 - e) * 18}px)`, opacity: e }}>{children}</AbsoluteFill>;
};
const Faixa: React.FC<TransitionPresentationComponentProps<NP>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const e = Easing.bezier(0.76, 0, 0.24, 1)(p);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${(1 - e) * 140 - 40}% 0, 100% 0, 100% 100%, ${(1 - e) * 140 - 40 - 30}% 100%)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const pr = (c: React.FC<TransitionPresentationComponentProps<NP>>) => ({ component: c, props: {} as NP });
const TRANS = [null, pr(Whip), pr(Faixa), pr(Whip), pr(Zoom), pr(Faixa), pr(Whip), pr(Zoom)];

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
    <div style={{ position: "absolute", left: 80, right: 80, top: 1560, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 4, rowGap: 4, padding: "14px 18px", borderRadius: 24, background: "rgba(5,8,28,.82)", fontFamily: H, fontWeight: 800, fontSize: 46, lineHeight: 1.15 }}>
        {words.map((x, i) => {
          const on = frame >= st[i];
          const now = on && (i === words.length - 1 || frame < st[i + 1]);
          return <span key={i} style={{ padding: "2px 10px", borderRadius: 10, background: now ? P.ind : "transparent", color: on ? "#fff" : "rgba(255,255,255,.35)" }}>{x}</span>;
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- montagem + efeitos
const COMP: Record<string, React.FC<S>> = { gancho: Gancho, dor: Dor, marca: Marca, estoque: Estoque, pagamento: Pagamento, prova: Prova, cta: CTA, fim: Fim };
export const EDU2_SFX = (() => {
  const s: { src: string; t: number; v: number }[] = [];
  const st = (id: string) => STARTS[CENAS.findIndex((c) => c.id === id)];
  const add = (src: string, id: string, f: number, v = 0.6) => s.push({ src, t: st(id) + f, v });
  STARTS.slice(1).forEach((t) => s.push({ src: "sfx/maximize_006.wav", t: t - 2, v: 0.45 }));
  add("sfx/scratch_002.wav", "gancho", q("gancho", 1) + 30, 0.4);
  [-2, 14].forEach((d) => add("sfx/pluck_002.wav", "dor", q("dor", 0) + d, 0.45));
  [2, 22].forEach((d) => add("sfx/pluck_002.wav", "dor", q("dor", 1) + d, 0.45));
  add("sfx/error_006.wav", "dor", q("dor", 1) + 26, 0.45);
  add("sfx/powerUp7.wav", "marca", 2, 0.35);
  add("sfx/confirmation_002.wav", "marca", q("marca", 1, 0.5), 0.5); add("sfx/confirmation_002.wav", "marca", q("marca", 2, 0.4), 0.5);
  const per = Math.max(10, Math.floor((CENAS.find((c) => c.id === "estoque")!.frases[1].frames + 8) / CARROS.length));
  for (let i = 1; i < CARROS.length; i++) add("sfx/select_006.wav", "estoque", q("estoque", 1) - 4 + i * per, 0.35);
  [q("pagamento", 0), q("pagamento", 1), q("pagamento", 2, 0.3)].forEach((a) => add("sfx/toggle_002.wav", "pagamento", a + 8, 0.55));
  add("sfx/glass_002.wav", "prova", 2, 0.4); add("sfx/glass_002.wav", "prova", 12, 0.4); add("sfx/confirmation_004.wav", "prova", q("prova", 0) + 30, 0.55);
  add("sfx/click_002.wav", "cta", q("cta", 0) + 22, 0.7); add("sfx/pluck_002.wav", "cta", q("cta", 0) + 40, 0.5); add("sfx/drop_002.wav", "cta", q("cta", 2), 0.6);
  add("sfx/powerUp7.wav", "fim", q("fim", 0) - 4, 0.35);
  return s;
})();
export const EDU2_TIMES = { CENAS, STARTS, T };

export const EduardoVideo2: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg }}>
    <CameraMotionBlur shutterAngle={170} samples={5}>
      <TransitionSeries>
        {CENAS.map((c, i) => {
          const C = COMP[c.id];
          return (
            <React.Fragment key={c.id}>
              {i > 0 ? <TransitionSeries.Transition presentation={TRANS[i] as any} timing={linearTiming({ durationInFrames: T })} /> : null}
              <TransitionSeries.Sequence durationInFrames={c.dur} name={c.id}>
                <C dur={c.dur} />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </CameraMotionBlur>
    {CENAS.map((c, i) => c.frases.map((f) => (
      <Sequence key={f.f} from={STARTS[i] + f.at} durationInFrames={f.frames + 10} name={`fala ${f.f}`}>
        <Audio src={staticFile(`edu/vo2/${f.f}.wav`)} />
        <Legenda texto={f.leg} frames={f.frames} />
      </Sequence>
    )))}
    {EDU2_SFX.map((s, i) => (
      <Sequence key={"s" + i} from={Math.max(0, Math.round(s.t))} durationInFrames={60} layout="none">
        <Audio src={staticFile(s.src)} volume={s.v} />
      </Sequence>
    ))}
    <Audio src={staticFile("edu/musica2.wav")} volume={0.8} />
  </AbsoluteFill>
);
void random;
