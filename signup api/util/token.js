const jwt = require("jsonwebtoken");

module.exports = (id) => {
  return jwt.sign({ id: id }, "secratekeymyboy");
};
