const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();

const getAllManagers = async () => {
  let table = 'QFG.Users';
  try {
    const { data, error } = await supabase
      .from(table)
      .select()
      .neq('role', 'super_admin')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Error getting accounts from database.');
    }

    return data;
  } catch (e) {
    console.log(e);
  }
}

const getManagedFunds = async (user_id, last_sync_time) => {
  let table = 'QFG.PortfolioSnapshot';
  try {
    if (!last_sync_time) {
      return null;
    }

    const { data, error } = await supabase
      .from(table)
      .select('snapshot')
      .eq('user_id', user_id)
      .eq('timestamp', last_sync_time)
      .limit(1)

    if (error) {
      throw new Error('Error getting snapshots from database. ' + error.message);
    }

    if (data[0] && data[0].snapshot.length && data[0].snapshot.length) {
      return data[0].snapshot[0].all[0][1];
    }

    return null;

  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getAllManagers,
  getManagedFunds
}