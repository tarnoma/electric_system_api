const authJWT = require('../middleware/auth.jwt')
module.exports = (app) =>{
    const user_controller = require('../controller/user.controller')
    var router = require('express').Router();
    router.post("/signup",user_controller.createNewUser);
    router.get("/:us", user_controller.validUsername);
    router.post("/login", user_controller.login);
    app.use("/api/auth", router);
}