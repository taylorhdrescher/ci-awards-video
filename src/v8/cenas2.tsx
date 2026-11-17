import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DETALHE, Pilar, PILARES, TOTAL_ANDAMENTO, TOTAL_CONCLUIDOS } from "../content";
import { C, cl, Count, F, Field, Flash, fmtBR, Morph, OUT, Pill, Pop, Rise, Sparkle, useL } from "./kit";
import { center, D, Shots } from "./cenas1";

const TOT = TOTAL_CONCLUIDOS + TOTAL_ANDAMENTO;

// ---------------------------------------------------------------- abertura do bloco
const EmNumeros: React.FC = () => {
  const { t } = useL();
  return (
    <Field bg={C.yellow}>
      <AbsoluteFill style={{ ...center, flexDirection: "column" }}>
        <Pop text="FY26" size={t(330)} color={C.ink} />
        <Pop text="em números." at={12} size={t(150)} color={C.green} italic weight={700} />
      </AbsoluteFill>
    </Field>
  );
};

// ---------------------------------------------------------------- grade que enche (cada quadrado ≈ 20 projetos)
const Grade: React.FC<D> = () => {
  const frame = useCurrentFrame();
  const { V, W, H } = useL();
  const cols = V ? 20 : 22;
  const rows = V ? 23 : 18;
  const n = cols * rows;
  const nOk = Math.round((TOTAL_CONCLUIDOS / TOT) * n);
  const cell = V ? 40 : 34;
  const gap = V ? 6 : 6;
  const gw = cols * (cell + gap);
  const gh = rows * (cell + gap);
  const fill = interpolate(frame, [18, 110], [0, n * 1.1], { ...cl, easing: OUT });
  const tilt = interpolate(frame, [0, 150], [1, 0.6]);
  return (
    <Field bg={C.black} glow="rgba(107,224,90,.16)">
      <div style={{ position: "absolute", left: V ? 0 : 130, right: V ? 0 : undefined, top: V ? 140 : 0, height: V ? undefined : H, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: V ? "center" : "flex-start", fontFamily: F, gap: V ? 6 : 20 }}>
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(255,255,255,.6)" }}>PROJETOS FY26</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <Count to={TOTAL_CONCLUIDOS} at={18} dur={70} style={{ fontSize: V ? 150 : 170, fontWeight: 800, letterSpacing: "-0.05em", color: C.neon }} />
          <span style={{ fontSize: V ? 40 : 44, fontWeight: 700, color: C.white }}>concluídos</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, opacity: interpolate(frame, [60, 70], [0, 1], cl) }}>
          <Count to={TOTAL_ANDAMENTO} at={60} dur={60} style={{ fontSize: V ? 110 : 120, fontWeight: 800, letterSpacing: "-0.05em", color: C.yellow }} />
          <span style={{ fontSize: V ? 36 : 40, fontWeight: 700, color: C.white }}>em andamento</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: V ? (W - gw) / 2 : W - gw - 150, top: V ? 680 : (H - gh) / 2, width: gw, height: gh, perspective: 1600 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap, width: gw, transform: `rotateX(${22 * tilt}deg) rotateY(${(V ? 0 : -22) * tilt}deg) rotateZ(${(V ? 6 : 8) * tilt}deg)`, transformStyle: "preserve-3d" }}>
          {Array.from({ length: n }, (_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const order = (c + (rows - 1 - r)) * (n / (cols + rows)); // onda diagonal a partir do canto
            const on = fill > order ? 1 : 0;
            const ok = order < (nOk / n) * n * 1 && i < n;
            const rank = Math.floor(order);
            const col = rank < nOk ? C.neon : C.yellow;
            const pop = interpolate(fill - order, [0, 10], [0, 1], cl);
            return <div key={i} style={{ width: cell, height: cell, borderRadius: 6, background: on ? col : "rgba(255,255,255,.07)", translate: `0 0 ${pop * 0}px`, scale: String(on ? 0.8 + 0.2 * pop : 1), boxShadow: on && pop < 1 ? `0 0 18px ${col}` : undefined, opacity: ok || on ? 1 : 1 }} />;
          })}
        </div>
      </div>
    </Field>
  );
};

// ---------------------------------------------------------------- total gigante
const Total: React.FC = () => {
  const { V, t } = useL();
  return (
    <Field bg={C.green} glow="rgba(200,245,74,.35)">
      <AbsoluteFill style={center}>
        <Morph size={V ? 1000 : 1000} color="rgba(255,255,255,.08)" keys={[[0, 1], [80, 2]]} spin={0.4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ ...center, flexDirection: "column", fontFamily: F }}>
        <div style={{ fontSize: t(300), fontWeight: 800, letterSpacing: "-0.06em", color: C.white, lineHeight: 1 }}>
          <span style={{ color: C.lime }}>+</span>
          <Count to={TOT} at={0} dur={45} />
        </div>
        <Rise text="projetos de melhoria em FY26" at={20} every={3} size={V ? 56 : 64} weight={700} color={C.white} width={V ? 900 : 1400} accent={[2]} accentColor={C.lime} />
      </AbsoluteFill>
      <Flash at={45} len={8} max={0.45} color={C.lime} />
    </Field>
  );
};

