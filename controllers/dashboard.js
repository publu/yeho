const { getPortfolioSnapshot } = require('../models/dashboard');

const getOverview = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        let portfolioSnapshot = await getPortfolioSnapshot(user_id);
        let firstPortfolioSnapshotOfDay = await getPortfolioSnapshot(user_id, true);

        return [portfolioSnapshot,  firstPortfolioSnapshotOfDay];
    } catch (e) {
        console.error(e);
    }
}

const getLatestSnapshot = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        let portfolioSnapshot = await getPortfolioSnapshot(user_id);

        return [portfolioSnapshot];
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    getOverview,
    getLatestSnapshot,
}