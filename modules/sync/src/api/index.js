const utils = require('./utils/utils');
const portfolioUtils = require('./utils/portfolioUtils');
const ethUtils = require('./utils/ethUtils');
const exchangeUtils = require('./utils/exchangeUtils');
const marketUtils = require('./utils/marketUtils');

const {
  printPortfolioNicely,
} = utils;

const {
  getPrices,
  getFTMPrice,
} = marketUtils;

const {
  overwritePrices,
  combineTokenCounts,
  getTokenValues,
  sumOtherTokenCounts,
} = portfolioUtils;

const {
  getERC20TokenCounts,
  getProtocolCounts,
  getStakedCounts
} = ethUtils;

const {
  getExchangeTokenCounts,
  fetchers,
} = exchangeUtils;

const { log } = console;

const getPortfolio = async ({
  keys = {},
  addresses = [],
  othertokens = {},
  combineExchanges = false,
  combineAddresses = false,
  extraFetchers = {},
  verbose = true,
  optionIndex
} = {}) => {

  let current = 1

  function another() {
    current = current + 1;
    return current;
  }

  var count = 8;

  try {

    console.log('fetching exchange token counts ...')
    const exchangeTokenCounts = await getExchangeTokenCounts(keys, extraFetchers, combineExchanges)
      .catch((error) => {
        console.log(error)
      });

    console.log('fetching Eth Tokens ...');
    const [ethTokenCounts, ethTokenPrices] = await getProtocolCounts(addresses, "eth", combineAddresses)
      .catch((error) => {
        console.log(error)
      });


    console.log('fetching BSC Tokens ...');
    const [bscTokenCounts, bscTokenPrices] = await getProtocolCounts(addresses, "bsc", combineAddresses)
      .catch((error) => {
        console.log(error)
      });


    console.log('fetching Polygon Tokens counts ...');
    const [maticTokenCounts, maticTokenPrices] = await getProtocolCounts(addresses, "matic", combineAddresses)
      .catch((error) => {
        console.log(error)
      });


    console.log('fetching Fantom Tokens counts ...');
    const [fantomTokenCounts, fantomTokenPrices] = await getProtocolCounts(addresses, "ftm", combineAddresses)
      .catch((error) => {
        console.log(error)
      });


    const [stakedMaticTokenCounts, stakedMaticTokenPrices] = await getStakedCounts(addresses, "matic", combineAddresses)
      .catch((error) => {
        console.log(error)
      });

    const [stakedEthTokenCounts, stakedEthTokenPrices] = await getStakedCounts(addresses, "eth", combineAddresses)
      .catch((error) => {
        console.log(error)
      });

    const [stakedFantomTokenCounts, stakedFantomTokenPrices] = await getStakedCounts(addresses, "ftm", combineAddresses)
      .catch((error) => {
        console.log(error)
      });

    const [stakedBscTokenCounts, stakedBscTokenPrices] = await getStakedCounts(addresses, "bsc", combineAddresses)
      .catch((error) => {
        console.log(error)
      });

    console.log('fetching other token counts ...');
    const otherTokenCounts = sumOtherTokenCounts(othertokens);

    let eachTokenCounts = [
      ...exchangeTokenCounts,
      ...ethTokenCounts,
      ...stakedEthTokenCounts,
      ...bscTokenCounts,
      ...stakedBscTokenCounts,
      ...maticTokenCounts,
      ...stakedMaticTokenCounts,
      ...fantomTokenCounts,
      ...stakedFantomTokenCounts,
      ...otherTokenCounts
    ];

    //console.log(eachTokenCounts);

    const allTokenCounts = combineTokenCounts(
      ...eachTokenCounts.map(([, counts]) => counts)
    );

    eachTokenCounts = [
      ...eachTokenCounts,
      ['all', allTokenCounts],
    ];

    console.log('fetching all token prices ...');


    const FTMprice = await getFTMPrice()
      .catch((error) => {
        console.log(error)
      });

    let tokenPrices = await getPrices(Object.keys(allTokenCounts), verbose)
      .catch((error) => {
        console.log(error)
      });

    console.log('calculating all token values ...');


    let allTokenPrices = {
      ...ethTokenPrices,
      ...bscTokenPrices,
      ...maticTokenPrices,
      ...fantomTokenPrices,
      ...stakedMaticTokenPrices,
      ...stakedEthTokenPrices,
      ...stakedFantomTokenPrices,
      ...stakedBscTokenPrices,
      ...tokenPrices
    };

    const allTokenValues = eachTokenCounts.map(([name, counts]) => {
      const values = getTokenValues(counts, allTokenPrices, FTMprice);
      return [name, values];
    });

    return Object.fromEntries(allTokenValues);

  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
};
