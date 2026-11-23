/**
 * Transição "Lâminas de luz" com o logo CI200 branco — overlay com fundo TRANSPARENTE (3 s).
 *   0–16   sete lâminas diagonais verde-escuras sobem em cascata e cobrem a tela (fio dourado nas bordas)
 *  12–48   o logo CI200 branco se monta (animação original: pessoas → engrenagem → fábrica/folhas → mãos → texto)
 *  48–58   reflexo de luz atravessa o logo
 *  64–86   o logo se dissolve e as lâminas continuam subindo, revelando a próxima cena de baixo para cima
 * Tela totalmente coberta entre os quadros 16 e 66: troque a cena de baixo por volta do quadro 40.
 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const LAMINAS_DUR = 90;
export const LAMINAS_TROCA = 40;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const N = 7;
const SKEW = -14;
const LAST = 141;
const LW = 740;
const LH = 845;

const seq = (i: number) => staticFile(`ci200seq/f${String(i).padStart(3, "0")}.png`);

export const TransicaoLaminas: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const V = H > W;
  const k = Math.min(W, H) / 1080;

  // ---------- lâminas
  const bw = (W / N) * 1.32; // um pouco mais largas que a divisão, por causa da inclinação
  const travel = H * 1.25;
  const bars = Array.from({ length: N + 2 }, (_, j) => {
    const i = j - 1; // uma lâmina extra em cada lado cobre os cantos (por causa da inclinação)
    const order = j; // cascata da esquerda para a direita
    const tin = interpolate(frame, [order * 1.6, order * 1.6 + 12], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
    const tout = interpolate(frame, [64 + order * 1.8, 64 + order * 1.8 + 12], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
    const y = tin * travel - tout * travel;
    const speed = Math.abs(interpolate(frame + 1, [order * 1.6, order * 1.6 + 12], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) }) - tin) + Math.abs(interpolate(frame + 1, [64 + order * 1.8, 64 + order * 1.8 + 12], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }) - tout);
    return { i, y, blur: Math.min(10, speed * 60), shade: 0.06 * ((i * 3) % 4) };
  });
  const covered = frame >= 16 && frame <= 66;

  // ---------- logo
  const src = Math.round(interpolate(frame, [12, 22, 30, 40, 48], [0, 48, 76, 118, LAST], cl));
  const logoH = (V ? 700 : 640) * k * (V ? 1 : 1);
  const logoW = (LW / LH) * logoH;
  const logoIn = interpolate(frame, [12, 16], [0, 1], cl);
  const logoOut = interpolate(frame, [62, 70], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  const glint = interpolate(frame, [48, 60], [-40, 140], { ...cl, easing: Easing.inOut(Easing.quad) });
  const pop = interpolate(frame, [46, 50, 58], [0, 1, 0], cl);
  const breathe = interpolate(frame, [48, 64], [1, 1.025], cl);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* lâminas */}
      {bars.map(({ i, y, blur, shade }) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * (W / N) - bw * 0.16,
            top: -H * 0.1,
            width: bw,
            height: H * 1.2,
            transform: `translateY(${y}px) skewX(${SKEW}deg)`,
            background: `linear-gradient(180deg, rgba(14,34,19,1) 0%, rgba(${8 + shade * 60},${20 + shade * 80},${12 + shade * 50},1) 50%, rgba(5,12,8,1) 100%)`,
            filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
          }}
        >
          {/* fios dourados nas bordas de cima e de baixo + brilho lateral */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4.5 * k, background: "#ffe08a", boxShadow: `0 0 ${26 * k}px 5px rgba(240,207,99,.85)` }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4.5 * k, background: "#ffe08a", boxShadow: `0 0 ${26 * k}px 5px rgba(240,207,99,.85)` }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 1.5, background: "rgba(240,207,99,.18)" }} />
        </div>
      ))}

      {/* brilho central por trás do logo (só com a tela coberta) */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 40% 45% at 50% 50%, rgba(60,120,55,${0.45 * logoIn * (1 - logoOut)}), transparent 70%)`, opacity: covered || frame < 70 ? 1 : 0 }} />

      {/* logo CI200 branco se montando */}
      {frame >= 12 && frame < 72 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: logoW, height: logoH, opacity: logoIn * (1 - logoOut), scale: String(breathe * (1 + 0.12 * logoOut)), filter: `blur(${logoOut * 14}px)` }}>
            <Img src={seq(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: `drop-shadow(0 0 ${(10 + 20 * pop) * k}px rgba(255,255,255,${0.35 + 0.45 * pop})) drop-shadow(0 0 ${40 * k}px rgba(240,207,99,${0.25 + 0.3 * pop}))` }} />
            {/* reflexo de luz atravessando o logo */}
            {glint > -40 && glint < 140 ? (
              <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${seq(LAST)})`, maskImage: `url(${seq(LAST)})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", background: `linear-gradient(115deg, transparent ${glint - 18}%, rgba(255,240,190,.95) ${glint}%, transparent ${glint + 18}%)` }} />
            ) : null}
            <Img src={seq(LAST)} style={{ position: "absolute", width: 2, height: 2, opacity: 0 }} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* faíscas que sobem depois da montagem */}
      {frame >= 46 && frame < 72
        ? Array.from({ length: 36 }, (_, i) => {
            const t = frame - 46;
            const x = W / 2 + (random(`x${i}`) - 0.5) * logoW * 1.6;
            const y = H / 2 + (random(`y${i}`) - 0.3) * logoH - t * (2 + random(`v${i}`) * 5) * k;
            const o = interpolate(t, [0, 4, 22], [0, 1, 0], cl) * (1 - logoOut);
            const s = (3 + random(`s${i}`) * 4) * k;
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#fff4cf", boxShadow: `0 0 ${10 * k}px rgba(240,207,99,.9)`, opacity: o }} />;
          })
        : null}
    </AbsoluteFill>
  );
};

/** Prévia: as lâminas por cima de duas cenas de exemplo (troca no quadro 40). */
export const TransicaoLaminasPrevia: React.FC = () => {
  const frame = useCurrentFrame();
  const pre = 30;
  const a = frame - pre < LAMINAS_TROCA;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(a ? "img/reconhecimento-grupo.jpg" : "img/m-evento-premiacao.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.05 + frame * 0.0004), filter: "brightness(.85)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,11,7,.75), transparent 60%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: "7%", fontFamily: "sans-serif", fontWeight: 800, fontSize: 110, color: "#f2cf63" }}>{a ? "CENA ANTERIOR" : "PRÓXIMA CENA"}</AbsoluteFill>
      <Sequence from={pre} durationInFrames={LAMINAS_DUR}>
        <TransicaoLaminas />
      </Sequence>
    </AbsoluteFill>
  );
};
