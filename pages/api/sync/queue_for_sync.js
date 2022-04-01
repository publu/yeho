const {
  insertEligibleUsersToSyncQueue
} = require('../../../modules/sync/src/helpers/sync-helpers');

export default async function handler(req, res) {
  try {
    let headers = req.headers;
    let tokenHeader = headers['token'];
    let secretHeader = headers['secret'];
    let token = process.env.CRONJOB_TOKEN;
    let secret = process.env.CRONJOB_SECRET;

    if (!tokenHeader || !secretHeader || tokenHeader !== token || secretHeader !== secret) {
      return res.status(401).json({ success: false, ststusCode: 401, message: 'Unauthorized' });
    }

    insertEligibleUsersToSyncQueue();
  } catch (error) {
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }

  res.status(200).json({ success: true, statusCode: 200, message: 'OK' });
}
