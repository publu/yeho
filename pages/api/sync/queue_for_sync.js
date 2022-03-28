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
    throw new Error('Unauthorized for queueing for sync');
  }

  let data = {};
  try {
    data = await insertEligibleUsersToSyncQueue();
  } catch (e) {
    console.log(e);
  }

  res.status(200).json(data);
}
