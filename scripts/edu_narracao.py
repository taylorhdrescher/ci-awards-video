"""Eduardo Veículos — narração frase a frase (pm_alex). Gera public/edu/vo/*.wav e src/eduardo/roteiro.json"""
import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
R = [
 ("gancho", [("Procurando o seu próximo carro?", "Procurando o seu próximo carro?")]),
 ("dor", [("Chega de anúncio duvidoso", "Chega de anúncio duvidoso"), ("e carro sem procedência.", "e carro sem procedência.")]),
 ("marca", [("Na Eduardo Veículos, em Montenegro,", "Na Eduardo Veículos, em Montenegro,")]),
 ("estoque", [("você encontra estoque selecionado", "você encontra estoque selecionado"), ("e com garantia.", "e com garantia.")]),
 ("pagamento", [("Financiamento facilitado", "Financiamento facilitado"), ("e pagamento no cartão de crédito.", "e pagamento no cartão de crédito.")]),
 ("troca", [("Compro. Vendo. Troco.", "Compro. Vendo. Troco.")]),
 ("loja", [("Venha conhecer a loja:", "Venha conhecer a loja:"), ("entre o SESI e a assistência.", "entre o SESI e a assistência.")]),
 ("fim", [("O seu próximo carro está aqui.", "O seu próximo carro está aqui.")]),
]
out = []; n = 0
for cena, frases in R:
    fs = []
    for fala, leg in frases:
        s, sr = k.create(fala, voice="pm_alex", speed=1.08, lang="pt-br")
        nz = np.where(np.abs(s) > 0.012)[0]; s = s[max(0, nz[0] - 200): nz[-1] + 700]
        sf.write("public/edu/vo/tmp.wav", s, sr)
        name = f"E{n:02d}"; n += 1
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/edu/vo/tmp.wav", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"public/edu/vo/{name}.wav"], check=True)
        fs.append({"f": name, "leg": leg, "frames": round(len(s) / sr * 30)})
    out.append({"id": cena, "frases": fs})
subprocess.run(["rm", "public/edu/vo/tmp.wav"])
json.dump(out, open("src/eduardo/roteiro.json", "w"), ensure_ascii=False, indent=1)
for c in out: print(c["id"], [f["frames"] for f in c["frases"]])
