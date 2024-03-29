const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();
router.get("/:kirjanimi", bookController.getBookCopyByName);
router.get("/", bookController.getAllBookCopies);
router.get("/", bookController.getAllBooks);
module.exports = router;
