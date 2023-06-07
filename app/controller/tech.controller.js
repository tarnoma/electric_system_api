const bcrypt = require('bcryptjs')
const Tech = require('../model/tech.model')

const createNewTech = (req,res) => {
  if(!req.body){
      res.status(400).send({message: "Content cannot be empty"});
  }
  const salt = bcrypt.genSaltSync(10);
  const userObj = new Tech({
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, salt),
      
  });
  Tech.create(userObj, (err,data) =>{
      if(err){
          res.status(500).send({
              message: err.message || "Some error has occured while creating"
          });
      }else res.send(data);
  });
};

const login = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty.",
      });
    }
  
    const account = new Tech({
        username: req.body.username,
        password: req.body.password
    });
  
    Tech.login(account, (err, data)=>{
        if(err){
          if(err.kind == "not_found"){
              res.status(401).send({
                  message: "Not found " + req.body.username
              });
          } else if (err.kind == "invalid_pass"){
              res.status(401).send({
                  message: "Invalid Password"
              });
          } else{
              res.status(500).send({
                  message: "Error retriveing " + req.body.username
              });
          }
        }else res.send(data);
    });
  };

const getAllTech = (req,res)=>{
    Tech.getData((err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occured while retriveing data.",
          });
        } else res.send(data);
      });
}

const deleteById = (req,res) =>{
  Tech.deleteById(req.params.id, (err, result)=>{
    if(err){
      if(err.kind == "not_found"){
        res.status(401).send({
          message: "Not found technician id: " + req.params.id
        });
      }else{
        res.status(500).send({
          message: "Error delete device id: " + req.params.id
        });
      }
    }
    else res.send(result);
  });
}

const toggleVis = (req,res) =>{
  Tech.toggleVis(req.params.id, (err, result)=>{
    if(err){
      if(err.kind == "not_found"){
        res.status(401).send({
          message: "Not found technician id: " + req.params.id
        });
      }else{
        res.status(500).send({
          message: "Error delete user id: " + req.params.id
        });
      }
    }
    else res.send(result);
  });
}

const updateTech = (req, res) =>{
  if(!req.body){
    res.status(400).send({ message: "Content can not be empty."});
  }
  const data = {
    fullname: req.body.fullname,
    email: req.body.email,
    username: req.body.username
  };
  Tech.updateById(req.params.id, data, (err, result)=>{
    if(err){
      if(err.kind == "not_found"){
        res.status(401).send({
          message: "Not found user id: " + req.params.id
        });
      } else{
        res.status(500).send({
          message: "Error update user id: " + req.params.id
        });
      }
    } else res.send(result);
  });
};

module.exports = {login, getAllTech, deleteById, toggleVis, createNewTech, updateTech}