import { MetadataRoute } from "next";

import { siteConfig } from "@/config/meta";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/projects/", "/project/", "/signin", "/signup"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
