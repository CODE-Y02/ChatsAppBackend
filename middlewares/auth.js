// THIS FILE WILL CONTAIN ALL AUTH RELATED MIDDLEWARES

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// jwt
const jwt = require("jsonwebtoken");
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
    return res.status(401).json({ success: false });
  }
};

// const isGroupAdminAuth = async (req, res, next) => {
//   try {
//     let admin = req.user;

//     let where = req.body.groupId
//       ? { id: groupId, isAdmin: true, userId: admin.id }
//       : { };
//     let group = await admin.getGroups(where);

//     if (!group || group.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: " You are not a admin" });
//     }
//   } catch (error) {}
// };

module.exports = {
  authentication,
};
