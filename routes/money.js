const express = require("express")
const router = express.Router()
const authCheck = require("../middleware/auth-check")
const Roles = require("../validation/roles")
const moneyController = require("../main/controllers/moneyController")

// POST /money/in
router.post(
  "/in",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  moneyController.postMoneyIn
)

// POST /money/out
router.post(
  "/out",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  moneyController.postMoneyOut
)

//GET /money/data
router.get(
  "/data",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  moneyController.getMoneyData
)

//GET /money/list
router.get(
  "/list",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  moneyController.getMoneyList
)

module.exports = router
