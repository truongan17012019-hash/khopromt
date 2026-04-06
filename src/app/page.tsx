import Link from "next/link";
import PromptCard from "@/components/PromptCard";
import HeroPromptSlider from "@/components/HeroPromptSlider";
import { prompts, tools } from "@/data/prompts";
import { formatPrice } from "@/lib/utils";
import { getPlanSettings } from "@/lib/server/plan-settings";
import { getCategoriesFromSettings } from "@/lib/server/category-settings";
import BundleBanner from "@/components/BundleBanner";

export default async function HomePage() {
  const { homepagePricingCards, homepagePricingSection } = await getPlanSettings();
  const nCards = homepagePricingCards.length;
  const pricingGridClass =
    nCards === 1
      ? "grid grid-cols-1 max-w-md mx-auto gap-6"
      : nCards === 2
        ? "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        : nCards === 3
          ? "grid grid-cols-1 md:grid-cols-3 gap-6"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
  const categories = await getCategoriesFromSettings();
  const featuredPrompts = prompts.slice(0, 4);
  const bestSellers = [...prompts].sort((a, b) => b.sold - a.sold).slice(0, 4);

  const catById = new Map(categories.map((c) => [c.id, c]));
  const heroSlides = prompts.map((p) => {
    const raw = p.preview || p.description || "";
    const preview = raw.length > 260 ? `${raw.slice(0, 257)}…` : raw;
    const cat = catById.get(p.category);
    return {
      id: p.id,
      title: p.title,
      preview,
      tool: p.tool,
      categoryId: p.category,
      categoryIcon: cat?.icon ?? "📌",
      categoryName: cat?.name ?? "Prompt",
    };
  });

  return (
    <div className="bg-slate-50">
      {/* Hero — gọn hơn + slider prompt ngẫu nhiên (client) */}
      <section className="relative hero-mlv overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/15 border border-brand-500/30 rounded-full text-brand-400 text-xs sm:text-sm font-bold mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                Dùng thử miễn phí — xem trước prompt
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-white leading-tight tracking-tight">
                Prompt AI hỗ trợ{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">
                  công-việc &amp; bán hàng
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Kho prompt tối ưu cho ChatGPT, Claude, Gemini và nhiều công cụ AI — tiết kiệm hàng giờ mỗi tuần.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3">
                <Link
                  href="/danh-muc"
                  className="w-full sm:w-auto px-6 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30 active:scale-[0.98] text-sm sm:text-base"
                >
                  Khám phá ngay
                </Link>
                <Link
                  href="/dang-nhap"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 text-slate-100 font-bold rounded-xl border border-slate-600/80 hover:bg-slate-800 transition-all text-sm sm:text-base"
                >
                  Đăng ký miễn phí
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 pt-4 border-t border-slate-800/80">
                <div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-white">200+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Prompt</div>
                </div>
                <div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-white">5K+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Khách hàng</div>
                </div>
                <div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-white">4.8</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Đánh giá</div>
                </div>
              </div>
            </div>

            <HeroPromptSlider items={heroSlides} />
          </div>
        </div>
      </section>

      {/* Công cụ AI — dải giống “Khám phá AI Tools” */}
      <section className="bg-slate-900 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="section-eyebrow text-center mb-2">Công cụ AI hàng đầu</p>
          <h2 className="font-display text-lg sm:text-xl font-bold text-white text-center mb-6">
            Tương thích nhiều nền tảng
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-3 text-slate-400 hover:text-brand-400 transition-colors"
              >
                <span className="text-2xl grayscale hover:grayscale-0 transition-all">{tool.icon}</span>
                <span className="text-sm font-semibold">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="section-eyebrow mb-3">Prompt &amp; công cụ AI</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Khám phá kho Prompt
            </h2>
            <p className="mt-4 text-slate-500 text-lg">
              Bộ sưu tập prompt mạnh mẽ, được chọn lọc cho người làm content, dev, marketing và chủ shop.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/danh-muc/${cat.id}`}
                className="group relative bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-center hover:border-brand-500/40 hover:bg-white hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-sm sm:text-base leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">{cat.count} prompt</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nổi bật */}
      <section className="py-16 lg:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="section-eyebrow mb-2">Được tin dùng</p>
              <h2 className="font-display text-3xl font-extrabold text-slate-900">Prompt nổi bật</h2>
              <p className="mt-2 text-slate-500">Đánh giá cao và bán chạy nhất</p>
            </div>
            <Link
              href="/danh-muc"
              className="inline-flex items-center gap-1 text-brand-600 font-bold hover:text-brand-700 transition-colors"
            >
              Xem tất cả
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>

      {/* Bảng giá — chỉ hiện khi Admin còn ít nhất 1 thẻ (đã đồng bộ với gói trong DB) */}
      {nCards > 0 ? (
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="section-eyebrow mb-3">{homepagePricingSection.eyebrow}</p>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">{homepagePricingSection.title}</h2>
            <p className="mt-4 text-slate-500">{homepagePricingSection.description}</p>
            {homepagePricingSection.workflowLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
              {homepagePricingSection.workflowLinks.map((link, i) => (
                <span key={`${link.href}-${i}`} className="flex items-center gap-x-4">
                  {i > 0 && <span className="text-slate-300 hidden sm:inline">|</span>}
                  <Link href={link.href} className="font-semibold text-brand-600 hover:text-brand-700">
                    {link.label}
                  </Link>
                </span>
              ))}
            </div>
            )}
          </div>
          <div className={pricingGridClass}>
            {homepagePricingCards.map((plan, idx) => {
              const href =
                plan.ctaHref ?? (plan.kind === "membership" ? "/dang-nhap" : "/danh-muc");
              const isMember = plan.kind === "membership";
              const showBadge = plan.badge?.trim();
              return (
                <div
                  key={`${plan.id}-${idx}`}
                  className={
                    isMember
                      ? plan.highlight
                        ? "relative rounded-2xl p-6 border-2 border-brand-400/40 bg-gradient-to-br from-brand-50/80 to-white"
                        : "relative rounded-2xl p-6 border border-slate-200 bg-slate-50/50"
                      : plan.highlight
                        ? "relative rounded-2xl p-6 bg-gradient-to-b from-brand-50 to-white border-2 border-brand-400/50 shadow-lg shadow-brand-500/10"
                        : "relative rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-slate-300"
                  }
                >
                  {showBadge && (
                    <div className={isMember ? "absolute -top-2 right-4" : "absolute -top-3 right-4"}>
                      <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <h3 className="font-display font-bold text-lg text-slate-900 pr-16">{plan.name}</h3>
                  {plan.tagline && <p className="text-sm text-slate-500 mt-2">{plan.tagline}</p>}
                  {!isMember && plan.perks && plan.perks.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                      {plan.perks.map((perk, pi) => (
                        <li key={`${idx}-ot-${pi}`} className="flex gap-2">
                          <span className="text-brand-500 font-bold shrink-0">✓</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isMember && plan.price != null && (
                    <div className="mt-4 flex items-end gap-2 flex-wrap">
                      <span className="text-2xl font-extrabold text-brand-600">{formatPrice(plan.price)}</span>
                      {plan.originalPrice != null && plan.originalPrice > 0 && (
                        <span className="text-sm text-slate-400 line-through mb-1">
                          {formatPrice(plan.originalPrice)}
                        </span>
                      )}
                    </div>
                  )}
                  {isMember && plan.monthlyPrice != null && (
                    <>
                      <div className="mt-3">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {formatPrice(plan.monthlyPrice)}
                        </span>
                        <span className="text-sm text-slate-500">/tháng</span>
                      </div>
                      {plan.yearlyPrice != null && plan.yearlyPrice > 0 && (
                        <p className="text-sm text-brand-700 font-semibold mt-1">
                          Hoặc {formatPrice(plan.yearlyPrice)}/năm (tiết kiệm hơn)
                        </p>
                      )}
                    </>
                  )}
                  {isMember && plan.perks && plan.perks.length > 0 && (
                    <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                      {plan.perks.map((perk, pi) => (
                        <li key={`${idx}-${perk}-${pi}`}>• {perk}</li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={href}
                    className={
                      isMember
                        ? "block mt-5 py-3 text-center rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                        : "block w-full mt-5 py-3 text-center bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 active:scale-[0.98]"
                    }
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {/* Bundle — dynamic from admin */}
      <BundleBanner />

      {/* Bán chạy */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="section-eyebrow mb-2">Top lựa chọn</p>
              <h2 className="font-display text-3xl font-extrabold text-slate-900">Bán chạy nhất</h2>
              <p className="mt-2 text-slate-500">Prompt được người dùng yêu thích</p>
            </div>
            <Link
              href="/danh-muc?filter=hot"
              className="inline-flex items-center gap-1 text-brand-600 font-bold hover:text-brand-700 transition-colors"
            >
              Xem tất cả
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA cuối */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative hero-mlv rounded-3xl p-10 lg:p-16 text-center overflow-hidden border border-slate-800/80">
            <div className="relative max-w-xl mx-auto">
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white">
                Bắt đầu tối ưu công việc với AI
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Đăng ký miễn phí và trải nghiệm kho prompt được cập nhật thường xuyên.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/danh-muc"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 shadow-lg shadow-brand-500/25"
                >
                  Khám phá ngay
                </Link>
                <Link
                  href="/dang-nhap"
                  className="w-full sm:w-auto px-8 py-4 border border-slate-600 text-slate-200 font-bold rounded-xl hover:bg-slate-800/80"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
