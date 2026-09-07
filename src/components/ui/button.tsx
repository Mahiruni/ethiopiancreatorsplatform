import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold tracking-[-.01em] transition duration-200 active:scale-[.985] disabled:pointer-events-none disabled:opacity-50";
const variants = {
  primary: "bg-[#0d5b42] text-white shadow-[0_10px_26px_rgba(13,91,66,.14)] hover:-translate-y-0.5 hover:bg-[#0a4e39] hover:shadow-[0_14px_30px_rgba(13,91,66,.18)]",
  secondary: "border border-black/[.09] bg-[#fffef9] text-[#10130f] shadow-[0_8px_24px_rgba(22,35,28,.05)] hover:-translate-y-0.5 hover:border-black/[.14] hover:bg-white",
  ghost: "text-[#445049] hover:bg-black/[.04] hover:text-[#10130f]",
  danger: "bg-[#b44343] text-white hover:bg-[#9d3737]"
};

export function Button({ variant="primary", className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ href, children, variant="primary", className="" }: { href:string; children:ReactNode; variant?: keyof typeof variants; className?:string }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} href={href}>{children}</Link>;
}
