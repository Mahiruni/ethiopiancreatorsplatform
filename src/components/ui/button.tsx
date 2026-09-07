import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";
const variants = {
  primary: "bg-[#135d44] text-white hover:bg-[#0f5039]",
  secondary: "border border-black/10 bg-white text-[#141816] hover:bg-black/[.03]",
  ghost: "text-[#3f4944] hover:bg-black/[.04]",
  danger: "bg-[#b44343] text-white hover:bg-[#9d3737]"
};

export function Button({ variant="primary", className="", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ href, children, variant="primary", className="" }: { href:string; children:ReactNode; variant?: keyof typeof variants; className?:string }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} href={href}>{children}</Link>;
}
