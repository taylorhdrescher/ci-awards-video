/**
 * Vídeo de apresentação do perfil (vende o serviço de motion design para empresas).
 * Vertical 1080×1920, narração + legendas dinâmicas. Exemplos com marcas FICTÍCIAS (sem uso de cliente real).
 * Troque nome, @, preço e cor em MARCA.
 */
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import VO from "./vo.json";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-var.woff2"), weight: "100 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/Playfair-italic.woff2"), weight: "400 900", style: "italic" });

export const MARCA = { nome: "clique", sub: "motion", arroba: "@clique.motion", preco: "297", cor: "#7c3aed", corClara: "#b794ff" };
const F = "'Inter', sans-serif";
const SERIF = "'Playfair Display', serif";
const K = { bg: "#f6f4fb", ink: "#0d0a14", dark: "#0d0a14", gray: "#7a7488", acc: MARCA.cor, accL: MARCA.corClara };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
type S = { dur: number; voz: number };

// ------------------------------------------------------------------ kit
const W: React.FC<{ text: string; start?: number; every?: number; size?: number; color?: string; acc?: number[]; accColor?: string; italic?: number[]; width?: number; align?: "center" | "left"; weight?: number }> = ({
  text, start = 0, every = 3, size = 110, color = K.ink, acc = [], accColor, italic = [], width = 940, align = "center", weight = 800,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.22, fontFamily: F, fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.05em", color, textAlign: align }}>
      {text.split(" ").map((w, i) => {
        const t = interpolate(frame, [start + i * every, start + i * every + 10], [0, 1], { ...cl, easing: OUT });
        const it = italic.includes(i);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, filter: `blur(${(1 - t) * 14}px)`, translate: `0 ${(1 - t) * size * 0.4}px`, scale: String(0.9 + 0.1 * t), color: acc.includes(i) ? accColor ?? K.ink : undefined, fontFamily: it ? SERIF : undefined, fontStyle: it ? "italic" : undefined, fontWeight: it ? 600 : undefined, letterSpacing: it ? "-0.02em" : undefined }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
const Bg: React.FC<{ dark?: boolean; tone?: string; glow?: boolean; children?: React.ReactNode }> = ({ dark, tone, glow = true, children }) => (
  <AbsoluteFill style={{ background: tone ?? (dark ? K.dark : K.bg), overflow: "hidden" }}>
    {glow ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 40% at 50% 50%, ${dark ? "rgba(124,58,237,.16)" : "rgba(124,58,237,.22)"}, transparent 70%)` }} /> : null}
    {children}
  </AbsoluteFill>
);
const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", ...style }}>{children}</AbsoluteFill>
);
const Dust: React.FC<{ n?: number }> = ({ n = 40 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(n).fill(0).map((_, i) => {
        const y = ((random(`py${i}`) * 1920 - frame * (0.4 + random(`ps${i}`))) % 1920 + 1920) % 1920;
        const s = 2 + random(`pz${i}`) * 4;
        return <div key={i} style={{ position: "absolute", left: random(`px${i}`) * 1080, top: y, width: s, height: s, borderRadius: "50%", background: K.accL, opacity: 0.12 + random(`po${i}`) * 0.4, boxShadow: `0 0 ${s * 3}px ${K.accL}` }} />;
      })}
    </AbsoluteFill>
  );
};
const Cursor: React.FC<{ path: [number, number, number][]; click: number; dark?: boolean }> = ({ path, click, dark }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p[0]);
  const x = interpolate(frame, fs, path.map((p) => p[1]), { ...cl, easing: INOUT });
  const y = interpolate(frame, fs, path.map((p) => p[2]), { ...cl, easing: INOUT });
  const press = interpolate(frame, [click - 3, click, click + 5], [0, 1, 0], cl);
  const r = frame >= click && frame < click + 20 ? (frame - click) / 20 : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: interpolate(frame, [fs[0], fs[0] + 5], [0, 1], cl), zIndex: 9 }}>
      {r >= 0 ? <div style={{ position: "absolute", left: -60 * r - 4, top: -60 * r - 4, width: 120 * r + 8, height: 120 * r + 8, borderRadius: "50%", border: `5px solid ${K.acc}`, opacity: 1 - r }} /> : null}
      <svg width={80} height={80} viewBox="0 0 24 24" style={{ scale: String(1 - press * 0.18), transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.3))" }}>
        <path d="M3 2l7.5 19 2.6-7.6L21 10.8z" fill={dark ? "#fff" : K.ink} stroke={dark ? K.ink : "#fff"} strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; w?: number; h?: number }> = ({ children, style, w = 640, h = 1220 }) => (
  <div style={{ width: w, height: h, borderRadius: 86, background: "#111", padding: 18, boxSizing: "border-box", boxShadow: "0 60px 120px rgba(0,0,0,.35)", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 70, overflow: "hidden", position: "relative", background: "#fff" }}>{children}</div>
  </div>
);
export const LogoMarca: React.FC<{ s?: number; p?: number; dark?: boolean }> = ({ s = 1, p = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 * s, fontFamily: F, letterSpacing: "-0.06em", color: dark ? "#fff" : K.ink }}>
    <div style={{ width: 150 * s, height: 150 * s, borderRadius: 44 * s, background: K.acc, display: "flex", alignItems: "center", justifyContent: "center", scale: String(p), rotate: `${(1 - p) * -20}deg`, boxShadow: `0 20px ${60 * s}px rgba(124,58,237,.45)` }}>
      <svg width={90 * s} height={90 * s} viewBox="0 0 24 24"><path d="M5 3l7 18 2.5-7.5L22 11z" fill="#fff" stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" /></svg>
    </div>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, opacity: p, filter: `blur(${(1 - p) * 10}px)`, translate: `${(1 - p) * -40}px 0` }}>
      <span style={{ fontWeight: 900, fontSize: 130 * s }}>{MARCA.nome}</span>
      <span style={{ fontWeight: 500, fontSize: 64 * s, color: K.acc, letterSpacing: "-0.02em" }}>{MARCA.sub}</span>
    </div>
  </div>
);

/** legenda dinâmica (blocos de até 4 palavras, palavra atual destacada) */
const Caption: React.FC<{ text: string; voz: number }> = ({ text, voz }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const wt = words.map((w) => w.length + 2);
  const tot = wt.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  for (const w of wt) { starts.push((acc / tot) * voz); acc += w; }
  const chunks: number[][] = [];
  let cur: number[] = [];
  words.forEach((w, i) => { cur.push(i); if (cur.length === 4 || /[.,:?!]$/.test(w)) { chunks.push(cur); cur = []; } });
  if (cur.length) chunks.push(cur);
  const ci = Math.max(0, chunks.findIndex((c, k) => frame < (k + 1 < chunks.length ? starts[chunks[k + 1][0]] : voz + 20)));
  const chunk = chunks[ci] ?? [];
  const pop = spring({ frame: frame - (chunk.length ? starts[chunk[0]] : 0), fps: 30, config: { damping: 14, mass: 0.6 } });
  if (frame > voz + 14 || !chunk.length) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1520, display: "flex", justifyContent: "center", zIndex: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 20, padding: "20px 34px", borderRadius: 26, background: "rgba(11,12,10,.9)", scale: String(0.85 + 0.15 * pop), fontFamily: F, fontWeight: 800, fontSize: 60, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
        {chunk.map((wi) => {
          const on = frame >= starts[wi];
          const now = on && (wi + 1 >= starts.length || frame < starts[wi + 1]);
          return <span key={wi} style={{ color: now ? K.accL : on ? "#fff" : "rgba(255,255,255,.4)" }}>{words[wi]}</span>;
        })}
      </div>
    </div>
  );
};
const Chip: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ children, dark, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: 999, background: dark ? "rgba(255,255,255,.1)" : "#fff", color: dark ? "#fff" : K.ink, fontFamily: F, fontWeight: 700, fontSize: 30, boxShadow: dark ? undefined : "0 10px 30px rgba(0,0,0,.08)", ...style }}>{children}</div>
);

// ------------------------------------------------------------------ cenas
const Gancho: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const ph = spring({ frame, fps: 30, config: { damping: 14 } });
  const x = interpolate(frame, [voz - 18, voz - 10], [0, 1], { ...cl, easing: OUT });
  const shake = frame > voz - 10 && frame < voz ? Math.sin(frame * 3) * 10 : 0;
  return (
    <Bg glow={false}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
        <W text="Sua empresa ainda posta assim?" start={2} every={4} size={104} acc={[3]} accColor="#e0403a" />
      </div>
      <Center style={{ translate: `${shake}px ${(1 - ph) * 700 + 140}px` }}>
        <div style={{ width: 760, height: 760, background: "linear-gradient(135deg,#d9d9d9,#bdbdbd)", borderRadius: 12, boxShadow: "0 30px 70px rgba(0,0,0,.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, fontFamily: "Arial, sans-serif", filter: `saturate(${1 - x * 0.6})` }}>
          <div style={{ fontSize: 120, fontWeight: 900, color: "#e02020", textShadow: "4px 4px 0 #ffeb3b", rotate: "-6deg" }}>PROMOÇÃO!!</div>
          <div style={{ fontSize: 60, color: "#333", fontWeight: 700 }}>10% OFF em tudo</div>
          <div style={{ fontSize: 34, color: "#555" }}>ligue já (00) 0000-0000</div>
        </div>
        <svg width={600} height={600} viewBox="0 0 24 24" style={{ position: "absolute", opacity: x, scale: String(0.6 + 0.4 * x) }}>
          <path d="M5 5l14 14M19 5L5 19" stroke="#e0403a" strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x} />
        </svg>
      </Center>
    </Bg>
  );
};

const Feed: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const stop = Math.round(voz * 0.55);
  const scroll = interpolate(frame, [0, stop], [0, -2600], { ...cl, easing: Easing.out(Easing.cubic) });
  const glow = interpolate(frame, [stop - 6, stop + 10], [0, 1], cl);
  const tap = stop + 14;
  const items = new Array(8).fill(0);
  return (
    <Bg dark>
      <Dust n={30} />
      <Center style={{ translate: "0 -60px" }}>
        <Phone>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, translate: `0 ${scroll}px` }}>
            {items.map((_, i) => {
              const motion = i === 6;
              return (
                <div key={i} style={{ margin: "30px 26px", height: 400, borderRadius: 28, background: motion ? K.dark : `hsl(${30 + i * 40}, 8%, ${86 - (i % 3) * 5}%)`, overflow: "hidden", position: "relative", boxShadow: motion ? `0 0 ${70 * glow}px ${K.acc}` : undefined }}>
                  {motion ? (
                    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
                        {[0.4, 0.6, 0.85, 1].map((h, k) => (
                          <div key={k} style={{ width: 40, height: 160 * h * (0.4 + 0.6 * Math.abs(Math.sin((frame + k * 8) / 12))), borderRadius: 12, background: K.accL }} />
                        ))}
                      </div>
                      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: "#fff", letterSpacing: "-0.04em" }}>
                        +vendas<span style={{ color: K.accL }}>.</span>
                      </div>
                    </AbsoluteFill>
                  ) : (
                    <div style={{ position: "absolute", left: 30, bottom: 30, width: 260, height: 22, borderRadius: 11, background: "rgba(0,0,0,.12)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </Phone>
      </Center>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: glow }}>
        <Chip dark>
          <span style={{ width: 16, height: 16, borderRadius: "50%", background: K.acc }} /> o feed parou aqui
        </Chip>
      </div>
      <Cursor dark path={[[stop - 4, 900, 1500], [tap - 3, 560, 1020], [dur, 580, 1040]]} click={tap} />
    </Bg>
  );
};

const Vende: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const cuts = [0, Math.round(voz * 0.4), Math.round(voz * 0.6), Math.round(voz * 0.8)];
  const words = ["Motion design", "Explica.", "Prende.", "Vende."];
  const bgs = [K.dark, K.bg, K.dark, K.acc];
  const cols = ["#fff", K.ink, "#fff", "#fff"];
  return (
    <AbsoluteFill style={{ background: K.dark }}>
      {words.map((w, i) => {
        if (frame < cuts[i]) return null;
        const local = frame - cuts[i];
        const r = i === 0 ? 150 : interpolate(local, [0, 12], [0, 150], { ...cl, easing: INOUT });
        const tin = interpolate(local, [2, 12], [0, 1], { ...cl, easing: OUT });
        const next = cuts[i + 1];
        const tout = next !== undefined ? interpolate(frame, [next, next + 8], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }) : 0;
        return (
          <AbsoluteFill key={i} style={{ background: bgs[i], clipPath: `circle(${r}% at 50% 50%)` }}>
            {i % 2 === 0 ? <Dust n={30} /> : null}
            {i > 0 ? <div style={{ position: "absolute", left: 90, top: 300, fontFamily: F, fontWeight: 700, fontSize: 32, letterSpacing: "0.3em", color: cols[i], opacity: 0.55 }}>0{i} / 03</div> : null}
            <Center>
              <div style={{ fontFamily: F, fontWeight: 900, fontSize: i === 0 ? 150 : 230, textAlign: "center", letterSpacing: "-0.07em", color: cols[i], opacity: tin * (1 - tout), filter: `blur(${(1 - tin) * 16 + tout * 16}px)`, translate: `0 ${(1 - tin) * 120 - tout * 160}px`, scale: String(interpolate(local, [0, 40], [1.12, 1], { ...cl, easing: OUT })) }}>{w}</div>
            </Center>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/** três mini-exemplos com marcas fictícias */
const ExCafe: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: 30, config: { damping: 12 } });
  const steam = (k: number) => interpolate((frame + k * 10) % 40, [0, 40], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#3b2418", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
      <svg width={300} height={300} viewBox="0 0 24 24" style={{ scale: String(s) }}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${8 + k * 3} 7c-1-1.5 1-2.5 0-4`} stroke="#f3d8b5" strokeWidth={1} fill="none" strokeLinecap="round" opacity={1 - steam(k)} transform={`translate(0 ${-steam(k) * 2})`} />
        ))}
        <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2" fill="none" stroke="#f3d8b5" strokeWidth={1.4} />
      </svg>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 120, color: "#f3d8b5", opacity: s }}>Aurora Café</div>
      <div style={{ fontFamily: F, fontSize: 38, color: "#f3d8b5", opacity: interpolate(frame, [14, 26], [0, 1], cl) }}>novo blend · peça já</div>
    </AbsoluteFill>
  );
};
const ExClinica: React.FC = () => {
  const frame = useCurrentFrame();
  const slots = ["09:00", "10:30", "14:00", "16:30"];
  const pick = 2;
  const on = interpolate(frame, [22, 26], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#eaf4ff", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, fontFamily: F }}>
      <div style={{ fontWeight: 900, fontSize: 88, color: "#1856c9", letterSpacing: "-0.04em" }}>Clínica Vita</div>
      <div style={{ fontSize: 36, color: "#4a6a9a" }}>Agende sua consulta</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        {slots.map((t, i) => {
          const s = spring({ frame: frame - 4 - i * 3, fps: 30, config: { damping: 13 } });
          const sel = i === pick && on > 0.5;
          return <div key={t} style={{ padding: "26px 54px", borderRadius: 22, background: sel ? "#1856c9" : "#fff", color: sel ? "#fff" : "#1856c9", fontWeight: 800, fontSize: 44, scale: String(s * (sel ? 1.06 : 1)), boxShadow: "0 12px 30px rgba(24,86,201,.15)" }}>{t}</div>;
        })}
      </div>
      <div style={{ marginTop: 20, padding: "22px 50px", borderRadius: 999, background: "#20b26b", color: "#fff", fontWeight: 800, fontSize: 40, opacity: interpolate(frame, [30, 38], [0, 1], cl), scale: String(interpolate(frame, [30, 38], [0.7, 1], { ...cl, easing: OUT })) }}>✓ Confirmado</div>
    </AbsoluteFill>
  );
};
const ExResultados: React.FC = () => {
  const frame = useCurrentFrame();
  const v = Math.round(interpolate(frame, [4, 34], [0, 38], { ...cl, easing: OUT }));
  const R = 170;
  const Cc = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: K.dark, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, fontFamily: F }}>
      <div style={{ fontSize: 34, color: "rgba(255,255,255,.6)", letterSpacing: "0.2em", fontWeight: 700 }}>NORTE LOGÍSTICA · 2026</div>
      <div style={{ position: "relative", width: 420, height: 420 }}>
        <svg width={420} height={420} style={{ rotate: "-90deg" }}>
          <circle cx={210} cy={210} r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={40} />
          <circle cx={210} cy={210} r={R} fill="none" stroke={K.accL} strokeWidth={40} strokeLinecap="round" strokeDasharray={`${Cc * (v / 100) * 2} ${Cc}`} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 130, color: "#fff", letterSpacing: "-0.05em" }}>+{v}%</div>
      </div>
      <div style={{ fontSize: 44, fontWeight: 700, color: "#fff" }}>entregas no prazo</div>
    </AbsoluteFill>
  );
};
const Exemplos: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const cuts = [0, Math.round(voz * 0.2), Math.round(voz * 0.36)];
  const labels = ["Produto", "Serviço", "Resultados"];
  const EX = [ExCafe, ExClinica, ExResultados];
  const i = cuts.filter((c) => frame >= c).length - 1;
  const ent = spring({ frame, fps: 30, config: { damping: 16 } });
  const tilt = interpolate(frame, [0, dur], [-6, 4]);
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 16 }}>
        {labels.map((l, k) => {
          const on = interpolate(frame, [cuts[k], cuts[k] + 6], [0, 1], cl) * (k === i ? 1 : 0);
          return <Chip key={l} style={{ background: on > 0.5 ? K.ink : "#fff", color: on > 0.5 ? K.accL : K.ink, scale: String(1 + on * 0.08) }}>{l}</Chip>;
        })}
      </div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        <Center style={{ translate: "0 20px" }}>
          <Phone style={{ scale: String(0.8 + 0.2 * ent), translate: `0 ${(1 - ent) * 900}px`, transform: `rotateY(${tilt}deg) rotateX(4deg)` }}>
            {EX.map((E, k) => {
              if (frame < cuts[k] - 2) return null;
              const inn = k === 0 ? 1 : interpolate(frame, [cuts[k], cuts[k] + 12], [0, 1], { ...cl, easing: INOUT });
              const nxt = cuts[k + 1];
              const out = nxt !== undefined ? interpolate(frame, [nxt, nxt + 12], [0, 1], { ...cl, easing: INOUT }) : 0;
              return (
                <AbsoluteFill key={k} style={{ translate: `${(1 - inn) * 100 - out * 35}%`, filter: out > 0.01 ? `brightness(${1 - out * 0.4})` : undefined }}>
                  <Sequence from={cuts[k]} layout="none">
                    <E />
                  </Sequence>
                </AbsoluteFill>
              );
            })}
            <div style={{ position: "absolute", right: 30, top: 40, padding: "8px 18px", borderRadius: 999, background: "rgba(0,0,0,.35)", color: "#fff", fontFamily: F, fontSize: 20, fontWeight: 700, letterSpacing: "0.1em" }}>EXEMPLO</div>
          </Phone>
        </Center>
      </AbsoluteFill>
    </Bg>
  );
};

