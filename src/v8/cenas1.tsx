import React from "react";
import { AbsoluteFill, interpolate, random, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EDUCAR, EVENTO, PRESENTE } from "../content";
import { C, Chars, cl, Cursor, F, Field, Flash, INOUT, Midia, Morph, OUT, Pill, Pop, Rise, Ring3D, Shot, Sparkle, useL } from "./kit";

export type D = { dur: number };
export type ShotItem = { d: number; enter?: "slam" | "whip" | "zoom" | "up" | "cut"; exit?: "zoom" | "whip" | "cut"; el: (d: number) => React.ReactNode };

/** Sequência de planos cortados na batida. */
export const Shots: React.FC<{ items: ShotItem[] }> = ({ items }) => {
  let t = 0;
  return (
    <AbsoluteFill>
      {items.map((it, i) => {
        const from = t;
        t += it.d;
        return (
          <Sequence key={i} from={from} durationInFrames={it.d}>
            <Shot dur={it.d} enter={it.enter} exit={it.exit}>
              {it.el(it.d)}
            </Shot>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const center: React.CSSProperties = { alignItems: "center", justifyContent: "center" };
/** fundo.mp4 (imagens da fábrica): segundos do arquivo original → quadros */
export const FUNDO = (s: number) => Math.round(s * 30);

// =================================================================== 1 · ABERTURA (360)
const Anel: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const sub = interpolate(frame, [12, 26], [0, 1], { ...cl, easing: OUT });
  return (
    <Field bg={C.black} glow="rgba(107,224,90,.18)">
      <AbsoluteFill style={center}>
        <Ring3D text=" MELHORIA CONTÍNUA ✦ CI200 ✦ JOHN DEERE ✦" radius={V ? 420 : 640} size={V ? 78 : 104} speed={1.5} color={C.white} />
      </AbsoluteFill>
      <AbsoluteFill style={{ ...center, top: V ? 520 : 330 }}>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 30 : 30, letterSpacing: "0.32em", color: C.neon, opacity: sub }}>{EVENTO.unidade.toUpperCase()}</div>
      </AbsoluteFill>
      <Sparkle x={V ? 860 : 1650} y={V ? 360 : 180} size={V ? 160 : 200} color={C.neon} blur={8} drift={[-0.6, 0.4]} />
      <Sparkle x={V ? 200 : 260} y={V ? 1600 : 900} size={V ? 220 : 260} color={C.green} blur={12} drift={[0.5, -0.5]} />
    </Field>
  );
};

const Palavra: React.FC<{ a: string; b?: string; bg: string; color: string; acc?: string; italic?: boolean }> = ({ a, b, bg, color, acc = C.neon, italic }) => {
  const { t } = useL();
  return (
    <Field bg={bg}>
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 0 }}>
        <Pop text={a} size={t(260)} color={color} />
        {b ? <Pop text={b} at={6} size={t(260)} color={acc} italic={italic} weight={italic ? 600 : 800} /> : null}
      </AbsoluteFill>
    </Field>
  );
};

const ANOS = ["2022", "2023", "2024", "2025", "2026", "2027"];
const Anos: React.FC<D> = () => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const size = t(220);
  const step = size * 1.05;
  const pos = interpolate(frame, [0, 36], [0, 4], { ...cl, easing: OUT });
  const lock = interpolate(frame, [36, 44], [0, 1], cl);
  return (
    <Field bg={C.black} glow="rgba(54,124,43,.35)">
      <AbsoluteFill style={center}>
        <div style={{ position: "relative", height: 0, width: 0 }}>
          {ANOS.map((y, i) => {
            const d = i - pos;
            const on = i === 4 ? lock : 0;
            return (
              <div key={y} style={{ position: "absolute", left: 0, top: d * step, translate: "-50% -50%", fontFamily: F, fontWeight: 800, fontSize: size, letterSpacing: "-0.05em", color: on > 0.5 ? C.neon : C.white, opacity: Math.max(0, 1 - Math.abs(d) * 0.62), filter: `blur(${Math.min(12, Math.abs(d) * 7)}px)`, scale: String(1 - Math.min(0.3, Math.abs(d) * 0.18) + on * 0.08) }}>
                {y}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: V ? size * 1.4 : size * 1.5, top: V ? -size * 0.25 : -size * 0.3 }}>
            <Pill at={40} size={V ? 44 : 64} bg={C.yellow}>
              {EVENTO.fiscal}
            </Pill>
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={36} len={8} max={0.35} color={C.neon} />
    </Field>
  );
};

const Titulo: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const zoom = interpolate(frame, [0, dur], [1, 1.06]);
  return (
    <Field bg={C.deep} glow="rgba(107,224,90,.25)">
      <AbsoluteFill style={center}>
        <Morph size={V ? 900 : 860} color={C.green} keys={[[0, 0], [20, 1], [50, 2], [80, 3]]} spin={0.5} />
      </AbsoluteFill>
      <Sparkle x={V ? 180 : 360} y={V ? 520 : 240} size={140} color={C.yellow} blur={4} drift={[0.3, 0.2]} />
      <Sparkle x={V ? 900 : 1600} y={V ? 1450 : 820} size={220} color={C.neon} blur={10} drift={[-0.4, -0.2]} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", scale: String(zoom) }}>
        <Chars text="CI Awards" at={2} every={2} size={t(270)} color={C.white} />
        <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: "center", gap: V ? 30 : 30, marginTop: V ? 30 : 20 }}>
          <Pill at={22} size={V ? 70 : 64} bg={C.yellow} rot={-3}>
            {EVENTO.ano}
          </Pill>
          <Rise text={EVENTO.slogan} at={30} every={2} size={V ? 46 : 42} weight={600} color={C.white} width={V ? 860 : 1000} align={V ? "center" : "left"} accent={[1]} accentColor={C.lime} />
        </div>
      </AbsoluteFill>
      <Flash at={0} len={10} />
    </Field>
  );
};

