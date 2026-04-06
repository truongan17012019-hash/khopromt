"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { courses, Course } from "@/data/courses";
import type { CoursePageSettings, CoursePageStatKey } from "@/data/course-page-marketing";

type ComputedCourseStats = {
  courseCount: number;
  totalLessons: number;
  freeCount: number;
  avgRating: string;
  students: number;
};

const tierColors: Record<string, string> = {
  free: "bg-green-100 text-green-700",
  pro: "bg-blue-100 text-blue-700",
  business: "bg-purple-100 text-purple-700",
};
const tierLabels: Record<string, string> = {
  free: "Miễn phí",
  pro: "Pro",
  business: "Business",
};
const levelColors: Record<string, string> = {
  "Cơ bản": "bg-emerald-100 text-emerald-700",
  "Trung cấp": "bg-amber-100 text-amber-700",
  "Nâng cao": "bg-red-100 text-red-700",
  "Cơ bản - Trung cấp": "bg-teal-100 text-teal-700",
  "Trung cấp - Nâng cao": "bg-orange-100 text-orange-800",
};

const OUTCOME_ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  zap: Zap,
  target: Target,
  layers: Layers,
  sparkles: Sparkles,
  bookopen: BookOpen,
  users: Users,
  graduationcap: GraduationCap,
  compass: Compass,
};

function resolveIcon(name: string): LucideIcon {
  const k = name.trim().toLowerCase().replace(/\s+/g, "");
  return OUTCOME_ICONS[k] || Brain;
}

function CtaLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function statNumber(key: CoursePageStatKey, computed: ComputedCourseStats) {
  switch (key) {
    case "courseCount":
      return String(computed.courseCount);
    case "totalLessons":
      return String(computed.totalLessons);
    case "avgRating":
      return computed.avgRating;
    case "freeCount":
      return String(computed.freeCount);
    default:
      return "";
  }
}

function useCourseStats(): ComputedCourseStats {
  return useMemo(() => {
    const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);
    const freeCount = courses.filter((c) => c.tier === "free").length;
    const avgRating =
      courses.reduce((s, c) => s + c.rating, 0) / Math.max(courses.length, 1);
    const students = courses.reduce((s, c) => s + c.students, 0);
    return {
      courseCount: courses.length,
      totalLessons,
      freeCount,
      avgRating: avgRating.toFixed(1),
      students,
    };
  }, []);
}

