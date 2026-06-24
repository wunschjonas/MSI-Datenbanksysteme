# Aufgabe 2 – Kostenabschätzung (ohne Pipelining)

> Ausgangslage: [`CurrentExerciseState.md`](CurrentExerciseState.md) · Bäume: [`Loesung1.md`](Loesung1.md)

## Annahmen

| Parameter | Wert |
|-----------|------|
| Seitengröße | 1.024 Bytes |
| Hauptspeicher **M** | 1.000 Seiten |
| Indexe | keine |
| Pipelining | **nein** → jedes Zwischenergebnis wird materialisiert (gelesen + geschrieben) |
| Kostenmaß | Anzahl **Seitenzugriffe** (Lesen + Schreiben) |

### Join-Algorithmen (Vorlesung)

**Einfacher Join-Algorithmus** (Nested Loop auf Seitenebene, R außen, S innen):

```
Kosten_join_einfach = b(R) + b(R) · b(S) + b(Ergebnis)
```

**Hash Join** (innere Relation S passt in den Speicher, d. h. b(S) ≤ M − 1):

```
Kosten_join_hash = b(R) + b(S) + b(Ergebnis)
```

Build-Seite = jeweils die **kleinere** Relation (R' oder B').

**Selektion** σ ohne Index:

```
Kosten_σ = b(Relation) + b(gefilterte Relation)
```

**Projektion** π:

```
Kosten_π = b(Eingabe) + b(Ausgabe)
```

### Tupelgrößen Zwischenergebnisse

Vereinfacht: Summe der beteiligten Relationstupel (volle Zeilen):

| Zwischenergebnis | Tupel | Tupelgröße | Seiten b(·) |
|------------------|-------|------------|-------------|
| F' | 200.000 | 70 B | ⌈200.000·70/1024⌉ = **13.672** |
| R' | 1 | 10 B | **1** |
| B' | 1.200 | 20 B | ⌈1.200·20/1024⌉ = **24** |
| I₁ = F'⋈B' (Baum 1) | 480 | 90 B (70+20) | ⌈480·90/1024⌉ = **43** |
| I₁ = F'⋈R' (Baum 2) | 2.000 | 80 B (70+10) | ⌈2.000·80/1024⌉ = **157** |
| I₂ (vor π) | ~5 | 100 B (70+10+20) | **1** |
| Ergebnis (nur url) | ~5 | — | **1** |

### Basisrelationen (ungefiltert)

| Relation | Seiten |
|----------|--------|
| F | 27.344 |
| R | 1 |
| B | 23.438 |

---

## Schritt 0 – Selektionen (in beiden Bäumen gleich)

| Schritt | Operation | Kosten (Lesen + Schreiben) |
|---------|-----------|----------------------------|
| 1 | σ_typ auf F → F' | 27.344 + 13.672 = **41.016** |
| 2 | σ_name auf R → R' | 1 + 1 = **2** |
| 3 | σ_datum auf B → B' | 23.438 + 24 = **23.462** |
| | **Summe Selektionen** | **64.480** |

---

## Baum 1 – `(F' ⋈ B') ⋈ R'` *(günstigerer Plan aus Aufgabe 1)*

### Mit Hash Join

| Schritt | Operation | Berechnung | Kosten |
|---------|-----------|------------|--------|
| 4 | F' ⋈ B' → I₁ | b(F')+b(B')+b(I₁) = 13.672+24+43 | **13.739** |
| 5 | I₁ ⋈ R' → I₂ | b(I₁)+b(R')+b(I₂) = 43+1+1 | **45** |
| 6 | π_url | 1+1 | **2** |
| | **Summe Baum 1 (Hash)** | 64.480 + 13.739 + 45 + 2 | **78.266** |

*B' (24 Seiten) und R' (1 Seite) passen in M = 1.000 → Hash Join anwendbar.*

### Mit einfachem Join-Algorithmus

| Schritt | Operation | Berechnung | Kosten |
|---------|-----------|------------|--------|
| 4 | F' ⋈ B' → I₁ | 13.672 + 13.672·24 + 43 | **341.843** |
| 5 | I₁ ⋈ R' → I₂ | 43 + 43·1 + 1 | **87** |
| 6 | π_url | 2 | **2** |
| | **Summe Baum 1 (einfach)** | 64.480 + 341.843 + 87 + 2 | **406.412** |

---

## Baum 2 – `(F' ⋈ R') ⋈ B'` *(Alternative)*

### Mit Hash Join

| Schritt | Operation | Berechnung | Kosten |
|---------|-----------|------------|--------|
| 4 | F' ⋈ R' → I₁ | 13.672+1+157 | **13.830** |
| 5 | I₁ ⋈ B' → I₂ | 157+24+1 | **182** |
| 6 | π_url | 2 | **2** |
| | **Summe Baum 2 (Hash)** | 64.480 + 13.830 + 182 + 2 | **78.494** |

### Mit einfachem Join-Algorithmus

| Schritt | Operation | Berechnung | Kosten |
|---------|-----------|------------|--------|
| 4 | F' ⋈ R' → I₁ | 13.672 + 13.672·1 + 157 | **27.501** |
| 5 | I₁ ⋈ B' → I₂ | 157 + 157·24 + 1 | **3.926** |
| 6 | π_url | 2 | **2** |
| | **Summe Baum 2 (einfach)** | 64.480 + 27.501 + 3.926 + 2 | **95.909** |

---

## Vergleich

### Baum 1 vs. Baum 2 (gleicher Join-Algorithmus)

| Join-Algorithmus | Baum 1 | Baum 2 | Differenz | Günstiger |
|------------------|--------|--------|-----------|-----------|
| **Hash Join** | 78.266 | 78.494 | 228 | **Baum 1** |
| **Einfacher Join** | 406.412 | 95.909 | 310.503 | **Baum 2** |

### Hash Join vs. Einfacher Join (gleicher Baum)

| Baum | Hash Join | Einfacher Join | Faktor |
|------|-----------|----------------|--------|
| Baum 1 | 78.266 | 406.412 | ~5,2× teurer (einfach) |
| Baum 2 | 78.494 | 95.909 | ~1,2× teurer (einfach) |

---

## Fazit

1. **Mit Hash Join** (realistische Wahl, da B' und R' in den Speicher passen) ist **Baum 1** günstiger (**78.266** vs. **78.494** Seitenzugriffe). Der Vorteil aus Aufgabe 1 (kleineres Zwischenergebnis I₁: 43 vs. 157 Seiten) bestätigt sich quantitativ — allerdings dominiert der Anteil der **Selektionen** (64.480) die Gesamtkosten.

2. **Mit dem einfachen Join-Algorithmus** wäre **Baum 2** überraschend günstiger als Baum 1, weil der erste Join F'⋈B' im einfachen Verfahren katastrophal teuer ist (`13.672 · 24` zusätzliche Lesevorgänge). Das zeigt: **Join-Reihenfolge und Algorithmus hängen zusammen** — ein schlechter Plan mit gutem Algorithmus kann besser sein als ein guter Plan mit naivem Join.

3. **Empfehlung:** Baum 1 + Hash Join — konsistent mit Aufgabe 1 und deutlich günstiger als der einfache Join.
