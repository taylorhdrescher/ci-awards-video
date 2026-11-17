"""Trilha Eduardo Veículos: cinematográfica (tensa → explosão na marca → groove), sincronizada com src/eduardo/Eduardo.tsx."""
import json, subprocess, wave, numpy as np, mido, soundfile as sf
R = json.load(open("src/eduardo/roteiro.json"))
GAP, OV, FPS = 5, 10, 30
LEAD = {"gancho": 8}
TAIL = {"gancho": 16, "dor": 16, "marca": 26, "estoque": 24, "pagamento": 22, "troca": 22, "loja": 24, "fim": 70}
C = []
for c in R:
    t = LEAD.get(c["id"], 4); fr = []
    for f in c["frases"]:
        fr.append(dict(f, at=t)); t += f["frames"] + GAP
    C.append(dict(id=c["id"], frases=fr, dur=t - GAP + TAIL[c["id"]]))
ST = [];
for i, c in enumerate(C): ST.append(0 if i == 0 else ST[-1] + C[i - 1]["dur"])
TOTAL = ST[-1] + C[-1]["dur"]; END = TOTAL / FPS
S = {c["id"]: ST[i] / FPS for i, c in enumerate(C)}
def q(id_, i, frac=0):
    c = C[[x["id"] for x in C].index(id_)]; f = c["frases"][i]
    return (ST[[x["id"] for x in C].index(id_)] + f["at"] + f["frames"] * frac) / FPS
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT; TPS = 480
ev = []
def note(ch, n, t, d, v):
    if t >= END or t < 0: return
    ev.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=max(1, min(127, int(v))))))
    ev.append((min(END, t + d), 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))
def cc(ch, c_, v, t): ev.append((t, 0, mido.Message("control_change", channel=ch, control=c_, value=int(max(0, min(127, v))))))
for ch, p in {0: 4, 1: 95, 2: 38, 3: 48, 4: 11}.items():
    ev.append((0, -1, mido.Message("program_change", channel=ch, program=p))); cc(ch, 91, 90, 0)
MIN = [(45, [57, 60, 64, 67]), (41, [53, 57, 60, 64]), (43, [55, 59, 62, 67]), (40, [52, 55, 59, 64])]
MAJ = [(45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
def sec(t1, t2, lvl, prog):
    t, b = t1, 0
    while t < t2 - 0.05:
        bass, tri = prog[b % 4]; bl = min(BAR, t2 - t)
        for n in tri: note(1, n - 12, t, bl, 46 + lvl * 6)
        if lvl == -1:
            for k in range(8):
                if k * BEAT / 2 < bl: note(9, 42, t + k * BEAT / 2, 0.05, 30 + (14 if k % 2 == 0 else 0))
            note(2, bass - 12, t, BEAT * 0.6, 80); note(9, 36, t, 0.2, 80); note(9, 36, t + 2 * BEAT, 0.2, 64)
        if lvl >= 2:
            for k in range(4):
                tk = t + k * BEAT
                if tk >= t2: break
                note(9, 36, tk, 0.2, 104 if k % 2 == 0 else 84)
                if k % 2: note(9, 39, tk, 0.2, 84)
                note(9, 42, tk + BEAT / 2, 0.08, 50)
                note(2, bass - 12, tk, BEAT * 0.4, 98); note(2, bass, tk + BEAT * 0.5, BEAT * 0.3, 72)
            for i, k in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
                if i * BEAT / 2 < bl: note(0, tri[k] + 12, t + i * BEAT / 2, 0.3, 52 + (10 if i % 2 == 0 else 0))
        if lvl >= 3:
            for n in tri[:3]: note(3, n, t, bl, 60)
        t += BAR; b += 1
def hit(t, v=118, root=45):
    note(9, 49, t, 2, v - 10); note(9, 36, t, 0.3, 127); note(9, 57, t, 2, v - 25)
    for n in (root - 12, root, root + 7, root + 12): note(3, n, t, 1.4, v - 25)
def boom(t, v=118): note(9, 35, t, 0.5, v); note(9, 41, t, 0.6, v - 20)
def roll(t, n=16):
    for k in range(n): note(9, 38, t - n * 0.07 + k * 0.07, 0.05, 15 + k * 6)
hit(0.05, 100)
sec(0, S["marca"], -1, MIN)
boom(q("dor", 0, 0.3), 124); boom(q("dor", 1, 0.2), 120)
roll(S["marca"] + 0.1, 20); hit(S["marca"] + 0.1, 127)
sec(S["marca"] + 0.1, S["estoque"], 2, MAJ)
sec(S["estoque"], S["fim"], 3, MAJ)
for f in (0.02, 0.36, 0.7): hit(q("troca", 0, f), 110)
hit(S["estoque"], 112); hit(S["pagamento"], 108); hit(S["loja"], 108)
roll(S["fim"], 16); hit(S["fim"], 126)
for k, n in enumerate((81, 84, 88, 93)): note(4, n, S["fim"] + 0.15 + k * 0.07, 1.6, 85)
for n in (33, 45, 52, 57, 60, 64, 69): note(1, n, S["fim"], END - S["fim"], 72); note(3, n, S["fim"], END - S["fim"] - 0.4, 56)
mid = mido.MidiFile(ticks_per_beat=TPS); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
ev.sort(key=lambda e: (e[0], e[1])); last = 0
for t, _, m in ev:
    tk = int(round(t * TPS)); m.time = tk - last; last = tk; tr.append(m)
mid.save("out/edu-musica.mid")
subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.5", "-r", "48000", "-F", "out/edu-musica-raw.wav", "/usr/share/sounds/sf2/FluidR3_GM.sf2", "out/edu-musica.mid"], check=True)
SR = 48000; nar = np.zeros(int((END + 1) * SR))
for i, c in enumerate(C):
    for f in c["frases"]:
        a, _ = sf.read(f"public/edu/vo/{f['f']}.wav")
        if a.ndim > 1: a = a.mean(1)
        j = int((ST[i] + f["at"]) / FPS * SR); n = min(len(a), len(nar) - j); nar[j:j + n] += a[:n]
with wave.open("out/edu-guia.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(nar / (np.abs(nar).max() + 1e-9) * 0.9, -1, 1) * 32767).astype(np.int16).tobytes())
af = f"apad,atrim=0:{END},loudnorm=I=-16:TP=-1.5,afade=t=out:st={END-1.5}:d=1.5"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/edu-musica-raw.wav", "-i", "out/edu-guia.wav", "-filter_complex",
  f"[0:a]{af}[m];[1:a]pan=stereo|c0=c0|c1=c0[sc];[m][sc]sidechaincompress=threshold=0.02:ratio=7:attack=15:release=300,volume=-4dB[d]", "-map", "[d]", "-ar", "48000", "public/edu/musica.wav"], check=True)
print("ok", TOTAL, END)
