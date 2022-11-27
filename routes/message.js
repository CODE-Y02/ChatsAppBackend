const express = require("express");
const router = express.Router();

const { authentication } = require("../middlewares/auth");

const { saveMsg, readMsg } = require("../controllers/message");

router.post("/send", authentication, saveMsg);

router.post("/read", authentication, readMsg);

module.exports = router;
