"""Trilha original do CI Awards (composta por código, sem direitos de terceiros).
Gera scripts/trilha.mid; depois renderizado com fluidsynth (FluidR3_GM) para public/audio/trilha.wav.
Tempo 90 BPM (1 compasso = 80 frames = 2,667 s), alinhado com as cenas do vídeo.
"""
import mido

TPS = 480  # ticks por segundo (tempo MIDI = 60 bpm)
BAR = 80 / 30  # 2,6667 s
BEAT = BAR / 4
T0 = 86.8667 - 32 * BAR  # grade alinhada com a 1ª palavra (Melhorar)
END = 151.8

def bar(b):
    return T0 + b * BAR

events = []  # (tempo_s, ordem, msg)

def note(ch, n, t, d, v):
    v = max(1, min(127, int(v)))
    events.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=v)))
    events.append((t + d, 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))

def cc(ch, c, val, t):
    events.append((t, 0, mido.Message("control_change", channel=ch, control=c, value=max(0, min(127, int(val))))))

def ramp(ch, t1, t2, v1, v2, c=11, steps=40):
    for i in range(steps + 1):
        cc(ch, c, v1 + (v2 - v1) * i / steps, t1 + (t2 - t1) * i / steps)

PROG = {
    0: "Bm", 1: "G", 2: "D", 3: "A",
}
CH = {  # baixo, tríade
    "Bm": (47, [59, 62, 66]),
    "G": (43, [55, 59, 62]),
    "D": (50, [57, 62, 66]),
    "A": (45, [57, 61, 64]),
}
MEL = [  # melodia (nota, início em tempos, duração em tempos) por compasso do ciclo
    [(78, 0, 3), (76, 3, 1)],
    [(74, 0, 2), (71, 2, 2)],
    [(69, 0, 2), (74, 2, 1), (76, 3, 1)],
    [(73, 0, 4)],
]
MEL_B = [  # variação mais alta
    [(78, 0, 2), (81, 2, 2)],
    [(79, 0, 3), (78, 3, 1)],
    [(78, 0, 2), (76, 2, 1), (74, 3, 1)],
    [(76, 0, 4)],
]

def chord_of(b):
    return PROG[(b - 3) % 4]

# Programas (GM, base 0)
PROGRAMS = {0: 0, 1: 48, 2: 48, 3: 52, 4: 60, 5: 43, 6: 47, 7: 89, 8: 61, 10: 49}
for ch, p in PROGRAMS.items():
    events.append((0, -1, mido.Message("program_change", channel=ch, program=p)))
for ch in range(16):
    cc(ch, 91, 110, 0)  # reverb
    cc(ch, 7, 110, 0)
cc(0, 7, 100, 0)
cc(9, 7, 120, 0)

def piano_arp(b, sixteenth=False, vel=62):
    bass, tri = CH[chord_of(b)]
    t = bar(b)
    pat = [tri[0], tri[1], tri[2], tri[0] + 12, tri[2], tri[1], tri[0] + 12, tri[2]]
    if sixteenth:
        pat = pat + [tri[0] + 12, tri[2] + 12, tri[1] + 12, tri[2], tri[0] + 12, tri[1], tri[2], tri[0] + 12]
        step = BAR / 16
    else:
        step = BAR / 8
    for i, n in enumerate(pat):
        accent = 10 if i % (4 if not sixteenth else 4) == 0 else 0
        note(0, n + 12, t + i * step, step * 1.6, vel + accent)
    note(0, bass - 12 + 12, t, BAR, vel)

def pad_bar(b, vel_str=60, choir=False, horns=False, vel_ch=70):
    bass, tri = CH[chord_of(b)]
    t = bar(b)
    for n in tri:
        note(1, n, t, BAR * 0.98, vel_str)
        note(7, n - 12, t, BAR * 0.98, 45)
        if choir:
            note(3, n + 12, t, BAR * 0.98, vel_ch)
        if horns:
            note(4, n, t, BAR * 0.98, vel_ch)
    note(5, bass - 12, t, BAR * 0.98, vel_str + 15)
    note(1, bass, t, BAR * 0.98, vel_str)

def melody(b, ch=2, vel=80, octave=0, var=False):
    m = (MEL_B if var else MEL)[(b - 3) % 4]
    for n, s, d in m:
        note(ch, n + octave, bar(b) + s * BEAT, d * BEAT * 0.97, vel)

