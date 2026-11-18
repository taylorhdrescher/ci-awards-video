import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DEPOIMENTO, DETALHE, EDUCAR, EVENTO, EVENTOS, PILARES, PRESENTE, RECONHECIMENTO, TOTAL_ANDAMENTO, TOTAL_CONCLUIDOS } from "../content";
import { Arrow, At, Cam, Chip, cl, Count, Dot, F, Focus, fmtBR, Key, Label, Mark, Midia, OUT, Panel, Ring, SendButton, Sfx, Thumb, Typed, TypeSfx, U, useL, Void, WhiteButton } from "./ui";

export type D = { dur: number };
const FUNDO = (s: number) => Math.round(s * 30 * (5 / 3)); // segundos do fundo.mp4 → quadro do fundo-lento.mp4
const TOT = TOTAL_CONCLUIDOS + TOTAL_ANDAMENTO;
const row: React.CSSProperties = { display: "flex", alignItems: "center" };
const Chevron = () => <span style={{ fontSize: "0.7em", color: U.dim, marginLeft: 8 }}>⌄</span>;

// =================================================================== 1 · ABERTURA (300) — barra de navegação → marca → janela do projeto
const Nav: React.FC = () => {
  const { V } = useL();
  const items = V ? ["Presente", "Resultados", "Prêmios"] : ["Estar presente", "Resultados", "Reconhecimento"];
  return (
    <div style={{ ...row, gap: V ? 34 : 44, padding: "24px 40px", borderRadius: 26, background: "#0c0c0c", border: `1.5px solid ${U.line}`, boxShadow: "0 30px 90px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.06)", fontFamily: F, fontSize: 30, color: "#cfcfcf", whiteSpace: "nowrap" }}>
      <Mark h={46} glow={0.3} />
      {items.map((t, i) => (
        <span key={t} style={{ color: i === 0 ? U.text : "#bdbdbd" }}>
          {t}
          {i < 2 ? <Chevron /> : null}
        </span>
      ))}
    </div>
  );
};

const JanelaTitulo: React.FC<{ dur: number }> = ({ dur }) => {
  const { V } = useL();
  const w = V ? 960 : 1300;
  const pw = V ? 880 : 600;
  const ph = V ? 520 : 360;
  const field = (k: string, v: React.ReactNode, at: number) => (
    <Focus at={at} key={k}>
      <Label size={20} color={U.dim}>{k}</Label>
      <div style={{ fontSize: 28, color: U.text, marginTop: 6 }}>{v}</div>
    </Focus>
  );
  return (
    <Panel w={w} pad={48}>
      <div style={{ ...row, gap: 30 }}>
        <Mark h={78} glow={0.6} />
        <div style={{ fontSize: V ? 66 : 76, fontWeight: 500, letterSpacing: "-0.035em" }}>CI Awards {EVENTO.ano}</div>
        <div style={{ flex: 1 }} />
        <span style={{ color: U.dim, fontSize: 30 }}>···</span>
      </div>
      <Label size={26} style={{ marginTop: 12 }}>ci-awards.montenegro · {EVENTO.fiscal}</Label>
      <div style={{ height: 1.5, background: U.line, margin: "30px 0" }} />
      <div style={{ ...row, justifyContent: "space-between", marginBottom: 26 }}>
        <div style={{ fontSize: 28, fontWeight: 500 }}>Programa de Melhoria Contínua</div>
        <div style={{ ...row, gap: 12, fontSize: 24, color: U.muted }}>
          <Dot /> Ao vivo
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: V ? "column" : "row", gap: 40 }}>
        <div style={{ width: pw, height: ph, borderRadius: 16, overflow: "hidden", position: "relative", border: `1.5px solid ${U.line}`, flexShrink: 0 }}>
          <OffthreadVideo src={staticFile("teste/entrada-bandeiras-lenta.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.75) brightness(.7)" }} />
          <div style={{ position: "absolute", left: 30, bottom: 28 }}>
            <Label size={18} color="rgba(255,255,255,.7)" style={{ letterSpacing: "0.2em" }}>EDIÇÃO {EVENTO.ano}</Label>
            <div style={{ fontSize: V ? 54 : 48, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 8 }}>
              O Oscar da
              <br />
              Melhoria Contínua.
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: V ? "1fr 1fr" : "1fr", gap: V ? 30 : 26, flex: 1 }}>
          {field("Unidade", "John Deere Montenegro", 70)}
          {field("Programa", "CI200 · Continuous Improvement", 78)}
          {field("Período", EVENTO.fiscal, 86)}
          {field("Status", <span style={{ ...row, gap: 12 }}><Dot /> Em andamento</span>, 94)}
        </div>
      </div>
      {dur ? null : null}
    </Panel>
  );
};

