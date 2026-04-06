export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({ name, description, price, image, url }: {
  name: string; description: string; price: number; image?: string; url: string;
}) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Product",
    name, description, image: image || "/og-image.jpg", url,
    offers: { "@type": "Offer", price, priceCurrency: "VND", availability: "https://schema.org/InStock" },
  }} />;
}

export function ArticleJsonLd({ title, description, author, datePublished, url, image }: {
  title: string; description: string; author: string; datePublished: string; url: string; image?: string;
}) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title, description, author: { "@type": "Person", name: author },
    datePublished, url, image: image || "/og-image.jpg",
    publisher: { "@type": "Organization", name: "PromptVN", url: "https://khopromt.pro" },
  }} />;
}