# Bateria (canal 9): 35/36 bumbo, 41/43/45 tons graves, 49/57 prato, 38 caixa, 52 china
def drums_build(b, intensity):
    t = bar(b)
    note(9, 36, t, 0.3, 90 + intensity * 30)
    note(9, 36, t + 2 * BEAT, 0.3, 70 + intensity * 30)
    if intensity > 0.3:
        note(9, 41, t + 3 * BEAT, 0.3, 60 + intensity * 50)
        note(9, 43, t + 3.5 * BEAT, 0.3, 60 + intensity * 50)
    if intensity > 0.6:
        note(9, 41, t + 1.5 * BEAT, 0.3, 70 + intensity * 40)

def drums_epic(b):
    t = bar(b)
    for s, n, v in [(0, 36, 127), (0, 41, 120), (1, 43, 95), (1.5, 43, 90), (2, 36, 120), (2, 41, 110), (2.75, 43, 90), (3, 41, 115), (3.5, 45, 110)]:
        note(9, n, t + s * BEAT, 0.3, v)
    note(6, 38, t, 0.8, 120)  # tímpano D
    note(6, 45, t + 2 * BEAT, 0.8, 100)

def hit(t, vel=127, root=50):
    note(9, 49, t, 2.0, vel)
    note(9, 57, t, 2.0, vel - 10)
    note(9, 36, t, 0.5, 127)
    note(6, root - 12, t, 1.5, 127)
    for n in (root, root + 7, root + 12):
        note(8, n, t, 1.2, vel)

def timp_roll(t1, t2, n=38, v1=30, v2=120):
    k = int((t2 - t1) / 0.07)
    for i in range(k):
        note(6, n, t1 + i * 0.07, 0.1, v1 + (v2 - v1) * i / k)

def snare_roll(t1, t2, v1=20, v2=110):
    k = int((t2 - t1) / 0.06)
    for i in range(k):
        note(9, 38, t1 + i * 0.06, 0.05, v1 + (v2 - v1) * (i / k) ** 1.5)

# ---------------- INTRO (0 – 9,53 s): crescendo até o flash do logo (5,0 s)
for ch in (1, 3, 7):
    ramp(ch, 0, 5.0, 20, 120)
for n in (50, 57, 62, 66):  # acorde de Ré sustentado
    note(1, n, 0.0, 5.0, 70)
    note(7, n, 0.0, 9.4, 50)
note(3, 74, 1.5, 3.5, 60)
note(5, 26, 0, 5.0, 70)
timp_roll(2.6, 5.0, 38, 15, 115)
for i, n in enumerate([62, 66, 69, 74, 78]):  # piano subindo
    note(0, n + 0, 0.3 + i * 0.5, 2.5, 50 + i * 6)
hit(5.0, 127, 50)
for n in (50, 57, 62, 66, 69, 74):
    note(1, n, 5.0, 4.5, 95)
    note(3, n + 12, 5.0, 4.4, 80)
    note(4, n, 5.0, 3.8, 80)
note(5, 26, 5.0, 4.5, 100)
ramp(1, 6.5, 9.4, 120, 70)
ramp(3, 6.5, 9.4, 120, 30)
ramp(4, 6.0, 9.0, 120, 30)
for ch in (0, 2, 4, 8):
    cc(ch, 11, 120, 0.0)
ramp(0, 6.0, 9.5, 120, 100)

# ---------------- A: Estar presente / Educar (compassos 3–17)
cc(3, 11, 0, 9.4)
ramp(1, 9.5, 49.0, 70, 100, steps=80)
for b in range(3, 18):
    piano_arp(b, vel=58 + (b - 3) * 1.2)
    pad_bar(b, vel_str=55 + (b - 3))
    if b >= 11:
        melody(b, ch=2, vel=62 + (b - 11) * 3)
    if b >= 7:
        note(6, 38 if chord_of(b) in ("D", "Bm") else 33, bar(b), 0.6, 45 + b)
        note(9, 36, bar(b), 0.3, 50 + b * 2)
# swell para Resultados
ramp(2, bar(17), bar(18), 90, 120)
snare_roll(bar(17) + 2 * BEAT, bar(18), 10, 90)

# ---------------- B: Resultados (compassos 18–31) — construção
ramp(1, bar(18), bar(32), 95, 127, steps=80)
for b in range(18, 32):
    k = (b - 18) / 13
    piano_arp(b, sixteenth=True, vel=62 + k * 18)
    pad_bar(b, vel_str=70 + k * 30, horns=b >= 22, vel_ch=60 + k * 40)
    if b >= 22:
        melody(b, ch=2, vel=75 + k * 30, octave=0, var=b >= 26)
    drums_build(b, k)
    note(6, 38 if chord_of(b) in ("D", "Bm") else 33, bar(b), 0.6, 70 + k * 40)
