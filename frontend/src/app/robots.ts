import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://app.vayukrishi.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/en/", "/hi/", "/mr/", "/gu/", "/ta/", "/kn/"],
        disallow: [
          "/api/",
          "/*/(overview|crop-recommendation|disease-detection|assistant|market|farm-health|planner|schemes|analytics|profile|settings)/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
