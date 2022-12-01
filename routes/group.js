const express = require("express");
const router = express.Router();

const { getUserGroups } = require("../controllers/group");

const {
  addNewMemberToGroup,
  getAdminGroups,
  createNewGroup,
  createAdmin,
} = require("../controllers/groupAdmin");

const { authentication } = require("../middlewares/auth");

// create group
router.post("/create", authentication, createNewGroup);

// add member
router.post("/addmember", authentication, addNewMemberToGroup);

// get user groups
router.get("/all", authentication, getUserGroups);

// get admin groups
router.get("/admingroups", authentication, getAdminGroups);

// make admin
router.post("/assignAdmin", authentication, createAdmin);

module.exports = router;
