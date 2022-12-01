const Sequalize = require("sequelize");

const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequalize(process.env.DB_URL_RAILWAY);

module.exports = sequelize;
