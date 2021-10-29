const {
  getMyPortfolio,
  printPortfolioNicely,
} = require('../src/index');
  
  
const othertokens = {
  BTC: [8.5],
  BNB: [200],
  ETH: [10, 30],
  USDT: [
    1000,
    2000,
    5000,
  ],
  // ......
};

(async () => {
  const portfolio = await getMyPortfolio({ othertokens });
  printPortfolioNicely(portfolio);
})();
