const express = require("express")
const router = express.Router()
const authCheck = require("../middleware/auth-check")
const Roles = require("../validation/roles")

const messageController = require("../api/controllers/messageController")
const userController = require("../api/controllers/userController")

// GET /api/messages/public1
router.get("/messages/public1", messageController.getPublicMessage1)

// GET /api/messages/private1
router.get(
  "/messages/private1",
  authCheck(),
  messageController.getPrivateMessage1
)

// GET /api/messages/admin1
router.get(
  "/messages/admin1",
  authCheck([Roles.admin, Roles.superAdmin]),
  messageController.getAdminMessage1
)

// GET /api/users
router.get("/users", authCheck([Roles.admin]), userController.list)

// GET /api/users/:id
router.get(
  "/users/:id",
  authCheck([Roles.agent, Roles.admin, Roles.superAdmin]),
  userController.find
)

// GET /api/clients
router.get("/clients", authCheck([Roles.admin]), userController.getAllClients)

// GET /api/clients/:id
router.get(
  "/clients/:id",
  authCheck([Roles.agent, Roles.admin, Roles.superAdmin]),
  userController.getOneUser
)

// DELETE /api/users/:id
router.delete("/users/:id", authCheck([Roles.admin]), userController.destroy)

// PUT /api/users
router.put("/users", authCheck([Roles.superAdmin]), userController.updateUser)

// PUT /api/users/password
router.put(
  "/users/password",
  authCheck([Roles.admin]),
  userController.updatePassword
)

// PUT /api/users/activate
router.put("/users/activate", authCheck([Roles.admin]), userController.activate)

//PUT /api/users/suspend
router.put("/users/suspend", authCheck([Roles.admin]), userController.suspend)

// PUT /api/users/profile
router.put("/users/profile", authCheck(), userController.updateProfile)

// PUT /api/users/profile/password
router.put(
  "/users/profile/password",
  authCheck(),
  userController.updateProfilePassword
)

module.exports = router
