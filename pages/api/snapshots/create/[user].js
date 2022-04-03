const { isWalletAvailable } = require("../../../../helpers/wallet");
const {
  getUserIdFromEmail,
} = require("../../../../helpers/user-auh");

const { sync } = require("../../../../modules/sync/src/index");

export default async function handler(req, res) {
  try {
    let email = req.query.user;

    if (!email) {
      return res.status(401)
        .send({
          success: false,
          statusCode: 401,
          data: [],
          message: 'User email is required'
        });
    }

    let user_id = await getUserIdFromEmail(email);

    if (user_id) {
      if (await isWalletAvailable(user_id)) {
        sync(user_id);
      } else {
        return res.status(401)
          .send({
            success: false,
            statusCode: 401,
            data: [],
            message: 'Wallets not available'
          });
      }
    } else {
      return res.status(401)
        .send({
          success: false,
          statusCode: 401,
          data: [],
          message: 'User doesnot exist'
        });
    }

    return res.status(200)
      .send({
        success: true,
        statusCode: 200,
        data: [],
        message: 'Sync started'
      });
  } catch (error) {
    return res.status(500)
      .send({
        success: false,
        statusCode: 500,
        message: error,
        data: []
      });
  }
}
