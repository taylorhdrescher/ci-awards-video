import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DEPOIMENTO, DETALHE, EVENTO, EVENTOS, Pilar, PILARES, RECONHECIMENTO, TOTAL_ANDAMENTO, TOTAL_CONCLUIDOS } from "../content";
import { Bloom, C, cl, Count, Dust, Eyebrow, Fade, fmtBR, Footage, Frame, Gauge, Glass, Hair, Hud, INOUT, Letterbox, Midia, OUT, Plate, Rays, SANS, SERIF, Stage, Streak, Title, useL } from "./kit";
import { Block, center, D } from "./cenas-a";

const TOT = TOTAL_CONCLUIDOS + TOTAL_ANDAMENTO;

// =================================================================== 4a · TOTAIS (270) — sinos: 35 (60), 55 (60), total 110 (40)
export const Totais: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, t } = useL();
  const G = V ? 640 : 640;
  const gx = V ? W / 2 : 1390;
  const gy = V ? 1080 : 560;
  const f1 = TOTAL_CONCLUIDOS / TOT;
  const row = (at: number) => interpolate(frame, [at - 6, at + 10], [0, 1], { ...cl, easing: OUT });
  const stat = (v: number, label: string, color: string, at: number) => (
    <div style={{ opacity: row(at), translate: `0 ${(1 - row(at)) * 20}px`, display: "flex", flexDirection: "column", alignItems: V ? "center" : "flex-start" }}>
      <Count to={v} at={at} dur={60} style={{ fontFamily: SANS, fontWeight: 200, fontSize: V ? 120 : 140, letterSpacing: "-0.04em", color: C.white, lineHeight: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 14px ${color}` }} />
        <span style={{ fontFamily: SANS, fontSize: 24, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(255,255,255,.75)" }}>{label.toUpperCase()}</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Footage at={29.6} dim={0.75} blur={18} dur={dur} push={[1.1, 1.15]} />
      <div style={{ position: "absolute", left: gx - G / 2, top: gy - G / 2, width: G, height: G }}>
        <Gauge size={G} value={f1} at={35} dur={60} color={C.leaf} ticks={150} />
        <Gauge size={G} value={1 - f1 - 0.004} start={f1 + 0.004} at={55} dur={60} color={C.yellow} ticks={150} track="transparent" />
        <AbsoluteFill style={{ ...center, flexDirection: "column" }}>
          <Count to={TOT} at={110} dur={40} style={{ fontFamily: SANS, fontWeight: 200, fontSize: 150, letterSpacing: "-0.05em", color: C.white, lineHeight: 1 }} />
          <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 600, letterSpacing: "0.34em", color: C.gold, marginTop: 12, opacity: interpolate(frame, [110, 126], [0, 1], cl) }}>PROJETOS · FY26</div>
        </AbsoluteFill>
      </div>
      <Block top={V ? undefined : 150} vTop={190}>
        <Eyebrow n="03" text="Resultados FY26" at={0} />
        <Title lines={[[{ t: "Um ano de melhoria,", w: 300 }], [{ t: "em números.", serif: true, color: C.leaf }]]} size={t(96)} at={4} every={6} align={V ? "center" : "left"} />
      </Block>
      <div style={{ position: "absolute", left: V ? 0 : 150, right: V ? 0 : undefined, top: V ? 1480 : 560, display: "flex", flexDirection: V ? "row" : "column", justifyContent: "center", gap: V ? 90 : 56 }}>
        {stat(TOTAL_CONCLUIDOS, "Concluídos", C.leaf, 35)}
        {stat(TOTAL_ANDAMENTO, "Em andamento", C.yellow, 55)}
      </div>
      <Hud at={0} label="03 · RESULTADOS" />
    </AbsoluteFill>
  );
};

// =================================================================== 4b · PILARES (480) — sino de cada pilar em 75 + 12i
const Simbolo: React.FC<{ l: string; color: string; size: number }> = ({ l, color, size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color, fontFamily: SANS, fontWeight: 300, fontSize: size * 0.44 }}>
    {l === "leaf" ? (
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24"><path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19zm0 0l7-7" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" /></svg>
    ) : l === "heart" ? (
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke={color} strokeWidth={1.6} /></svg>
    ) : (
      l
    )}
  </div>
);

const Coluna: React.FC<{ p: Pilar; i: number; w: number; h: number; x: number; y: number; focus: number; dim: number }> = ({ p, i, w, h, x, y, focus, dim }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const at = 20 + 12 * i;
  const r = interpolate(frame, [at - 4, at + 20], [0, 1], { ...cl, easing: OUT });
  const tot = p.concluidos + p.andamento;
  const bar = interpolate(frame, [at + 10, at + 55], [0, p.concluidos / tot], { ...cl, easing: OUT });
  const sub = [p.sufixo.trim(), p.unidade].filter(Boolean).join(" ");
  return (
    <Glass p={r} style={{ left: x, top: y, width: w, height: h, padding: V ? "34px 34px" : "30px 36px", opacity: r * (1 - dim * 0.55), scale: String(1 + focus * 0.035), borderColor: focus > 0.05 ? p.cor : undefined, boxShadow: focus > 0.05 ? `0 0 ${60 * focus}px ${p.cor}55, 0 30px 80px rgba(0,0,0,.35)` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: p.cor, opacity: 0.4 + 0.6 * focus }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Simbolo l={p.letra} color={p.cor} size={V ? 64 : 58} />
        <span style={{ flex: 1, fontSize: V ? 34 : 32, fontWeight: 700, letterSpacing: "-0.01em" }}>{p.nome}</span>
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.25em", color: "rgba(255,255,255,.5)" }}>0{i + 1}</span>
      </div>
      <div style={{ position: "absolute", left: V ? 34 : 36, right: V ? 34 : 36, bottom: V ? 110 : 96, display: "flex", flexDirection: V ? "column" : "row", alignItems: V ? "flex-start" : "baseline", gap: V ? 8 : 18 }}>
        <Count to={p.valor} at={at} dur={55} dec={p.casas} prefix={p.prefixo} style={{ fontWeight: 200, fontSize: V ? 96 : 100, letterSpacing: "-0.05em", lineHeight: 1, color: C.white, whiteSpace: "nowrap" }} />
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.22em", color: p.cor }}>{sub.toUpperCase()}</div>
      </div>
      <div style={{ position: "absolute", left: V ? 34 : 36, right: V ? 34 : 36, bottom: 30 }}>
        <div style={{ height: 3, background: "rgba(255,255,255,.14)" }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: p.cor, boxShadow: `0 0 10px ${p.cor}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 19, color: "rgba(255,255,255,.7)", fontVariantNumeric: "tabular-nums" }}>
          <span>
            <b style={{ color: C.white }}>{fmtBR(p.concluidos)}</b> concl.
          </span>
          <span>{fmtBR(p.andamento)} andam.</span>
        </div>
      </div>
    </Glass>
  );
};

