const jwt = require("jsonwebtoken")
const User = require("mongoose").model("User")
const PassportLocalStrategy = require("passport-local").Strategy
const config = require("../config")

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
      email: email.trim(),
      password: password.trim()
    }

    // find a user by email address
    return User.findOne({ email: userData.email }, (err, user) => {
      if (err) {
        return done(err)
      }

      if (!user) {
        const error = new Error("Incorrect email or password")
        error.name = "IncorrectCredentialsError"

        return done(error)
      }

      // check if a hashed user's password is equal to a value saved in the database
      return user.comparePassword(userData.password, (passwordErr, isMatch) => {
        if (err) {
          return done(err)
        }

        if (!isMatch) {
          const error = new Error("Incorrect email or password")
          error.name = "IncorrectCredentialsError"

          return done(error)
        }

        const payload = {
          sub: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          occupation: user.occupation,
          city: user.city,
          county: user.county,
          ministry: user.ministry,
          about: user.about,
          active: user.active,
          lastLogin: user.lastLogin
        }

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" })
        const data = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          active: user.active,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
        var objToday = new Date(),
          weekday = new Array(
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ),
          dayOfWeek = weekday[objToday.getDay()],
          domEnder = (function() {
            var a = objToday
            if (/1/.test(parseInt((a + "").charAt(0)))) return "th"
            a = parseInt((a + "").charAt(1))
            return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
          })(),
          dayOfMonth =
            today + (objToday.getDate() < 10)
              ? "0" + objToday.getDate() + domEnder
              : objToday.getDate() + domEnder,
          months = new Array(
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ),
          curMonth = months[objToday.getMonth()],
          curYear = objToday.getFullYear(),
          curHour =
            objToday.getHours() > 12
              ? objToday.getHours() - 12
              : objToday.getHours() < 10
              ? "0" + objToday.getHours()
              : objToday.getHours(),
          curMinute =
            objToday.getMinutes() < 10
              ? "0" + objToday.getMinutes()
              : objToday.getMinutes(),
          curSeconds =
            objToday.getSeconds() < 10
              ? "0" + objToday.getSeconds()
              : objToday.getSeconds(),
          curMeridiem = objToday.getHours() > 12 ? "PM" : "AM"
        var today =
          curHour +
          ":" +
          curMinute +
          "." +
          curSeconds +
          curMeridiem +
          " " +
          dayOfWeek +
          " " +
          dayOfMonth +
          " of " +
          curMonth +
          ", " +
          curYear

        User.findOneAndUpdate({ email: user.email }, { lastLogin: today })
          .then(() => {
            console.log("last login updated")
          })
          .catch(error => {
            console.log(error)
          })

        return done(null, token, data)
      })
    })
  }
)
