const express = require("express");
const router = express.Router();

const {
  createNewGroup,
  addNewMemberToGroup,
  getUserGroups,
  getAdminGroups,
} = require("../controllers/group");
const { authentication } = require("../middlewares/auth");

// create group
router.post("/create", authentication, createNewGroup);

// add member
router.post("/addmember", authentication, addNewMemberToGroup);

// get user groups
router.get("/all", authentication, getUserGroups);

// get admin groups
router.get("/admingroups", authentication, getAdminGroups);

module.exports = router;
