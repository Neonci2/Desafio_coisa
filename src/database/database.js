const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (erro) => {
  if (erro) {
    console.log("erro: ", erro);
  } else {
    console.log("conectado");
  }
});

module.exports = db;