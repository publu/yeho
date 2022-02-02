const { initSupabase } = require('./supabase-connect');
const { getUserById } = require('./data/Users');
const { getAccounts } = require('./data/Accounts');

const data = require('./test-data');
const {
    keys,
    othertokens,
    addresses,
} = data;

async function app(shop_id = 1) {
    let account = await getAccounts({});
    console.log(account);
}

app();