const { logWithBugsnag, logCronEvent } = require('../../../modules/sync/src/helpers/log-helpers');
const { _queue } = require('./_queue');

module.exports = async (req, res) => {
  await logCronEvent('queue');
  // Update queue
  try {
    let queue_status = await _queue();

    if (queue_status.success) {
      return res.status(200).json({ success: true, statusCode: 200, message: queue_status.message });
    } else {
      return res.status(400).json({ success: false, statusCode: 400, message: queue_status.message });
    }
  } catch (error) {
    console.log(error);
    logWithBugsnag(error);
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
}
