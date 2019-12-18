const passport = require("passport")
const User = require("mongoose").model("User")
const { validations } = require("../../config")

// POST /auth/signup
exports.postSignup = (req, res, next) => {
  const validationResult = validateSignupForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json(validationResult.errors)
  }

  return passport.authenticate("local-signup", err => {
    if (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        // 11000 Mongo code is for a duplication email error
        // 409 HTTP status code is for conflict error
        return res.status(409).json({
          email: "This email is already taken."
        })
      }

      return res.status(400).json({
        message: "Could not process the form."
      })
    }

    return res.status(200).json(req.body)
  })(req, res, next)
}

// POST /auth/login
exports.postLogin = (req, res, next) => {
  const validationResult = validateLoginForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json(validationResult.errors)
  }

  return passport.authenticate("local-login", (err, token, userData) => {
    if (err) {
      if (err.name === "IncorrectCredentialsError") {
        return res.status(400).json({
          email: err.message,
          password: err.message
        })
      }

      return res.status(400).json({
        email: "Could not process the form.",
        password: "Could not process the form."
      })
    } else if (!userData.active) {
      return res.status(401).json({
        email:
          "Your account is inactive. Please contact the super admin for activation",
        password:
          "Your account is inactive. Please contact the super admin for activation"
      })
    }

    return res.status(200).json({
      token: token
    })
  })(req, res, next)
}

exports.updateProfile = (req, res, next) => {
  const validationResult = validateUpdateForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json(validationResult.errors)
  }

  User.findOneAndUpdate(
    { email: req.body.email },
    {
      phoneNumber: req.body.phoneNumber,
      occupation: req.body.occupation,
      city: req.body.city,
      county: req.body.county,
      ministry: req.body.ministry,
      about: req.body.about
    }
  )
    .then(success => {
      res.status(200).json({ message: "Profile has been updated successfully" })
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
}

exports.postUpdateUserProfilePic = (req, res) => {
  User.findOne({ _id: req.body.id }).then(user => {
    if (user) {
      user
        .updateOne({
          profilePic: req.body.profilePic
        })
        .then(() => {
          return res.status(200).json({
            message: "Profile Pic updated successfully"
          })
        })
        .catch(err => {
          return res.status(400).json({
            message: "An error occurred while updating profile pic"
          })
        })
    }
  })
}

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
const validateSignupForm = payload => {
  const errors = {}
  let isFormValid = true
  let message = ""

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !validations.email.regex.value.test(payload.email.trim())
  ) {
    isFormValid = false
    errors.email = validations.email.regex.message
    errors.isEmailError = true
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < validations.password.minLength.value
  ) {
    isFormValid = false
    errors.password = validations.password.minLength.message
    errors.isPasswordError = true
  }

  if (
    !payload ||
    typeof payload.firstName !== "string" ||
    payload.firstName.trim().length === 0
  ) {
    isFormValid = false
    errors.firstName = "Please provide your first name."
    errors.isFirstNameError = true
  }

  if (
    !payload ||
    typeof payload.lastName !== "string" ||
    payload.lastName.trim().length === 0
  ) {
    isFormValid = false
    errors.lastName = "Please provide your last name."
    errors.isLastNameError = true
  }

  if (
    !payload ||
    typeof payload.confirmPassword !== "string" ||
    payload.confirmPassword.trim().length === 0
  ) {
    isFormValid = false
    errors.confirmPassword = "Please confirm the password you entered above."
    errors.isConfirmPasswordError = true
  }

  if (payload.confirmPassword !== payload.password) {
    isFormValid = false
    errors.confirmPassword = "Please provide the same password."
    errors.isConfirmPasswordError = true
  }

  if (!isFormValid) {
    message = "Check the form for errors."
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

const validateUpdateForm = payload => {
  const errors = {}
  let isFormValid = true
  let message = ""

  if (
    !payload ||
    typeof payload.phoneNumber !== "string" ||
    payload.phoneNumber.trim().length === 0
  ) {
    isFormValid = false
    errors.phoneNumber = "Please provide your phone number."
  }

  if (
    !payload ||
    typeof payload.occupation !== "string" ||
    payload.occupation.trim().length === 0
  ) {
    isFormValid = false
    errors.occupation = "Please provide your occupation"
  }

  if (
    !payload ||
    typeof payload.occupation !== "string" ||
    payload.city.trim().length === 0
  ) {
    isFormValid = false
    errors.city = "Please provide your city of residence."
  }

  if (
    !payload ||
    typeof payload.county !== "string" ||
    payload.county.trim().length === 0
  ) {
    isFormValid = false
    errors.county = "Please provide your county of residence."
  }

  if (
    !payload ||
    typeof payload.ministry !== "string" ||
    payload.ministry.trim().length === 0
  ) {
    isFormValid = false
    errors.ministry = "Please provide your ministry."
  }

  if (
    !payload ||
    typeof payload.about !== "string" ||
    payload.about.trim().length === 0
  ) {
    isFormValid = false
    errors.about = "Please provide your bio."
  }

  if (!isFormValid) {
    message = "Check the form for errors."
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
const validateLoginForm = payload => {
  const errors = {}
  let isFormValid = true
  let message = ""

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !validations.email.regex.value.test(payload.email.trim())
  ) {
    isFormValid = false
    errors.email = validations.email.regex.message
    errors.isEmailError = true
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < validations.password.minLength.value
  ) {
    isFormValid = false
    ;(errors.password = validations.password.minLength.message),
      (errors.isPasswordError = true)
  }

  if (!isFormValid) {
    message = "Check the form for errors."
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}
