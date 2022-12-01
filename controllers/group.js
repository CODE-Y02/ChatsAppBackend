const User = require("../models/user");

const GroupMember = require("../models/groupMembers");
const Group = require("../models/group");

// find all groups
const getUserGroups = async (req, res) => {
  // fetch all group where user is member
  try {
    let groups = await req.user.getGroups();

    // console.log("\n\n ===========>\n\n", groups, "\n\n\n");

    res.json(groups);
  } catch (error) {
    console.log("\n\n ===============>\n", error, "\n\n\n");

    res.status(500).json(error);
  }
};

module.exports = {
  getUserGroups,
};
