const sql = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const scKey = require ('../config/jwt.config');
const fs = require('fs');

const User = function(user) {
  this.fullname = user.fullname;
  this.email = user.email;
  this.username = user.username;
  this.password = user.password;
}

const expireTime = '1h';

User.create = (newUser, result) =>{
    sql.query("INSERT INTO users SET ? ", newUser, (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
        console.log("Created user: ", {
            id: res.insertId,
            ...newUser,
            userType: "user",
            accessToken: token,
            
        });
        result(null,{
            id: res.insertId,
            ...newUser,
            userType: "user",
            accessToken: token,
            
        })
    })
    
}

User.checkUsername = (username, result) =>{
    sql.query("SELECT u.username FROM users u where u.username = '"+ username +  "' union SELECT t.username from technicians t where t.username = '"+ username +  "'union SELECT a.username from admins a where a.username = '"+ username +  "' ", (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        if(res.length){
            console.log("Found username: " + res[0]);
            result(null,res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

User.login = (account, result) => {
    sql.query(
      "SELECT * FROM users WHERE username='" + account.username + "'",
      (err, res) => {
        if (err) {
          console.log("Query error: " + err);
          result(err, null);
          return;
        }
        if (res.length) {
          const validPassword = bcrypt.compareSync(
            account.password,
            res[0].password
          );
          if (validPassword) {
            const token = jwt.sign({ id: res.insertId }, scKey.secret, {
              expiresIn: expireTime,
            });
            console.log("Login success. Token was generated: " + token);
            res[0].accessToken = token;
            result(null, res[0]);
            return;
          } else {
            console.log("Password invalid.");
            result({ kind: "invalid_pass" }, null);
            return;
          }
        }
        result({ kind: "not_found" }, null);
      }
    );
  };

module.exports = User;

