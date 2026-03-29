import { Metadata } from "next";

import { generatePageMetadata } from "@/config/meta";

export const metadata: Metadata = generatePageMetadata("/signup");

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
