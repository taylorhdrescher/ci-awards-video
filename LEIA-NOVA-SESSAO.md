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
