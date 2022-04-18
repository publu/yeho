const { _getProtocolLogo } = require('../../../controllers/logos');

export default async function handler(req, res) {
  try {

    const { protocol } = req.query;
    let protocolLogo = await _getProtocolLogo(protocol);

    if (!protocolLogo) {
      return res.status(401)
        .json({
          success: false,
          statusCode: 401,
          message: 'Not found'
        });
    }

    return res.status(200)
      .json({
        success: true,
        statusCode: 200,
        message: 'OK',
        data: protocolLogo
      });

  } catch (error) {
    return res.status(500)
      .json({
        success: false,
        statusCode: 500,
        message: error
      });
  }
}
