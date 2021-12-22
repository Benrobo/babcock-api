const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path")

const app = express();

// main middlewares
app.use(cors())
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded());

// routes middleware

app.get("/", (req, res)=>{
    let sendData = []
    // read the package.json file
    fs.readFile(path.join(__dirname, "/package.json"), (err, data)=>{
        if(err){
            return req.status(400).json(err)
        }
        let file = JSON.parse(data);

        sendData.push(file);

        return res.status(200).json(sendData)
    })
})


// listen on a htp port to run and start the server
const PORT = process.env.PORT || 5000
app.listen(PORT);