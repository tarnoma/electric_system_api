const bcrypt = require('bcryptjs')
const Request = require('../model/request.model')

const createNewRequest = (req,res) => {
    if(!req.body){
        res.status(400).send({message: "Content cannot be empty"});
    }
    const requestObj = new Request({
        user_id: req.body.user_id,
        device_id: req.body.device_id,
        brand_id: req.body.brand_id,
        requestDate: req.body.requestDate
        
    });
    Request.create(requestObj, (err,data) =>{
        if(err){
            res.status(500).send({
                message: err.message || "Some error has occured while creating"
            });
        }else res.send(data);
    });
};

const getRequestByUser = (req,res)=>{
    Request.getByUserId(req.params.id,(err,data)=>{
        if (err) {
            res.status(500).send({
              message: err.message || "Some error occured while retriveing data.",
            });
          } else res.send(data);
    })
}

const getAllRequest = (req,res)=>{
    Request.getAllRequest((err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occured while retriveing data.",
          });
        } else res.send(data);
      });
}

const getRequestTech = (req,res)=>{
    Request.getRequestTech(req.params.id,(err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occured while retriveing data.",
          });
        } else res.send(data);
      });
}

const updateRequest = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty." });
    }
    const data = {
      fullname: req.body.fullname,
    };
    Request.updateRequest(req.params.id, data, (err, result) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found user id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error update user id: " + req.params.id,
          });
        }
      } else res.send(result);
    });
  };

const finishRequest = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty." });
    }
    const data = {
      price: req.body.price,
      finishDate: req.body.finishDate
    };
    Request.finish(req.params.id, data, (err, result) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found user id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error update user id: " + req.params.id,
          });
        }
      } else res.send(result);
    });
  };

const getAdminDash = (req,res) =>{
    Request.getAdminDash((err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occured while retriveing data.",
          });
        } else res.send(data);
      });
}

const getTechDash = (req,res) =>{
    Request.getTechDash(req.params.id,(err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occured while retriveing data.",
          });
        } else res.send(data);
      });
}


module.exports = {createNewRequest, getRequestByUser,getAllRequest,updateRequest, getRequestTech, finishRequest, getAdminDash, getTechDash}