const RECURSOS = [
  { t: "Legendas dinâmicas", f: 0.05 },
  { t: "Efeitos sonoros", f: 0.2 },
  { t: "Narração", f: 0.36 },
  { t: "Reels e anúncios", f: 0.7 },
];
const Recursos: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  return (
    <Bg>
      <div style={{ position: "absolute", left: 90, top: 260 }}>
        <W text="Tudo incluso." start={2} every={5} size={130} align="left" width={900} italic={[1]} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 560, display: "flex", flexDirection: "column", gap: 26 }}>
        {RECURSOS.map((r, i) => {
          const at = Math.round(voz * r.f);
          const s = spring({ frame: frame - at + 6, fps: 30, config: { damping: 15 } });
          const on = interpolate(frame, [at, at + 6], [0, 1], { ...cl, easing: OUT });
          return (
            <div key={r.t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "36px 44px", borderRadius: 36, background: "#fff", boxShadow: "0 18px 44px rgba(0,0,0,.08)", opacity: s, translate: `${(1 - s) * 200}px 0`, fontFamily: F }}>
              <span style={{ fontWeight: 800, fontSize: 50, letterSpacing: "-0.03em", color: K.ink }}>{r.t}</span>
              <div style={{ width: 150, height: 84, borderRadius: 999, background: on > 0.5 ? K.ink : "#d9dbd5", position: "relative" }}>
                <div style={{ position: "absolute", top: 8, left: 8 + on * 66, width: 68, height: 68, borderRadius: "50%", background: on > 0.5 ? K.acc : "#fff", boxShadow: on > 0.5 ? `0 0 24px ${K.acc}` : "0 4px 10px rgba(0,0,0,.15)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </Bg>
  );
};

const Caro: React.FC<S> = ({ dur }) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [40, 52], [0, 1], { ...cl, easing: OUT });
  const t = interpolate(frame, [20, 30], [0, 1], { ...cl, easing: OUT });
  return (
    <Bg dark>
      <Dust n={40} />
      <Center style={{ gap: 30 }}>
        <W text="E o melhor:" start={0} every={4} size={80} color="rgba(255,255,255,.6)" weight={600} />
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 150, letterSpacing: "-0.06em", color: "#fff", textAlign: "center", lineHeight: 1, opacity: t, filter: `blur(${(1 - t) * 12}px)` }}>
          sem pagar
          <br />
          <span style={{ position: "relative", display: "inline-block", color: K.accL }}>
            caro.
            <span style={{ position: "absolute", left: -14, right: -14, top: "52%", height: 16, borderRadius: 8, background: "#fff", scale: `${strike} 1`, transformOrigin: "left" }} />
          </span>
        </div>
      </Center>
    </Bg>
  );
};

