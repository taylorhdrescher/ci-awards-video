# CI Awards 2026 — Motion institucional (Remotion)

## Estrutura (≈ 2:32, 1920×1080, 30 fps)
| # | Cena | Arquivo |
|---|------|---------|
| 1 | Abertura — CI200 → CI Awards | `src/scenes/S1Abertura.tsx` |
| 2 | 01 Estar presente (carrossel de vídeos) | `src/scenes/S2Presente.tsx` |
| 3 | 02 Educar · Incluir · Inspirar | `src/scenes/S3Educar.tsx` |
| 4 | 03 Resultados FY26 (totais, pilares, detalhes) | `src/scenes/S4Resultados.tsx` |
| 5 | Melhorar · Avançar · Reconhecer · Celebrar + 04 Destaques trimestrais | `src/scenes/S5Reconhecimento.tsx` |
| 6 | 05 Feiras e eventos (carrossel 3D) | `src/scenes/S6Eventos.tsx` |
| 7 | 06 Depoimento Mercio Ruyz + Encerramento | `src/scenes/S7S8Final.tsx` |

Duração de cada cena: `src/Video.tsx` (lista `SCENES`).

## Como editar
- **Textos, números, fotos e vídeos:** tudo em `src/content.ts`.
- **Vídeo de fundo:** copie para `public/vid/fundo.mp4` e defina `VIDEO_FUNDO = "vid/fundo.mp4"`.
- **Depoimento:** copie para `public/vid/depoimento-mercio.mp4` e preencha `DEPOIMENTO.video`.
- Fotos novas: `public/img/`. Vídeos novos: `public/vid/` (adicione a duração em `VIDEO_LEN` em `src/components/ui.tsx`).

## Comandos
```bash
npm i
npx remotion studio            # pré-visualização interativa
npx remotion render CIAwards out/CI-Awards-2026.mp4 --crf=18
```

Licença: o Remotion é gratuito para pessoas físicas e empresas de até 3 pessoas; para uso por empresas maiores é necessária uma licença de empresa (remotion.pro).
