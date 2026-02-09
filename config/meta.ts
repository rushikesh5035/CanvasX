import { Metadata } from "next";

// Base site configuration
const siteConfig = {
  name: "CanvasX",
  title: "CanvasX - AI-Powered Mobile App Design Platform",
  description:
    "Design beautiful mobile app mockups in minutes with AI. Transform your ideas into stunning mobile UI screens through natural conversation. Create, iterate, and export professional app designs instantly.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: `meta/og-image.png`,
  keywords: [
    "AI design",
    "mobile app mockup",
    "UI design tool",
    "app prototype",
    "design automation",
    "AI-powered design",
    "mobile UI generator",
    "app screen design",
    "no-code design",
    "rapid prototyping",
    "design assistant",
    "mockup generator",
    "mobile app builder",
    "UI/UX design",
    "screen design",
    "app design tool",
    "AI design assistant",
    "Next.js design tool",
    "responsive design",
    "mobile interface design",
  ],
  authors: [
    {
      name: "Rushikesh Tele",
      twitter: "@rushikesh_tele",
      github: "rushikesh5035",
      linkedin: "rushikeshtele5035",
      email: "telerushikesh61@gmail.com",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  ],
  creator: "Rushikesh Tele",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
  classification: "Design Tool",
  applicationName: siteConfig.name,
};

// Additional configuration for dynamic page metadata
export const generateProjectMetadata = (projectName: string): Metadata => {
  return {
    title: `${projectName} - Project`,
    description: `Edit and design ${projectName} with CanvasX's AI-powered mobile app design tool.`,
    openGraph: {
      title: `${projectName} - Project`,
      description: `Edit and design ${projectName} with CanvasX's AI-powered mobile app design tool.`,
      url: `${siteConfig.url}/project/${projectName}`,
    },
  };
};

// JSON-LD structured data for SEO
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  creator: {
    "@type": "Organization",
    name: siteConfig.creator,
  },
  featureList: [
    "AI-powered mobile app design",
    "Real-time screen generation",
    "Multiple design themes",
    "Interactive canvas editor",
    "Export and screenshot capabilities",
    "Project management",
    "Responsive mobile frames",
  ],
};

export default siteConfig;
