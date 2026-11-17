import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, FONT_BODY, FONT_TITLE } from "../theme";
import { DETALHE, EVENTO, PILARES, TOTAL_ANDAMENTO, TOTAL_CONCLUIDOS, Pilar } from "../content";
import { clamp, Counter, EASE_IN_OUT, EASE_OUT, Eyebrow, fmt, Gear, goldText, MaskWords, useExit, useSpring } from "../components/ui";

// ==================================================================
// 4a — Totais
// ==================================================================
const Ring: React.FC<{ value: number; pct: number; label: string; delay: number; color: string; x: number }> = ({ value, pct, label, delay, color, x }) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, 16);
  const R = 200;
  const L = 2 * Math.PI * R;
  const p = interpolate(frame, [delay + 5, delay + 60], [0, pct], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ position: "absolute", left: x, top: 330, width: 460, height: 460, scale: String(0.7 + 0.3 * s), opacity: s }}>
      <svg width={460} height={460} viewBox="0 0 460 460" style={{ position: "absolute", rotate: "-90deg" }}>
        <circle cx={230} cy={230} r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={18} />
        <circle
          cx={230}
          cy={230}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={18}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          style={{ filter: `drop-shadow(0 0 14px ${color})` }}
        />
        <circle cx={230} cy={230} r={168} fill="none" stroke="rgba(227,185,63,.25)" strokeWidth={2} strokeDasharray="4 10" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Counter to={value} delay={delay + 5} dur={60} style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 150, lineHeight: 1, color: "#fff" }} />
        <div style={{ marginTop: 10, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, letterSpacing: 5, textTransform: "uppercase", color }}>{label}</div>
      </div>
    </div>
  );
};

export const S4aTotais: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const exit = useExit(dur - 18);
  const total = TOTAL_CONCLUIDOS + TOTAL_ANDAMENTO;
  const chip = useSpring(110, 16);
  return (
    <AbsoluteFill style={exit}>
      <div style={{ position: "absolute", left: 110, top: 80 }}>
        <Eyebrow n="03" text={`Resultados ${EVENTO.fiscal}`} delay={2} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 140, width: 1700 }}>
        <MaskWords
          text="Um ano de melhoria em números"
          delay={8}
          stagger={4}
          style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 120, lineHeight: 1, textTransform: "uppercase", color: "#fff" }}
          wordStyle={(i) => (i >= 4 ? goldText(frame) : {})}
        />
      </div>
      <Ring value={TOTAL_CONCLUIDOS} pct={TOTAL_CONCLUIDOS / total} label="Concluídos" delay={30} color={C.greenBright} x={330} />
      <Ring value={TOTAL_ANDAMENTO} pct={TOTAL_ANDAMENTO / total} label="Em andamento" delay={50} color={C.amber} x={1130} />
      <div style={{ position: "absolute", left: 870, top: 520, width: 180, textAlign: "center", fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 90, color: C.gold, opacity: useSpring(70) }}>
        +
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            scale: String(chip),
            padding: "18px 44px",
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            background: "rgba(227,185,63,.12)",
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 36,
            color: C.cream,
            letterSpacing: 2,
          }}
        >
          <Counter to={total} delay={110} dur={40} style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 48, ...goldText(frame) }} /> projetos de melhoria contínua em {EVENTO.fiscal}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==================================================================
// 4b — Bento dos 6 pilares
// ==================================================================
const CW = 540;
const CH = 330;
const GX = 40;
const GY = 40;

