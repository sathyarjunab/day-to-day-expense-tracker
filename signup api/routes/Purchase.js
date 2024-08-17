const express = require("express");

const auth = require("../middleware/Auth");
const controller = require("../controllers/PurchaseController");
routes = express.Router();

routes.get("/premiummembership", auth.authenticate, controller.purchasePremium);

routes.post(
  "/updatetransactionstatus",
  auth.authenticate,
  controller.updatePremiumUser
);

module.exports = routes;
