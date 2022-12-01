const express = require("express");
const router = express.Router();

const { getUserGroups } = require("../controllers/group");

const {
  addNewMemberToGroup,
  getAdminGroups,
  createNewGroup,
  createAdmin,
  removeMemberFromGroup,
} = require("../controllers/groupAdmin");

const { authentication, groupAdminAuth } = require("../middlewares/auth");

// get user groups
router.get("/all", authentication, getUserGroups);

// get admin groups
router.get("/admingroups", authentication, getAdminGroups);

// create group
router.post("/create", authentication, createNewGroup);

// add member
router.post("/addmember", authentication, groupAdminAuth, addNewMemberToGroup);

// make admin
router.post("/assignAdmin", authentication, groupAdminAuth, createAdmin);

// remove member
router.delete(
  "/removeMember",
  authentication,
  groupAdminAuth,
  removeMemberFromGroup
);

module.exports = router;
