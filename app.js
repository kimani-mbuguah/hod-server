const express = require("express");
const path = require("path");
const port = process.env.PORT || 5002;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const chalk = require("chalk");
const cors = require("cors");
const config = require("./config");

// Connect to the database and load models
require("./models").connect(config.dbUri);

const compression = require("compression"); // Compression middleware, compress responses from all routes
const helmet = require("helmet"); // Protect against web vunerablities
const auth = require("./routes/auth");
const member = require("./routes/member");
const admin = require("./routes/admin");
const money = require("./routes/money");
const api = require("./routes/api");
const events = require("./routes/events");

const app = express();

app.use(compression());
app.use(helmet());

app.use(cors());

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Use the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require("./passport/local-signup");
const localLoginStrategy = require("./passport/local-login");
passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);

// Define routes
app.use("/auth", auth);
app.use("/api", api);
app.use("/member", member);
app.use("/admin", admin);
app.use("/money", money);
app.use("/events", events);

// Single page app method for 404s, return the static html file
// Handles all routes so you do not get a not found error
app.get("*", function(req, res, next) {
  res.send("resource not found");
});

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () => {
  console.log(
    chalk.blue(`All systems go. We are ready for take off on port ${port}`),
    chalk.yellow(`   Connecting to mongoDB...`)
  );
});
