const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const LoginSignupRoutes = require("./routes/LoginSignupRoutes");
const ExpenseRoutes = require("./routes/ExpenseRoutes");
const sequelize = require("./util/DataBase");
const expense = require("./model/expense");
const userCredentials = require("./model/UserCredentials");

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use("/expenses", ExpenseRoutes);
app.use(LoginSignupRoutes);

userCredentials.hasMany(expense);
expense.belongsTo(userCredentials, { constraints: true, onDelete: "CASCADE" });

sequelize.sync().then((result) => {
  app.listen(3000, () => {
    console.log("connected");
  });
});
