const {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('../../api/index');


export default async function handler(req, res) {

  console.log(req.body);
  if(!req.body){
    res.status(200).send("Error: Request must be POST and include at least one of the configurations!")
  }

  var data = {};
  const body = JSON.parse(JSON.stringify(req.body));
  
  if(body.dev)
  {  
    data["addresses"] = JSON.parse(body.addresses);
  } else {
    data = req.body;
  }

  console.log(data);

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