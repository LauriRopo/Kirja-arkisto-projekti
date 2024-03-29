const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Ruutti",
  database: "kirjastodb",
  port: 3307,
});
conn.connect((err) => {
  if (err) {
    console.error("Virhe yhdistettäessä tietokantaan:", err);
    return;
  }
  console.log("Yhteys MySQL-tietokantaan muodostettu");
});

module.exports = conn;
