const express = require("express")
const router = express.Router()
const authCheck = require("../middleware/auth-check")
const Roles = require("../validation/roles")
const memberController = require("../main/controllers/memberController")

// POST /member/register
router.post(
  "/register",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.postRegMember
)

//GET /member/list
router.get(
  "/list",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.list
)

//GET /member/list/:email
router.get(
  "/list/:email",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.find
)

//GET /member/list
router.get(
  "/listsms",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.membersms
)

//GET /member/listrelationship
router.get(
  "/listrelationship",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.listRelationshipMembers
)

//POST /member/addrelationship
router.post(
  "/addrelationship",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.addRelationship
)

//POST /member/updateprofile
router.post(
  "/updateprofile",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.postUpdateMemberProfile
)

//POST /member/updateprofilepic
router.post(
  "/updateprofilepic",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.postUpdateMemberProfilePic
)

//POST /member/sendsms
router.post(
  "/sendsms",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.sendSms
)

//POST /member/multiplesmsrecipients
router.post(
  "/multiplesmsrecipients",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.multipleSmSRecipients
)

//POST /member/groupsms
router.post(
  "/groupsms",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.sendGroupSMS
)

//GET /member/count
router.get(
  "/count",
  authCheck([Roles.member, Roles.admin, Roles.superAdmin]),
  memberController.countMembers
)

module.exports = router
