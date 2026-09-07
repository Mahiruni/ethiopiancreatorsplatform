import type { LinkItem, Profile } from "@/types/database";

export const demoProfiles: Array<Profile & { tagline: string; accent: string }> = [
  { id:"demo-1", user_id:"demo", username:"selamstudio", display_name:"Selam Studio", bio:"Visual stories, brand systems and creative direction from Addis Ababa.", avatar_url:null, category:"Designer", locale:"en", is_public:true, is_verified:true, theme_id:"minimal", appearance:{}, created_at:"2026-01-01", updated_at:"2026-01-01", tagline:"Design", accent:"#135d44" },
  { id:"demo-2", user_id:"demo", username:"nuhbeats", display_name:"Nuh Beats", bio:"Producer • songwriter • live sessions.", avatar_url:null, category:"Musician", locale:"en", is_public:true, is_verified:false, theme_id:"dark", appearance:{}, created_at:"2026-01-01", updated_at:"2026-01-01", tagline:"Music", accent:"#6e4aa2" },
  { id:"demo-3", user_id:"demo", username:"meroncodes", display_name:"Meron Codes", bio:"Frontend engineer, mentor and open-source builder.", avatar_url:null, category:"Freelancer", locale:"en", is_public:true, is_verified:true, theme_id:"professional", appearance:{}, created_at:"2026-01-01", updated_at:"2026-01-01", tagline:"Technology", accent:"#1b5e7a" },
  { id:"demo-4", user_id:"demo", username:"bunaandco", display_name:"Buna & Co.", bio:"Small-batch Ethiopian coffee, gifts and café experiences.", avatar_url:null, category:"Business", locale:"en", is_public:true, is_verified:false, theme_id:"elegant", appearance:{}, created_at:"2026-01-01", updated_at:"2026-01-01", tagline:"Business", accent:"#8b5e3c" }
];

export const demoLinks: LinkItem[] = [
  { id:"d1", profile_id:"demo-1", type:"standard", title:"View selected work", url:"https://example.com", icon:"briefcase", thumbnail_url:null, position:0, is_enabled:true, starts_at:null, ends_at:null, metadata:{} },
  { id:"d2", profile_id:"demo-1", type:"social", title:"Instagram", url:"https://instagram.com", icon:"instagram", thumbnail_url:null, position:1, is_enabled:true, starts_at:null, ends_at:null, metadata:{} },
  { id:"d3", profile_id:"demo-1", type:"payment", title:"Support my work", url:"https://example.com/pay", icon:"wallet", thumbnail_url:null, position:2, is_enabled:true, starts_at:null, ends_at:null, metadata:{} }
];
