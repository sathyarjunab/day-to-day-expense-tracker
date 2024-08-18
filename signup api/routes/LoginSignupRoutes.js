const express = require("express");

const constroller = require("../controllers/SignupController");

const routes = express.Router();

routes.post("/signup", constroller.postSignupCredentials);

routes.post("/login", constroller.postLoginCredentials);

routes.post("/password/forgotpassword", constroller.emailSender);

routes.get("/password/resetpassword/:uuid", constroller.resetPassword);

routes.post("/recoverPassword", constroller.changesInTabel);

module.exports = routes;
