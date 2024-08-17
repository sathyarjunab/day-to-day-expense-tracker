const jwt = require("jsonwebtoken");
const UserCredentials = require("../model/UserCredentials");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("authorization");
    const user = jwt.verify(token, process.env.SECRET_KEY);
    UserCredentials.findByPk(user.id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};
