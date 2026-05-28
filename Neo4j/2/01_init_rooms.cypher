// ============================================================
// 01_init_rooms.cypher
// Schritt 1: Constraint anlegen
// Schritt 2: Alle Räume (EG + 1. OG) initial ohne Details erstellen
// Details werden in einem späteren Schritt ergänzt.
// ============================================================

// --- Constraint ---
CREATE CONSTRAINT raum_raumNr_unique IF NOT EXISTS
FOR (r:Raum) REQUIRE r.raumNr IS UNIQUE;


// ============================================================
// ERDGESCHOSS (etage: 0)
// ============================================================

// O001 – O010
CREATE (:Raum:Sonstige {raumNr: 'O001', etage: 0});
CREATE (:Raum:Hoersaal {raumNr: 'O002', etage: 0, sitzplaetze: 0, ausstattung: ['Medientisch', 'Laserbeamer', 'Visualizer', 'Raumkamera', 'Deckenmikrofon', 'Umhaengemikrofon', 'Lautsprecher', 'Dozentenanschluss']});
CREATE (:Raum:Buero {raumNr: 'O003', etage: 0, personen: []});
CREATE (:Raum:Buero {raumNr: 'O004', etage: 0, personen: []});
CREATE (:Raum:Sonstige {raumNr: 'O005', etage: 0});
CREATE (:Raum:Sonstige {raumNr: 'O006', etage: 0});
CREATE (:Raum:Hoersaal {raumNr: 'O007', etage: 0, sitzplaetze: 0, ausstattung: []});
CREATE (:Raum:PCPool {raumNr: 'O008', etage: 0, sitzplaetze: 0, ausstattung: []});
CREATE (:Raum:Sonstige {raumNr: 'O009', etage: 0});
CREATE (:Raum:Sonstige {raumNr: 'O010', etage: 0});

// O083 – O089
CREATE (:Raum:Aufzug {raumNr: 'O083', etage: 0});
CREATE (:Raum:Treppenhaus {raumNr: 'O085', etage: 0});
CREATE (:Raum:Aufzug {raumNr: 'O086', etage: 0});
CREATE (:Raum:Treppenhaus {raumNr: 'O087', etage: 0});
CREATE (:Raum:Eingang {raumNr: 'O088', etage: 0, seite: ''});
CREATE (:Raum:Eingang {raumNr: 'O089', etage: 0, seite: ''});

// O091 – O093
CREATE (:Raum:Toilette {raumNr: 'O091', etage: 0, typ: 'herren'});
CREATE (:Raum:Sonstige {raumNr: 'O092', etage: 0});
CREATE (:Raum:Sonstige {raumNr: 'O093', etage: 0});


// ============================================================
// 1. OBERGESCHOSS (etage: 1)
// ============================================================

// O101 – O112
CREATE (:Raum:Sonstige {raumNr: 'O101', etage: 1});
CREATE (:Raum:Hoersaal {raumNr: 'O102', etage: 1, sitzplaetze: 0, ausstattung: []});
CREATE (:Raum:Hoersaal {raumNr: 'O103', etage: 1, sitzplaetze: 0, ausstattung: ['Medientisch', 'Laserbeamer', 'Visualizer', 'Raumkamera', 'Deckenmikrofon', 'Handmikrofon', 'Umhaengemikrofon', 'Lautsprecher', 'Dozentenanschluss']});
CREATE (:Raum:Buero {raumNr: 'O104', etage: 1, personen: []});
CREATE (:Raum:Buero {raumNr: 'O105', etage: 1, personen: []});
CREATE (:Raum:Buero {raumNr: 'O106', etage: 1, personen: []});
CREATE (:Raum:Hoersaal {raumNr: 'O107', etage: 1, sitzplaetze: 0, ausstattung: []});
CREATE (:Raum:Hoersaal {raumNr: 'O108', etage: 1, sitzplaetze: 0, ausstattung: []});
CREATE (:Raum:Sonstige {raumNr: 'O109', etage: 1});
CREATE (:Raum:Sonstige {raumNr: 'O110', etage: 1});
CREATE (:Raum:Sonstige {raumNr: 'O111', etage: 1});
CREATE (:Raum:Sonstige {raumNr: 'O112', etage: 1});

