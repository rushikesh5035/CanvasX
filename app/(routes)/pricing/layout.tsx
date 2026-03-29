import { Metadata } from "next";

import { generatePageMetadata } from "@/config/meta";

export const metadata: Metadata = generatePageMetadata("/pricing");

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
