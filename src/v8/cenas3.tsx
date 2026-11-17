import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DEPOIMENTO, EVENTO, EVENTOS, RECONHECIMENTO } from "../content";
import { Burst, C, Chars, cl, F, Field, Flash, Midia, Morph, OUT, Pill, Pop, Rise, Ring3D, Sparkle, useL } from "./kit";
import { center, D, FUNDO, Shots } from "./cenas1";

// =================================================================== 5 · RECONHECIMENTO (600)
const PAL = [
  { w: "Melhorar", foto: "img/reconhecimento-log.jpg", acc: C.neon },
  { w: "Avançar", video: 19.6, acc: C.lime },
  { w: "Reconhecer", foto: "img/reconhecimento-grupo.jpg", acc: C.yellow },
  { w: "Celebrar", bg: C.yellow, acc: C.green },
];
const PalavraFoto: React.FC<{ i: number; dur: number }> = ({ i, dur }) => {
  const { t } = useL();
  const p = PAL[i];
  return (
    <AbsoluteFill style={{ background: p.bg ?? C.black }}>
      {p.foto ? <Midia src={p.foto} dur={dur} zoom={[1.2, 1.05]} dim={0.5} style={{ position: "absolute", inset: 0 }} /> : null}
      {p.video !== undefined ? <Midia src="vid/fundo.mp4" startFrom={FUNDO(p.video)} dur={dur} zoom={[1.05, 1.12]} dim={0.45} style={{ position: "absolute", inset: 0 }} /> : null}
      <AbsoluteFill style={center}>
        <Pop text={<>{p.w}<span style={{ color: p.acc }}>.</span></>} size={t(240)} color={p.bg ? C.ink : C.white} from={1.5} />
      </AbsoluteFill>
      {p.bg ? <Burst at={2} n={140} colors={[C.green, C.ink, "#fff", C.neon]} /> : null}
      <Flash at={0} len={6} max={0.7} />
    </AbsoluteFill>
  );
};

