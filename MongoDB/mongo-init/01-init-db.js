db = db.getSiblingDB("hochschule");

// Studiengänge Collection erstellen
db.createCollection("studiengaenge", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["kuerzel", "name", "abschluss"],
      properties: {
        kuerzel: { bsonType: "string" },
        name: { bsonType: "string" },
        abschluss: { bsonType: "string", enum: ["Bachelor", "Master"] },
      },
    },
  },
});

// Vorlesungen Collection erstellen
db.createCollection("vorlesungen", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "dozent", "semester", "sws", "ects", "studiengang"],
      properties: {
        name: { bsonType: "string" },
        dozent: { bsonType: "string" },
        semester: { bsonType: "int", minimum: 1, maximum: 10 },
        sws: { bsonType: "int", minimum: 1, maximum: 10 },
        ects: { bsonType: "int", minimum: 1, maximum: 10 },
        studiengang: {
          bsonType: "object",
          required: ["$ref", "$id"],
          properties: {
            $ref: { bsonType: "string" },
            $id: { bsonType: "objectId" },
          },
        },
      },
    },
  },
});

// Studiengänge einfügen und IDs speichern
const result = db.studiengaenge.insertMany([
  { kuerzel: "AIN", name: "Angewandte Informatik", abschluss: "Bachelor" },
  { kuerzel: "WIN", name: "Wirtschaftsinformatik", abschluss: "Bachelor" },
  { kuerzel: "GIB", name: "Gesundheitsinformatik", abschluss: "Bachelor" },
  {
    kuerzel: "MSI",
    name: "Management und Systemintegration",
    abschluss: "Master",
  },
]);

// IDs speichern
const ainId = result.insertedIds[0];
const winId = result.insertedIds[1];
const gibId = result.insertedIds[2];
const msiId = result.insertedIds[3];

db.vorlesungen.insertMany([
  {
    name: "Programmierung 1",
    dozent: "Prof. Müller",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Programmierung 2",
    dozent: "Prof. Müller",
    semester: 2,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Datenbanken",
    dozent: "Prof. Schneider",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Algorithmen und Datenstrukturen",
    dozent: "Prof. Weber",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Software Engineering",
    dozent: "Prof. Fischer",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Betriebssysteme",
    dozent: "Prof. Klein",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 7,
    ects: 5,
  },
  {
    name: "Rechnernetze",
    dozent: "Prof. Braun",
    semester: 5,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "IT-Sicherheit",
    dozent: "Prof. Wagner",
    semester: 5,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Webentwicklung",
    dozent: "Prof. Hoffmann",
    semester: 6,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Künstliche Intelligenz",
    dozent: "Prof. Lehmann",
    semester: 6,
    studiengang: { $ref: "studiengaenge", $id: ainId },
    sws: 4,
    ects: 5,
  },
]);

db.vorlesungen.insertMany([
  {
    name: "Einführung Wirtschaftsinformatik",
    dozent: "Prof. Becker",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "BWL Grundlagen",
    dozent: "Prof. Schulz",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Programmierung",
    dozent: "Prof. Müller",
    semester: 2,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Datenbanken",
    dozent: "Prof. Schneider",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Geschäftsprozessmanagement",
    dozent: "Prof. Fischer",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "ERP-Systeme",
    dozent: "Prof. Wagner",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "IT-Controlling",
    dozent: "Prof. Braun",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "E-Business",
    dozent: "Prof. Hoffmann",
    semester: 5,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 9,
    ects: 5,
  },
  {
    name: "Data Analytics",
    dozent: "Prof. Lehmann",
    semester: 5,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
  {
    name: "IT-Projektmanagement",
    dozent: "Prof. Klein",
    semester: 6,
    studiengang: { $ref: "studiengaenge", $id: winId },
    sws: 4,
    ects: 5,
  },
]);

db.vorlesungen.insertMany([
  {
    name: "Medizinische Grundlagen",
    dozent: "Prof. Meier",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Einführung Gesundheitsinformatik",
    dozent: "Prof. Schulz",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Programmierung",
    dozent: "Prof. Müller",
    semester: 2,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Datenbanken im Gesundheitswesen",
    dozent: "Prof. Schneider",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Krankenhausinformationssysteme",
    dozent: "Prof. Fischer",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Medizinische Dokumentation",
    dozent: "Prof. Wagner",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "IT-Sicherheit im Gesundheitswesen",
    dozent: "Prof. Braun",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Telemedizin",
    dozent: "Prof. Hoffmann",
    semester: 5,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Gesundheitsdatenanalyse",
    dozent: "Prof. Lehmann",
    semester: 5,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Qualitätsmanagement im Gesundheitswesen",
    dozent: "Prof. Klein",
    semester: 6,
    studiengang: { $ref: "studiengaenge", $id: gibId },
    sws: 8,
    ects: 5,
  },
]);

db.vorlesungen.insertMany([
  {
    name: "IT-Strategie",
    dozent: "Prof. Becker",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Enterprise Architecture",
    dozent: "Prof. Lehmann",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Cloud Computing",
    dozent: "Prof. Lehmann",
    semester: 2,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "IT-Sicherheitsmanagement",
    dozent: "Prof. Schneider",
    semester: 2,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "DevOps",
    dozent: "Prof. Becker",
    semester: 2,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Microservices Architektur",
    dozent: "Prof. Wagner",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "IT-Governance",
    dozent: "Prof. Becker",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 6,
    ects: 5,
  },
  {
    name: "Digitale Transformation",
    dozent: "Prof. Hoffmann",
    semester: 3,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Forschungsmethoden",
    dozent: "Prof. Lehmann",
    semester: 1,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 5,
  },
  {
    name: "Masterprojekt",
    dozent: "Prof. Becker",
    semester: 4,
    studiengang: { $ref: "studiengaenge", $id: msiId },
    sws: 4,
    ects: 10,
  },
]);

/*-------------------------------------------------------------------------------- */

db.abt.insertMany([
  { anr: "K51", name: "Entwicklung", ort: "Erlangen" },
  { anr: "K53", name: "Buchhaltung", ort: "Nürnberg" },
  { anr: "K54", name: "Hochschule", ort: "Konstanz" },
  { anr: "K55", name: "Personal", ort: "Nürnberg" },
]);

db.pers.insertOne({
  pnr: 123,
  name: "Mueller",
  jahrg: 1980,
  eindat: new Date("2000-09-01"),
  gehalt: 88000,
  beruf: "Kaufmann",
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Entwicklung" })._id),
});
db.pers.insertOne({
  pnr: 406,
  name: "Coy",
  jahrg: 1972,
  eindat: new Date("2006-09-01"),
  gehalt: 100000,
  beruf: "Programmierer",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Mueller" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Personal" })._id),
});
db.pers.insertOne({
  pnr: 829,
  name: "Schmidt",
  jahrg: 1982,
  eindat: new Date("2010-06-01"),
  gehalt: 94000,
  beruf: "Kaufmann",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Mueller" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Buchhaltung" })._id),
});
db.pers.insertOne({
  pnr: 874,
  name: "Abel",
  eindat: new Date("2014-05-01"),
  gehalt: 82000,
  beruf: "Softw.Entwickler",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Schmidt" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Personal" })._id),
});

db.pers.insertOne({
  pnr: 503,
  name: "Junghans",
  jahrg: 1997,
  gehalt: 80000,
  beruf: "Programmierer",
  vorgesetzter: new DBRef("pers", db.pers.findOne({ name: "Mueller" })._id),
  abteilung: new DBRef("abt", db.abt.findOne({ name: "Entwicklung" })._id),
});
