// const authJWT = require('../middleware/auth.jwt')
module.exports = (app) =>{
    const admin_controller = require('../controller/admin.controller')
    var router = require('express').Router();
    router.post("/admin/login", admin_controller.login);
    app.use("/api/auth", router);
}