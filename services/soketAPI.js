const res = require("express/lib/response");
const db = require("../model/db");
const util = require("../util/index");

function test(io) {
  io.on("connection", () => {
    console.log("client connected");
  });
}

module.exports = {
  test,
};
