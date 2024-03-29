const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();
router.post("/", bookController.register);
module.exports = router;