export const Abertura: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const markGlow = interpolate(frame, [96, 150], [0.3, 1.4], cl);
  const navKeys: Key[] = V
    ? [[0, 0, 0, 0.85, 16, 0], [40, 0, 0, 1.0, 6, 0], [62, -150, 0, 2.6, 0, -8], [84, -150, 0, 2.8, 0, -5], [104, -330, 0, 4.4, 0, 4]]
    : [[0, 0, 0, 0.9, 16, 0], [40, 0, 0, 1.08, 6, 0], [62, -150, 0, 2.6, 0, -8], [84, -150, 0, 2.85, 0, -5], [104, -370, 0, 4.6, 0, 4]];
  const tKeys: Key[] = V
    ? [[0, -170, -560, 2.3, 0, -6], [60, -140, -560, 2.05, 0, -3], [100, 0, 0, 1.0, 6, 6], [dur - 150, 0, 0, 0.96, 3, -4]]
    : [[0, -300, -300, 2.5, 0, -8], [60, -260, -300, 2.25, 0, -4], [100, 0, 0, 0.98, 6, 7], [dur - 150, 0, 0, 0.94, 3, -5]];
  return (
    <Void>
      <Sequence durationInFrames={110}>
        <Focus fill at={0} out={94} len={18}>
          <AbsoluteFill>
            <Cam keys={navKeys}>
              <At x={0} y={0}>
                <Nav />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
      </Sequence>
      <Sequence from={96} durationInFrames={56}>
        <Focus fill at={0} len={14}>
          <AbsoluteFill>
            <Cam keys={[[0, 0, 0, 1.7], [40, 0, 0, 1.25], [48, 0, 0, 1.35], [54, 0, 0, 5.5]]} dof={4}>
              <At x={0} y={0}>
                <Mark h={V ? 300 : 320} glow={markGlow} />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
      </Sequence>
      <Sequence from={150}>
        <Focus fill at={0} len={16}>
          <AbsoluteFill>
            <Cam keys={tKeys} focus={[[0, 14], [14, 0]]}>
              <At x={0} y={0}>
                <JanelaTitulo dur={dur - 150} />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [150, 151, 162], [0.9, 0.9, 0], cl), pointerEvents: "none" }} />
      </Sequence>
      <Sfx at={60} src="switch_006" volume={0.3} />
      <Sfx at={150} src="impactSoft_heavy_001" volume={0.5} />
    </Void>
  );
};

// =================================================================== 2 · ESTAR PRESENTE (660)
const SEG = [
  { at: 12.0, tab: 0, frase: "No chão de fábrica." },
  { at: 23.4, tab: 1, frase: "Ao lado das pessoas." },
  { at: 29.6, tab: 2, frase: "Nos resultados." },
];
const Preview: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const per = 76;
  const k = Math.min(2, Math.floor(frame / per));
  const w = V ? 960 : 1360;
  const vh = V ? 980 : 560;
  return (
    <Panel w={w} pad={30}>
      <div style={{ ...row, gap: 14, marginBottom: 24 }}>
        {["Gemba", "Pessoas", "Resultados"].map((t, i) => (
          <div key={t} style={{ padding: "10px 22px", borderRadius: 12, fontSize: 26, background: i === k ? "#1c1c1c" : "transparent", color: i === k ? U.text : U.muted, border: `1.5px solid ${i === k ? "#333" : "transparent"}` }}>{t}</div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ ...row, gap: 12, fontSize: 24, color: U.muted }}>
          <Dot /> Presente
        </div>
      </div>
      <div style={{ position: "relative", height: vh, borderRadius: 16, overflow: "hidden", border: `1.5px solid ${U.line}` }}>
        {SEG.map((s, i) => (
          <Sequence key={i} from={i * per} durationInFrames={i === 2 ? dur - 2 * per : per + 12} layout="none">
            <Focus at={0} out={i === 2 ? undefined : per - 2} len={12} style={{ position: "absolute", inset: 0 }}>
              <Midia src="vid/fundo-lento.mp4" startFrom={FUNDO(s.at)} dur={per} zoom={[1.1, 1.02]} style={{ position: "absolute", inset: 0, filter: "saturate(.75) brightness(.72)" }} />
              <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,.75))" }} />
              <div style={{ position: "absolute", left: 44, bottom: 40 }}>
                <Label size={20} color="rgba(255,255,255,.65)" style={{ letterSpacing: "0.22em" }}>COMO ATUAMOS · 0{i + 1}</Label>
                <div style={{ fontSize: V ? 76 : 86, fontWeight: 500, letterSpacing: "-0.035em", marginTop: 10, color: U.text }}>
                  <Typed text={s.frase} at={6} speed={1.4} until={per - 6} />
                </div>
              </div>
            </Focus>
          </Sequence>
        ))}
      </div>
      <div style={{ ...row, gap: 30, marginTop: 24, fontSize: 22, color: U.muted }}>
        <span>Estar presente</span>
        <span style={{ color: U.dim }}>·</span>
        <span>John Deere Montenegro</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontVariantNumeric: "tabular-nums" }}>0{k + 1} / 03</span>
      </div>
    </Panel>
  );
};

const Lista: React.FC<{ title: string; sub: string; items: { src: string; label: string; sub: string; status: string }[]; at?: number; w: number; rowH?: number; thumb?: [number, number]; dur: number }> = ({ title, sub, items, at = 0, w, rowH = 118, thumb = [150, 92], dur }) => (
  <Panel w={w} pad={0}>
    <div style={{ padding: "34px 40px 26px" }}>
      <div style={{ fontSize: 44, fontWeight: 500, letterSpacing: "-0.03em" }}>{title}</div>
      <Label size={24} style={{ marginTop: 8 }}>{sub}</Label>
    </div>
    {items.map((it, i) => (
      <Focus key={i} at={at + 6 + i * 8} rise={20}>
        <div style={{ ...row, gap: 28, height: rowH, padding: "0 40px", borderTop: `1.5px solid ${U.line}` }}>
          <Thumb src={it.src} w={thumb[0]} h={thumb[1]} dur={dur} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{it.label}</div>
            <Label size={22} style={{ marginTop: 4, whiteSpace: "nowrap" }}>{it.sub}</Label>
          </div>
          <div style={{ ...row, gap: 12, fontSize: 22, color: U.muted, whiteSpace: "nowrap" }}>
            <Dot size={9} /> {it.status}
          </div>
        </div>
      </Focus>
    ))}
  </Panel>
);

