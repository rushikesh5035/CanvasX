"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        // Check for rate limit error
        if (res.status === 429) {
          setError(getRateLimitMessage(data));
        } else {
          setError(data?.error || "Registration failed");
        }
        return;
      }

      // Auto sign-in after successful registration
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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h1 className="text-center text-2xl font-bold">Sign Up</h1>

        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full"
          variant="outline"
        >
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {!passwordsMatch && (
            <div className="text-sm text-red-500">Passwords do not match.</div>
          )}
          {error && (
            <div className="text-sm text-red-500" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
