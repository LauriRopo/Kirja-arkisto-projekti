const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.get("/", bookController.getAllBooks);
router.post("/", bookController.addBook);
router.put("/:id", bookController.updateBook);
router.put("/:id", bookController.updateBookCopy);
router.delete("/:id", bookController.deleteBook);
router.delete("/:id", bookController.deleteBookCopy);
// Route for fetching a single book by ID
router.get("/:id", bookController.getBookById);


module.exports = router;
