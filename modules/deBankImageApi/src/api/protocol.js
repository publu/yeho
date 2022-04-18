const { accessKey } = require('../config');
const axios = require('axios');

const getProtocolLogo = async (protocol) => {
  try {
    const response = await axios.get(`https://pro-openapi.debank.com/v1/protocol?id=${protocol}`, {
      headers: {
        'accept': 'application/json',
        'AccessKey': accessKey
      }
    });

    if (response.data && response.data.logo_url) {
      return response.data.logo_url;
    } else {
      return false;
    }

  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = { getProtocolLogo };
