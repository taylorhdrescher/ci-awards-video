"""Trilha + efeitos do FK v2 (narrado). Mesmo plano de src/fk/FK2.tsx (GAP, EXTRA, LEAD, FIM)."""
import json, subprocess, wave, numpy as np, mido, soundfile as sf
VO = json.load(open("src/fk/vo.json"))
GAP, LEAD, FIM = 10, 8, 100
EXTRA = {"isoladas": 14, "marca": 24, "merece": 8, "cta": 34}
FPS = 30
P = {}; t = 0
for i, v in enumerate(VO):
    lead = LEAD if i == 0 else 0
    dur = lead + v["voz"] + GAP + EXTRA.get(v["id"], 0)
    P[v["id"]] = dict(v, start=t, dur=dur, lead=lead); t += dur
TOTAL = t + FIM; END = TOTAL / FPS
st = lambda k, f=0: (P[k]["start"] + f) / FPS
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT; TPS = 480
ev = []
def note(ch, n, t, d, v):
    if t >= END or t < 0: return
    ev.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=max(1, min(127, int(v))))))
    ev.append((min(END, t + d), 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))
def cc(ch, c, v, t): ev.append((t, 0, mido.Message("control_change", channel=ch, control=c, value=int(max(0, min(127, v))))))
for ch, p in {0: 0, 1: 89, 2: 38, 3: 48, 4: 11, 5: 95}.items():
    ev.append((0, -1, mido.Message("program_change", channel=ch, program=p))); cc(ch, 91, 90, 0)
MINOR = [(45, [57, 60, 64, 67]), (41, [53, 57, 60, 64]), (38, [50, 53, 57, 60]), (40, [52, 56, 59, 64])]
MAJOR = [(48, [55, 60, 64, 67]), (43, [55, 59, 62, 67]), (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69])]
def sec(t1, t2, lvl, prog):
    t, b = t1, 0
    while t < t2 - 0.05:
        bass, tri = prog[b % 4]; bl = min(BAR, t2 - t)
        for n in tri: note(1, n - 12, t, bl, 46 + lvl * 6)
        if lvl >= 1:
            pat = [tri[0], tri[2], tri[1] + 12, tri[3] + 12, tri[2] + 12, tri[1] + 12, tri[3], tri[2]]
            for i, n in enumerate(pat):
                if i * BEAT / 2 < bl: note(0, n, t + i * BEAT / 2, BEAT, 50 + (14 if i % 4 == 0 else 0) + lvl * 4)
        if lvl == -1:  # tensão: hats tiquetaqueando + pulso grave
            for k in range(8):
                if k * BEAT / 2 < bl: note(9, 42, t + k * BEAT / 2, 0.05, 35 + (15 if k % 2 == 0 else 0))
            note(2, bass - 12, t, BEAT * 0.5, 70); note(2, bass - 12, t + 2 * BEAT, BEAT * 0.5, 60)
        if lvl >= 2:
            for k in range(4):
                tk = t + k * BEAT
                if tk >= t2: break
                note(9, 36, tk, 0.2, 95 if k % 2 == 0 else 70)
                if k % 2: note(9, 39, tk, 0.2, 75)
                note(9, 42, tk + BEAT / 2, 0.1, 45)
                note(2, bass - 12, tk, BEAT * 0.45, 92); note(2, bass, tk + BEAT * 0.5, BEAT * 0.3, 65)
        if lvl >= 3:
            for n in tri[:3]: note(3, n, t, bl, 62)
        t += BAR; b += 1
def hit(t, v=115, root=48):
    note(9, 49, t, 2, v - 10); note(9, 36, t, 0.3, 127); note(9, 57, t, 2, v - 20)
    for n in (root - 12, root, root + 7, root + 12): note(3, n, t, 1.4, v - 25)
def boom(t, v=110): note(9, 35, t, 0.5, v); note(9, 41, t, 0.6, v - 20)
def roll(t, n=16, v0=15):
    for k in range(n): note(9, 38, t - n * 0.07 + k * 0.07, 0.05, v0 + k * 6)
def chime(t, notes=(84, 88, 91, 96), v=85):
    for k, n in enumerate(notes): note(4, n, t + k * 0.06, 1.6, v)
