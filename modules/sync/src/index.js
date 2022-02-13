const { getPortfolio } = require('./api/index');

const { insertPortfolioSnapshot } = require('./data/PortfolioSnapshot');
const { updateLastSyncTime } = require('./data/Users');
const { formatPortfolioSnapshot } = require('./helpers/data-helpers');

async function app(user_id = 'be5f11fd-ca4a-485b-b0f5-6160c3586f48') {
    try {
        //serves as sync lot number for storage
        let sync_time = new Date().getTime();

        // preparing tokens/config to fetch portfolio
        const data = require('./test-data');
        const {
            keys,
            othertokens,
            addresses,
        } = data;
        let combineExchanges = true;

        let portfolio = await getPortfolio({
            keys,
            addresses,
            othertokens,
            combineExchanges,
        });

        //get prepared portfolio data for insertion
        // let formattedPortfolio = await formatPortfolio(user_id, sync_time, portfolio);
        let formattedPortfolioSnapshot = await formatPortfolioSnapshot(user_id, sync_time, portfolio);

        //bulk insert portfolio data to database
        // let portfolioInsertResult = await insertPortfolio(formattedPortfolio.portfolio);
        // let totalPortfolioInsertResult = await insertTotalPortfolio(formattedPortfolio.total);
        let portfolioSnapshotInsertResult = await insertPortfolioSnapshot(formattedPortfolioSnapshot);

        //Commit sync if no error found
        if ( !portfolioSnapshotInsertResult.error) {
            await updateLastSyncTime(user_id, sync_time);
        }
        // else {
        //     await revertPortfolioSnapshotSync(user_id, sync_time);
        // }



    } catch (e) {
        console.error(e);
    }
}

app();