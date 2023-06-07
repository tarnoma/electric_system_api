const sql = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const scKey = require ('../config/jwt.config');
const fs = require('fs');

const Request = function(request) {
  this.user_id = request.user_id;
  this.device_id = request.device_id;
  this.brand_id = request.brand_id
  this.requestDate = request.requestDate;
}

Request.create = (newRequest, result) =>{
    sql.query("INSERT INTO request SET ? ", newRequest, (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        console.log("Created request: ", {
            id: res.insertId,
            ...newRequest,
        });
        result(null,{
            id: res.insertId,
            ...newRequest,
            
        })
    })
    
}

Request.getByUserId = (id,result) =>{
    sql.query(`SELECT r.id, r.requestDate, d.name, b.brandName, r.price,r.status FROM request r inner join deviceName d
    on r.device_id = d.id 
    inner join deviceBrand b
    on r.brand_id = b.id
    where r.user_id = ?`, id, (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
};

Request.getAllRequest = (result) =>{
    sql.query(`SELECT r.id, u.username, r.finishDate, r.requestDate, d.name, b.brandName, r.status, r.tech_id FROM request r inner join deviceName d
    on r.device_id = d.id 
    inner join deviceBrand b
    on r.brand_id = b.id
    inner join users u
    on r.user_id = u.id
    where 1;`, (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
}

Request.getRequestTech = (id,result) =>{
    sql.query(`SELECT r.id, r.price, u.username, r.finishDate, r.requestDate, d.name, b.brandName, r.status, r.tech_id FROM request r inner join deviceName d
    on r.device_id = d.id 
    inner join deviceBrand b
    on r.brand_id = b.id
    inner join users u
    on r.user_id = u.id
    where tech_id = ?`, id, (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
}

Request.updateRequest = (id,data, result) =>{
    sql.query(`UPDATE request SET tech_id = (SELECT id from technicians WHERE fullname = ?), status = 'In-process' WHERE id = ? ;`,[data.fullname, id], (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
}

Request.finish = (id,data,result) =>{
    sql.query(`UPDATE request SET price = ?, status = 'Finished', finishDate = ? WHERE id = ?;`,[data.price,data.finishDate, id], (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
}

Request.getAdminDash = (result) =>{
    sql.query(`SELECT count(id) as totalRequest, (SELECT count(requestDate) from request where requestDate = CURRENT_DATE) as requestToday ,
    (SELECT count(status) from request where status = 'Pending') as pending,
    (SELECT count(status) from request where status = 'In-process') as in_process,
    (SELECT count(status) from request where status = 'Finished') as finished FROM request WHERE 1;`, (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
}

Request.getTechDash = (id,result) =>{
    sql.query(`SELECT count(id) as totalRequest,
    (SELECT count(status) from request where status = 'In-process' and tech_id = ?) as totalInProcess,
    (SELECT count(status) from request where status = 'Finished' and tech_id = ?) as totalFinished,
    (SELECT count(status) FROM request where status = 'In-process' and tech_id = ? AND requestDate = CURRENT_DATE) as todayInProcess,
    (SELECT count(status) FROM request where status = 'Finished' and tech_id = ? AND finishDate = CURRENT_DATE) as todayFinished
    FROM request WHERE 1;`,[id,id,id,id], (err,res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err,null);
            return;
        }
        result(null,res)
    })
}

module.exports = Request