const { getAllCronJobLogs } = require('../models/cronjob');

const getCronJobLogs = async () => {
  try {
    return await getAllCronJobLogs();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getCronJobLogs
}
