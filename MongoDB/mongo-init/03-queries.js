// docker exec -it mongodb-test mongosh
// use hochschule

db = db.getSiblingDB("hochschule");

// a) Welche Abteilungen haben keine Mitarbeiter?
db.abt.aggregate([
  {
    $lookup: {
      from: "pers",
      localField: "_id",
      foreignField: "abteilung.$id",
      as: "mitarbeiter",
    },
  },
  {
    $match: {
      $expr: {
        $eq: [{ $size: "$mitarbeiter" }, 0],
      },
    },
  },
  {
    $project: {
      _id: 0,
      anr: 1,
      name: 1,
    },
  },
]);

// Ausgabe:
// [ { anr: 'K54', name: 'Hochschule' } ]

// b) Wer hat einen Chef, der jünger ist als er selbst?

// SQL-Äquivalent:
// SELECT p.name AS mitarbeiter, c.name AS chef
// FROM pers p
// JOIN pers c ON c._id = p.vorgesetzter.$id
// WHERE c.jahrg > p.jahrg;
db.pers.aggregate([
  {
    $match: {
      vorgesetzter: { $exists: true },
      jahrg: { $exists: true },
    },
  },
  {
    $lookup: {
      from: "pers",
      localField: "vorgesetzter.$id",
      foreignField: "_id",
      as: "chef",
    },
  },
  {
    $unwind: "$chef",
  },
  {
    $match: {
      $expr: {
        $gt: ["$chef.jahrg", "$jahrg"],
      },
    },
  },
  {
    $project: {
      _id: 0,
      mitarbeiter: "$name",
      chef: "$chef.name",
      mitarbeiterJahrg: "$jahrg",
      chefJahrg: "$chef.jahrg",
    },
  },
]);

// [
//   {
//     mitarbeiter: 'Coy',
//     chef: 'Mueller',
//     mitarbeiterJahrg: 1972,
//     chefJahrg: 1980
//   }
// ]

// c) Welche Abteilung hat durchschnittlich die jüngsten Mitarbeiter?
// Es sollen nur Abteilungsnummer und Abteilungsname ausgegeben werden.
db.pers.aggregate([
  {
    $match: {
      abteilung: { $exists: true },
      jahrg: { $exists: true },
    },
  },
  {
    $lookup: {
      from: "abt",
      localField: "abteilung.$id",
      foreignField: "_id",
      as: "abteilungInfo",
    },
  },
  {
    $unwind: "$abteilungInfo",
  },
  {
    $group: {
      _id: {
        anr: "$abteilungInfo.anr",
        name: "$abteilungInfo.name",
      },
      avgJahrg: { $avg: "$jahrg" },
    },
  },
  {
    $sort: {
      avgJahrg: -1,
    },
  },
  {
    $limit: 1,
  },
  {
    $project: {
      _id: 0,
      anr: "$_id.anr",
      name: "$_id.name",
    },
  },
]);

// Ausgabe:
// [ { anr: 'K51', name: 'Entwicklung' } ]
