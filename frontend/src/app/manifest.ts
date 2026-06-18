import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vayukrishi — Predictive Agricultural Intelligence",
    short_name: "Vayukrishi",
    description: "AI-driven crop planning, disease prediction, and market forecasting for Indian farmers",
    start_url: "/en/overview",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#10b981",
    categories: ["agriculture", "productivity", "utilities"],
    lang: "en",
    icons: [
      { src: "/icons/icon-72.png", sizes: "72x72", type: "image/png" },
      { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
      { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
      { src: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    screenshots: [
      { src: "/screenshots/dashboard.png", sizes: "1280x720", type: "image/png", label: "Farm Dashboard" },
      { src: "/screenshots/mobile-overview.png", sizes: "390x844", type: "image/png", label: "Mobile Overview", form_factor: "narrow" },
    ],
    shortcuts: [
      { name: "Crop Recommendation", url: "/en/crop-recommendation", description: "Get AI crop advice" },
      { name: "Disease Detection", url: "/en/disease-detection", description: "Upload plant photo for diagnosis" },
      { name: "Market Prices", url: "/en/market", description: "Live mandi prices" },
    ],
  };
}
