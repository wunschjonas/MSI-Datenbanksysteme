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
        abschluss: { enum: ["Bachelor", "Master"] }
      }
    }
  }
});

// Studiengänge einfügen und IDs speichern
const result = db.studiengaenge.insertMany([
  { kuerzel: "AIN", name: "Angewandte Informatik", abschluss: "Bachelor" },
  { kuerzel: "WIN", name: "Wirtschaftsinformatik", abschluss: "Bachelor" },
  { kuerzel: "GIB", name: "Gesundheitsinformatik", abschluss: "Master" },
  { kuerzel: "MSI", name: "Management und Systemintegration", abschluss: "Master" }
]);

// IDs speichern
const ainId = result.insertedIds[0];
const winId = result.insertedIds[1];
const gibId = result.insertedIds[2];
const msiId = result.insertedIds[3];



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
            $id: { bsonType: "objectId" }
          }
        }
      }
    }
  }
});

// Vorlesungen einfügen
db.vorlesungen.insertMany([
  // AIN
  { name: "Programmierung 1", dozent: "Prof. Dr. Meier", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "AIN" },
  { name: "Mathematik für Informatik", dozent: "Dr. Schulz", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "AIN" },
  { name: "Datenbanken", dozent: "Prof. Dr. Winkler", semester: 2, sws: 4, ects: 6, studiengang_kuerzel: "AIN" },
  { name: "Betriebssysteme", dozent: "Dr. Lang", semester: 2, sws: 3, ects: 5, studiengang_kuerzel: "AIN" },
  { name: "Softwaretechnik", dozent: "Prof. Weber", semester: 3, sws: 4, ects: 6, studiengang_kuerzel: "AIN" },
  { name: "Netzwerke", dozent: "Dr. Fuchs", semester: 3, sws: 3, ects: 5, studiengang_kuerzel: "AIN" },
  { name: "Künstliche Intelligenz", dozent: "Prof. Becker", semester: 4, sws: 4, ects: 6, studiengang_kuerzel: "AIN" },
  { name: "Webentwicklung", dozent: "Dr. Hofmann", semester: 4, sws: 3, ects: 5, studiengang_kuerzel: "AIN" },
  { name: "IT-Sicherheit", dozent: "Prof. Sommer", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "AIN" },
  { name: "Datenanalyse", dozent: "Dr. Peters", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "AIN" },

  // WIN
  { name: "Betriebswirtschaftslehre", dozent: "Prof. Klein", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "WIN" },
  { name: "Wirtschaftsrecht", dozent: "Dr. Lotz", semester: 1, sws: 3, ects: 5, studiengang_kuerzel: "WIN" },
  { name: "Datenbanken für Wirtschaftsinformatik", dozent: "Prof. Meissner", semester: 2, sws: 4, ects: 6, studiengang_kuerzel: "WIN" },
  { name: "Geschäftsprozessmanagement", dozent: "Dr. Krüger", semester: 2, sws: 3, ects: 5, studiengang_kuerzel: "WIN" },
  { name: "IT-Management", dozent: "Prof. Haag", semester: 3, sws: 4, ects: 6, studiengang_kuerzel: "WIN" },
  { name: "IT-Projektmanagement", dozent: "Dr. Wagner", semester: 3, sws: 3, ects: 5, studiengang_kuerzel: "WIN" },
  { name: "E-Business", dozent: "Prof. Lang", semester: 4, sws: 3, ects: 5, studiengang_kuerzel: "WIN" },
  { name: "Business Intelligence", dozent: "Dr. Barth", semester: 4, sws: 4, ects: 6, studiengang_kuerzel: "WIN" },
  { name: "Informationssysteme", dozent: "Prof. Otto", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "WIN" },
  { name: "IT-Controlling", dozent: "Dr. Frank", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "WIN" },

  // GIB
  { name: "Gesundheitsinformatik", dozent: "Prof. Adler", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "GIB" },
  { name: "Medizinische Informationssysteme", dozent: "Dr. Pfeiffer", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "GIB" },
  { name: "Pflegeprozessmanagement", dozent: "Prof. Hartmann", semester: 2, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },
  { name: "E-Health", dozent: "Dr. Brandt", semester: 2, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },
  { name: "Telemedizin", dozent: "Prof. Sommer", semester: 3, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },
  { name: "Datenschutz im Gesundheitswesen", dozent: "Dr. Schwarz", semester: 3, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },
  { name: "Medizintechnik", dozent: "Prof. Berger", semester: 4, sws: 4, ects: 6, studiengang_kuerzel: "GIB" },
  { name: "Gesundheitsökonomie", dozent: "Dr. Fischer", semester: 4, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },
  { name: "Prozessdigitalisierung", dozent: "Prof. Jäger", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },
  { name: "IT-Architektur im Gesundheitswesen", dozent: "Dr. Neumann", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "GIB" },

  // MSI
  { name: "IT-Systeme", dozent: "Prof. Koch", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "MSI" },
  { name: "Netzwerktechnik", dozent: "Dr. Schulze", semester: 1, sws: 4, ects: 6, studiengang_kuerzel: "MSI" },
  { name: "Datenkommunikation", dozent: "Prof. Martin", semester: 2, sws: 3, ects: 5, studiengang_kuerzel: "MSI" },
  { name: "Systemintegration", dozent: "Dr. Hess", semester: 2, sws: 4, ects: 6, studiengang_kuerzel: "MSI" },
  { name: "IT-Service-Management", dozent: "Prof. Lorenz", semester: 3, sws: 3, ects: 5, studiengang_kuerzel: "MSI" },
  { name: "Cloud-Systeme", dozent: "Dr. Engel", semester: 3, sws: 3, ects: 5, studiengang_kuerzel: "MSI" },
  { name: "Cybersecurity", dozent: "Prof. Roth", semester: 4, sws: 4, ects: 6, studiengang_kuerzel: "MSI" },
  { name: "IT-Compliance", dozent: "Dr. Weber", semester: 4, sws: 3, ects: 5, studiengang_kuerzel: "MSI" },
  { name: "Projektmanagement", dozent: "Prof. Sauer", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "MSI" },
  { name: "IT-Architektur", dozent: "Dr. Jung", semester: 5, sws: 3, ects: 5, studiengang_kuerzel: "MSI" }
]);

print("Daten eingefügt!");