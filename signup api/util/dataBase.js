const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "expense-tracker",
  "root",
  process.env.DATA_BASE_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
