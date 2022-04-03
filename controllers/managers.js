const { getUserIdFromEmail } = require('../helpers/user-auh');
const { getAllManagers, getManagedFunds } = require('../models/managers');
const { removeAllClients } = require('../models/clients');
const { removeAllAccounts } = require('../models/accounts');
const { clearSyncQueue } = require('../models/syncQueue');
const { removeAllPortfolioSnapshots } = require('../models/dashboard');
const { deleteManager, changeManagerStatus } = require('../models/managers');

const { initSupabase } = require('../supabase-connect-with-service-key');

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

const deleteManagers = async (user_id) => {
  if (!user_id) {
    throw new Error('user_id not supplied');
  }

  try {
    let supabase = initSupabase();
    const { error } = await supabase.auth.api.deleteUser(
      user_id
    )

    if (error) {
      if ('User not found' !== error.message) {
        throw new Error('can\'t delete user. ' + error.message);
      }
    }

    await removeAllAccounts(user_id);
    await removeAllClients(user_id);
    await clearSyncQueue(user_id);
    await removeAllPortfolioSnapshots(user_id);

    await deleteManager(user_id);

    return true;
  } catch (e) {
    console.error(e);
  }
}

const updateManagerStatus = async (user_id, status) => {
  if (!user_id) {
    throw new Error('user_id not supplied');
  }

  try {

    return await changeManagerStatus(user_id, status);

  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getManagers,
  deleteManagers,
  updateManagerStatus
}