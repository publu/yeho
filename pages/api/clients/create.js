const { saveClient } = require('../../../controllers/clients');
const { isUserAuthorized } = require('../../../helpers/user-auh');

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

    let request = req.body;
    let client_data = {};

    client_data.user_id = user_id;
    client_data.first_name = request.name;
    client_data.last_name = request.lastName;
    client_data.deposit = request.deposit;
    client_data.email = request.email;
    client_data.contact = request.number;
    client_data.location = request.location;
    client_data.description = request.description;

    let clients = await saveClient(user_id, client_data);
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