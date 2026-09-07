import Link from "next/link";

export function Logo({ compact=false }: { compact?: boolean }) {
  return <Link href="/" className="inline-flex items-center gap-2.5 font-bold tracking-[-.035em]" aria-label="Linqo home">
    <span className="grid size-9 place-items-center rounded-[13px] bg-[#0d5b42] text-[15px] font-extrabold text-white shadow-[0_8px_20px_rgba(13,91,66,.16)]">L</span>
    {!compact && <span className="text-xl leading-none">Linqo</span>}
  </Link>;
}
