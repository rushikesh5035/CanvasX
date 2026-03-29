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

export const metadata: Metadata = generatePageMetadata("/signup");

interface RateLimitError {
  error: string;
  retryAfter?: number;
}

function getRateLimitMessage(data: RateLimitError): string {
  const retryAfter = data?.retryAfter;
  const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;
  return `Too many registration attempts. You can register 3 accounts per hour. Please try again in ${minutes} minutes.`;
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordsMatch = password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!passwordsMatch) return setError("Passwords do not match");
    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        if (res.status === 429) {
          setError(getRateLimitMessage(data));
        } else {
          setError(data?.error || "Registration failed");
        }
        return;
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch {
      setError("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md space-y-6 sm:p-8"
      >
        <div className="item-center flex justify-center">
          <Logo />
        </div>
        <h1 className="text-card-foreground text-center text-xl font-bold sm:text-2xl">
          Sign Up
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

        <form onSubmit={handleSignup} className="space-y-3.5">
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-background/50 rounded-lg"
          />
          {!passwordsMatch && confirmPassword && (
            <p className="text-destructive text-sm">Passwords do not match.</p>
          )}
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-lg font-medium shadow-md"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