# estrutura
hit(0.02, 105, 45)
sec(0, st("pergunta"), 2, MINOR)
sec(st("pergunta"), st("caos"), 0, MINOR)
sec(st("caos"), st("isoladas"), -1, MINOR)
d = P["dores"]
for f in (0, 0.3, 0.6): boom(st("dores", round(d["voz"] * f)), 105)
boom(st("isoladas"), 120)
sec(st("isoladas"), st("marca"), 0, MINOR)
roll(st("marca", 38), 20)
hit(st("marca", 38), 124, 48); chime(st("marca", 38))
sec(st("marca"), st("marca", 38), 0, MINOR)
sec(st("marca", 38), st("independencia"), 2, MAJOR)
sec(st("independencia"), st("felipe"), 3, MAJOR)
iv = P["independencia"]
for f in (0.3, 0.62): hit(st("independencia", round(iv["voz"] * f)), 100, 48)
sec(st("felipe"), st("merece"), 1, MAJOR)
sec(st("merece"), st("cta"), 1, MAJOR); roll(st("cta"), 18)
hit(st("cta"), 118, 48)
sec(st("cta"), END - FIM / FPS, 3, MAJOR)
click_t = st("cta", round((P["cta"]["voz"]) * 0.62))
hit(click_t, 112, 48)
tf = END - FIM / FPS
chime(tf + 0.6, (79, 84, 88, 91))
for n in (36, 48, 55, 60, 64, 67, 72): note(1, n, tf, END - tf, 72); note(3, n, tf, END - tf - 0.4, 56)
mid = mido.MidiFile(ticks_per_beat=TPS); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
ev.sort(key=lambda e: (e[0], e[1])); last = 0
for tt, _, m in ev:
    tk = int(round(tt * TPS)); m.time = tk - last; last = tk; tr.append(m)
mid.save("out/fk2-musica.mid")
subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.5", "-r", "48000", "-F", "out/fk2-musica-raw.wav", "/usr/share/sounds/sf2/FluidR3_GM.sf2", "out/fk2-musica.mid"], check=True)
# guia de narração + efeitos
SR = 48000
nar = np.zeros(int((END + 1) * SR)); out = np.zeros_like(nar); rng = np.random.default_rng(9)
def add(x, t, g, buf):
    i = int(t * SR); n = min(len(x), len(buf) - i)
    if n > 0 and i >= 0: buf[i:i + n] += x[:n] * g
for k, v in P.items():
    a, _ = sf.read(f"public/fk/vo/{v['f']}.wav")
    if a.ndim > 1: a = a.mean(1)
    add(a, (v["start"] + v["lead"]) / FPS, 1, nar)
def whoosh(d=0.36):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); a = 0.0
    for i in range(n):
        kk = 0.02 + 0.25 * np.sin(np.pi * i / n) ** 2; a += kk * (x[i] - a); y[i] = a
    return y / (np.abs(y).max() + 1e-9) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5
def pop(f=700):
    n = int(0.08 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * (f + 500 * np.exp(-tt * 60)) * tt) * np.exp(-tt * 45)
def click():
    n = int(0.04 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 180) + 0.3 * rng.standard_normal(n) * np.exp(-tt * 400)
for k, v in P.items():
    if v["start"] > 0: add(whoosh(), v["start"] / FPS - 0.2, 0.32, out)
add(whoosh(0.45), tf - 0.22, 0.4, out)
for i in range(9): add(pop(520 + i * 40), st("caos", 6 + i * 4), 0.22, out)
pv = P["pilares"]["voz"]
for f in (0.02, 0.13, 0.27, 0.37): add(pop(760), st("pilares", round(pv * f)), 0.3, out)
ev_ = P["entregas"]["voz"]
for f in (0.22, 0.48, 0.72): add(pop(820), st("entregas", round(ev_ * f)), 0.32, out)
add(click(), click_t, 0.6, out)
out = out / (np.abs(out).max() + 1e-9) * 0.7
def wr(name, buf):
    with wave.open(name, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
wr("public/fk/efeitos2.wav", out); wr("out/fk2-guia.wav", nar / (np.abs(nar).max() + 1e-9) * 0.9)
af = f"apad,atrim=0:{END},loudnorm=I=-16:TP=-1.5,afade=t=out:st={END-1.5}:d=1.5"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/fk2-musica-raw.wav", "-af", af, "-ar", "48000", "public/fk/musica2-sem-voz.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "public/fk/musica2-sem-voz.wav", "-i", "out/fk2-guia.wav", "-filter_complex",
  "[1:a]pan=stereo|c0=c0|c1=c0[sc];[0:a][sc]sidechaincompress=threshold=0.02:ratio=7:attack=15:release=300,volume=-4dB[d]", "-map", "[d]", "-ar", "48000", "public/fk/musica2.wav"], check=True)
print("ok", TOTAL, END)
