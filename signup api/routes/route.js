const express = require("express");

const constroller = require("../controller/signupController");

const routes = express.Router();

routes.post("/signup", constroller.postCredentials);

module.exports = routes;
