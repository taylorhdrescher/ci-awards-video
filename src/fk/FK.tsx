/**
 * FK Wealth Planner — motion vertical (1080×1920) no estilo da referência (produto em fundo claro, texto
 * palavra a palavra, cards empilhando, órbita de recursos, botão com clique e cartão final).
 * Conteúdo e identidade tirados de fkinvestimentos.com.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({ family: "Playfair Display", url: staticFile("fonts/Playfair.woff2"), weight: "400 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/Playfair-italic.woff2"), weight: "400 900", style: "italic" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });

export const SERIF = "'Playfair Display', serif";
export const SANS = "'Inter', sans-serif";
export const C = { bg: "#fafaf8", bg2: "#f1efea", ink: "#1a1a18", gold: "#8b5e15", goldL: "#c89b4a", gray: "#77736b", dark: "#1d1d1b", wa: "#25d366" };
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
type D = { dur: number };

// ---------------------------------------------------------------- utilitários
export const Words: React.FC<{ text: string; start?: number; every?: number; size?: number; serif?: boolean; gold?: number[]; italicGold?: boolean; color?: string; weight?: number; width?: number; align?: "center" | "left"; lh?: number }> = ({
  text, start = 0, every = 4, size = 96, serif = true, gold = [], italicGold = true, color = C.ink, weight, width = 920, align = "center", lh = 1.12,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24, fontFamily: serif ? SERIF : SANS, fontSize: size, fontWeight: weight ?? (serif ? 500 : 700), lineHeight: lh, letterSpacing: serif ? "-0.01em" : "-0.04em", color, textAlign: align }}>
      {text.split(" ").map((w, i) => {
        const t = interpolate(frame, [start + i * every, start + i * every + 12], [0, 1], { ...cl, easing: OUT });
        const g = gold.includes(i);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, filter: `blur(${(1 - t) * 12}px)`, translate: `0 ${(1 - t) * size * 0.4}px`, color: g ? C.gold : undefined, fontStyle: g && italicGold && serif ? "italic" : undefined }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
export const Bg: React.FC<{ tone?: string; glow?: boolean; children?: React.ReactNode }> = ({ tone = C.bg, glow = true, children }) => (
  <AbsoluteFill style={{ background: tone, overflow: "hidden" }}>
    {glow ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(200,155,74,.16), transparent 70%)" }} /> : null}
    {children}
  </AbsoluteFill>
);
export const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", ...style }}>{children}</AbsoluteFill>
);
export const Cursor: React.FC<{ path: [number, number, number][]; click: number }> = ({ path, click }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p[0]);
  const x = interpolate(frame, fs, path.map((p) => p[1]), { ...cl, easing: INOUT });
  const y = interpolate(frame, fs, path.map((p) => p[2]), { ...cl, easing: INOUT });
  const press = interpolate(frame, [click - 3, click, click + 5], [0, 1, 0], cl);
  const r = frame >= click && frame < click + 20 ? (frame - click) / 20 : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: interpolate(frame, [fs[0], fs[0] + 6], [0, 1], cl) }}>
      {r >= 0 ? <div style={{ position: "absolute", left: -60 * r - 4, top: -60 * r - 4, width: 120 * r + 8, height: 120 * r + 8, borderRadius: "50%", border: `4px solid ${C.goldL}`, opacity: 1 - r }} /> : null}
      <svg width={74} height={74} viewBox="0 0 24 24" style={{ scale: String(1 - press * 0.18), transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.25))" }}>
        <path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill={C.ink} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
/** Logo FK: barras crescentes + FK + WEALTH PLANNER */
export const Bars: React.FC<{ size: number; grow?: number[] }> = ({ size, grow = [1, 1, 1, 1] }) => {
  const hs = [0.42, 0.62, 0.8, 1];
  const w = size * 0.16;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: size * 0.1, height: size }}>
      {hs.map((h, i) => (
        <div key={i} style={{ width: w, height: size * h * grow[i], borderRadius: w / 2, background: C.gold }} />
      ))}
    </div>
  );
};
export const Logo: React.FC<{ s?: number; bars?: number[]; text?: number }> = ({ s = 1, bars, text = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 34 * s }}>
    <Bars size={150 * s} grow={bars} />
    <div style={{ width: 3 * s, height: 150 * s, background: "rgba(139,94,20,.25)", opacity: text }} />
    <div style={{ overflow: "hidden", width: 520 * s * text }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 120 * s, lineHeight: 0.95, color: C.ink, whiteSpace: "nowrap" }}>FK</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36 * s, letterSpacing: "0.16em", color: C.gold, whiteSpace: "nowrap", marginTop: 8 * s }}>WEALTH PLANNER</div>
    </div>
  </div>
);

