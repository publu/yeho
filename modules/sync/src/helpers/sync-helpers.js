const { initSupabase } = require('../supabase-connect');
const { syncConfig } = require('../config/config');
const { getAccountsCount } = require('../data/Account');
const { updateFirstSyncStatus } = require('../data/Users');


let supabase = initSupabase();
const table = 'QFG.SyncQueue';

const getElementFromSyncQueue = async () => {
  const { data, error } = await supabase
    .from(table)
    .select()
    .neq('processing', true)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    throw new Error(error.message);
  }

  if (data.length > 0) {
    return data;
  } else {
    return false;
  }
}

const removeElementFromSyncQueue = async (user_id) => {
  await supabase
    .from(table)
    .delete()
    .match({ user_id: user_id })

  return;
}

const insertElementToSyncQueue = async (items) => {
  const { data, error } = await supabase
    .from(table)
    .upsert(
      items,
      { onConflict: 'user_id' }
    )

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

const markQueueElementAsProcessing = async (user_id) => {
  if (!user_id) {
    throw new Error('user_id is required');
  }

  await supabase
    .from(table)
    .update({ processing: true })
    .match({ user_id: user_id })

  return;
}

const insertEligibleUsersToSyncQueue = async () => {
  const syncIntervalMinutes = syncConfig.SYNC_INTERVAL_MINUTES;
  let table = 'QFG.Users';

  let currentDate = new Date();
  let eligibilityStartTime =
    new Date(currentDate.getTime() - syncIntervalMinutes * 60000)
      .getTime();

  const { data, error } = await supabase
    .from(table)
    .select('id, last_sync_time, first_sync')
    .or('last_sync_time.is.null,last_sync_time.lte.' + eligibilityStartTime)
    .neq('role', 'super_admin')
    .order('last_sync_time', { ascending: true })

  if (error) {
    throw new Error(error.message);
  }

  if (data.length > 0) {
    let eligibleUsers = [];
    let eligibleUser = {};

    for (let i = 0; i < data.length; i++) {
      let count = await getAccountsCount(data[i].id);

      // Update first sync status after users' first sync
      if (data[i].first_sync) {
        await updateFirstSyncStatus(data[i].id);
      }

      if (count && count > 0) {
        eligibleUser = {
          user_id: data[i].id,
          priority: data[i].first_sync ? 1 : 0
        }

        eligibleUsers.push(eligibleUser);
        eligibleUser = {};
      }

    }

    return await insertElementToSyncQueue(eligibleUsers);
  }

  return;
}

module.exports = {
  getElementFromSyncQueue,
  removeElementFromSyncQueue,
  insertElementToSyncQueue,
  markQueueElementAsProcessing,
  insertEligibleUsersToSyncQueue
}