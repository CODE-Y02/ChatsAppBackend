const User = require("../models/user");

const GroupMember = require("../models/groupMembers");
const Group = require("../models/group");

// create new group with req user as default admin

const createNewGroup = async (req, res) => {
  try {
    const user = req.user;

    const name = req.body.name;
    // once we have user then create group and make user admin
    // console.log("\n\n\n", req.body, "\n\n\n");

    const newgroup = await user.createGroup(
      { name },
      { through: { isAdmin: true } }
    );

    // console.log("\n\n\n", newgroup, "\n\n\n");

    res.status(201).json({
      success: true,
      message: `Group created`,
      newgroup,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error`,
      error,
    });
  }
};

// add new member to existing group
const addNewMemberToGroup = async (req, res) => {
  try {
    let { userId, groupId } = req.body;

    const admin = req.user;

    const member = await User.findByPk(userId);
    let group = await admin.getGroups({ where: { id: groupId } });
    console.log("\n\n\n", group, "\n\n\n");

    //once we have group
    let newMember = await group[0].addUser(member);

    res.status(201).json({
      success: true,
      message: `member added successfully`,
      newMember,
    });
  } catch (error) {
    console.log("\n\n\n", error, "\n\n\n");

    res.json(error);
  }
};

// find all groups
const getUserGroups = async (req, res) => {
  // fetch all group where user is member
  try {
    let groups = await req.user.getGroups();

    console.log("\n\n ===========>\n\n", groups, "\n\n\n");

    res.json(groups);
  } catch (error) {
    console.log("\n\n ===============>\n", error, "\n\n\n");

    res.status(500).json(error);
  }
};

//find groups as admin
const getAdminGroups = async (req, res) => {
  try {
    const user = req.user;

    let groupArr = await GroupMember.findAll({
      where: {
        isAdmin: true,
        userId: user.id,
      },
    });

    let temp = await groupArr.map((obj) => Group.findByPk(obj.groupId));

    let groups = await Promise.all(temp);
    // console.log("\n\n ===========>\n\n", temp, "\n\n\n");

    res.status(200).json(groups);
  } catch (error) {
    console.log("\n\n ===============>\n", error, "\n\n\n");

    res.status(500).json(error);
  }
};

module.exports = {
  createNewGroup,
  addNewMemberToGroup,
  getAdminGroups,
  getUserGroups,
};
