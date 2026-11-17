"""Plano do vídeo MIX v2 (tudo na linguagem do teste): gera src/mix/mix.json."""
import json, subprocess
TL = {l["cena"]: (i, l) for i, l in enumerate(json.load(open("src/teste/timeline.json"))["linhas"])}
def vf(n):  # duração em frames de uma fala
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"public/teste/vo/{n}.wav"]))
    return round(d * 30)
def L(c): return f"L{TL[c][0]:02d}"
def t(cena, extra=0, lead=0, tr="cut", vo=None, dur=None, voz=None):
    i, l = TL[cena]
    return {"id": cena, "cena": cena, "dur": dur or (l["dur"] + extra + lead), "voz": voz or (l["voz"] + lead), "lead": lead, "tr": tr, "vo": vo if vo is not None else [[L(cena), lead]]}
def n(cena, vo, dur, tr="cut", **kw):
    d = {"id": cena, "cena": cena, "dur": dur, "tr": tr, "vo": vo}; d.update(kw); return d

FASE2 = 74
SEG = [
    n("intro", [], 316),
    t("abre1", lead=18, tr="zoom"), t("abre2"), t("busca"), t("logo", tr="flash"),
    n("presente", [[L("presente"), 10], [L("tela"), FASE2 + 4]], FASE2 + vf(L("tela")) + 40, tr="zoom", fase2=FASE2, vozFase2=vf(L("tela"))),
    t("educa", tr="up"), t("inclui"),
    t("pergunta", tr="zoom"), t("num1", tr="flash"), t("num2"),
    t("widgets", tr="zoom"),
    n("prod", [["N1", 12]], 12 + vf("N1") + 18, tr="whip", lead=12, voz=vf("N1")),
    n("moral", [["N2", 10]], 10 + vf("N2") + 22, tr="up", lead=10, voz=vf("N2")),
    t("virada", tr="zoom"),
    n("palavras", [["W0", 2], ["W1", 34], ["W2", 66], ["W3", 98]], 140, tr="cut", voz=128),
    t("trimestre", tr="flash"),
    n("premio", [["N4", 8]], 8 + vf("N4") + 20, tr="zoom", lead=8, voz=vf("N4")),
    n("eventos", [["N3", 10]], 10 + vf("N3") + 20, tr="whip", voz=vf("N3")),
    t("mentor", tr="up"), t("pessoas", tr="zoom"),
    n("final", [[L("final"), 72 + 34]], 72 + 170, tr="flash", per=9),
]
t0 = 0
for s in SEG:
    s["from"] = t0; t0 += s["dur"]
json.dump({"total": t0, "seg": SEG}, open("src/mix/mix.json", "w"), ensure_ascii=False, indent=1)
print("total", t0, round(t0 / 30, 1))
for s in SEG: print(s["id"], s["from"], s["dur"])
