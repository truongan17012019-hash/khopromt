import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Trợ lý AI | PromptVN",
  description: "Chat với Trợ lý AI thông minh của PromptVN. Nhớ ngữ cảnh cuộc trò chuyện, xuất kết quả ra file. Miễn phí.",
  openGraph: {
    title: "Trợ lý AI | PromptVN",
    description: "Chat với AI thông minh — Nhớ ngữ cảnh cuộc trò chuyện",
    url: "https://khopromt.pro/tro-ly-ao",
    images: [{ url: "/og-tro-ly-ao.jpg", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PromptVN AI Assistant",
  applicationCategory: "UtilityApplication",
  description: "AI chatbot with conversation memory",
  url: "https://khopromt.pro/tro-ly-ao",
  offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  operatingSystem: "Web",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={jsonLd} />{children}</>;
}
