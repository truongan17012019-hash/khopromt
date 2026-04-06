import { getCoursePageSettings } from "@/lib/server/course-page-settings";
import KhoaHocPageClient from "./KhoaHocPageClient";

export default async function KhoaHocPage() {
  const settings = await getCoursePageSettings();
  return <KhoaHocPageClient settings={settings} />;
}