const Preco: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [18, 50], [0, Number(MARCA.preco)], { ...cl, easing: OUT }));
  const big = spring({ frame: frame - 16, fps: 30, config: { damping: 11 } });
  const card = spring({ frame: frame - 62, fps: 30, config: { damping: 13 } });
  return (
    <Bg dark glow={false}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 45% at 50% 42%, rgba(124,58,237,.28), transparent 70%)` }} />
      <Dust n={60} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: F }}>
        <W text="Criativos" start={0} every={4} size={110} color="#fff" />
        <div style={{ fontSize: 44, fontWeight: 600, color: "rgba(255,255,255,.65)", opacity: interpolate(frame, [8, 16], [0, 1], cl) }}>a partir de</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, color: K.accL, scale: String(big), textShadow: `0 0 60px rgba(124,58,237,.6)` }}>
          <span style={{ fontWeight: 800, fontSize: 90, marginTop: 50 }}>R$</span>
          <span style={{ fontWeight: 900, fontSize: 330, letterSpacing: "-0.07em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 1180, display: "flex", alignItems: "center", gap: 26, padding: "32px 40px", borderRadius: 34, background: "#fff", fontFamily: F, opacity: card, translate: `0 ${(1 - card) * 200}px`, boxShadow: "0 30px 70px rgba(0,0,0,.4)" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#20b26b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={50} height={50} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" /></svg>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 40, color: K.ink }}>Pedido confirmado</div>
          <div style={{ fontSize: 30, color: K.gray }}>Seu vídeo já entrou na produção</div>
        </div>
      </div>
    </Bg>
  );
};

const Entrega: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const steps = ["Briefing", "Roteiro", "Vídeo pronto"];
  const fill = interpolate(frame, [6, voz * 0.75], [0, 1], { ...cl, easing: INOUT });
  const msg1 = spring({ frame: frame - Math.round(voz * 0.55), fps: 30, config: { damping: 13 } });
  const msg2 = spring({ frame: frame - Math.round(voz * 0.85), fps: 30, config: { damping: 13 } });
  return (
    <Bg>
      <div style={{ position: "absolute", left: 90, right: 90, top: 250 }}>
        <W text="Do roteiro ao vídeo pronto." start={2} every={4} size={110} align="left" width={900} italic={[4]} />
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 720 }}>
        <div style={{ height: 14, borderRadius: 14, background: "#dfe1da" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 14, background: K.ink }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: -48 }}>
          {steps.map((s, i) => {
            const on = fill >= i / 2 - 0.01;
            return (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: i === 0 ? "flex-start" : i === 2 ? "flex-end" : "center", gap: 18 }}>
                <div style={{ width: 82, height: 82, borderRadius: "50%", background: on ? K.acc : "#fff", color: on ? "#fff" : K.ink, border: `6px solid ${on ? K.ink : "#dfe1da"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 34 }}>{i + 1}</div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 36, color: on ? K.ink : K.gray }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1030, display: "flex", flexDirection: "column", gap: 22, fontFamily: F }}>
        <div style={{ alignSelf: "flex-start", maxWidth: 700, padding: "26px 34px", borderRadius: "34px 34px 34px 8px", background: "#e4e6e0", fontSize: 42, fontWeight: 600, color: K.ink, scale: String(msg1), transformOrigin: "left bottom" }}>Já ficou pronto?!</div>
        <div style={{ alignSelf: "flex-end", maxWidth: 700, padding: "26px 34px", borderRadius: "34px 34px 8px 34px", background: K.ink, fontSize: 42, fontWeight: 700, color: K.accL, scale: String(msg2), transformOrigin: "right bottom" }}>Já! Olha só ▶</div>
      </div>
    </Bg>
  );
};

