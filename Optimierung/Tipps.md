# Tipps – Transformationsregeln

## Relationale Algebra – Symbole

| Symbol | Name | Entspricht in SQL |
|--------|------|-------------------|
| **×** | Kreuzprodukt (Cartesian Product) | `FROM A, B` (alle Kombinationen) |
| **σ** (Sigma) | Selektion (Filter) | `WHERE` |
| **⋈** | Join | `WHERE a.id = b.id` |
| **π** (Pi) | Projektion | `SELECT` (nur bestimmte Spalten) |

## Kurzüberblick
| Regel | Idee |
|-------|------|
| **Selektion nach unten** | Filter so früh wie möglich auf die jeweilige Tabelle |
| **Selektion vor Join** | Erst filtern, dann joinen → kleinere Zwischenergebnisse |
| **Projektion nach unten** | Nur `url` + Join-Attribute behalten |
| **Join-Reihenfolge** | `(F ⋈ R) ⋈ B` und `(F ⋈ B) ⋈ R` sind die sinnvollen Varianten |
| **Kommutativität** | Kleinere Relation zuerst (hier: Region mit 1 Tupel nach Selektion) |

## Kardinalitäten nach Selektion

**Formel:** `Neue Kardinalität = Alte Kardinalität × Selektivität`

| Selektivität | Bedeutung |
|--------------|-----------|
| **1,0** | Alle Zeilen bleiben (100 %) |
| **0,5** | Die Hälfte bleibt (50 %) |
| **0,01** | Nur 1 % bleibt |
| **0,001** | Nur 0,1 % bleibt (1 von 1000) |

### F' – Ferienwohnung, `typ = 'Standard'`

```
400.000 × 0,5 = 200.000
```

- Es gibt 400.000 Ferienwohnungen insgesamt
- Selektivität **0,5** → ungefähr die Hälfte ist vom Typ „Standard“
- Also bleiben **200.000 Zeilen**

### R' – Region, `name = 'Bodensee'`

```
100 × 0,01 = 1
```

- Es gibt 100 Regionen insgesamt
- Selektivität **0,01** → nur **1 %** hat den Namen „Bodensee“
- 1 % von 100 = **1 Region** (genau Bodensee)
- Das ist der extremste Filter: R' hat praktisch nur **ein einziges Tupel**

### B' – Bild, `datum > '01.03.2021'`

```
1.200.000 × 0,001 = 1.200
```

- Es gibt 1.200.000 Bilder insgesamt
- Selektivität **0,001** → nur **0,1 %** ist neuer als das Datum
- 0,1 % von 1.200.000 = **1.200 Bilder**
