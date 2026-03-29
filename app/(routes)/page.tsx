import { Metadata } from "next";

import Footer from "@/components/common/footer";
import HeroSection from "@/components/common/hero-section";
import { generatePageMetadata, jsonLdFAQ, jsonLdHome } from "@/config/meta";

export const metadata: Metadata = generatePageMetadata("/");

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <div className="min-h-screen w-full">
        <HeroSection />
        <Footer />
      </div>
    </>
  );
}
