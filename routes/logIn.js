const express = require("express");
const router = express.Router();

const { checkAuth } = require("../middlewares/auth");
const auth = require("../services/auth");
const util = require("../util");

router.post("/login", checkAuth, async (req, res) => {
  let data = req.body;
  // validate data
  if (!data || data.role === undefined || data.role === "") {
    return util.sendJson(res, util.Error("A VALID ROLE IS REQUIRED"), 400);
  } else {
    let role = data.role;
    if (role.toLowerCase() === "students") {
      return await auth.registerStudents(data, res);
    } else if (role.toLowerCase() === "driver") {
      return await auth.registerDrivers(data, res);
    } else {
      return util.sendJson(res, util.Error("Invalid role type provided."), 400);
    }
  }
});

module.exports = router;
