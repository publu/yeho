const { saveClient } = require('../../../controllers/clients');

export default async function handler(req, res) {
    let user_id = req.body.user_id || 'be5f11fd-ca4a-485b-b0f5-6160c3586f48';
    let request = req.body;
    let client_data = {};
    if (!user_id) {
        throw new Error('UserId not suppiled');
    }

    client_data.user_id = user_id;
    client_data.first_name = request.name;
    client_data.last_name = request.lastName;
    client_data.deposit = request.deposit;
    client_data.email = request.email;
    client_data.contact = request.number;
    client_data.location = request.location;
    client_data.description = request.description;

    let clients = await saveClient(user_id, client_data);
    res.status(200).json(clients);
}