// ---------------------------------------------------------------- pilares (1 por compasso)
const Icone: React.FC<{ l: string; size: number; color: string; bg: string }> = ({ l, size, color, bg }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 800, fontSize: size * 0.52, fontFamily: F }}>
    {l === "leaf" ? (
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19zm0 0l7-7" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" /></svg>
    ) : l === "heart" ? (
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={color} /></svg>
    ) : (
      l
    )}
  </div>
);

const PilarShot: React.FC<{ p: Pilar; i: number; dur: number }> = ({ p, i, dur }) => {
  const frame = useCurrentFrame();
  const { V, W } = useL();
  const dark = i % 2 === 1;
  const bg = dark ? C.ink : p.cor;
  const fg = dark ? C.white : C.ink;
  const acc = dark ? p.cor : C.ink;
  const tot = p.concluidos + p.andamento;
  const bar = interpolate(frame, [10, 40], [0, p.concluidos / tot], { ...cl, easing: OUT });
  const valSize = V ? (p.casas ? 190 : 230) : p.casas ? 280 : 330;
  return (
    <Field bg={bg}>
      {dark ? <Sparkle x={V ? 880 : 1650} y={V ? 380 : 220} size={260} color={p.cor} blur={14} drift={[-0.8, 0.4]} /> : null}
      <div style={{ position: "absolute", left: V ? 80 : 130, top: V ? 160 : 110, display: "flex", alignItems: "center", gap: 28, fontFamily: F }}>
        <Icone l={p.letra} size={V ? 110 : 100} color={dark ? C.ink : p.cor} bg={dark ? p.cor : C.ink} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.3em", color: fg, opacity: 0.6 }}>PILAR 0{i + 1} / 06</div>
          <div style={{ fontSize: V ? 62 : 60, fontWeight: 800, letterSpacing: "-0.03em", color: fg }}>{p.nome}</div>
        </div>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: V ? "center" : "flex-start", paddingLeft: V ? 0 : 120, fontFamily: F }}>
        <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: V ? "center" : "baseline", gap: V ? 0 : 30, scale: String(interpolate(frame, [0, dur], [1, 1.05])) }}>
          <div style={{ fontSize: valSize, fontWeight: 800, letterSpacing: "-0.06em", color: acc, lineHeight: 1, whiteSpace: "nowrap" }}>
            <Count to={p.valor} at={0} dur={32} dec={p.casas} prefix={p.prefixo} suffix={p.sufixo} />
          </div>
          <div style={{ fontSize: V ? 60 : 64, fontWeight: 700, color: fg, opacity: 0.75 }}>{p.unidade}</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: V ? 80 : 130, right: V ? 80 : 130, bottom: V ? 220 : 110, fontFamily: F, color: fg }}>
        <div style={{ height: 22, borderRadius: 22, background: dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.14)", overflow: "hidden" }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: dark ? p.cor : C.ink, borderRadius: 22 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: V ? 32 : 34, fontWeight: 600 }}>
          <span>
            <b>{fmtBR(p.concluidos)}</b> concluídos
          </span>
          <span style={{ opacity: 0.7 }}>
            <b>{fmtBR(p.andamento)}</b> em andamento
          </span>
        </div>
      </div>
      {W ? null : null}
    </Field>
  );
};

// ---------------------------------------------------------------- detalhes
const Barra: React.FC<{ l: string; v: number; max: number; c: string; at: number; sub?: boolean; dec?: number; suf?: string }> = ({ l, v, max, c, at, sub, dec = 2, suf = " mil" }) => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [at, at + 24], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ paddingLeft: sub ? 50 : 0, opacity: interpolate(frame, [at - 3, at + 3], [0, 1], cl), fontFamily: F, color: C.white }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: sub ? 30 : 38, fontWeight: sub ? 500 : 700, opacity: sub ? 0.75 : 1 }}>
        <span>{l}</span>
        <span>
          <Count to={v} at={at} dur={24} dec={dec} suffix={suf} />
        </span>
      </div>
      <div style={{ height: sub ? 14 : 26, marginTop: 10, borderRadius: 30, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
        <div style={{ width: `${(v / max) * 100 * g}%`, height: "100%", borderRadius: 30, background: c }} />
      </div>
    </div>
  );
};

