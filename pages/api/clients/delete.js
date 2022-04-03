const { deleteClients } = require('../../../controllers/clients');
const { isUserAuthorized } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  try {
    let headers = req.headers;
    let token = headers['access-token'];
    let user_id = headers['user-id'];

    if (!token || !user_id) { // preflight check needs 200 OK
      return res
        .status(200)
        .send({
          success: false,
          statusCode: 200,
          message: '200OK for preflight request',
          data: []
        });
    }

    if (!await isUserAuthorized(token, user_id)) {
      return res.status(401)
        .send({
          success: false,
          statusCode: 401,
          message: 'unauthorized',
          data: []
        });
    }

    let account_data = req.body.ids;
    if (!account_data) {
      throw new Error('account_data not suppiled');
    }

    let clients = await deleteClients(user_id, account_data);
    
    res.status(200)
      .send({
        success: true,
        statusCode: 200,
        data: clients
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