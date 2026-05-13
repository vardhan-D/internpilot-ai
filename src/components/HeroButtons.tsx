"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HeroButtons({ userId }: { userId: string | null }) {
  if (!userId) {
    return (
      <>
        <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
          <button className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200">
            Get Started
          </button>
        </SignInButton>

        <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
          <button className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-900">
            Create Account
          </button>
        </SignUpButton>
      </>
    );
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Go to Dashboard
      </Link>

      <Link
        href="/upload-resume"
        className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-900"
      >
        Upload Resume
      </Link>
    </>
  );
}