const Produtividade: React.FC = () => {
  const { V, W } = useL();
  const P = DETALHE.produtividade;
  const w = V ? 920 : 1200;
  return (
    <Field bg={C.ink} glow="rgba(107,224,90,.15)">
      <div style={{ position: "absolute", left: (W - w) / 2, width: w, top: V ? 280 : 90, display: "flex", flexDirection: "column", gap: V ? 50 : 34 }}>
        <div style={{ fontFamily: F, color: C.white }}>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.3em", opacity: 0.6 }}>PRODUTIVIDADE EM DETALHE</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
            <Count to={P.total} at={0} dur={30} dec={2} suffix=" mil" style={{ fontSize: V ? 130 : 150, fontWeight: 800, letterSpacing: "-0.05em", color: C.neon }} />
            <span style={{ fontSize: 46, fontWeight: 700 }}>minutos</span>
          </div>
        </div>
        <Barra l="Operacional (OP)" v={P.op} max={P.op} c={C.neon} at={16} />
        <Barra l="Waste Avoidance" v={P.waste} max={P.op} c={C.lime} at={26} sub />
        <Barra l="Estrutural" v={P.estrutural} max={P.op} c={C.lime} at={32} sub />
        <Barra l="Administrativo (ADM)" v={P.adm} max={P.op} c={C.yellow} at={42} />
      </div>
    </Field>
  );
};

const Custos: React.FC = () => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const $ = DETALHE.custos;
  const g = (d: number) => interpolate(frame, [d, d + 20], [0, 1], { ...cl, easing: OUT });
  const H0 = V ? 520 : 420;
  return (
    <Field bg={C.yellow}>
      <AbsoluteFill style={{ flexDirection: V ? "column" : "row", alignItems: "center", justifyContent: "center", gap: V ? 80 : 160, fontFamily: F, color: C.ink }}>
        <div style={{ textAlign: V ? "center" : "left" }}>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.3em", opacity: 0.6 }}>CUSTOS</div>
          <div style={{ fontSize: t(260), fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1 }}>
            <Count to={$.total} at={0} dur={24} prefix="R$ " />
            <span style={{ fontSize: t(110) }}> mi</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-end", height: H0 + 120 }}>
          {[
            { l: "Estrutural", v: $.estrutural, c: "rgba(10,11,10,.25)" },
            { l: "Cost Avoidance", v: $.avoidance, c: C.green },
          ].map((b, i) => (
            <div key={i} style={{ width: V ? 240 : 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 50, fontWeight: 800 }}>{fmtBR(b.v * g(10 + i * 8), 2)}</div>
              <div style={{ width: "100%", height: (b.v / 2) * H0 * g(10 + i * 8), borderRadius: 26, background: b.c }} />
              <div style={{ fontSize: 28, fontWeight: 700 }}>{b.l}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Field>
  );
};

const Moral: React.FC = () => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const cores = ["#2fb5ac", C.green, "#f2b705"];
  const S = V ? 560 : 520;
  return (
    <Field bg={C.paper}>
      <AbsoluteFill style={{ flexDirection: V ? "column" : "row", alignItems: "center", justifyContent: "center", gap: V ? 60 : 140, fontFamily: F, color: C.ink }}>
        <div style={{ position: "relative", width: S, height: S }}>
          {DETALHE.moral.map((m, i) => {
            const R = S / 2 - 30 - i * (S * 0.13);
            const L = 2 * Math.PI * R;
            const p = interpolate(frame, [4 + i * 5, 34 + i * 5], [0, (m.valor / 18) * 0.92], { ...cl, easing: OUT });
            return (
              <svg key={i} width={S} height={S} style={{ position: "absolute", rotate: "-90deg" }}>
                <circle cx={S / 2} cy={S / 2} r={R} fill="none" stroke={cores[i]} strokeOpacity={0.15} strokeWidth={S * 0.09} />
                <circle cx={S / 2} cy={S / 2} r={R} fill="none" stroke={cores[i]} strokeWidth={S * 0.09} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} />
              </svg>
            );
          })}
          <AbsoluteFill style={center}>
            <Count to={35} at={4} dur={30} style={{ fontSize: S * 0.24, fontWeight: 800, letterSpacing: "-0.05em" }} />
          </AbsoluteFill>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.3em", opacity: 0.55 }}>MORAL · PROJETOS</div>
          {DETALHE.moral.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 56, fontWeight: 700, opacity: interpolate(frame, [14 + i * 5, 20 + i * 5], [0, 1], cl), translate: `${interpolate(frame, [14 + i * 5, 22 + i * 5], [40, 0], cl)}px 0` }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: cores[i] }} />
              <span style={{ minWidth: 300 }}>{m.nome}</span>
              <b style={{ color: cores[i] }}>{m.valor}</b>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Field>
  );
};

export const Resultados: React.FC<D> = () => (
  <Shots
    items={[
      { d: 60, enter: "slam", el: () => <EmNumeros /> },
      { d: 180, enter: "zoom", exit: "zoom", el: (d) => <Grade dur={d} /> },
      { d: 90, enter: "zoom", exit: "whip", el: () => <Total /> },
      ...PILARES.map((p, i) => ({ d: 60, enter: (i === 0 ? "whip" : i % 2 ? "slam" : "whip") as "whip" | "slam", el: (d: number) => <PilarShot p={p} i={i} dur={d} /> })),
      { d: 105, enter: "zoom", exit: "whip", el: () => <Produtividade /> },
      { d: 60, enter: "whip", el: () => <Custos /> },
      { d: 45, enter: "slam", el: () => <Moral /> },
    ]}
  />
);
export { Pill, Rise };