const CTA: React.FC<S> = ({ dur, voz }) => {
  const frame = useCurrentFrame();
  const click = Math.round(voz * 0.7);
  const btn = spring({ frame: frame - 4, fps: 30, config: { damping: 12 } });
  const pressed = interpolate(frame, [click - 2, click + 2, click + 8], [0, 1, 0], cl);
  const chat = spring({ frame: frame - click - 8, fps: 30, config: { damping: 15 } });
  const typed = "Quero um vídeo assim!".slice(0, Math.max(0, Math.floor((frame - click - 16) * 0.9)));
  const sent = frame > click + 44;
  return (
    <Bg dark>
      <Dust n={40} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <W text="Chama no direct." start={2} every={5} size={130} color="#fff" acc={[2]} accColor={K.accL} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", opacity: 1 - chat }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "38px 70px", borderRadius: 26, background: K.acc, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: 50, scale: String(btn * (1 - pressed * 0.08)), boxShadow: `0 0 70px rgba(124,58,237,.5)` }}>
          <svg width={52} height={52} viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-8z" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round" /></svg>
          Enviar mensagem
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 620, height: 640, borderRadius: 50, background: "#fff", opacity: chat, scale: String(0.85 + 0.15 * chat), padding: 40, boxSizing: "border-box", fontFamily: F, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 26, borderBottom: "2px solid #eee" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: K.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: K.acc }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 38 }}>{MARCA.arroba}</div>
        </div>
        <div style={{ flex: 1 }} />
        {sent ? <div style={{ alignSelf: "flex-end", padding: "24px 32px", borderRadius: "30px 30px 8px 30px", background: K.ink, color: "#fff", fontSize: 38, fontWeight: 600, marginBottom: 24 }}>Quero um vídeo assim!</div> : null}
        <div style={{ padding: "24px 30px", borderRadius: 999, background: "#f1f2ee", fontSize: 34, color: typed && !sent ? K.ink : K.gray }}>{sent ? "Mensagem…" : typed || "Mensagem…"}</div>
      </div>
      <Cursor dark path={[[8, 950, 1500], [click - 4, 640, 740], [dur, 660, 760]]} click={click} />
    </Bg>
  );
};

