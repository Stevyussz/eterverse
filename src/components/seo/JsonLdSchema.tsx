export function JsonLdSchema({ server }: { server: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: server.name,
    operatingSystem: "Java, Bedrock",
    applicationCategory: "GameApplication",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: server.metrics.rating,
      ratingCount: server.metrics.votes > 0 ? server.metrics.votes : 1, // Avoid 0 for Google schema validation
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    description: server.description,
    url: `https://eterverse.com/server/${server.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
