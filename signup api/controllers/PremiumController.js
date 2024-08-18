const UserCredentials = require("../model/UserCredentials");
let result = [];

exports.leaderBoard = async (req, res, next) => {
  try {
    // const leaderBoardOfUsers = await UserCredentials.findAll({
    //   attributes: [
    //     "id",
    //     "user_Name",
    //     [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
    //   ],
    //   include: [
    //     {
    //       model: Expenses,
    //       attributes: [],
    //     },
    //   ],
    //   group: ["userCredentials.id"],
    //   order: [["total_cost", "DESC"]],
    // });
    // const expenses = await Expenses.findAll({
    //   attributes: [
    //     "UserCredentialId",
    //     [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
    //   ],
    //   group: ["UserCredentialId"],
    // });
    result = await UserCredentials.findAll({
      attributes: ["user_Name", "totalExpenses"],
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};
