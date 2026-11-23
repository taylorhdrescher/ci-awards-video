/**
 * Transição com o logo CI200 branco — mesmo movimento e tempo da "transicao-luz-lenta-transparente.webm"
 * (que usava o mascote). Fundo TRANSPARENTE: é um overlay para colocar entre duas cenas.
 *   0–13  íris: ponto de luz cresce até cobrir a tela (borda dourada fina)
 *  11–41  arcos branco / amarelo / verde girando e se contraindo
 *  41–45  clarão
 *  43–70  logo CI200 branco surge com brilho
 *  70–79  íris se abre (buraco transparente) revelando a próxima cena
 *  79–108 transparente
 * A cena de baixo pode ser trocada no meio (quadro ~45), quando a tela está totalmente coberta (quadros 13–70).
 */
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence as Seq, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const TRANSICAO_DUR = 108;
export const TRANSICAO_TROCA = 45; // quadro seguro para trocar a cena de baixo
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#e6c63f";
const ARC_COLORS = ["#f1f1ec", "#e6c63f", "#6fbf45"];

export const TransicaoCI200: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const k = Math.max(W, H) / 1920; // escala para 9:16
  const cover = Math.hypot(W, H) / 2 + 40;

  // ---------- íris de entrada (raio do círculo escuro) e de saída (raio do buraco)
  const rIn = interpolate(frame, [0, 3, 5, 7, 9, 10, 11, 12, 13], [2, 6, 80, 160, 305, 530, 680, 900, cover / k].map((v) => v * k), { ...cl, easing: Easing.in(Easing.quad) });
  const rOut = interpolate(frame, [70, 71, 72, 73, 74, 75, 76, 77, 78, 79], [0, 176, 240, 320, 416, 520, 760, 950, 1150, cover / k].map((v) => v * k), cl);
  const opening = frame >= 70;
  const gone = frame >= 79;
  if (gone) return <AbsoluteFill />;

  const mask = opening
    ? `radial-gradient(circle at 50% 50%, transparent ${rOut}px, #000 ${rOut + 1.5}px)`
    : `radial-gradient(circle at 50% 50%, #000 ${rIn}px, transparent ${rIn + 1.5}px)`;
  const rimR = opening ? rOut : rIn;
  const rimOn = (frame <= 13 || (opening && frame < 79)) && rimR > 0;

  // ---------- arcos
  const rArc = interpolate(frame, [11, 18, 27, 30, 36, 41], [650, 480, 330, 250, 180, 160].map((v) => v * k), { ...cl, easing: Easing.out(Easing.quad) });
  const arcO = Math.min(interpolate(frame, [10, 17], [0.25, 1], cl), interpolate(frame, [42, 47], [1, 0], cl));

  // ---------- clarão e logo
  const flash = interpolate(frame, [39, 42, 47], [0, 1, 0], cl);
  const logoIn = interpolate(frame, [43, 48], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const logoOut = interpolate(frame, [68, 71], [0, 1], cl);
  const halo = interpolate(frame, [42, 48, 62], [0, 1, 0.6], cl);
  const logoH = (H > W ? 760 : 720) * (H > W ? 1 : k);

  return (
    <AbsoluteFill>
      {/* "tela" escura que cobre a cena de baixo, recortada pela íris */}
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <AbsoluteFill style={{ background: "#040906" }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(34,74,38,.75), rgba(14,32,18,.55) 35%, rgba(4,9,6,0) 70%)" }} />

        {/* arcos girando e se contraindo */}
        {arcO > 0 ? (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: arcO }}>
            {ARC_COLORS.map((c, i) => {
              const r = rArc * (1 + (i - 1) * 0.018);
              const L = 2 * Math.PI * r;
              const rot = (i % 2 ? -1 : 1) * frame * (7 + i * 2.5) + i * 120;
              const seg = [0.27, 0.21, 0.24][i];
              return (
                <g key={c} transform={`rotate(${rot} ${W / 2} ${H / 2})`}>
                  <circle cx={W / 2} cy={H / 2} r={r} fill="none" stroke={c} strokeWidth={5 * k} strokeLinecap="round" strokeDasharray={`${L * seg} ${L * (0.5 - seg)} ${L * seg * 0.55} ${L * (0.5 - seg * 0.55)}`} style={{ filter: `drop-shadow(0 0 ${8 * k}px ${c})` }} />
                </g>
              );
            })}
          </svg>
        ) : null}

        {/* clarão */}
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,248,215,${flash}), rgba(240,214,90,${0.55 * flash}) ${12 * k}%, transparent ${38 * k}%)` }} />

        {/* halo + logo CI200 branco */}
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 48%, rgba(236,206,80,${0.38 * halo}), rgba(236,206,80,${0.12 * halo}) 25%, transparent 45%)` }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Img
            src={staticFile("v10/ci200-branco.png")}
            style={{
              height: logoH,
              opacity: logoIn * (1 - logoOut),
              scale: String((1.1 - 0.1 * logoIn) * (1 - 0.35 * logoOut) * interpolate(frame, [48, 70], [1, 1.03], cl)),
              filter: `blur(${(1 - logoIn) * 14 + logoOut * 8}px) drop-shadow(0 0 ${18 * k}px rgba(255,236,160,${0.35 + 0.4 * halo})) drop-shadow(0 0 ${50 * k}px rgba(236,206,80,${0.35 * halo}))`,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* borda dourada fina da íris */}
      {rimOn ? (
        <div style={{ position: "absolute", left: W / 2 - rimR, top: H / 2 - rimR, width: rimR * 2, height: rimR * 2, borderRadius: "50%", border: `${Math.max(1.5, 2.5 * k)}px solid ${GOLD}`, boxShadow: `0 0 ${14 * k}px rgba(230,198,63,.65), inset 0 0 ${14 * k}px rgba(230,198,63,.35)`, boxSizing: "border-box", opacity: opening ? 0.9 : interpolate(frame, [0, 2], [0.6, 1], cl) }} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Prévia: a transição por cima de duas cenas de exemplo (troca no quadro 45). */
export const TransicaoCI200Previa: React.FC = () => {
  const frame = useCurrentFrame();
  const pre = 30;
  const f = frame - pre;
  const a = f < TRANSICAO_TROCA;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(a ? "img/reconhecimento-grupo.jpg" : "img/m-evento-premiacao.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.05 + frame * 0.0004), filter: "brightness(.85)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,11,7,.75), transparent 60%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: "7%", fontFamily: "sans-serif", fontWeight: 800, fontSize: 110, color: "#f2cf63", letterSpacing: "0.02em" }}>{a ? "CENA ANTERIOR" : "PRÓXIMA CENA"}</AbsoluteFill>
      {f >= 0 ? (
        <AbsoluteFill>
          <Seq from={pre}>
            <TransicaoCI200 />
          </Seq>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
