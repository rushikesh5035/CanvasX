import { Metadata } from "next";

import { generatePageMetadata } from "@/config/meta";

export const metadata: Metadata = generatePageMetadata("/signin");

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
