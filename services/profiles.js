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

  async editProfile(data, res) {
    if (Object.entries(data).length === 0 || data.role === "") {
      return util.sendJson(res, util.Error("A valid payload is required"), 400);
    }
    if (
      data.role === "" ||
      data.userId === undefined ||
      data.role === undefined
    ) {
      return util.sendJson(
        res,
        util.Error("empty fields, required role and userId."),
        400
      );
    }

    const { userId, role, profileDetails } = data;
    const userIdentity = profileDetails.identity.includes("-")
      ? profileDetails.identity.trim()
      : `${role}-${profileDetails.identity.trim()}`;

    // check if userId is available in database
    // const sql1 = `SELECT name, mail, "profilePics", "phoneNumber" FROM "usersTable" WHERE id=$1 AND "userRole"=$2 INNER JOIN trips ON "usersTable".id=trips."userId"`;
    const sql = `SELECT * FROM "usersTable" WHERE id=$1 AND "userRole"=$2`;
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

        // else if everything went well, update the users details in database
        // check if user password is provided, cause we dont wanna update the original password in db to null or empty if it not provided
        // generate refreshTokens and accessTokens
        const userPayload = {
          id: userId,
          identity: profileDetails.identity,
          mail: profileDetails.email,
          role: role,
          status: results.rows[0].status,
        };
        const refreshToken = util.genRefreshToken(userPayload);
        const accessToken = util.genAccessToken(userPayload);

        if (profileDetails.password === undefined) {
          const sqlupdate = `UPDATE "usersTable" SET name=$1, mail=$2, "usersIdentifier"=$3, "phoneNumber"=$4, "refreshToken"=$5 WHERE id=$6 AND "userRole"=$7`;
          db.query(
            sqlupdate,
            [
              profileDetails.name,
              profileDetails.email,
              userIdentity,
              profileDetails.phoneNumber,
              refreshToken,
              userId,
              role,
            ],
            (err, result2) => {
              if (err) {
                console.log(err);
                return util.sendJson(
                  res,
                  util.Error("Something went wrong updating users: " + err),
                  400
                );
              }

              userPayload["refreshToken"] = refreshToken;
              userPayload["accessToken"] = accessToken;

              let sendData = userPayload;

              return util.sendJson(res, sendData, 200);
            }
          );
        }
        if (profileDetails.password) {
          // new hash
          const newHash = util.genHash(profileDetails.password, 10);

          const sqlupdate = `UPDATE "usersTable" SET name=$1, mail=$2, "usersIdentifier"=$3, "phoneNumber"=$4, password=$5, "refreshToken"=$6 WHERE id=$7 AND "userRole"=$8`;
          db.query(
            sqlupdate,
            [
              profileDetails.name,
              profileDetails.email,
              userIdentity,
              profileDetails.phoneNumber,
              newHash,
              refreshToken,
              userId,
              role,
            ],
            (err, result2) => {
              if (err) {
                console.log(err);
                return util.sendJson(
                  res,
                  util.Error("Something went wrong updating users: " + err),
                  400
                );
              }

              userPayload["refreshToken"] = refreshToken;
              userPayload["accessToken"] = accessToken;

              let sendData = userPayload;

              return util.sendJson(res, sendData, 200);
            }
          );
        }
      });
    } catch (err) {
      console.log(err);
      return util.sendJson(
        res,
        util.Error("Something went wrong fetching users: " + err),
        500
      );
    }
  }
};
