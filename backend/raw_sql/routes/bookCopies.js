const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.delete("/:id", bookController.deleteBookCopy);
router.put("/:id", bookController.updateBookCopy); // Lisätty uusi PUT-reitti
router.put("/", bookController.updateBookCopy);

router.post("/", bookController.addBookCopy);
router.get("/", bookController.getAllBookCopies);
router.get("/:id", bookController.getBookCopyById);

module.exports = router;
