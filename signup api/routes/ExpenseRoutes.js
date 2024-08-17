const express = require("express");

const auth = require("../middleware/Auth");
const controller = require("../controllers/ExpenseController");

const route = express.Router();

route.get("/", auth.authenticate, controller.getData);

route.post("/", auth.authenticate, controller.postData);

route.get("/:id", controller.getById);

route.put("/:id", controller.updateById);

route.delete("/:id", controller.deleteById);

module.exports = route;
