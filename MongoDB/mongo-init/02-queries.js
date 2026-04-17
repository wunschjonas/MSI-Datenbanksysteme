// docker exec -it mongodb-test mongosh
// use hochschule

db = db.getSiblingDB("hochschule");

// a) Welche Studiengänge haben einen Bachelor als Abschluss? Es sollen nur die Studiengangskürzel ausgegeben werden.
db.studiengaenge
  .find({ abschluss: "Bachelor" }, { kuerzel: 1, _id: 0 })
  .forEach((x) => print(x.kuerzel));

// Ausgabe:
// AIN
// WIN
// GIB

// b) Ermitteln Sie, welche AIN-Vorlesungen weniger als 5 SWS besitzen. Es sollen nur die Vorlesungsnamen alphabetisch sortiert ausgegeben werden.
db.vorlesungen
  .find(
    {
      studiengang: {
        $ref: "studiengaenge",
        $id: db.studiengaenge.findOne({ kuerzel: "AIN" })._id,
      },
      sws: { $lt: 5 },
    },
    {
      name: 1,
      _id: 0,
    },
  )
  .sort({ name: 1 });

// Ausgabe:
//  { name: 'Algorithmen und Datenstrukturen' },
//  { name: 'Betriebssysteme' },
//  { name: 'Datenbanken' },
//  { name: 'IT-Sicherheit' },
//  { name: 'Künstliche Intelligenz' },
//  { name: 'Programmierung 1' },
//  { name: 'Programmierung 2' },
//  { name: 'Rechnernetze' },
//  { name: 'Software Engineering' },
//  { name: 'Webentwicklung' }

// c) Bei welchen Vorlesungen ist SWS größer als ECTS?

db.vorlesungen.find(
  {
    $expr: {
      $gt: ["$sws", "$ects"],
    },
  },
  {
    name: 1,
    ects: 1,
    sws: 1,
    _id: 0,
  },
);

// Ausgabe
// [
//   { name: 'Betriebssysteme', sws: 7, ects: 5 },
//   { name: 'E-Business', sws: 9, ects: 5 },
//   { name: 'Qualitätsmanagement im Gesundheitswesen', sws: 8, ects: 5 },
//   { name: 'IT-Governance', sws: 6, ects: 5 }
// ]

// d) Wie viele MSI-Vorlesungen halten die einzelnen Professoren? Es soll nur der Professorname und die SWS-Summe ausgegeben werden.

db.vorlesungen.aggregate([
  {
    $match: {
      studiengang: {
        $ref: "studiengaenge",
        $id: db.studiengaenge.findOne({ kuerzel: "MSI" })._id,
      },
    },
  },
  {
    $group: {
      _id: "$dozent",
      totalSWS: {
        $sum: "$sws",
      },
    },
  },
]);

// Ausgabe
// [
//   { _id: 'Prof. Schneider', totalSWS: 4 },
//   { _id: 'Prof. Wagner', totalSWS: 4 },
//   { _id: 'Prof. Hoffmann', totalSWS: 4 },
//   { _id: 'Prof. Becker', totalSWS: 18 },
//   { _id: 'Prof. Lehmann', totalSWS: 12 }
// ]

// e) Welcher Professor hält am meisten SWS in AIN-Vorlesungen?

db.vorlesungen.aggregate([
  {
    $match: {
      studiengang: {
        $ref: "studiengaenge",
        $id: db.studiengaenge.findOne({ kuerzel: "AIN" })._id,
      },
    },
  },
  {
    $group: {
      _id: "$dozent",
      totalSWS: {
        $sum: "$sws",
      },
    },
  },
  {
    $sort: {
      totalSWS: -1,
    },
  },
  {
    $limit: 1,
  },
]);

// Ausgabe
// [ { _id: 'Prof. Müller', totalSWS: 8 } ]
