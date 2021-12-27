require("dotenv").config()
const {Pool} = require("pg");


const conn = new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PWD,

})


module.exports =  conn;