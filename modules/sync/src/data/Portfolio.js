const { initSupabase } = require('../supabase-connect');
const { formatReturnData } = require('../helpers/data-helpers');

let supabase = initSupabase();
const table = 'QFG.Portfolio';

/**
 * Account stores wallets and its contents.
 * @TODO: Handeling limit and offset.
 * @param {object} filters key:value object of filters
 * @returns json
 */
const getPortfolio = async (filters) => {
    let query = supabase
        .from(table)
        .select()

    for (const key in filters) {
        query = query.eq(key, filters[key]);
    }

    const { error, data } = await query;

    return formatReturnData(error, data, table);
}

const insertPortfolio = async (portfolio) => {
    const { data, error } = await supabase
        .from(table)
        .insert(portfolio)

    return formatReturnData(error, data, table);
}

module.exports = {
    getPortfolio,
    insertPortfolio
};