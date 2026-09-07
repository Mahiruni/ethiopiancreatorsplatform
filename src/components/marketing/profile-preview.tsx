"use client";
import { motion } from "framer-motion";
import { BadgeCheck, Camera, MessageCircle, Music2, ShoppingBag, WalletCards } from "lucide-react";

export function HeroProfilePreview(){
  return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55}} className="relative mx-auto w-full max-w-[390px] rounded-[38px] border border-black/10 bg-[#171a18] p-2 shadow-[0_36px_100px_rgba(20,35,27,.22)]">
    <div className="overflow-hidden rounded-[31px] bg-[#f8f4ec] p-5 text-center">
      <div className="mx-auto mt-3 grid size-20 place-items-center rounded-full bg-[#135d44] text-2xl font-bold text-white ring-4 ring-white">SA</div>
      <div className="mt-4 flex items-center justify-center gap-1.5"><h3 className="text-xl font-bold tracking-tight">Selam Abebe</h3><BadgeCheck className="fill-[#135d44] text-white" size={18}/></div>
      <p className="mx-auto mt-2 max-w-[280px] text-sm leading-5 text-[#65706b]">Designer, storyteller and creative educator in Addis Ababa.</p>
      <div className="mt-4 flex justify-center gap-3 text-[#303733]"><Camera size={20}/><Music2 size={20}/><MessageCircle size={20}/></div>
      <div className="mt-6 space-y-3 text-left">
        {[{icon:ShoppingBag,title:"Explore my design templates",meta:"New collection"},{icon:MessageCircle,title:"Work with me",meta:"Brand & product design"},{icon:WalletCards,title:"Support my work",meta:"Local payment options"}].map(({icon:Icon,title,meta})=><motion.div whileHover={{scale:1.015}} key={title} className="flex items-center gap-3 rounded-2xl border border-black/[.07] bg-white p-3 shadow-sm"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef4ef]"><Icon size={19}/></span><span className="min-w-0"><b className="block truncate text-sm">{title}</b><span className="text-xs text-[#77807b]">{meta}</span></span></motion.div>)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#e5d5b7] p-3 text-left"><div className="aspect-[4/3] rounded-xl bg-[radial-gradient(circle_at_30%_30%,#f8ead0,#bc9564)]"/><b className="mt-2 block text-xs">Brand kit</b><span className="text-[11px] text-[#675b4c]">ETB 590</span></div><div className="rounded-2xl bg-[#d5e5dd] p-3 text-left"><div className="aspect-[4/3] rounded-xl bg-[radial-gradient(circle_at_65%_30%,#eaf6ef,#70a88e)]"/><b className="mt-2 block text-xs">Creator guide</b><span className="text-[11px] text-[#50645a]">ETB 240</span></div></div>
      <div className="mt-5 text-[11px] font-semibold text-[#7a817d]">Made with Linqo</div>
    </div>
  </motion.div>
}
