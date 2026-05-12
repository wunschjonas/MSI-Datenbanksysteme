# MSI---Datenbanksysteme

Die Übungsaufgaben für das Fach Konzepte aktueller Datenbanksysteme. Behandelt werden MongoDB, Neo4J und Optimierung

## MongoDB

Im MongoDB-Ordner wurden die Übungsaufgaben zum Thema MongoDB bearbeitet. Dies umfasst:

- Setup einer MongoDB-Datenbank mit Docker Compose (Version 8.0)
- Initialisierung der Datenbank "hochschule" mit Collections für Studiengänge und Vorlesungen, inklusive JSON-Schema-Validierung
- Einfügen von Beispieldaten für verschiedene Studiengänge (AIN, WIN, GIB, MSI) und deren Vorlesungen
- Ausführung verschiedener Abfragen (Queries) zur Beantwortung von Fragen wie Filterung nach Abschlussart, Suche nach Vorlesungen mit bestimmten Kriterien, Aggregationen und Vergleiche zwischen Feldern

Die Lösungen sind in den Dateien `01-init-db.js`, `02-queries.js` und `03-queries.js` implementiert. Das Übungsblatt ist als PDF verfügbar.

## Neo4J

Im Neo4j-Ordner wurden die Übungsaufgaben zum Thema Graphdatenbanken mit Neo4j bearbeitet. Genutzt wird der klassische Neo4j-Movies-Beispieldatensatz (Personen, Filme, Beziehungen wie ACTED_IN, DIRECTED, PRODUCED).

### Übungsblatt 1

- **Datenbankinitialisierung** (`Init.txt`): Aufbau des Movies-Graphen mit Cypher-`CREATE`-Statements (Nodes für Filme und Personen, Kanten für Rollen wie ACTED_IN, DIRECTED, PRODUCED, WROTE)
- **Grundlegende Suchen** (`Search.txt`): Einfache `MATCH`-Abfragen zur Exploration des Graphen (z. B. Person nach Name, Filme nach Jahrzehnt)
- **Aufgaben** (`Übungsblatt 1 zu Neo4j.txt`):
  - **a)** Ermittlung der drei häufigsten Regisseure, mit denen Tom Hanks zusammengedreht hat (Traversierung über ACTED_IN → DIRECTED)
  - **b)** Einfügen von `KNOWS`-Beziehungen zwischen allen Personen, die gemeinsam an einem Film beteiligt waren (Schauspieler und Regisseure), sowie Zählung der eingefügten Relationen (1060 gerichtet / 530 eindeutige Paare)
  - **c)** Filmpartner-Empfehlungen für Keanu Reeves: Personen, die er nicht direkt kennt, aber seine Bekannten kennen (38 Empfehlungen)
  - **d)** Berechnung der Bacon-Zahl zwischen Keanu Reeves und Kevin Bacon mittels `shortestPath` (Ergebnis: 2)
  - **e)** Suche nach Schauspieler-Paaren, die gemeinsam in mindestens drei Filmen gespielt haben (7 Paare gefunden)

> Übungsblatt 2 steht noch aus.

## Optimierung

_(Platzhalter für zukünftige Inhalte)_
