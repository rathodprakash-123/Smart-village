const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Signup (role always user)
router.get("/signup", (req, res) => {
  return res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashed, role: "user" });
  return res.redirect("/login");
});

// Login
router.get("/login", (req, res) => {
 return res.render("users/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("Invalid email");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Invalid password");
  
  req.session.userId = user._id;
  req.session.role = user.role;

  // Redirect based on role
  if (user.role === "admin") {
  return res.redirect("/admin");
  } else {
   return res.redirect("/");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
 return res.redirect("/login");
});

module.exports = router;


router.get("/forgot-password", (req, res) => {
 return res.render("users/forgot-password");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.send("No account found with this email.");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  console.log(`Password Reset Link: ${resetLink}`);

  res.send("Reset link sent to your email (check console for now)");
});
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.send("Invalid or expired token.");
 return res.render("users/reset-password", { token });
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.send("Token expired or invalid.");

  const hashed = await bcrypt.hash(password, 12);
  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return res.send("Password reset successful! You can now <a href='/login'>login</a>.");
});
