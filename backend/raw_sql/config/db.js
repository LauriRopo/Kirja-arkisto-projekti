const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "xxxx",
  user: "xxxxx",
  password: "xxxxxx",
  database: "xxxxxx",
  port: xxxxxx,
});
conn.connect((err) => {
  if (err) {
    console.error("Virhe yhdistettäessä tietokantaan:", err);
    return;
  }
  console.log("Yhteys MySQL-tietokantaan muodostettu");
});

module.exports = conn;
