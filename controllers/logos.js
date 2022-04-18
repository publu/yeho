const axios = require('axios');

const { initSupabase } = require('../supabase-connect-with-service-key');
const { getProtocolLogo } = require('../modules/deBankImageApi/src/index');

let supabase = initSupabase();
let table = 'QFG.LogoStorageRecord';

const _getProtocolLogo = async (protocol) => {
  try {

    const { data: logoUrl } = await supabase
      .from(table)
      .select()
      .like('name', `images/protocol/${protocol}.%`)

    if (logoUrl.length && logoUrl[0].url) {
      return logoUrl[0].url;
    } else {
      let protocolLogo = await getProtocolLogo(protocol);

      if (protocolLogo) {
        let extension = protocolLogo.split('.').pop();
        let type = 'protocol';

        const response = await axios.get(protocolLogo, {
          responseType: 'arraybuffer'
        });
        const imageBuffer = Buffer.from(response.data, "utf-8");

        const { data: storedLogo } = await supabase
          .storage
          .from('images')
          .upload(`${type}/${protocol}.${extension}`, imageBuffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: `image/${extension}`
          })

        if (storedLogo.Key) {
          await supabase
            .from(table)
            .upsert({
              name: storedLogo.Key,
              url: 'https://ctbhldwjajwnjevbzpbk.supabase.co/storage/v1/object/public/' + storedLogo.Key,
              extension,
              type
            }, { onConflict: 'name' })
        }
        return protocolLogo;
      }
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = { _getProtocolLogo };
