const User = require("../models/user");

const GroupMember = require("../models/groupMembers");
const Group = require("../models/group");

// create new group with req user as default admin

const createNewGroup = async (req, res) => {
  try {
    const user = req.user;

    const name = req.body.name;

    // once we have user then create group and make user admin

    const newgroup = await user.createGroup(
      { name },
      { through: { isAdmin: true } }
    );

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

    // check if member exist or not
    const member = await User.findByPk(userId);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    //check is req user is admin of group
    const admin = await GroupMember.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    // if not admin then return 400
    if (!admin) {
      return res.status(400).json({ Success: " False " });
    }

    // add member to group
    const newMember = await GroupMember.create({
      userId: userId, // member user id
      groupId: groupId,
    });

    console.log(
      "\n\naddNewMemberToGroup    ============>   \n\n",
      newMember,
      "\n\n\n\n"
    );

    res.status(201).json({
      success: true,
      message: `member added successfully`,
      newMember,
    });
  } catch (error) {
    console.log("\n\n\n", error, "\n\n\n");

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

// make member admin
const createAdmin = async (req, res) => {
  try {
    // group id and userid of member we want to make admin
    let { groupId, userId } = req.body;

    //check is req user is admin of group
    let admin = await GroupMember.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    // if not admin then return 400
    if (!admin) {
      return res.status(400).json({ Success: " False " });
    }

    // set member as admin
    let newadmin = await GroupMember.create({
      isAdmin: true,
      where: { groupId: groupId, userId: userId },
    });

    console.log("\n\n NEW  ADMIN ========> \n\n", newadmin, "\n\n\n");
    res.json(newadmin);
  } catch (error) {
    console.log("\n\n\n", error, "\n\n\n");
    res.json(error);
  }
};

module.exports = {
  createAdmin,
  createNewGroup,
  getAdminGroups,
  addNewMemberToGroup,
};