const Fim: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const click = 14;
  const ring = interpolate(frame, [click, click + 22], [0, 1], { ...cl, easing: OUT });
  const p = spring({ frame: frame - click - 2, fps: 30, config: { damping: 12 } });
  const sub = interpolate(frame, [click + 18, click + 32], [0, 1], { ...cl, easing: OUT });
  return (
    <Bg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", width: 1600 * ring * (1 - k * 0.35), height: 1600 * ring * (1 - k * 0.35), borderRadius: "50%", border: `${6 - k * 2}px solid ${K.acc}`, opacity: (1 - ring) * 0.8 }} />
        ))}
      </AbsoluteFill>
      <Center style={{ gap: 50 }}>
        <LogoMarca s={1} p={p} />
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 40, color: K.gray, opacity: sub }}>motion design para empresas</div>
        <Chip style={{ background: K.ink, color: K.accL, fontSize: 40, padding: "18px 40px", opacity: sub, translate: `0 ${(1 - sub) * 20}px` }}>{MARCA.arroba}</Chip>
      </Center>
      <Cursor path={[[0, 760, 1300], [click - 3, 560, 980], [dur, 600, 1050]]} click={click} />
    </Bg>
  );
};

// ------------------------------------------------------------------ linha do tempo
const GAP = 8;
const LEAD = 6;
const EXTRA: Record<string, number> = { gancho: 6, vende: 10, exemplos: 10, preco: 30, cta: 40 };
const NO_CAP = new Set(["gancho", "vende", "caro", "preco"]);
const FIM = 80;
const MAP: Record<string, { C: React.FC<S>; tr: string }> = {
  gancho: { C: Gancho, tr: "none" },
  feed: { C: Feed, tr: "whip" },
  vende: { C: Vende, tr: "zoom" },
  exemplos: { C: Exemplos, tr: "circle" },
  recursos: { C: Recursos, tr: "up" },
  caro: { C: Caro, tr: "zoom" },
  preco: { C: Preco, tr: "circle" },
  entrega: { C: Entrega, tr: "whip" },
  cta: { C: CTA, tr: "circle" },
};
export const PROMO_PLAN = (() => {
  let t = 0;
  return VO.map((v, i) => {
    const lead = i === 0 ? LEAD : 0;
    const dur = lead + v.voz + GAP + (EXTRA[v.id] ?? 0);
    const r = { ...v, from: t, dur, lead };
    t += dur;
    return r;
  });
})();
const last = PROMO_PLAN[PROMO_PLAN.length - 1];
export const PROMO_TOTAL = last.from + last.dur + FIM;