export const Pilares: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, t } = useL();
  // destaque sequencial de cada pilar depois que todos os números assentam
  const F0 = 150;
  const FS = 50;
  const cur = (frame - F0) / FS;
  const k = Math.floor(cur);
  const focusOf = (i: number) => (frame < F0 || k > 5 ? 0 : i === k ? Math.min(interpolate(cur - k, [0, 0.2], [0, 1], cl), interpolate(cur - k, [0.8, 1], [1, 0], cl)) : 0);
  const anyFocus = frame >= F0 && k <= 5 ? 1 : 0;
  const glowColor = anyFocus ? PILARES[Math.min(5, Math.max(0, k))].cor : C.green;
  const cols = V ? 2 : 3;
  const w = V ? 450 : 520;
  const h = V ? 420 : 300;
  const gap = V ? 30 : 26;
  const x0 = (W - (cols * w + (cols - 1) * gap)) / 2;
  const y0 = V ? 420 : 330;
  return (
    <Stage glow={`${glowColor}44`} at={[50, 60]}>
      <Block top={V ? undefined : 120} vTop={150}>
        <Eyebrow n="03" text="Resultados por pilar" at={0} />
        <Title lines={[[{ t: "Seis pilares, ", w: 300 }, { t: "um só time.", serif: true, color: C.leaf }]]} size={t(84)} at={4} align={V ? "center" : "left"} />
      </Block>
      {PILARES.map((p, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const f = focusOf(i);
        return <Coluna key={p.nome} p={p} i={i} w={w} h={h} x={x0 + c * (w + gap)} y={y0 + r * (h + gap)} focus={f} dim={anyFocus * (1 - f)} />;
      })}
      <Hud at={0} label="03 · PILARES" />
      {dur ? null : null}
    </Stage>
  );
};

