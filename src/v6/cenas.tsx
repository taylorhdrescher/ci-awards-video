/**
 * V6 — o roteiro da v5 refeito na linguagem dos testes (fundo claro, Inter, palavras com desfoque,
 * widgets, cursor, imagens da fábrica). Mesmas durações da v5 → trilha e efeitos da v5 continuam sincronizados.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Confetti, Media } from "../components/ui";
import { DEPOIMENTO, DETALHE, EVENTOS, PILARES, PRESENTE, TOTAL_ANDAMENTO, TOTAL_CONCLUIDOS } from "../content";
import { BlurWords, cl, Count, Cursor, Dark, Dust, F, Flare, fmtBR, Footage, INOUT, K, OUT, Paper, Widget } from "../teste/kit";
import { PresenteMask } from "../mix/novas";
import { Final } from "../teste/cenas";

type D = { dur: number };
const center: React.CSSProperties = { alignItems: "center", justifyContent: "center" };

const Eyebrow: React.FC<{ n: string; t: string; dark?: boolean; delay?: number }> = ({ n, t, dark, delay = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 12], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: F, fontWeight: 600, fontSize: 26, letterSpacing: "0.28em", color: dark ? "rgba(255,255,255,.75)" : "#6b7069", opacity: o }}>
      <span style={{ color: dark ? K.neon : K.green }}>{n}</span>
      <span style={{ width: 60 * o, height: 2, background: dark ? K.neon : K.green }} />
      <span>{t.toUpperCase()}</span>
    </div>
  );
};

// =================================================================== 1 · ABERTURA (300)
export const V6Abertura: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const L = 150; // logo termina junto com a pancada da trilha (5,0 s)
  const z = interpolate(frame, [L - 10, L], [1, 1.5], { ...cl, easing: (t) => t * t * t });
  const sub = interpolate(frame, [L + 70, L + 88], [0, 1], { ...cl, easing: OUT });
  const flashIn = interpolate(frame, [L, L + 8], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      {frame < L ? (
        <AbsoluteFill style={{ scale: String(z), filter: `blur(${interpolate(frame, [L - 8, L], [0, 16], cl)}px)` }}>
          <OffthreadVideo src={staticFile("teste/abertura-logo.mp4")} startFrom={9} muted style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
      ) : (
        <Sequence from={L} layout="none">
          <AbsoluteFill>
            <OffthreadVideo src={staticFile("teste/entrada-bandeiras-lenta.mp4")} muted style={{ width: "100%", height: "100%", scale: String(interpolate(frame, [L, dur], [1.02, 1.08])) }} />
            <AbsoluteFill style={{ background: "rgba(2,3,2,.45)" }} />
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.6), transparent 50%)" }} />
            <AbsoluteFill style={{ ...center, flexDirection: "column", textShadow: "0 10px 40px rgba(0,0,0,.5)" }}>
              <BlurWords text="CI Awards" start={6} every={8} size={250} weight={800} color="#fff" accent={[1]} accentColor={K.neon} />
              <div style={{ marginTop: 26, display: "flex", gap: 28, alignItems: "center", opacity: sub, translate: `0 ${(1 - sub) * 20}px`, fontFamily: F }}>
                <div style={{ fontSize: 46, fontWeight: 800, padding: "10px 30px", borderRadius: 999, background: K.yellow, color: K.ink }}>2026</div>
                <div style={{ fontSize: 36, fontWeight: 600, color: "#fff" }}>O Oscar da Melhoria Contínua de Montenegro</div>
              </div>
            </AbsoluteFill>
            <AbsoluteFill style={{ background: "#fff", opacity: flashIn }} />
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

// =================================================================== 2 · ESTAR PRESENTE (660)
const BENTO = [
  { i: 3, x: 80, y: 120, w: 1060, h: 600 },
  { i: 4, x: 1180, y: 120, w: 660, h: 400 },
  { i: 5, x: 1180, y: 560, w: 660, h: 400 },
  { i: 0, x: 80, y: 760, w: 520, h: 300 },
  { i: 2, x: 620, y: 760, w: 520, h: 300 },
];
const BentoMedia: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cam = [
    [0, 610, 420, 1.55],
    [70, 640, 430, 1.45],
    [110, 1510, 330, 1.7],
    [160, 1510, 760, 1.7],
    [215, 960, 590, 0.9],
    [dur, 960, 590, 0.86],
  ];
  const fs = cam.map((c) => c[0]);
  const cx = interpolate(frame, fs, cam.map((c) => c[1]), { ...cl, easing: INOUT });
  const cy = interpolate(frame, fs, cam.map((c) => c[2]), { ...cl, easing: INOUT });
  const z = interpolate(frame, fs, cam.map((c) => c[3]), { ...cl, easing: INOUT });
  const fr = PRESENTE.frases;
  return (
    <Paper glow="rgba(88,214,74,.14)">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }}>
        {BENTO.map((b, k) => {
          const c = PRESENTE.cards[b.i];
          const s = spring({ frame: frame - k * 4, fps: 30, config: { damping: 16 } });
          return (
            <div key={k} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 40, overflow: "hidden", boxShadow: "0 30px 70px rgba(30,50,30,.22)", scale: String(0.85 + 0.15 * s), opacity: s }}>
              <Media src={c.src} tipo={c.tipo} style={{ width: "100%", height: "100%" }} durationInFrames={dur} zoom={[1.12, 1]} />
              <div style={{ position: "absolute", left: 24, top: 24, fontFamily: F, fontWeight: 700, fontSize: 26, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,.92)", color: K.ink }}>{c.label}</div>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "rgba(244,245,241,.88)", opacity: interpolate(frame, [215, 235], [0, 1], cl) }} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 6 }}>
        {fr.map((t, i) => (
          <BlurWords key={t} text={`${t}.`} start={225 + i * 14} every={3} size={110} weight={800} accent={i === 2 ? [1] : []} />
        ))}
      </AbsoluteFill>
    </Paper>
  );
};
export const V6Presente: React.FC<D> = ({ dur }) => {
  const P1 = 375;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={P1}>
        <PresenteMask dur={P1} fase2={95} ponte={65} vozFase2={P1 - 95 - 65} fundoAt={12.0} />
        <div style={{ position: "absolute", left: 60, top: 50 }}>
          <Sequence from={0} layout="none">
            <Eyebrow n="01" t="Como atuamos" dark />
          </Sequence>
        </div>
      </Sequence>
      <Sequence from={P1}>
        <BentoMedia dur={dur - P1} />
      </Sequence>
    </AbsoluteFill>
  );
};

// =================================================================== 3 · EDUCAR · INCLUIR · INSPIRAR (570)
const Pill: React.FC<{ text: string; on: number; x: number; y: number }> = ({ text, on, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: F, fontWeight: 700, fontSize: 44, padding: "20px 40px", borderRadius: 999, background: on > 0.5 ? K.green : "#fff", color: on > 0.5 ? "#fff" : K.ink, boxShadow: on > 0.5 ? `0 0 ${60 * on}px rgba(88,214,74,.7)` : "0 14px 40px rgba(0,0,0,.12)", scale: String(1 + Math.sin(on * Math.PI) * 0.08) }}>{text}</div>
);
const Educar: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const c1 = 70;
  const c2 = 105;
  const card = spring({ frame: frame - 8, fps: 30, config: { damping: 15 } });
  return (
    <Paper glow="rgba(88,214,74,.18)">
      <div style={{ position: "absolute", left: 140, top: 90 }}>
        <Eyebrow n="02" t="Como educamos" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 200 }}>
        <BlurWords text="Educar." start={2} every={5} size={190} weight={800} align="left" width={800} accent={[0]} />
        <div style={{ marginTop: 20, width: 700 }}>
          <BlurWords text="Formamos pessoas no Pensamento A3 e no Ver e Agir." start={18} every={2} size={46} weight={500} color="#454b44" align="left" width={700} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 150, width: 780, height: 540, borderRadius: 40, overflow: "hidden", scale: String(0.8 + 0.2 * card), opacity: card, rotate: `${(1 - card) * 6}deg`, boxShadow: "0 0 0 10px #fff, 0 40px 100px rgba(30,60,30,.25)" }}>
        <Media src="img/a3-apresentacao.jpg" style={{ width: "100%", height: "100%" }} durationInFrames={dur} zoom={[1.1, 1]} />
      </div>
      <Pill text="Pensamento A3" on={interpolate(frame, [c1, c1 + 6], [0, 1], cl)} x={140} y={760} />
      <Pill text="Ver e Agir" on={interpolate(frame, [c2, c2 + 6], [0, 1], cl)} x={640} y={760} />
      <Cursor path={[[30, 1500, 1000], [c1 - 4, 340, 810], [c2 - 6, 770, 810], [dur, 800, 840]]} clicks={[c1, c2]} />
    </Paper>
  );
};
const AV = ["img/reconhecimento-grupo.jpg", "img/time-selfie.jpg", "img/reconhecimento-dupla.jpg", "img/estande-apresentacao.jpg", "img/reconhecimento-log.jpg", "img/m-evento-plateia.jpg", "img/reconhecimento-dto-solda.jpg", "img/m-feira-estande.jpg"];
const Incluir: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const R = 340;
  const ring = interpolate(frame, [0, 20], [0, 1], { ...cl, easing: OUT });
  return (
    <Paper glow="rgba(88,214,74,.16)">
      <div style={{ position: "absolute", left: 140, top: 300 }}>
        <BlurWords text="Incluir." start={2} every={5} size={190} weight={800} align="left" width={800} accent={[0]} />
        <div style={{ marginTop: 20, width: 640 }}>
          <BlurWords text="Melhoria contínua feita por todos, em todas as áreas." start={16} every={2} size={46} weight={500} color="#454b44" align="left" width={640} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1380, top: 540 }}>
        <svg width={2 * R + 40} height={2 * R + 40} style={{ position: "absolute", left: -R - 20, top: -R - 20 }}>
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={K.green} strokeOpacity={0.5} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
        </svg>
        <div style={{ position: "absolute", left: -170, top: -170, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 8px #fff, 0 0 80px rgba(88,214,74,.5)", scale: String(ring) }}>
          <Media src="vid/facilitando.mp4" style={{ width: "100%", height: "100%" }} durationInFrames={dur} />
        </div>
        {AV.map((src, i) => {
          const a = ((i / AV.length) * 360 + frame * 0.5) * (Math.PI / 180);
          const s = spring({ frame: frame - 6 - i * 3, fps: 30, config: { damping: 12 } });
          return (
            <div key={i} style={{ position: "absolute", left: Math.cos(a) * R - 72, top: Math.sin(a) * R - 72, width: 144, height: 144, borderRadius: "50%", overflow: "hidden", scale: String(s), boxShadow: "0 0 0 6px #fff, 0 16px 40px rgba(0,0,0,.2)" }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
    </Paper>
  );
};
const Inspirar: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ph = spring({ frame: frame - 30, fps: 30, config: { damping: 15 } });
  return (
    <Dark video={19.6} dim={0.45}>
      <Flare x={interpolate(frame, [0, dur], [300, 1600])} y={300} scale={0.9} opacity={0.7} />
      <div style={{ position: "absolute", left: 140, top: 330 }}>
        <BlurWords text="Inspirar." start={2} every={5} size={190} weight={800} color="#fff" align="left" width={900} accent={[0]} accentColor={K.neon} />
        <div style={{ marginTop: 20, width: 700 }}>
          <BlurWords text="Um time que vive a melhoria todos os dias." start={16} every={2} size={46} weight={500} color="rgba(255,255,255,.85)" align="left" width={700} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 200, width: 660, height: 680, borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 8px rgba(255,255,255,.9), 0 0 120px rgba(88,214,74,.4)", scale: String(0.7 + 0.3 * ph), opacity: ph, rotate: `${(1 - ph) * -8 + 3}deg` }}>
        <Img src={staticFile("img/time-selfie.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.1 - frame * 0.0005) }} />
      </div>
    </Dark>
  );
};
export const V6Educar: React.FC<D> = ({ dur }) => {
  const seg = Math.floor(dur / 3);
  const parts = [Educar, Incluir, Inspirar];
  return (
    <AbsoluteFill>
      {parts.map((C, i) => (
        <Sequence key={i} from={i * seg} durationInFrames={i === 2 ? dur - 2 * seg : seg}>
          <Whip>
            <C dur={i === 2 ? dur - 2 * seg : seg} />
          </Whip>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
const Whip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 9], [1, 0], { ...cl, easing: OUT });
  return <AbsoluteFill style={{ translate: `${t * 700}px 0`, filter: t > 0.01 ? `blur(${t * 26}px)` : undefined }}>{children}</AbsoluteFill>;
};

// =================================================================== 4a · TOTAIS (270)
export const V6Totais: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tot = TOTAL_CONCLUIDOS + TOTAL_ANDAMENTO;
  const R = 300;
  const C = 2 * Math.PI * R;
  const a = interpolate(frame, [35, 95], [0, TOTAL_CONCLUIDOS / tot], { ...cl, easing: OUT });
  const b = interpolate(frame, [55, 115], [0, TOTAL_ANDAMENTO / tot - 0.02], { ...cl, easing: OUT });
  const row = (d: number) => interpolate(frame, [d - 8, d + 6], [0, 1], { ...cl, easing: OUT });
  return (
    <Paper>
      <div style={{ position: "absolute", left: 140, top: 90 }}>
        <Eyebrow n="03" t="Resultados FY26" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 190 }}>
        <BlurWords text="Um ano de melhoria em números." start={2} every={4} size={110} weight={800} align="left" width={900} accent={[4, 5]} />
      </div>
      {[
        { v: TOTAL_CONCLUIDOS, l: "projetos concluídos", c: K.green, d: 35 },
        { v: TOTAL_ANDAMENTO, l: "em andamento", c: "#d6a800", d: 55 },
      ].map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 140, top: 560 + i * 190, display: "flex", alignItems: "baseline", gap: 26, fontFamily: F, opacity: row(r.d), translate: `${(1 - row(r.d)) * -40}px 0` }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: r.c, alignSelf: "center" }} />
          <Count to={r.v} start={r.d} dur={60} style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.05em", color: K.ink }} />
          <div style={{ fontSize: 38, fontWeight: 600, color: r.c }}>{r.l}</div>
        </div>
      ))}
      <svg width={2 * R + 80} height={2 * R + 80} style={{ position: "absolute", left: 1450 - R - 40, top: 560 - R - 40, rotate: "-90deg" }}>
        <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke="#dfe2dc" strokeWidth={50} />
        <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={K.green} strokeWidth={50} strokeLinecap="round" strokeDasharray={`${C * a} ${C}`} />
        <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={K.yellow} strokeWidth={50} strokeLinecap="round" strokeDasharray={`${C * b} ${C}`} strokeDashoffset={-C * (TOTAL_CONCLUIDOS / tot + 0.01)} />
      </svg>
      <div style={{ position: "absolute", left: 1450 - 250, top: 560 - 110, width: 500, textAlign: "center", fontFamily: F }}>
        <Count to={tot} start={110} dur={40} style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", color: K.ink, lineHeight: 1 }} />
        <div style={{ fontSize: 32, fontWeight: 600, color: "#6b7069", marginTop: 10, opacity: interpolate(frame, [110, 125], [0, 1], cl) }}>projetos em FY26</div>
      </div>
    </Paper>
  );
};

// =================================================================== 4b · PILARES (480)
const Icon: React.FC<{ l: string; c: string }> = ({ l, c }) => (
  <div style={{ width: 66, height: 66, borderRadius: 20, background: c, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 34, fontFamily: F }}>
    {l === "leaf" ? (
      <svg width={36} height={36} viewBox="0 0 24 24"><path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19zm0 0l7-7" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" /></svg>
    ) : l === "heart" ? (
      <svg width={36} height={36} viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#fff" /></svg>
    ) : (
      l
    )}
  </div>
);
export const V6Pilares: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const W = 540;
  const H = 400;
  const pos = (i: number) => ({ x: 120 + (i % 3) * (W + 40), y: 200 + Math.floor(i / 3) * (H + 40) });
  // câmera: visão geral → Produtividade → Custos → Segurança → visão geral
  const cam = [
    [0, 960, 640, 1],
    [130, 960, 640, 1],
    [165, 1480, 420, 1.75],
    [215, 1480, 420, 1.7],
    [250, 900, 860, 1.75],
    [300, 900, 860, 1.7],
    [335, 330, 420, 1.75],
    [385, 330, 420, 1.7],
    [425, 960, 640, 1],
    [dur, 960, 640, 0.97],
  ];
  const fs = cam.map((c) => c[0]);
  const cx = interpolate(frame, fs, cam.map((c) => c[1]), { ...cl, easing: INOUT });
  const cy = interpolate(frame, fs, cam.map((c) => c[2]), { ...cl, easing: INOUT });
  const z = interpolate(frame, fs, cam.map((c) => c[3]), { ...cl, easing: INOUT });
  return (
    <AbsoluteFill style={{ background: K.paper2, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #fbfcf9, #dfe2db 80%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }}>
        <div style={{ position: "absolute", left: 120, top: 80 }}>
          <Eyebrow n="03" t="Resultados por pilar" />
        </div>
        {PILARES.map((p, i) => {
          const d = 10 + i * 12;
          const s = spring({ frame: frame - d, fps: 30, config: { damping: 15 } });
          const { x, y } = pos(i);
          const dark = i === 2 || i === 5;
          const tot = p.concluidos + p.andamento;
          const bar = interpolate(frame, [d + 20, d + 70], [0, p.concluidos / tot], { ...cl, easing: OUT });
          return (
            <Widget key={p.nome} x={x} y={y} w={W} h={H} dark={dark} style={{ scale: String(0.8 + 0.2 * s), opacity: s, translate: `0 ${(1 - s) * 80}px` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Icon l={p.letra} c={p.cor} />
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.nome}</div>
              </div>
              <div style={{ marginTop: 34, display: "flex", alignItems: "baseline", gap: 12, whiteSpace: "nowrap" }}>
                <Count to={p.valor} start={d + 10} dur={55} dec={p.casas} prefix={p.prefixo} suffix={p.sufixo} style={{ fontSize: p.casas ? 88 : 104, fontWeight: 800, letterSpacing: "-0.05em", color: p.cor }} />
                <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.6 }}>{p.unidade}</span>
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 36 }}>
                <div style={{ height: 16, borderRadius: 16, background: dark ? "rgba(255,255,255,.12)" : "#e6e8e2", overflow: "hidden" }}>
                  <div style={{ width: `${bar * 100}%`, height: "100%", background: p.cor, borderRadius: 16 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 24, opacity: 0.75 }}>
                  <span><b>{fmtBR(p.concluidos)}</b> concluídos</span>
                  <span><b>{fmtBR(p.andamento)}</b> em andamento</span>
                </div>
              </div>
            </Widget>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =================================================================== 4c · DETALHES (390)
export const V6Detalhes: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const P = DETALHE.produtividade;
  const $ = DETALHE.custos;
  const s = (d: number) => spring({ frame: frame - d, fps: 30, config: { damping: 16 } });
  const grow = (d: number) => interpolate(frame, [d, d + 40], [0, 1], { ...cl, easing: OUT });
  const bars = [
    { l: "Operacional (OP)", v: P.op, c: K.neon, d: 60 },
    { l: "Waste Avoidance", v: P.waste, c: "#8fd16f", d: 80, sub: true },
    { l: "Estrutural", v: P.estrutural, c: "#8fd16f", d: 92, sub: true },
    { l: "Administrativo (ADM)", v: P.adm, c: K.yellow, d: 110 },
  ];
  const moral = [
    { ...DETALHE.moral[0], c: "#2fb5ac" },
    { ...DETALHE.moral[1], c: K.green },
    { ...DETALHE.moral[2], c: "#f2b705" },
  ];
  const drift = interpolate(frame, [0, dur], [0, -30]);
  return (
    <Paper glow="rgba(88,214,74,.12)">
      <div style={{ position: "absolute", left: 120, top: 70 }}>
        <Eyebrow n="03" t="Em detalhe" />
      </div>
      <div style={{ position: "absolute", left: 120, top: 120 }}>
        <BlurWords text="Ganhos que fazem diferença." start={2} every={4} size={86} weight={800} align="left" width={1600} accent={[3]} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, translate: `${drift}px 0` }}>
        {/* Produtividade */}
        <Widget x={120} y={290} w={860} h={700} dark style={{ scale: String(0.85 + 0.15 * s(20)), opacity: s(20) }}>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.65 }}>Produtividade</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 10 }}>
            <Count to={P.total} dec={2} start={30} dur={55} suffix=" mil" style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.05em" }} />
            <span style={{ fontSize: 34, color: K.neon, fontWeight: 700 }}>minutos</span>
          </div>
          {bars.map((b) => (
            <div key={b.l} style={{ marginTop: b.sub ? 16 : 34, paddingLeft: b.sub ? 40 : 0, opacity: interpolate(frame, [b.d - 4, b.d + 6], [0, 1], cl) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: b.sub ? 24 : 30, fontWeight: b.sub ? 500 : 700, opacity: b.sub ? 0.75 : 1 }}>
                <span>{b.l}</span>
                <span>
                  <Count to={b.v} dec={2} start={b.d} dur={40} /> mil
                </span>
              </div>
              <div style={{ height: b.sub ? 12 : 22, borderRadius: 20, background: "rgba(255,255,255,.12)", marginTop: 10, overflow: "hidden" }}>
                <div style={{ width: `${(b.v / P.op) * 100 * grow(b.d)}%`, height: "100%", borderRadius: 20, background: b.c }} />
              </div>
            </div>
          ))}
        </Widget>
        {/* Custos */}
        <Widget x={1020} y={290} w={380} h={700} bg={K.green} style={{ color: "#fff", scale: String(0.85 + 0.15 * s(40)), opacity: s(40) }}>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.8 }}>Custos</div>
          <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.05em", marginTop: 20, lineHeight: 1 }}>
            <Count to={$.total} start={60} dur={50} prefix="R$ " />
            <span style={{ fontSize: 50, letterSpacing: "-0.01em" }}> mi</span>
          </div>
          <div style={{ display: "flex", gap: 14, height: 300, alignItems: "flex-end", marginTop: 50 }}>
            {[
              { l: "Estrutural", v: $.estrutural, c: "rgba(255,255,255,.4)" },
              { l: "Cost Avoidance", v: $.avoidance, c: K.yellow },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 30, fontWeight: 800 }}>{fmtBR(b.v, 2)}</div>
                <div style={{ width: "100%", height: (b.v / 2) * 220 * grow(70 + i * 10), borderRadius: 18, background: b.c }} />
                <div style={{ fontSize: 20, opacity: 0.85, textAlign: "center" }}>{b.l}</div>
              </div>
            ))}
          </div>
        </Widget>
        {/* Moral */}
        <Widget x={1440} y={290} w={400} h={700} bg="#eaf6f3" style={{ scale: String(0.85 + 0.15 * s(60)), opacity: s(60) }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#6b7069" }}>Moral</div>
          <div style={{ position: "relative", width: 320, height: 320, marginTop: 20 }}>
            {moral.map((m, i) => {
              const R = 140 - i * 38;
              const C = 2 * Math.PI * R;
              const p = interpolate(frame, [80 + i * 8, 125 + i * 8], [0, (m.valor / 18) * 0.9], { ...cl, easing: OUT });
              return (
                <svg key={i} width={320} height={320} style={{ position: "absolute", rotate: "-90deg" }}>
                  <circle cx={160} cy={160} r={R} fill="none" stroke={m.c} strokeOpacity={0.15} strokeWidth={28} />
                  <circle cx={160} cy={160} r={R} fill="none" stroke={m.c} strokeWidth={28} strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} />
                </svg>
              );
            })}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Count to={35} start={80} dur={45} style={{ fontSize: 64, fontWeight: 800, color: K.ink }} />
            </div>
          </div>
          {moral.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, fontSize: 30, fontWeight: 600, opacity: interpolate(frame, [120 + i * 8, 132 + i * 8], [0, 1], cl) }}>
              <span style={{ width: 16, height: 16, borderRadius: "50%", background: m.c }} />
              <span style={{ flex: 1 }}>{m.nome}</span>
              <b style={{ color: m.c }}>{m.valor}</b>
            </div>
          ))}
        </Widget>
      </div>
    </Paper>
  );
};

