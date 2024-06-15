import { SupabaseClient, createClient } from "@supabase/supabase-js";

let supabase: SupabaseClient<any, "public", any>;

const getAuth = () => {
  if (!supabase) {
    supabase = createClient(process.env.REACT_APP_SUPABASE_ANON_URL!, process.env.REACT_APP_SUPABASE_ANON_API_KEY!)
  }
  return supabase;
}

export default getAuth;
