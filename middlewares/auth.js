const jwt = require("jsonwebtoken")

function checkAuth(req, res, next){
    let tokens = req.headers["authorization"];
    
    if(!tokens){
        return res.status(400).json({msg: "Authorization header is required"})
    }
    try {
        let bearer = tokens.split(" ")[1];
        let decode = jwt.verify(bearer, process.env.JWT_REFRESH_SECRET)

        req.user = decode;
        next()
    } catch (e) {
        console.log(e)
        return res.status(400).json({msg: "Invalid token"})
    }
}

module.exports = {
    checkAuth
}