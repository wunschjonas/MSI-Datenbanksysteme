# Ausgangslage – Übungsblatt Optimierung

## SQL-Abfrage

```sql
SELECT b.url
FROM Ferienwohnung f, Region r, Bild b
WHERE f.rnr = r.rnr
  AND f.fnr = b.fnr
  AND f.typ = 'Standard'
  AND r.name = 'Bodensee'
  AND b.datum > '01.03.2021';
```

**Hinweis:** In den Selektivitäten steht `seldatum > '01.03.2018'`, die Abfrage filtert auf `> '01.03.2021'`. Für die Rechnung wird die gegebene Selektivität **0,001** verwendet.

## Relationen

| Relation       | \|R\|       | Tupelgröße |
|----------------|------------|------------|
| Ferienwohnung  | 400.000    | 70 Bytes   |
| Region         | 100        | 10 Bytes   |
| Bild           | 1.200.000  | 20 Bytes   |

## Selektivitäten

| Prädikat / Join                    | Symbol    | Wert        |
|------------------------------------|-----------|-------------|
| Join Ferienwohnung–Region          | sel_FR    | 0,01        |
| Join Ferienwohnung–Bild            | sel_FB    | 2 · 10⁻⁶    |
| σ typ = 'Standard' (Ferienwohnung)  | sel_typ   | 0,5         |
| σ name = 'Bodensee' (Region)       | sel_name  | 0,01        |
| σ datum > '…' (Bild)               | sel_datum | 0,001       |

## Systemparameter

- Seitengröße: **1024 Bytes**
- Verfügbarer Hauptspeicher: **1000 Seiten**
- **Keine Indexe** definiert

## Seitenanzahl (Vorberechnung)

| Relation      | Berechnung                         | Seiten |
|---------------|------------------------------------|--------|
| Ferienwohnung | ⌈400.000 · 70 / 1024⌉            | 27.344 |
| Region        | ⌈100 · 10 / 1024⌉                | 1      |
| Bild          | ⌈1.200.000 · 20 / 1024⌉          | 23.438 |
