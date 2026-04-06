export function formatPrice(price: number): string {
  const n = Number(price);
  if (!Number.isFinite(n)) {
    return "—";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function getDiscountPercent(
  price: number,
  originalPrice: number
): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function getToolColor(tool: string): string {
  const colors: Record<string, string> = {
    chatgpt: "bg-emerald-100 text-emerald-700",
    claude: "bg-orange-100 text-orange-700",
    midjourney: "bg-blue-100 text-blue-700",
    dalle: "bg-pink-100 text-pink-700",
    "stable-diffusion": "bg-purple-100 text-purple-700",
    gemini: "bg-cyan-100 text-cyan-700",
  };
  return colors[tool] || "bg-slate-100 text-slate-700";
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    "Dễ": "bg-green-100 text-green-700",
    "Trung bình": "bg-yellow-100 text-yellow-700",
    "Nâng cao": "bg-red-100 text-red-700",
  };
  return colors[difficulty] || "bg-slate-100 text-slate-700";
}