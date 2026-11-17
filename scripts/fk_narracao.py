"""Narração do FK v2 (Kokoro pm_alex). Gera public/fk/vo/Fxx.wav + src/fk/vo.json (falas, legendas e durações)."""
import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
# (id, texto falado, legenda exibida)
L = [
 ("anos", "Você levou anos para construir o seu patrimônio.", "Você levou anos para construir o seu patrimônio."),
 ("pergunta", "Mas me responde uma coisa:", "Mas me responde uma coisa:"),
 ("caos", "ele tem uma estratégia... ou só um monte de decisões soltas?", "ele tem uma estratégia… ou só um monte de decisões soltas?"),
 ("dores", "Dinheiro que entra e some. Investimentos sem direção. Seguros que talvez não protejam o que importa.", "Dinheiro que entra e some. Investimentos sem direção. Seguros que talvez não protejam o que importa."),
 ("isoladas", "Decisões isoladas não formam uma estratégia.", "Decisões isoladas não formam uma estratégia."),
 ("marca", "É aqui que entra a FK Wealth Planner.", "É aqui que entra a FK Wealth Planner."),
 ("pilares", "Planejamento, investimentos, proteção e sucessão. Tudo conectado, em uma única estrutura.", "Planejamento, investimentos, proteção e sucessão. Tudo conectado, em uma única estrutura."),
 ("entregas", "Você recebe um diagnóstico completo, um plano de ação claro e um painel para acompanhar cada passo.", "Você recebe um diagnóstico completo, um plano de ação claro e um painel para acompanhar cada passo."),
 ("independencia", "Sem comissão de bancos. Sem conflito de interesse. Só o que faz sentido para você.", "Sem comissão de bancos. Sem conflito de interesse. Só o que faz sentido para você."),
 ("felipe", "Com Felipe Kerber, consultor financeiro certificado CEA.", "Com Felipe Kerber, consultor financeiro certificado CEA."),
 ("merece", "Seu patrimônio merece uma estratégia.", "Seu patrimônio merece uma estratégia."),
 ("cta", "Agende agora a sua reunião estratégica. Sem compromisso.", "Agende agora a sua reunião estratégica. Sem compromisso."),
]
out = []
for i, (id_, fala, leg) in enumerate(L):
    s, sr = k.create(fala, voice="pm_alex", speed=1.12, lang="pt-br")
    nz = np.where(np.abs(s) > 0.01)[0]; s = s[max(0, nz[0] - 300): nz[-1] + 900]
    tmp = f"public/fk/vo/tmp.wav"; sf.write(tmp, s, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"public/fk/vo/F{i:02d}.wav"], check=True)
    out.append({"id": id_, "f": f"F{i:02d}", "leg": leg, "voz": round(len(s) / sr * 30)})
subprocess.run(["rm", "public/fk/vo/tmp.wav"])
json.dump(out, open("src/fk/vo.json", "w"), ensure_ascii=False, indent=1)
for o in out: print(o["id"], o["voz"])
