// Backend/src/routes/user.routes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userController = require("../controllers/user.controller");

// 📍 GET /api/user/profile
router.get("/profile", auth, userController.getProfile);

module.exports = router;
