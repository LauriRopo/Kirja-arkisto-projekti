const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();
router.get("/:kirjanimi", bookController.getBookByName);
router.get("/", bookController.getAllBooks);
router.post("/", bookController.addBook);
module.exports = router;
