const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: UUID } = require("uuid");

const ForgotPasswordRequest = require("../model/ForgotPasswordRequests");
const tokenGenrator = require("../util/Token");
const signupCredentials = require("../model/UserCredentials");
const UserCredentials = require("../model/UserCredentials");

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
            isPremium: false,
            totalExpenses: 0,
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
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            throw new Error("somthing went wrong");
          }
          if (result) {
            res.status(201).send({
              message: "logged in successfully",
              token: tokenGenrator(user.id, user.isPremium),
            });
          } else {
            res.status(404).send({
              body: user,
              message: "User not authorized",
            });
          }
        });
      } else {
        res.status(404).send({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.emailSender = async (req, res) => {
  try {
    const defaultClient = Sib.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SBI_API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "sathyarjun007@gmail.com",
    };
    const receivers = [
      {
        email: req.body.Email,
      },
    ];
    const resetTabel = await ForgotPasswordRequest.create({
      uuid: UUID(),
      isactive: true,
    });
    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "recover password",
      htmlContent: `<h1>here is the link to reset you'r password</h1><a href="http://localhost:3000/password/resetpassword/${resetTabel.uuid}">link</a>`,
    });
    res.status(201).send({ message: "email sent" });
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const uuid1 = req.params.uuid;
    const ForgetPasswordUser = await ForgotPasswordRequest.findAll({
      where: {
        uuid: uuid1,
        isactive: true,
      },
    });
    if (ForgetPasswordUser.length === 0) {
      return res.status(404).send("recovery timeout");
    }

    let u = ForgetPasswordUser[0].uuid;
    res.render("PasswordRecovery", { u });
  } catch (err) {
    console.log(err);
  }
};

exports.changesInTabel = async (req, res) => {
  try {
    const password = req.body.password;
    const UUID = req.body.uuid;
    const [userPassword] = await ForgotPasswordRequest.findAll({
      where: { uuid: UUID, isactive: true },
    });
    if (userPassword) {
      await userPassword.update({ isactive: false });
      const user = await UserCredentials.findByPk(userPassword.id);
      bcrypt.hash(password, 10, async (err, hash) => {
        await user.update({ password: hash });
      });
      res.status(201).send("done and dusted");
    } else {
      throw new Error("TIME OUT");
    }
  } catch (err) {
    console.log(err);
  }
};
