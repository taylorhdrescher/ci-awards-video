"""Trilha + efeitos do vídeo-teste, sincronizados com src/teste/timeline.json.
Música: groove minimalista 100 BPM (fluidsynth/FluidR3). Efeitos: whooshes nos cortes e cliques do cursor.
"""
import json, wave, subprocess, numpy as np, mido

PLAN = json.load(open("src/mix/mix.json"))
SEGS = {x["id"]: x for x in PLAN["seg"]}
FPS = 30
END = PLAN["total"] / FPS
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
TPS = 480
ev = []
def note(ch, n, t, d, v):
    if t >= END: return
    ev.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=max(1, min(127, int(v))))))
    ev.append((min(END, t + d), 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))
def cc(ch, c, v, t): ev.append((t, 0, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
def ramp(ch, t1, t2, a, b, c=11, n=30):
    for i in range(n + 1): cc(ch, c, a + (b - a) * i / n, t1 + (t2 - t1) * i / n)
def sec(cena): return L[cena]["from"] / FPS + OFF

for ch, p in {0: 89, 1: 4, 2: 38, 3: 108, 4: 48}.items():
    ev.append((0, -1, mido.Message("program_change", channel=ch, program=p)))
    cc(ch, 91, 90, 0); cc(ch, 11, 110, 0)
cc(9, 91, 40, 0)
CH = [(50, [62, 66, 69, 73]), (47, [59, 62, 66, 69]), (43, [55, 59, 62, 66]), (45, [57, 61, 64, 69])]

def section(t1, t2, level):
    """level 0 = só pad; 1 = pad+arpejo; 2 = groove; 3 = groove cheio"""
    b = 0
    t = t1
    while t < t2 - 0.05:
        bass, tri = CH[b % 4]
        bl = min(BAR, t2 - t)
        for n in tri: note(0, n - 12, t, bl, 55 + level * 6)
        if level >= 1:
            pat = [tri[0], tri[2], tri[1] + 12, tri[3], tri[0] + 12, tri[2], tri[1] + 12, tri[3] + 12]
            for i, n in enumerate(pat):
                if i * BEAT / 2 < bl: note(3, n + 12, t + i * BEAT / 2, 0.4, 62 + (10 if i % 2 == 0 else 0))
        if level >= 2:
            for k in range(4):
                tk = t + k * BEAT
                if tk >= t2: break
                note(9, 36, tk, 0.2, 105 if level == 3 else 92)
                if k % 2 == 1: note(9, 39, tk, 0.2, 80)
                for h in (0, 0.5):
                    note(9, 42, tk + h * BEAT, 0.1, 55 if h else 40)
                note(2, bass - 12, tk, BEAT * 0.45, 95)
                note(2, bass, tk + BEAT * 0.5, BEAT * 0.3, 70)
                note(1, tri[k % 4], tk + BEAT * 0.5, BEAT * 0.4, 50)
            if level == 3:
                note(4, tri[0], t, bl, 60); note(4, tri[2], t, bl, 60)
        t += BAR; b += 1

def hit(t, v=120):
    note(9, 49, t, 2.0, v); note(9, 36, t, 0.3, 127)
    for n in (38, 50, 57, 62): note(4, n, t, 1.4, v - 20)

def st(i): return SEGS[i]["from"] / FPS
def en(i): return (SEGS[i]["from"] + SEGS[i]["dur"]) / FPS
def roll(t, n=18, v0=20):
    for k in range(n): note(9, 38, t - n * 0.072 + k * 0.072, 0.05, v0 + k * 6)
LOGO, TIT = 159 / FPS, 224 / FPS
ramp(0, 0, LOGO, 30, 110)
section(0, TIT, 1); roll(TIT); hit(TIT, 122); section(TIT, st("abre1"), 2)
section(st("abre1"), st("presente"), 1)
hit(st("logo"), 105)
hit(st("presente"), 115)
section(st("presente"), st("pergunta"), 2)
section(st("pergunta"), st("num1"), 0); roll(st("num1")); hit(st("num1"), 118)
section(st("num1"), st("virada"), 3)
hit(st("widgets"), 110)
section(st("virada"), st("palavras"), 0); roll(st("palavras") + 2 / FPS)
for k in range(4): hit(st("palavras") + (2 + 32 * k) / FPS, 112 + k * 4)
section(st("palavras"), st("trimestre"), 0)
hit(st("trimestre"), 112)
section(st("trimestre"), st("mentor"), 3)
hit(st("premio"), 110); hit(st("eventos"), 108)
section(st("mentor"), st("pessoas"), 0); roll(st("pessoas"))
section(st("pessoas"), st("final"), 2)
s8 = st("final")
for k in range(8): note(9, 41 + (k % 3) * 2, s8 + k * 9 / FPS, 0.3, 95 + k * 4); note(9, 49 if k % 4 == 0 else 42, s8 + k * 9 / FPS, 0.5, 90)
roll(s8 + 72 / FPS, 14)
hit(s8 + 72 / FPS, 127)
for n in (38, 50, 57, 62, 66, 69, 73): note(0, n, s8 + 72 / FPS, END - s8 - 72 / FPS, 85); note(4, n, s8 + 72 / FPS, END - s8 - 3.0, 75)
for ch in (0, 4): ramp(ch, END - 3, END, 110, 0)

mid = mido.MidiFile(ticks_per_beat=TPS); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
ev.sort(key=lambda e: (e[0], e[1])); last = 0
for t, _, m in ev:
    tk = int(round(t * TPS)); m.time = tk - last; last = tk; tr.append(m)
mid.save("out/mix-musica.mid")
subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.5", "-r", "48000", "-F", "out/mix-musica-raw.wav", "/usr/share/sounds/sf2/FluidR3_GM.sf2", "out/mix-musica.mid"], check=True)

# ---- efeitos + guia de narração (para abaixar a música quando a voz fala)
SR = 48000
out = np.zeros(int((END + 1) * SR))
nar = np.zeros(int((END + 1) * SR))
rng = np.random.default_rng(3)
def add(s, t, g, buf=None):
    buf = out if buf is None else buf
    i = int(t * SR); n = min(len(s), len(buf) - i)
    if n > 0: buf[i:i + n] += s[:n] * g
def whoosh(d=0.4):
    n = int(d * SR); x = rng.standard_normal(n)
    # passa-baixa móvel simples
    y = np.zeros(n); a = 0.0
    for i in range(n):
        k = 0.02 + 0.25 * np.sin(np.pi * i / n) ** 2
        a += k * (x[i] - a); y[i] = a
    return y / (np.abs(y).max() + 1e-9) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
def click():
    n = int(0.04 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 900 * t) * np.exp(-t * 180) + 0.3 * rng.standard_normal(n) * np.exp(-t * 400))
import soundfile as sf
for x in PLAN["seg"][1:]:
    add(whoosh(0.38), x["from"] / FPS - 0.22, 0.35)
add(whoosh(0.5), LOGO - 0.3, 0.5)
for x in PLAN["seg"]:
    for f, at in x["vo"]:
        a, sr = sf.read(f"public/teste/vo/{f}.wav")
        if a.ndim > 1: a = a.mean(1)
        add(a, (x["from"] + at) / FPS, 1.0, nar)
ed = SEGS["educa"]
for f in (62,):
    add(click(), (SEGS["busca"]["from"] + f) / FPS, 0.5)
for frac in (0.55, 0.85):
    add(click(), (ed["from"] + round(ed["voz"] * frac)) / FPS, 0.5)
out = out / (np.abs(out).max() + 1e-9) * 0.7
for name, buf in (("public/mix/efeitos.wav", out), ("out/mix-narracao-guia.wav", nar / (np.abs(nar).max() + 1e-9) * 0.9)):
    with wave.open(name, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32767).astype(np.int16).tobytes())
print("ok", END)
