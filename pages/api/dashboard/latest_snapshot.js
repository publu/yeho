const { getLatestSnapshot } = require('../../../controllers/dashboard');

export default async function handler(req, res) {
  let user_id = req.body.user_id || 'be5f11fd-ca4a-485b-b0f5-6160c3586f48';

  if (!user_id) {
    throw new Error('UserId not suppiled');
  }

  let portfolio = await getLatestSnapshot(user_id);

  res.status(200).json(portfolio)
}