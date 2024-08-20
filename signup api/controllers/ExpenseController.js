const Expense = require("../model/Expense");
const sequelize = require("../util/DataBase");

exports.getData = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const totalItems = await req.user.countExpenses();
    const result = await req.user.getExpenses({
      offset: offset,
      limit: limit,
    });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).send({
      res: result,
      premium: req.user.isPremium,
      totalPages: totalPages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.postData = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    req.user
      .createExpense(
        {
          amount: req.body.amount,
          description: req.body.description,
          category: req.body.category,
        },
        {
          transaction: t,
        }
      )
      .then((result) => {
        let sum = req.user.totalExpenses + Number(req.body.amount);
        req.user
          .update(
            {
              totalExpenses: sum,
            },
            {
              transaction: t,
            }
          )
          .then(async () => {
            await t.commit();
            res.status(201).send(result);
          });
      })
      .catch(async (err) => {
        await t.rollback();
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getById = (req, res) => {
  const id = req.params.id;
  Expense.findByPk(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateById = (req, res) => {
  const id = req.params.id;
  Expense.findByPk(id)
    .then((result) => {
      result.amount = req.body.amount;
      result.description = req.body.description;
      result.category = req.body.category;
      result.save();
    })
    .then((result) => {
      console.log("updated");
      res.status(201).send("done");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteById = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    const id = req.params.id;
    let Exp = await Expense.findByPk(id);
    let sum = req.user.totalExpenses - Number(Exp.amount);
    let updatedUser = await req.user.update(
      {
        totalExpenses: sum,
      },
      { transaction: t }
    );
    Exp.destroy();
    console.log("deleted");
    await t.commit();
    res.status(200).send("deleted");
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
