const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();

router.post("/", bookController.addSeries);
router.get("/", bookController.getAllSeries);

module.exports = router;