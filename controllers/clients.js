const { getAllClients, createClient, removeClients } = require('../models/clients');

const getClients = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error('UserId not suppiled');
    }

    return await getAllClients(user_id);
  } catch (e) {
    console.error(e);
  }
}

const saveClient = async (user_id, client_data) => {
  try {
    if (!user_id) {
      throw new Error('UserId not suppiled');
    }

    return await createClient(user_id, client_data);
  } catch (e) {
    console.error(e);
  }
}

const deleteClients = async (user_id, account_ids) => {
  try {
    if (!user_id) {
      throw new Error('UserId not suppiled');
    }

    if (!account_ids) {
      throw new Error('Account ids not suppiled');
    }

    return await removeClients(user_id, account_ids);

  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  saveClient,
  getClients,
  deleteClients
}