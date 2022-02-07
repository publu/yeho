const { getPortfolio, getPortfolioTotal } = require('../models/dashboard');

const getOverview = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        let portfolio = await getPortfolio(user_id);
        let portfolioTotal = await getPortfolioTotal(user_id);
        
        let totalBalanceUSD = portfolioTotal[0].total.USD;
        let totalBalanceFTM = portfolioTotal[0].total.FTM;
        console.log(totalBalanceUSD);
        console.log(totalBalanceFTM);




    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    getOverview,
}