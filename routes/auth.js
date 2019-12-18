const express = require("express")
const router = express.Router()
const authCheck = require("../middleware/auth-check")
const Roles = require("../validation/roles")
const authController = require("../main/controllers/authController")

// POST /auth/signup
router.post("/signup", authController.postSignup)

// POST /auth/login
router.post("/login", authController.postLogin)

//PUT /auth/update
router.put(
  "/update",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  authController.updateProfile
)

router.post(
  "/updateprofilepic",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  authController.postUpdateUserProfilePic
)

module.exports = router
