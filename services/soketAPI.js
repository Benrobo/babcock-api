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
      socket.on("ride-cancel", (data) => {
        io.to(data.id).emit("ride-cancel", data);
      });

      socket.on("no-respond", (data) => {
        io.to(data.id).emit("ride-cancel", data);
      });

      socket.on("ride-accepted", (data) => {
        if (data) {
          const { studentSocketId, driverSocketId, driverId, driverRole } =
            data;

          // get driver details from db
          // console.log(data);
          // return;

          const sql = `SELECT * FROM "usersTable" WHERE id=$1 AND "userRole"=$2`;
          db.query(sql, [driverId, driverRole], (err, res) => {
            if (err) {
              // emit error
              console.log(err);
              return io.to(studentSocketId).emit("ride-accepted", {
                error: err,
              });
            }

            if (res.rowCount === 0) {
              io.to(studentSocketId).emit("ride-accepted", {
                msg: "No driver found",
              });
            }

            const data = {
              img: res.rows[0].profilePics,
              name: res.rows[0].name,
              phoneNumber: res.rows[0].phoneNumber,
              driverSocketId,
            };

            io.to(studentSocketId).emit("ride-accepted", data);
          });
          return;
        }
        io.to(data.studentSocketId).emit("ride-accepted", {
          error: "drivers data not found in 'ride-accepted socket'",
        });
      });

      socket.on("student_ride_request", (clientData) => {
        const { from, to, userId, role } = clientData;

        // check if the userId and role match in database
        let sql = `SELECT * FROM "usersTable" WHERE id=$1 AND "userRole"=$2`;
        try {
          db.query(sql, [userId, role], (err, studentRes) => {
            if (err) {
              // emit error
              console.log(err);
              return this.error(io, err.message);
            }

            // check if user exist
            if (studentRes.rowCount === 0) {
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
              let driverInfo = results.rows[rand];
              const randId = util.genId();

              // emit this event to drivers
              socket.broadcast.emit("users-request", {
                clientData,
                user: {
                  img: studentRes.rows[0].profilePics,
                  role: studentRes.rows[0].userRole,
                  id: studentRes.rows[0].id,
                },
              });

              // insert driver and suser id into the trips table
              return;
              const sql3 = `INSERT INTO trips("id","studentId", "driverId","from","to") VALUES($1,$2,$3,$4,$5)`;
              db.query(
                sql3,
                [randId, userId, driverInfo.id, from, to],
                (err) => {
                  if (err) {
                    // emit error
                    console.log(err);
                    return this.error(io, err.message);
                  }
                  console.log("message recieved");
                  socket.broadcast.emit("available-driver", data);
                }
              );
            });
          });
        } catch (err) {
          console.log(err);
        }
      });

      // check for driver request
      // socket.on("driver")
    });
  }
}

module.exports = {
  Socket,
};
