"use client";

import { Suspense, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams.get("checkout_id");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mx-auto w-full max-w-md text-center">
        <CardContent className="space-y-6 pt-8 pb-8">
          {isVerifying ? (
            <>
              <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
              <h2 className="text-xl font-semibold">
                Verifying your payment...
              </h2>
              <p className="text-muted-foreground text-sm">
                Please wait while we confirm your subscription.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold">Payment Successful! 🎉</h2>
              <p className="text-muted-foreground">
                Your subscription is now active. Enjoy your upgraded CanvasX
                experience!
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => router.push("/")} size="lg">
                  Start Designing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/projects")}
                >
                  Go to Projects
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          }
        >
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </>
  );
}
