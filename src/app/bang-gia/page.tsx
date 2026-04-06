"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Check, X, Zap } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: "free" | "pro" | "business";
  name: string;
  vietnamese: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  badge?: string;
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    vietnamese: "Miễn phí",
    description: "Bắt đầu khám phá",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "Xem preview tất cả prompt", included: true },
      { name: "AI Chatbot: 3 lần/ngày", included: true },
      { name: "Tải xuống prompt", included: false },
      { name: "Hỗ trợ ưu tiên", included: false },
      { name: "Giảm giá khi mua prompt", included: false },
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    vietnamese: "Chuyên nghiệp",
    description: "Phổ biến nhất",
    monthlyPrice: 199000,
    yearlyPrice: 1690000,
    features: [
      { name: "Truy cập toàn bộ prompt không giới hạn", included: true },
      { name: "AI Chatbot: Không giới hạn", included: true },
      { name: "Tải xuống prompt", included: true },
      { name: "Hỗ trợ qua email", included: true },
      { name: "Giảm 10% khi mua prompt premium", included: true },
    ],
    badge: "Phổ biến nhất",
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    vietnamese: "Doanh nghiệp",
    description: "Cho các đội",
    monthlyPrice: 499000,
    yearlyPrice: 4290000,
    features: [
      { name: "Truy cập toàn bộ + prompt exclusive", included: true },
      { name: "AI Chatbot: Không giới hạn + Priority", included: true },
      { name: "Tải xuống + API access", included: true },
      { name: "Hỗ trợ 24/7 qua chat", included: true },
      { name: "Giảm 20% khi mua prompt premium", included: true },
      { name: "Tối đa 5 thành viên trong đội", included: true },
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [userSubscription, setUserSubscription] = useState<{
    plan: "free" | "pro" | "business";
    billingCycle: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStore.isLoggedIn && authStore.user?.email) {
      fetchUserSubscription();
    }
  }, [authStore.isLoggedIn, authStore.user?.email]);

  const fetchUserSubscription = async () => {
    try {
      const res = await fetch(
        `/api/subscription?email=${encodeURIComponent(authStore.user?.email || "")}`
      );
      if (res.ok) {
        const data = await res.json();
        setUserSubscription(data);
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    }
  };

  const handleSubscribe = async (planId: "free" | "pro" | "business") => {
    if (!authStore.isLoggedIn) {
      router.push("/dang-nhap");
      return;
    }

    if (planId === "free") {
      setLoading(true);
      try {
        const res = await fetch("/api/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authStore.user?.email,
            plan: "free",
            billingCycle: "monthly",
          }),
        });

        if (res.ok) {
          await fetchUserSubscription();
          setError(null);
        } else {
          setError("Có lỗi xảy ra");
        }
      } catch (err) {
        setError("Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authStore.user?.email,
          plan: planId,
          billingCycle,
        }),
      });

      if (res.status === 402) {
        router.push("/nap-tien");
        return;
      }

      if (res.ok) {
        await fetchUserSubscription();
        setError(null);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = (planId: string): string => {
    if (userSubscription?.plan === planId) {
      return "Gói hiện tại";
    }
    if (planId === "free") {
      return "Bắt đầu miễn phí";
    }
    return "Nâng cấp";
  };

  const savingsPercentage = billingCycle === "yearly" ? 29 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chọn gói phù hợp với bạn
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Nâng cấp để truy cập toàn bộ prompt AI và các tính năng độc quyền
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span
              className={`text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "text-violet-600"
                  : "text-gray-500"
              }`}
            >
              Hàng tháng
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-10" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "text-violet-600"
                  : "text-gray-500"
              }`}
            >
              Hàng năm
            </span>
            {billingCycle === "yearly" && (
              <span className="ml-3 inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Tiết kiệm {savingsPercentage}%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group transition-all duration-300 ${
                  plan.highlighted
                    ? "md:scale-105 md:z-10"
                    : "hover:shadow-lg"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 opacity-100"
                      : "bg-white opacity-0 group-hover:opacity-5"
                  }`}
                />

                <div
                  className={`relative rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 border ${
                    plan.highlighted
                      ? "bg-white/95 border-transparent shadow-2xl"
                      : "bg-white/70 border-gray-200 group-hover:border-violet-300 shadow-lg hover:shadow-2xl"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {userSubscription?.plan === plan.id && (
                    <div className="mb-4 inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Gói hiện tại
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                    {plan.vietnamese}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="text-5xl font-bold text-gray-900">
                      {formatPrice(
                        billingCycle === "monthly"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">
                      {billingCycle === "monthly"
                        ? "/ tháng"
                        : "/ năm"}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || userSubscription?.plan === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold mb-8 transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-1 disabled:opacity-75"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-75"
                    } ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        {getButtonText(plan.id)}
                        {plan.id !== "free" && (
                          <Zap className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-gray-200 mb-8" />

                  {/* Features List */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-6">
            <details className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                Tôi có thể nâng cấp hoặc hạ cấp bất cứ lúc nào không?
                <span className="transform transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-700">
                Có, bạn có thể nâng cấp hoặc hạ cấp gói của mình bất cứ lúc nào. Nếu nâng cấp, bạn sẽ được hưởng lợi ích ngay lập tức. Nếu hạ cấp, các thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                Gói Pro và Business có khác nhau gì?
                <span className="transform transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-700">
                Gói Pro cung cấp truy cập không giới hạn và hỗ trợ qua email. Gói Business bao gồm tất cả tính năng của Pro cộng với API access, hỗ trợ 24/7 qua chat, prompt exclusive, và có thể thêm tối đa 5 thành viên vào đội.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                Có giảm giá dài hạn không?
                <span className="transform transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-700">
                Có! Nếu bạn thanh toán theo năm thay vì theo tháng, bạn sẽ tiết kiệm 28-29% so với tổng giá hàng tháng. Đó là lý do tại sao gói hàng năm rất phổ biến.
              </p>
            </details>

            <details className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                Làm thế nào để hủy đăng ký?
                <span className="transform transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-700">
                Bạn có thể hủy đăng ký bất cứ lúc nào từ trang tài khoản. Bạn sẽ mất quyền truy cập vào các tính năng trả phí từ cuối chu kỳ thanh toán hiện tại.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Bắt đầu ngay hôm nay
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Không cần thẻ tín dụng. Bắt đầu miễn phí và nâng cấp khi bạn sẵn sàng.
          </p>
          <button
            onClick={() => {
              if (authStore.isLoggedIn) {
                const element = document.querySelector('[id*="free"]');
                element?.scrollIntoView({ behavior: "smooth" });
              } else {
                router.push("/dang-nhap");
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Khám phá ngay
          </button>
        </div>
      </section>
    </div>
  );
}
