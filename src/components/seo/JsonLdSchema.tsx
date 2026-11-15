const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eterverse.vercel.app";

import { toSafeJsonLd } from "@/lib/json-ld";

export function JsonLdSchema({ server, ratingCount = 0 }: { server: any; ratingCount?: number }) {
  const defaultBanner = `${SITE_URL}/og-image.jpg`;
  // Google treats invented ratings as spammy structured data (manual action risk). Only
  // real ratings are published: the old fallback claimed 5.0 and counted votes as reviews.
  const hasRatings = ratingCount > 0 && Number(server.metrics?.rating) > 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: server.name,
    headline: `${server.name} - Server Minecraft Indonesia`,
    operatingSystem: "Java Edition, Bedrock Edition",
    applicationCategory: "GameApplication",
    applicationSubCategory: "Minecraft Multiplayer Server",
    genre: ["Minecraft", "Sandbox", "Multiplayer", ...(server.tags || [])],
    image: server.bannerUrl || server.logoUrl || defaultBanner,
    screenshot: server.galleryUrls?.length > 0 ? server.galleryUrls : [server.bannerUrl || defaultBanner],
    description: server.description || `Server Minecraft ${server.name}. Main sekarang dengan IP ${server.ipAddress}.`,
    url: `${SITE_URL}/server/${server.slug}`,
    ...(hasRatings && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(server.metrics.rating).toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount,
      },
    }),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Organization",
      name: "EterVerse",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toSafeJsonLd(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EterVerse",
    alternateName: ["EterVerse Minecraft", "EterVerse Server List"],
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/discover?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toSafeJsonLd(schema) }}
    />
  );
}
