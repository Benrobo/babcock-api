const express = require("express");
const router = express.Router();

const auth = require("../services/auth");
const util = require("../util");

router.post("/login", async (req, res) => {
  let data = req.body;

  if (Object.entries(data).length === 0 || data.role === "") {
    return util.sendJson(
      res,
      util.Error("user fields is required, instead got an empty fields")
    );
  }
  if (data.role === "") {
    return util.sendJson(util.Error("user role is required"));
  }
  if (data.role === "student") {
    return await auth.loginStudents(data, res);
  }

  if (data.role === "driver") {
    return await auth.loginDrivers(data, res);
  }

  return util.sendJson(res, util.Error("invalid inputs fields"), 400);
});

module.exports = router;
