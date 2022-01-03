const res = require("express/lib/response");
const db = require("../model/db");
const util = require("../util/index");

class UserAuth {
  async registerStudents(
    { name, email, role, phoneNumber, matricNumber, password },
    res
  ) {
    // make sure a students isnt providing a drivers platenumber instead he/she should provide a matricnumber
    if (
      (role === "student" && matricNumber === undefined) ||
      matricNumber === ""
    ) {
      return util.sendJson(res, util.Error("matric number is missing."), 400);
    }
    if (
      name === "" ||
      email === "" ||
      role === "" ||
      phoneNumber === "" ||
      matricNumber === "" ||
      password === "" ||
      name === undefined ||
      email === undefined ||
      role === undefined ||
      phoneNumber === undefined ||
      matricNumber === undefined ||
      password === undefined
    ) {
      return util.sendJson(res, util.Error("Inputs fields cant be empty"), 400);
    } else {
      const studentIdentity = matricNumber.trim().split("").includes("/")
        ? `student-${matricNumber.trim().split("/").join("")}`
        : `student-${matricNumber.trim().split("").join("")}`;
      // validate matric number
      if (util.validateMatricNumber(matricNumber) === false) {
        return util.sendJson(
          res,
          util.Error("Invalid Matric Number Provided"),
          400
        );
      }

      if (util.validatePhonenumber(phoneNumber) === false) {
        return util.sendJson(res, util.Error("Phonenumber is invalid"), 400);
      }
      if (util.validateEmail(email) === false) {
        return util.sendJson(res, util.Error("Email is invalid"), 400);
      }

      // check if user with that email already exist

      const queryCheck = `SELECT * FROM "usersTable" WHERE mail=$1 OR "phoneNumber"=$2 OR "usersIdentifier"=$3`;
      db.query(
        queryCheck,
        [email, phoneNumber, studentIdentity],
        (err, results) => {
          if (err) {
            // console.log(err.error);
            return util.sendJson(
              res,
              util.Error("Something went wrong registering users: " + err),
              400
            );
          }
          if (results.rowCount > 0) {
            return util.sendJson(
              res,
              util.Error(
                "User with that email or phonenumber or matricNumber already exist"
              ),
              403
            );
          }

          // insert into database
          const userId = util.genId();
          const profilePics = util.randomImages(name);
          const date = util.getRelativeTime("hour");
          const newHash = util.genHash(password);

          // at initial state, refreshToken would be empty string ""
          // when user logged In , it gonna be replace by the refreshToken of the user

          const refreshToken = "";

          const query = `INSERT INTO "usersTable"(id, name, mail, password, "usersIdentifier", "profilePics","userRole","phoneNumber","refreshToken","createdAt") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
          try {
            db.query(
              query,
              [
                userId,
                name,
                email,
                newHash,
                studentIdentity,
                profilePics,
                role,
                phoneNumber.trim(),
                refreshToken,
                date,
              ],
              (error, result) => {
                if (error) {
                  console.log(err);
                  return util.sendJson(
                    res,
                    util.Error(
                      "Something went wrong registering students: " + error
                    ),
                    400
                  );
                }
                return util.sendJson(
                  res,
                  {
                    msg: "User successfully registered",
                    data: result.rows[0],
                  },
                  200
                );
              }
            );
          } catch (err) {
            return util.sendJson(
              res,
              util.Error(
                "Server Error: Something went wrong registering users: " + err
              ),
              500
            );
          }
        }
      );
    }
  }

  async registerDrivers(
    { name, email, role, phoneNumber, plateNumber, password },
    res
  ) {
    if (
      (role === "driver" && plateNumber === undefined) ||
      plateNumber === ""
    ) {
      return util.sendJson(
        res,
        util.Error("platenumber number is missing."),
        400
      );
    }
    if (
      name === "" ||
      email === "" ||
      role === "" ||
      phoneNumber === "" ||
      plateNumber === "" ||
      password === "" ||
      name === undefined ||
      email === undefined ||
      role === undefined ||
      phoneNumber === undefined ||
      plateNumber === undefined ||
      password === undefined
    ) {
      return util.sendJson(res, util.Error("Inputs fields cant be empty"), 400);
    } else {
      const driverIdentity =
        plateNumber.trim().split("").includes("-") === true
          ? `driver-${plateNumber.trim().split("-").join("")}`
          : `driver-${plateNumber.trim().split("").join("")}`;
      // validate matric number
      if (util.validatePlaneNumber(plateNumber) === false) {
        return util.sendJson(
          res,
          util.Error("Invalid Platenumber Provided"),
          400
        );
      }

      if (util.validatePhonenumber(phoneNumber) === false) {
        return util.sendJson(res, util.Error("Phonenumber is invalid"), 400);
      }
      if (util.validateEmail(email) === false) {
        return util.sendJson(res, util.Error("Email is invalid"), 400);
      }

      // check if user with that email or phonenumber or plateNumber already exist

      const queryCheck = `SELECT * FROM "usersTable" WHERE mail=$1 OR "phoneNumber"=$2 OR "usersIdentifier"=$3`;
      db.query(
        queryCheck,
        [email, phoneNumber, driverIdentity],
        (err, results) => {
          if (err) {
            return util.sendJson(
              res,
              util.Error("Something went wrong registering users"),
              400
            );
          }

          if (results.rowCount > 0) {
            return util.sendJson(
              res,
              util.Error(
                "User with that email or phonenumber or platenumber already exist"
              ),
              403
            );
          }

          // insert into database
          const userId = util.genId();
          const profilePics = util.randomImages(name);
          const date = util.getRelativeTime("hour");
          const newHash = util.genHash(password);

          // at initial state, refreshToken would be empty string ""
          // when user logged In , it gonna be replace by the refreshToken of the user

          const refreshToken = "";

          const query = `INSERT INTO "usersTable"(id, name, mail, password, "usersIdentifier", "profilePics","userRole","phoneNumber","refreshToken","createdAt") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
          try {
            db.query(
              query,
              [
                userId,
                name,
                email,
                newHash,
                driverIdentity,
                profilePics,
                role,
                phoneNumber.trim(),
                refreshToken,
                date,
              ],
              (error, result) => {
                if (error) {
                  return util.sendJson(
                    res,
                    util.Error("Something went wrong registering user."),
                    400
                  );
                }
                return util.sendJson(
                  res,
                  {
                    msg: "User successfully registered",
                    data: result.rows[0],
                  },
                  200
                );
              }
            );
          } catch (err) {
            return util.sendJson(
              res,
              util.Error(
                "Server Error: Something went wrong registering users"
              ),
              500
            );
          }
        }
      );
    }
  }

