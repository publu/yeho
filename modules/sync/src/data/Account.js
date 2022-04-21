const { initSupabase } = require('../supabase-connect');
const { formatAccountData } = require('../helpers/data-helpers');

let supabase = initSupabase();
const table = 'QFG.Wallet';

/**
 * Account stores wallets and its contents.
 * @TODO: Handeling limit and offset.
 * @param {object} filters key:value object of filters
 * @returns json
 */
const getAccounts = async (user_id) => {
  const { data, error } = await supabase
    .from(table)
    .select()
    .eq('user_id', user_id)

  if (error) {
    throw new Error(error);
  }

  return formatAccountData(error, data, table);
}

const getAccountsCount = async (user_id) => {
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user_id)

  return count;
}

module.exports = {
  getAccounts,
  getAccountsCount
}