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
    // .neq('processing', true)
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
  const { error } = await supabase
    .from(table)
    .delete()
    .match({ user_id: user_id })

  if (error) {
    throw new Error(error);
  }

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
    return false;
  }

  return true;
}

const markQueueElementAsProcessing = async (user_id) => {
  if (!user_id) {
    throw new Error('user_id is required');
  }

  const { error, data } = await supabase
    .from(table)
    .update({ processing: true })
    .match({ user_id: user_id })

  return;
}

const updateUserLastQueueTime = async (user_id) => {
  if (!user_id) {
    throw new Error('user_id is required');
  }
  let timestamp = new Date;

  const { data, error } = await supabase
    .from('QFG.Users')
    .update({ last_queue_time: timestamp })
    .match({ id: user_id })
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
    .order('last_queue_time', { ascending: true })
    .limit(1)

  await updateUserLastQueueTime(data[0].id);

  if (error) {
    throw new Error(error.message);
  }
  if (data.length > 0) {
    let count = await getAccountsCount(data[0].id);
    if (count <= 0) {
      return {
        success: true,
        message: 'No wallet found.'
      }
    }

    // // Update first sync status after users' first sync
    // if (data[0].first_sync) {
    //   await updateFirstSyncStatus(data[0].id);
    // }

    let eligibleUser = [{
      user_id: data[0].id,
      priority: /*data[0].first_sync ? 1 : 0*/ 0
    }]

    let insert_status = await insertElementToSyncQueue(eligibleUser);
    if (insert_status) {
      return {
        success: true,
        message: 'Success'
      }
    } else {
      return {
        success: false,
        message: 'Queue insert Failed'
      }
    }
  } else {
    return {
      success: true,
      message: 'Queue Empty'
    }
  }
}

module.exports = {
  getElementFromSyncQueue,
  removeElementFromSyncQueue,
  insertElementToSyncQueue,
  markQueueElementAsProcessing,
  insertEligibleUsersToSyncQueue
}
