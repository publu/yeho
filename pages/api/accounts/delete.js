const { deleteAccounts } = require('../../../controllers/accounts');
const { isUserAuthorized } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
    let headers = req.headers;
    let token = headers['access-token'];
    let user_id = headers['user-id'];

    if (!token || !user_id) { // preflight check needs 200 OK
        res.status(200);
    }

    if (!isUserAuthorized(token, user_id)) {
        res.status(401);
    }

    let account_data = req.body.ids;
    if (!account_data) {
        throw new Error('account_data not suppiled');
    }

    let accounts = await deleteAccounts(user_id, account_data);
    res.status(200).json(accounts);
}