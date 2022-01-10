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

  mainSocketConnection() {
    let io = this.io;
    io.on("connection", (socket) => {
      // emit msg

      //   check for student_ride_request
      socket.on("student_ride_request", (data) => {
        console.log(data);
      });
    });
  }
}

module.exports = {
  Socket,
};
