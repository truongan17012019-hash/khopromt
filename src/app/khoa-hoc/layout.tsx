import type { Metadata } from "next";
import { getCoursePageSettings } from "@/lib/server/course-page-settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getCoursePageSettings();
  const desc =
    s.hero.intro.length > 160 ? `${s.hero.intro.slice(0, 157)}…` : s.hero.intro;
  return {
    title: s.hero.title,
    description: desc,
    openGraph: {
      title: `${s.hero.title} | PromptVN`,
      description: desc,
    },
  };
}

export default function KhoaHocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