/** Linha do tempo Q1–Q4: linha se desenha, cada trimestre acende na batida e solta uma foto. */
const Trimestres: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { V, W, H } = useL();
  const Q = ["Q1", "Q2", "Q3", "Q4"];
  const fotos = [RECONHECIMENTO.fotos[2], RECONHECIMENTO.fotos[0], RECONHECIMENTO.fotos[4], RECONHECIMENTO.fotos[1]];
  const at = (i: number) => 45 + i * 30;
  const line = interpolate(frame, [30, 45 + 3 * 30], [0, 1], cl);
  // horizontal: linha na base; vertical: linha vertical à esquerda
  const pts = Q.map((_, i) => (V ? { x: 170, y: 640 + i * 320 } : { x: 260 + i * 470, y: 820 }));
  return (
    <Field bg={C.paper}>
      <div style={{ position: "absolute", left: V ? 0 : 130, right: V ? 0 : undefined, top: V ? 150 : 90, display: "flex", flexDirection: "column", alignItems: V ? "center" : "flex-start", gap: 16 }}>
        <div style={{ fontFamily: F, fontSize: 28, fontWeight: 600, letterSpacing: "0.3em", color: C.green }}>RECONHECIMENTO</div>
        <Rise text="Destaques trimestrais." every={4} size={V ? 100 : 120} color={C.ink} accent={[1]} accentColor={C.green} align={V ? "center" : "left"} width={V ? 900 : 1400} />
        <Rise text="A cada trimestre, os melhores projetos são reconhecidos no Gemba." at={12} every={1.5} size={V ? 40 : 40} weight={500} color="#4a4f48" align={V ? "center" : "left"} width={V ? 860 : 1100} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={pts[0].x} y1={pts[0].y} x2={pts[3].x} y2={pts[3].y} stroke="#d4d8cf" strokeWidth={10} strokeLinecap="round" />
        <line x1={pts[0].x} y1={pts[0].y} x2={pts[0].x + (pts[3].x - pts[0].x) * line} y2={pts[0].y + (pts[3].y - pts[0].y) * line} stroke={C.green} strokeWidth={10} strokeLinecap="round" />
      </svg>
      {Q.map((q, i) => {
        const on = interpolate(frame, [at(i), at(i) + 4], [0, 1], cl);
        const s = spring({ frame: frame - at(i), fps, config: { damping: 12, stiffness: 170 } });
        const cw = V ? 620 : 380;
        const ch = V ? 250 : 250;
        return (
          <React.Fragment key={q}>
            <div style={{ position: "absolute", left: pts[i].x, top: pts[i].y, translate: "-50% -50%", width: 110, height: 110, borderRadius: "50%", background: on > 0.5 ? C.green : C.paper, border: `6px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 38, color: on > 0.5 ? C.white : C.green, scale: String(1 + Math.sin(on * Math.PI) * 0.25), boxShadow: on > 0.5 ? "0 0 40px rgba(54,124,43,.5)" : undefined }}>{q}</div>
            <div style={{ position: "absolute", left: V ? pts[i].x + 110 : pts[i].x - cw / 2, top: V ? pts[i].y - ch / 2 : pts[i].y - ch - 90, width: cw, height: ch, borderRadius: 30, overflow: "hidden", boxShadow: "0 0 0 6px #fff, 0 30px 70px rgba(0,0,0,.22)", scale: String(s), rotate: `${(i % 2 ? 2 : -2) * s}deg`, opacity: Math.min(1, s * 2) }}>
              <Midia src={fotos[i]} dur={dur} style={{ width: "100%", height: "100%" }} />
              <div style={{ position: "absolute", left: 16, top: 16 }}>
                <Pill at={at(i) + 4} size={26} bg={C.yellow} rot={0}>
                  {i % 2 ? "Ver e Agir" : "A3"}
                </Pill>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </Field>
  );
};

/** Fotos cortadas na batida (8 quadros) com frase fixa por cima. */
const Rajada: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const fotos = RECONHECIMENTO.fotos;
  const per = 15;
  const montage = fotos.length * per; // 105
  const i = Math.min(fotos.length - 1, Math.floor(frame / per));
  if (frame < montage) {
    return (
      <AbsoluteFill style={{ background: C.black }}>
        <Sequence from={i * per} layout="none" key={i}>
          <Midia src={fotos[i]} dur={per} zoom={[1.15, 1.03]} dim={0.55} style={{ position: "absolute", inset: 0 }} />
        </Sequence>
        <AbsoluteFill style={{ ...center, flexDirection: "column" }}>
          <Pop text="Quem faz," size={V ? 150 : 200} color={C.white} />
          <Pop text="é reconhecido." at={30} size={V ? 120 : 200} color={C.neon} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // colagem: todas as fotos numa grade, câmera afastando
  const f = frame - montage;
  const z = interpolate(f, [0, dur - montage], [1.6, 1], { ...cl, easing: OUT });
  const cols = V ? 2 : 4;
  return (
    <Field bg={C.ink}>
      <AbsoluteFill style={{ ...center, scale: String(z) }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${V ? 460 : 420}px)`, gap: 20 }}>
          {[...fotos, "img/time-ci.jpg"].map((src, k) => (
            <div key={k} style={{ height: V ? 400 : 280, borderRadius: 26, overflow: "hidden", opacity: interpolate(f, [k * 2, k * 2 + 6], [0, 1], cl) }}>
              <Midia src={src} dur={dur} style={{ width: "100%", height: "100%" }} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ ...center, background: "rgba(10,11,10,.45)" }}>
        <Pill at={montage + 10} size={V ? 70 : 90} bg={C.yellow} rot={-3}>
          Obrigado, time!
        </Pill>
      </AbsoluteFill>
    </Field>
  );
};

export const Reconhecimento: React.FC<D> = () => (
  <Shots
    items={[
      ...PAL.map((_, i) => ({ d: 30, enter: "slam" as const, el: (d: number) => <PalavraFoto i={i} dur={d} /> })),
      { d: 240, enter: "zoom", exit: "zoom", el: (d) => <Trimestres dur={d} /> },
      { d: 240, enter: "zoom", el: (d) => <Rajada dur={d} /> },
    ]}
  />
);

// =================================================================== 6 · FEIRAS E EVENTOS (360)
const Palavra3: React.FC<{ w: string; bg: string; c: string }> = ({ w, bg, c }) => {
  const { t } = useL();
  return (
    <Field bg={bg}>
      <AbsoluteFill style={center}>
        <Pop text={w} size={t(280)} color={c} />
      </AbsoluteFill>
    </Field>
  );
};

/** Baralho de fotos: cada foto entra girando na batida e empurra a anterior para trás. */
const Baralho: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, W, H } = useL();
  const fotos = EVENTOS.fotos;
  const per = 27;
  const cw = V ? 860 : 1000;
  const ch = V ? 1000 : 640;
  return (
    <Field bg={C.green} glow="rgba(200,245,74,.3)">
      <Sparkle x={V ? 150 : 200} y={V ? 1700 : 900} size={300} color={C.lime} blur={16} drift={[0.3, -0.3]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: V ? 150 : 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: F, fontSize: 28, fontWeight: 600, letterSpacing: "0.3em", color: C.lime }}>FEIRAS E EVENTOS</div>
        <Rise text="Onde a melhoria acontece junto." every={3} size={V ? 80 : 84} color={C.white} width={V ? 900 : 1700} accent={[4]} accentColor={C.yellow} />
      </div>
      {fotos.map((src, i) => {
        const t0 = 10 + i * per;
        const local = frame - t0;
        if (local < 0) return null;
        const inT = interpolate(local, [0, 10], [0, 1], { ...cl, easing: OUT });
        const depth = Math.max(0, (frame - t0) / per - 1); // quantas fotos já vieram por cima
        const back = Math.min(depth, 4);
        const rot = (i % 2 ? 1 : -1) * (6 + (i % 3) * 3);
        return (
          <div key={i} style={{ position: "absolute", left: (W - cw) / 2, top: (V ? 380 : 290) + (V ? 60 : 0), width: cw, height: ch, borderRadius: 40, overflow: "hidden", boxShadow: "0 0 0 10px #fff, 0 40px 100px rgba(0,0,0,.35)", translate: `${(1 - inT) * (i % 2 ? W : -W) * 0.7}px ${back * -14}px`, rotate: `${rot * (1 - inT) * 3 + rot * 0.3}deg`, scale: String(1 - back * 0.05), filter: back > 0 ? `brightness(${1 - back * 0.15})` : undefined, opacity: depth > 4 ? 0 : 1 }}>
            <Midia src={src} dur={per * 4} style={{ width: "100%", height: "100%" }} />
          </div>
        );
      })}
      {H ? null : null}
      {dur ? null : null}
    </Field>
  );
};

export const Eventos: React.FC<D> = () => (
  <Shots
    items={[
      { d: 20, enter: "slam", el: () => <Palavra3 w="Feiras." bg={C.black} c={C.white} /> },
      { d: 20, enter: "slam", el: () => <Palavra3 w="Eventos." bg={C.yellow} c={C.ink} /> },
      { d: 20, enter: "slam", el: () => <Palavra3 w="Gemba." bg={C.paper} c={C.green} /> },
      { d: 240, enter: "zoom", exit: "zoom", el: (d) => <Baralho dur={d} /> },
      { d: 60, enter: "zoom", el: () => <Palavra3 w="Pessoas." bg={C.black} c={C.neon} /> },
    ]}
  />
);

// =================================================================== 7 · DEPOIMENTO (300)
export const Depoimento: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { V } = useL();
  const words = `“${DEPOIMENTO.frase}”`.split(" ");
  const lower = spring({ frame: frame - 150, fps, config: { damping: 15 } });
  if (DEPOIMENTO.video) {
    return (
      <AbsoluteFill style={{ background: C.black }}>
        <Midia src={DEPOIMENTO.video} dur={dur} zoom={[1, 1]} style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", left: 80, bottom: V ? 260 : 90, background: C.white, borderRadius: 26, padding: "20px 34px", fontFamily: F, opacity: lower, translate: `${(1 - lower) * -60}px 0` }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: C.ink }}>{DEPOIMENTO.nome}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.green }}>{DEPOIMENTO.cargo}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <Field bg={C.ink} glow="rgba(107,224,90,.15)">
      <AbsoluteFill style={center}>
        <Morph size={V ? 900 : 900} color="rgba(107,224,90,.08)" keys={[[0, 3], [dur, 3]]} spin={0.2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 50 }}>
        <div style={{ fontFamily: F, fontSize: 28, fontWeight: 600, letterSpacing: "0.3em", color: C.neon }}>PALAVRA DO MENTOR</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: V ? 28 : 40, rowGap: 10, width: V ? 940 : 1600 }}>
          {words.map((w, i) => (
            <Pop key={i} text={w} at={10 + i * 15} size={V ? 120 : 140} color={i === words.length - 1 ? C.neon : C.white} from={1.6} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: lower, translate: `0 ${(1 - lower) * 40}px`, fontFamily: F }}>
          <div style={{ width: 80, height: 4, background: C.neon }} />
          <div>
            <div style={{ fontSize: 50, fontWeight: 800, color: C.white }}>{DEPOIMENTO.nome}</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,.6)" }}>{DEPOIMENTO.cargo}</div>
          </div>
        </div>
      </AbsoluteFill>
    </Field>
  );
};

