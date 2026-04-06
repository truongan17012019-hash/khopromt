import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Nâng Cấp Prompt AI | PromptVN",
  description: "Biến prompt thô thành prompt chuyên nghiệp với AI. Hỗ trợ ChatGPT, Claude, Midjourney, DALL-E, Gemini. Công thức CREAD, Interactive Mode, 16+ Templates.",
  openGraph: {
    title: "Nâng Cấp Prompt AI | PromptVN",
    description: "Biến prompt thô thành prompt chuyên nghiệp với AI — Kết quả tốt hơn 10x",
    url: "https://khopromt.pro/nang-cap-prompt",
    images: [{ url: "/og-prompt-enhancer.jpg", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PromptVN Prompt Enhancer",
  applicationCategory: "UtilityApplication",
  description: "AI-powered prompt enhancement tool",
  url: "https://khopromt.pro/nang-cap-prompt",
  offers: { "@type": "Offer", price: "2000", priceCurrency: "VND" },
  operatingSystem: "Web",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
