# Plan: Neo4j Gebäudeplan O-Gebäude

## Aufgabe
Gebäudeplan (EG + 1. OG) des O-Gebäudes in Neo4j modellieren und für Kürzeste-Wege-Anfragen nutzbar machen.

---

## Phase 1: Datenmodell (Graph Schema)

### Node-Labels (Multi-Label-Ansatz)
Jeder Raum erhält `:Raum` als Basislabel + ein spezifisches Label:
- `:Raum:Buero`
- `:Raum:Hoersaal`
- `:Raum:PCPool`
- `:Raum:Teekueche`
- `:Raum:Druckerraum`
- `:Raum:Toilette`
- `:Raum:Sonstige`
- `:Raum:Treppenhaus` (Modellierung des Treppenhauses als eigener Raum)
- `:Raum:Aufzug`       (Modellierung des Aufzugs als eigener Raum)
- `:Raum:Eingang`      (Süd- und Osteingang)

### Node-Eigenschaften
| Label         | Eigenschaften                                    |
|---------------|--------------------------------------------------|
| Alle `:Raum`  | `raumNr: String`, `name: String`, `etage: Int`   |
| `:Hoersaal`   | + `sitzplaetze: Int`, `ausstattung: [String]`    |
| `:PCPool`     | + `sitzplaetze: Int`, `ausstattung: [String]`    |
| `:Buero`      | + `personen: [String]`                           |
| `:Toilette`   | + `typ: String` ("damen"/"herren"/"behindert")   |
| `:Eingang`    | + `seite: String` ("sued"/"ost")                 |

### Relationship-Typen
- `:GANG`    → Flurverbindung
- `:TREPPE`  → Treppenverbindung (nur zwischen Treppenhaus-Knoten)
- `:AUFZUG`  → Aufzugverbindung  (nur zwischen Aufzug-Knoten)

### Relationship-Eigenschaften
- `dauer: Int` (Sekunden)
- `barrierefrei: Boolean`

Beziehungen sind bidirektional → zwei gerichtete Kanten pro Verbindung, oder undirektiert + MATCH ohne Richtung bei Queries.

---

## Aufgabe 1 — Designentscheidungen

### Label vs. Property?
**Als Label** modellieren, wenn:
- man effizient nach dem Typ filtern/traversieren will (Neo4j indiziert Labels)
- der Wert aus einer festen, überschaubaren Menge kommt (z.B. Raumtyp)

**Als Property** modellieren, wenn:
- der Wert variabel/beschreibend ist (z.B. `name`, `sitzplaetze`, `dauer`)
- mehrere Ausprägungen in einem Feld sinnvoll sind (z.B. `personen: [String]`)

→ Konsequenz für unser Modell:
- **Raumtyp** (Büro, Hörsaal, …) → **Label** (`:Buero`, `:Hoersaal`, …)
- **Toilettentyp** (Damen/Herren/Behindert) → **Property** `typ`, weil sonst zu viele Labels
- **Wegtyp** (Gang/Treppe/Aufzug) → **Relationship-Type** (nicht Property!)
- `barrierefrei`, `dauer`, `etage` → **Properties**

### Welche Projection ist vorteilhaft?
Für Kürzeste-Wege-Anfragen mit GDS:
- **Native Projection** (bevorzugt): Schnell, direkt aus dem gespeicherten Graphen;
  `gds.graph.project('gebaeude', 'Raum', {GANG: {properties: 'dauer'}, TREPPE: ..., AUFZUG: ...})`
- **Cypher Projection**: Flexibler (z.B. nur barrierefreie Kanten projizieren), aber langsamer
  → für barrierefreie Dijkstra-Anfragen sinnvoll als separate Projektion

→ Empfehlung: **zwei Projektionen** anlegen:
  1. Vollständige Native Projection (alle Wege)
  2. Cypher Projection gefiltert auf `barrierefrei: true` (für Rollstuhl-Routing)

---

## Phase 2: Modellierungsentscheidungen

### Treppe/Aufzug-Knoten (Lösung B)
- Treppenhaus und Aufzug werden als **eigene Raum-Knoten pro Etage** modelliert
  - z.B. `Treppenhaus_EG`, `Treppenhaus_OG`
  - Verbunden via `:TREPPE {dauer: 30, barrierefrei: false}`
- Gleiches für Aufzug: `Aufzug_EG`, `Aufzug_OG`
  - Verbunden via `:AUFZUG {dauer: 60, barrierefrei: true}`
- Angrenzende Räume/Flure werden mit diesen Knoten via `:GANG` verbunden

### Eingänge
- `Eingang_Sued` und `Eingang_Ost` als `:Raum:Eingang`-Knoten, verbunden mit den angrenzenden Flur-/Raumknoten

---

## Phase 3: Cypher-Implementierung

### Schritt 1: Constraints & Indizes
```cypher
CREATE CONSTRAINT FOR (r:Raum) REQUIRE r.raumNr IS UNIQUE
```

### Schritt 2: Nodes anlegen
Reihenfolge: EG-Räume → OG-Räume → Treppen-/Aufzugknoten → Eingänge

### Schritt 3: Beziehungen anlegen
Benachbarte Räume via MATCH + CREATE RELATIONSHIP

### Schritt 4: Shortest-Path-Queries
- Allgemein: `apoc.algo.dijkstra` oder GDS `shortestPath`
- Barrierefrei: WHERE-Filter auf `barrierefrei: true`

---

## Phase 4: Beispiel-Queries

1. Kürzester Weg zwischen zwei Räumen (nach Zeit)
2. Kürzester barrierefreier Weg
3. Alle Hörsäle mit Beamer im EG finden
4. Freie Büros finden

---

## Offene Punkte
- Gebäudeplan-Bilder vom User noch ausstehend → genaue Raumbezeichnungen fehlen
- Nach Erhalt der Pläne: Phase 3 mit echten Raumbezeichnungen befüllen