export const Abertura: React.FC<D> = () => (
  <Shots
    items={[
      { d: 60, exit: "zoom", el: (d) => <Anel dur={d} /> },
      { d: 30, enter: "slam", el: () => <Palavra a="Um" b="ano" bg={C.black} color={C.white} /> },
      { d: 30, enter: "slam", el: () => <Palavra a="de" b="melhoria" bg={C.green} color={C.white} acc={C.lime} italic /> },
      { d: 30, enter: "slam", exit: "zoom", el: () => <Palavra a="contínua." bg={C.yellow} color={C.ink} /> },
      { d: 90, enter: "zoom", exit: "zoom", el: (d) => <Anos dur={d} /> },
      { d: 120, enter: "zoom", el: (d) => <Titulo dur={d} /> },
    ]}
  />
);

// =================================================================== 2 · ESTAR PRESENTE (480)
const Presente0: React.FC = () => {
  const { t } = useL();
  return (
    <Field bg={C.paper}>
      <AbsoluteFill style={{ ...center, flexDirection: "column" }}>
        <Pop text="Estar" size={t(250)} color={C.ink} />
        <Pop text="presente." at={15} size={t(250)} color={C.green} italic weight={700} />
      </AbsoluteFill>
    </Field>
  );
};

const PresenteCards: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, H } = useL();
  const per = 30;
  const idx = Math.min(PRESENTE.cards.length - 1, Math.floor(frame / per));
  const local = frame - idx * per;
  const card = PRESENTE.cards[idx];
  const fr = Math.min(PRESENTE.frases.length - 1, Math.floor(frame / 60));
  const fw = V ? 920 : 1000;
  const cw = V ? 900 : 760;
  const ch = V ? 1000 : 860;
  const pop = interpolate(local, [0, 7], [0, 1], { ...cl, easing: OUT });
  return (
    <Field bg={C.black} glow="rgba(54,124,43,.4)">
      <div style={{ position: "absolute", left: V ? (W - fw) / 2 : 120, top: V ? 140 : 0, height: V ? 520 : H, width: fw, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 30, letterSpacing: "0.3em", color: C.neon, marginBottom: 30, textAlign: V ? "center" : "left" }}>COMO ATUAMOS</div>
        <Sequence from={fr * 60} layout="none" key={fr}>
          <Rise text={PRESENTE.frases[fr] + "."} every={3} size={V ? 110 : 128} color={C.white} align={V ? "center" : "left"} width={fw} accent={[PRESENTE.frases[fr].split(" ").length - 1]} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: V ? (W - cw) / 2 : W - cw - 120, top: V ? 700 : (H - ch) / 2, width: cw, height: ch, borderRadius: 48, overflow: "hidden", rotate: `${(idx % 2 ? 2 : -2) * (1 - pop) + (idx % 2 ? 1.2 : -1.2)}deg`, scale: String(0.9 + 0.1 * pop), boxShadow: "0 40px 120px rgba(0,0,0,.5), 0 0 0 8px rgba(255,255,255,.95)" }}>
        <Sequence from={idx * per} layout="none" key={idx}>
          <Midia src={card.src} dur={per} zoom={[1.18, 1.05]} style={{ width: "100%", height: "100%" }} />
        </Sequence>
        <div style={{ position: "absolute", left: 30, bottom: 30 }}>
          <Pill at={idx * per + 2} size={40} bg={C.neon} rot={0}>
            {card.label}
          </Pill>
        </div>
      </div>
      <div style={{ position: "absolute", left: V ? W / 2 - 90 : W - cw - 120, top: V ? 1760 : (H + ch) / 2 + 30, display: "flex", gap: 12 }}>
        {PRESENTE.cards.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 44 : 14, height: 14, borderRadius: 7, background: i === idx ? C.neon : "rgba(255,255,255,.3)" }} />
        ))}
      </div>
      <Flash at={0} len={6} max={0.4} />
      {dur ? null : null}
    </Field>
  );
};

