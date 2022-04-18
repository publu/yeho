const { getAllAccounts, createAccount, removeAccounts, updateAccounts } = require('../models/accounts');

const getAccounts = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error('UserId not suppiled');
    }

    return await getAllAccounts(user_id);

  } catch (e) {
    console.error(e);
  }
}

const saveAccount = async (user_id, data) => {
  try {
    if (!user_id) {
      throw new Error('UserId not suppiled');
    }

    let accounts = await createAccount(user_id, data);

    return accounts;
  } catch (e) {
    console.error(e);
  }
}

const updateAccount = async (account_id, data) => {
  try {
    if (!account_id) {
      throw new Error('account_id not suppiled');
    }

    let accounts = await updateAccounts(account_id, data);

    return accounts;
  } catch (e) {
    console.error(e);
  }
}

const deleteAccounts = async (user_id, account_ids) => {
  try {
    if (!user_id) {
      throw new Error('UserId not suppiled');
    }

    if (!account_ids) {
      throw new Error('Account ids not suppiled');
    }

    let accounts = await removeAccounts(user_id, account_ids);

    return accounts;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  saveAccount,
  getAccounts,
  deleteAccounts,
  updateAccount
}