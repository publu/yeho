const { isUserAuthorized, isUserSuperAdmin, getUser } = require('../../../helpers/user-auh');

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

    let role = { role: 'authenticated', status: true };

    let user = await getUser(token, user_id);
    if (user) {
      role = { role: user.role, status: user.status };
    }

    res.status(200)
      .send({
        success: true,
        statusCode: 200,
        data: role
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
