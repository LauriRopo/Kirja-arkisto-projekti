const conn = require("../config/db");

const bookController = {
  getAllBooks: async (req, res) => {
    try {
      const query =
        "SELECT * FROM kirja INNER JOIN kirjasarja ON kirja.idkirjasarja = kirjasarja.idkirjasarja";
      conn.query(query, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  getAllBookCopies: async (req, res) => {
    try {
      const query = "SELECT * FROM kirjakopio";
      conn.query(query, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  getAllSeries: async (req, res) => {
    try {
      const query = "SELECT * FROM kirjasarja";
      conn.query(query, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  getAllShelves: async (req, res) => {
    try {
      const query = "SELECT * FROM kirjahylly";
      conn.query(query, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  // constiin kaikki formien arvot!
  addBook: async (req, res) => {
    const { kirjanimi, julkaisuvuosi, kuvaus, kirjailija, kirjasarja } =
      req.body;
    try {
      // First, fetch the ID of the kirjasarja
      const query = "SELECT idkirjasarja from kirjasarja WHERE kirjasarja = ?";
      const values = [kirjasarja];
      conn.query(query, values, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        // Assuming results contains the ID, you may need to adjust accordingly
        const kirjasarjaid = results[0].idkirjasarja;
        console.log("KIRJASARJA ID: ",kirjasarjaid);

        // Now, insert the book with the fetched kirjasarjaid
        const insertQuery =
          "INSERT INTO kirja (kirjanimi, julkaisuvuosi, idkirjasarja, kuvaus, kirjailija) VALUES (?, ?, ?, ?, ?)";
        const insertValues = [
          kirjanimi,
          julkaisuvuosi,
          kirjasarjaid,
          kuvaus,
          kirjailija,
        ];
        conn.query(insertQuery, insertValues, (insertError, insertResults) => {
          if (insertError) {
            res.status(400).send(insertError.message);
            return;
          }
          res.status(201).json(insertResults);
        });
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  addBookCopy: async (req, res) => {
    const { kirjanimi, painovuosi, kuvaus, id, idkirjasarja } = req.body;
    try {
      const query =
        "INSERT INTO kirjakopio (kirjanimi, painovuosi, kuvaus, idkirja, idkirjasarja, idkirjahylly,hankintahinta) VALUES (?, ?, ?, ?, ?,1,1)"; // <----- Tähän kaikki arvot joita lisätään
      const values = [kirjanimi, painovuosi, kuvaus, id, idkirjasarja];
      conn.query(query, values, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(201).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  // sama täällä!
  updateBook: async (req, res) => {
    const { title, author, year } = req.body;
    try {
      const query =
        "UPDATE kirja SET title = ?, author = ?, year = ? WHERE id = ?"; // <----- Tähän kaikki arvot joita muokataan!
      const values = [title, author, year, req.params.id];
      conn.query(query, values, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(201).json(results);
        res.status(200).send("Book updated successfully.");
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  updateBookCopy: async (req, res) => {
    const {
      kirjanimi,
      painovuosi,
      kuvaus,
      painos,
      hankintahinta,
      kunto,
      myyntihinta,
      myyntipvm,
      idkirjakopio,
      hankintapvm,
      jarjestysnumero,
    } = req.body;

    try {
      const query =
        "UPDATE kirjakopio SET kirjanimi = ?, painos = ?, painovuosi = ?, hankintahinta = ?, hankintapvm =?, kunto = ?, kuvaus = ?, myyntipvm = ?, myyntihinta = ?, jarjestysnumero = ? WHERE idkirjakopio = ?";
      const values = [
        kirjanimi,
        painos,
        painovuosi,
        hankintahinta,
        hankintapvm,
        kunto,
        kuvaus,
        myyntipvm,
        myyntihinta,
        jarjestysnumero,
        idkirjakopio,
      ];

      console.log("kirjakopioid backendissä: ", idkirjakopio);

      conn.query(query, values, (error, results) => {
        if (error) {
          console.error("Error updating book copy:", error);
          res.status(500).send("Failed to update book copy.");
          return;
        }
        console.log("Book copy updated successfully.");
        res.status(200).send("Book copy updated successfully.");
      });
    } catch (error) {
      console.error("Error updating book copy:", error);
      res.status(400).send(error.message);
    }
  },
  //Kirjahyllyn lisääminen
  addShelf: async (req, res) => {
    const omistaja = req.body.omistaja;

    try {
      const query = "INSERT INTO kirjahylly (omistaja) VALUES (?)"; // <----- Tähän kaikki arvot joita lisätään
      const values = [omistaja];

      conn.query(query, values, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }

        if (error) {
          console.error("Error updating book copy:", error);
          res.status(500).send("Failed to update book copy.");
          return;
        }
        console.log(
          "Käyttäjän:( " +
            omistaja +
            " ) hylly on onnistuneesti siirretty tietokantaan!"
        );
        res.status(201).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  //Sarjan lisääminen
  addSeries: async (req, res) => {
    const { sarjanimi, kustantaja, kuvaus, luokittelu } = req.body;

    try {
      const query =
        "INSERT INTO kirjasarja (kirjasarja,kustantaja,kuvaus,luokittelu) VALUES (?,?,?,?)"; // <----- Tähän kaikki arvot joita lisätään
      const values = [sarjanimi, kustantaja, kuvaus, luokittelu];

      conn.query(query, values, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        console.log(
          "Sarjan:( " +
            sarjanimi +
            " ) tiedot on onnistuneesti siirretty tietokantaan!"
        );
        res.status(201).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  deleteBookCopy: async (req, res) => {
    try {
      const query = "DELETE FROM kirjakopio WHERE idkirjakopio = ?";
      const values = [req.params.id];

      const results = await new Promise((resolve, reject) => {
        conn.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      res.status(200).send("Book deleted successfully.");
    } catch (error) {
      console.error("Virhe poistettaessa kirjakopiota:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteBook: async (req, res) => {
    try {
      const query = "DELETE FROM kirja WHERE id = ?";
      const values = [req.params.id];
      conn.query(query, values, (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(201).json(results);
        res.status(200).send("Book deleted successfully.");
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  //Saadaan yhden kirjan tiedot esitettyä ID avulla
  getBookById: async (req, res) => {
    const bookId = req.params.id;
    try {
      const query = "SELECT * FROM kirja WHERE idkirja = ?";
      conn.query(query, [bookId], (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results); // Assuming only one book will be returned
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getBookCopyById: async (req, res) => {
    const bookId = req.params.id;
    try {
      const query = "SELECT kirjakopio.*, kirja.* FROM kirjakopio JOIN kirja ON kirjakopio.idkirja = kirja.idkirja WHERE kirjakopio.idkirjakopio = ?";
      conn.query(query, [bookId], (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results); // Assuming only one book will be returned
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getBookByName: async (req, res) => {
    const values = [req.params.kirjanimi];
    try {
      const query =
        "SELECT * FROM kirja INNER JOIN kirjasarja ON kirja.idkirjasarja = kirjasarja.idkirjasarja WHERE kirjanimi LIKE ?";
      conn.query(query, [`%${values}%`], (error, results) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  getBookCopyByName: async (req, res) => {
    const values = [req.params.kirjanimi];
    try {
      const query =
        "SELECT * FROM kirjakopio INNER JOIN kirjasarja ON kirjakopio.idkirjasarja = kirjasarja.idkirjasarja WHERE kirjanimi LIKE ?";
      conn.query(query, [`%${values}%`], (error, results2) => {
        if (error) {
          res.status(400).send(error.message);
          return;
        }
        res.status(200).json(results2);
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  login: async (req, res) => {
    try {
      const { password, username } = req.body; 
      const values = [username, password];  
  
      console.log("Received login request for:", username);
  
      const query = "SELECT * FROM account WHERE username = ? AND password = ?";
      conn.query(query, values, (error, results) => {
        if (error) {
          console.error("Error executing login query:", error);
          res.status(500).send("Failed to authenticate user.");
          return;
        }
  
        if (results.length === 1) {
          // If user is found in the database, login is successful
          console.log("Login successful for:", username);
          res.status(200).json({ message: "Login successful" });
        } else {
          // If no matching user is found, login fails
          console.log("Login failed for:", username);
          res.status(401).json({ message: "Invalid username or password" });
        }
      });
    } catch (error) {
      console.error("Error in login function:", error);
      res.status(400).send("Error in login function.");
    }
  },

  register: async (req, res) => {
    try {
      const { password, username } = req.body; 
      const values = [username, password];  
  
      console.log("Received register", username);
      
      const query = "INSERT INTO account (username,password) VALUES (?,?)";
      conn.query(query, values, (error, results) => {
        if (error) {
          console.error("Error executing register query:", error);
          res.status(500).send("Failed to register user.");
          return;
        }
  
        // Check if the query was successful
        if (results.affectedRows === 1) {
          res.status(200).json({ message: "Registration successful" });
        } else {
          res.status(500).json({ message: "Failed to register user" });
        }
      });
    } catch (error) {
      console.error("Error in register function:", error);
      res.status(500).send("An error occurred during registration.");
    }
  }
}
module.exports = bookController;
