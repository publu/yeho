const {
  insertEligibleUsersToSyncQueue
} = require('../../../modules/sync/src/helpers/sync-helpers');

export default async function handler(req, res) {
  let headers = req.headers;
  let tokenHeader = headers['token'];
  let secretHeader = headers['secret'];
  let token = process.env.CRONJOB_TOKEN;
  let secret = process.env.CRONJOB_SECRET;

  if (!tokenHeader || !secretHeader || tokenHeader !== token || secretHeader !== secret) {
    return res.status(401).send('Unauthorized');
  }

  let data = {};
  try {
    data = await insertEligibleUsersToSyncQueue();
  } catch (e) {
    console.log(e);
  }

  res.status(200).json(data);
}