const Declaracao: React.FC<{ dur: number }> = ({ dur }) => {
  const { V } = useL();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44, fontFamily: F, color: U.text }}>
      <div style={{ fontSize: V ? 130 : 170, fontWeight: 500, letterSpacing: "-0.05em" }}>
        <Typed text="Estar presente" at={4} speed={2} until={dur - 30} />
        <span style={{ color: U.green, textShadow: `0 0 30px ${U.greenGlow}` }}>.</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: V ? 900 : 1500 }}>
        {PRESENTE.frases.map((f, i) => (
          <Focus key={f} at={60 + i * 10}>
            <Chip size={30} active={i === 2 ? 1 : 0}>{f}</Chip>
          </Focus>
        ))}
      </div>
    </div>
  );
};

export const Presente: React.FC<D> = ({ dur }) => {
  const { V } = useL();
  const A = 230;
  const B = 440;
  const aKeys: Key[] = V
    ? [[0, -150, 420, 2.1, 0, -6], [60, -120, 420, 1.95, 0, -3], [82, -260, -560, 2.6], [100, -150, 420, 2.0], [140, -120, 420, 1.9], [158, 120, -560, 2.6], [176, -150, 420, 2.0], [208, 0, 0, 1.0, 6, 6], [A, 0, 0, 0.98]]
    : [[0, -330, 200, 2.3, 0, -7], [60, -290, 200, 2.15, 0, -3], [82, -440, -310, 2.7], [100, -330, 200, 2.15], [140, -290, 200, 2.05], [158, -280, -310, 2.7], [176, -330, 200, 2.1], [208, 0, 0, 1.0, 6, 6], [A, 0, 0, 0.98]];
  const items = PRESENTE.cards.map((c) => ({ src: c.src, label: c.label, sub: "Montenegro · " + EVENTO.fiscal, status: "Ativo" }));
  const n = items.length;
  const top = -(140 + n * 118) / 2;
  const yRow = (i: number) => top + 140 + i * 118 + 59;
  const bKeys: Key[] = [[0, 0, top + 70, 2.0, 10, 0], [40, 0, yRow(0), 1.8, 6, -4], [80, 0, yRow(2), 1.8, 4, 4], [120, 0, yRow(4), 1.8, 4, -4], [160, 0, 0, 1.0, 8, 6], [B - A, 0, 0, 0.96, 4, -4]];
  return (
    <Void>
      <Sequence durationInFrames={A + 10}>
        <Focus fill out={A - 4} len={14}>
          <AbsoluteFill>
            <Cam keys={aKeys}>
              <At x={0} y={0}>
                <Preview dur={A} />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
      </Sequence>
      <Sequence from={A} durationInFrames={B - A + 10}>
        <Focus fill at={0} out={B - A - 4} len={14}>
          <AbsoluteFill>
            <Cam keys={bKeys}>
              <At x={0} y={0}>
                <Lista title="Onde estamos" sub="Seis frentes de presença no dia a dia" items={items} w={V ? 960 : 1100} dur={B - A} />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
      </Sequence>
      <Sequence from={B}>
        <Focus fill at={0} out={dur - B - 14} len={14}>
          <AbsoluteFill>
            <Cam keys={[[0, -200, -40, 1.9, 0, -6], [100, 0, 0, 1.15, 0, 0], [140, 0, 40, 1.0, 4, 4], [dur - B, 0, 40, 0.95, 2, -3]]}>
              <At x={0} y={0}>
                <Declaracao dur={dur - B} />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
        <TypeSfx at={4} chars={14} speed={2} />
      </Sequence>
      {SEG.map((s, i) => (
        <TypeSfx key={i} at={i * 76 + 6} chars={s.frase.length} speed={1.4} volume={0.12} />
      ))}
      <Sfx at={208} src="maximize_006" volume={0.25} />
    </Void>
  );
};

// =================================================================== 3 · EDUCAR · INCLUIR · INSPIRAR (570)
const PROMPT = "Formar, incluir e inspirar pessoas.";
const Prompt: React.FC<{ press: number }> = ({ press }) => {
  const { V } = useL();
  const w = V ? 960 : 1180;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, fontFamily: F, color: U.text }}>
      <div style={{ fontSize: V ? 54 : 58, fontWeight: 500, letterSpacing: "-0.03em" }}>O que vamos melhorar hoje?</div>
      <Panel w={w} h={250} pad={34}>
        <div style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
          <Typed text={PROMPT} at={56} speed={1.5} until={168} />
        </div>
        <div style={{ position: "absolute", left: 34, bottom: 30, ...row, gap: 14, fontSize: 26, color: U.muted }}>
          <span style={{ width: 26, height: 26, border: `2px solid ${U.muted}`, borderRadius: 6, display: "inline-block" }} />
          CI200
          <Chevron />
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 26 }}>
          <SendButton size={64} press={press} />
        </div>
      </Panel>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: w }}>
        {["Educar", "Incluir", "Inspirar", "Pensamento A3", "Ver e Agir"].map((c, i) => (
          <Chip key={c} size={26} icon={<span style={{ fontSize: 22 }}>{["◎", "◌", "✦", "▣", "◉"][i]}</span>}>
            {c}
          </Chip>
        ))}
      </div>
    </div>
  );
};