const PillarCard: React.FC<{ p: Pilar; i: number; delay: number }> = ({ p, i, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 0.9 } });
  const col = i % 3;
  const row = Math.floor(i / 3);
  const tot = p.concluidos + p.andamento;
  const bar = interpolate(frame, [delay + 20, delay + 70], [0, p.concluidos / tot], { ...clamp, easing: EASE_OUT });
  const hl = interpolate(frame, [delay + 8, delay + 30], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: col * (CW + GX),
        top: row * (CH + GY),
        width: CW,
        height: CH,
        borderRadius: 30,
        padding: "30px 34px",
        boxSizing: "border-box",
        background: "linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03))",
        border: "1px solid rgba(255,255,255,.14)",
        boxShadow: `0 30px 70px rgba(0,0,0,.45), inset 0 3px 0 ${p.cor}`,
        opacity: s,
        scale: String(0.6 + 0.4 * s),
        translate: `0 ${(1 - s) * 120}px`,
        rotate: `x ${(1 - s) * 40}deg`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: p.cor, filter: "blur(80px)", opacity: 0.35 * hl }} />
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ scale: String(s) }}>
          <Gear letter={p.letra} color={p.cor} size={84} spin={frame * 0.6 + i * 20} />
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, letterSpacing: 3, textTransform: "uppercase", color: "#fff" }}>{p.nome}</div>
      </div>
      <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 12 }}>
        <Counter
          to={p.valor}
          delay={delay + 10}
          dur={55}
          dec={p.casas}
          prefix={p.prefixo}
          suffix={p.sufixo?.replace(/ /g, "\u00A0")}
          style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: p.casas ? 72 : 100, lineHeight: 1, color: p.cor, whiteSpace: "nowrap", flexShrink: 0 }}
        />
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>{p.unidade}</div>
      </div>
      <div style={{ position: "absolute", left: 34, right: 34, bottom: 30 }}>
        <div style={{ height: 10, borderRadius: 10, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${bar * 100}%`, background: p.cor, borderRadius: 10 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: FONT_BODY, fontSize: 24, color: "rgba(255,255,255,.8)" }}>
          <span>
            <b style={{ color: "#fff" }}>
              <Counter to={p.concluidos} delay={delay + 20} dur={50} />
            </b>{" "}
            concluídos
          </span>
          <span>
            <b style={{ color: "#fff" }}>
              <Counter to={p.andamento} delay={delay + 20} dur={50} />
            </b>{" "}
            em andamento
          </span>
        </div>
      </div>
    </div>
  );
};

export const S4bPilares: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const exit = useExit(dur - 18);
  const W = 3 * CW + 2 * GX;
  const H = 2 * CH + GY;
  // câmera: começa próxima e inclinada, abre para o grid completo
  const cam = interpolate(frame, [0, 90], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const drift = interpolate(frame, [90, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={exit}>
      <div style={{ position: "absolute", left: 110, top: 70 }}>
        <Eyebrow n="03" text="Resultados por pilar" delay={2} />
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: (1920 - W) / 2,
            top: 170,
            width: W,
            height: H,
            transformStyle: "preserve-3d",
            transform: `translateX(${interpolate(cam, [0, 1], [-200, 0])}px) scale(${interpolate(cam, [0, 1], [1.25, 0.95]) + drift * 0.03}) rotateX(${interpolate(cam, [0, 1], [22, 8]) - drift * 4}deg) rotateY(${interpolate(cam, [0, 1], [-14, -3]) + drift * 5}deg)`,
          }}
        >
          {PILARES.map((p, i) => (
            <PillarCard key={p.nome} p={p} i={i} delay={10 + i * 12} />
          ))}
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 50,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontSize: 24,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "rgba(255,255,255,.55)",
          opacity: interpolate(frame, [120, 150], [0, 1], clamp),
        }}
      >
        S · Q · P · Meio Ambiente · Custos · Moral — {EVENTO.fiscal}
      </div>
    </AbsoluteFill>
  );
};

// ==================================================================
// 4c — Detalhes: Produtividade, Custos, Moral
// ==================================================================
const Panel: React.FC<{ x: number; w: number; delay: number; color: string; title: string; children: React.ReactNode }> = ({ x, w, delay, color, title, children }) => {
  const s = useSpring(delay, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 230,
        width: w,
        height: 700,
        borderRadius: 32,
        padding: 40,
        boxSizing: "border-box",
        background: "linear-gradient(165deg, rgba(255,255,255,.09), rgba(255,255,255,.02))",
        border: "1px solid rgba(255,255,255,.14)",
        borderTop: `6px solid ${color}`,
        boxShadow: "0 30px 80px rgba(0,0,0,.45)",
        opacity: s,
        translate: `0 ${(1 - s) * 160}px`,
      }}
    >
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 28, letterSpacing: 5, textTransform: "uppercase", color }}>{title}</div>
      {children}
    </div>
  );
};

const HBar: React.FC<{ label: string; value: number; max: number; delay: number; color: string; unit: string; dec?: number; indent?: boolean }> = ({
  label,
  value,
  max,
  delay,
  color,
  unit,
  dec = 2,
  indent,
}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 45], [0, value / max], { ...clamp, easing: EASE_OUT });
  const o = interpolate(frame, [delay, delay + 15], [0, 1], clamp);
  return (
    <div style={{ marginTop: indent ? 18 : 30, marginLeft: indent ? 34 : 0, opacity: o }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_BODY, fontSize: indent ? 24 : 28, color: indent ? "rgba(255,255,255,.75)" : "#fff", fontWeight: indent ? 500 : 600 }}>
        <span>{indent ? "↳ " : ""}{label}</span>
        <span style={{ fontFamily: FONT_TITLE, fontWeight: 700, fontSize: indent ? 30 : 36, color }}>
          <Counter to={value} delay={delay} dur={45} dec={dec} /> {unit}
        </span>
      </div>
      <div style={{ marginTop: 8, height: indent ? 8 : 14, borderRadius: 14, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
        <div style={{ width: `${w * 100}%`, height: "100%", background: color, borderRadius: 14, opacity: indent ? 0.75 : 1 }} />
      </div>
    </div>
  );
};

const Donut: React.FC<{ parts: { v: number; c: string }[]; delay: number; size: number; children?: React.ReactNode }> = ({ parts, delay, size, children }) => {
  const frame = useCurrentFrame();
  const R = size / 2 - 22;
  const L = 2 * Math.PI * R;
  const total = parts.reduce((s, p) => s + p.v, 0);
  const prog = interpolate(frame, [delay, delay + 60], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  let acc = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "30px auto 0" }}>
      <svg width={size} height={size} style={{ rotate: "-90deg" }}>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={34} />
        {parts.map((p, i) => {
          const len = (p.v / total) * L * prog;
          const off = -acc * prog;
          acc += (p.v / total) * L;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={R} fill="none" stroke={p.c} strokeWidth={34} strokeDasharray={`${Math.max(0, len - 6)} ${L}`} strokeDashoffset={off} />
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

const Legend: React.FC<{ items: { label: string; value: string; c: string }[]; delay: number }> = ({ items, delay }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ marginTop: 30 }}>
      {items.map((it, i) => {
        const o = interpolate(frame, [delay + i * 8, delay + i * 8 + 15], [0, 1], clamp);
        return (
          <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, opacity: o, translate: `${(1 - o) * 30}px 0`, fontFamily: FONT_BODY, fontSize: 28, color: "#fff" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: it.c }} />
            <span style={{ flex: 1 }}>{it.label}</span>
            <b style={{ fontFamily: FONT_TITLE, fontSize: 34, color: it.c }}>{it.value}</b>
          </div>
        );
      })}
    </div>
  );
};

export const S4cDetalhes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const exit = useExit(dur - 18);
  const P = DETALHE.produtividade;
  const $ = DETALHE.custos;
  const moralCols = ["#2fb5ac", "#8fd16f", "#ffc72c"];
  return (
    <AbsoluteFill style={exit}>
      <div style={{ position: "absolute", left: 110, top: 80 }}>
        <Eyebrow n="03" text="Em detalhe" delay={2} />
      </div>
      <div style={{ position: "absolute", left: 110, top: 120 }}>
        <MaskWords
          text="Ganhos que fazem diferença"
          delay={6}
          style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 84, lineHeight: 1.05, textTransform: "uppercase", color: "#fff" }}
          wordStyle={(i) => (i >= 3 ? goldText(frame) : {})}
        />
      </div>

      <Panel x={110} w={760} delay={20} color={C.greenBright} title="Produtividade">
        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 14 }}>
          <Counter to={P.total} dec={2} delay={30} dur={55} suffix=" mil" style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 110, lineHeight: 1, color: "#fff" }} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 30, color: "rgba(255,255,255,.7)" }}>minutos</span>
        </div>
        <HBar label="Operacional (OP)" value={P.op} max={P.total} delay={60} color={C.greenBright} unit="mil" />
        <HBar label="Estrutural" value={P.estrutural} max={P.total} delay={80} color={C.lime} unit="mil" indent />
        <HBar label="Waste Avoidance" value={P.waste} max={P.total} delay={92} color={C.lime} unit="mil" indent />
        <HBar label="Administrativo (ADM)" value={P.adm} max={P.total} delay={110} color={C.amber} unit="mil" />
      </Panel>

      <Panel x={910} w={440} delay={40} color="#d9965b" title="Custos">
        <Donut parts={[{ v: $.estrutural, c: "#d9965b" }, { v: $.avoidance, c: C.gold }]} delay={60} size={300}>
          <Counter to={$.total} delay={60} dur={50} prefix="R$ " suffix=" mi" style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 64, color: "#fff" }} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,.6)" }}>TOTAL</span>
        </Donut>
        <Legend
          delay={100}
          items={[
            { label: "Estrutural", value: `R$ ${fmt($.estrutural, 2)} mi`, c: "#d9965b" },
            { label: "Cost Avoidance", value: `R$ ${fmt($.avoidance, 2)} mi`, c: C.gold },
          ]}
        />
      </Panel>

      <Panel x={1390} w={420} delay={60} color="#2fb5ac" title="Moral">
        <Donut parts={DETALHE.moral.map((m, i) => ({ v: m.valor, c: moralCols[i] }))} delay={80} size={300}>
          <Counter to={DETALHE.moral.reduce((s, m) => s + m.valor, 0)} delay={80} dur={45} style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 90, lineHeight: 1, color: "#fff" }} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,.6)" }}>PROJETOS</span>
        </Donut>
        <Legend delay={120} items={DETALHE.moral.map((m, i) => ({ label: m.nome, value: String(m.valor), c: moralCols[i] }))} />
      </Panel>
    </AbsoluteFill>
  );
};
