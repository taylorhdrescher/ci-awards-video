"""Narração do vídeo-teste (voz Kokoro pm_alex, offline).
Gera public/teste/vo/Lxx.wav, public/teste/narracao.wav e src/teste/timeline.json.
'fala' = texto falado (números por extenso); 'cena' = qual cena visual usa a frase.
"""
import json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

FPS = 30
GAP = 0.22  # pausa entre frases (s)
LINES = [
  ("abre1",   "Melhoria contínua não é um projeto."),
  ("abre2",   "É um jeito de trabalhar."),
  ("busca",   "E em Montenegro, esse jeito tem nome."),
  ("logo",    "Cê í duzentos."),
  ("presente","A gente está presente."),
  ("tela",    "No Gemba. Na gestão diária. Ao lado de cada time."),
  ("educa",   "A gente educa, com o pensamento A3 e o Ver e Agir."),
  ("inclui",  "E inclui todo mundo, em todas as áreas."),
  ("pergunta","E o resultado disso, no ano fiscal vinte e seis?"),
  ("num1",    "Seis mil e sessenta e seis projetos concluídos."),
  ("num2",    "E mais dois mil, novecentos e setenta e oito em andamento."),
  ("widgets", "Quinhentos e oitenta mil minutos de produtividade. Três milhões de reais em custos. E cinco mil, setecentos e dezesseis pontos de RPN em segurança."),
  ("virada",  "Mas nenhum número acontece sozinho."),
  ("trimestre","A cada trimestre, os destaques de A3 e de Ver e Agir são reconhecidos."),
  ("eventos", "E nas feiras e eventos, a melhoria contínua aparece para todo mundo."),
  ("palavras","Melhorar. Avançar. Reconhecer. Celebrar."),
  ("mentor",  "E para fechar, a palavra do nosso mentor, Mércio Ruiz."),
  ("pessoas", "Porque melhoria contínua é feita de pessoas."),
  ("final",   "Isso é o CI Awards."),
]
EXTRA = {"mentor": 4.5, "logo": 0.6, "final": 3.5, "palavras": 0.6, "num1": 0.4, "num2": 0.3}  # respiro visual extra (s)

k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
SR = 24000
t = 0.6
timeline, full = [], []
full.append(np.zeros(int(t * SR)))
for i, (cena, fala) in enumerate(LINES):
    s, sr = k.create(fala, voice="pm_alex", speed=1.08, lang="pt-br")
    s = s.astype(np.float32)
    # corta silêncio das pontas
    nz = np.where(np.abs(s) > 0.01)[0]
    s = s[max(0, nz[0] - 400): nz[-1] + 1200]
    d = len(s) / SR
    sf.write(f"public/teste/vo/L{i:02d}.wav", s, SR)
    start = t
    t += d + GAP + EXTRA.get(cena, 0)
    timeline.append({"cena": cena, "texto": fala, "from": round(start * FPS), "voz": round(d * FPS), "dur": round((t - start) * FPS)})
    full.append(s); full.append(np.zeros(int((t - start - d) * SR)))
audio = np.concatenate(full)
sf.write("public/teste/narracao.wav", audio, SR)
json.dump({"total": round(t * FPS) + 15, "linhas": timeline}, open("src/teste/timeline.json", "w"), ensure_ascii=False, indent=1)
print("total s", t)
for l in timeline: print(l["cena"], l["from"], l["voz"], l["dur"])
