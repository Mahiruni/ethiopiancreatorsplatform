import { createClient } from "@supabase/supabase-js";
if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true") throw new Error("Demo cleanup is disabled outside explicit development mode.");
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,secret=process.env.SUPABASE_SECRET_KEY;if(!url||!secret)throw new Error("Supabase admin environment variables are required.");
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});let page=1;let removed=0;
while(true){const{data,error}=await admin.auth.admin.listUsers({page,perPage:100});if(error)throw error;const demo=data.users.filter(u=>u.email?.endsWith("@demo.linqo.local"));for(const u of demo){const{error:e}=await admin.auth.admin.deleteUser(u.id);if(e)throw e;removed++;}if(data.users.length<100)break;page++;}
console.log(`Removed ${removed} demo users. Cascades remove their seed-only identity data.`);
