const supabase = require("@supabase/supabase-js");

const SUPABASE_URL = "https://xrpbzdcjwqhnrnlhgswm.supabase.co";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const db = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

module.exports = db;