const ORB = ["No Gemba", "Gestão diária", "Com os times", "Engajando", "Facilitando", "Inovando"];
const Orbita: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { V, W, H } = useL();
  const R = V ? 400 : 380;
  const cx = W / 2;
  const cy = V ? H / 2 + 120 : H / 2 + 60;
  const ring = interpolate(frame, [0, 24], [0, 1], { ...cl, easing: OUT });
  return (
    <Field bg={C.ink} glow="rgba(107,224,90,.2)">
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 200 : 70, display: "flex", justifyContent: "center" }}>
        <Rise text="A melhoria acontece onde as pessoas estão." every={2} size={V ? 70 : 72} color={C.white} width={V ? 900 : 1600} accent={[5, 6]} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.neon} strokeOpacity={0.35} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
        <circle cx={cx} cy={cy} r={R * 0.62} fill="none" stroke={C.white} strokeOpacity={0.12} strokeWidth={2} strokeDasharray="6 12" />
      </svg>
      <div style={{ position: "absolute", left: cx, top: cy }}>
        <div style={{ position: "absolute", translate: "-50% -50%", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Morph size={300} color={C.green} keys={[[0, 0], [60, 2], [120, 1], [dur, 3]]} spin={0.3} style={{ position: "absolute" }} />
          <div style={{ position: "relative", fontFamily: F, fontWeight: 800, fontSize: 110, color: C.white, letterSpacing: "-0.05em", scale: String(ring) }}>CI</div>
        </div>
        {ORB.map((label, i) => {
          const a = ((i / ORB.length) * 360 - 90 + frame * 0.35) * (Math.PI / 180);
          const s = spring({ frame: frame - 12 - i * 7.5, fps, config: { damping: 12, stiffness: 160 } });
          const card = PRESENTE.cards[i];
          return (
            <div key={i} style={{ position: "absolute", left: Math.cos(a) * R, top: Math.sin(a) * R, translate: "-50% -50%", scale: String(s), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: V ? 150 : 130, height: V ? 150 : 130, borderRadius: "50%", overflow: "hidden", boxShadow: `0 0 0 5px ${C.neon}, 0 0 40px rgba(107,224,90,.5)` }}>
                <Midia src={card.src} dur={dur} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: V ? 30 : 26, color: C.ink, background: C.white, padding: "6px 18px", borderRadius: 999, whiteSpace: "nowrap" }}>{label}</div>
            </div>
          );
        })}
      </div>
    </Field>
  );
};

