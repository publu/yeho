const { protocols } = require('../../data');
const { initSupabase } = require('../../../../supabase-connect-with-service-key');
const axios = require('axios');

let supabase = initSupabase();
let table = 'QFG.LogoStorageRecord';

const parse = async () => {
  try {
    for (let i = 0; i < protocols.length; i++) {
      let protocol = protocols[i].id;
      let imageUrl = protocols[i].logo_url;
      let extension = 'png';
      let type = 'protocol';

      const response = await axios.get(imageUrl, {
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

      await supabase
        .from(table)
        .upsert({
          name: storedLogo.Key,
          url: 'https://ctbhldwjajwnjevbzpbk.supabase.co/storage/v1/object/public/' + storedLogo.Key,
          extension,
          type
        }, { onConflict: 'name' })

      console.log(i, ') Saving' + storedLogo.Key);

    }
  } catch (error) {
    console.log(error);
  }
}

parse();
