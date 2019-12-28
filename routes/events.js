const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/auth-check");
const Roles = require("../validation/roles");
const eventsController = require("../main/controllers/eventsController");

// POST /events/create
router.post(
  "/create",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  eventsController.postCreateEvent
);

//GET /events/get
router.get("/get", eventsController.getEvents);

module.exports = router;
