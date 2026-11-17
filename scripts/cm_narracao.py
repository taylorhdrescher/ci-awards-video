"""Clique Motion — vídeo de apresentação (versão profissional). Narração gerada FRASE A FRASE
para as legendas ficarem sincronizadas. Gera public/cm/vo/*.wav e src/cm/roteiro.json"""
import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
# cena: [(fala, legenda exibida)]
R = [
 ("gancho", [("Seu cliente decide", "Seu cliente decide"), ("em três segundos.", "em 3 segundos.")]),
 ("rolagem", [("Se o seu conteúdo não prende,", "Se o seu conteúdo não prende,"), ("ele passa direto.", "ele passa direto.")]),
 ("virada", [("É aqui que entra", "É aqui que entra"), ("a Clique Motion.", "a Clique Motion.")]),
 ("explica", [("Vídeos animados que explicam o seu produto,", "Vídeos animados que explicam o seu produto,"), ("valorizam o seu serviço", "valorizam o seu serviço"), ("e mostram os seus resultados.", "e mostram os seus resultados.")]),
 ("pacote", [("Roteiro, design, animação,", "Roteiro, design, animação,"), ("trilha e legendas.", "trilha e legendas."), ("Tudo num só lugar.", "Tudo num só lugar.")]),
 ("formatos", [("Pronto pra Reels, Stories e anúncios.", "Pronto pra Reels, Stories e anúncios.")]),
 ("preco", [("E cabe no seu bolso:", "E cabe no seu bolso:"), ("a partir de duzentos e noventa e sete reais.", "a partir de R$ 297.")]),
 ("cta", [("Chama no direct", "Chama no direct"), ("e dá o primeiro clique.", "e dá o primeiro clique.")]),
]
out = []; n = 0
for cena, frases in R:
    fs = []
    for fala, leg in frases:
        s, sr = k.create(fala, voice="pm_alex", speed=1.1, lang="pt-br")
        nz = np.where(np.abs(s) > 0.012)[0]; s = s[max(0, nz[0] - 200): nz[-1] + 700]
        # pequenas pausas internas viram referência de palavra: envelope p/ alinhamento aproximado
        sf.write("public/cm/vo/tmp.wav", s, sr)
        name = f"V{n:02d}"; n += 1
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/cm/vo/tmp.wav", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"public/cm/vo/{name}.wav"], check=True)
        fs.append({"f": name, "leg": leg, "frames": round(len(s) / sr * 30)})
    out.append({"id": cena, "frases": fs})
subprocess.run(["rm", "public/cm/vo/tmp.wav"])
json.dump(out, open("src/cm/roteiro.json", "w"), ensure_ascii=False, indent=1)
for c in out: print(c["id"], [f["frames"] for f in c["frases"]])