const Resultado: React.FC<{ i: number; dur: number }> = ({ i, dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const e = EDUCAR[i];
  const w = V ? 960 : 1400;
  const mw = V ? 880 : 640;
  const mh = V ? 640 : 560;
  const AV = ["img/reconhecimento-grupo.jpg", "img/time-selfie.jpg", "img/reconhecimento-dupla.jpg", "img/estande-apresentacao.jpg", "img/reconhecimento-log.jpg", "img/m-evento-plateia.jpg", "img/reconhecimento-dto-solda.jpg"];
  const tags = [["Pensamento A3", "Ver e Agir"], ["Todas as áreas", "Todos os turnos"], ["Time CI", "Todos os dias"]][i];
  const media =
    i === 1 ? (
      <div style={{ width: mw, height: mh, borderRadius: 16, border: `1.5px solid ${U.line}`, background: "#0e0e0e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ ...row }}>
          {AV.map((src, k) => (
            <Focus key={k} at={10 + k * 4} style={{ marginLeft: k ? -34 : 0 }}>
              <div style={{ width: V ? 128 : 112, height: V ? 128 : 112, borderRadius: "50%", overflow: "hidden", border: "4px solid #0e0e0e" }}>
                <Midia src={src} dur={dur} style={{ width: "100%", height: "100%", filter: "saturate(.75)" }} />
              </div>
            </Focus>
          ))}
        </div>
        <Focus at={44}>
          <Chip size={30} active={1} icon={<Dot size={10} />}>
            + todos
          </Chip>
        </Focus>
      </div>
    ) : (
      <Thumb src={e.src} w={mw} h={mh} r={16} dur={dur} />
    );
  return (
    <Panel w={w} pad={40}>
      <div style={{ display: "flex", flexDirection: V ? "column" : "row", gap: 48 }}>
        {media}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Label size={22} style={{ letterSpacing: "0.18em" }}>RESULTADO 0{i + 1} / 03</Label>
          <div style={{ fontSize: V ? 120 : 130, fontWeight: 500, letterSpacing: "-0.05em", marginTop: 12 }}>
            {e.palavra}
            <span style={{ color: U.green, textShadow: `0 0 26px ${U.greenGlow}` }}>.</span>
          </div>
          <Focus at={18}>
            <div style={{ fontSize: 36, color: "#bdbdbd", lineHeight: 1.35, marginTop: 16, letterSpacing: "-0.015em" }}>{e.texto}</div>
          </Focus>
          <div style={{ ...row, gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            {tags.map((t, k) => (
              <Focus key={t} at={30 + k * 6}>
                <Chip size={24}>{t}</Chip>
              </Focus>
            ))}
          </div>
          {i === 2 ? (
            <Focus at={70} style={{ marginTop: 44 }}>
              <WhiteButton size={40} press={interpolate(frame, [104, 108, 114], [0, 1, 0], cl)}>
                Ver o time <Arrow size={34} />
              </WhiteButton>
            </Focus>
          ) : null}
        </div>
      </div>
    </Panel>
  );
};

export const Educa: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const A = 170;
  const per = Math.floor((dur - A) / 3);
  const bx = V ? 418 : 528;
  const by = V ? 26 : 26;
  const press = interpolate(frame, [146, 150, 158], [0, 1, 0], cl);
  const pKeys: Key[] = [[0, bx, by, 3.6, 0, -10], [36, bx - 40, by, 3.2, 0, -6], [64, 0, 0, 1.0, 8, 4], [80, -260, 20, 1.75, 0, -4], [124, 40, 20, 1.75, 0, 3], [140, bx, by, 2.6], [158, bx, by, 2.4], [A, bx, by, 7]];
  return (
    <Void>
      <Sequence durationInFrames={A}>
        <AbsoluteFill>
          <Cam keys={pKeys}>
            <At x={0} y={-30}>
              <Prompt press={press} />
            </At>
          </Cam>
        </AbsoluteFill>
        <TypeSfx at={56} chars={PROMPT.length} speed={1.5} volume={0.14} />
        <Sfx at={150} src="click_004" volume={0.6} />
      </Sequence>
      {[0, 1, 2].map((i) => {
        const from = A + i * per;
        const d = i === 2 ? dur - from : per;
        const k: Key[] = V
          ? [[0, 0, 180, 2.0, 0, -6], [50, 0, 160, 1.85, 0, -2], [80, 0, 0, 0.98, 6, 5], [d, 0, 0, 0.95, 3, -4]]
          : [[0, 330, -60, 2.0, 0, -6], [50, 330, -40, 1.85, 0, -2], [80, 0, 0, 0.98, 6, 5], [d, 0, 0, 0.95, 3, -4]];
        if (i === 2) k.splice(3, 0, [96, V ? -150 : 160, V ? 520 : 250, 2.0], [116, V ? -150 : 160, V ? 520 : 250, 2.0]);
        return (
          <Sequence key={i} from={from} durationInFrames={d + 8}>
            <Focus fill at={0} out={i === 2 ? d - 16 : d - 6} len={14}>
              <AbsoluteFill>
                <Cam keys={k} focus={[[0, 10], [12, 0]]}>
                  <At x={0} y={0}>
                    <Resultado i={i} dur={d} />
                  </At>
                </Cam>
              </AbsoluteFill>
            </Focus>
            {i === 2 ? <Sfx at={106} src="click_002" volume={0.6} /> : null}
          </Sequence>
        );
      })}
    </Void>
  );
};

// =================================================================== 4a · TOTAIS (270) — sinos: 35 (60), 55 (60), 110 (40)
export const Totais: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const rx = V ? 0 : -300;
  const ry = V ? -170 : 30;
  const dotIn = interpolate(frame, [4, 24], [0, 1], { ...cl, easing: OUT });
  const keys: Key[] = [[0, rx, ry, 2.4, 0, 0], [90, rx, ry, 1.75, 0, -4], [124, 0, 0, 1.0, 6, -5], [dur, 30, 0, 0.95, 2, 4]];
  return (
    <Void glow={`rgba(94,227,154,${0.06 + 0.1 * dotIn})`}>
      <Cam keys={keys} focus={[[0, 20], [24, 0]]}>
        <At x={0} y={0}>
          <Panel w={V ? 940 : 1260} pad={52} style={{ background: "linear-gradient(180deg, rgba(16,16,16,.9), rgba(10,10,10,.9))" }}>
            <div style={{ display: "flex", flexDirection: V ? "column" : "row", alignItems: V ? "center" : "center", gap: V ? 60 : 90 }}>
              <div style={{ flexShrink: 0 }}>
                <Ring size={V ? 520 : 480} value={TOTAL_CONCLUIDOS / TOT} at={35} dur={60}>
                  <div style={{ textAlign: "center" }}>
                    <Count to={TOTAL_CONCLUIDOS} at={35} dur={60} style={{ fontSize: 108, fontWeight: 500, letterSpacing: "-0.04em" }} />
                    <Label size={24} style={{ marginTop: 6 }}>concluídos</Label>
                    <div style={{ marginTop: 14, fontSize: 24, color: U.muted, opacity: interpolate(frame, [52, 62], [0, 1], cl) }}>
                      + <Count to={TOTAL_ANDAMENTO} at={55} dur={60} style={{ color: U.text }} /> em andamento
                    </div>
                  </div>
                </Ring>
              </div>
              <div style={{ textAlign: V ? "center" : "left" }}>
                <Focus at={96}>
                  <Label size={24}>{EVENTO.fiscal} · Montenegro</Label>
                  <div style={{ fontSize: 46, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 8 }}>Projetos de melhoria</div>
                </Focus>
                <Focus at={106}>
                  <div style={{ fontSize: 150, fontWeight: 500, letterSpacing: "-0.055em", lineHeight: 1.05, marginTop: 20 }}>
                    <Count to={TOT} at={110} dur={40} />
                  </div>
                </Focus>
                <Focus at={128}>
                  <div style={{ ...row, gap: 14, justifyContent: V ? "center" : "flex-start", fontSize: 30, marginTop: 10 }}>
                    <Dot /> {Math.round((TOTAL_CONCLUIDOS / TOT) * 100)}% concluídos
                  </div>
                  <Label size={26} style={{ marginTop: 26, lineHeight: 1.45, maxWidth: 560 }}>
                    Mais de {fmtBR(Math.floor(TOTAL_CONCLUIDOS / 1000))} mil projetos entregues por quem faz a fábrica acontecer.
                  </Label>
                </Focus>
              </div>
            </div>
          </Panel>
        </At>
      </Cam>
    </Void>
  );
};

// =================================================================== 4b · PILARES (480) — contadores em 20 + 12i (55)
export const Pilares: React.FC<D> = ({ dur }) => {
  const { V } = useL();
  const w = V ? 960 : 1300;
  const rh = V ? 168 : 116;
  const head = 150;
  const top = -(head + PILARES.length * rh + 30) / 2;
  const y = (i: number) => top + head + i * rh + rh / 2;
  const keys: Key[] = [[0, -120, top + 120, 2.0, 8, -4], [100, 0, 0, 1.0, 10, -6], [170, 0, 0, 0.98, 6, 4]];
  PILARES.forEach((_, i) => keys.push([200 + i * 42, V ? -60 : -150, y(i), 1.85, 0, i % 2 ? 4 : -4]));
  keys.push([450, 0, 0, 1.0, 6, 6], [dur, 0, 0, 0.96, 4, -3]);
  return (
    <Void>
      <Cam keys={keys}>
        <At x={0} y={0}>
          <Panel w={w} pad={0}>
            <div style={{ height: head, padding: "36px 44px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 46, fontWeight: 500, letterSpacing: "-0.03em" }}>Resultados por pilar</div>
              <Label size={24} style={{ marginTop: 8 }}>{EVENTO.fiscal} · seis pilares · concluídos e em andamento</Label>
            </div>
            {PILARES.map((p, i) => {
              const at = 20 + 12 * i;
              const tot = p.concluidos + p.andamento;
              const unit = [p.sufixo.trim(), p.unidade].filter(Boolean).join(" ");
              return (
                <Focus key={p.nome} at={at - 6} rise={16}>
                  <div style={{ ...row, height: rh, padding: "0 44px", gap: 30, borderTop: `1.5px solid ${U.line}` }}>
                    <Ring size={70} value={p.concluidos / tot} at={at} dur={55} stroke={6} glow={0.6}>
                      <span style={{ fontSize: 22, color: U.muted }}>{p.letra.length === 1 ? p.letra : p.letra === "leaf" ? "♣" : "♥"}</span>
                    </Ring>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em" }}>{p.nome}</div>
                      <Label size={22} style={{ marginTop: 4, whiteSpace: "nowrap" }}>
                        {fmtBR(p.concluidos)} concluídos · {fmtBR(p.andamento)} em andamento
                      </Label>
                    </div>
                    <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Count to={p.valor} at={at} dur={55} dec={p.casas} prefix={p.prefixo} style={{ fontSize: V ? 52 : 56, fontWeight: 500, letterSpacing: "-0.04em" }} />
                      <Label size={20}>{unit}</Label>
                    </div>
                  </div>
                </Focus>
              );
            })}
          </Panel>
        </At>
      </Cam>
    </Void>
  );
};

// =================================================================== 4c · DETALHES (390) — sinos: 30 (55), 60/80/92/110, 60 (50), 80 (45)
const Bar: React.FC<{ v: number; max: number; at: number; label: string; h: number; color: string }> = ({ v, max, at, label, h, color }) => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [at, at + 30], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, justifyContent: "flex-end", height: h + 90 }}>
      <div style={{ fontSize: 24, fontVariantNumeric: "tabular-nums", opacity: g }}>{fmtBR(v * g, 2)}</div>
      <div style={{ width: "62%", height: (v / max) * h * g, borderRadius: 8, background: color, boxShadow: color === U.green ? `0 0 24px ${U.greenGlow}` : undefined }} />
      <Label size={18} style={{ textAlign: "center", height: 44 }}>{label}</Label>
    </div>
  );
};
export const Detalhes: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const P = DETALHE.produtividade;
  const $ = DETALHE.custos;
  const big: React.CSSProperties = { fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 };
  const W = V ? 960 : 1500;
  const keys: Key[] = V
    ? [[0, -150, -560, 2.0, 0, -6], [60, 0, -260, 1.6], [130, 0, 0, 0.98, 6, 4], [230, -230, 540, 1.8], [300, 230, 540, 1.8], [dur, 0, 0, 0.98, 4, -4]]
    : [[0, -420, -230, 2.1, 0, -6], [60, -330, 120, 1.7], [130, 0, 0, 0.98, 6, 4], [230, 350, -190, 1.9], [300, 520, 200, 1.9], [dur, 0, 0, 0.96, 4, -4]];
  const card = (children: React.ReactNode, style?: React.CSSProperties) => <div style={{ borderRadius: 18, border: `1.5px solid ${U.line}`, background: "#0d0d0d", padding: 34, boxSizing: "border-box", ...style }}>{children}</div>;
  return (
    <Void>
      <Cam keys={keys}>
        <At x={0} y={0}>
          <Panel w={W} pad={40}>
            <div style={{ fontSize: 44, fontWeight: 500, letterSpacing: "-0.03em" }}>Em detalhe</div>
            <Label size={24} style={{ marginTop: 6, marginBottom: 30 }}>Produtividade, custos e moral · {EVENTO.fiscal}</Label>
            <div style={{ display: "flex", flexDirection: V ? "column" : "row", gap: 26 }}>
              {card(
                <>
                  <Label size={24}>Produtividade</Label>
                  <div style={{ ...row, gap: 16, alignItems: "baseline", marginTop: 10 }}>
                    <Count to={P.total} at={30} dur={55} dec={2} style={{ ...big, fontSize: 104 }} />
                    <Label size={28}>mil minutos</Label>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
                    <Bar v={P.op} max={P.op} at={60} label="Operacional" h={240} color={U.green} />
                    <Bar v={P.waste} max={P.op} at={80} label="Waste Avoidance" h={240} color="#3a3a3a" />
                    <Bar v={P.estrutural} max={P.op} at={92} label="Estrutural" h={240} color="#3a3a3a" />
                    <Bar v={P.adm} max={P.op} at={110} label="Administrativo" h={240} color="#d9d9d9" />
                  </div>
                </>,
                { flex: V ? undefined : 1.5 },
              )}
              <div style={{ display: "flex", flexDirection: V ? "row" : "column", gap: 26, flex: 1 }}>
                {card(
                  <>
                    <Label size={24}>Custos</Label>
                    <div style={{ ...big, fontSize: 84, marginTop: 10, whiteSpace: "nowrap" }}>
                      <Count to={$.total} at={60} dur={50} prefix="R$ " />
                      <span style={{ fontSize: 36, color: U.muted, letterSpacing: 0 }}> mi</span>
                    </div>
                    {[
                      { l: "Estrutural", v: $.estrutural },
                      { l: "Cost Avoidance", v: $.avoidance },
                    ].map((b, k) => {
                      const g = interpolate(frame, [70 + k * 10, 100 + k * 10], [0, 1], { ...cl, easing: OUT });
                      return (
                        <div key={b.l} style={{ marginTop: 20 }}>
                          <div style={{ ...row, justifyContent: "space-between", fontSize: 22, color: U.muted }}>
                            <span>{b.l}</span>
                            <span style={{ color: U.text }}>{fmtBR(b.v * g, 2)}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 6, background: "#1d1d1d", marginTop: 8 }}>
                            <div style={{ width: `${(b.v / 2) * 100 * g}%`, height: "100%", borderRadius: 6, background: k ? U.green : "#d9d9d9", boxShadow: k ? `0 0 14px ${U.greenGlow}` : undefined }} />
                          </div>
                        </div>
                      );
                    })}
                  </>,
                  { flex: 1 },
                )}
                {card(
                  <div style={{ ...row, gap: 30 }}>
                    <Ring size={150} value={0.92} at={80} dur={45} stroke={10}>
                      <Count to={35} at={80} dur={45} style={{ fontSize: 48, fontWeight: 500 }} />
                    </Ring>
                    <div style={{ flex: 1 }}>
                      <Label size={24}>Moral</Label>
                      {DETALHE.moral.map((m) => (
                        <div key={m.nome} style={{ ...row, justifyContent: "space-between", fontSize: 24, marginTop: 10 }}>
                          <span style={{ color: U.muted }}>{m.nome}</span>
                          <span>{m.valor}</span>
                        </div>
                      ))}
                    </div>
                  </div>,
                  { flex: 1 },
                )}
              </div>
            </div>
          </Panel>
        </At>
      </Cam>
    </Void>
  );
};

