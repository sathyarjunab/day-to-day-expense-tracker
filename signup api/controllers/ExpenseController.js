const db = require("../model/expense");

exports.getData = (req, res) => {
  db.findAll()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postData = (req, res) => {
  db.create({
    amount: req.body.amount,
    description: req.body.description,
    category: req.body.category,
  })
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  db.findByPk(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateById = (req, res) => {
  const id = req.params.id;
  db.findByPk(id)
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

exports.deleteById = (req, res) => {
  const id = req.params.id;
  db.findByPk(id)
    .then((res) => {
      res.destroy();
    })
    .then((result) => {
      console.log("deleted");
      res.status(200).send("deleted");
    })
    .catch((err) => {
      console.log(err);
    });
};
