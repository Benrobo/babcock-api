const express = require("express");
const router = express.Router();

const Profile = require("../services/profiles");
const util = require("../util");

const profile = new Profile();

router.post("/users", async (req, res) => {
  let data = req.body;

  // validate data
  if (Object.entries(data).length === 0 || data.role === "") {
    return util.sendJson(res, util.Error("A valid payload is required"), 400);
  } else {
    return new Profile().usersProfile(data, res);
  }
});

router.post("/users/editProfile", async (req, res) => {
  let data = req.body;

  // validate data
  if (Object.entries(data).length === 0 || data.role === "") {
    return util.sendJson(res, util.Error("A valid payload is required"), 400);
  } else {
    return new Profile().editProfile(data, res);
  }
});

module.exports = router;
