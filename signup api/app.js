const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const routes = require("./routes/route");
const sequelize = require("./util/dataBase");

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use(routes);

sequelize.sync().then((result) => {
  app.listen(3000, () => {
    console.log("connected");
  });
});
