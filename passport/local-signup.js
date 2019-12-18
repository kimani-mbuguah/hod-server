const User = require("mongoose").model("User")
const PassportLocalStrategy = require("passport-local").Strategy

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
    passReqToCallback: true
  },
  (req, email, password, done) => {
    const userData = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: email.trim(),
      password: password.trim()
    }

    const newUser = new User(userData)
    newUser
      .save()
      .then(() => {
        return done(null)
      })
      .catch(err => {
        return done(err)
      })
  }
)
