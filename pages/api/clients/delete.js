const { deleteClients } = require('../../../controllers/clients');

export default async function handler(req, res) {
    let user_id = req.body.user_id || 'be5f11fd-ca4a-485b-b0f5-6160c3586f48';
    let account_data = req.body.ids;
    if (!user_id) {
        throw new Error('UserId not suppiled');
    }

    let clients = await deleteClients(user_id, account_data);
    res.status(200).json(clients);
}