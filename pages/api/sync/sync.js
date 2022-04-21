const { logWithBugsnag, logCronEvent } = require('../../../modules/sync/src/helpers/log-helpers');
const { _sync } = require('./_sync');

module.exports = async (req, res) => {
  try {
    await logCronEvent('sync');
    let sync_status = await _sync();

    if (sync_status.success) {
      return res.status(200).json({ success: true, statusCode: 200, message: sync_status.message });
    } else {
      return res.status(400).json({ success: false, statusCode: 400, message: sync_status.message });
    }

  } catch (error) {
    console.log(error);
    logWithBugsnag(error);
    return res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
}
