import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://app.vayukrishi.in";

interface GenerateMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: string;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
  locale = "en",
}: GenerateMetadataOptions): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const fullTitle = `${title} | Vayukrishi`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        hi: `${BASE_URL}/hi${path}`,
        mr: `${BASE_URL}/mr${path}`,
        gu: `${BASE_URL}/gu${path}`,
        ta: `${BASE_URL}/ta${path}`,
        kn: `${BASE_URL}/kn${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Vayukrishi",
      locale,
      type: "website",
      images: [
        {
          url: `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${BASE_URL}${image}`],
      creator: "@vayukrishi",
      site: "@vayukrishi",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" },
    },
  };
}
