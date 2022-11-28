const express = require("express");
const sequelize = require("./utils/database");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json()); //body parser

// models import
const User = require("./models/user");
const Message = require("./models/message");

// association
User.hasMany(Message);
Message.belongsTo(User);

// import routes
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
// user route
app.use(userRoutes);
//message route
app.use("/message", messageRoutes);

// 404

app.use("/", (req, res) => {
  res.status(404).json({ message: "Page NOt Founs !!!" });
});

// start server function
const startApp = async () => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });

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
