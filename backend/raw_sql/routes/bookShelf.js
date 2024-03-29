const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.post("/", bookController.addShelf);
router.get("/", bookController.getAllShelves);

module.exports = router;
