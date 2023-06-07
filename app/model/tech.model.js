const sql = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const fs = require("fs");

const Tech = function (tech) {
  this.fullname = tech.fullname;
  this.email = tech.email;
  this.username = tech.username;
  this.password = tech.password;
};

const expireTime = "1h";

Tech.create = (newTech,result) =>{
  sql.query("INSERT INTO technicians SET ? ", newTech, (err,res)=>{
    if(err){
        console.log("Query error: " + err);
        result(err,null);
        return;
    }
    const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
    console.log("Created technician: ", {
        id: res.insertId,
        ...newTech,
        userType: "technician",
        accessToken: token,
        
    });
    result(null,{
        id: res.insertId,
        ...newTech,
        UserType: "technician",
        accessToken: token,
        
    })
})
}

Tech.login = (account, result) => {
  sql.query(
    "SELECT * FROM technicians WHERE username='" + account.username + "'",
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

Tech.getData = (result) => {
  sql.query(
    "SELECT * FROM technicians WHERE 1;",
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Tech.deleteById = (id, result) => {
  sql.query("DELETE FROM  technicians WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted technician id: ", id);
    result(null, { id: id });
  });
};

Tech.toggleVis = (id, result) => {
  sql.query(
    "UPDATE technicians SET visibility = !visibility WHERE id=?",id,
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Tech.updateById = (id, data, result) =>{
  sql.query(
    "UPDATE technicians SET fullname=?, email=?, username=? WHERE id=?",
    [data.fullname, data.email, data.username, id],
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        //this user id not found
        result({ kind: "not_found" }, null);
        //Mistake return so sent more than one response
        return;
      }
      console.log("Updated technician: ", { id: id, ...data });
      result(null, { id: id, ...data });
    }
  );
}

module.exports = Tech;
