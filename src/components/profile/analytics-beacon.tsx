"use client";
import { useEffect } from "react";
export function AnalyticsBeacon({profileId}:{profileId:string}){useEffect(()=>{if(!/^[0-9a-f-]{36}$/i.test(profileId))return;const body=JSON.stringify({type:"profile_view",profileId,referrer:document.referrer||null});if(navigator.sendBeacon){navigator.sendBeacon("/api/events",new Blob([body],{type:"application/json"}));}else{void fetch("/api/events",{method:"POST",headers:{"content-type":"application/json"},body,keepalive:true});}},[profileId]);return null}
