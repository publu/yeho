const { sync } = require('../../../modules/sync/src/index');
const { logWithBugsnag } = require('../../../modules/sync/src/helpers/log-helpers');
const {
  getElementFromSyncQueue,
  removeElementFromSyncQueue,
} = require('../../../modules/sync/src/helpers/sync-helpers');

const _sync = async () => {
  // Sync from queue
  try {
    let queueItem = await getElementFromSyncQueue();
    if (queueItem) {
      let user_id = queueItem[0].user_id;

      await removeElementFromSyncQueue(user_id);
      let sync_status = await sync(user_id);
      if (sync_status) {
        return {
          success: true,
          message: 'Sync successful'
        }
      } else {
        return {
          success: false,
          message: 'Sync failed'
        }
      }
    } else {
      return {
        success: true,
        message: 'Queue Empty'
      }
    }
  } catch (error) {
    logWithBugsnag(error);
    return {
      success: false,
      message: `Sync failed: ${error.message}`
    }
  }
}

module.exports = {
  _sync
}