const TodosDias: React.FC<D> = ({ dur }) => {
  const { t } = useL();
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Midia src="vid/fundo.mp4" startFrom={FUNDO(12)} dur={dur} zoom={[1.05, 1.15]} dim={0.45} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ ...center, flexDirection: "column" }}>
        <Pop text="Todos" size={t(230)} color={C.white} />
        <Pop text="os dias." at={8} size={t(230)} color={C.neon} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Presente: React.FC<D> = () => (
  <Shots
    items={[
      { d: 60, enter: "slam", el: () => <Presente0 /> },
      { d: 180, enter: "whip", exit: "zoom", el: (d) => <PresenteCards dur={d} /> },
      { d: 180, enter: "zoom", exit: "whip", el: (d) => <Orbita dur={d} /> },
      { d: 60, enter: "whip", el: (d) => <TodosDias dur={d} /> },
    ]}
  />
);

// =================================================================== 3 · EDUCAR · INCLUIR · INSPIRAR (540)
const Head: React.FC<{ word: string; text: string; color?: string; acc?: string; sub?: string }> = ({ word, text, color = C.white, acc = C.lime, sub = "rgba(255,255,255,.82)" }) => {
  const { V } = useL();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: V ? "center" : "flex-start", gap: 24 }}>
      <Pop text={<>{word}<span style={{ color: acc }}>.</span></>} size={V ? 200 : 210} color={color} from={1.25} />
      <Rise text={text} at={10} every={2} size={V ? 52 : 50} weight={600} color={sub} width={V ? 900 : 760} align={V ? "center" : "left"} />
    </div>
  );
};

const CardItem: React.FC<{ label: string; sub: string; on: number; at: number; icon: string }> = ({ label, sub, on, at, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170 } });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "28px 34px", borderRadius: 36, background: on > 0.5 ? C.ink : C.white, color: on > 0.5 ? C.white : C.ink, boxShadow: on > 0.5 ? `0 0 0 4px ${C.lime}, 0 30px 70px rgba(0,0,0,.35)` : "0 24px 60px rgba(0,0,0,.18)", opacity: s, translate: `0 ${(1 - s) * 80}px`, scale: String(1 + Math.sin(on * Math.PI) * 0.05), fontFamily: F }}>
      <div style={{ width: 84, height: 84, borderRadius: 24, background: on > 0.5 ? C.lime : C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, color: C.ink }}>{on > 0.5 ? "✓" : icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em" }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 500, opacity: 0.65, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};

const Educar: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W } = useL();
  const c1 = 75;
  const c2 = 105;
  const on = (c: number) => interpolate(frame, [c, c + 4], [0, 1], cl);
  const colW = V ? 900 : 780;
  const colX = V ? (W - colW) / 2 : 1020;
  const colY = V ? 760 : 250;
  return (
    <Field bg={C.green} glow="rgba(200,245,74,.25)">
      <div style={{ position: "absolute", left: V ? 0 : 140, right: V ? 0 : undefined, top: V ? 200 : 300, display: "flex", justifyContent: "center" }}>
        <Head word="Educar" text={EDUCAR[0].texto} />
      </div>
      <div style={{ position: "absolute", left: colX, top: colY, width: colW, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ height: V ? 330 : 280, borderRadius: 36, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.3)", opacity: interpolate(frame, [20, 30], [0, 1], cl), scale: String(interpolate(frame, [20, 34], [0.85, 1], { ...cl, easing: OUT })) }}>
          <Midia src={EDUCAR[0].src} dur={dur} style={{ width: "100%", height: "100%" }} />
        </div>
        <CardItem label="Pensamento A3" sub="Problema, causa raiz, contramedida" icon="A3" on={on(c1)} at={30} />
        <CardItem label="Ver e Agir" sub="Enxergar o desperdício e agir" icon="👁" on={on(c2)} at={38} />
      </div>
      <Cursor path={V ? [[44, 900, 1900], [c1 - 4, 760, 1210], [c2 - 6, 760, 1410], [dur, 800, 1480]] : [[44, 1800, 1100], [c1 - 4, 1500, 640], [c2 - 6, 1500, 800], [dur, 1560, 880]]} clicks={[c1, c2]} />
    </Field>
  );
};

