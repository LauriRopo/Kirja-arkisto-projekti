const express = require("express");
const bookController = require("../controllers/bookController");
const router = express.Router();
router.post("/:username", bookController.login);
module.exports = router;