const OV = 9; // frames de sobreposição entre cenas
const Tr: React.FC<{ type: string; dur: number; children: React.ReactNode }> = ({ type, dur, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, OV + 3], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const o = interpolate(frame, [0, 5], [0, 1], cl);
  let style: React.CSSProperties = { opacity: type === "none" ? 1 : o };
  if (type === "zoom") style = { ...style, scale: String(1 + 0.25 * t), filter: t > 0.01 ? `blur(${t * 20}px)` : undefined };
  if (type === "up") style = { ...style, translate: `0 ${t * 600}px`, filter: t > 0.01 ? `blur(${t * 20}px)` : undefined };
  if (type === "whip") style = { ...style, translate: `${t * 800}px 0`, filter: t > 0.01 ? `blur(${t * 26}px)` : undefined };
  const clip = type === "circle" ? `circle(${interpolate(frame, [0, OV + 4], [0, 150], { ...cl, easing: INOUT })}% at 50% 55%)` : undefined;
  // câmera sempre em movimento + saída com desfoque
  const drift = interpolate(frame, [0, dur], [1, 1.035]);
  const ex = interpolate(frame, [dur - OV, dur], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", clipPath: clip }}>
      <AbsoluteFill style={{ ...style, opacity: (style.opacity as number) ?? 1 }}>
        <AbsoluteFill style={{ scale: String(drift * (1 + ex * 0.06)), filter: ex > 0.01 ? `blur(${ex * 10}px)` : undefined }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "multiply", pointerEvents: "none", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${frame % 6}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }} />;
};

