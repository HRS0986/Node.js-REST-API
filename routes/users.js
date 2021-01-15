const express = require("express");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const router = express.Router();
const userController = require("../controllers/users");

const refreshTokens = {};

const SECRET = "VERY_SECRET_KEY!";

router.post("/login", async function (req, res) {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const doc = await userController.loginUser(user);

  if (doc) {
    const userData = { email: user.email, 'role':'admin' };
    const token = jwt.sign(userData, SECRET, { expiresIn: 600 });
    const refreshToken = randToken.uid(256);
    refreshTokens[refreshToken] = user.email;
    res.status(200).json({ jwt: token, refreshToken: refreshToken });
  } else {
    res.status(500).json({ error: "Login Failed" });
  }
});

router.post("/logout", function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }
  res.sendStatus(204);
});

router.post("/refresh", function (req, res) {
  const refreshToken = req.body.refreshToken;

  if (refreshToken in refreshTokens) {
    const user = {
      email: refreshTokens[refreshToken],
      'role': 'admin'
    };
    const token = jwt.sign(user, SECRET, { expiresIn: 600 });
    res.json({ jwt: token });
  } else {
    res.sendStatus(401);
  }
});

router.post("/register", function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const user = { username: username, email: email, password: password };
  userController
    .addUser(user)
    .then((data) => {
      if (data.status) {
        res.status(201).json(data);
      } else {
        res.status(500).json(data);
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
