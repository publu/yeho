const { getOverview } = require('../../controllers/dashboard');

export default async function handler(req, res) {
  let user_id = req.body.user_id || 1;

  if (!user_id) {
    throw new Error('UserId not suppiled');
  }

  await getOverview(user_id);

  res.status(200).json({ user_id: user_id })
}