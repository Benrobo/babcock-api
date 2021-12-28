const express = require("express");
const router = express.Router();

const auth = require("../services/auth");
const util = require("../util");

router.post("/register", async (req, res) => {
  let data = req.body;
  // validate data
  if (Object.entries(data).length === 0 || data.role === "") {
    return util.sendJson(res, util.Error("A VALID ROLE IS REQUIRED"), 400);
  } else {
    let role = data.role;
    if (role.toLowerCase() === "student") {
      return await auth.registerStudents(data, res);
    } else if (role.toLowerCase() === "driver") {
      return await auth.registerDrivers(data, res);
    } else {
      return util.sendJson(res, util.Error("Invalid role type provided."), 400);
    }
  }
});

module.exports = router;
