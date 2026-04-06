export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";
import { getSeoSettings } from "@/lib/server/seo-settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const baseUrl = seo.base_url;
  const ogImage = seo.default_og_image || "/og-image.jpg";

  return {
    title: {
      default: seo.default_title,
      template: `%s | ${seo.site_name}`,
    },
    description: seo.default_description,
    keywords: [
      "prompt ai", "mua prompt", "chatgpt prompt", "midjourney prompt",
      "claude prompt", "prompt viet nam", "ai prompt marketplace",
      "mau prompt", "prompt tieng viet", "nang cap prompt", "tro ly ai",
    ],
    authors: [{ name: seo.site_name }],
    creator: seo.site_name,
    ...(seo.google_verification
      ? { verification: { google: seo.google_verification } }
      : {}),
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: baseUrl,
      siteName: seo.site_name,
      title: seo.default_title,
      description: seo.default_description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.site_name} - AI Prompt Marketplace`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.default_title,
      description: seo.default_description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    metadataBase: new URL(baseUrl),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSeoSettings();
  const baseUrl = seo.base_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.site_name,
    url: baseUrl,
    description: seo.default_description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/danh-muc?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.site_name,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Vietnamese", "English"],
    },
  };

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
