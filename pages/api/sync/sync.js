const { sync } = require('../../../modules/sync/src/index');

const {
  getElementFromSyncQueue,
  removeElementFromSyncQueue,
  markQueueElementAsProcessing,
} = require('../../../modules/sync/src/helpers/sync-helpers');

export default async function handler(req, res) {
  // res.status(301).json({ statusCode: 301 });

  try {
    let headers = req.headers;
    let tokenHeader = headers['token'];
    let secretHeader = headers['secret'];
    let token = process.env.CRONJOB_TOKEN;
    let secret = process.env.CRONJOB_SECRET;

    let user_id = false;

    if (!tokenHeader || !secretHeader || tokenHeader !== token || secretHeader !== secret) {
      return res.status(401).json({ success: false, ststusCode: 401, message: 'Unauthorized' });
    }

    let queueItem = await getElementFromSyncQueue();
    if (queueItem) {
      user_id = queueItem[0].user_id;
      console.log('Running sync from queue');

      markQueueElementAsProcessing(user_id);
      sync(user_id);
      removeElementFromSyncQueue(user_id);
    } else {
      console.log('No queue item found');
    }
  } catch (error) {
    removeElementFromSyncQueue(user_id);
    return res.status(500).json({ success: false, statusCode: 500, message: error });
  }

  res.status(200).json({ success: true, statusCode: 200, message: 'OK' });
}
