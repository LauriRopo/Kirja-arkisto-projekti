const express = require("express");
const bodyParser = require("body-parser");
 const bookRouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/books"); // Ensure this path is correct
 const bookCopyRouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/bookCopies"); // Ensure this path is correct
 const bookShelfRouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/bookShelf"); // Ensure this path is correct
 const bookSeriesRouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/bookSeries"); // Ensure this path is correct
 const booksRouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/bookss"); // Ensure this path is correct
 const loginrouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/login"); // Ensure this path is correct
 const registerrouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/register");
 const bookCopiessRouter = require("/KirjaArkistoGroupAD/backend/raw_sql/routes/bookCopiess");
const path = require("path");
//const cors = require('cors');

/*const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Adjust if your client origin is different
}; */

const app = express();
const port = 8080;
// app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(express.json());
app.use("/bookCopies", bookCopyRouter);
app.use("/books", bookRouter);
app.use("/bookShelf", bookShelfRouter);
app.use("/bookSeries", bookSeriesRouter);
app.use("/bookss", booksRouter);
app.use("/login", loginrouter);
app.use("/register", registerrouter);
app.use("/bookCopiess", bookCopiessRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const publicDirectoryPath = path.join(__dirname, "..");

// Serve static files from the `public` directory
app.use(express.static(publicDirectoryPath));

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "index.html"));
});
module.exports=app;
