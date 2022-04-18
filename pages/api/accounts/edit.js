const { updateAccount } = require('../../../controllers/accounts');
const { isUserAuthorized } = require('../../../helpers/user-auh');

const { insertElementToSyncQueue } = require('../../../modules/sync/src/helpers/sync-helpers');

export default async function handler(req, res) {
  try {
    let headers = req.headers;
    let token = headers['access-token'];
    let user_id = headers['user-id'];

    if (!token || !user_id) { // preflight check needs 200 OK
      return res.status(200)
        .send({
          success: false,
          statusCode: 200,
          message: '200OK for preflight request',
        });
    }

    if (!await isUserAuthorized(token, user_id)) {
      return res.status(401)
        .send({
          success: false,
          statusCode: 401,
          message: 'unauthorized',
        });
    }

    let request = req.body;
    const { account_type, nickname, description, account_id } = request.data;
    let data = {};

    if (!account_id) {
      return res.status(400)
        .send({
          success: false,
          statusCode: 400,
          message: 'Bad input. account_id missing.',
        });
    }

    if (nickname)
      data.name = nickname;

    if (description)
      data.description = description;

    if ('cefi' === account_type) {
      const { exchange, apiKey, secretKey } = request.data;

      if (exchange)
        data.cefi_account_provider = exchange;

      if (apiKey)
        data.api_key = apiKey;

      if (secretKey)
        data.api_secret = secretKey;

    } else if ('defi' === account_type) {
      const { address } = request.data;

      if (address)
        data.wallet_address = address;
    }

    await updateAccount(account_id, data);

    // sync user when account address id updated
    if (data.api_key || data.api_secret || data.wallet_address) {
      insertElementToSyncQueue({
        user_id: user_id,
        priority: 2 // high priority
      });
    }

    res.status(200)
      .send({
        success: true,
        statusCode: 200,
      });

  } catch (error) {
    return res.status(500)
      .send({
        success: false,
        statusCode: 500,
        message: error
      });
  }
}