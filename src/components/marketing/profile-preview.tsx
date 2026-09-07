"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Camera, MessageCircle, Music2, ShoppingBag, WalletCards, ArrowUpRight, Sparkles } from "lucide-react";

const links = [
  { icon: ShoppingBag, title: "Design templates", meta: "New collection" },
  { icon: MessageCircle, title: "Work with me", meta: "Brand & product design" },
  { icon: WalletCards, title: "Support my work", meta: "ETB payment options" },
];

export function HeroProfilePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[470px] py-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 18, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -3.2 }}
        transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-20 hidden w-44 rounded-[24px] border border-black/[.08] bg-[#fffef9] p-4 shadow-[0_24px_60px_rgba(27,42,34,.12)] sm:block"
      >
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.12em] text-[#6b756f]"><span>This week</span><Sparkles size={13} className="text-[#0d5b42]"/></div>
        <div className="mt-4 text-3xl font-semibold tracking-[-.05em] text-[#10130f]">1,284</div>
        <div className="mt-1 text-xs text-[#77807a]">profile views</div>
        <div className="mt-4 flex h-9 items-end gap-1.5">
          {[32,44,38,62,54,78,88].map((h,i)=><span key={i} className="flex-1 rounded-full bg-[#0d5b42]" style={{height:`${h}%`,opacity:.22 + i*.08}} />)}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7, delay: .06, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-[356px] rounded-[42px] border border-black/10 bg-[#111512] p-[7px] shadow-[0_42px_120px_rgba(20,35,27,.24)]"
      >
        <div className="relative overflow-hidden rounded-[35px] bg-[#fbf8ef] px-5 pb-5 pt-4 text-center">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_50%_-10%,rgba(223,243,106,.72),transparent_72%)]" />
          <div className="relative mx-auto mt-3 grid size-20 place-items-center rounded-full bg-[#0d5b42] text-2xl font-bold text-white ring-[5px] ring-[#fbf8ef]">SA</div>
          <div className="relative mt-4 flex items-center justify-center gap-1.5">
            <h3 className="text-xl font-bold tracking-[-.03em]">Selam Abebe</h3>
            <BadgeCheck className="fill-[#0d5b42] text-[#fbf8ef]" size={18}/>
          </div>
          <p className="relative mx-auto mt-2 max-w-[270px] text-[13px] leading-5 text-[#667069]">Designer, storyteller and creative educator in Addis Ababa.</p>
          <div className="relative mt-4 flex justify-center gap-2">
            {[Camera, Music2, MessageCircle].map((Icon,i)=><span key={i} className="grid size-9 place-items-center rounded-full border border-black/[.08] bg-white/70 text-[#29322d]"><Icon size={17}/></span>)}
          </div>

          <div className="relative mt-6 space-y-2.5 text-left">
            {links.map(({ icon: Icon, title, meta }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .22 + i*.07 }}
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 rounded-[19px] border border-black/[.07] bg-white/85 p-3 shadow-[0_10px_30px_rgba(25,38,31,.045)]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#e8f0eb] text-[#0d5b42]"><Icon size={18}/></span>
                <span className="min-w-0 flex-1"><b className="block truncate text-[13px]">{title}</b><span className="text-[11px] text-[#79817c]">{meta}</span></span>
                <ArrowUpRight size={15} className="text-[#9aa09c]"/>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-3 grid grid-cols-2 gap-2.5 text-left">
            <div className="rounded-[19px] bg-[#e7d6b8] p-2.5">
              <div className="aspect-[4/3] rounded-[14px] bg-[radial-gradient(circle_at_30%_25%,#fff4d7,#b98f5f)]"/>
              <b className="mt-2 block text-[11px]">Brand kit</b><span className="text-[10px] text-[#675b4c]">ETB 590</span>
            </div>
            <div className="rounded-[19px] bg-[#d7e7de] p-2.5">
              <div className="aspect-[4/3] rounded-[14px] bg-[radial-gradient(circle_at_68%_25%,#f2fff6,#6da78c)]"/>
              <b className="mt-2 block text-[11px]">Creator guide</b><span className="text-[10px] text-[#50645a]">ETB 240</span>
            </div>
          </div>
          <div className="relative mt-4 text-[10px] font-bold uppercase tracking-[.13em] text-[#8a918d]">Made with Linqo</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: .65, delay: .12, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 right-0 z-20 hidden w-48 rounded-[24px] border border-black/[.08] bg-[#0b4936] p-4 text-white shadow-[0_26px_70px_rgba(17,49,37,.24)] sm:block"
      >
        <div className="text-[10px] font-bold uppercase tracking-[.13em] text-white/55">Latest sale</div>
        <div className="mt-3 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[14px] bg-white/10"><ShoppingBag size={18}/></span><div><b className="block text-sm">ETB 590</b><span className="text-[11px] text-white/60">Brand kit</span></div></div>
      </motion.div>
    </div>
  );
}
