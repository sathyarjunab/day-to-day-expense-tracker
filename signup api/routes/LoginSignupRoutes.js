const express = require("express");

const constroller = require("../controllers/SignupController");

const routes = express.Router();

routes.post("/signup", constroller.postSignupCredentials);

routes.post("/login", constroller.postLoginCredentials);

module.exports = routes;
