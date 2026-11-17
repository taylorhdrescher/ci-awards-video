import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Media } from "../components/ui";
import { BlurWords, cl, Count, Dark, Dust, F, Flare, Footage, INOUT, K, OUT, Paper } from "../teste/kit";
import { Final } from "../teste/cenas";

type P = { dur: number; voz: number };

// ------------------------------------------------------------------ Estar presente: texto-máscara + painéis
const PAINEIS = [
  { src: "vid/grupo-gemba.mp4", t: "No Gemba." },
  { src: "vid/paineis.mp4", t: "Na gestão diária." },
  { src: "vid/facilitando.mp4", t: "Ao lado de cada time." },
];
export const PresenteMask: React.FC<{ dur: number; fase2: number; vozFase2: number; ponte?: number; fundoAt?: number }> = ({ dur, fase2, vozFase2, ponte = 0, fundoAt = 6.0 }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [fase2 - 26, fase2 - 2], [1, 7], { ...cl, easing: (t) => t * t * t });
  const maskOff = interpolate(frame, [fase2 - 12, fase2 - 2], [1, 0], cl);
  const txtIn = interpolate(frame, [4, 22], [0, 1], { ...cl, easing: OUT });
  const subIn = interpolate(frame, [26, 40], [0, 1], { ...cl, easing: OUT });
  const p0 = fase2 + ponte; // início dos painéis
  const seg = vozFase2 / 3;
  const active = Math.max(0, Math.min(2, Math.floor((frame - p0) / seg)));
  const fundoDim = interpolate(frame, [p0 - 10, p0 + 10], [0.35, 0.8], cl);
  return (
    <AbsoluteFill style={{ background: K.black, overflow: "hidden" }}>
      {/* mesma imagem da fábrica atravessa as três fases (máscara → ponte → fundo dos painéis) */}
      <Footage at={fundoAt} dim={frame < fase2 ? 0 : fundoDim} />
      {frame < fase2 ? (
        <AbsoluteFill>
          {/* camada preta com texto branco em multiply = vídeo só dentro das letras */}
          <AbsoluteFill style={{ background: "#000", mixBlendMode: "multiply", opacity: maskOff, alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 360, letterSpacing: "-0.06em", color: "#fff", scale: String(zoom * (0.9 + 0.1 * txtIn)), opacity: txtIn, transformOrigin: "47% 55%" }}>PRESENTE</div>
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: F, fontWeight: 600, fontSize: 34, letterSpacing: "0.4em", color: "rgba(255,255,255,.75)", opacity: txtIn * maskOff }}>
            01 · ESTAR
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: F, fontWeight: 500, fontSize: 40, color: "rgba(255,255,255,.8)", opacity: subIn * maskOff, translate: `0 ${(1 - subIn) * 20}px` }}>
            onde a melhoria acontece, todos os dias
          </div>
          <Flare x={interpolate(frame, [0, fase2], [200, 1700])} y={560} scale={0.9} opacity={0.6 * maskOff} />
        </AbsoluteFill>
      ) : null}
      {ponte > 0 && frame >= fase2 && frame < p0 + 12 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: interpolate(frame, [p0 - 6, p0 + 10], [1, 0], cl) }}>
          <BlurWords text="No chão de fábrica," start={fase2 + 4} every={4} size={110} weight={800} color="#fff" />
          <BlurWords text="ao lado das pessoas." start={fase2 + 18} every={4} size={110} weight={800} color="#fff" accent={[2, 3]} accentColor={K.neon} />
        </AbsoluteFill>
      ) : null}
      {frame >= p0 - 4 ? (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", gap: 14, padding: 14 }}>
          {PAINEIS.map((p, i) => {
            const enter = spring({ frame: frame - p0 - i * 5, fps: 30, config: { damping: 18 } });
            const grow = interpolate(frame - p0, [i * seg, i * seg + 16], [0, 1], { ...cl, easing: INOUT });
            const shrink = i < 2 ? interpolate(frame - p0, [(i + 1) * seg, (i + 1) * seg + 16], [0, 1], { ...cl, easing: INOUT }) : 0;
            const w = 1 + 1.6 * (grow - shrink);
            const on = i === active;
            return (
              <div key={i} style={{ flex: w, position: "relative", borderRadius: 26, overflow: "hidden", translate: `0 ${(1 - enter) * 1100}px`, boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
                <Sequence from={p0} layout="none">
                  <Media src={p.src} style={{ width: "100%", height: "100%" }} durationInFrames={vozFase2} zoom={[1.15, 1]} />
                </Sequence>
                <AbsoluteFill style={{ background: on ? "linear-gradient(0deg, rgba(0,0,0,.65), transparent 50%)" : "rgba(0,0,0,.55)" }} />
                <div style={{ position: "absolute", left: 40, bottom: 44, fontFamily: F, color: "#fff", opacity: on ? 1 : 0.5 }}>
                  <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.3em", color: K.neon }}>0{i + 1}</div>
                  <div style={{ fontSize: on ? 70 : 40, fontWeight: 800, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>{p.t}</div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ Produtividade: tela dividida
const HB: React.FC<{ label: string; v: number; max: number; color: string; start: number; sub?: boolean }> = ({ label, v, max, color, start, sub }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 30], [0, 1], { ...cl, easing: OUT });
  return (
    <div style={{ marginTop: sub ? 18 : 34, paddingLeft: sub ? 40 : 0, opacity: interpolate(frame, [start - 4, start + 6], [0, 1], cl) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: sub ? 26 : 32, fontWeight: sub ? 500 : 700, color: sub ? "#555b54" : K.ink }}>
        <span>{label}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          <Count to={v} dec={2} start={start} dur={30} /> mil
        </span>
      </div>
      <div style={{ height: sub ? 14 : 26, borderRadius: 30, background: "#e2e5de", marginTop: 10, overflow: "hidden" }}>
        <div style={{ width: `${(v / max) * 100 * t}%`, height: "100%", borderRadius: 30, background: color }} />
      </div>
    </div>
  );
};
export const ProdDetalhe: React.FC<P & { lead: number }> = ({ dur, voz, lead }) => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [0, 16], [0, 1], { ...cl, easing: OUT });
  const adm = lead + Math.round(voz * 0.52);
  return (
    <Paper>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 820, clipPath: `inset(0 ${(1 - split) * 100}% 0 0)` }}>
        <Footage at={28.6} dim={0.05} />
        <div style={{ position: "absolute", left: 60, bottom: 60, fontFamily: F, color: "#fff", fontSize: 26, fontWeight: 600, letterSpacing: "0.25em" }}>PRODUTIVIDADE · FY26</div>
      </div>
      <div style={{ position: "absolute", left: 920, top: 130, width: 860 }}>
        <BlurWords text="580,14 mil minutos" start={6} every={4} size={104} weight={800} align="left" width={900} accent={[0, 1]} />
        <div style={{ fontFamily: F, fontSize: 30, fontWeight: 500, color: "#6b7069", marginTop: 6, opacity: interpolate(frame, [16, 28], [0, 1], cl) }}>ganhos em produtividade no ano</div>
        <div style={{ marginTop: 40 }}>
          <HB label="Operacional (OP)" v={365.98} max={365.98} color={K.green} start={lead + 2} />
          <HB label="Waste Avoidance" v={336.79} max={365.98} color="#8fd16f" start={lead + 14} sub />
          <HB label="Estrutural" v={29.19} max={365.98} color="#8fd16f" start={lead + 22} sub />
          <HB label="Administrativo (ADM)" v={214.16} max={365.98} color={K.yellow} start={adm} />
        </div>
      </div>
    </Paper>
  );
};

// ------------------------------------------------------------------ Moral: anéis concêntricos
export const MoralRings: React.FC<P & { lead: number }> = ({ dur, voz, lead }) => {
  const frame = useCurrentFrame();
  const items = [
    { n: "Ambiente", v: 18, c: "#2fb5ac", at: 0.42 },
    { n: "Educação", v: 9, c: K.green, at: 0.6 },
    { n: "Bem-Estar", v: 8, c: "#f2b705", at: 0.78 },
  ];
  return (
    <Paper glow="rgba(47,181,172,.14)">
      <div style={{ position: "absolute", left: 230, top: 140, width: 800, height: 800 }}>
        {items.map((it, i) => {
          const R = 360 - i * 92;
          const C = 2 * Math.PI * R;
          const st = lead + Math.round(voz * it.at);
          const p = interpolate(frame, [st - 4, st + 30], [0, it.v / 18 * 0.92], { ...cl, easing: OUT });
          return (
            <svg key={i} width={800} height={800} style={{ position: "absolute", left: 0, top: 0, rotate: "-90deg" }}>
              <circle cx={400} cy={400} r={R} fill="none" stroke={it.c} strokeOpacity={0.15} strokeWidth={70} />
              <circle cx={400} cy={400} r={R} fill="none" stroke={it.c} strokeWidth={70} strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} />
            </svg>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F }}>
          <Count to={35} start={lead} dur={40} style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", color: K.ink, lineHeight: 1 }} />
          <div style={{ fontSize: 26, fontWeight: 600, color: "#6b7069" }}>projetos</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1140, top: 230 }}>
        <BlurWords text="Moral" start={2} every={4} size={120} weight={800} align="left" width={700} accent={[0]} accentColor="#1d7f77" />
        {items.map((it, i) => {
          const st = lead + Math.round(voz * it.at);
          const o = interpolate(frame, [st - 6, st + 6], [0, 1], { ...cl, easing: OUT });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 34, fontFamily: F, opacity: o, translate: `${(1 - o) * 40}px 0` }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: it.c }} />
              <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", width: 330 }}>{it.n}</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: it.c }}>{it.v}</div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
};

// ------------------------------------------------------------------ "Não é só um prêmio": fotos em tela cheia
const FOTOS_PREMIO = ["img/m-evento-premiacao.jpg", "img/reconhecimento-grupo.jpg", "img/reconhecimento-dupla.jpg"];
export const Premio: React.FC<P & { lead: number }> = ({ dur, voz, lead }) => {
  const frame = useCurrentFrame();
  const cut = Math.round(dur / 3);
  const i = Math.min(2, Math.floor(frame / cut));
  const local = frame - i * cut;
  const p2 = lead + Math.round(voz * 0.38);
  return (
    <AbsoluteFill style={{ background: K.black, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(local, [0, cut], [1.15, 1.03])), translate: `${interpolate(local, [0, cut], [i % 2 ? -30 : 30, 0])}px 0` }}>
        <Img src={staticFile(FOTOS_PREMIO[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(3,4,3,.85), rgba(3,4,3,.35))" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(local, [0, 4], [i ? 0.5 : 0, 0], cl) }} />
      <div style={{ position: "absolute", left: 130, top: 330 }}>
        <BlurWords text="Não é só um prêmio." start={lead} every={4} size={100} color="#fff" align="left" width={1400} />
        <div style={{ height: 30 }} />
        <BlurWords text="É o reconhecimento de quem faz acontecer." start={p2} every={4} size={100} color="#fff" align="left" width={1400} accent={[5, 6]} accentColor={K.neon} />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ Montagem final das 8 palavras
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
export const FinalMontagem: React.FC<{ dur: number; per: number }> = ({ dur, per }) => {
  const frame = useCurrentFrame();
  const n = OITO.length;
  const mont = n * per;
  const i = Math.min(n - 1, Math.floor(frame / per));
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
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 210, letterSpacing: "-0.06em", color: it.c, scale: String(interpolate(local, [0, per], [1.12, 1])), filter: `blur(${interpolate(local, [0, 3], [10, 0], cl)}px)` }}>{it.w}.</div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : (
        <Sequence from={mont} layout="none">
          <Final dur={dur - mont} voz={0} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export { Dark, Dust };
