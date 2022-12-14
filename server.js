const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./utils/database");

const app = express();

app.use(cors());

app.use(express.json()); //body parser

// models import
const User = require("./models/user");
const Message = require("./models/message");
const Group = require("./models/group");
const GroupMember = require("./models/groupMembers");

// Association

User.hasMany(Message);
Message.belongsTo(User);

// user group relation
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

// messager and group relation
Group.hasMany(Message);
Message.belongsTo(Group);

// import routes
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const groupRoutes = require("./routes/group");

// multer
const multer = require("multer");

// const upload = multer();

// user route
app.use(userRoutes);

const upload = multer({ dest: "./public/data/uploads/" });

app.use("/message", upload.single("file"), function (req, res, next) {
  // console.log("file ======> ", req.file);

  // console.log("body ====> ", req.body);
  next();
});

//message route
app.use("/message", messageRoutes);

// group route
app.use("/group", groupRoutes);

// 404

app.use("/", (req, res) => {
  res.status(404).json({ message: "Page NOt Found !!!" });
});

// start server function
const startApp = async () => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });

    // await sequelize.sync({ alter: true });

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `\n\n expenseTracker server is running at  ${
          process.env.PORT || 3000
        } PORT \n\n`
      );
    });
  } catch (error) {
    console.log("\n \n error in server start =======> \n \n ");
    console.log({ errorMsg: error.message, error });
    console.log("\n \n \n \n ");
  }
};

//cron job
const { archiveMessage } = require("./services/cleanUp");

startApp();

archiveMessage();
