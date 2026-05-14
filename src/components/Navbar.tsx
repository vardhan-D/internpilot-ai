"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload-resume", label: "Upload Resume" },
  { href: "/analysis", label: "Analysis" },
  { href: "/projects", label: "Projects" },
  { href: "/tracker", label: "Tracker" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 text-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          InternPilot AI
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <UserButton />
        </div>
      </nav>
    </header>
  );
}