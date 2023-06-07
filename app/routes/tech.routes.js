// const authJWT = require('../middleware/auth.jwt')
module.exports = (app) =>{
    const tech_controller = require('../controller/tech.controller')
    var router = require('express').Router();
    router.post("/tech/signup",tech_controller.createNewTech);
    router.post("/tech/login", tech_controller.login);
    router.get("/tech/getall", tech_controller.getAllTech)
    router.post("/tech/toggleVis/:id", tech_controller.toggleVis)
    router.put("/tech/update/:id", tech_controller.updateTech);
    router.delete("/tech/remove/:id",  tech_controller.deleteById);
    app.use("/api/auth", router);
}