# CI Awards 2026 — v7 (projeto Remotion)

Composição principal: **CIAwardsV6** (gera o "CI Awards 2026: v7", 1920x1080, 30 fps, 2:32).
- Cenas: `src/v6/cenas.tsx` · montagem/tempos: `src/v6/V6.tsx` · textos e dados: `src/content.ts`
- Kit visual (fontes, BlurWords, Footage, Widget, Cursor…): `src/teste/kit.tsx`; "PRESENTE" com máscara: `src/mix/novas.tsx`
- Trilha/efeitos: `public/audio/trilha.wav` e `public/audio/efeitos.wav` (sincronizados com as durações da v5/v6 — não mudar as durações em `SCENES` sem regenerar).
- Imagens de fundo lentas: `public/vid/fundo-lento.mp4` (60% da velocidade de `fundo.mp4`; o parâmetro `at` usa segundos do fundo original).

## Rodar
```bash
npm i
npx remotion studio
npx remotion render CIAwardsV6 out/CI-Awards-2026-v8.mp4 --crf=19
```
Outras composições em `src/Root.tsx` (Clique Motion, FK, Eduardo…) referenciam arquivos que NÃO estão neste pacote; use só a CIAwardsV6.

Licença: Remotion é gratuito para pessoas físicas e empresas de até 3 pessoas; empresas maiores precisam de licença (remotion.pro).

---

# V8 — linguagem nova (cinética, cortes na batida) · horizontal + vertical

Composições **CIAwardsV8** (1920x1080) e **CIAwardsV8Vertical** (1080x1920), 30 fps, 2:12 (3960 quadros).
- Ponto de entrada só da V8 (não carrega as composições antigas): `src/v8/index.ts`
- Kit (campos de cor, Pop/Rise/Chars, Morph, Ring3D, Cursor, Shot, Burst…): `src/v8/kit.tsx`
- Cenas: `src/v8/cenas1.tsx` (abertura, estar presente, educar), `cenas2.tsx` (resultados), `cenas3.tsx` (reconhecimento, eventos, depoimento, final)
- Blocos e tempos: `src/v8/V8.tsx` — tudo em múltiplos de 60 quadros (1 compasso a 120 BPM).
- Trilha nova: `scripts/trilha8.py` → `public/audio/trilha8.wav`; efeitos sincronizados com os cortes: `scripts/sfx8.py` → `public/audio/sfx8.wav`.
  Se mudar tempos de cena, ajuste as listas de quadros em `sfx8.py` e regenere.
- Mídias que ainda não estão em `public/` aparecem como espaço reservado verde com o nome do arquivo.
  Depois de copiar mídias para `public/`, rode `node scripts/assets.mjs` (atualiza `src/v8/assets.json`).

```bash
node scripts/assets.mjs
npx remotion studio src/v8/index.ts
npx remotion render src/v8/index.ts CIAwardsV8 out/CI-Awards-2026-v8.mp4 --crf=19
npx remotion render src/v8/index.ts CIAwardsV8Vertical out/CI-Awards-2026-v8-vertical.mp4 --crf=19
# áudio
python3 scripts/trilha8.py && fluidsynth -ni -g 0.6 -r 44100 -F scripts/trilha8-raw.wav /usr/share/sounds/sf2/FluidR3_GM.sf2 scripts/trilha8.mid \
  && ffmpeg -y -i scripts/trilha8-raw.wav -t 132 -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=129.5:d=2.5" public/audio/trilha8.wav
python3 scripts/sfx8.py
```
