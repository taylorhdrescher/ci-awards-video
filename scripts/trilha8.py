"""Trilha da V8 (composta por código, sem direitos de terceiros) — 120 BPM, Si menor/Ré maior.
1 compasso = 2 s = 60 quadros: todo corte do vídeo cai num tempo da grade.
Gera scripts/trilha8.mid → fluidsynth (FluidR3_GM) → public/audio/trilha8.wav

  python3 scripts/trilha8.py && fluidsynth -ni -g 0.7 -r 44100 -F public/audio/trilha8.wav /usr/share/sounds/sf2/FluidR3_GM.sf2 scripts/trilha8.mid
"""
import mido

BPM = 120
SPB = 60 / BPM  # 0,5 s por tempo
BAR = 4 * SPB
TOTAL_BARS = 66  # 132 s = 3960 quadros
TPS = 480
events = []


def note(ch, n, t, d, v):
    v = max(1, min(127, int(v)))
    events.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=v)))
    events.append((t + d, 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))


def cc(ch, c, val, t):
    events.append((t, 0, mido.Message("control_change", channel=ch, control=c, value=max(0, min(127, int(val))))))


def b(x):  # compasso → segundos
    return x * BAR


# canais: 0 cordas, 1 baixo sintetizado, 2 piano, 3 metais, 4 marimba, 5 pad sintetizado, 9 bateria
for ch, prog in {0: 48, 1: 38, 2: 0, 3: 61, 4: 12, 5: 89}.items():
    events.append((0, -1, mido.Message("program_change", channel=ch, program=prog)))
    events.append((0, -1, mido.Message("control_change", channel=ch, control=91, value=70)))
cc(1, 91, 20, 0)
cc(4, 91, 50, 0)

# progressão (1 acorde por compasso): Bm G D A
CHORDS = [("Bm", 47, [59, 62, 66]), ("G", 43, [55, 59, 62]), ("D", 50, [57, 62, 66]), ("A", 45, [57, 61, 64])]
ARP = {"Bm": [71, 74, 78, 74], "G": [67, 71, 74, 71], "D": [69, 74, 78, 74], "A": [69, 73, 76, 73]}
HOOK = [  # (nota, início em tempos, duração em tempos) — melodia dos metais, 4 compassos
    [(78, 0, 1.5), (76, 1.5, 0.5), (74, 2, 2)],
    [(74, 0, 1), (76, 1, 1), (78, 2, 2)],
    [(81, 0, 1.5), (78, 1.5, 0.5), (76, 2, 1), (74, 3, 1)],
    [(76, 0, 3), (73, 3, 1)],
]

# energia por compasso: 0 nada, 1 pad, 2 pad+pulso, 3 groove, 4 groove+marimba, 5 tudo (com melodia)
E = {}
def setE(a, z, e):
    for i in range(a, z):
        E[i] = e

setE(0, 1, 1)     # anel 3D
setE(1, 2, 0)     # palavras (só batidas/impactos)
setE(2, 4, 2)     # anos
setE(4, 6, 5)     # título CI Awards
setE(6, 8, 3)     # estar presente
setE(8, 14, 4)
setE(14, 20, 4)   # educar / incluir
setE(20, 23, 5)   # inspirar
setE(23, 38, 4)   # resultados
setE(26, 28, 5)
setE(38, 40, 0)   # 4 palavras (impactos)
setE(40, 48, 4)   # trimestres + rajada
setE(44, 48, 5)
setE(48, 54, 4)   # eventos
setE(54, 59, 1)   # depoimento (respiro)
setE(59, 61, 3)   # 8 palavras
setE(61, 65, 5)   # final
setE(65, 66, 1)

for bar in range(TOTAL_BARS):
    e = E.get(bar, 0)
    name, root, tri = CHORDS[bar % 4]
    t0 = b(bar)
    if bar == 65:  # acorde final sustentado
        for n in [62, 66, 69, 74]:
            note(0, n, t0, 2.0, 80)
            note(5, n - 12, t0, 2.0, 70)
        note(1, 38, t0, 2.0, 90)
        continue
    if e >= 1:
        for n in tri:
            note(0, n, t0, BAR, 52 + 10 * min(e, 3))
            note(5, n - 12, t0, BAR, 45)
    if e == 1 and bar >= 54:  # piano suave no depoimento
        for k, n in enumerate(ARP[name]):
            note(2, n, t0 + k * SPB, SPB * 1.5, 50)
    if e >= 2:
        for k in range(8):  # baixo em colcheias
            note(1, root, t0 + k * SPB / 2, SPB / 2 * 0.8, 85 if k % 2 == 0 else 70)
        for k in range(8):
            note(9, 42, t0 + k * SPB / 2, 0.1, 55 if k % 2 else 75)
    if e == 2:
        note(9, 36, t0, 0.2, 100)
        note(9, 36, t0 + 2 * SPB, 0.2, 100)
    if e >= 3:
        for k in range(4):
            note(9, 36, t0 + k * SPB, 0.2, 112)
        note(9, 39, t0 + SPB, 0.2, 100)
        note(9, 39, t0 + 3 * SPB, 0.2, 100)
        note(9, 38, t0 + 3 * SPB, 0.2, 70)
        for k in (0.5, 1.5, 2.5, 3.5):  # piano nos contratempos
            for n in tri:
                note(2, n + 12, t0 + k * SPB, 0.18, 72)
        note(9, 46, t0 + 3.5 * SPB, 0.25, 60)
    if e >= 4:
        arp = ARP[name]
        for k in range(16):
            note(4, arp[k % 4] + (12 if k % 8 >= 4 else 0), t0 + k * SPB / 4, 0.12, 62 + (12 if k % 4 == 0 else 0))
    if e >= 5:
        for n, st, du in HOOK[bar % 4]:
            note(3, n - 12, t0 + st * SPB, du * SPB * 0.95, 92)

# pratos de ataque nos começos de bloco
for bar in (4, 6, 14, 20, 23, 40, 48, 59, 61):
    note(9, 49, b(bar), 1.5, 115)

# rufos/subidas antes das viradas grandes
for bar in (3, 22, 39, 58, 60):
    for k in range(16):
        note(9, 38, b(bar) + k * SPB / 4, 0.08, 40 + k * 5)

# impactos dos cortes secos (abertura: 60, 90, 120 quadros; reconhecimento: 4 palavras)
def hit(t, big=False):
    note(9, 36, t, 0.3, 127)
    note(9, 49 if big else 57, t, 1.2, 110)
    for n in ([50, 57, 62, 66] if big else [50, 57]):
        note(3, n, t, 0.35, 110)

for f in (60, 90, 120):
    hit(f / 30)
for k, f in enumerate((2280, 2310, 2340, 2370)):
    hit(f / 30, big=(k == 3))
hit(3660 / 30, big=True)

events.sort(key=lambda x: (x[0], x[1]))
mid = mido.MidiFile(ticks_per_beat=TPS)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000))  # 60 bpm → 1 tick = 1/480 s
last = 0
for t, _, msg in events:
    tick = int(round(t * TPS))
    tr.append(msg.copy(time=max(0, tick - last)))
    last = max(last, tick)
mid.save("scripts/trilha8.mid")
print("ok", len(events), "eventos,", TOTAL_BARS * BAR, "s")
