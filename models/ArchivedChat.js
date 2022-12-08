const { INTEGER, DATE } = require("sequelize");
const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const ArchivedChat = sequelize.define("ArchivedChat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  content: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  fileUrl: Sequelize.STRING,
  messageId: INTEGER,
  messageCreatedAt: DATE,
  messageUpdatedAt: DATE,
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  groupId: INTEGER,
});

module.exports = ArchivedChat;
