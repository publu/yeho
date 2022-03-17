const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();
let table = 'QFG.SyncQueue';

export const clearSyncQueue = async (user_id) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .match({ user_id: user_id })

  if (error) {
    throw new Error('Error getting portfolio from database. ' + error.message);
  }
  return data;
}