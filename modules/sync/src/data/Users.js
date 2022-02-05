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


module.exports = {
  getUserById
};