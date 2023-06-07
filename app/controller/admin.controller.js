const bcrypt = require('bcryptjs')
const Admin = require('../model/admin.model')

const login = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty.",
      });
    }
  
    const account = new Admin({
        username: req.body.username,
        password: req.body.password
    });
  
    Admin.login(account, (err, data)=>{
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

  module.exports = {login}