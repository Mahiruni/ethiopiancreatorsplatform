import Link from "next/link";
export function Logo({ compact=false }: { compact?: boolean }) {
  return <Link href="/" className="inline-flex items-center gap-2.5 font-bold tracking-[-.03em]" aria-label="Linqo home">
    <span className="grid size-9 place-items-center rounded-xl bg-[#135d44] text-white shadow-sm">L</span>
    {!compact && <span className="text-xl">Linqo</span>}
  </Link>;
}
