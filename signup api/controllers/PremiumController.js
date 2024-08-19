const AWS = require("aws-sdk");
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

function uploadFile(fileName, data, res) {
  const bucketName = process.env.BUCKET_NAME;
  const userKeyId = process.env.IAM_USER_KEY;
  const userSecret = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: userKeyId,
    secretAccessKey: userSecret,
  });

  let params = {
    Bucket: bucketName,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
}

exports.fileSender = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const fileName = `Expenses${userId}/${new Date()}.txt`;
    const fileurl1 = await uploadFile(fileName, stringifiedExpenses);
    req.user.createdownloadUrl({
      fileurl: fileurl1,
    });
    res.status(200).json({ fileUrl: fileurl1, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("somthing went wrong");
  }
};
