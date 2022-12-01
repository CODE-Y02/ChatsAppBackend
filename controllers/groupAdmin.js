//  models import
const User = require("../models/user");
const GroupMember = require("../models/groupMembers");
const Group = require("../models/group");
const { Op } = require("sequelize");

// helper services
const { getUsers } = require("../services/userServices");

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
    //1 get memberId & groupId from req

    const { groupId, memberInfo } = req.body;

    const where = {
      [Op.or]: [
        { name: memberInfo },
        { email: memberInfo },
        { phone: memberInfo },
        { id: memberInfo },
      ],
    };

    // 2 find member
    const members = await getUsers({ where });

    console.log("\n\n\n", members, "\n\n\n");

    //  multiple user found
    if (members.length > 1) {
      return res.status(409).json({
        success: false,
        message: "Duplicate Entry Found",
      });
    }

    // no user found
    if (members.length < 1 || !members) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    // let member = await validateUser(memberInfo);

    let member = members[0];

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
    // 1 get memberId & groupId from req
    const { memberInfo, groupId } = req.body;

    const where = {
      [Op.or]: [
        { name: memberInfo },
        { email: memberInfo },
        { phone: memberInfo },
        { id: memberInfo },
      ],
    };

    // 2 find member
    const members = await getUsers({ where });

    console.log("\n\n\n", members, "\n\n\n");

    //  multiple user found
    if (members.length > 1) {
      return res.status(409).json({
        success: false,
        message: "Duplicate Entry Found",
      });
    }

    // no user found
    if (members.length < 1 || !members) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    // 2 find member
    let member = members[0];

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
      { where: { groupId, userId: member.id } }
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
    // 1 get memberId & groupId from req
    const { memberInfo, groupId } = req.body;

    const where = {
      [Op.or]: [
        { name: memberInfo },
        { email: memberInfo },
        { phone: memberInfo },
        { id: memberInfo },
      ],
    };

    // 2 find member
    const members = await getUsers({ where });

    console.log("\n\n\n", members, "\n\n\n");

    //  multiple user found
    if (members.length > 1) {
      return res.status(409).json({
        success: false,
        message: "Duplicate Entry Found",
      });
    }

    // no user found
    if (members.length < 1 || !members) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    // find member in group

    // destroy gives boolean on success or false
    const member = await GroupMember.destroy({
      where: {
        groupId,
        userId: members[0].id,
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

// member validator function
/*
async function validateUser(memberInfo) {
  try {
    const where = {
      [Op.or]: [
        { name: memberInfo },
        { email: memberInfo },
        { phone: memberInfo },
      ],
    };

    // 2 find member
    const members = await getUsers({ where });

    console.log("\n\n\n", members, "\n\n\n");

    //  multiple user found
    if (members.length > 1) {
      return res.status(409).json({
        success: false,
        message: "Duplicate Entry Found",
      });
    }

    // no user found
    if (members.length < 1 || !members) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found !!!" });
    }

    return members[0];
  } catch (error) {
    return new Error(error);
  }
}

*/
