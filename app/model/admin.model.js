const sql = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const scKey = require ('../config/jwt.config');
const fs = require('fs');

const Admin = function(admin) {
  this.fullname = admin.fullname;
  this.username = admin.username;
  this.password = admin.password;
}

const expireTime = '1h';

Admin.login = (account, result) => {
    sql.query(
      "SELECT * FROM admins WHERE username='" + account.username + "'",
      (err, res) => {
        if (err) {
          console.log("Query error: " + err);
          result(err, null);
          return;
        }
        if (res.length) {
          const validPassword = account.password == res[0].password
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

module.exports = Admin;