// =================================================================== 5 · RECONHECIMENTO (660)
const PALAVRAS = [
  { w: "Melhorar.", foto: "img/reconhecimento-log.jpg", c: "#fff", acc: K.neon },
  { w: "Avançar.", video: 19.6, c: "#fff", acc: K.neon },
  { w: "Reconhecer.", foto: "img/reconhecimento-grupo.jpg", c: "#fff", acc: K.yellow },
  { w: "Celebrar.", foto: "img/m-evento-premiacao.jpg", c: "#fff", acc: K.neon },
];
const PalavraFull: React.FC<{ i: number; len: number }> = ({ i, len }) => {
  const frame = useCurrentFrame();
  const p = PALAVRAS[i];
  const t = interpolate(frame, [0, 8], [0, 1], { ...cl, easing: OUT });
  const flash = interpolate(frame, [0, 6], [0.7, 0], cl);
  const lines = new Array(10).fill(0);
  return (
    <AbsoluteFill style={{ background: K.black, overflow: "hidden" }}>
      {p.video !== undefined ? <Footage at={p.video} dim={0.4} /> : null}
      {p.foto ? (
        <AbsoluteFill>
          <Img src={staticFile(p.foto)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(interpolate(frame, [0, len], [1.15, 1.02])) }} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(3,4,3,.8), rgba(3,4,3,.3))" }} />
        </AbsoluteFill>
      ) : null}
      {lines.map((_, k) => (
        <div key={k} style={{ position: "absolute", left: 1560 + k * 22, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,.22)", scale: `1 ${interpolate(frame, [k, k + 10], [0, 1], cl)}`, transformOrigin: i % 2 ? "bottom" : "top" }} />
      ))}
      <div style={{ position: "absolute", left: 130, top: 140, fontFamily: F, fontWeight: 600, fontSize: 28, letterSpacing: "0.3em", color: p.acc }}>0{i + 1} / 04</div>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 130 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 250, letterSpacing: "-0.06em", color: p.c, opacity: t, filter: `blur(${(1 - t) * 18}px)`, translate: `${(1 - t) * 120}px 0`, scale: String(interpolate(frame, [0, len], [1, 1.05])) }}>
          {p.w.slice(0, -1)}
          <span style={{ color: p.acc }}>.</span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
