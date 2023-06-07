const sql = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const fs = require("fs");

//Constructor
const brands = function (brand) {
    this.brandName = brand.brandName
};

brands.create = (newBrand, result) =>{
  sql.query("INSERT INTO deviceBrand SET ? ", newBrand ,(err,res)=>{
    if(err){
        console.log("Query error: " + err);
        result(err,null);
        return;
    }
    console.log("Created brand: ", {
        id: res.insertId,
        ...newBrand,
    });
    result(null,{
        id: res.insertId,
        ...newBrand,  
    })
})
}

brands.getAllRecords = (result) => {
    sql.query("SELECT * FROM deviceBrand", (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  };

brands.getId = (name, result) =>{
    sql.query("SELECT * FROM deviceBrand WHERE brandName = '"+ name +"'", (err,res)=>{
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

brands.getAllVis = (result) => {
    sql.query("SELECT * FROM deviceBrand WHERE visibility = 1", (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  };

brands.updateById = (id, data, result) =>{
    sql.query(
      "UPDATE deviceBrand SET brandName=? WHERE id=?",
      [data.brandName, id],
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
        console.log("Updated brand name: ", { id: id, ...data });
        result(null, { id: id, ...data });
      }
    );
  }

brands.toggleVis = (id, result) => {
    sql.query(
      "UPDATE deviceBrand SET visibility = !visibility WHERE id=?",id,
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

brands.deleteById = (id, result) =>{
    sql.query("DELETE FROM deviceBrand WHERE id = ?", id, (err, res) => {
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

module.exports = brands;