export default function KhoaHocPageClient({ settings }: { settings: CoursePageSettings }) {
  const [level, setLevel] = useState("all");
  const [tier, setTier] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const computedStats = useCourseStats();

  const filtered = courses.filter((c) => {
    if (level !== "all" && c.level !== level) return false;
    if (tier !== "all" && c.tier !== tier) return false;
    return true;
  });

  const footerHtml = settings.audienceBox.footerHtml.replace(
    /\{\{students\}\}/g,
    computedStats.students.toLocaleString("vi-VN")
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-primary-100 ring-1 ring-white/20 mb-4">
              <GraduationCap className="h-4 w-4 text-amber-300" />
              {settings.hero.badge}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {settings.hero.title}
            </h1>
            <p className="mt-5 text-lg text-primary-100/95 leading-relaxed">{settings.hero.intro}</p>
            <ul className="mt-6 space-y-2.5 text-sm sm:text-base text-primary-50/95">
              {settings.hero.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink
                href={settings.hero.primaryCta.href}
                label={settings.hero.primaryCta.label}
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow-lg shadow-black/10 hover:bg-primary-50 transition-colors"
              />
              <CtaLink
                href={settings.hero.secondaryCta.href}
                label={settings.hero.secondaryCta.label}
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
            {settings.stats.map((s) => (
              <div
                key={s.label + s.valueKey}
                className="rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-4 backdrop-blur-sm"
              >
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                  {statNumber(s.valueKey, computedStats)}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-primary-200 mt-1">
                  {s.label}
                </div>
                <div className="text-xs text-primary-100/80 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {settings.outcomesSection.heading}
          </h2>
          <p
            className="mt-3 text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: settings.outcomesSection.subheading.replace(
                /\*\*(.+?)\*\*/g,
                "<strong>$1</strong>"
              ),
            }}
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {settings.outcomes.map((o) => {
            const Icon = resolveIcon(o.icon);
            return (
              <div
                key={o.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display font-bold text-slate-900">{o.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{o.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200/80 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-primary-600 uppercase tracking-wide">
                {settings.pathsSection.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {settings.pathsSection.title}
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">{settings.pathsSection.intro}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Compass className="h-5 w-5 text-primary-500 shrink-0" />
              {settings.pathsSection.asideNote}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {settings.paths.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col"
              >
                <h3 className="font-display text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">{p.desc}</p>
                <ul className="mt-5 space-y-2">
                  {p.topics.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-slate-700">
                      <BookOpen className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              {settings.methodSection.title}
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{settings.methodSection.p1}</p>
            <p className="mt-4 text-slate-600 leading-relaxed">{settings.methodSection.p2}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {settings.methodSection.links.map((link, i) => (
                <span key={`${i}-${link.href}`} className="inline-flex items-center gap-2">
                  {i > 0 ? <span className="text-slate-300 hidden sm:inline">|</span> : null}
                  <Link
                    href={link.href}
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 shadow-xl">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-400" />
              {settings.audienceBox.title}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-200 leading-relaxed">
              {settings.audienceBox.lines.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-amber-400 shrink-0">→</span>
                  {line}
                </li>
              ))}
            </ul>
            <p
              className="mt-6 text-xs text-slate-400 border-t border-white/10 pt-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />
          </div>
        </div>
      </section>

      <div id="danh-sach-khoa-hoc" className="scroll-mt-24 max-w-7xl mx-auto px-4 pb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
          {settings.listSection.title}
        </h2>
        <p className="text-sm text-slate-600 mb-6">{settings.listSection.hint}</p>
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {["all", "Cơ bản", "Trung cấp", "Nâng cao"].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  level === l
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-slate-200/80"
                }`}
              >
                {l === "all" ? "Tất cả" : l}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "free", "pro", "business"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tier === t
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-slate-200/80"
                }`}
              >
                {t === "all" ? "Tất cả gói" : tierLabels[t]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course: Course) => (
            <Link
              key={course.id}
              href={`/khoa-hoc/${course.slug}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group border border-slate-100"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${tierColors[course.tier]}`}
                >
                  {tierLabels[course.tier]}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      levelColors[course.level] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {course.level}
                  </span>
                  <span className="text-xs text-gray-400">{course.duration}</span>
                  <span className="text-xs text-gray-400">{course.lessons.length} bài</span>
                </div>
                <h2 className="font-display font-bold text-lg text-gray-900 mb-2">{course.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                    <span className="text-xs text-gray-400">
                      ({course.students.toLocaleString()} học viên)
                    </span>
                  </div>
                  <span className="font-bold text-primary-600">
                    {course.price === 0 ? "Miễn phí" : course.price.toLocaleString() + "đ"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            Không có khóa học khớp bộ lọc. Thử chọn &quot;Tất cả&quot; hoặc đổi gói.
          </p>
        )}
      </div>

      <section className="bg-slate-100/80 border-t border-slate-200/80 py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            {settings.faqSection.title}
          </h2>
          <p className="mt-2 text-center text-slate-600 text-sm">
            {settings.faqSection.contactLead}{" "}
            <Link
              href={settings.faqSection.contactHref}
              className="font-semibold text-primary-600 hover:underline"
            >
              {settings.faqSection.contactLabel}
            </Link>
            .
          </p>
          <div className="mt-8 space-y-2">
            {settings.faq.map((item, i) => (
              <div
                key={`faq-${i}`}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50/80 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-2">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-10 sm:px-10 sm:py-12 text-center text-white shadow-lg">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">{settings.cta.title}</h2>
          <p className="mt-3 text-primary-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            {settings.cta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaLink
              href={settings.cta.primaryHref}
              label={settings.cta.primaryLabel}
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary-700 hover:bg-primary-50 transition-colors"
            />
            <CtaLink
              href={settings.cta.secondaryHref}
              label={settings.cta.secondaryLabel}
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
