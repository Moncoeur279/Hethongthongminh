// utils/jwt.js
const jwt = require("jsonwebtoken");

const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "1d",
  });

const verifyAccess = (t) => jwt.verify(t, process.env.JWT_ACCESS_SECRET);

module.exports = { signAccess, verifyAccess };
