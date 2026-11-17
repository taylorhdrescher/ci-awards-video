"""Narração do vídeo de apresentação do perfil (vende o serviço de motion). Gera public/promo/vo/*.wav + src/promo/vo.json"""
import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
L = [
 ("gancho", "Sua empresa ainda posta vídeo assim?", "Sua empresa ainda posta vídeo assim?"),
 ("feed", "Enquanto isso, quem usa motion design faz as pessoas pararem de rolar o feed.", "Enquanto isso, quem usa motion design faz as pessoas pararem de rolar o feed."),
 ("vende", "Motion design explica, prende e vende.", "Motion design explica, prende e vende."),
 ("exemplos", "Seu produto, seu serviço ou os resultados da sua empresa, contados em poucos segundos.", "Seu produto, seu serviço ou os resultados da sua empresa, contados em poucos segundos."),
 ("recursos", "Com legendas dinâmicas, efeitos sonoros e narração. Pronto para reels e anúncios.", "Com legendas dinâmicas, efeitos sonoros e narração. Pronto para reels e anúncios."),
 ("caro", "E o melhor: você não precisa pagar caro por isso.", "E o melhor: você não precisa pagar caro por isso."),
 ("preco", "Criativos a partir de duzentos e noventa e sete reais.", "Criativos a partir de R$ 297."),
 ("entrega", "Do roteiro ao vídeo pronto, com entrega rápida.", "Do roteiro ao vídeo pronto, com entrega rápida."),
 ("cta", "Chama no direct e peça o seu.", "Chama no direct e peça o seu."),
]
out = []
for i, (id_, fala, leg) in enumerate(L):
    s, sr = k.create(fala, voice="pm_alex", speed=1.15, lang="pt-br")
    nz = np.where(np.abs(s) > 0.01)[0]; s = s[max(0, nz[0] - 300): nz[-1] + 900]
    sf.write("public/promo/vo/tmp.wav", s, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/promo/vo/tmp.wav", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"public/promo/vo/P{i:02d}.wav"], check=True)
    out.append({"id": id_, "f": f"P{i:02d}", "leg": leg, "voz": round(len(s) / sr * 30)})
subprocess.run(["rm", "public/promo/vo/tmp.wav"])
json.dump(out, open("src/promo/vo.json", "w"), ensure_ascii=False, indent=1)
for o in out: print(o["id"], o["voz"])
