const { getManagers } = require('../../../controllers/managers');
const { isUserSuperAdmin } = require('../../../helpers/user-auh');

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

    if (!await isUserSuperAdmin(token, user_id)) {
      return res.status(400)
        .send({
          success: false,
          statusCode: 400,
          message: 'unauthorized',
          data: []
        });
    }

    let managers = await getManagers();

    res.status(200)
      .send({
        success: true,
        statusCode: 200,
        data: managers
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
