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
    // get memberId & groupId from req
    const { memberId, groupId } = req.body;

    // 1 check user is admin of group
    const admin = await GroupMember.findOne({
      where: { groupId, userId: req.user.id },
    });

    if (!admin) {
      // unauthorized
      return res
        .status(401)
        .json({ success: false, message: "You are not a admin of group" });
    }

    // 2 find member
    let member = await User.findByPk(memberId);

    if (!member) {
      // invalid member id or user not found
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    // 3  check if member is already in group

    // find group
    const group = await Group.findByPk(groupId);
    const memberExist = await group.hasUser(member); // magic method --> boolean

    if (memberExist)
      return res
        .status(409)
        .json({ success: false, message: "member already exist" });

    // 4 add member to group
    const newMember = await group.addUser(member); // magic method

    res.status(201).json({
      success: true,
      message: `${member.name} added to ${group.name} group`,
    });
  } catch (error) {
    console.log("\n\n\n", error, "\n\n\n");

    res.status(500).json(error);
  }
};

// make member admin
const createAdmin = async (req, res) => {
  try {
    // get memberId & groupId from req
    const { memberId, groupId } = req.body;

    // 1 check user is admin of group
    const admin = await GroupMember.findOne({
      where: { groupId, userId: req.user.id },
    });

    if (!admin) {
      // unauthorized
      return res
        .status(401)
        .json({ success: false, message: "You are not a admin of group" });
    }

    // 2 find member
    let member = await User.findByPk(memberId);

    if (!member) {
      // invalid member id or user not found
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    // 3  check if member is already in group

    // find group
    const group = await Group.findByPk(groupId);
    const memberExist = await group.hasUser(member); // magic method --> boolean

    if (!memberExist)
      return res
        .status(404)
        .json({ success: false, message: "User is not a member of group" });

    // if memberExist
    const newAdmin = await GroupMember.update(
      { isAdmin: true },
      { where: { groupId, userId: memberId } }
    );

    res.status(202).json({
      success: true,
      message: `${member.name}  is now ${group.name} group admin`,
      newAdmin,
    });
  } catch (error) {
    console.log("\n\n\n", error, "\n\n\n");
    res.json(error);
  }
};

// remove user from group
const removeMemberFromGroup = async (req, res) => {
  try {
    // get memberId & groupId from req
    const { memberId, groupId } = req.body;

    // 1 check user is admin of group
    const admin = await GroupMember.findOne({
      where: { groupId, userId: req.user.id },
    });

    if (!admin) {
      // unauthorized
      return res
        .status(401)
        .json({ success: false, message: "You are not a admin of group" });
    }

    // find member in group

    // destroy gives boolean on success or false
    const member = await GroupMember.destroy({
      where: {
        groupId,
        userId: memberId,
      },
    });

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member is not in a group" });
    }
    res.status(200).json({
      success: true,
      message: "member removed from group",
      member,
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

// export

module.exports = {
  createAdmin,
  createNewGroup,
  getAdminGroups,
  addNewMemberToGroup,
  removeMemberFromGroup,
};
