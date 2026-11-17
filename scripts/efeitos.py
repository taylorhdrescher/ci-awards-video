"""Efeitos sonoros dos indicadores — versão musical (sinos no tom da trilha, Ré maior).
Gera scripts/efeitos.mid; renderizado com fluidsynth para public/audio/efeitos.wav.
Enquanto o número sobe: arpejo suave de celesta/glockenspiel acompanhando a curva do contador.
No valor final: acorde de vibrafone + sino.
"""
import mido

FPS = 30
TPS = 480  # ticks por segundo (60 bpm)
events = []

def note(ch, n, t, d, v):
    events.append((t, 1, mido.Message("note_on", channel=ch, note=n, velocity=max(1, min(127, int(v))))))
    events.append((t + d, 0, mido.Message("note_off", channel=ch, note=n, velocity=0)))

# canais: 0 celesta(8), 1 glockenspiel(9), 2 vibrafone(11), 3 sinos tubulares(14), 4 harpa(46)
for ch, p in {0: 8, 1: 9, 2: 11, 3: 14, 4: 46}.items():
    events.append((0, -1, mido.Message("program_change", channel=ch, program=p)))
    events.append((0, -1, mido.Message("control_change", channel=ch, control=91, value=100)))

# escala de Ré maior pentatônica (soa sempre bem sobre a trilha)
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88, 90, 93]

def counter(start_f, dur_f, n=12, vel=55, base=0, big=False):
    t0 = start_f / FPS
    d = dur_f / FPS
    for k in range(n):
        p = (k + 1) / n
        u = 1 - (1 - p) ** (1 / 3)  # acompanha o easeOutCubic do número
        nt = PENTA[min(len(PENTA) - 1, base + k)]
        note(0, nt, t0 + u * d * 0.92, 0.5, vel * (0.55 + 0.45 * p))
    tf = t0 + d
    for nt in (74, 78, 81, 86):  # acorde final Ré maior
        note(2, nt, tf, 2.5, 80 if big else 62)
    note(1, 86 if big else 81, tf, 1.5, 85 if big else 65)
    if big:
        note(3, 62, tf, 3.0, 70)

def harp_gliss(start_f, vel=50):
    t0 = start_f / FPS
    for k, nt in enumerate(PENTA[:10]):
        note(4, nt - 12, t0 + k * 0.035, 1.0, vel)

S4A, S4B, S4C = 1488, 1744, 2210

# Totais
counter(S4A + 35, 60, n=12, base=0, big=True)
counter(S4A + 55, 60, n=10, vel=45, base=2)
harp_gliss(S4A + 100)
counter(S4A + 110, 40, n=10, base=3, big=True)

# Pilares: um sino por card, subindo a escala
for i in range(6):
    tf = (S4B + 20 + 12 * i + 55) / FPS
    note(1, PENTA[4 + i], tf, 1.2, 60 + i * 4)
    note(2, PENTA[2 + i], tf, 1.5, 45)
note(3, 62, (S4B + 20 + 60 + 55) / FPS, 3.0, 60)

# Detalhes
counter(S4C + 30, 55, n=12, base=1, big=True)
for k, dly in enumerate((60, 80, 92, 110)):
    harp_gliss(S4C + dly, vel=35)
counter(S4C + 60, 50, n=8, vel=42, base=3)
counter(S4C + 80, 45, n=8, vel=42, base=4)

mid = mido.MidiFile(ticks_per_beat=TPS)
tr = mido.MidiTrack()
mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo", tempo=1_000_000, time=0))
events.sort(key=lambda e: (e[0], e[1]))
last = 0
for t, _, msg in events:
    tick = int(round(t * TPS))
    msg.time = tick - last
    last = tick
    tr.append(msg)
mid.save("scripts/efeitos.mid")
print("ok")
