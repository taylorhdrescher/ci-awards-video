"""Narração do Clique Motion v4 (roteiro novo). Gera public/promo4/vo/*.wav + src/promo/vo4.json"""
import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
L = [
 ("tres", "Você tem três segundos."),
 ("decide", "É o tempo que alguém leva pra decidir se para no seu post, ou continua rolando."),
 ("parado", "E post parado... quase ninguém vê."),
 ("concorrente", "Enquanto isso, o seu concorrente aparece em movimento."),
 ("solucao", "A Clique Motion transforma o seu negócio em vídeo que prende, explica e vende."),
 ("pacote", "Roteiro, animação, legendas, trilha e narração. Pronto pra reels, stories e anúncios."),
 ("funil", "Mais atenção. Mais cliques. Mais clientes."),
 ("preco", "E não custa caro: criativos a partir de duzentos e noventa e sete reais."),
 ("cta", "Chama no direct, e faça a sua marca ser o motivo da pausa."),
]
out = []
for i, (id_, fala) in enumerate(L):
    s, sr = k.create(fala, voice="pm_alex", speed=1.12, lang="pt-br")
    nz = np.where(np.abs(s) > 0.01)[0]; s = s[max(0, nz[0] - 300): nz[-1] + 900]
    sf.write("public/promo4/vo/tmp.wav", s, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/promo4/vo/tmp.wav", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"public/promo4/vo/Q{i:02d}.wav"], check=True)
    out.append({"id": id_, "f": f"Q{i:02d}", "voz": round(len(s) / sr * 30)})
subprocess.run(["rm", "public/promo4/vo/tmp.wav"])
json.dump(out, open("src/promo/vo4.json", "w"), ensure_ascii=False, indent=1)
for o in out: print(o["id"], o["voz"])
