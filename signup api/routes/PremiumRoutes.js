const express = require("express");

const controller = require("../controllers/PremiumController");
const auth = require("../middleware/PremiumAuth");

const routes = express.Router();

routes.get("/showLeaderBoard", auth.authenticate, controller.leaderBoard);

module.exports = routes;
