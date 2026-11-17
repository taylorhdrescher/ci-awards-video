"""Efeitos sonoros da V8, sintetizados (sem amostras de terceiros), sincronizados com os cortes.
whoosh (ruído filtrado que cresce até o corte), impacto (grave + estalo), tique (contadores e fotos).
  python3 scripts/sfx8.py  → public/audio/sfx8.wav
"""
import wave

import numpy as np

SR = 44100
FPS = 30
DUR = 132.0
out = np.zeros(int(SR * DUR) + SR)
rng = np.random.default_rng(7)


def add(sig, t):
    i = int(t * SR)
    j = min(len(out), i + len(sig))
    if i < 0:
        return
    out[i:j] += sig[: j - i]


def lowpass(x, a):
    y = np.zeros_like(x)
    acc = 0.0
    for k in range(len(x)):
        acc += a[k] * (x[k] - acc)
        y[k] = acc
    return y


def whoosh(t_cut, length=0.45, gain=0.35):
    n = int(length * SR)
    env = np.linspace(0, 1, n) ** 2.2
    cutoff = 0.02 + 0.35 * np.linspace(0, 1, n) ** 2
    x = lowpass(rng.standard_normal(n), cutoff)
    tail = np.exp(-np.linspace(0, 6, int(0.12 * SR)))
    sig = np.concatenate([x * env, lowpass(rng.standard_normal(len(tail)), np.full(len(tail), 0.3)) * tail])
    add(sig * gain / (np.abs(sig).max() + 1e-9), t_cut - length)


def impact(t, gain=0.8, big=False):
    n = int((1.0 if big else 0.5) * SR)
    tt = np.arange(n) / SR
    f = 110 * np.exp(-tt * 9) + 42
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * (3.5 if big else 7))
    click = rng.standard_normal(n) * np.exp(-tt * 60) * 0.5
    add((sub + click) * gain, t)


def tick(t, freq=1800, gain=0.18):
    n = int(0.06 * SR)
    tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 70) * gain, t)


def sample(name):
    """Carrega um efeito de public/sfx (pacote enviado pelo usuário), mono, reamostrado para 44,1 kHz."""
    with wave.open(f"public/sfx/{name}.wav") as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    if ch == 2:
        x = x.reshape(-1, 2).mean(1)
    n = int(len(x) * SR / sr)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)


CLICK = sample("click_002")
TICK = sample("tick_002")
GLASS = sample("glass_002")
BELL = sample("impactBell_heavy_000")
BOOM = sample("lowFrequency_explosion_000")


def s(f):
    return f / FPS


# --- cortes com whoosh (zoom/whip) e impactos (slam), em quadros globais
WHOOSH = [60, 150, 240, 420, 600, 780, 840, 1020, 1200, 1440, 1620, 1710, 1830, 1950, 2070, 2175, 2400, 2640, 2940, 3180, 3240, 3660]
SLAM = [60, 90, 120, 360, 1380, 1770, 1890, 2010, 2235, 2280, 2310, 2340, 2880, 2900, 2920]
BIG = [240, 2370, 3660]
for f in WHOOSH:
    whoosh(s(f))
for f in SLAM:
    impact(s(f), 0.7)
for f in BIG:
    impact(s(f), 0.6, big=True)
    add(BELL * 0.55, s(f))
    add(BOOM * 0.7, s(f))

# --- tiques: fotos trocando na batida, contadores, palavras
for f in range(420, 600, 30):  # cartões de "Estar presente"
    add(GLASS * 0.35, s(f))
for k in range(6):  # órbita: chips entrando
    tick(s(600 + 12 + k * 7.5), 1600 + k * 120, 0.12)
for f in (840 + 75, 840 + 105):  # cliques do cursor
    add(CLICK * 0.9, s(f))
for k in range(18):  # contadores da grade
    add(TICK * 0.45, s(1458 + k * 4))
for f in range(2640, 2745, 15):  # rajada de fotos
    add(GLASS * 0.35, s(f))
for k in range(4):  # trimestres
    impact(s(2400 + 45 + k * 30), 0.35)
for k in range(8):  # baralho de fotos
    whoosh(s(2940 + 10 + k * 27 + 6), 0.25, 0.2)
for k in range(6):  # palavras do depoimento
    tick(s(3250 + k * 15), 900, 0.12)
for f in range(3540, 3660, 15):  # 8 palavras finais
    impact(s(f), 0.35)

out /= max(1.0, np.abs(out).max() / 0.9)
pcm = (np.stack([out, out], 1) * 32767).astype(np.int16)
with wave.open("public/audio/sfx8.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok sfx8.wav", DUR, "s")
