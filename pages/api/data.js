const {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('../../api/index');


export default async function handler(req, res) {

  var data =  req.body;
    
  let combineExchanges = false;

  const {
    keys,
    othertokens,
    addresses,
  } = data;

  const {
    fetchBinanceContractBalances,
    fetchFTXContractBalances,
  } = fetchers;

  const extraFetchers = {
    binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  };

  let portfolio = await getPortfolio({
      keys,
      addresses,
      othertokens,
      combineExchanges,
      extraFetchers,
    });
  
  res.status(200).json(portfolio)
}