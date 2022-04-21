const { logWithBugsnag } = require('../../../modules/sync/src/helpers/log-helpers')
const {
  insertEligibleUsersToSyncQueue
} = require('../../../modules/sync/src/helpers/sync-helpers');


const _queue = async () => {
  try {
    let queue_status = await insertEligibleUsersToSyncQueue();
    if (queue_status.success) {
      return {
        success: true,
        message: 'Queueing Complete.'
      }
    } else {
      return {
        success: false,
        message: 'Queueing Failed.'
      }
    }
  } catch (error) {
    logWithBugsnag(error);
    return {
      success: false,
      message: `Queueing exception: ${error}`
    }
  }
}

module.exports = {
  _queue
}