// =================================================================== 8 · ENCERRAMENTO (420)
const OITO: { w: string; bg?: string; c: string; at?: number; img?: string }[] = [
  { w: "Estar presente", at: 6.4, c: "#fff" },
  { w: "Educar", bg: C.paper, c: C.ink },
  { w: "Incluir", img: "img/time-selfie.jpg", c: "#fff" },
  { w: "Inspirar", bg: C.green, c: "#fff" },
  { w: "Melhorar", at: 9.6, c: "#fff" },
  { w: "Avançar", bg: C.black, c: C.neon },
  { w: "Reconhecer", img: "img/reconhecimento-grupo.jpg", c: "#fff" },
  { w: "Celebrar", bg: C.yellow, c: C.ink },
];
const Oito: React.FC = () => {
  const frame = useCurrentFrame();
  const { t } = useL();
  const per = 15;
  const i = Math.min(OITO.length - 1, Math.floor(frame / per));
  const it = OITO[i];
  return (
    <AbsoluteFill style={{ background: it.bg ?? C.black }}>
      <Sequence from={i * per} layout="none" key={i}>
        {it.at !== undefined ? <Midia src="vid/fundo.mp4" startFrom={FUNDO(it.at)} dur={per} dim={0.4} style={{ position: "absolute", inset: 0 }} /> : null}
        {it.img ? <Midia src={it.img} dur={per} zoom={[1.15, 1.05]} dim={0.45} style={{ position: "absolute", inset: 0 }} /> : null}
        <AbsoluteFill style={center}>
          <Pop text={`${it.w}.`} size={t(200)} color={it.c} from={1.3} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const Final: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V, t } = useL();
  const out = interpolate(frame, [dur - 25, dur], [0, 1], cl);
  const sub = interpolate(frame, [40, 52], [0, 1], { ...cl, easing: OUT });
  return (
    <Field bg={C.black} glow="rgba(54,124,43,.45)">
      <AbsoluteFill style={{ ...center, opacity: 0.35 }}>
        <Ring3D text=" ESTAR PRESENTE ✦ EDUCAR ✦ INCLUIR ✦ INSPIRAR ✦ MELHORAR ✦ CELEBRAR ✦" radius={V ? 470 : 760} size={V ? 46 : 54} speed={0.5} color={C.neon} tilt={-16} />
      </AbsoluteFill>
      <AbsoluteFill style={center}>
        <Morph size={V ? 760 : 700} color={C.green} keys={[[0, 1], [40, 0], [90, 2], [dur, 3]]} spin={0.4} />
      </AbsoluteFill>
      <Sparkle x={V ? 860 : 1500} y={V ? 520 : 260} size={140} color={C.yellow} blur={3} drift={[-0.2, 0.1]} />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 24 }}>
        <Chars text="CI Awards" at={4} every={2.5} size={t(260)} color={C.white} />
        <Pill at={24} size={V ? 80 : 76} bg={C.yellow} rot={-3}>
          {EVENTO.ano}
        </Pill>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: V ? 32 : 34, letterSpacing: "0.3em", color: "rgba(255,255,255,.75)", opacity: sub, marginTop: 20 }}>{EVENTO.unidade.toUpperCase()}</div>
      </AbsoluteFill>
      <Burst at={0} n={160} />
      <Flash at={0} len={10} />
      <AbsoluteFill style={{ background: C.black, opacity: out }} />
    </Field>
  );
};

export const Encerramento: React.FC<D> = () => (
  <Shots
    items={[
      { d: 120, el: () => <Oito /> },
      { d: 300, enter: "zoom", el: (d) => <Final dur={d} /> },
    ]}
  />
);
