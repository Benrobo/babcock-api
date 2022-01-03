const express = require("express");
const router = express.Router();

const Profile = require("../services/profiles");

const profile = new Profile();

router.get("/users", async (req, res) => {
  return await profile.allUsers(res);
});

module.exports = router;
