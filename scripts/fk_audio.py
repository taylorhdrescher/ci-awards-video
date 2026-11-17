"""Trilha + efeitos do vídeo FK Wealth Planner (sincronizados com FK_SCENES em src/fk/FK.tsx)."""
import subprocess, wave, numpy as np, mido
FPS = 30
DUR = [96, 140, 80, 96, 130, 110, 110, 150, 80, 140, 90]
ST = [sum(DUR[:i]) for i in range(len(DUR))]
END = sum(DUR) / FPS
s = lambda i, f=0: (ST[i] + f) / FPS
BPM = 96; BEAT = 60 / BPM; BAR = 4 * BEAT; TPS = 480
ev = []
def note(ch, n, t, d, v):
    if t >= END: return
    ev.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=max(1, min(127, int(v))))))
    ev.append((min(END, t + d), 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))
def cc(ch, c, v, t): ev.append((t, 0, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
for ch, p in {0: 0, 1: 89, 2: 33, 3: 48, 4: 11}.items():  # piano, pad, baixo, cordas, vibrafone
    ev.append((0, -1, mido.Message("program_change", channel=ch, program=p))); cc(ch, 91, 95, 0)
cc(9, 91, 40, 0)
# Am - F - C - G (elegante), Am9 etc.
CH = [(45, [57, 60, 64, 71]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
def bars(t1, t2, lvl):
    t, b = t1, 0
    while t < t2 - 0.05:
        bass, tri = CH[b % 4]; bl = min(BAR, t2 - t)
        for n in tri: note(1, n - 12, t, bl, 50 + lvl * 5)
        # piano arpejado
        pat = [tri[0], tri[2], tri[1] + 12, tri[3] + 12, tri[2] + 12, tri[1] + 12, tri[3], tri[2]]
        for i, n in enumerate(pat):
            if i * BEAT / 2 < bl: note(0, n, t + i * BEAT / 2, BEAT, 52 + (14 if i % 4 == 0 else 0) + lvl * 4)
        if lvl >= 1: note(2, bass - 12, t, bl, 80)
        if lvl >= 2:
            for k in range(4):
                tk = t + k * BEAT
                if tk >= t2: break
                note(9, 36, tk, 0.2, 88 if k % 2 == 0 else 60)
                if k % 2: note(9, 39, tk, 0.2, 70)
                note(9, 42, tk + BEAT / 2, 0.1, 40)
        if lvl >= 3:
            for n in tri[:3]: note(3, n, t, bl, 60)
        t += BAR; b += 1
def hit(t, v=110):
    note(9, 49, t, 2, v - 15); note(9, 36, t, 0.3, 120)
    for n in (45, 57, 64, 69): note(3, n, t, 1.5, v - 30)
def chime(t, notes=(81, 84, 88), v=80):
    for k, n in enumerate(notes): note(4, n, t + k * 0.06, 1.5, v)
bars(0, s(2), 0)
bars(s(2), s(3), 0)
hit(s(3), 105); chime(s(3, 32), (76, 81, 84, 88))
bars(s(3), s(4), 1)
bars(s(4), s(9), 2)
bars(s(9), s(9, 92), 3)
hit(s(9, 92), 118); chime(s(9, 92), (81, 84, 88, 93), 90)
bars(s(9, 92), s(10), 3)
chime(s(10, 20), (76, 81, 84, 88))
for n in (45, 57, 60, 64, 69, 72): note(1, n, s(10), END - s(10), 70); note(3, n, s(10), END - s(10) - 0.5, 55)
mid = mido.MidiFile(ticks_per_beat=TPS); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
ev.sort(key=lambda e: (e[0], e[1])); last = 0
for t, _, m in ev:
    tk = int(round(t * TPS)); m.time = tk - last; last = tk; tr.append(m)
mid.save("out/fk-musica.mid")
subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.5", "-r", "48000", "-F", "out/fk-musica-raw.wav", "/usr/share/sounds/sf2/FluidR3_GM.sf2", "out/fk-musica.mid"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/fk-musica-raw.wav", "-af", f"apad,atrim=0:{END},loudnorm=I=-16:TP=-1.5,afade=t=out:st={END-1.2}:d=1.2", "-ar", "48000", "public/fk/musica.wav"], check=True)
# efeitos
SR = 48000; out = np.zeros(int((END + 1) * SR)); rng = np.random.default_rng(5)
def add(x, t, g):
    i = int(t * SR); n = min(len(x), len(out) - i)
    if n > 0: out[i:i + n] += x[:n] * g
def whoosh(d=0.38):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); a = 0.0
    for i in range(n):
        k = 0.02 + 0.25 * np.sin(np.pi * i / n) ** 2; a += k * (x[i] - a); y[i] = a
    return y / (np.abs(y).max() + 1e-9) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
def pop(f=700):
    n = int(0.08 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (f + 500 * np.exp(-t * 60)) * t) * np.exp(-t * 45)
def click():
    n = int(0.04 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 900 * t) * np.exp(-t * 180) + 0.3 * rng.standard_normal(n) * np.exp(-t * 400)
for i in range(1, len(DUR)): add(whoosh(), s(i) - 0.22, 0.35)
for k in range(5): add(pop(600 + k * 60), s(1, 18 + k * 16), 0.35)
for k in range(6): add(pop(650 + k * 50), s(5, 16 + k * 9), 0.28)
for k in range(4): add(pop(500 + k * 120), s(3, 8 + k * 5), 0.3)
for k in range(4): add(pop(700), s(4, 26 + k * 12), 0.25)
add(click(), s(9, 92), 0.6)
out = out / (np.abs(out).max() + 1e-9) * 0.7
with wave.open("public/fk/efeitos.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
print("ok", END)
