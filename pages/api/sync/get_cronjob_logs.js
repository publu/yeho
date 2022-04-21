const { isUserAuthorized } = require('../../../helpers/user-auh');
const { getCronJobLogs } = require('../../../controllers/cronjob');

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

    let logs = await getCronJobLogs();

    return res.status(200)
      .json({
        success: true,
        statusCode: 200,
        message: 'OK',
        data: logs
      });

  } catch (error) {
    return res.status(500)
      .json({
        success: false,
        statusCode: 500,
        message: error
      });
  }
}
