import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Jost } from "next/font/google";

import InteractiveDotCanvas from "@/components/common/InteractiveDotCanvas";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import siteConfig, { generatePageMetadata } from "@/config/meta";
import { QueryProvider } from "@/context/query-provider";

import "./globals.css";

const jostSans = Jost({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...generatePageMetadata("/"),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jostSans.className} antialiased`}>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <InteractiveDotCanvas />
              {children}
              <Toaster richColors position="bottom-center" />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