const Trimestral: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = (d: number) => spring({ frame: frame - d, fps: 30, config: { damping: 14 } });
  const qOn = (row: number, q: number) => interpolate(frame, [50 + q * 14 + row * 7, 56 + q * 14 + row * 7], [0, 1], cl);
  return (
    <Paper glow="rgba(88,214,74,.14)">
      <div style={{ position: "absolute", left: 140, top: 80 }}>
        <Eyebrow n="04" t="Reconhecimento" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 140 }}>
        <BlurWords text="Destaques trimestrais" start={4} every={6} size={110} weight={800} align="left" width={1300} accent={[1]} />
        <div style={{ marginTop: 14, width: 820 }}>
          <BlurWords text="A cada trimestre, os melhores projetos são reconhecidos no Gemba." start={20} every={2} size={36} weight={500} color="#454b44" align="left" width={820} />
        </div>
      </div>
      <Widget x={140} y={420} w={820} h={570} dark style={{ scale: String(0.85 + 0.15 * s(30)), opacity: s(30) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Projeto destaque</div>
          <div style={{ fontSize: 24, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,.12)" }}>FY26</div>
        </div>
        {["A3", "Ver e Agir"].map((r, row) => (
          <div key={r} style={{ marginTop: 44 }}>
            <div style={{ fontSize: 30, color: "rgba(255,255,255,.7)", marginBottom: 18, fontWeight: 600 }}>{r}</div>
            <div style={{ display: "flex", gap: 26 }}>
              {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
                const on = qOn(row, i);
                const col = row ? K.yellow : K.neon;
                return (
                  <div key={q} style={{ width: 140, height: 140, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, background: on > 0.5 ? col : "transparent", border: `4px solid ${col}`, color: on > 0.5 ? K.ink : "#fff", scale: String(1 + Math.sin(on * Math.PI) * 0.15) }}>
                    {q}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Widget>
      <div style={{ position: "absolute", left: 1040, top: 330, width: 760, height: 420, borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 10px #fff, 0 40px 90px rgba(0,0,0,.2)", scale: String(s(60)), rotate: "-2deg" }}>
        <Img src={staticFile("img/reconhecimento-dto-solda.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 1180, top: 640, width: 620, height: 360, borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 10px #fff, 0 40px 90px rgba(0,0,0,.2)", scale: String(s(90)), rotate: "3deg" }}>
        <Img src={staticFile("img/reconhecimento-log.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </Paper>
  );
};
export const V6Reconhecimento: React.FC<D> = ({ dur }) => {
  const W0 = 20;
  const WL = 80;
  const B = W0 + 4 * WL; // 340
  return (
    <AbsoluteFill style={{ background: K.black }}>
      <Sequence durationInFrames={W0}>
        <Dark>
          <Dust />
        </Dark>
      </Sequence>
      {PALAVRAS.map((_, i) => (
        <Sequence key={i} from={W0 + i * WL} durationInFrames={WL}>
          <PalavraFull i={i} len={WL} />
        </Sequence>
      ))}
      <Sequence from={W0 + 3 * WL} durationInFrames={WL}>
        <Confetti start={2} count={120} />
      </Sequence>
      <Sequence from={B}>
        <Whip>
          <Trimestral dur={dur - B} />
        </Whip>
      </Sequence>
    </AbsoluteFill>
  );
};

// =================================================================== 6 · FEIRAS E EVENTOS (420)
export const V6Eventos: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const W = 600;
  const EV = EVENTOS.fotos;
  const pan = interpolate(frame, [0, dur], [200, -(EV.length * (W + 30) - 1700)], { ...cl, easing: INOUT });
  return (
    <Dark glow="rgba(88,214,74,.25)">
      <Dust />
      <AbsoluteFill style={{ perspective: 900 }}>
        <div style={{ position: "absolute", left: 110, top: 300, display: "flex", gap: 30, translate: `${pan}px 0` }}>
          {EV.map((src, i) => {
            const cx = 110 + pan + i * (W + 30) + W / 2 - 960;
            const ry = interpolate(cx, [-1100, 0, 1100], [-38, 0, 38], cl);
            return (
              <div key={i} style={{ width: W, height: 560, flexShrink: 0, borderRadius: 34, overflow: "hidden", transform: `rotateY(${ry}deg) translateZ(${-Math.abs(cx) * 0.15}px)`, boxShadow: "0 0 60px rgba(88,214,74,.3)" }}>
                <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Eyebrow n="05" t="Feiras e eventos" dark />
        <BlurWords text="Onde a melhoria contínua acontece junto." start={6} every={4} size={84} color="#fff" accent={[4, 5]} accentColor={K.neon} width={1700} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center", gap: 18, fontFamily: F }}>
        {["Feiras", "Eventos", "Gemba", "Pessoas"].map((t, i) => {
          const o = interpolate(frame, [40 + i * 8, 52 + i * 8], [0, 1], { ...cl, easing: OUT });
          return (
            <div key={t} style={{ fontSize: 30, fontWeight: 700, padding: "12px 30px", borderRadius: 999, background: i % 2 ? "rgba(255,255,255,.12)" : K.neon, color: i % 2 ? "#fff" : K.ink, opacity: o, translate: `0 ${(1 - o) * 20}px` }}>
              {t}
            </div>
          );
        })}
      </div>
    </Dark>
  );
};

// =================================================================== 7 · DEPOIMENTO (600)
export const V6Depoimento: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fr = spring({ frame: frame - 10, fps: 30, config: { damping: 16 } });
  const lower = spring({ frame: frame - 50, fps: 30, config: { damping: 15 } });
  const quote = DEPOIMENTO.frase;
  return (
    <Paper glow="rgba(88,214,74,.15)">
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Eyebrow n="06" t="Palavra do mentor" />
      </div>
      <div style={{ position: "absolute", left: 960 - 680, top: 130, width: 1360, height: 765, borderRadius: 44, background: "#0e100e", overflow: "hidden", scale: String(0.7 + 0.3 * fr), opacity: fr, boxShadow: "0 50px 120px rgba(30,60,30,.3)" }}>
        {DEPOIMENTO.video ? (
          <OffthreadVideo src={staticFile(DEPOIMENTO.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 30, padding: 120 }}>
            <BlurWords text={`“${quote}”`} start={30} every={5} size={84} weight={700} color="#fff" accent={[4]} accentColor={K.neon} width={1100} />
            <div style={{ fontFamily: F, fontSize: 24, letterSpacing: "0.25em", color: "rgba(255,255,255,.4)", marginTop: 30 }}>ESPAÇO PARA O VÍDEO DO DEPOIMENTO</div>
          </AbsoluteFill>
        )}
      </div>
      <div style={{ position: "absolute", left: 960 - 680 + 50, top: 130 + 765 - 150, background: "#fff", borderRadius: 28, padding: "22px 34px", fontFamily: F, boxShadow: "0 20px 50px rgba(0,0,0,.25)", opacity: lower, translate: `${(1 - lower) * -60}px 0` }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", color: K.ink }}>{DEPOIMENTO.nome}</div>
        <div style={{ fontSize: 26, fontWeight: 600, color: K.green }}>{DEPOIMENTO.cargo}</div>
      </div>
    </Paper>
  );
};

// =================================================================== 8 · ENCERRAMENTO (330)
const OITO: { w: string; bg?: string; c: string; at?: number; img?: string }[] = [
  { w: "Estar presente", at: 6.4, c: "#fff" },
  { w: "Educar", bg: K.paper, c: K.ink },
  { w: "Incluir", img: "img/time-selfie.jpg", c: "#fff" },
  { w: "Inspirar", bg: K.green, c: "#fff" },
  { w: "Melhorar", at: 9.6, c: "#fff" },
  { w: "Avançar", bg: K.black, c: K.neon },
  { w: "Reconhecer", img: "img/reconhecimento-grupo.jpg", c: "#fff" },
  { w: "Celebrar", bg: K.yellow, c: K.ink },
];
export const V6Encerramento: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const per = 12; // logo entra no frame 98, junto com a pancada final da trilha
  const mont = 98;
  const i = Math.min(OITO.length - 1, Math.floor(frame / per));
  const it = OITO[i];
  const local = frame - i * per;
  return (
    <AbsoluteFill style={{ background: K.black }}>
      {frame < mont ? (
        <AbsoluteFill style={{ background: it.bg ?? K.black, overflow: "hidden" }}>
          {it.at !== undefined ? (
            <Sequence from={i * per} layout="none">
              <Footage at={it.at} dim={0.35} />
            </Sequence>
          ) : null}
          {it.img ? (
            <AbsoluteFill>
              <Img src={staticFile(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.1 - local * 0.004) }} />
              <AbsoluteFill style={{ background: "rgba(3,4,3,.5)" }} />
            </AbsoluteFill>
          ) : null}
          <AbsoluteFill style={{ ...center }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 210, letterSpacing: "-0.06em", color: it.c, scale: String(interpolate(local, [0, per], [1.12, 1])), filter: `blur(${interpolate(local, [0, 3], [10, 0], cl)}px)` }}>{it.w}.</div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : (
        <Sequence from={mont} layout="none">
          <Final dur={dur - mont} voz={0} />
          <Confetti start={0} count={90} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
