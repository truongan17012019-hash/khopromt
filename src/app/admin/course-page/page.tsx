"use client";

import { useCallback, useEffect, useState } from "react";
import type { CoursePageSettings } from "@/data/course-page-marketing";
import { DEFAULT_COURSE_PAGE_SETTINGS } from "@/data/course-page-marketing";

const ICON_OPTIONS = [
  "brain",
  "zap",
  "target",
  "layers",
  "sparkles",
  "bookopen",
  "users",
  "graduationcap",
  "compass",
] as const;

const STAT_KEYS = ["courseCount", "totalLessons", "avgRating", "freeCount"] as const;

export default function AdminCoursePageSettings() {
  const [s, setS] = useState<CoursePageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/course-page");
      const json = await res.json();
      if (res.ok && json?.data) setS(json.data);
      else setS(DEFAULT_COURSE_PAGE_SETTINGS);
    } catch {
      setS(DEFAULT_COURSE_PAGE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = useCallback((patch: Partial<CoursePageSettings>) => {
    setS((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  if (loading || !s) {
    return <div className="text-sm text-slate-500">Đang tải cài đặt trang Khóa học…</div>;
  }

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Trang Khóa học</h1>
        <p className="text-sm text-slate-500 mt-1">
          Nội dung marketing /khoa-hoc (hero, thẻ giá trị, lộ trình, FAQ, CTA). Thẻ khóa học
          vẫn lấy từ dữ liệu khóa trong code; chỉ phần quanh danh sách là chỉnh tại đây.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">Hero</h2>
        <label className="block text-sm">
          <span className="text-slate-600">Badge</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.hero.badge}
            onChange={(e) => update({ hero: { ...s.hero, badge: e.target.value } })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Tiêu đề H1</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.hero.title}
            onChange={(e) => update({ hero: { ...s.hero, title: e.target.value } })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Đoạn giới thiệu</span>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.hero.intro}
            onChange={(e) => update({ hero: { ...s.hero, intro: e.target.value } })}
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Bullet (mỗi dòng một ý)</span>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono text-xs"
            value={s.hero.bullets.join("\n")}
            onChange={(e) =>
              update({
                hero: {
                  ...s.hero,
                  bullets: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                },
              })
            }
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="text-slate-600">CTA chính — nhãn</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={s.hero.primaryCta.label}
              onChange={(e) =>
                update({ hero: { ...s.hero, primaryCta: { ...s.hero.primaryCta, label: e.target.value } } })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">CTA chính — link (#anchor hoặc /path)</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={s.hero.primaryCta.href}
              onChange={(e) =>
                update({ hero: { ...s.hero, primaryCta: { ...s.hero.primaryCta, href: e.target.value } } })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">CTA phụ — nhãn</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={s.hero.secondaryCta.label}
              onChange={(e) =>
                update({
                  hero: { ...s.hero, secondaryCta: { ...s.hero.secondaryCta, label: e.target.value } },
                })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">CTA phụ — link</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={s.hero.secondaryCta.href}
              onChange={(e) =>
                update({
                  hero: { ...s.hero, secondaryCta: { ...s.hero.secondaryCta, href: e.target.value } },
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">4 ô thống kê (số tự động từ khóa học)</h2>
        <p className="text-xs text-slate-500">
          valueKey: courseCount | totalLessons | avgRating | freeCount
        </p>
        <div className="space-y-3">
          {s.stats.map((row, i) => (
            <div key={i} className="grid sm:grid-cols-3 gap-2 items-end">
              <label className="text-sm">
                <span className="text-slate-600">Nhãn</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={row.label}
                  onChange={(e) => {
                    const next = [...s.stats];
                    next[i] = { ...next[i], label: e.target.value };
                    update({ stats: next });
                  }}
                />
              </label>
              <label className="text-sm">
                <span className="text-slate-600">Dòng phụ</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={row.sub}
                  onChange={(e) => {
                    const next = [...s.stats];
                    next[i] = { ...next[i], sub: e.target.value };
                    update({ stats: next });
                  }}
                />
              </label>
              <label className="text-sm">
                <span className="text-slate-600">Nguồn số</span>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={row.valueKey}
                  onChange={(e) => {
                    const next = [...s.stats];
                    next[i] = { ...next[i], valueKey: e.target.value as (typeof STAT_KEYS)[number] };
                    update({ stats: next });
                  }}
                >
                  {STAT_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">Khối “Bạn nhận được gì”</h2>
        <label className="block text-sm">
          <span className="text-slate-600">Tiêu đề</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.outcomesSection.heading}
            onChange={(e) =>
              update({ outcomesSection: { ...s.outcomesSection, heading: e.target.value } })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Mô tả (dùng **cụm** để in đậm)</span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.outcomesSection.subheading}
            onChange={(e) =>
              update({ outcomesSection: { ...s.outcomesSection, subheading: e.target.value } })
            }
          />
        </label>
        {s.outcomes.map((o, i) => (
          <div key={i} className="border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="text-xs font-semibold text-slate-500">Thẻ {i + 1}</div>
            <label className="block text-sm">
              Icon
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                value={o.icon}
                onChange={(e) => {
                  const next = [...s.outcomes];
                  next[i] = { ...next[i], icon: e.target.value };
                  update({ outcomes: next });
                }}
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold"
              placeholder="Tiêu đề"
              value={o.title}
              onChange={(e) => {
                const next = [...s.outcomes];
                next[i] = { ...next[i], title: e.target.value };
                update({ outcomes: next });
              }}
            />
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              placeholder="Nội dung"
              value={o.body}
              onChange={(e) => {
                const next = [...s.outcomes];
                next[i] = { ...next[i], body: e.target.value };
                update({ outcomes: next });
              }}
            />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">Lộ trình (3 cột)</h2>
        <label className="block text-sm">
          <span className="text-slate-600">Eyebrow</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.pathsSection.eyebrow}
            onChange={(e) =>
              update({ pathsSection: { ...s.pathsSection, eyebrow: e.target.value } })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Tiêu đề khối</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.pathsSection.title}
            onChange={(e) =>
              update({ pathsSection: { ...s.pathsSection, title: e.target.value } })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Đoạn mô tả</span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.pathsSection.intro}
            onChange={(e) =>
              update({ pathsSection: { ...s.pathsSection, intro: e.target.value } })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Ghi chú bên phải (Compass)</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.pathsSection.asideNote}
            onChange={(e) =>
              update({ pathsSection: { ...s.pathsSection, asideNote: e.target.value } })
            }
          />
        </label>
        {s.paths.map((p, pi) => (
          <div key={pi} className="border border-slate-100 rounded-xl p-3 space-y-2">
            <div className="text-xs font-semibold text-slate-500">Cột {pi + 1}</div>
            <input
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-bold"
              value={p.name}
              onChange={(e) => {
                const next = [...s.paths];
                next[pi] = { ...next[pi], name: e.target.value };
                update({ paths: next });
              }}
            />
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={p.desc}
              onChange={(e) => {
                const next = [...s.paths];
                next[pi] = { ...next[pi], desc: e.target.value };
                update({ paths: next });
              }}
            />
            <label className="block text-xs text-slate-600">
              Topics (mỗi dòng)
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono"
                value={p.topics.join("\n")}
                onChange={(e) => {
                  const next = [...s.paths];
                  next[pi] = {
                    ...next[pi],
                    topics: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                  };
                  update({ paths: next });
                }}
              />
            </label>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">Phương pháp + khối đối tượng</h2>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
          value={s.methodSection.title}
          onChange={(e) =>
            update({ methodSection: { ...s.methodSection, title: e.target.value } })
          }
        />
        <textarea
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={s.methodSection.p1}
          onChange={(e) =>
            update({ methodSection: { ...s.methodSection, p1: e.target.value } })
          }
        />
        <textarea
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={s.methodSection.p2}
          onChange={(e) =>
            update({ methodSection: { ...s.methodSection, p2: e.target.value } })
          }
        />
        <p className="text-xs text-slate-500">Liên kết dưới đoạn văn</p>
        {s.methodSection.links.map((link, li) => (
          <div key={li} className="flex flex-wrap gap-2">
            <input
              className="flex-1 min-w-[120px] rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              placeholder="Nhãn"
              value={link.label}
              onChange={(e) => {
                const next = [...s.methodSection.links];
                next[li] = { ...next[li], label: e.target.value };
                update({ methodSection: { ...s.methodSection, links: next } });
              }}
            />
            <input
              className="flex-1 min-w-[120px] rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              placeholder="href"
              value={link.href}
              onChange={(e) => {
                const next = [...s.methodSection.links];
                next[li] = { ...next[li], href: e.target.value };
                update({ methodSection: { ...s.methodSection, links: next } });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary-600 font-medium"
          onClick={() =>
            update({
              methodSection: {
                ...s.methodSection,
                links: [...s.methodSection.links, { label: "Link mới", href: "/" }],
              },
            })
          }
        >
          + Thêm liên kết
        </button>
        <hr className="border-slate-100" />
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
          value={s.audienceBox.title}
          onChange={(e) =>
            update({ audienceBox: { ...s.audienceBox, title: e.target.value } })
          }
        />
        <label className="block text-sm text-slate-600">
          Các dòng bullet (mỗi dòng)
          <textarea
            rows={5}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={s.audienceBox.lines.join("\n")}
            onChange={(e) =>
              update({
                audienceBox: {
                  ...s.audienceBox,
                  lines: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                },
              })
            }
          />
        </label>
        <label className="block text-sm text-slate-600">
          Chân khối (HTML nhẹ; dùng {"{{students}}"} để chèn tổng học viên)
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
            value={s.audienceBox.footerHtml}
            onChange={(e) =>
              update({ audienceBox: { ...s.audienceBox, footerHtml: e.target.value } })
            }
          />
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">Tiêu đề khu vực danh sách khóa</h2>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={s.listSection.title}
          onChange={(e) =>
            update({ listSection: { ...s.listSection, title: e.target.value } })
          }
        />
        <textarea
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={s.listSection.hint}
          onChange={(e) =>
            update({ listSection: { ...s.listSection, hint: e.target.value } })
          }
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">FAQ</h2>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
          value={s.faqSection.title}
          onChange={(e) =>
            update({ faqSection: { ...s.faqSection, title: e.target.value } })
          }
        />
        <div className="grid sm:grid-cols-2 gap-2">
          <input
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Câu dẫn trước link liên hệ"
            value={s.faqSection.contactLead}
            onChange={(e) =>
              update({ faqSection: { ...s.faqSection, contactLead: e.target.value } })
            }
          />
          <input
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Nhãn link"
            value={s.faqSection.contactLabel}
            onChange={(e) =>
              update({ faqSection: { ...s.faqSection, contactLabel: e.target.value } })
            }
          />
          <input
            className="sm:col-span-2 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="href liên hệ"
            value={s.faqSection.contactHref}
            onChange={(e) =>
              update({ faqSection: { ...s.faqSection, contactHref: e.target.value } })
            }
          />
        </div>
        {s.faq.map((f, fi) => (
          <div key={fi} className="border border-slate-100 rounded-xl p-3 space-y-2">
            <input
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-medium"
              value={f.q}
              onChange={(e) => {
                const next = [...s.faq];
                next[fi] = { ...next[fi], q: e.target.value };
                update({ faq: next });
              }}
            />
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              value={f.a}
              onChange={(e) => {
                const next = [...s.faq];
                next[fi] = { ...next[fi], a: e.target.value };
                update({ faq: next });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary-600 font-medium"
          onClick={() => update({ faq: [...s.faq, { q: "Câu hỏi mới", a: "Trả lời" }] })}
        >
          + Thêm câu FAQ
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <h2 className="font-bold text-slate-800">CTA cuối trang</h2>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
          value={s.cta.title}
          onChange={(e) => update({ cta: { ...s.cta, title: e.target.value } })}
        />
        <textarea
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={s.cta.body}
          onChange={(e) => update({ cta: { ...s.cta, body: e.target.value } })}
        />
        <div className="grid sm:grid-cols-2 gap-2">
          <input
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Nút 1 — nhãn"
            value={s.cta.primaryLabel}
            onChange={(e) => update({ cta: { ...s.cta, primaryLabel: e.target.value } })}
          />
          <input
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Nút 1 — href"
            value={s.cta.primaryHref}
            onChange={(e) => update({ cta: { ...s.cta, primaryHref: e.target.value } })}
          />
          <input
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Nút 2 — nhãn"
            value={s.cta.secondaryLabel}
            onChange={(e) => update({ cta: { ...s.cta, secondaryLabel: e.target.value } })}
          />
          <input
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            placeholder="Nút 2 — href"
            value={s.cta.secondaryHref}
            onChange={(e) => update({ cta: { ...s.cta, secondaryHref: e.target.value } })}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setMessage("");
            try {
              const res = await fetch("/api/admin/course-page", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings: s }),
              });
              const json = await res.json();
              if (!res.ok) throw new Error(json?.error || "Lỗi lưu");
              setMessage("Đã lưu. Trang /khoa-hoc sẽ dùng nội dung mới.");
            } catch (e: any) {
              setMessage(e?.message || "Lỗi lưu");
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-xl bg-brand-500 text-white font-bold px-6 py-2.5 text-sm hover:bg-brand-600 disabled:opacity-50"
        >
          {saving ? "Đang lưu…" : "Lưu cài đặt trang Khóa học"}
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          onClick={() => {
            if (confirm("Khôi phục toàn bộ nội dung mặc định trên form (chưa lưu DB)?")) {
              setS({ ...DEFAULT_COURSE_PAGE_SETTINGS });
              setMessage("Đã khôi phục bản mặc định trên form — nhấn Lưu để ghi DB.");
            }
          }}
        >
          Khôi phục mặc định (form)
        </button>
        {message ? <span className="text-sm text-slate-600">{message}</span> : null}
      </div>
    </div>
  );
}
