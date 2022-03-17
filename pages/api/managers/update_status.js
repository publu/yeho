const { updateManagerStatus } = require('../../../controllers/managers');
const { isUserSuperAdmin } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  let headers = req.headers;
  let token = headers['access-token'];
  let user_id = headers['user-id'];

  if (!token || !user_id) { // preflight check needs 200 OK
    return res.status(200).send('OK');
  }

  if (!await isUserSuperAdmin(token, user_id)) {
    return res.status(401).send('Not authorized');
  }

  let manager_id = req.body.manager_id;
  let status = req.body.status;

  if (!manager_id) {
    throw new Error('manager_id not suppiled');
  }
  
  let managers = await updateManagerStatus(manager_id, status);
  res.status(200).json(managers);
}