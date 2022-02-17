const { getClients } = require('../../../controllers/clients');
const { isUserAuthorized } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  let headers = req.headers;
  let token = headers['access-token'];
  let user_id = headers['user-id'];

  if (!isUserAuthorized(token, user_id)) {
    return res.status(401).send('Not authorized');
  }

  let clients = await getClients(user_id);
  res.status(200).json(clients);
}