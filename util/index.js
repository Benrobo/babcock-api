const {v4: uuid} = require("uuid");
const moment = require("moment")
const jwt = require("jsonwebtoken")

const accessSecret = process.env.JWT_REFRESH_SECRET
const refreshSecret = process.env.JWT_Acess_SECRET

class Util{

    Error(msg){
        return new Error(msg)
    }

    genId(){
        const id = uuid();
        return id; 
    }

    getRelativeTime(format){
        let validFormats = ["day", "hour"]
        if(format === undefined){
            return moment().format()
        }
        if(typeof format === Number){
            return this.Error("Type Error: invalid date format")
        }
        if(!validFormats.includes(format)){
            return moment().startOf(validFormats[1]).fromNow()
        }
        
        return moment().startOf(format).fromNow()
    }

    genAccessToken(payload){
        if(payload === "" || payload === undefined){
            return this.Error("Access token requires a payload field but got none")
        }

        return jwt.sign(payload, accessSecret, { expiresIn: "7min"})
    }

    genRefreshToken(payload){
        if(payload === "" || payload === undefined){
            return this.Error("Refresh token requires a payload field but got none")
        }
        return jwt.sign(payload, refreshSecret, { expiresIn: "1yr"})
    }

    validatePhonenumber(phoneNumber){
        if (!phoneNumber) return false;
        const regexp = /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/;
        return regexp.test(phoneNumber);
    }

    validateEmail(email){
        const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!email) return false;

        let emailParts = email.split('@');

        if(emailParts.length !== 2) return false

        let account = emailParts[0];
        let address = emailParts[1];

        if(account.length > 64) return false

        else if(address.length > 255) return false

        let domainParts = address.split('.');
        if (domainParts.some(function (part) {
            return part.length > 63;
        })) return false;


        if (!tester.test(email)) return false;

        return true;
    }

    randomImages(seeds){
        return `https://avatars.dicebear.com/api/initials/${seeds}.svg`
    }

    sendJson(res, payload={msg: "payload is empty"},code){
        if(!res){
            return this.Error("Rresponse object is required")
        }
        return res.status(code).json(payload)
    }
}

class Error{
    constructor(msg){
        this.msg = msg;
        this.name = "Error"
    }
}


module.exports = new Util()