// =================================================================== 5 · RECONHECIMENTO (660) — palavras em 20 + 80k; destaques em 340
const PALAVRAS = ["Melhorar", "Avançar", "Reconhecer", "Celebrar"];
const Palavra: React.FC<{ w: string; last: boolean; len: number }> = ({ w, last, len }) => {
  const { V } = useL();
  return (
    <Focus fill at={0} out={len - 12} len={8}>
      <AbsoluteFill>
        <Cam keys={[[0, -60, 0, 1.45, 0, -4], [len, 40, 0, 1.0, 0, 3]]} dof={5}>
          <At x={0} y={0}>
            <div style={{ fontFamily: F, fontSize: V ? 170 : 230, fontWeight: 500, letterSpacing: "-0.05em", color: U.text, whiteSpace: "nowrap" }}>
              <Typed text={w} at={2} speed={1.6} until={len - 14} />
              <span style={{ color: last ? U.green : U.text, textShadow: last ? `0 0 40px ${U.greenGlow}` : undefined }}>.</span>
            </div>
          </At>
        </Cam>
      </AbsoluteFill>
    </Focus>
  );
};

const Destaques: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const fotos = [RECONHECIMENTO.fotos[2], RECONHECIMENTO.fotos[0], RECONHECIMENTO.fotos[4], RECONHECIMENTO.fotos[1]];
  const items = fotos.map((src, i) => ({ src, label: `Q${i + 1} · ${i % 2 ? "Ver e Agir" : "Pensamento A3"}`, sub: "Projeto destaque do trimestre", status: "Reconhecido" }));
  const press = interpolate(frame, [236, 240, 248], [0, 1, 0], cl);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <Lista title="Destaques trimestrais" sub="A cada trimestre, os melhores projetos são reconhecidos no Gemba." items={items} w={V ? 960 : 1200} rowH={V ? 150 : 128} thumb={V ? [200, 120] : [180, 104]} dur={dur} />
      <Focus at={190}>
        <WhiteButton size={40} press={press}>
          Ver todos os destaques <Arrow size={32} />
        </WhiteButton>
      </Focus>
    </div>
  );
};