// O183 – O188
CREATE (:Raum:Aufzug {raumNr: 'O183', etage: 1});
CREATE (:Raum:Sonstige {raumNr: 'O184', etage: 1});
CREATE (:Raum:Treppenhaus {raumNr: 'O185', etage: 1});
CREATE (:Raum:Treppenhaus {raumNr: 'O187', etage: 1});
CREATE (:Raum:Sonstige {raumNr: 'O188', etage: 1});

// O191
CREATE (:Raum:Toilette {raumNr: 'O191', etage: 1, typ: ''});


// ============================================================
// VERBINDUNGEN EG (Gang)
// dauer in Sekunden – bitte anpassen
// ============================================================

MATCH (a:Raum {raumNr: 'O089'}), (b:Raum {raumNr: 'O001'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O001'}), (b:Raum {raumNr: 'O085'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O085'}), (b:Raum {raumNr: 'O083'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O085'}), (b:Raum {raumNr: 'O086'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O083'}), (b:Raum {raumNr: 'O092'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O092'}), (b:Raum {raumNr: 'O002'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O002'}), (b:Raum {raumNr: 'O003'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O003'}), (b:Raum {raumNr: 'O004'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O004'}), (b:Raum {raumNr: 'O088'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O088'}), (b:Raum {raumNr: 'O005'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O088'}), (b:Raum {raumNr: 'O006'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O088'}), (b:Raum {raumNr: 'O087'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O088'}), (b:Raum {raumNr: 'O093'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O093'}), (b:Raum {raumNr: 'O091'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O091'}), (b:Raum {raumNr: 'O007'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O007'}), (b:Raum {raumNr: 'O010'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O010'}), (b:Raum {raumNr: 'O009'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O009'}), (b:Raum {raumNr: 'O008'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O008'}), (b:Raum {raumNr: 'O089'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);


// ============================================================
// VERBINDUNGEN 1. OG (Gang)
// dauer in Sekunden – bitte anpassen
// ============================================================

MATCH (a:Raum {raumNr: 'O101'}), (b:Raum {raumNr: 'O185'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O185'}), (b:Raum {raumNr: 'O183'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O183'}), (b:Raum {raumNr: 'O102'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O102'}), (b:Raum {raumNr: 'O111'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O111'}), (b:Raum {raumNr: 'O103'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O103'}), (b:Raum {raumNr: 'O104'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O104'}), (b:Raum {raumNr: 'O105'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O105'}), (b:Raum {raumNr: 'O188'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O188'}), (b:Raum {raumNr: 'O106'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O188'}), (b:Raum {raumNr: 'O187'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O188'}), (b:Raum {raumNr: 'O112'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O112'}), (b:Raum {raumNr: 'O191'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O191'}), (b:Raum {raumNr: 'O107'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O107'}), (b:Raum {raumNr: 'O110'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O110'}), (b:Raum {raumNr: 'O109'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O109'}), (b:Raum {raumNr: 'O108'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);

MATCH (a:Raum {raumNr: 'O108'}), (b:Raum {raumNr: 'O101'})
CREATE (a)-[:GANG {dauer: 5, barrierefrei: true}]->(b);


// ============================================================
// TREPPENVERBINDUNGEN (EG ↔ 1. OG)
// ============================================================

MATCH (a:Raum {raumNr: 'O085'}), (b:Raum {raumNr: 'O185'})
CREATE (a)-[:TREPPE {dauer: 30, barrierefrei: false}]->(b);

MATCH (a:Raum {raumNr: 'O087'}), (b:Raum {raumNr: 'O187'})
CREATE (a)-[:TREPPE {dauer: 30, barrierefrei: false}]->(b);


// ============================================================
// AUFZUGVERBINDUNGEN (EG ↔ 1. OG)
// ============================================================

MATCH (a:Raum {raumNr: 'O083'}), (b:Raum {raumNr: 'O183'})
CREATE (a)-[:AUFZUG {dauer: 60, barrierefrei: true}]->(b);
