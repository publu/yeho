// const {
//   getPortfolio,
//   printPortfolioNicely,
//   fetchers,
// } = require('../../modules/sync/src/api/index');
// const data = require('../../testing/data');

// const {
//   keys,
//   othertokens,
//   addresses,
// } = data;

// const {
//   fetchBinanceContractBalances,
//   fetchFTXContractBalances,
// } = fetchers;

export default async function handler(req, res) {
  res.status(400)
    .send('404 not found');

  // let combineExchanges = false;

  // const extraFetchers = {
  //   binance: fetchBinanceContractBalances,
  //   ftx: fetchFTXContractBalances,
  // };

  // let portfolio = await getPortfolio({
  //     keys,
  //     addresses,
  //     othertokens,
  //     combineExchanges,
  //     extraFetchers,
  //   });

  // res.status(200).json(portfolio)
}