// ---------------------------------------------------------------- cenas
const Hook: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1, 1.06]);
  return (
    <Bg>
      <Center style={{ scale: String(z), gap: 40 }}>
        <Words text="Você constrói patrimônio há anos." start={6} every={4} size={104} />
        <Words text="Mas ele tem uma estratégia?" start={40} every={5} size={104} gold={[4]} />
      </Center>
    </Bg>
  );
};

const DORES = [
  "O dinheiro entra, mas você não sabe para onde ele vai.",
  "Você investe, mas não sabe se a estratégia é a mais adequada.",
  "Decisões importantes tomadas de forma isolada.",
  "Seguros e contratos protegem de fato o que você construiu?",
  "Sucessão e tributos ainda sem planejamento.",
];
const Dores: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Bg tone={C.bg2}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <Words text="Você se identifica?" start={2} every={4} size={92} gold={[2]} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 520, display: "flex", flexDirection: "column", gap: 28 }}>
        {DORES.map((t, i) => {
          const d = 16 + i * 16;
          const s = spring({ frame: frame - d, fps: 30, config: { damping: 15, mass: 0.8 } });
          const chk = interpolate(frame, [d + 8, d + 16], [0, 1], cl);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, background: "#fff", borderRadius: 34, padding: "34px 40px", boxShadow: "0 20px 50px rgba(60,45,20,.12)", translate: `0 ${(1 - s) * 260}px`, opacity: s, scale: String(0.9 + 0.1 * s) }}>
              <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: "50%", background: chk > 0.5 ? C.gold : "transparent", border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + Math.sin(chk * Math.PI) * 0.2) }}>
                <svg width={38} height={38} viewBox="0 0 24 24" style={{ opacity: chk }}>
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 38, fontWeight: 600, lineHeight: 1.25, color: C.ink, letterSpacing: "-0.02em" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Bg>
  );
};

const Virada: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [30, 55], [0, 1], { ...cl, easing: OUT });
  return (
    <Bg tone={C.dark} glow={false}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 35% at 50% 50%, rgba(200,155,74,.22), transparent 70%)" }} />
      <Center style={{ gap: 50 }}>
        <Words text="Decisões isoladas não formam uma estratégia." start={4} every={4} size={100} color="#fff" gold={[5]} />
        <div style={{ width: 300 * line, height: 3, background: C.goldL }} />
      </Center>
    </Bg>
  );
};

const LogoReveal: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bars = [0, 1, 2, 3].map((i) => spring({ frame: frame - 6 - i * 5, fps: 30, config: { damping: 11, mass: 0.7 } }));
  const txt = interpolate(frame, [32, 52], [0, 1], { ...cl, easing: OUT });
  const sub = interpolate(frame, [58, 72], [0, 1], { ...cl, easing: OUT });
  const z = interpolate(frame, [0, dur], [1.08, 1]);
  return (
    <Bg>
      <Center style={{ scale: String(z), gap: 70 }}>
        <Logo s={1.25} bars={bars} text={txt} />
        <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 500, color: C.gray, opacity: sub, translate: `0 ${(1 - sub) * 20}px`, textAlign: "center", lineHeight: 1.35 }}>
          Consultoria financeira e<br />planejamento patrimonial
        </div>
      </Center>
    </Bg>
  );
};

const PILARES = ["Planejamento financeiro", "Investimentos", "Proteção patrimonial", "Sucessório e tributário"];
const Pilares: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const R = 330;
  const ring = interpolate(frame, [6, 36], [0, 1], { ...cl, easing: OUT });
  const rot = frame * 0.25;
  const cy = 1080;
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <Words text="Uma estrutura, quatro pilares." start={2} every={4} size={92} gold={[2, 3]} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={540} cy={cy} r={R} fill="none" stroke={C.gold} strokeOpacity={0.35} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
      </svg>
      <div style={{ position: "absolute", left: 540 - 95, top: cy - 95, width: 190, height: 190, borderRadius: 50, background: "#fff", boxShadow: "0 24px 60px rgba(60,45,20,.15)", display: "flex", alignItems: "center", justifyContent: "center", scale: String(ring) }}>
        <Bars size={96} />
      </div>
      {PILARES.map((p, i) => {
        const a = ((i * 90 - 90 + rot) * Math.PI) / 180;
        const s = spring({ frame: frame - 24 - i * 12, fps: 30, config: { damping: 13 } });
        const x = 540 + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        return (
          <div key={p} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), opacity: s }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: i % 2 ? C.dark : "#fff", color: i % 2 ? "#fff" : C.ink, padding: "22px 30px", borderRadius: 999, boxShadow: "0 18px 40px rgba(60,45,20,.18)", fontFamily: SANS, fontWeight: 700, fontSize: 32, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldL, fontSize: 34 }}>0{i + 1}</span>
              {p}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: SANS, fontSize: 36, color: C.gray, opacity: interpolate(frame, [80, 95], [0, 1], cl) }}>
        Cada decisão faz parte de algo maior.
      </div>
    </Bg>
  );
};

