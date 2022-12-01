// THIS FILE WILL CONTAIN ALL AUTH RELATED MIDDLEWARES

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// jwt
const jwt = require("jsonwebtoken");
const GroupMember = require("../models/groupMembers");
const User = require("../models/user");

const authentication = async (req, res, next) => {
  try {
    // console.log("\n\n\n", req.headers, "\n\n\n");
    let token = req.headers.authorization;

    const userObj = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log("\n \n ", userObj);

    let user = await User.findByPk(userObj.userId);

    // console.log(user);
    req.user = user; // very Imp
    next();
  } catch (error) {
    console.log(" \n ERR in AUTH ", error);
    return res.status(401).json({ success: false, message: "invalid token" });
  }
};

const groupAdminAuth = async (req, res, next) => {
  try {
    const { groupId } = req.body;

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

    // call next
    next();
  } catch (error) {
    console.log(" \n ERR in AdminAuth  ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  authentication,
  groupAdminAuth,
};
