/**
 * FK Wealth Planner — versão 2 (persuasiva): narração, legendas dinâmicas, gancho forte,
 * metáfora "caos → ordem" e chamada com clique. Vertical 1080×1920.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import VO from "./vo.json";
import { Bars, Bg, C, Center, cl, Cursor, Dashboard, INOUT, Logo, OUT, SANS, SERIF, Sobre, Words } from "./FK";

type S = { dur: number; voz: number };
const GAP = 10;
const EXTRA: Record<string, number> = { isoladas: 14, marca: 24, merece: 8, cta: 34 };
const NO_CAPTION = new Set(["pergunta", "dores", "isoladas", "independencia", "merece"]);
const LEAD = 8;
const FIM = 100;

// ------------------------------------------------------------------ elementos globais
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.06,
        mixBlendMode: "multiply",
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${frame % 6}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
};
const Dust: React.FC<{ n?: number }> = ({ n = 50 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const x = random(`fx${i}`) * 1080;
        const y = ((random(`fy${i}`) * 1920 - frame * (0.3 + random(`fs${i}`) * 0.8)) % 1920 + 1920) % 1920;
        const s = 2 + random(`fz${i}`) * 4;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: C.goldL, opacity: 0.15 + random(`fo${i}`) * 0.45, boxShadow: `0 0 ${s * 3}px ${C.goldL}` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Legenda estilo redes sociais: blocos de até 4 palavras, palavra atual em dourado. */
