const bcrypt = require("bcryptjs");
const brands = require("../model/brand.model");

const createNewBrand = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  }
  const brandObj = new brands({
    brandName: req.body.brandName,
  });
  brands.create(brandObj, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error has occured while creating",
      });
    } else res.send(data);
  });
};

const getAllBrand = (req, res) => {
    brands.getAllRecords((err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occured while retriveing data.",
        });
      } else res.send(data);
    });
  };

const getBrandId = (req,res)=>{
    brands.getId(req.params.name, (err,data) =>{
        if(err){
            if(err.kind = "not_found"){
                res.send({
                    message: "Not found " + req.params.name,
                    valid: true,
                })
            }else{
                res.status(500).send({message: "Error retrieving " + req.params.name})
            }
        }else res.send({id: data.id});
    })
  }

const getAllVis = (req, res) => {
    brands.getAllVis((err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occured while retriveing data.",
        });
      } else res.send(data);
    });
  };

const updateBrand = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty." });
    }
    const data = {
      brandName: req.body.brandName,
    };
    brands.updateById(req.params.id, data, (err, result) => {
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

const toggleVis = (req, res) => {
    brands.toggleVis(req.params.id, (err, result) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found brand id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error delete brand id: " + req.params.id,
          });
        }
      } else res.send(result);
    });
  };

const deleteById = (req, res) => {
    brands.deleteById(req.params.id, (err, result) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found device id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error delete device id: " + req.params.id,
          });
        }
      } else res.send(result);
    });
  };

module.exports = {getAllBrand, getBrandId, getAllVis, toggleVis, createNewBrand, updateBrand,deleteById}