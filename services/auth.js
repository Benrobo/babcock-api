const res = require("express/lib/response");
const db = require("../model/db");
const util = require("../util/index");

class UserAuth {
  async registerStudents({
    name,
    email,
    role,
    phoneNumber,
    matricNumber,
    password,
  }, res) {
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
      return util.sendJson(res, util.Error("Inputs fields cant be empty"), 400)
    } else {
      const studentIdentity = `student-${matricNumber.trim().split("/").join("")}`;
      // validate matric number
      const matricNumberLength = 6;
      if (
        matricNumber === "" ||
        matricNumber === undefined ||
        matricNumber === null ||
        matricNumber.length > matricNumberLength || matricNumber.length !== matricNumberLength
      ) {
        return util.sendJson(res, util.Error("Invalid Matric Number Provided"), 400);
      }

      if (util.validatePhonenumber(phoneNumber) === false) {
        return util.sendJson(res, util.Error("Phonenumber is invalid"), 400);
      }
      if (util.validateEmail(email) === false) {
        return util.sendJson(res, util.Error("Email is invalid"), 400);
      }

      // check if user with that email already exist

      const queryCheck = `SELECT * FROM "usersTable" WHERE mail = $1`;
      db.query(queryCheck, [email], (err, results) => {
        if (err) {
          return util.sendJson(res, util.Error("Something went wrong registering users"), 400);
        }
        if (results.rowCount > 0) {
          return util.sendJson(res, util.Error("User with that email already exist"), 403);
        }

        // insert into database
        const userId = util.genId();
        const profilePics = util.randomImages(name);
        const date = util.getRelativeTime("hour");

        // at initial state, refreshToken would be empty string ""
        // when user logged In , it gonna be replace by the refreshToken of the user

        const refreshToken = "";

        const query = `INSERT INTO "usersTable"(id, name, mail, password, "usersIdentifier", "profilePics","userRole","refreshToken","createdAt") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
        try {
          db.query(
            query,
            [
              userId,
              name,
              email,
              password,
              studentIdentity,
              profilePics,
              role,
              refreshToken,
              date,
            ],
            (error, result) => {
              if (error) {
                return util.sendJson(res, 
                  util.Error("Something went wrong registering users"), 400
                );
              }
              return util.sendJson(res, {
                msg: "User successfully registered",
                data: result.rows[0],
              }, 200);
            }
          );
        } catch (err) {
          return util.sendJson(res, 
            util.Error("Server Error: Something went wrong registering users"), 500
          );
        }
      });
    }
  }

  async registerDrivers({
    name,
    email,
    role,
    phoneNumber,
    plateNumber,
    password,
  }, res) {
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
      return util.sendJson(res, util.Error("Inputs fields cant be empty"), 400)
    } else {
      const driverIdentity = `driver-${plateNumber.trim().split("/").join("")}`;
      // validate matric number
      const plateNumberLength = 6;
      if (
        plateNumber === "" ||
        plateNumber === undefined ||
        plateNumber === null ||
        plateNumber.length > plateNumberLength || plateNumber.length !== plateNumberLength
      ) {
        return util.sendJson(res, util.Error("Invalid Platenumber Provided"), 400);
      }

      if (util.validatePhonenumber(phoneNumber) === false) {
        return util.sendJson(res, util.Error("Phonenumber is invalid"), 400);
      }
      if (util.validateEmail(email) === false) {
        return util.sendJson(res, util.Error("Email is invalid"), 400);
      }

      // check if user with that email already exist

      const queryCheck = `SELECT * FROM "usersTable" WHERE mail = $1`;
      db.query(queryCheck, [email], (err, results) => {
        if (err) {
          return util.sendJson(res, util.Error("Something went wrong registering users"), 400);
        }
        if (results.rowCount > 0) {
          return util.sendJson(res, util.Error("User with that email already exist"), 403);
        }

        // insert into database
        const userId = util.genId();
        const profilePics = util.randomImages(name);
        const date = util.getRelativeTime("hour");

        // at initial state, refreshToken would be empty string ""
        // when user logged In , it gonna be replace by the refreshToken of the user

        const refreshToken = "";

        const query = `INSERT INTO "usersTable"(id, name, mail, password, "usersIdentifier", "profilePics","userRole","refreshToken","createdAt") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
        try {
          db.query(
            query,
            [
              userId,
              name,
              email,
              password,
              driverIdentity,
              profilePics,
              role,
              refreshToken,
              date,
            ],
            (error, result) => {
              if (error) {
                return util.sendJson(res, 
                  util.Error("Something went wrong registering user."), 400
                );
              }
              return util.sendJson(res, {
                msg: "User successfully registered",
                data: result.rows[0],
              }, 200);
            }
          );
        } catch (err) {
          return util.sendJson(res, 
            util.Error("Server Error: Something went wrong registering users"), 500
          );
        }
      });
    }
  }
}

module.exports = new UserAuth();
