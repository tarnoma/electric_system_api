const bcrypt = require('bcryptjs')
const User = require('../model/user.model')

const createNewUser = (req,res) => {
    if(!req.body){
        res.status(400).send({message: "Content cannot be empty"});
    }
    const salt = bcrypt.genSaltSync(10);
    const userObj = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt),
        
    });
    User.create(userObj, (err,data) =>{
        if(err){
            res.status(500).send({
                message: err.message || "Some error has occured while creating"
            });
        }else res.send(data);
    });
};

const validUsername = (req,res) =>{
    User.checkUsername(req.params.us, (err,data) =>{
        if(err){
            if(err.kind = "not_found"){
                res.send({
                    message: "Not found " + req.params.us,
                    valid: true,
                })
            }else{
                res.status(500).send({message: "Error retrieving " + req.params.us})
            }
        }else res.send({record: data, valid: false});
    })
}

const login = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty.",
      });
    }
  
    const account = new User({
        username: req.body.username,
        password: req.body.password
    });
  
    User.login(account, (err, data)=>{
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

module.exports = {createNewUser, validUsername, login}