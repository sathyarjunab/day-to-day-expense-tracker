const Sequelize = require("sequelize");

const sequelize = require("../util/DataBase");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: Sequelize.STRING,
  status: Sequelize.STRING,
  paymentId: Sequelize.STRING,
});

module.exports = Order;
