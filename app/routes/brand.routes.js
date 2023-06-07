// const authJWT = require("../middleware/auth.jwt")
module.exports = (app) =>{
    const brand_controller = require('../controller/brand.controller')
    var router = require('express').Router();
    router.post("/brand/create",brand_controller.createNewBrand);
    router.get("/brand/getall", brand_controller.getAllBrand);
    router.get("/brand/getallVis", brand_controller.getAllVis);
    router.post("/brand/toggleVis/:id", brand_controller.toggleVis)
    router.put("/brand/update/:id", brand_controller.updateBrand);
    router.get("/brand/getId/:name", brand_controller.getBrandId)
    router.delete("/brand/remove/:id",  brand_controller.deleteById);
    app.use("/api/auth", router);
}