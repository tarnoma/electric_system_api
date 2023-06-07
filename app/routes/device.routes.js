const authJWT = require("../middleware/auth.jwt")
module.exports = (app) =>{
    const device_controller = require('../controller/deviceName.controller')
    var router = require('express').Router();
    router.post("/device/create",device_controller.createNewDevice);
    router.get("/device/getall", device_controller.getAllDevice);
    router.get("/device/getallVis", device_controller.getAllVisible);
    router.post("/device/toggleVis/:id", device_controller.toggleVis)
    router.put("/device/update/:id", device_controller.updateDevice);
    router.get("/device/getId/:name", device_controller.getDeviceId)
    router.delete("/device/remove/:id",  device_controller.deleteById);
    app.use("/api/auth", router);
}