export const Reconhecimento: React.FC<D> = ({ dur }) => {
  const { V } = useL();
  const W0 = 20;
  const WL = 80;
  const B = W0 + 4 * WL;
  const d = dur - B;
  const rh = V ? 150 : 128;
  const listH = 150 + 4 * rh;
  const top = -(listH + 40 + 90) / 2;
  const yRow = (i: number) => top + 150 + i * rh + rh / 2;
  const btnY = top + listH + 40 + 45;
  const keys: Key[] = [[0, V ? -150 : -280, top + 70, 2.0, 0, -6], [60, 0, yRow(0), 1.7, 4, -4], [100, 0, yRow(2), 1.7, 4, 4], [140, 0, yRow(3), 1.7], [180, 0, 0, 1.0, 8, 6], [220, 0, btnY, 2.0], [256, 0, btnY, 2.1], [290, 0, 0, 1.0, 4, -4], [d, 0, 0, 0.97]];
  return (
    <Void>
      {PALAVRAS.map((w, i) => (
        <Sequence key={w} from={W0 + i * WL} durationInFrames={WL}>
          <Palavra w={w} last={i === 3} len={WL} />
          <TypeSfx at={2} chars={w.length} speed={1.6} every={2} volume={0.16} />
        </Sequence>
      ))}
      <Sequence from={B}>
        <Focus fill at={0} len={16}>
          <AbsoluteFill>
            <Cam keys={keys} focus={[[0, 14], [16, 0]]}>
              <At x={0} y={0}>
                <Destaques dur={d} />
              </At>
            </Cam>
          </AbsoluteFill>
        </Focus>
        <Sfx at={240} src="click_002" volume={0.6} />
      </Sequence>
    </Void>
  );
};