const ENTREGAS = ["Diagnóstico financeiro completo", "Relatório patrimonial personalizado", "Dashboard financeiro", "Estratégia de investimentos", "Plano de ação", "Acompanhamento periódico"];
const Entregas: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [20, dur], [0, -120], { ...cl, easing: INOUT });
  return (
    <Bg tone={C.bg2}>
      <div style={{ position: "absolute", left: 90, top: 230 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.3em", color: C.gold, marginBottom: 20, opacity: interpolate(frame, [0, 10], [0, 1], cl) }}>ENTREGÁVEIS</div>
        <Words text="O que você recebe" start={2} every={4} size={100} align="left" width={900} gold={[3]} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 560, translate: `0 ${scroll}px`, display: "flex", flexDirection: "column", gap: 22 }}>
        {ENTREGAS.map((t, i) => {
          const d = 14 + i * 9;
          const s = interpolate(frame, [d, d + 14], [0, 1], { ...cl, easing: OUT });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 36px", borderRadius: 30, background: i === 2 ? C.dark : "#fff", color: i === 2 ? "#fff" : C.ink, boxShadow: "0 16px 40px rgba(60,45,20,.1)", opacity: s, translate: `${(1 - s) * 120}px 0`, filter: `blur(${(1 - s) * 8}px)` }}>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.goldL, width: 60 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 650, letterSpacing: "-0.02em" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Bg>
  );
};

export const Dashboard: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ph = spring({ frame: frame - 4, fps: 30, config: { damping: 15 } });
  const line = interpolate(frame, [20, 70], [0, 1], { ...cl, easing: OUT });
  const pts = [0, 0.12, 0.1, 0.25, 0.3, 0.42, 0.4, 0.58, 0.66, 0.8, 0.92];
  const W = 640;
  const H = 300;
  const path = pts.map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * W},${H - p * H}`).join(" ");
  const alloc = [
    { v: 0.4, c: C.gold },
    { v: 0.25, c: C.dark },
    { v: 0.2, c: C.goldL },
    { v: 0.15, c: "#d8d2c4" },
  ];
  const don = interpolate(frame, [30, 80], [0, 1], { ...cl, easing: OUT });
  let acc = 0;
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Words text="Dashboard financeiro" start={2} every={5} size={96} gold={[1]} />
        <div style={{ fontFamily: SANS, fontSize: 36, color: C.gray, opacity: interpolate(frame, [14, 26], [0, 1], cl) }}>com simulações de cenários</div>
      </div>
      {/* celular */}
      <div style={{ position: "absolute", left: 540 - 380, top: 560, width: 760, height: 1180, borderRadius: 90, background: C.dark, padding: 22, boxSizing: "border-box", boxShadow: "0 60px 120px rgba(60,45,20,.3)", translate: `0 ${(1 - ph) * 900}px`, rotate: `${(1 - ph) * 8}deg` }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 70, background: C.bg, overflow: "hidden", padding: 50, boxSizing: "border-box", fontFamily: SANS }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Bars size={50} />
            <div style={{ fontSize: 26, color: C.gray }}>Meu plano</div>
          </div>
          <div style={{ fontSize: 26, color: C.gray, marginTop: 40 }}>Evolução do plano</div>
          <div style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 600, color: C.ink }}>
            Simulação <span style={{ fontStyle: "italic", color: C.gold }}>de cenários</span>
          </div>
          <svg width={W} height={H + 20} style={{ marginTop: 20, overflow: "visible" }}>
            <defs>
              <linearGradient id="fkg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={C.goldL} stopOpacity={0.35} />
                <stop offset="1" stopColor={C.goldL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#fkg)" opacity={line} />
            <path d={path} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 50 }}>
            <svg width={220} height={220} style={{ rotate: "-90deg" }}>
              {alloc.map((a, i) => {
                const R = 90;
                const Cc = 2 * Math.PI * R;
                const el = <circle key={i} cx={110} cy={110} r={R} fill="none" stroke={a.c} strokeWidth={34} strokeDasharray={`${Cc * a.v * don} ${Cc}`} strokeDashoffset={-Cc * acc * don} />;
                acc += a.v;
                return el;
              })}
            </svg>
            <div style={{ fontSize: 26, lineHeight: 1.8, color: C.ink }}>
              {["Renda fixa", "Ações", "Internacional", "Reserva"].map((n, i) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(frame, [50 + i * 6, 60 + i * 6], [0, 1], cl) }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: alloc[i].c }} />
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 18, color: C.gray, marginTop: 40 }}>Imagem ilustrativa</div>
        </div>
      </div>
    </Bg>
  );
};

const DIF = [
  { t: "Independência.", s: "Sem comissão de bancos, seguradoras ou gestoras.", icon: "shield" },
  { t: "Longo prazo.", s: "Decisões pensadas para 10, 20, 30 anos.", icon: "clock" },
  { t: "Confidencialidade.", s: "Sigilo absoluto, da primeira conversa em diante.", icon: "lock" },
];
const Icone: React.FC<{ k: string; p: number }> = ({ k, p }) => {
  const st = { fill: "none", stroke: C.gold, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };
  return (
    <svg width={260} height={260} viewBox="0 0 24 24">
      {k === "shield" ? <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6zM8.5 12l2.5 2.5 4.5-5" {...st} /> : null}
      {k === "clock" ? (
        <>
          <circle cx={12} cy={12} r={9} {...st} />
          <path d={`M12 12 L${12 + 5 * Math.sin(p * 6.28)} ${12 - 5 * Math.cos(p * 6.28)}`} {...st} strokeDashoffset={0} />
          <path d="M12 12 L12 7.5" {...st} strokeDashoffset={0} />
        </>
      ) : null}
      {k === "lock" ? <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2.5" {...st} /> : null}
    </svg>
  );
};
const Diferenciais: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const seg = Math.floor(dur / DIF.length);
  const i = Math.min(DIF.length - 1, Math.floor(frame / seg));
  const local = frame - i * seg;
  const it = DIF[i];
  const p = interpolate(local, [0, 24], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(local, [0, 5], [i ? 0.6 : 0, 0], cl);
  return (
    <Bg tone={i === 1 ? C.dark : C.bg}>
      <Center style={{ gap: 50 }}>
        <div style={{ scale: String(0.8 + 0.2 * p), opacity: p }}>
          <Icone k={it.icon} p={p} />
        </div>
        <Sequence from={i * seg} layout="none">
          <Words text={it.t} start={2} every={4} size={110} color={i === 1 ? "#fff" : C.ink} gold={[0]} />
          <div style={{ marginTop: 30, fontFamily: SANS, fontSize: 40, lineHeight: 1.35, color: i === 1 ? "rgba(255,255,255,.7)" : C.gray, textAlign: "center", width: 820, opacity: interpolate(local, [12, 24], [0, 1], cl) }}>{it.s}</div>
        </Sequence>
      </Center>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Bg>
  );
};

export const Sobre: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const card = spring({ frame: frame - 4, fps: 30, config: { damping: 15 } });
  const badge = spring({ frame: frame - 26, fps: 30, config: { damping: 11 } });
  return (
    <Bg tone={C.bg2}>
      <Center>
        <div style={{ width: 880, padding: 70, borderRadius: 56, background: "#fff", boxShadow: "0 40px 90px rgba(60,45,20,.15)", scale: String(0.85 + 0.15 * card), opacity: card, fontFamily: SANS, boxSizing: "border-box" }}>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "0.3em", color: C.gold }}>QUEM ESTÁ POR TRÁS</div>
          <div style={{ fontFamily: SERIF, fontSize: 104, fontWeight: 600, color: C.ink, marginTop: 20, lineHeight: 1 }}>Felipe Kerber</div>
          <div style={{ fontSize: 38, color: C.gray, marginTop: 26, lineHeight: 1.35 }}>Consultor financeiro certificado, com visão integrada do seu patrimônio.</div>
          <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
            {["CEA", "ANBIMA"].map((b, i) => (
              <div key={b} style={{ padding: "16px 34px", borderRadius: 999, background: i ? C.dark : C.gold, color: "#fff", fontWeight: 800, fontSize: 34, letterSpacing: "0.08em", scale: String(badge) }}>{b}</div>
            ))}
          </div>
        </div>
      </Center>
    </Bg>
  );
};

const CTA: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const btn = spring({ frame: frame - 44, fps: 30, config: { damping: 12 } });
  const click = 92;
  const pressed = interpolate(frame, [click - 2, click + 2, click + 8], [0, 1, 0], cl);
  const done = frame > click + 6;
  return (
    <Bg tone={C.dark} glow={false}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 45%, rgba(200,155,74,.25), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "0.3em", color: C.goldL, opacity: interpolate(frame, [0, 10], [0, 1], cl) }}>VAMOS CONVERSAR</div>
        <Words text="Seu patrimônio merece uma estratégia, não decisões isoladas." start={4} every={3} size={92} color="#fff" gold={[4]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "38px 60px", borderRadius: 999, background: done ? C.wa : C.gold, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 42, boxShadow: `0 0 ${60 * btn}px rgba(200,155,74,.45)`, scale: String(btn * (1 - pressed * 0.07)), whiteSpace: "nowrap" }}>
          {done ? (
            <svg width={46} height={46} viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
              <path d="M9 8.5c.3 2.6 2.4 5 5 5.6l1.2-1.2 1.8.9" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
            </svg>
          ) : null}
          Agendar reunião estratégica
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1370, textAlign: "center", fontFamily: SANS, fontSize: 32, color: "rgba(255,255,255,.6)", opacity: interpolate(frame, [click + 8, click + 20], [0, 1], cl) }}>
        Sem compromisso. Você decide os próximos passos.
      </div>
      <Cursor path={[[50, 900, 1700], [click - 4, 640, 1270], [dur, 660, 1300]]} click={click} />
    </Bg>
  );
};

const Fim: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bars = [0, 1, 2, 3].map((i) => spring({ frame: frame - 2 - i * 4, fps: 30, config: { damping: 12 } }));
  const txt = interpolate(frame, [20, 38], [0, 1], { ...cl, easing: OUT });
  const url = interpolate(frame, [40, 54], [0, 1], { ...cl, easing: OUT });
  const fade = interpolate(frame, [dur - 12, dur], [0, 1], cl);
  return (
    <Bg>
      <Center style={{ gap: 80 }}>
        <Logo s={1.1} bars={bars} text={txt} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: "-0.02em", color: C.ink, opacity: url, translate: `0 ${(1 - url) * 20}px` }}>
          fkinvestimentos<span style={{ color: C.gold }}>.com</span>
        </div>
      </Center>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: SANS, fontSize: 26, letterSpacing: "0.12em", color: C.gray, opacity: url }}>RIO GRANDE DO SUL, BRASIL · CEA ANBIMA</div>
      <AbsoluteFill style={{ background: C.bg, opacity: fade }} />
    </Bg>
  );
};

// ---------------------------------------------------------------- linha do tempo
export const FK_SCENES: { C: React.FC<D>; dur: number; tr: string }[] = [
  { C: Hook, dur: 96, tr: "none" },
  { C: Dores, dur: 140, tr: "up" },
  { C: Virada, dur: 80, tr: "zoom" },
  { C: LogoReveal, dur: 96, tr: "flash" },
  { C: Pilares, dur: 130, tr: "zoom" },
  { C: Entregas, dur: 110, tr: "up" },
  { C: Dashboard, dur: 110, tr: "whip" },
  { C: Diferenciais, dur: 150, tr: "zoom" },
  { C: Sobre, dur: 80, tr: "up" },
  { C: CTA, dur: 140, tr: "zoom" },
  { C: Fim, dur: 90, tr: "flash" },
];
export const FK_STARTS = FK_SCENES.reduce<number[]>((a, s, i) => (a.push(i ? a[i - 1] + FK_SCENES[i - 1].dur : 0), a), []);
export const FK_TOTAL = FK_STARTS[FK_STARTS.length - 1] + FK_SCENES[FK_SCENES.length - 1].dur;

const Tr: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 10], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  let style: React.CSSProperties = {};
  if (type === "zoom") style = { scale: String(1 + 0.2 * t), filter: t > 0.01 ? `blur(${t * 18}px)` : undefined };
  if (type === "up") style = { translate: `0 ${t * 700}px`, filter: t > 0.01 ? `blur(${t * 20}px)` : undefined };
  if (type === "whip") style = { translate: `${t * 900}px 0`, filter: t > 0.01 ? `blur(${t * 28}px)` : undefined };
  const flash = type === "flash" ? interpolate(frame, [0, 7], [0.9, 0], cl) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

export const FKVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {FK_SCENES.map(({ C: S, dur, tr }, i) => (
      <Sequence key={i} from={FK_STARTS[i]} durationInFrames={dur}>
        <Tr type={tr}>
          <S dur={dur} />
        </Tr>
      </Sequence>
    ))}
    <Audio src={staticFile("fk/musica.wav")} volume={0.9} />
    <Audio src={staticFile("fk/efeitos.wav")} volume={0.8} />
  </AbsoluteFill>
);
