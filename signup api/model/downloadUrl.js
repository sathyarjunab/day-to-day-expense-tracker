const Sequelize = require("sequelize");

const sequelize = require("../util/DataBase");

const downloadUrl = sequelize.define("downloadUrl", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  fileurl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = downloadUrl;
