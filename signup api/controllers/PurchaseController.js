const razorpay = require("razorpay");

const tokenGenrator = require("../util/Token");
const Order = require("../model/Orders");

exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderId: order.id, status: "PENDING" })
        .then((result) => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        });
    });
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

exports.updatePremiumUser = (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderId: order_id } })
      .then((order) => {
        order
          .update({ paymentId: payment_id, status: "SUCCESSFUL" })
          .then(() => {
            req.user.update({ isPremium: true }).then(() => {
              return res.status(202).json({
                success: true,
                message: "Transaction Successful",
                token: tokenGenrator(req.user.id, true),
              });
            });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
  }
};
