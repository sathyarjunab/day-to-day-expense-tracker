const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");

const loginSignupRoutes = require("./routes/LoginSignupRoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const purchaseRoutes = require("./routes/Purchase");
const premium = require("./routes/PremiumRoutes");
const sequelize = require("./util/DataBase");
const ForgotPasswordRequest = require("./model/ForgotPasswordRequests");
const Expense = require("./model/Expense");
const UserCredentials = require("./model/UserCredentials");
const Order = require("./model/Orders");
const downloadUrl = require("./model/downloadUrl");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./", "views"));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/expenses", expenseRoutes);
app.use("/expenses/purchase", purchaseRoutes);
app.use(loginSignupRoutes);
app.use("/expenses/premium", premium);

UserCredentials.hasMany(Expense);
Expense.belongsTo(UserCredentials, { constraints: true, onDelete: "CASCADE" });

UserCredentials.hasMany(Order);
Order.belongsTo(UserCredentials, { constraints: true, onDelete: "CASCADE" });

UserCredentials.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(UserCredentials, {
  constraints: true,
  onDelete: "CASCADE",
});

UserCredentials.hasMany(downloadUrl);
downloadUrl.belongsTo(UserCredentials, {
  constraints: true,
  onDelete: "CASCADE",
});

// { force: true }
sequelize.sync().then((result) => {
  app.listen(3000, () => {
    console.log("connected");
  });
});
