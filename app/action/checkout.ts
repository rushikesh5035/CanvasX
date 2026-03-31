"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function redirectToCheckout(productId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const checkoutUrl = new URL(
    "/api/checkout",
    process.env.NEXT_PUBLIC_APP_URL!
  );
  checkoutUrl.searchParams.set("products", productId);
  checkoutUrl.searchParams.set("customerEmail", session.user.email || "");

  redirect(checkoutUrl.toString());
}

export async function redirectToPortal() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  redirect("/api/portal");
}