  async loginStudents(data, res) {
    if (Object.entries(data).length === 0) {
      return util.sendJson(res, util.Error("user data is required"), 400);
    } else {
      // check if driver is trying top logged in as student
      if (data.role === "driver" || data.plateNumber) {
        return util.sendJson(
          res,
          util.Error(
            "driver is meant to use only email and not matric number."
          ),
          400
        );
      }
      if (data.matricNumber === "" || data.matricNumber === undefined) {
        return util.sendJson(
          res,
          util.Error(
            "user data is required: matricnumber or password is missing"
          ),
          400
        );
      }
      const { matricNumber, role, password } = data;
      // check if user matric number is correct is available in db
      const matric = matricNumber.split("/").join("");
      const newMatric = `${role}-${matric}`;
      const queryCheck = `SELECT * FROM "usersTable" WHERE "usersIdentifier"=$1`;
      db.query(queryCheck, [newMatric], (err, results) => {
        if (err) {
          console.log(err);
          return util.sendJson(
            res,
            util.Error("somewthing went wrong logging user"),
            400
          );
        }

        if (results.rowCount === 0) {
          return util.sendJson(
            res,
            util.Error("user with that matric number doesnt exist"),
            404
          );
        }

        // check password
        if (!util.compareHash(password, results.rows[0].password)) {
          return util.sendJson(res, util.Error("password is incorrect"), 400);
        }

        // if everything went well
        // logged the user in and update the refreshToken in database
        // generate refreshTokens and accessTokens
        const userPayload = {
          id: results.rows[0].id,
          matricNumber: results.rows[0].usersIdentifier,
          mail: results.rows[0].mail,
          role: results.rows[0].userRole,
        };
        const refreshToken = util.genRefreshToken(userPayload);
        const accessToken = util.genAccessToken(userPayload);

        const query = `UPDATE "usersTable" SET "refreshToken"=$1 WHERE "usersIdentifier"=$2`;
        db.query(query, [refreshToken, newMatric], (err, data2) => {
          if (err) {
            return util.sendJson(
              res,
              util.Error(
                "somewthing went wrong logging user: updating user refreshToken"
              ),
              400
            );
          }

          const sendData = {
            data: data2.rows[0],
            refreshToken,
            accessToken,
          };

          // send the tokens to client to be stored in browser

          return util.sendJson(res, sendData);
        });
      });
    }
  }

  async loginDrivers(data, res) {
    if (Object.entries(data).length === 0) {
      return util.sendJson(res, util.Error("user data is required"), 400);
    } else {
      // check if student is trying top logged in as driver
      if (data.role === "student" || data.matricNumber) {
        return util.sendJson(
          res,
          util.Error(
            "student is meant to use matric number and the roleType must be a student."
          ),
          400
        );
      }
      if (data.mail === "" || data.mail === undefined) {
        return util.sendJson(
          res,
          util.Error("user data is required: email or password is missing"),
          400
        );
      }
      const { mail, role, password } = data;
      // check if user matric number is correct is available in db
      const queryCheck = `SELECT * FROM "usersTable" WHERE "mail"=$1 OR "userRole"=$2`;
      db.query(queryCheck, [mail, role], (err, results) => {
        if (err) {
          return util.sendJson(
            res,
            util.Error("somewthing went wrong logging user"),
            400
          );
        }

        if (results.rowCount === 0) {
          return util.sendJson(
            res,
            util.Error("user with that email doesnt exist"),
            404
          );
        }

        // check password
        if (!util.compareHash(password, results.rows[0].password)) {
          return util.sendJson(res, util.Error("password is incorrect"), 400);
        }

        // if everything went well
        // logged the user in and update the refreshToken in database
        // generate refreshTokens and accessTokens
        const userPayload = {
          id: results.rows[0].id,
          matricNumber: results.rows[0].usersIdentifier,
          mail: results.rows[0].mail,
          role: results.rows[0].userRole,
        };

        const refreshToken = util.genRefreshToken(userPayload);
        const accessToken = util.genAccessToken(userPayload);

        const query = `UPDATE "usersTable" SET "refreshToken"=$1 WHERE mail=$2`;
        db.query(query, [refreshToken, mail], (err, data2) => {
          if (err) {
            return util.sendJson(
              res,
              util.Error(
                "somewthing went wrong logging user: updating user refreshToken"
              ),
              400
            );
          }
          const sendData = {
            refreshToken,
            accessToken,
          };

          // send the tokens to client to be stored in browser
          return util.sendJson(res, sendData, 200);
        });
      });
    }
  }
}

module.exports = new UserAuth();
