const User = require("../models/user");

module.exports.getUsers = (where) => {
  return User.findAll(where);
};
