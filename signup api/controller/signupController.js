const signupCredentials = require("../model/userCredentials");

exports.postCredentials = (req, res) => {
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