// =================================================================== 4c · DETALHES (390) — sinos: 30 (55), 60/80/92/110, 60 (50), 80 (45)
const Barra: React.FC<{ l: string; v: number; max: number; at: number; color: string; sub?: boolean }> = ({ l, v, max, at, color, sub }) => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [at, at + 30], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ paddingLeft: sub ? 36 : 0, opacity: interpolate(frame, [at - 4, at + 6], [0, 1], cl) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: sub ? 22 : 26, fontWeight: sub ? 500 : 600, color: sub ? "rgba(255,255,255,.65)" : C.white, letterSpacing: sub ? "0.04em" : "0" }}>
        <span>{l}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          <Count to={v} at={at} dur={30} dec={2} /> mil
        </span>
      </div>
      <div style={{ height: sub ? 2 : 4, marginTop: 10, background: "rgba(255,255,255,.12)" }}>
        <div style={{ width: `${(v / max) * 100 * g}%`, height: "100%", background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </div>
  );
};

export const Detalhes: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const P = DETALHE.produtividade;
  const $ = DETALHE.custos;
  const r = (at: number) => interpolate(frame, [at, at + 20], [0, 1], { ...cl, easing: OUT });
  const g = (at: number) => interpolate(frame, [at, at + 35], [0, 1], { ...cl, easing: OUT });
  const cores = ["#2fb5ac", C.leaf, C.yellow];
  const lab: React.CSSProperties = { fontSize: 20, fontWeight: 600, letterSpacing: "0.32em", color: "rgba(255,255,255,.6)" };
  const big: React.CSSProperties = { fontWeight: 200, letterSpacing: "-0.05em", lineHeight: 1, color: C.white };
  const prod = V ? { left: 70, top: 400, width: 940, height: 640 } : { left: 150, top: 330, width: 830, height: 620 };
  const cus = V ? { left: 70, top: 1080, width: 455, height: 600 } : { left: 1010, top: 330, width: 360, height: 620 };
  const mor = V ? { left: 555, top: 1080, width: 455, height: 600 } : { left: 1400, top: 330, width: 370, height: 620 };
  return (
    <AbsoluteFill>
      <Footage at={9.6} dim={0.72} blur={16} dur={dur} push={[1.1, 1.16]} />
      <Block top={V ? undefined : 120} vTop={150}>
        <Eyebrow n="03" text="Em detalhe" at={0} />
        <Title lines={[[{ t: "Ganhos que ", w: 300 }, { t: "fazem diferença.", serif: true, color: C.leaf }]]} size={t(84)} at={4} align={V ? "center" : "left"} />
      </Block>
      <Glass p={r(14)} style={{ ...prod, padding: 44 }}>
        <div style={lab}>PRODUTIVIDADE</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 14 }}>
          <Count to={P.total} at={30} dur={55} dec={2} style={{ ...big, fontSize: V ? 120 : 112 }} />
          <span style={{ fontSize: 28, fontWeight: 500, color: C.leaf }}>mil minutos</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 44 }}>
          <Barra l="Operacional (OP)" v={P.op} max={P.op} at={60} color={C.leaf} />
          <Barra l="Waste Avoidance" v={P.waste} max={P.op} at={80} color="#b6e3a8" sub />
          <Barra l="Estrutural" v={P.estrutural} max={P.op} at={92} color="#b6e3a8" sub />
          <Barra l="Administrativo (ADM)" v={P.adm} max={P.op} at={110} color={C.yellow} />
        </div>
      </Glass>
      <Glass p={r(34)} style={{ ...cus, padding: 40 }}>
        <div style={lab}>CUSTOS</div>
        <div style={{ ...big, fontSize: V ? 100 : 96, marginTop: 14, whiteSpace: "nowrap" }}>
          <Count to={$.total} at={60} dur={50} prefix="R$ " />
          <span style={{ fontSize: 34, fontWeight: 400, letterSpacing: 0 }}> mi</span>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 300, display: "flex", gap: 30, alignItems: "flex-end" }}>
          {[
            { l: "Estrutural", v: $.estrutural, c: "rgba(255,255,255,.5)", at: 70 },
            { l: "Cost Avoidance", v: $.avoidance, c: C.yellow, at: 80 },
          ].map((b) => (
            <div key={b.l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 28, fontWeight: 300, fontVariantNumeric: "tabular-nums" }}>{fmtBR(b.v * g(b.at), 2)}</div>
              <div style={{ width: 6, height: (b.v / 2) * 200 * g(b.at), background: b.c, boxShadow: `0 0 14px ${b.c}` }} />
              <Hair w={120} at={b.at} color="rgba(255,255,255,.3)" />
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,.7)", textAlign: "center" }}>{b.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </Glass>
      <Glass p={r(54)} style={{ ...mor, padding: 40 }}>
        <div style={lab}>MORAL</div>
        <div style={{ position: "relative", width: 260, height: 260, margin: "26px auto 0" }}>
          {DETALHE.moral.map((m, i) => {
            const R = 120 - i * 30;
            const L = 2 * Math.PI * R;
            const p = interpolate(frame, [80 + i * 6, 125 + i * 6], [0, (m.valor / 18) * 0.92], { ...cl, easing: OUT });
            return (
              <svg key={i} width={260} height={260} style={{ position: "absolute", rotate: "-90deg" }}>
                <circle cx={130} cy={130} r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={4} />
                <circle cx={130} cy={130} r={R} fill="none" stroke={cores[i]} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} style={{ filter: `drop-shadow(0 0 6px ${cores[i]})` }} />
              </svg>
            );
          })}
          <AbsoluteFill style={center}>
            <Count to={35} at={80} dur={45} style={{ ...big, fontSize: 72 }} />
          </AbsoluteFill>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 30 }}>
          {DETALHE.moral.map((m, i) => (
            <div key={m.nome} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, opacity: interpolate(frame, [110 + i * 6, 122 + i * 6], [0, 1], cl) }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: cores[i] }} />
              <span style={{ flex: 1, color: "rgba(255,255,255,.8)" }}>{m.nome}</span>
              <span style={{ fontWeight: 300, fontSize: 30 }}>{m.valor}</span>
            </div>
          ))}
        </div>
      </Glass>
      <Hud at={0} label="03 · DETALHES" />
    </AbsoluteFill>
  );
};

