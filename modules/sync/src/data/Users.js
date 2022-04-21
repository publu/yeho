const { initSupabase } = require('../supabase-connect');
const { formatReturnData } = require('../helpers/data-helpers');

let supabase = initSupabase();
const table = 'QFG.Users';

const getUserById = async (id) => {
  const { error, data } = await supabase
    .from(table)
    .select()
    .eq('id', id);

  return await formatReturnData(error, data, table);
}

const updateLastSyncTime = async (user_id, last_sync_time) => {
  const { data, error } = await supabase
    .from(table)
    .update({ last_sync_time: last_sync_time })
    .match({ id: user_id })

  if (error) {
    throw new Error(error);
  }

  return await formatReturnData(error, data, table);
}

const updateFirstSyncStatus = async (user_id) => {
  const { data, error } = await supabase
    .from(table)
    .update({ first_sync: false })
    .match({ id: user_id })

  return await formatReturnData(error, data, table);
}

module.exports = {
  getUserById,
  updateLastSyncTime,
  updateFirstSyncStatus
};