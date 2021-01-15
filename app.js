const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const app = express();
const userRouter = require("./routes/users");
const facilitiesRouter = require("./routes/facilities");

const SECRET = "VERY_SECRET_KEY!";
const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

passport.use(
  new JwtStrategy(passportOpts, function (jwtPayload, done) {
    const expirationDate = new Date(jwtPayload.exp * 1000);
    if (expirationDate < new Date()) {
      return done(null, false);
    }
    done(null, jwtPayload);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

app.use(morgan(('dev')));

app.use("/auth", userRouter);
app.use("/facilities", facilitiesRouter);

app.get('/random', passport.authenticate('jwt'), function (req, res) {
  res.json({value: Math.floor(Math.random()*100) });
});

module.exports = app;
