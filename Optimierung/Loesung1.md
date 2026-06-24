# Aufgabe 1 – Optimaler Auswertungsplan

## Lösung

### Ziel

Mit **Transformationsregeln** der relationalen Algebra einen möglichst günstigen Auswertungsplan finden und die **zwei erfolgsversprechendsten Auswertungsbäume** angeben.

### Relationale Algebra (Ausgangsausdruck)

```
π_url (
  σ_{f.rnr=r.rnr ∧ f.fnr=b.fnr ∧ f.typ='Standard' ∧ r.name='Bodensee' ∧ b.datum>'01.03.2021'}
  ( Ferienwohnung × Region × Bild )
)
```

### Nach Regel 1 – Selektionen nach unten

```
π_url (
  σ_{f.rnr=r.rnr ∧ f.fnr=b.fnr}
  (
    σ_{typ='Standard'}(Ferienwohnung)
    × σ_{name='Bodensee'}(Region)
    × σ_{datum>'01.03.2021'}(Bild)
  )
)
```

Kurznotation:

- **F'** = σ_{typ='Standard'}(F)  
- **R'** = σ_{name='Bodensee'}(R)  
- **B'** = σ_{datum>'01.03.2021'}(B)

### Kardinalitäten nach Selektion

| Relation | \|R\| · Selektivität | Tupel |
|----------|----------------------|-------|
| F'       | 400.000 · 0,5        | 200.000 |
| R'       | 100 · 0,01           | 1 |
| B'       | 1.200.000 · 0,001    | 1.200 |

### Mögliche Join-Reihenfolgen

Es gibt **keinen direkten Join** zwischen Region und Bild. Sinnvolle Bäume:

```
Baum 2:  π_url ( (F' ⋈_FR R') ⋈_FB B' )
Baum 1:  π_url ( (F' ⋈_FB B') ⋈_FR R' )
```

*(Vertauschte Operanden z. B. `R' ⋈ F'` sind durch Kommutativität äquivalent — keine weiteren Pläne.)*

### Zwischenergebnis-Größen (für Vergleich der Bäume)

**Join F' ⋈ R'** (sel_FR = 0,01):

```
|F' ⋈ R'| = |F'| · |R'| · sel_FR = 200.000 · 1 · 0,01 = 2.000
```

**Join F' ⋈ B'** (sel_FB = 2 · 10⁻⁶):

```
|F' ⋈ B'| = |F'| · |B'| · sel_FB = 200.000 · 1.200 · 2·10⁻⁶ = 480
```

**Finales Ergebnis** (beide Pläne):

```
|Ergebnis| ≈ 2.000 · 1.200 · 2·10⁻⁶ = 480 · 1 · 0,01 ≈ 4,8 → ~5 Tupel
```

### Die zwei erfolgsversprechendsten Auswertungsbäume

Nach Anwendung aller Regeln (Selektionen unten, dann optimale Join-Reihenfolge) bleiben **zwei wesentlich unterschiedliche Pläne**. Alle anderen Varianten sind durch Kommutativität äquivalent zu einem dieser beiden.

---

#### Baum 1 – `(F' ⋈ B') ⋈ R'` *(voraussichtlich günstiger)*

**Relationale Algebra:**

```
π_url ( (σ_{typ='Standard'}(F) ⋈_{f.fnr=b.fnr} σ_{datum>'01.03.2021'}(B))
          ⋈_{f.rnr=r.rnr} σ_{name='Bodensee'}(R) )
```

**Auswertungsbaum:**

```
              π_url
                |
          ⋈_{f.rnr = r.rnr}
         /                   \
       R'              ⋈_{f.fnr = b.fnr}
      (1)              /                  \
                    F'                    B'
                 (200.000)             (1.200)
```

**Ablauf:**

1. Selektionen auf F, R, B → F', R', B'
2. **1. Join:** F' ⋈ B' über `fnr` → **480 Tupel**
3. **2. Join:** Ergebnis ⋈ R' über `rnr` → **~5 Tupel**
4. Projektion auf `url`

**Begründung:** Der erste Join erzeugt mit **480 Tupeln** das kleinere Zwischenergebnis (gegenüber 2.000 beim anderen Plan). R' hat nach der Selektion nur **1 Tupel** und wird daher erst im zweiten, günstigen Schritt angebunden.

---

#### Baum 2 – `(F' ⋈ R') ⋈ B'` *(Alternative)*

**Relationale Algebra:**

```
π_url ( (σ_{typ='Standard'}(F) ⋈_{f.rnr=r.rnr} σ_{name='Bodensee'}(R))
          ⋈_{f.fnr=b.fnr} σ_{datum>'01.03.2021'}(B) )
```

**Auswertungsbaum:**

```
              π_url
                |
          ⋈_{f.fnr = b.fnr}
         /                   \
       B'              ⋈_{f.rnr = r.rnr}
    (1.200)            /                  \
                    R'                    F'
                    (1)                (200.000)
```

**Ablauf:**

1. Selektionen auf F, R, B → F', R', B'
2. **1. Join:** F' ⋈ R' über `rnr` → **2.000 Tupel**
3. **2. Join:** Ergebnis ⋈ B' über `fnr` → **~5 Tupel**
4. Projektion auf `url`

**Begründung:** Auch ein valider Plan – Region (1 Tupel) wird früh eingebunden, was den ersten Join begrenzt. Das Zwischenergebnis ist mit **2.000 Tupeln** aber **~4× größer** als bei Baum 1, was ohne Pipelining höhere Materialisierungs- und I/O-Kosten verursacht.

---

### Vergleich und Fazit

| Kriterium | Baum 1 `(F'⋈B')⋈R'` | Baum 2 `(F'⋈R')⋈B'` |
|-----------|---------------------|---------------------|
| Zwischenergebnis nach 1. Join | **480 Tupel** | 2.000 Tupel |
| Endergebnis | ~5 Tupel | ~5 Tupel |
| Kleinste Relation zuerst | R' (1) im 2. Schritt | R' (1) im 1. Schritt |
| Erwartete Kosten | **niedriger** | höher |

**Fazit:** Beide Bäume sind die einzigen sinnvollen Join-Reihenfolgen (kein R–B-Join möglich). **Baum 1** ist voraussichtlich optimal, weil das teuerste Zwischenergebnis minimiert wird. Die genaue Kostenprüfung folgt in `Loesung2.md`.

### Anschaulich

Stell dir vor, du suchst URLs von Bildern für Standard-Ferienwohnungen am Bodensee:

- **Baum 2:** Erst „Welche Standard-FW sind am Bodensee?“ → **2.000 Treffer**. Dann mit 1.200 Bildern abgleichen.
- **Baum 1:** Erst „Welche Standard-FW haben passende Bilder?“ → **480 Treffer**. Dann prüfen, welche am Bodensee liegen (nur 1 Region).

**Baum 1** hat nach Schritt 1 die kleinere Liste — deshalb ist er besser.
