const express = require("express");
const sequelize = require("./utils/database");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json()); //body parser

// import routes
const userRoutes = require("./routes/user");

// user route
app.use(userRoutes);

// 404

app.use("/", (req, res) => {
  res.status(404).json({ message: "Page NOt Founs !!!" });
});

// start server function
const startApp = async () => {
  try {
    await sequelize.sync();

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `\n\n expenseTracker server is running at  ${
          process.env.PORT || 3000
        } PORT \n\n`
      );
    });
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log({ errorMsg: error.message, error });
    console.log("\n \n \n \n ");
  }
};

startApp();
