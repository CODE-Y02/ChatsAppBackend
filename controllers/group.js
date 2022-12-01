// find all groups
const getUserGroups = async (req, res) => {
  // fetch all group where user is member
  try {
    let groups = await req.user.getGroups();

    res.json(groups);
  } catch (error) {
    console.log("\n\n ===============>\n", error, "\n\n\n");
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getUserGroups,
};