const Pessoa: React.FC<{ on: number; size: number }> = ({ on, size }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 40 50" style={{ scale: String(0.9 + on * 0.15) }}>
    <circle cx={20} cy={12} r={9} fill={on > 0.5 ? C.neon : "rgba(255,255,255,.18)"} />
    <path d="M4 48 C4 32 10 25 20 25 C30 25 36 32 36 48 Z" fill={on > 0.5 ? C.neon : "rgba(255,255,255,.18)"} />
  </svg>
);
const Incluir: React.FC<D> = () => {
  const frame = useCurrentFrame();
  const { V, W, H } = useL();
  const cols = V ? 8 : 10;
  const rows = V ? 7 : 6;
  const size = V ? 86 : 70;
  const gx = size * 1.25;
  const gy = size * 1.5;
  const gridW = cols * gx;
  const ox = V ? (W - gridW) / 2 : W - gridW - 130;
  const oy = V ? 820 : (H - rows * gy) / 2 + 20;
  return (
    <Field bg={C.black} glow="rgba(54,124,43,.35)">
      <div style={{ position: "absolute", left: V ? 0 : 140, right: V ? 0 : undefined, top: V ? 220 : 340, display: "flex", justifyContent: "center" }}>
        <Head word="Incluir" text={EDUCAR[1].texto} acc={C.neon} />
      </div>
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const order = random(`p${i}`) * 70 + (c + r) * 1.2;
        const on = interpolate(frame, [20 + order, 24 + order], [0, 1], cl);
        return (
          <div key={i} style={{ position: "absolute", left: ox + c * gx, top: oy + r * gy }}>
            <Pessoa on={on} size={size} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: V ? 0 : ox, right: V ? 0 : undefined, top: V ? oy + rows * gy + 30 : oy + rows * gy + 10, width: V ? undefined : gridW, display: "flex", justifyContent: "center" }}>
        <Pill at={110} size={44} bg={C.neon}>
          Todos. Todas as áreas.
        </Pill>
      </div>
    </Field>
  );
};

const Inspirar: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Midia src={EDUCAR[2].src} dur={dur} zoom={[1.2, 1.04]} dim={0.5} style={{ position: "absolute", inset: 0 }} />
      <AbsoluteFill style={{ background: `linear-gradient(${V ? 0 : 90}deg, rgba(5,6,5,.85), transparent 70%)` }} />
      <div style={{ position: "absolute", left: V ? 0 : 140, right: V ? 0 : undefined, top: V ? 1100 : 360, display: "flex", justifyContent: "center" }}>
        <Head word="Inspirar" text={EDUCAR[2].texto} acc={C.yellow} />
      </div>
      <Sparkle x={V ? 900 : 1700} y={V ? 300 : 200} size={180} color={C.yellow} blur={6} drift={[-0.5, 0.3]} />
      <Flash at={0} len={8} max={0.6} />
      {frame < 0 ? null : null}
    </AbsoluteFill>
  );
};

export const Educa: React.FC<D> = () => (
  <Shots
    items={[
      { d: 180, enter: "whip", exit: "whip", el: (d) => <Educar dur={d} /> },
      { d: 180, enter: "whip", exit: "zoom", el: (d) => <Incluir dur={d} /> },
      { d: 180, enter: "zoom", el: (d) => <Inspirar dur={d} /> },
    ]}
  />
);
export { INOUT };
