const { getAllManagers, getManagedFunds } = require('../models/managers');

const getManagers = async (user_id) => {
  let updatedManagers = [];
  try {
    let managers = await getAllManagers();

    for (let i = 0; i < managers.length; i++) {
      updatedManagers.push({
        ...managers[i],
        managed_funds: await getManagedFunds(managers[i].id, managers[i].last_sync_time)
      });
    }
    return updatedManagers;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getManagers,
}