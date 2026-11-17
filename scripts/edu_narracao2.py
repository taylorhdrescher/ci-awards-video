"""Eduardo Veículos — narração frase a frase (pm_alex). Gera public/edu/vo2/*.wav e src/eduardo/roteiro2.json"""
import json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("/root/tts/kokoro-v1.0.onnx", "/root/tts/voices-v1.0.bin")
R = [
 ("gancho", [("Trocar de carro", "Trocar de carro"), ("não precisa ser dor de cabeça.", "não precisa ser dor de cabeça.")]),
 ("dor", [("Carro sem procedência,", "Carro sem procedência,"), ("vendedor que some depois da venda...", "vendedor que some depois da venda...")]),
 ("marca", [("Na Eduardo Veículos, em Montenegro,", "Na Eduardo Veículos, em Montenegro,"), ("cada carro é selecionado", "cada carro é selecionado"), ("e sai com garantia.", "e sai com garantia.")]),
 ("estoque", [("Tem opção pra todo bolso:", "Tem opção pra todo bolso:"), ("de quinze mil a cento e sessenta mil reais.", "de R$ 15 mil a R$ 160 mil.")]),
 ("pagamento", [("Financiamento,", "Financiamento,"), ("cartão de crédito,", "cartão de crédito,"), ("e o seu usado entra na troca.", "e o seu usado entra na troca.")]),
 ("prova", [("Seja mais um cliente satisfeito.", "Seja mais um cliente satisfeito.")]),
 ("cta", [("Chama no direct,", "Chama no direct,"), ("ou vem conhecer a loja:", "ou vem conhecer a loja:"), ("entre o SESI e a assistência.", "entre o SESI e a assistência.")]),
 ("fim", [("Eduardo Veículos.", "Eduardo Veículos."), ("O seu próximo carro está aqui.", "O seu próximo carro está aqui.")]),
]
out = []; n = 0
for cena, frases in R:
    fs = []
    for fala, leg in frases:
        s, sr = k.create(fala, voice="pm_alex", speed=1.08, lang="pt-br")
        nz = np.where(np.abs(s) > 0.012)[0]; s = s[max(0, nz[0] - 200): nz[-1] + 700]
        sf.write("public/edu/vo2/tmp.wav", s, sr)
        name = f"F{n:02d}"; n += 1
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/edu/vo2/tmp.wav", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"public/edu/vo2/{name}.wav"], check=True)
        fs.append({"f": name, "leg": leg, "frames": round(len(s) / sr * 30)})
    out.append({"id": cena, "frases": fs})
subprocess.run(["rm", "public/edu/vo2/tmp.wav"])
json.dump(out, open("src/eduardo/roteiro2.json", "w"), ensure_ascii=False, indent=1)
for c in out: print(c["id"], [f["frames"] for f in c["frases"]])
