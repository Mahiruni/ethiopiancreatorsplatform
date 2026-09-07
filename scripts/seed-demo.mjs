import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true") {
  throw new Error("Demo seeding is disabled. Set ALLOW_DEMO_SEED=true only in a development environment.");
}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,secret=process.env.SUPABASE_SECRET_KEY;
if(!url||!secret)throw new Error("Supabase admin environment variables are required.");
const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const demos=[
  {username:"selamstudio",name:"Selam Studio",category:"Creator",bio:"Visual stories, brand systems and creative direction from Addis Ababa.",plan:"pro"},
  {username:"nuhbeats",name:"Nuh Beats",category:"Musician",bio:"Producer, songwriter and live-session artist.",plan:"pro"},
  {username:"meroncodes",name:"Meron Codes",category:"Freelancer",bio:"Frontend engineer, mentor and open-source builder.",plan:"pro"},
  {username:"bunaandco",name:"Buna & Co.",category:"Business",bio:"Small-batch Ethiopian coffee and café experiences.",plan:"business"},
  {username:"mesobcorner",name:"Mesob Corner",category:"Business",bio:"A fictional neighborhood restaurant sharing menu, location and bookings.",plan:"business"},
  {username:"dawitpro",name:"Dawit Bekele",category:"Professional",bio:"A fictional consultant sharing services, writing and booking links.",plan:"free"}
];
for(const d of demos){
  const email=`${d.username}@demo.linqo.local`;
  const {data:created,error:userError}=await admin.auth.admin.createUser({email,email_confirm:true,password:`Demo-${crypto.randomBytes(18).toString("base64url")}!`});
  let user=created?.user;
  if(userError){const {data:list}=await admin.auth.admin.listUsers({page:1,perPage:1000});user=list.users.find(u=>u.email===email);}
  if(!user)throw new Error(`Could not create demo user ${email}`);
  const {data:profile,error:profileError}=await admin.from("profiles").upsert({user_id:user.id,username:d.username,display_name:d.name,bio:d.bio,category:d.category,locale:"en",is_public:true,theme_id:d.plan==="free"?"minimal":"elegant",appearance:{}},{onConflict:"user_id"}).select("id").single();
  if(profileError)throw profileError;
  await admin.from("usernames").upsert({username:d.username,user_id:user.id},{onConflict:"username"});
  await admin.from("user_roles").upsert({user_id:user.id,role:"user"},{onConflict:"user_id"});
  await admin.from("subscriptions").delete().eq("profile_id",profile.id);
  await admin.from("subscriptions").insert({profile_id:profile.id,plan:d.plan,status:"active"});
  await admin.from("links").delete().eq("profile_id",profile.id);
  await admin.from("links").insert([
    {profile_id:profile.id,type:"standard",title:"Featured work",url:"https://example.com",position:0,is_enabled:true},
    {profile_id:profile.id,type:"social",title:"Instagram",url:"https://instagram.com",position:1,is_enabled:true},
    {profile_id:profile.id,type:"email",title:"Contact",url:`mailto:${email}`,position:2,is_enabled:true}
  ]);
  await admin.from("products").delete().eq("profile_id",profile.id);
  if(d.plan!=="free")await admin.from("products").insert({profile_id:profile.id,name:"Creator toolkit",description:"Fictional development seed product. No real person or business is represented.",price:250,currency:"ETB",kind:"digital_file",is_active:false});
  console.log(`Seeded /${d.username}`);
}
console.log("Demo seed complete. Products remain unpublished until a private file is attached and checkout is configured.");
