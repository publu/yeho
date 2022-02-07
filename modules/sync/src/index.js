const { getPortfolio } = require('./api/index');

const { insertPortfolio, revertPortfolioSync } = require('./data/Portfolio');
const { insertPortfolioSnapshot, revertPortfolioSnapshotSync } = require('./data/PortfolioSnapshot');
const { insertTotalPortfolio, revertTotalPortfolioSync } = require('./data/TotalPortfolio');
const { updateLastSyncTime } = require('./data/Users');
const { formatPortfolio, formatPortfolioSnapshot } = require('./helpers/data-helpers');

async function app(user_id = 1) {
    try {
        //serves as sync lot number for storage
        let sync_time = Math.floor(new Date().getTime() / 1000.0);

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
        let formattedPortfolio = await formatPortfolio(user_id, sync_time, portfolio);
        let formattedPortfolioSnapshot = await formatPortfolioSnapshot(user_id, sync_time, portfolio);
        
        //bulk insert portfolio data to database
        let portfolioInsertResult = await insertPortfolio(formattedPortfolio.portfolio);
        let totalPortfolioInsertResult = await insertTotalPortfolio(formattedPortfolio.total);
        let portfolioSnapshotInsertResult = await insertPortfolioSnapshot(formattedPortfolioSnapshot);
        
        //Handle database insert error and revert sync changes if error
        //Commit sync if no error found
        console.log('-------------------');
        console.log(portfolioSnapshotInsertResult);
        if (portfolioInsertResult.error || totalPortfolioInsertResult.error || portfolioSnapshotInsertResult.error) {
            await revertPortfolioSync(user_id, sync_time);
            await revertTotalPortfolioSync(user_id, sync_time);
            await revertPortfolioSnapshotSync(user_id, sync_time);
        } else {
            await updateLastSyncTime(user_id, sync_time);
        }

    } catch (e) {
        console.error(e);
    }
}

app();