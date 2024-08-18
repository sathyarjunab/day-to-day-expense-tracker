const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const loginSignupRoutes = require("./routes/LoginSignupRoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const purchaseRoutes = require("./routes/Purchase");
const premium = require("./routes/PremiumRoutes");
const sequelize = require("./util/DataBase");
const Expense = require("./model/Expense");
const UserCredentials = require("./model/UserCredentials");
const Order = require("./model/Orders");

const app = express();
require("dotenv").config();

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use("/expenses", expenseRoutes);
app.use("/expenses/purchase", purchaseRoutes);
app.use(loginSignupRoutes);
app.use("/expenses/premium", premium);

UserCredentials.hasMany(Expense);
Expense.belongsTo(UserCredentials, { constraints: true, onDelete: "CASCADE" });

UserCredentials.hasMany(Order);
Order.belongsTo(UserCredentials, { constraints: true, onDelete: "CASCADE" });
// { force: true }
sequelize.sync().then((result) => {
  app.listen(3000, () => {
    console.log("connected");
  });
});
