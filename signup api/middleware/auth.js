const jwt = require("jsonwebtoken");
const UserCredentials = require("../model/UserCredentials");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("authorization");
    console.log(token);
    const userId = jwt.verify(token, "secratekeymyboy");
    UserCredentials.findByPk(userId.id)
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