const Caption: React.FC<{ text: string; voz: number; dark?: boolean }> = ({ text, voz }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  for (const w of weights) {
    starts.push((acc / total) * voz);
    acc += w;
  }
  const chunks: number[][] = [];
  let cur: number[] = [];
  words.forEach((w, i) => {
    cur.push(i);
    if (cur.length === 4 || /[.,:?!…]$/.test(w)) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const ci = Math.max(0, chunks.findIndex((c, k) => frame < (k + 1 < chunks.length ? starts[chunks[k + 1][0]] : voz + 20)));
  const chunk = chunks[ci] ?? [];
  const cStart = chunk.length ? starts[chunk[0]] : 0;
  const pop = spring({ frame: frame - cStart, fps: 30, config: { damping: 14, mass: 0.6 } });
  if (frame > voz + 16 || !chunk.length) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1500, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 20, padding: "22px 34px", borderRadius: 28, background: "rgba(22,22,20,.88)", boxShadow: "0 20px 50px rgba(0,0,0,.25)", scale: String(0.85 + 0.15 * pop), fontFamily: SANS, fontWeight: 800, fontSize: 58, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
        {chunk.map((wi) => {
          const on = frame >= starts[wi];
          const now = on && (wi + 1 >= starts.length || frame < starts[wi + 1]);
          return (
            <span key={wi} style={{ color: now ? C.goldL : on ? "#fff" : "rgba(255,255,255,.4)", scale: now ? "1.06" : "1", display: "inline-block" }}>
              {words[wi]}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ cenas
const Anos: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const N = 14;
  const z = interpolate(frame, [0, dur], [1.15, 1], { ...cl, easing: OUT });
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
        <Words text="Anos de trabalho." start={0} every={5} size={130} gold={[2]} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 520, height: 760, display: "flex", alignItems: "flex-end", gap: 14, scale: String(z), transformOrigin: "50% 100%" }}>
        {new Array(N).fill(0).map((_, i) => {
          const h = 0.12 + 0.88 * Math.pow((i + 1) / N, 1.6);
          const s = spring({ frame: frame - 2 - i * 3, fps: 30, config: { damping: 14, mass: 0.6 } });
          return <div key={i} style={{ flex: 1, height: `${h * 100 * s}%`, borderRadius: 14, background: i === N - 1 ? C.gold : `rgba(139,94,20,${0.18 + 0.5 * (i / N)})` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 500, height: 3, background: "rgba(139,94,20,.3)" }} />
    </Bg>
  );
};

const Pergunta: React.FC<S> = () => {
  return (
    <Bg tone={C.dark} glow={false}>
      <Dust n={40} />
      <Center>
        <Words text="Mas me responde uma coisa:" start={2} every={4} size={120} color="#fff" gold={[3, 4]} />
      </Center>
    </Bg>
  );
};

const SOLTAS = ["Investimentos", "Seguro de vida", "Previdência", "Imóvel", "Conta corrente", "Ações", "Consórcio", "Renda fixa", "Plano de saúde"];
const posCaos = (i: number, frame: number) => {
  const bx = 120 + random(`cx${i}`) * 700;
  const by = 520 + random(`cy${i}`) * 900;
  return {
    x: bx + Math.sin(frame / (22 + i * 3) + i) * 40,
    y: by + Math.cos(frame / (26 + i * 2) + i * 2) * 50,
    r: (random(`cr${i}`) - 0.5) * 40 + Math.sin(frame / 30 + i) * 6,
  };
};
const CardSolto: React.FC<{ t: string; x: number; y: number; r: number; s?: number; o?: number; dark?: boolean; blur?: number }> = ({ t, x, y, r, s = 1, o = 1, dark, blur = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${r}deg`, scale: String(s), opacity: o, filter: blur ? `blur(${blur}px)` : undefined, padding: "26px 40px", borderRadius: 26, background: dark ? C.dark : "#fff", color: dark ? "#fff" : C.ink, boxShadow: "0 20px 50px rgba(60,45,20,.18)", fontFamily: SANS, fontWeight: 700, fontSize: 38, whiteSpace: "nowrap" }}>{t}</div>
);
const Caos: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Bg tone={C.bg2}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center" }}>
        <Words text="Estratégia… ou decisões soltas?" start={4} every={6} size={104} gold={[3]} />
      </div>
      {SOLTAS.map((t, i) => {
        const p = posCaos(i, frame);
        const s = spring({ frame: frame - 6 - i * 4, fps: 30, config: { damping: 10, mass: 0.7 } });
        return <CardSolto key={t} t={t} x={p.x} y={p.y} r={p.r} s={s} dark={i % 3 === 1} blur={i % 4 === 3 ? 2 : 0} />;
      })}
    </Bg>
  );
};

const DORES = [
  { t: "Dinheiro que entra e some.", icon: "down" },
  { t: "Investimentos sem direção.", icon: "compass" },
  { t: "Seguros que talvez não protejam o que importa.", icon: "shield" },
];
const DorIcon: React.FC<{ k: string; p: number; frame: number }> = ({ k, p, frame }) => {
  const st = { fill: "none", stroke: C.goldL, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={300} height={300} viewBox="0 0 24 24" style={{ opacity: p, scale: String(0.7 + 0.3 * p) }}>
      {k === "down" ? (
        <>
          <path d="M3 6l6 6 4-4 8 8" {...st} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          <path d="M15 16h6v-6" {...st} opacity={p} />
        </>
      ) : null}
      {k === "compass" ? (
        <>
          <circle cx={12} cy={12} r={9} {...st} />
          <g style={{ transformOrigin: "12px 12px", rotate: `${frame * 9}deg` }}>
            <path d="M12 5l2.5 7L12 19l-2.5-7z" {...st} fill={C.goldL} fillOpacity={0.35} />
          </g>
        </>
      ) : null}
      {k === "shield" ? (
        <>
          <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" {...st} />
          <path d="M12 7l-1.5 4 3 2-1.5 4" {...st} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </>
      ) : null}
    </svg>
  );
};
const Dores: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const cuts = [0, Math.round(voz * 0.3), Math.round(voz * 0.6)];
  const i = cuts.filter((c) => frame >= c).length - 1;
  const local = frame - cuts[i];
  const p = interpolate(local, [0, 18], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(local, [0, 5], [i ? 0.35 : 0, 0], cl);
  return (
    <Bg tone={C.dark} glow={false}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 40%, rgba(200,155,74,.18), transparent 70%)" }} />
      <Dust n={30} />
      <div style={{ position: "absolute", left: 140, top: 210, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: C.goldL }}>0{i + 1} / 03</div>
      <Center style={{ gap: 60 }}>
        <DorIcon k={DORES[i].icon} p={p} frame={frame} />
        <Sequence from={cuts[i]} layout="none">
          <Words text={DORES[i].t} start={0} every={3} size={100} color="#fff" width={900} />
        </Sequence>
      </Center>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Bg>
  );
};

const Isoladas: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fall = interpolate(frame, [0, dur], [0, 1]);
  return (
    <Bg tone="#121210" glow={false}>
      {SOLTAS.map((t, i) => {
        const p = posCaos(i, frame + 120);
        return <CardSolto key={t} t={t} x={p.x} y={p.y + fall * 900 * (0.6 + random(`fall${i}`))} r={p.r + fall * 60 * (random(`rr${i}`) - 0.5)} o={0.18} dark blur={4} />;
      })}
      <Center>
        <Words text="Decisões isoladas não formam uma estratégia." start={2} every={4} size={112} color="#fff" gold={[5]} />
      </Center>
    </Bg>
  );
};

/** caos → ordem: os cards voam para uma grade e se fundem no logo */
const Marca: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const snap = interpolate(frame, [0, 22], [0, 1], { ...cl, easing: INOUT });
  const merge = interpolate(frame, [26, 40], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const bars = [0, 1, 2, 3].map((i) => spring({ frame: frame - 38 - i * 4, fps: 30, config: { damping: 11, mass: 0.7 } }));
  const txt = interpolate(frame, [52, 70], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(frame, [38, 41, 52], [0, 0.8, 0], cl);
  return (
    <Bg>
      {merge < 1
        ? SOLTAS.map((t, i) => {
            const p = posCaos(i, 200);
            const gx = 270 + (i % 3) * 270;
            const gy = 760 + Math.floor(i / 3) * 140;
            const x = interpolate(snap, [0, 1], [p.x, gx]) * (1 - merge) + 540 * merge;
            const y = interpolate(snap, [0, 1], [p.y, gy]) * (1 - merge) + 900 * merge;
            return <CardSolto key={t} t={t} x={x} y={y} r={p.r * (1 - snap)} s={(0.62 + 0 * snap) * (1 - merge * 0.9)} o={1 - merge} dark={i % 3 === 1} />;
          })
        : null}
      {frame >= 36 ? (
        <Center style={{ gap: 70 }}>
          <Logo s={1.25} bars={bars} text={txt} />
          <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 500, color: C.gray, textAlign: "center", lineHeight: 1.35, opacity: interpolate(frame, [70, 84], [0, 1], cl) }}>
            Consultoria financeira e<br />planejamento patrimonial
          </div>
        </Center>
      ) : null}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Bg>
  );
};

const PILARES = ["Planejamento", "Investimentos", "Proteção", "Sucessão"];
const Pilares: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const R = 340;
  const cy = 980;
  const at = [0.02, 0.13, 0.27, 0.37].map((f) => Math.round(voz * f));
  const conn = interpolate(frame, [voz * 0.5, voz * 0.75], [0, 1], { ...cl, easing: OUT });
  const pts = PILARES.map((_, i) => {
    const a = ((i * 90 - 90 + frame * 0.15) * Math.PI) / 180;
    return [540 + Math.cos(a) * R, cy + Math.sin(a) * R];
  });
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
        <Words text="Tudo conectado." start={Math.round(voz * 0.48)} every={6} size={120} gold={[1]} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {pts.map(([x, y], i) => {
          const o = interpolate(frame, [at[i], at[i] + 10], [0, 1], cl);
          return <line key={i} x1={540} y1={cy} x2={540 + (x - 540) * o} y2={cy + (y - cy) * o} stroke={C.gold} strokeOpacity={0.5} strokeWidth={3} />;
        })}
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="rgba(200,155,74,.08)" stroke={C.gold} strokeWidth={3} strokeOpacity={conn} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - conn} />
      </svg>
      <div style={{ position: "absolute", left: 540 - 100, top: cy - 100, width: 200, height: 200, borderRadius: 54, background: "#fff", boxShadow: `0 24px 60px rgba(60,45,20,.15), 0 0 ${80 * conn}px rgba(200,155,74,.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Bars size={100} />
      </div>
      {PILARES.map((p, i) => {
        const s = spring({ frame: frame - at[i], fps: 30, config: { damping: 12 } });
        const [x, y] = pts[i];
        return (
          <div key={p} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), opacity: s, padding: "24px 36px", borderRadius: 999, background: i % 2 ? C.dark : "#fff", color: i % 2 ? "#fff" : C.ink, boxShadow: "0 18px 40px rgba(60,45,20,.18)", fontFamily: SANS, fontWeight: 700, fontSize: 38, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldL, marginRight: 12 }}>0{i + 1}</span>
            {p}
          </div>
        );
      })}
    </Bg>
  );
};

const Entregas: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const chips = [
    { t: "Diagnóstico completo", f: 0.22, x: 60, y: 600 },
    { t: "Plano de ação claro", f: 0.48, x: 520, y: 760 },
    { t: "Painel de acompanhamento", f: 0.72, x: 80, y: 1320 },
  ];
  return (
    <AbsoluteFill>
      <Dashboard dur={dur} />
      {chips.map((c, i) => {
        const s = spring({ frame: frame - Math.round(voz * c.f), fps: 30, config: { damping: 11 } });
        return (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y, scale: String(s), opacity: s, display: "flex", alignItems: "center", gap: 16, padding: "24px 34px", borderRadius: 26, background: "#fff", boxShadow: "0 24px 60px rgba(60,45,20,.25)", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, rotate: `${i % 2 ? 3 : -3}deg` }}>
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={26} height={26} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" /></svg>
            </span>
            {c.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Independencia: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const cuts = [0, Math.round(voz * 0.3), Math.round(voz * 0.62)];
  const i = cuts.filter((c) => frame >= c).length - 1;
  const local = frame - cuts[i];
  const strike = interpolate(local, [14, 24], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(local, [0, 5], [i ? 0.4 : 0, 0], cl);
  const lines = [
    { a: "Sem", b: "comissão", c: "de bancos." },
    { a: "Sem", b: "conflito", c: "de interesse." },
  ];
  return (
    <Bg tone={i === 2 ? C.dark : C.bg}>
      {i === 2 ? <Dust n={40} /> : null}
      <Center>
        {i < 2 ? (
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 130, lineHeight: 1.1, color: C.ink, textAlign: "center", opacity: interpolate(local, [0, 8], [0, 1], cl), filter: `blur(${interpolate(local, [0, 8], [12, 0], cl)}px)` }}>
            {lines[i].a}{" "}
            <span style={{ position: "relative", display: "inline-block", fontStyle: "italic", color: C.gold }}>
              {lines[i].b}
              <span style={{ position: "absolute", left: -10, right: -10, top: "56%", height: 10, borderRadius: 6, background: C.ink, scale: `${strike} 1`, transformOrigin: "left" }} />
            </span>
            <br />
            {lines[i].c}
          </div>
        ) : (
          <Sequence from={cuts[2]} layout="none">
            <Words text="Só o que faz sentido para você." start={0} every={4} size={120} color="#fff" gold={[5, 6]} />
          </Sequence>
        )}
      </Center>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Bg>
  );
};

const Merece: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, dur], [-30, 130]);
  return (
    <Bg tone={C.dark} glow={false}>
      <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${sweep - 20}%, rgba(200,155,74,.25) ${sweep}%, transparent ${sweep + 20}%)` }} />
      <Dust n={60} />
      <Center>
        <Words text="Seu patrimônio merece uma estratégia." start={2} every={4} size={128} color="#fff" gold={[4]} />
      </Center>
    </Bg>
  );
};

const CTA: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const btn = spring({ frame: frame - 6, fps: 30, config: { damping: 12 } });
  const click = Math.round(voz * 0.62);
  const pressed = interpolate(frame, [click - 2, click + 2, click + 8], [0, 1, 0], cl);
  const done = frame > click + 6;
  const pulse = done ? 1 + 0.03 * Math.sin((frame - click) / 4) : 1;
  return (
    <Bg tone={C.dark} glow={false}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 45%, rgba(200,155,74,.25), transparent 70%)" }} />
      <Dust n={30} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: C.goldL }}>VAMOS CONVERSAR</div>
        <Words text="Agende sua reunião estratégica." start={2} every={4} size={110} color="#fff" gold={[2, 3]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "40px 64px", borderRadius: 999, background: done ? "#25d366" : C.gold, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 46, boxShadow: `0 0 ${70 * btn}px rgba(200,155,74,.5)`, scale: String(btn * (1 - pressed * 0.07) * pulse), whiteSpace: "nowrap" }}>
          {done ? (
            <svg width={50} height={50} viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
              <path d="M9 8.5c.3 2.6 2.4 5 5 5.6l1.2-1.2 1.8.9" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
            </svg>
          ) : null}
          Agendar reunião estratégica
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1260, textAlign: "center", fontFamily: SANS, fontSize: 34, color: "rgba(255,255,255,.65)" }}>Sem compromisso. Você decide os próximos passos.</div>
      <Cursor path={[[12, 900, 1750], [click - 4, 640, 1150], [dur, 660, 1180]]} click={click} />
    </Bg>
  );
};

const Fim: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bars = [0, 1, 2, 3].map((i) => spring({ frame: frame - 2 - i * 4, fps: 30, config: { damping: 12 } }));
  const txt = interpolate(frame, [18, 36], [0, 1], { ...cl, easing: OUT });
  const url = interpolate(frame, [36, 50], [0, 1], { ...cl, easing: OUT });
  return (
    <Bg>
      <Center style={{ gap: 80 }}>
        <Logo s={1.1} bars={bars} text={txt} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 40px", borderRadius: 999, background: "#fff", boxShadow: "0 18px 40px rgba(60,45,20,.15)", fontFamily: SANS, fontWeight: 700, fontSize: 44, color: C.ink, opacity: url, translate: `0 ${(1 - url) * 20}px` }}>
          fkinvestimentos<span style={{ color: C.gold, marginLeft: -16 }}>.com</span>
        </div>
      </Center>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 140, textAlign: "center", fontFamily: SANS, fontSize: 26, letterSpacing: "0.12em", color: C.gray, opacity: url }}>CONSULTOR CEA · ANBIMA · RIO GRANDE DO SUL</div>
    </Bg>
  );
};

// ------------------------------------------------------------------ linha do tempo (a partir da narração)
const MAP: Record<string, { C: React.FC<S>; tr: string }> = {
  anos: { C: Anos, tr: "none" },
  pergunta: { C: Pergunta, tr: "zoom" },
  caos: { C: Caos, tr: "flash" },
  dores: { C: Dores, tr: "whip" },
  isoladas: { C: Isoladas, tr: "zoom" },
  marca: { C: Marca, tr: "flash" },
  pilares: { C: Pilares, tr: "up" },
  entregas: { C: Entregas, tr: "whip" },
  independencia: { C: Independencia, tr: "zoom" },
  felipe: { C: (p) => <Sobre dur={p.dur} />, tr: "up" },
  merece: { C: Merece, tr: "zoom" },
  cta: { C: CTA, tr: "flash" },
};
export const FK2_PLAN = (() => {
  let t = 0;
  return VO.map((v, i) => {
    const lead = i === 0 ? LEAD : 0;
    const dur = lead + v.voz + GAP + (EXTRA[v.id] ?? 0);
    const r = { ...v, from: t, dur, lead };
    t += dur;
    return r;
  });
})();
const last = FK2_PLAN[FK2_PLAN.length - 1];
export const FK2_TOTAL = last.from + last.dur + FIM;

const Tr: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 9], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  let style: React.CSSProperties = {};
  if (type === "zoom") style = { scale: String(1 + 0.2 * t), filter: t > 0.01 ? `blur(${t * 18}px)` : undefined };
  if (type === "up") style = { translate: `0 ${t * 700}px`, filter: t > 0.01 ? `blur(${t * 20}px)` : undefined };
  if (type === "whip") style = { translate: `${t * 900}px 0`, filter: t > 0.01 ? `blur(${t * 28}px)` : undefined };
  const flash = type === "flash" ? interpolate(frame, [0, 7], [0.85, 0], cl) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};

const Progresso: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / FK2_TOTAL) * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldL})` }} />;
};

export const FKVideo2: React.FC<{ narracao?: boolean }> = ({ narracao = true }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {FK2_PLAN.map((s) => {
      const M = MAP[s.id];
      const voz = s.lead + s.voz;
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <Tr type={M.tr}>
            <M.C dur={s.dur} voz={voz} />
          </Tr>
          {!NO_CAPTION.has(s.id) ? (
            <Sequence from={s.lead} layout="none">
              <Caption text={s.leg} voz={s.voz} />
            </Sequence>
          ) : null}
          {narracao ? (
            <Sequence from={s.lead} layout="none">
              <Audio src={staticFile(`fk/vo/${s.f}.wav`)} />
            </Sequence>
          ) : null}
        </Sequence>
      );
    })}
    <Sequence from={last.from + last.dur} durationInFrames={FIM}>
      <Tr type="flash">
        <Fim dur={FIM} />
      </Tr>
    </Sequence>
    <Grain />
    <Progresso />
    <Audio src={staticFile(narracao ? "fk/musica2.wav" : "fk/musica2-sem-voz.wav")} volume={0.9} />
    <Audio src={staticFile("fk/efeitos2.wav")} volume={0.8} />
  </AbsoluteFill>
);
export const FKVideo2SemVoz: React.FC = () => <FKVideo2 narracao={false} />;
