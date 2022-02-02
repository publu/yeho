const { createClient } = require('@supabase/supabase-js');

const options = {
    schema: 'public',
    persistSession: true,
}

exports.initSupabase = () => {
    return supabase = createClient(
        "https://ctbhldwjajwnjevbzpbk.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5ODc4NiwiZXhwIjoxOTU4OTc0Nzg2fQ.wlkYmc46O_vhfgJupFSIMte37mcKCadVW_gqS0u4Ym8",
        options
    );
}