import { SessionProvider } from "next-auth/react";
import { Jost } from "next/font/google";

import InteractiveDotCanvas from "@/components/common/InteractiveDotCanvas";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { jsonLd, metadata as siteMetadata } from "@/config/meta";
import { QueryProvider } from "@/context/query-provider";

import "./globals.css";

const jostSans = Jost({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
