const express = require("express");
const router = express.Router();

const { lookup, recent } = require("../controllers/dictionaryController");
const auth = require("../middleware/auth");

router.get("/dict/lookup", auth, lookup);
router.get("/dict/recent", auth, recent);

module.exports = router;