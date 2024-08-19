const express = require("express");

const controller = require("../controllers/PremiumController");
const auth = require("../middleware/PremiumAuth");
const autherised = require("../middleware/Auth");

const routes = express.Router();

routes.get("/showLeaderBoard", auth.authenticate, controller.leaderBoard);

routes.get("/download", autherised.authenticate, controller.fileSender);

module.exports = routes;
