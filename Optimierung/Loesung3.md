# Aufgabe 3 – Ein Index

> Ausgangslage: [`CurrentExerciseState.md`](CurrentExerciseState.md) · Kosten: [`Loesung2.md`](Loesung2.md)

## Empfehlung

**B-Baum-Index auf `Bild(datum)`**

---

## Begründung

### Wo entstehen die Kosten ohne Index?

Aus Aufgabe 2 (Baum 1 + Hash Join): **78.266** Seitenzugriffe gesamt.

| Anteil | Kosten | Anteil |
|--------|--------|--------|
| Selektionen | 64.480 | ca. 82 % |
| Joins + Projektion | 13.786 | ca. 18 % |

Die drei Selektionen im Detail:

| Filter | Relation | Kosten (ohne Index) | Selektivität |
|--------|----------|---------------------|--------------|
| `typ = 'Standard'` | Ferienwohnung (27.344 S.) | 41.016 | 0,5 |
| `datum > '01.03.2021'` | Bild (23.438 S.) | **23.462** | **0,001** |
| `name = 'Bodensee'` | Region (1 S.) | 2 | 0,01 |

→ Ein einzelner Index sollte vor allem **teure, selektive Filter** verbessern.

---

### Warum `Bild.datum`?

1. **Hohe Selektivität** (`sel = 0,001`): Nur 1.200 von 1.200.000 Bildern erfüllen die Bedingung — der Index muss nur wenige Treffer liefern.
2. **Teurer Full Table Scan:** Ohne Index werden alle **23.438 Seiten** von `Bild` gelesen.
3. **Range-Query:** `datum > '01.03.2021'` eignet sich ideal für einen **B-Baum-Index** (Bereichssuche).
4. **Große Ersparnis:** Statt 23.438 Seiten Scan nur Indexpfad + ca. 24 Seiten für die Treffer — Ersparnis grob **ca. 23.000 Seitenzugriffe** allein bei der Selektion.

---

### Warum nicht die Alternativen?

| Kandidat | Problem |
|----------|---------|
| **`Ferienwohnung(typ)`** | Zwar teuerster Einzelposten (41.016), aber Selektivität nur 0,5 — die Hälfte der Tabelle (200.000 Tupel) muss trotzdem gelesen werden. Weniger Ersparnis als bei `datum`. |
| **`Ferienwohnung(fnr)` / `Bild(fnr)`** | Join-Attribute — Index-Join möglich, aber B' (24 S.) und R' (1 S.) passen bereits in den Hauptspeicher (Hash Join ca. 13.739). Geringerer Effekt als bei der Selektion auf Bild. |
| **`Ferienwohnung(rnr)`** | Analog — Join zu Region ist mit R' = 1 Tupel bereits günstig. |
| **`Region(name)`** | Tabelle hat nur **1 Seite** — Index bringt praktisch nichts. |

---

## Fazit

**Index auf `Bild(datum)`** maximiert den Nutzen des einen verfügbaren Index: stark selektiver Filter auf der zweitgrößten Relation, klassischer Anwendungsfall für einen B-Baum, größte absolute I/O-Ersparnis gegenüber Full Table Scan.
