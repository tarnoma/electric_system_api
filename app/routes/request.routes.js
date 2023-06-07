// const authJWT = require("../middleware/auth.jwt")
module.exports = (app) =>{
    const request_controller = require('../controller/request.controller')
    var router = require('express').Router();
    router.post("/request/create", request_controller.createNewRequest);
    router.get("/request/get/:id", request_controller.getRequestByUser);
    router.get("/request/getAll", request_controller.getAllRequest);
    router.get("/request/getAdDash", request_controller.getAdminDash);
    router.get("/request/getTechDash/:id", request_controller.getTechDash);
    router.get("/request/getTech/:id", request_controller.getRequestTech);
    router.put("/request/update/:id", request_controller.updateRequest);
    router.put("/request/finish/:id", request_controller.finishRequest);
    app.use("/api/auth", router);
}