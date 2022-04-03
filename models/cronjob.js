const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();

const getAllCronJobLogs = async () => {
  let table = 'QFG.CronJobLog';
  try {
    const { data: logs, error } = await supabase
      .from(table)
      .select()
      .limit(10)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Error getting cronjob logs from database.');
    }

    return logs;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getAllCronJobLogs
}
