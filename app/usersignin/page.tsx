"use client";
import React, { useEffect } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/app/lib/utils";
import {
  IconBrandGoogle,
} from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../component/Navbar";

export default function SignupFormDemo() {
  const router = useRouter();
  const { data: session, status } = useSession();
  React.useEffect(() => {
    if (status === 'authenticated') {
      console.log('✅ Already signed in, redirecting...');
      router.push('/dashboard');
      router.refresh();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 Google SignIn triggered");

    // ✅ Remove redirect: false - let NextAuth auto-redirect
    const resp = await signIn("google", {
      callbackUrl: "/dashboard"
    });

    console.log("SignIn response:", resp);
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center mt-40">
        <div className="max-w-md w-full rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-black">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-40">
        <div className="max-w-md w-full rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Welcome to PPTPAL
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Login to create a room for your section and share all your ppts
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            <div className="flex flex-col space-y-4">
              <button
                className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="submit"
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Continue With Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center">
            <h4>
              For Room Login <a className="font-semibold underline" href="/roomsignin">Click Here</a>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
