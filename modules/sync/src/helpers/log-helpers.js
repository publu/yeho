const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();
const table = 'QFG.CronJobLog';

const logCronEvent = async (type) => {
  await logCleanup().then(async () => {
    const { error } = await supabase
      .from(table)
      .insert([
        { type }
      ])

    if (error) {
      throw new Error(error.message);
    }
  });
}

const logCleanup = async (type) => {

  //get time an hour ago to delete records older than that
  let date = new Date();
  date.setHours(date.getHours() - 1);

  const { error, data } = await supabase
    .from(table)
    .delete()
    .lte('created_at', date.toUTCString());

  if (error) {
    throw new Error(error.message);
  }
}

const logWithBugsnag = (error) => {
  var Bugsnag = require('@bugsnag/js')
    .start({ apiKey: '730ec27cc94d426c8ad16ea97f14ae77' });

  Bugsnag.notify(error);
}


module.exports = {
  logCronEvent,
  logWithBugsnag
};