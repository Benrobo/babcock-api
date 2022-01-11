const res = require("express/lib/response");
const db = require("../model/db");
const util = require("../util/index");

module.exports = class Profile {
  async usersProfile({ role, userId }, res) {
    if (role === "" || userId === undefined || role === undefined) {
      return util.sendJson(
        res,
        util.Error("empty fields, required role and userId."),
        400
      );
    }

    // check if userId is available in database
    // const sql1 = `SELECT name, mail, "profilePics", "phoneNumber" FROM "usersTable" WHERE id=$1 AND "userRole"=$2 INNER JOIN trips ON "usersTable".id=trips."userId"`;
    const sql = `SELECT "name", "mail", "usersIdentifier", "profilePics", "phoneNumber" from "usersTable" WHERE id=$1 AND "userRole"=$2`;
    try {
      db.query(sql, [userId.trim(), role.trim()], (err, results) => {
        if (err) {
          // console.log(err.error);
          return util.sendJson(
            res,
            util.Error("Something went wrong fetching users: " + err),
            400
          );
        }
        if (results.rowCount === 0) {
          return util.sendJson(
            res,
            util.Error("User with that id and role doesnt exist"),
            404
          );
        }

        // else if everything went well fetch right results
        return util.sendJson(res, results.rows[0], 200);
      });
    } catch (err) {
      return util.sendJson(
        res,
        util.Error("Something went wrong fetching users: " + err),
        500
      );
    }
  }

  async allUsers(res) {
    const sql = `SELECT * FROM "usersTable"`;
    try {
      db.query(sql, (err, results) => {
        if (err) {
          // console.log(err.error);
          return util.sendJson(
            res,
            util.Error("Something went wrong fetching users: " + err),
            400
          );
        }

        // else if everything went well fetch right results
        return util.sendJson(
          res,
          {
            data: results.rows[0],
          },
          200
        );
      });
    } catch (err) {
      return util.sendJson(
        res,
        util.Error("Something went wrong fetching users: " + err),
        500
      );
    }
  }
};
