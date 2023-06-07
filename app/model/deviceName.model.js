const sql = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const fs = require("fs");

//Constructor
const deviceName = function (device) {
    this.name = device.name
};

deviceName.create = (newDevice, result) =>{
  sql.query("INSERT INTO deviceName SET ? ", newDevice ,(err,res)=>{
    if(err){
        console.log("Query error: " + err);
        result(err,null);
        return;
    }
   
    console.log("Created device: ", {
        id: res.insertId,
        ...newDevice,
    });
    result(null,{
        id: res.insertId,
        ...newDevice,  
    })
})
}

deviceName.getAllRecords = (result) => {
    sql.query("SELECT * FROM deviceName", (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  };

deviceName.getId = (name, result) =>{
    sql.query("SELECT * FROM deviceName WHERE name = '"+ name +"'", (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        if(res.length){
            console.log("Found device: " + res[0]);
            result(null,res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    })
  }

deviceName.toggleVis = (id, result) => {
    sql.query(
      "UPDATE deviceName SET visibility = !visibility WHERE id=?",id,
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

deviceName.getAllVisible = (result) => {
    sql.query("SELECT * FROM deviceName WHERE visibility = 1", (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  };

deviceName.updateById = (id, data, result) =>{
  sql.query(
    "UPDATE deviceName SET name=? WHERE id=?",
    [data.name, id],
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
      console.log("Updated device name: ", { id: id, ...data });
      result(null, { id: id, ...data });
    }
  );
}

deviceName.deleteById = (id, result) =>{
  sql.query("DELETE FROM deviceName WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted device id: ", id);
    result(null, { id: id });
  });
}

module.exports = deviceName;