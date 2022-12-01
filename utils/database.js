const Sequalize = require("sequelize");

const dotenv = require("dotenv");

dotenv.config();

// const sequelize = new Sequalize(
//   process.env.DB_NAME,
//   process.env.DB_USERNAME,
//   process.env.DB_PASS,
//   {
//     dialect: "mysql",
//     host: process.env.DB_HOST,
//   }
// );

const sequelize = new Sequalize(process.env.DB_URL_RAILWAY);

module.exports = sequelize;
