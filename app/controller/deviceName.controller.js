const bcrypt = require("bcryptjs");
const deviceName = require("../model/deviceName.model");

const createNewDevice = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  }
  const deviceObj = new deviceName({
    name: req.body.name,
  });
  deviceName.create(deviceObj, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error has occured while creating",
      });
    } else res.send(data);
  });
};

const getAllDevice = (req, res) => {
  deviceName.getAllRecords((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while retriveing data.",
      });
    } else res.send(data);
  });
};

const getDeviceId = (req, res) => {
  deviceName.getId(req.params.name, (err, data) => {
    if (err) {
      if ((err.kind = "not_found")) {
        res.send({
          message: "Not found " + req.params.name,
          valid: true,
        });
      } else {
        res
          .status(500)
          .send({ message: "Error retrieving " + req.params.name });
      }
    } else res.send({ id: data.id });
  });
};

const toggleVis = (req, res) => {
  deviceName.toggleVis(req.params.id, (err, result) => {
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

const getAllVisible = (req, res) => {
  deviceName.getAllVisible((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while retriveing data.",
      });
    } else res.send(data);
  });
};

const updateDevice = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const data = {
    name: req.body.name,
  };
  deviceName.updateById(req.params.id, data, (err, result) => {
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

const deleteById = (req, res) => {
  deviceName.deleteById(req.params.id, (err, result) => {
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

module.exports = {
  getAllDevice,
  getDeviceId,
  toggleVis,
  getAllVisible,
  updateDevice,
  deleteById,
  createNewDevice
};
