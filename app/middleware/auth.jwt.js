const jwt = require("jsonwebtoken")
const scKey = require("../config/jwt.config")
const verifyToken = (req, res, next) =>{
    const token = req.headears["x-access-token"];
    if(!token){
        res.status(403).send({
            message: "No token provided"
        })
    }
    jwt.verify(token, scKey, (err,decoded)=>{
        if(err){
            return res.status(401).send({
                message:"Unaothorized."
            })
        }
        req.id = decoded.id
        next();
    })
}

module.exports = verifyToken;