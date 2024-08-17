const jwt = require("jsonwebtoken");

module.exports = (id, isPremium) => {
  return jwt.sign({ id: id, Premium: isPremium }, process.env.SECRET_KEY);
};
