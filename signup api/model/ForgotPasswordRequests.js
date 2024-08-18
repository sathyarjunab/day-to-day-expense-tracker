const Sequelize = require("sequelize");

const sequelize = require("../util/DataBase");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isactive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequest;
