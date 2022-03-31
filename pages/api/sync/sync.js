const { sync } = require('../../../modules/sync/src/index');

const {
  getElementFromSyncQueue,
  removeElementFromSyncQueue,
  markQueueElementAsProcessing,
} = require('../../../modules/sync/src/helpers/sync-helpers');

export default async function handler(req, res) {
  let headers = req.headers;
  let tokenHeader = headers['token'];
  let secretHeader = headers['secret'];
  let token = process.env.CRONJOB_TOKEN;
  let secret = process.env.CRONJOB_SECRET;

  let user_id = false;

  if (!tokenHeader || !secretHeader || tokenHeader !== token || secretHeader !== secret) {
    throw new Error('Unauthorized for sync');
  }

  try {
    let queueItem = await getElementFromSyncQueue();
    if (queueItem) {
      user_id = queueItem[0].user_id;
      console.log('Running sync from queue');
      console.log(queueItem);
      await markQueueElementAsProcessing(user_id);
      await sync(user_id);
      await removeElementFromSyncQueue(user_id);
    } else {
      console.log('No queue item found');
    }
  } catch (e) {
    console.log(e);
  } finally {
    await removeElementFromSyncQueue(user_id);
  }

  res.status(200).json('OK');
}
