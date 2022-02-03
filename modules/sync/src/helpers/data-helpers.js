const formatReturnData = async (error, data) => {
    if (error) {
        return { data: null, error: true, message: error.message }
    }

    return { data: data, error: false, message: null };
}

/**
 * prepare portfolio to store to database
 * Accounts table needs user_id, wallet_address, sync_time, crypto_data, wallet_total
 *  { user_id: user_id, sync_time: sync_time, wallet_address: wallet_address, crypto_data: crypto_data, wallet_total: wallet_total }
 */
const formatPortfolio = async (user_id, sync_time, portfolio) => {
    let formattedPortfolio = [];

    Object.entries(portfolio).forEach(([wallet_address, data]) => {
        let individialPortfolio = {}

        individialPortfolio.user_id = user_id;
        individialPortfolio.sync_time = sync_time;
        individialPortfolio.wallet_address = wallet_address;
        individialPortfolio.wallet_total = {};
        individialPortfolio.crypto_data = {};

        data.forEach(datum => {
            if ('TOTAL' === datum[0]) {
                individialPortfolio.wallet_total[datum[0]] = datum[1];
            } else {
                individialPortfolio.crypto_data[datum[0]] = datum[1];
            }
        });
        
        if ('all' !== wallet_address) {
            formattedPortfolio.push(individialPortfolio);
        }
    });

    return formattedPortfolio;
}

module.exports = {
    formatPortfolio,
    formatReturnData
};