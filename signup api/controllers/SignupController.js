const bcrypt = require("bcrypt");
const signupCredentials = require("../model/UserCredentials");

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
        bcrypt.hash(password, 10, (err, hash) => {
          const response = signupCredentials.create({
            user_Name: userName,
            password: hash,
            email: email,
          });
          res.status(201).send(response);
        });
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
        bcrypt.compare(password, result.password, (err, result) => {
          if (err) {
            throw new Error("somthing went wrong");
          }
          if (result) {
            res.status(201).send(result);
          } else {
            res.status(404).send({
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