// =================================================================== 6 · FEIRAS E EVENTOS (420)
const NOMES = ["Concurso Brasileiro", "Feira · Estande", "Gemba · Estande", "Feira · Quadro", "Evento · Plateia", "Feira · Gemba", "Time CI", "Evento · Palco"];
export const Eventos: React.FC<D> = ({ dur }) => {
  const { V } = useL();
  const cols = V ? 2 : 4;
  const cw = V ? 440 : 400;
  const chh = V ? 380 : 330;
  const gap = 28;
  const gw = cols * cw + (cols - 1) * gap;
  const rows = Math.ceil(EVENTOS.fotos.length / cols);
  const gh = rows * chh + (rows - 1) * gap;
  const headH = 170;
  const top = -(headH + gh) / 2;
  const pos = (i: number) => ({ x: -gw / 2 + (i % cols) * (cw + gap) + cw / 2, y: top + headH + Math.floor(i / cols) * (chh + gap) + chh / 2 });
  const p1 = pos(V ? 2 : 1);
  const p2 = pos(V ? 5 : 6);
  const keys: Key[] = [[0, 0, 0, 0.82, 26, -12], [110, p1.x, p1.y, 1.9, 0, -4], [170, p1.x, p1.y, 1.85, 0, 2], [250, p2.x, p2.y, 1.9, 0, 4], [320, 0, 0, 0.95, 10, 8], [dur, 0, 0, 0.9, 16, -6]];
  return (
    <Void>
      <Cam keys={keys}>
        <At x={0} y={top + 70}>
          <div style={{ textAlign: "center", fontFamily: F, color: U.text, width: 1400 }}>
            <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.035em" }}>Feiras e eventos</div>
            <Label size={26} style={{ marginTop: 10 }}>Onde a melhoria contínua acontece junto.</Label>
          </div>
        </At>
        {EVENTOS.fotos.map((src, i) => {
          const p = pos(i);
          return (
            <At key={i} x={p.x} y={p.y}>
              <Focus at={8 + i * 5} rise={30}>
                <div style={{ width: cw, height: chh, borderRadius: 18, border: `1.5px solid ${U.line}`, background: "#0d0d0d", padding: 16, boxSizing: "border-box", fontFamily: F, color: U.text, boxShadow: "0 30px 80px rgba(0,0,0,.7)" }}>
                  <Thumb src={src} w={cw - 32} h={chh - 120} r={12} dur={dur} />
                  <div style={{ fontSize: 26, fontWeight: 500, marginTop: 18, letterSpacing: "-0.02em" }}>{NOMES[i]}</div>
                  <div style={{ ...row, gap: 10, marginTop: 6 }}>
                    <Dot size={8} />
                    <Label size={20}>{EVENTO.fiscal} · Montenegro</Label>
                  </div>
                </div>
              </Focus>
            </At>
          );
        })}
      </Cam>
    </Void>
  );
};

