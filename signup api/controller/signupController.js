const { where } = require("sequelize");
const signupCredentials = require("../model/userCredentials");

exports.postSignupCredentials = (req, res) => {
  const { userName, password, email } = req.body;
  signupCredentials
    .findOne({
      where: { email: email },
    })
    .then((result) => {
      if (result) {
        res.status(400).send({ message: "Email already exists" });
      } else {
        const response = signupCredentials.create({
          user_Name: userName,
          password: password,
          email: email,
        });
        res.status(201).send(response);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLoginCredentials = (req, res) => {
  const { email, password } = req.body;
  signupCredentials
    .findOne({
      where: { email: email },
    })
    .then((result) => {
      if (result) {
        signupCredentials
          .findOne({
            where: { password: password },
          })
          .then((result) => {
            if (result) {
              res.status(201).send(result);
            } else {
              res.status(401).send({
                body: result,
                message: "User not authorized",
              });
            }
          });
      } else {
        res.status(404).send({
          body: result,
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