hit(bar(18), 105, 50)
hit(bar(22), 110, 47)  # início dos pilares
# pré-clímax
timp_roll(bar(31), bar(32), 38, 40, 127)
snare_roll(bar(30) + 2 * BEAT, bar(32), 20, 125)
ramp(3, bar(30), bar(32), 0, 120)

# ---------------- C: Clímax — Melhorar / Avançar / Reconhecer / Celebrar + Destaques + Eventos (32–44)
for b in range(32, 45):
    piano_arp(b, sixteenth=True, vel=88)
    pad_bar(b, vel_str=105, choir=True, horns=True, vel_ch=100)
    melody(b, ch=2, vel=112, octave=12, var=(b // 4) % 2 == 1)
    melody(b, ch=4, vel=100, octave=0, var=(b // 4) % 2 == 1)
    drums_epic(b)
for b in (32, 33, 34, 35):  # uma pancada por palavra
    hit(bar(b), 127, CH[chord_of(b)][0] + 12 if chord_of(b) != "G" else 55)
hit(bar(36) + 0.35, 115, 50)  # Destaques trimestrais (~98,2 s)
hit(bar(40), 120, 50)  # Feiras e eventos
# saída suave para o depoimento
for ch in (1, 2, 3, 4, 7, 8):
    ramp(ch, bar(44), bar(45) + 0.5, 127, 40)
cc(9, 7, 120, 0)
ramp(9, bar(44) + 2 * BEAT, bar(45), 120, 0, c=7)

# ---------------- D: Depoimento (45–51): piano íntimo + pad
for ch in (1, 2, 3, 4, 8):
    cc(ch, 11, 70, bar(45) + 0.6)
cc(0, 11, 90, bar(45))
for b in range(45, 52):
    bass, tri = CH[chord_of(b)]
    t = bar(b)
    for i, n in enumerate([tri[0], tri[2], tri[1] + 12, tri[2]]):
        note(0, n + 12, t + i * BEAT, BEAT * 1.8, 78)
    note(0, bass, t, BAR, 70)
    for n in tri:
        note(7, n - 12, t, BAR * 0.98, 60)
    note(1, tri[0], t, BAR * 0.98, 60)
# volta da bateria para o final
cc(9, 7, 120, bar(51))

# ---------------- E: Encerramento (52 → fim): montagem das palavras + logo final
t_enc = 140.8
ramp(1, bar(51), t_enc + 3.0, 50, 127)
ramp(3, bar(51), t_enc + 3.0, 0, 120)
snare_roll(bar(51), t_enc + 3.27, 15, 127)
timp_roll(t_enc, t_enc + 3.27, 38, 50, 127)
for n in (45, 52, 57, 61, 64):
    note(1, n, bar(51), t_enc + 3.27 - bar(51), 100)
    note(3, n + 12, t_enc, 3.27, 90)
for k in range(8):  # palavras (11 frames cada)
    tk = t_enc + k * 11 / 30
    note(9, 41 + (k % 3) * 2, tk, 0.3, 90 + k * 4)
    note(0, [74, 76, 78, 81, 83, 85, 86, 90][k], tk, 0.5, 90)
T_LOGO = t_enc + 98 / 30  # 144,07 s
hit(T_LOGO, 127, 50)
for ch in (1, 2, 3, 4, 8):
    cc(ch, 11, 127, T_LOGO - 0.01)
for n in (38, 50, 57, 62, 66, 69, 74, 78):
    note(1, n, T_LOGO, END - T_LOGO, 115)
    note(3, n + 12 if n > 45 else n, T_LOGO, END - T_LOGO, 100)
    note(4, n, T_LOGO, 5.0, 105)
note(2, 86, T_LOGO, END - T_LOGO, 110)
note(5, 26, T_LOGO, END - T_LOGO, 120)
note(9, 49, T_LOGO + 2.67, 3.0, 110)
note(6, 38, T_LOGO + 2.67, 1.0, 110)
note(9, 36, T_LOGO + 2.67, 0.5, 120)
for ch in (1, 2, 3, 4, 5, 7, 8):
    ramp(ch, T_LOGO + 3.0, END, 127, 0)

# ---------------- grava MIDI
mid = mido.MidiFile(ticks_per_beat=TPS)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
events.sort(key=lambda e: (e[0], e[1]))
last = 0
for t, _, msg in events:
    tick = max(0, int(round(t * TPS)))
    msg.time = tick - last
    last = tick
    tr.append(msg)
tr.append(mido.MetaMessage("end_of_track", time=TPS * 2))
mid.save("scripts/trilha.mid")
print("ok", len(events), "eventos")
