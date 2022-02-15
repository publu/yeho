const { saveAccount } = require('../../../controllers/accounts');

export default async function handler(req, res) {
    let user_id = req.body.user_id || 'be5f11fd-ca4a-485b-b0f5-6160c3586f48';
    let request = req.body;
    let data = {};

    if (!user_id) {
        throw new Error('UserId not suppiled');
    }

    if(!request.account_type || request.nickname) {
        throw new Error('Account type and name not supplied not supplied');
    }

    data.user_id = user_id;
    data.account_type = request.account_type;
    data.name = request.nickname;
    data.description = request.description;
    data.status = true;

    if ('cefi' === data.account_type) {
        data.cefi_account_provider = request.exchange;
        data.api_key = request.apiKey;
        data.api_secret = request.secretKey;
    } else if ('defi' === data.account_type) {
        data.wallet_address = request.address;
    }

    let accounts = await saveAccount(user_id, data);
    res.status(200).json(accounts);
}