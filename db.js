const Enmap = require('enmap');

// Esto inicializa la base de datos de forma centralizada
const db = new Enmap({ name: "economia" });

module.exports = db;
