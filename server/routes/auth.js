const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const newUser = await new User({
    username: "test",
    email: "test@abv.bg",
    password: "1234567",
  });

  await newUser.save();
  res.send("ok");
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // salt relates to pass brute force resistance
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // generate user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user and return response
    const user = await newUser.save();

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // if we try to login unsuccessfully we trigger an error due to multiple result calls
  // (return prevents that behaviour making it one at most)
  try {
    const user = await User.findOne({ email: req.body.email });
    // // shorthand if statmement (without return)
    // user && res.status(404).json("User not found.");
    if (!user) return res.status(404).json("User not found.");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // we usually don't tell which credential the user got wrong
    if (!validPassword) return res.status(400).json("Wrong password.");

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;