export const PromoVideo: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    {PROMO_PLAN.map((s, i) => {
      const M = MAP[s.id];
      const ov = i === 0 ? 0 : OV; // a cena entra "ov" frames antes, por cima da anterior
      return (
        <Sequence key={s.id} from={s.from - ov} durationInFrames={s.dur + ov + OV} name={s.id}>
          <Tr type={M.tr} dur={s.dur + ov + OV}>
            <M.C dur={s.dur + ov} voz={s.lead + s.voz + ov} />
          </Tr>
          {!NO_CAP.has(s.id) ? (
            <Sequence from={ov + s.lead} durationInFrames={s.dur} layout="none">
              <Caption text={s.leg} voz={s.voz} />
            </Sequence>
          ) : null}
          <Sequence from={ov + s.lead} layout="none">
            <Audio src={staticFile(`promo/vo/${s.f}.wav`)} />
          </Sequence>
        </Sequence>
      );
    })}
    <Sequence from={last.from + last.dur - OV} durationInFrames={FIM + OV}>
      <Tr type="circle" dur={FIM + 60}>
        <Fim dur={FIM} />
      </Tr>
    </Sequence>
    <Grain />
    <Audio src={staticFile("promo/musica.wav")} volume={0.9} />
    <Audio src={staticFile("promo/efeitos.wav")} volume={0.85} />
  </AbsoluteFill>
);
