export const siteConfig = {
  name: "CanvasX",
  title: "CanvasX — AI-Powered Mobile App Design Platform",
  description:
    "Transform ideas into stunning mobile UI screens in minutes with AI. Design, iterate, and export professional app mockups without coding. Free to start.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://canvasx.rushikesh-dev.xyz/",
  ogImage: "/meta/og-home.png",
  author: {
    name: "Rushikesh Tele",
    twitter: "@rushikesh_tele",
    github: "rushikesh5035",
    linkedin: "rushikeshtele5035",
    email: "telerushikesh61@gmail.com",
  },
  keywords: [
    "ai design tool",
    "mobile app mockup",
    "ui design generator",
    "app prototype maker",
    "ai-powered design",
    "mobile ui builder",
    "no-code design tool",
    "app design automation",
    "ui screen generator",
    "mobile design ai",
    "canvasx",
    "ai mockup generator",
    "mobile app ui design",
    "design tool online",
    "gemini ai design",
    "rapid prototyping tool",
    "mobile interface design",
    "app ui generator",
  ],
};

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
}

export const pageMetadata: Record<string, PageMeta> = {
  "/": {
    title: "CanvasX — AI-Powered Mobile App Design in Seconds",
    description:
      "Transform your ideas into stunning mobile UI screens in minutes with AI. Design, iterate, and export professional app mockups. Built with Google Gemini AI. Free to start.",
    keywords: [
      "ai design tool",
      "mobile app mockup",
      "ui design generator",
      "app prototype",
      "gemini ai design",
      "free design tool",
      "mobile ui builder",
    ],
    ogImage: "/meta/og-home.png",
    twitterCard: "summary_large_image",
  },
  "/pricing": {
    title: "Pricing Plans — CanvasX",
    description:
      "Choose the perfect plan for your design needs. From free to unlimited, CanvasX offers flexible pricing for individuals and professionals. Start creating stunning mobile app designs today.",
    keywords: [
      "canvasx pricing",
      "ai design tool pricing",
      "mobile app design plans",
      "design tool subscription",
      "free design tool",
    ],
    ogImage: "/meta/og-pricing.png",
    twitterCard: "summary_large_image",
  },
  "/signin": {
    title: "Sign In — CanvasX",
    description:
      "Sign in to your CanvasX account to access your AI-powered mobile app design projects.",
    ogImage: "/meta/og-signin.png",
    twitterCard: "summary_large_image",
    noIndex: true,
  },
  "/signup": {
    title: "Sign Up — CanvasX | Get Started Free",
    description:
      "Create your free CanvasX account. Start designing beautiful mobile app UIs with AI. No credit card required. Get started in seconds.",
    ogImage: "/meta/og-signup.png",
    twitterCard: "summary_large_image",
  },
  "/projects": {
    title: "My Projects — CanvasX",
    description:
      "View and manage your AI-generated mobile app design projects.",
    noIndex: true,
  },
};

export function getPageMeta(pathname: string): PageMeta {
  return pageMetadata[pathname] || pageMetadata["/"];
}

export function generatePageMetadata(pathname: string) {
  const meta = getPageMeta(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords?.join(", "),
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    openGraph: {
      type: "website" as const,
      locale: "en_US",
      url: `${siteConfig.url}${pathname}`,
      title: meta.title,
      description: meta.description,
      siteName: siteConfig.name,
      images: [
        {
          url: meta.ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: meta.twitterCard || "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: siteConfig.author.twitter,
      images: [meta.ogImage || siteConfig.ogImage],
    },
    robots: meta.noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },
  };
}

// JSON-LD structured data for homepage
export const jsonLdHome = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript. Modern browser required.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  creator: {
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    sameAs: [
      `https://twitter.com/${siteConfig.author.twitter}`,
      `https://github.com/${siteConfig.author.github}`,
      `https://linkedin.com/in/${siteConfig.author.linkedin}`,
    ],
  },
  featureList: [
    "AI-powered mobile app design",
    "Real-time screen generation",
    "Multiple design themes",
    "Interactive canvas editor",
    "Export and screenshot capabilities",
    "Project management",
  ],
  screenshot: `${siteConfig.url}/meta/og-home.png`,
};

// FAQ structured data
export const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CanvasX?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CanvasX is an AI-powered mobile app design platform that helps you create beautiful, professional mobile UI screens in minutes. Simply describe what you want, and our AI generates production-ready designs using Google Gemini.",
      },
    },
    {
      "@type": "Question",
      name: "Is CanvasX free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! CanvasX offers a free tier with 2 projects, 5 screens per project, 3 themes, and 10 AI generations per month. Perfect for getting started with AI-powered design.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI design generation work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply describe your app idea or specific screen in natural language. Our AI analyzes your requirements, selects appropriate themes, and generates pixel-perfect HTML/CSS mobile UI screens in 30-90 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export my designs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can export your designs as high-quality PNG screenshots or access the raw HTML/CSS code. All designs are production-ready and mobile-optimized.",
      },
    },
  ],
};

export default siteConfig;
