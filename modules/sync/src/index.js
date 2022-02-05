const { getPortfolio } = require('./api/index');

const { insertPortfolio } = require('./data/Portfolio');
const { insertTotalPortfolio } = require('./data/TotalPortfolio');
const { formatPortfolio } = require('./helpers/data-helpers');

async function app(user_id = 1) {

    //serves as sync lot number for storage
    let sync_time = Math.floor(new Date().getTime() / 1000.0);

    // preparing tokens/config to fetch portfolio
    const data = require('./test-data');
    const {
        keys,
        othertokens,
        addresses,
    } = data;
    let combineExchanges = false;

    let portfolio = await getPortfolio({
        keys,
        addresses,
        othertokens,
        combineExchanges,
    });

    //get prepared portfolio data for insertion
    let formattedPortfolio = await formatPortfolio(user_id, sync_time, portfolio);

    //bulk insert portfolio data to database
    await insertPortfolio(formattedPortfolio.portfolio);
    await insertTotalPortfolio(formattedPortfolio.total);
}

app();