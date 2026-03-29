"use client";

import { useState } from "react";

import { Metadata } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { motion } from "motion/react";

import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePageMetadata } from "@/config/meta";

export const metadata: Metadata = generatePageMetadata("/signin");

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md space-y-6 sm:p-8"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-card-foreground text-center text-xl font-bold sm:text-2xl">
          Welcome back
        </h1>

        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-lg font-medium"
          variant="outline"
        >
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border/60 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card/70 text-muted-foreground px-3">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-3.5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/50 rounded-lg"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background/50 rounded-lg"
          />
          <Button
            type="submit"
            className="w-full rounded-lg font-medium shadow-md"
          >
            Sign In
          </Button>
        </form>

        <div className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Create new
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
