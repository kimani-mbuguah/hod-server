const express = require("express")
const router = express.Router()
const authCheck = require("../middleware/auth-check")
const Roles = require("../validation/roles")
const adminController = require("../main/controllers/adminController")

//GET /admin/list
router.get(
  "/list",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  adminController.list
)

//GET /admin/list/:email
router.get(
  "/list/:email",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  adminController.find
)

router.post(
  "/updateauth",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  adminController.postUpdateAuth
)

module.exports = router
