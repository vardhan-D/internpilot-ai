"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function AuthButtons({ userId }: { userId: string | null }) {
  if (!userId) {
    return (
      <>
        <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
          <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900">
            Sign In
          </button>
        </SignInButton>

        <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Sign Up
          </button>
        </SignUpButton>
      </>
    );
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Dashboard
      </Link>

      <UserButton />
    </>
  );
}