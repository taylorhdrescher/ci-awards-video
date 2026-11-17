"""Trilha do vídeo Clique Motion (profissional): mesma linha do tempo de src/cm/CliqueMotion.tsx."""
import json, subprocess, wave, numpy as np, mido, soundfile as sf
R = json.load(open("src/cm/roteiro.json"))
GAP, T, FIM, FPS = 5, 16, 96, 30
LEAD = {"gancho": 8, "rolagem": 2, "virada": 10, "explica": 4, "pacote": 4, "formatos": 4, "preco": 4, "cta": 4}
TAIL = {"gancho": 18, "rolagem": 18, "virada": 26, "explica": 20, "pacote": 24, "formatos": 22, "preco": 30, "cta": 40}
C = []
for c in R:
    t = LEAD[c["id"]]; fr = []
    for f in c["frases"]:
        fr.append(dict(f, at=t)); t += f["frames"] + GAP
    C.append(dict(id=c["id"], frases=fr, dur=t - GAP + TAIL[c["id"]]))
ST = []
for i, c in enumerate(C): ST.append(0 if i == 0 else ST[-1] + C[i - 1]["dur"] - T)
TOTAL = ST[-1] + C[-1]["dur"] - T + FIM
END = TOTAL / FPS
S = {c["id"]: ST[i] / FPS for i, c in enumerate(C)}
fim_t = (ST[-1] + C[-1]["dur"] - T) / FPS
BPM = 118; BEAT = 60 / BPM; BAR = 4 * BEAT; TPS = 480
ev = []
def note(ch, n, t, d, v):
    if t >= END or t < 0: return
    ev.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=max(1, min(127, int(v))))))
    ev.append((min(END, t + d), 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))
def cc(ch, c_, v, t): ev.append((t, 0, mido.Message("control_change", channel=ch, control=c_, value=int(max(0, min(127, v))))))
for ch, p in {0: 4, 1: 89, 2: 38, 3: 48, 4: 108, 5: 81}.items():  # EP, pad, baixo synth, cordas, kalimba, saw lead
    ev.append((0, -1, mido.Message("program_change", channel=ch, program=p))); cc(ch, 91, 85, 0)
cc(5, 7, 60, 0)
MIN = [(45, [57, 60, 64, 67]), (41, [53, 57, 60, 64]), (43, [55, 59, 62, 67]), (40, [52, 55, 59, 64])]
MAJ = [(48, [60, 64, 67, 71]), (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (43, [55, 59, 62, 67])]
def sec(t1, t2, lvl, prog):
    t, b = t1, 0
    while t < t2 - 0.05:
        bass, tri = prog[b % 4]; bl = min(BAR, t2 - t)
        for n in tri: note(1, n - 12, t, bl, 44 + lvl * 6)
        if lvl == -1:
            for k in range(8):
                if k * BEAT / 2 < bl: note(9, 42, t + k * BEAT / 2, 0.05, 30 + (14 if k % 2 == 0 else 0))
            note(2, bass - 12, t, BEAT * 0.6, 75); note(9, 36, t, 0.2, 70)
        if lvl >= 1:
            pat = [0, 2, 1, 3, 2, 1, 3, 2]
            for i, k in enumerate(pat):
                if i * BEAT / 2 < bl: note(4, tri[k] + 12, t + i * BEAT / 2, 0.35, 64 + (12 if i % 2 == 0 else 0))
        if lvl >= 2:
            for k in range(4):
                tk = t + k * BEAT
                if tk >= t2: break
                note(9, 36, tk, 0.2, 100 if k % 2 == 0 else 80)
                if k % 2: note(9, 39, tk, 0.2, 82)
                note(9, 42, tk + BEAT / 2, 0.08, 52)
                note(2, bass - 12, tk, BEAT * 0.4, 96); note(2, bass, tk + BEAT * 0.5, BEAT * 0.3, 70)
            for i, n in enumerate(tri): note(0, n, t + BEAT * (0.5 + i * 0.02), BEAT * 1.5, 52)
        if lvl >= 3:
            for n in tri[:3]: note(3, n, t, bl, 58)
        t += BAR; b += 1
def hit(t, v=118, root=48):
    note(9, 49, t, 2, v - 10); note(9, 36, t, 0.3, 127)
    for n in (root - 12, root, root + 7, root + 12): note(3, n, t, 1.4, v - 25)
def roll(t, n=16):
    for k in range(n): note(9, 38, t - n * 0.07 + k * 0.07, 0.05, 15 + k * 6)
sec(0, S["virada"], -1, MIN)
hit(0.03, 104, 45)
roll(S["virada"] + 14 / FPS, 18); hit(S["virada"] + 14 / FPS, 126, 48)
sec(S["virada"] + 14 / FPS, S["formatos"], 2, MAJ)
sec(S["formatos"], S["cta"], 3, MAJ)
hit(S["formatos"], 112, 48); hit(S["preco"], 108, 48)
sec(S["cta"], fim_t, 2, MAJ)
roll(fim_t, 14); hit(fim_t, 124, 48)
for k, n in enumerate((79, 84, 88, 91)): note(4, n, fim_t + 0.1 + k * 0.07, 1.5, 90)
for n in (36, 48, 55, 60, 64, 67, 72): note(1, n, fim_t, END - fim_t, 72); note(3, n, fim_t, END - fim_t - 0.4, 54)
mid = mido.MidiFile(ticks_per_beat=TPS); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
ev.sort(key=lambda e: (e[0], e[1])); last = 0
for t, _, m in ev:
    tk = int(round(t * TPS)); m.time = tk - last; last = tk; tr.append(m)
mid.save("out/cm-musica.mid")
subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.5", "-r", "48000", "-F", "out/cm-musica-raw.wav", "/usr/share/sounds/sf2/FluidR3_GM.sf2", "out/cm-musica.mid"], check=True)
SR = 48000; nar = np.zeros(int((END + 1) * SR))
for i, c in enumerate(C):
    for f in c["frases"]:
        a, _ = sf.read(f"public/cm/vo/{f['f']}.wav")
        if a.ndim > 1: a = a.mean(1)
        j = int((ST[i] + f["at"]) / FPS * SR); n = min(len(a), len(nar) - j); nar[j:j + n] += a[:n]
with wave.open("out/cm-guia.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(nar / (np.abs(nar).max() + 1e-9) * 0.9, -1, 1) * 32767).astype(np.int16).tobytes())
af = f"apad,atrim=0:{END},loudnorm=I=-16:TP=-1.5,afade=t=out:st={END-1.5}:d=1.5"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "out/cm-musica-raw.wav", "-i", "out/cm-guia.wav", "-filter_complex",
  f"[0:a]{af}[m];[1:a]pan=stereo|c0=c0|c1=c0[sc];[m][sc]sidechaincompress=threshold=0.02:ratio=7:attack=15:release=300,volume=-4dB[d]", "-map", "[d]", "-ar", "48000", "public/cm/musica.wav"], check=True)
print("ok", TOTAL, END)
