var moment = require('moment-timezone');
const { data } = require('../../qftg-fund-manager/src/components/Chart/CustomLineChart');
const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();

// /**
//  * Get daily PNL based on timezone
//  * @param {string} timezone
//  * @param {int} user_id
//  * @returns json
//  */
// const getTotalDailyPNL = async (user_id, timezone = 'Pacific/Kiritimati') => {
//     try {
//         if (!user_id) {
//             throw new Error('UserId not suppiled');
//         }

//         const table = 'QFG.TotalPortfolio';

//         //get the UTC day start time for supplied timezone
//         const startTime = moment.tz(timezone).startOf('day').utc();

//         let portfolioTotalFromDayStart = supabase
//             .from(table)
//             .select()



//     } catch (e) {
//         console.error(e);
//     }
// }

/**
 * Get latest portfolio from database
 * @param {int} user_id
 * @returns json
 */
const getPortfolio = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Portfolio';

        //get the UTC day start time for supplied timezone
        const sync_time = await getLastSyncTimestamp(user_id);

        const { data, error } = await supabase
            .from(table)
            .select()
            .eq('sync_time', sync_time)

        if (error) {
            throw new Error('Error getting portfolio from database.');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get latest portfolio total from database
 * @param {int} user_id
 * @returns json
 */
const getPortfolioTotal = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.TotalPortfolio';

        //get the UTC day start time for supplied timezone
        const sync_time = await getLastSyncTimestamp(user_id);

        const { data, error } = await supabase
            .from(table)
            .select()
            .eq('sync_time', sync_time)

        if (error) {
            throw new Error('Error getting portfolio total from database.');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get last sync tmestamp
 * @param {int} user_id
 * @returns int
 */
const getLastSyncTimestamp = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Users';

        const { data, error } = await supabase
            .from(table)
            .select('last_sync_time')
            .eq('id', user_id)

        if (error) {
            throw new Error('Error fetching last_sync_timestamp from database.');
        }

        let last_sync_time = data[0].last_sync_time;
        return last_sync_time;
    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    // getTotalDailyPNL,
    getPortfolio,
    getPortfolioTotal,

}