// =================================================================== 5 · RECONHECIMENTO (660) — palavras em 20, 100, 180, 260; destaques em 340
const PALAVRAS = [
  { w: "Melhorar", foto: "img/reconhecimento-log.jpg" },
  { w: "Avançar", video: 19.6 },
  { w: "Reconhecer", foto: "img/reconhecimento-grupo.jpg" },
  { w: "Celebrar", foto: "img/m-evento-premiacao.jpg", gold: true },
];
const Palavra: React.FC<{ i: number; len: number }> = ({ i, len }) => {
  const { t } = useL();
  const p = PALAVRAS[i];
  return (
    <AbsoluteFill>
      {p.video !== undefined ? <Footage at={p.video} dim={0.45} dur={len} push={[1.05, 1.12]} /> : <Plate src={p.foto!} dim={0.5} dur={len} zoom={[1.14, 1.04]} />}
      {p.gold ? <Rays opacity={0.5} /> : null}
      {p.gold ? <Dust n={80} rise={1} /> : null}
      <Letterbox from={-30} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 20 }}>
        <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 600, letterSpacing: "0.4em", color: p.gold ? C.gold : "rgba(255,255,255,.7)" }}>0{i + 1} — 04</div>
        <Title lines={[[{ t: p.w, w: p.gold ? 700 : 800, gold: p.gold }, { t: ".", w: 800, color: p.gold ? C.gold : C.leaf }]]} size={t(230)} at={2} align="center" />
      </AbsoluteFill>
      <Streak at={0} y={50} dur={20} dir={i % 2 ? -1 : 1} />
      <Bloom at={0} len={10} max={0.35} />
      <Hud at={0} label="04 · RECONHECIMENTO" />
    </AbsoluteFill>
  );
};

