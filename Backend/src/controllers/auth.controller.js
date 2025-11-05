const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Joi = require("joi");
const { User, VerificationCode } = require("../models");
const { Op } = require("sequelize");

const { sendVerificationEmail } = require("../services/emailService");
const { signAccess } = require("../utils/jwt");

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const six = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  console.log("Register API hit at", new Date().toISOString());
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Invalid input" });

  const { name, email, password } = value;
  const exists = await User.findOne({ where: { email } });
  if (exists)
    return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const code = six();

  await VerificationCode.create({
    email,
    codeHash: sha256(code),
    payload: { name, passwordHash },
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    consumed: false,
  });

  await sendVerificationEmail(email, code);
  return res.json({ message: "Check your email for the 6-digit code." });
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  const rec = await VerificationCode.findOne({
    where: {
      email,
      codeHash: sha256(code),
      consumed: false,
      expiresAt: { [Op.gt]: new Date() },
    },
    order: [["createdAt", "DESC"]],
  });
  if (!rec) return res.status(400).json({ message: "Code invalid or expired" });

  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      name: rec.payload.name,
      email,
      passwordHash: rec.payload.passwordHash,
    });
  }
  await rec.update({ consumed: true });
  console.log("Signing JWT with secret:", process.env.JWT_ACCESS_SECRET);
  const at = signAccess({ sub: user.id, email: user.email });
  return res.json({ user, accessToken: at });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const at = signAccess({ sub: user.id, email: user.email });
  console.log("User found:", user);
  console.log("Token:", at);
  return res.json({ user, accessToken: at });
};