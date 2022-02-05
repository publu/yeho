const { initSupabase } = require('../supabase-connect');
const { formatReturnData } = require('../helpers/data-helpers');

let supabase = initSupabase();
const table = 'QFG.TotalPortfolio';

/**
 * Account stores wallets and its contents.
 * @TODO: Handeling limit and offset.
 * @param {object} filters key:value object of filters
 * @returns json
 */
const getTotalPortfolio = async (filters) => {
    let query = supabase
        .from(table)
        .select()

    for (const key in filters) {
        query = query.eq(key, filters[key]);
    }

    const { error, data } = await query;

    return formatReturnData(error, data, table);
}

const insertTotalPortfolio = async (totalPortfolio) => {
    const { data, error } = await supabase
        .from(table)
        .insert(totalPortfolio)

    return formatReturnData(error, data, table);
}

module.exports = {
    getTotalPortfolio,
    insertTotalPortfolio
};