const Trimestral: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, t } = useL();
  const fotos = [RECONHECIMENTO.fotos[2], RECONHECIMENTO.fotos[0], RECONHECIMENTO.fotos[4], RECONHECIMENTO.fotos[1]];
  const Q = ["Q1", "Q2", "Q3", "Q4"];
  const at = (i: number) => 40 + i * 20;
  const push = interpolate(frame, [0, dur], [1, 1.05]);
  const line = interpolate(frame, [30, 110], [0, 1], { ...cl, easing: INOUT });
  const pts = Q.map((_, i) => (V ? { x: 150, y: 640 + i * 330 } : { x: 300 + i * 440, y: 860 }));
  return (
    <Stage glow="rgba(216,180,90,.18)" at={[50, 70]}>
      <AbsoluteFill style={{ scale: String(push) }}>
        <Block top={V ? undefined : 120} vTop={150}>
          <Eyebrow n="04" text="Reconhecimento" at={0} color={C.gold} />
          <Title lines={[[{ t: "Destaques ", w: 300 }, { t: "trimestrais.", serif: true, gold: true }]]} size={t(100)} at={4} align={V ? "center" : "left"} />
          <Fade text="A cada trimestre, os melhores projetos são reconhecidos no Gemba." at={18} every={1.5} size={V ? 34 : 32} width={V ? 900 : 1000} align={V ? "center" : "left"} />
        </Block>
        <svg width={W} height={2000} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={pts[0].x} y1={pts[0].y} x2={pts[0].x + (pts[3].x - pts[0].x) * line} y2={pts[0].y + (pts[3].y - pts[0].y) * line} stroke="rgba(216,180,90,.7)" strokeWidth={1.5} />
        </svg>
        {Q.map((q, i) => {
          const on = interpolate(frame, [at(i), at(i) + 10], [0, 1], { ...cl, easing: OUT });
          const ph = interpolate(frame, [at(i) + 4, at(i) + 26], [0, 1], { ...cl, easing: OUT });
          const fw = V ? 640 : 380;
          const fh = V ? 270 : 250;
          return (
            <React.Fragment key={q}>
              <div style={{ position: "absolute", left: pts[i].x - 9, top: pts[i].y - 9, width: 18, height: 18, borderRadius: "50%", background: on > 0.5 ? C.gold : C.night, border: `1.5px solid ${C.gold}`, boxShadow: on > 0.5 ? `0 0 20px ${C.gold}` : undefined }} />
              <div style={{ position: "absolute", left: V ? pts[i].x - 40 : pts[i].x - 40, top: V ? pts[i].y + 26 : pts[i].y + 28, width: 80, textAlign: "center", fontFamily: SANS, fontSize: 24, fontWeight: 300, letterSpacing: "0.2em", color: C.white, opacity: on }}>{q}</div>
              <div style={{ position: "absolute", left: V ? pts[i].x + 80 : pts[i].x - fw / 2, top: V ? pts[i].y - fh / 2 : pts[i].y - fh - 50, perspective: 1200, opacity: ph }}>
                <div style={{ transform: `translateY(${(1 - ph) * 40}px) rotateX(${(1 - ph) * 25}deg)` }}>
                  <Frame src={fotos[i]} w={fw} h={fh} dur={dur} label={i % 2 ? "Ver e Agir" : "Pensamento A3"} style={{ position: "relative" }} />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <Dust n={30} rise={0.3} max={0.7} />
      <Hud at={0} label="04 · RECONHECIMENTO" />
    </Stage>
  );
};

export const Reconhecimento: React.FC<D> = ({ dur }) => {
  const W0 = 20;
  const WL = 80;
  const B = W0 + 4 * WL;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Sequence durationInFrames={W0}>
        <Stage glow="rgba(216,180,90,.15)">
          <Dust n={40} />
        </Stage>
      </Sequence>
      {PALAVRAS.map((_, i) => (
        <Sequence key={i} from={W0 + i * WL} durationInFrames={WL}>
          <Palavra i={i} len={WL} />
        </Sequence>
      ))}
      <Sequence from={B}>
        <Trimestral dur={dur - B} />
        <Bloom at={0} len={14} max={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =================================================================== 6 · FEIRAS E EVENTOS (420) — carrossel 3D
export const Eventos: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, H, t } = useL();
  const fotos = EVENTOS.fotos;
  const n = fotos.length;
  const R = V ? 820 : 1150;
  const iw = V ? 680 : 520;
  const ih = V ? 500 : 340;
  const rot = interpolate(frame, [0, dur], [30, -95], { easing: INOUT });
  const intro = interpolate(frame, [0, 40], [0, 1], { ...cl, easing: OUT });
  const cy = V ? H / 2 + 120 : H / 2 + 90;
  return (
    <Stage glow="rgba(54,124,43,.45)" at={[50, 65]}>
      <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: `50% ${V ? 40 : 35}%` }}>
        <div style={{ position: "absolute", left: W / 2, top: cy, transformStyle: "preserve-3d", transform: `translateZ(${-R + (V ? 120 : 260)}px) rotateY(${rot}deg) scale(${0.85 + 0.15 * intro})` }}>
          {fotos.map((src, i) => {
            const a = (i / n) * 360;
            const rel = ((((a + rot) % 360) + 540) % 360) - 180; // 0 = de frente
            const front = Math.cos((rel * Math.PI) / 180);
            return (
              <div key={i} style={{ position: "absolute", left: -iw / 2, top: -ih / 2, width: iw, height: ih, transform: `rotateY(${a}deg) translateZ(${R}px)`, opacity: interpolate(front, [-0.2, 0.3, 1], [0, 0.45, 1], cl) * intro, filter: `brightness(${0.45 + 0.55 * Math.max(0, front)})` }}>
                <Frame src={src} w={iw} h={ih} dur={dur} style={{ position: "relative" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 75%, rgba(5,11,7,.9))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 170 : 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Eyebrow n="05" text="Feiras e eventos" at={14} center />
        <Title lines={[[{ t: "Onde a melhoria contínua", w: 300 }], [{ t: "acontece ", w: 300 }, { t: "junto.", serif: true, color: C.leaf }]]} size={t(84)} at={18} every={6} align="center" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: V ? 230 : 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, fontFamily: SANS }}>
        {["Feiras", "Eventos", "Gemba", "Pessoas"].map((w, i) => {
          const o = interpolate(frame, [60 + i * 10, 76 + i * 10], [0, 1], { ...cl, easing: OUT });
          return (
            <React.Fragment key={w}>
              {i ? <span style={{ width: 40, height: 1.5, background: "rgba(255,255,255,.3)", opacity: o }} /> : null}
              <span style={{ fontSize: V ? 26 : 24, fontWeight: 600, letterSpacing: "0.32em", color: i === 3 ? C.yellow : "rgba(255,255,255,.85)", opacity: o }}>{w.toUpperCase()}</span>
            </React.Fragment>
          );
        })}
      </div>
      <Hud at={0} label="05 · FEIRAS E EVENTOS" />
    </Stage>
  );
};

// =================================================================== 7 · DEPOIMENTO (600)
export const Depoimento: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const name = interpolate(frame, [150, 175], [0, 1], { ...cl, easing: OUT });
  const words = `“${DEPOIMENTO.frase}”`.split(" ");
  if (DEPOIMENTO.video) {
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <OffthreadVideo src={staticFile(DEPOIMENTO.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Letterbox from={-30} amount={0.6} />
        <div style={{ position: "absolute", left: V ? 70 : 150, bottom: V ? 360 : 170, fontFamily: SANS, opacity: name }}>
          <Hair w={90} at={150} color={C.gold} />
          <div style={{ fontSize: 46, fontWeight: 700, color: C.white, marginTop: 18 }}>{DEPOIMENTO.nome}</div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(255,255,255,.65)" }}>{DEPOIMENTO.cargo.toUpperCase()}</div>
        </div>
        <Hud at={0} label="06 · PALAVRA DO MENTOR" />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Plate src="img/time-ci.jpg" dim={0.78} dur={dur} zoom={[1.15, 1.04]} blur={6} />
      <Rays opacity={0.18} />
      <Dust n={30} rise={0.25} max={0.6} />
      <Letterbox from={-30} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 46, padding: V ? "0 70px" : "0 220px" }}>
        <Eyebrow n="06" text="Palavra do mentor" at={4} center color={C.gold} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: t(30), rowGap: 4, maxWidth: V ? 940 : 1500 }}>
          {words.map((w, i) => {
            const p = interpolate(frame, [20 + i * 9, 44 + i * 9], [0, 1], { ...cl, easing: OUT });
            const last = i === words.length - 1;
            return (
              <span key={i} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: t(120), lineHeight: 1.15, letterSpacing: "-0.02em", color: last ? undefined : C.white, opacity: p, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, translate: `0 ${(1 - p) * 20}px`, ...(last ? { backgroundImage: "linear-gradient(100deg,#c9a24a,#fff1c4,#d4af55)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: SANS, opacity: name, translate: `0 ${(1 - name) * 20}px` }}>
          <Hair w={90} at={150} color={C.gold} />
          <div style={{ fontSize: V ? 46 : 42, fontWeight: 700, color: C.white }}>{DEPOIMENTO.nome}</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.34em", color: "rgba(255,255,255,.65)" }}>{DEPOIMENTO.cargo.toUpperCase()}</div>
        </div>
      </AbsoluteFill>
      <Hud at={0} label="06 · PALAVRA DO MENTOR" />
    </AbsoluteFill>
  );
};

// =================================================================== 8 · ENCERRAMENTO (330) — 8 palavras (12 q cada), logo final em 98
const OITO: { w: string; at?: number; img?: string }[] = [
  { w: "Estar presente", at: 6.4 },
  { w: "Educar", img: "img/a3-apresentacao.jpg" },
  { w: "Incluir", img: "img/time-selfie.jpg" },
  { w: "Inspirar", at: 12.6 },
  { w: "Melhorar", at: 9.6 },
  { w: "Avançar", at: 19.8 },
  { w: "Reconhecer", img: "img/reconhecimento-grupo.jpg" },
  { w: "Celebrar", img: "img/m-evento-premiacao.jpg" },
];
const Final: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const out = interpolate(frame, [dur - 30, dur], [0, 1], cl);
  return (
    <Stage glow="rgba(216,180,90,.22)" at={[50, 45]}>
      <Rays opacity={0.6} />
      <Dust n={90} rise={0.7} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: V ? 22 : 16 }}>
        <Eyebrow text="John Deere · Montenegro" at={10} color={C.gold} center />
        <Title lines={[[{ t: "CI Awards", w: 700, gold: true }]]} size={t(240)} at={4} align="center" />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Hair w={V ? 120 : 200} at={20} color="rgba(216,180,90,.7)" />
          <div style={{ fontFamily: SANS, fontWeight: 200, fontSize: 64, letterSpacing: "0.5em", marginRight: "-0.5em", color: C.white, opacity: interpolate(frame, [18, 36], [0, 1], cl) }}>{EVENTO.ano}</div>
          <Hair w={V ? 120 : 200} at={20} color="rgba(216,180,90,.7)" />
        </div>
        <div style={{ marginTop: 18 }}>
          <Fade text="Obrigado a cada pessoa que faz a melhoria acontecer." at={46} every={2.2} size={V ? 40 : 40} serif color="rgba(255,255,255,.88)" width={V ? 900 : 1400} align="center" />
        </div>
      </AbsoluteFill>
      <Hud at={10} />
      <Bloom at={0} len={20} max={1} />
      <AbsoluteFill style={{ background: "#000", opacity: out }} />
    </Stage>
  );
};

export const Encerramento: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { t } = useL();
  const per = 12;
  const mont = 98;
  const i = Math.min(OITO.length - 1, Math.floor(frame / per));
  const it = OITO[i];
  if (frame >= mont) {
    return (
      <Sequence from={mont} layout="none">
        <Final dur={dur - mont} />
      </Sequence>
    );
  }
  const last = i === OITO.length - 1;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Sequence from={i * per} durationInFrames={per} layout="none" key={i}>
        {it.at !== undefined ? <Footage at={it.at} dim={0.5} dur={per} push={[1.1, 1.14]} /> : <Plate src={it.img!} dim={0.55} dur={per} zoom={[1.12, 1.06]} />}
        <Letterbox from={-30} />
        <AbsoluteFill style={center}>
          <div style={{ fontFamily: SANS, fontWeight: last ? 700 : 300, fontSize: t(170), letterSpacing: "-0.04em", color: C.white, filter: `blur(${interpolate(frame - i * per, [0, 4], [8, 0], cl)}px)`, scale: String(interpolate(frame - i * per, [0, per], [1.06, 1])) }}>
            {last ? <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, color: C.gold }}>{it.w}.</span> : `${it.w}.`}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
export { Midia, Streak };
