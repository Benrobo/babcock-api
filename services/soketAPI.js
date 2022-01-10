const res = require("express/lib/response");
const db = require("../model/db");
const util = require("../util/index");

class Socket {
  constructor(io) {
    if (io == "" || io == undefined || io == null) {
      throw Error("Socket.io requires an io instance");
    }
    this.io = io;
  }

  error(io, msg) {
    return io.emit("error", { msg });
  }

  mainSocketConnection() {
    let io = this.io;
    io.on("connection", (socket) => {
      // emit msg

      //   check for student_ride_request
      socket.on("student_ride_request", (data) => {
        const { from, to, userId, role } = data;

        // check if the userId and role match in database
        let sql = `SELECT * FROM "usersTable" WHERE id=$1 AND "userRole"=$2`;
        try {
          db.query(sql, [userId, role], (err, results) => {
            if (err) {
              // emit error
              console.log(err);
              return this.error(io, err.message);
            }

            // check if user exist
            if (results.rowCount === 0) {
              return this.error(
                io,
                "ride request failed, user with thast id doesnt exist"
              );
            }

            // check for drivers online
            const status = "on";
            const dRole = "driver";
            const sql2 = `SELECT * FROM "usersTable" WHERE "userRole"=$1 AND "status"=$2`;
            db.query(sql2, [dRole, status], (err, results) => {
              if (err) {
                // emit error
                return this.error(io, err.message);
              }

              const rand = Math.floor(Math.random() * results.rows.length);
              let data = results.rows[rand];

              console.log(rand, data);

              io.emit("available-driver", data);
            });
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
}

module.exports = {
  Socket,
};
