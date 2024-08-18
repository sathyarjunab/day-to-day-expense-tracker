const Expenses = require("../model/Expense");
const Order = require("../model/Orders");
const UserCredentials = require("../model/UserCredentials");
const sequelize = require("../util/DataBase");
let result = [];

exports.leaderBoard = async (req, res, next) => {
  try {
    const leaderBoardOfUsers = await UserCredentials.findAll({
      attributes: [
        "id",
        "user_Name",
        [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
      ],
      include: [
        {
          model: Expenses,
          attributes: [],
        },
      ],
      group: ["userCredentials.id"],
      order: [["total_cost", "DESC"]],
    });
    // const expenses = await Expenses.findAll({
    //   attributes: [
    //     "UserCredentialId",
    //     [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
    //   ],
    //   group: ["UserCredentialId"],
    // });
    res.status(200).json(leaderBoardOfUsers);
  } catch (err) {
    console.log(err);
  }
};
