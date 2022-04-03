const { inviteUser } = require('../../../helpers/invite-user');
const { isUserSuperAdmin } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  try {
    let headers = req.headers;
    let token = headers['access-token'];
    let user_id = headers['user-id'];
    let { email } = req.body;

    if (!token || !user_id) { // preflight check needs 200 OK
      return res.status(200)
        .send({
          success: false,
          statusCode: 200,
          message: '200OK for preflight request',
        });
    }

    if (await isUserSuperAdmin(token, user_id)) {
      const { data, error } = await inviteUser(email);
      if (error) {
        return res.status(400)
          .send({
            success: false,
            statusCode: 400,
            message: error,
          });
      }
    } else {
      return res.status(400)
        .send({
          success: false,
          statusCode: 400,
          message: 'Can\'t invite user'
        });
    }
    return res.status(201)
      .send({
        success: true,
        statusCode: 200,
        data: true,
        message: 'New user invited'
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