// =================================================================== 7 · DEPOIMENTO (600)
export const Depoimento: React.FC<D> = ({ dur }) => {
  const { V } = useL();
  const words = `“${DEPOIMENTO.frase}”`.split(" ");
  const w = V ? 960 : 1400;
  const keys: Key[] = V ? [[0, -200, -60, 1.7, 0, -6], [200, 160, 60, 1.6, 0, 4], [300, 0, 0, 1.0, 6, -4], [dur, 0, 0, 0.94, 3, 4]] : [[0, -320, -10, 1.8, 0, -6], [200, 240, -10, 1.65, 0, 4], [300, 0, 0, 1.0, 6, -4], [dur, 0, 0, 0.94, 3, 4]];
  return (
    <Void>
      <Cam keys={keys} focus={[[0, 16], [20, 0]]}>
        <At x={0} y={0}>
          <Panel w={w} pad={56}>
            <div style={{ ...row, gap: 24 }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#1c1c1c", border: `1.5px solid #333`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 500, color: U.text }}>MR</div>
              <div>
                <div style={{ fontSize: 34, fontWeight: 500 }}>{DEPOIMENTO.nome}</div>
                <Label size={24}>{DEPOIMENTO.cargo}</Label>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ ...row, gap: 12, fontSize: 22, color: U.muted }}>
                <Dot /> Palavra do mentor
              </div>
            </div>
            <div style={{ height: 1.5, background: U.line, margin: "40px 0" }} />
            {DEPOIMENTO.video ? (
              <div style={{ height: V ? 1000 : 640, borderRadius: 16, overflow: "hidden" }}>
                <OffthreadVideo src={staticFile(DEPOIMENTO.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", columnGap: 26, rowGap: 6, fontSize: V ? 92 : 104, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1.1 }}>
                {words.map((wd, i) => (
                  <Focus key={i} at={24 + i * 16} len={16}>
                    <span style={{ color: i === words.length - 1 ? U.green : U.text, textShadow: i === words.length - 1 ? `0 0 30px ${U.greenGlow}` : undefined }}>{wd}</span>
                  </Focus>
                ))}
              </div>
            )}
            <Label size={22} style={{ marginTop: 44 }}>CI Awards {EVENTO.ano} · John Deere Montenegro</Label>
          </Panel>
        </At>
      </Cam>
    </Void>
  );
};

// =================================================================== 8 · ENCERRAMENTO (330) — 8 palavras (12 q), logo em 98
const OITO = ["Estar presente", "Educar", "Incluir", "Inspirar", "Melhorar", "Avançar", "Reconhecer", "Celebrar"];
export const Encerramento: React.FC<D> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { V } = useL();
  const per = 12;
  const mont = 98;
  const i = Math.min(OITO.length - 1, Math.floor(frame / per));
  const local = frame - i * per;
  // botão branco → bolha → marca
  const press = interpolate(frame, [128, 132, 140], [0, 1, 0], cl);
  const blob = interpolate(frame, [146, 170], [0, 1], { ...cl, easing: OUT });
  const markIn = interpolate(frame, [164, 186], [0, 1], { ...cl, easing: OUT });
  const out = interpolate(frame, [dur - 30, dur], [0, 1], cl);
  return (
    <Void spot={frame < mont ? 0.8 : 1}>
      {frame < mont ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F, fontSize: V ? 120 : 150, fontWeight: 500, letterSpacing: "-0.045em", color: U.text, whiteSpace: "nowrap", opacity: interpolate(local, [0, 3], [0, 1], cl), filter: `blur(${interpolate(local, [0, 4, per - 3, per], [14, 0, 0, 10], cl)}px)`, scale: String(interpolate(local, [0, per], [1.08, 1])) }}>
            {OITO[i]}
            <span style={{ color: i === 7 ? U.green : U.text }}>.</span>
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", opacity: 1 - markIn, filter: `blur(${blob * 40}px)`, scale: String(1 - blob * 0.35), borderRadius: 999 }}>
            <Focus at={mont} len={12}>
              <WhiteButton size={V ? 54 : 60} press={press} glow={1 + blob}>
                CI Awards {EVENTO.ano} <Arrow size={V ? 46 : 52} />
              </WhiteButton>
            </Focus>
          </div>
          <div style={{ position: "absolute", opacity: markIn, filter: `blur(${(1 - markIn) * 20}px)`, scale: String(0.9 + 0.1 * markIn + interpolate(frame, [186, dur], [0, 0.04], cl)), display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
            <Mark h={V ? 380 : 420} full glow={0.9} />
            <Focus at={214}>
              <Label size={26} color={U.muted} style={{ letterSpacing: "0.04em" }}>
                John Deere Montenegro · CI Awards {EVENTO.ano}
              </Label>
            </Focus>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#000", opacity: out }} />
      <Sfx at={132} src="click_004" volume={0.6} />
      <Sfx at={160} src="forceField_001" volume={0.25} />
    </Void>
  );
};
