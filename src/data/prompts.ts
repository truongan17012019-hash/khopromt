import { contentPrompts } from "./prompts-content";
import { codingPrompts } from "./prompts-coding";
import { designPrompts } from "./prompts-design";
import { marketingPrompts } from "./prompts-marketing";
import { educationPrompts } from "./prompts-education";
import { businessPrompts } from "./prompts-business";
import { cskhPrompts } from "./prompts-cskh";
import { salesPrompts } from "./prompts-sales";
import { testPrompts } from "./prompts-test";
import { realestatePrompts } from "./prompts-realestate";
import { healthcarePrompts } from "./prompts-healthcare";
import { travelPrompts } from "./prompts-travel";
import { legalPrompts } from "./prompts-legal";
import { financePrompts } from "./prompts-finance";
import { hrPrompts } from "./prompts-hr";
import { ecommercePrompts } from "./prompts-ecommerce";
import { socialPrompts } from "./prompts-social";
import { datasciencePrompts } from "./prompts-datascience";

export interface Prompt {
  id: string;
  title: string;
  description: string;
  detailDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  tool: string;
  rating: number;
  reviewCount: number;
  sold: number;
  preview: string;
  fullContent: string;
  tags: string[];
  difficulty: "Dễ" | "Trung bình" | "Nâng cao";
  author: string;
  createdAt: string;
  image: string;
}
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export const categories: Category[] = [
  {
    id: "viet-content",
    name: "Viết Content",
    icon: "✍️",
    description: "Prompt viết bài blog, quảng cáo, email marketing",
    count: 100,
    color: "bg-blue-500",
  },
  {
    id: "lap-trinh",
    name: "Lập Trình",
    icon: "💻",
    description: "Prompt hỗ trợ code, debug, kiến trúc phần mềm",
    count: 100,
    color: "bg-green-500",
  },  {
    id: "thiet-ke-anh",
    name: "Thiết Kế Ảnh",
    icon: "🎨",
    description: "Prompt tạo ảnh Midjourney, DALL-E, Stable Diffusion",
    count: 100,
    color: "bg-purple-500",
  },
  {
    id: "marketing",
    name: "Marketing & SEO",
    icon: "📈",
    description: "Prompt chiến lược marketing, SEO, quảng cáo",
    count: 100,
    color: "bg-orange-500",
  },
  {
    id: "giao-duc",
    name: "Giáo Dục",
    icon: "📚",
    description: "Prompt dạy học, tạo bài tập, soạn giáo án",
    count: 100,
    color: "bg-teal-500",
  },
  {
    id: "kinh-doanh",
    name: "Kinh Doanh",
    icon: "💼",    description: "Prompt lập kế hoạch, phân tích, báo cáo",
    count: 100,
    color: "bg-red-500",
  },
  {
    id: "cham-soc-khach-hang",
    name: "Bộ giải pháp CSKH 5 Sao",
    icon: "🎧",
    description: "Prompt thực chiến xử lý từ chối, hậu mãi, khiếu nại, công nợ",
    count: 80,
    color: "bg-rose-500",
  },
  {
    id: "ban-hang",
    name: "Sát Thủ Bán Hàng",
    icon: "🎯",
    description:
      "Bộ prompt coach bán hàng ảo: thấu hiểu khách, phá băng, xử lý từ chối, chốt đơn, chăm sóc",
    count: 100,
    color: "bg-amber-500",
  },
  {
    id: "bat-dong-san",
    name: "Bất Động Sản",
    icon: "🏠",
    description: "Prompt tư vấn, phân tích và marketing bất động sản",
    count: 60,
    color: "bg-emerald-500",
  },
  {
    id: "y-te",
    name: "Y Tế & Sức khỏe",
    icon: "🏥",
    description: "Prompt hỗ trợ y tế, sức khỏe và chăm sóc bệnh nhân",
    count: 60,
    color: "bg-cyan-500",
  },
  {
    id: "du-lich",
    name: "Du Lịch & Hospitality",
    icon: "✈️",
    description: "Prompt lên kế hoạch, review và marketing du lịch",
    count: 60,
    color: "bg-sky-500",
  },
  {
    id: "phap-ly",
    name: "Pháp Lý",
    icon: "⚖️",
    description: "Prompt soạn thảo văn bản, tư vấn pháp lý cơ bản",
    count: 60,
    color: "bg-indigo-500",
  },
  {
    id: "tai-chinh",
    name: "Tài Chính",
    icon: "💰",
    description: "Prompt phân tích tài chính, đầu tư và kế toán",
    count: 60,
    color: "bg-yellow-500",
  },
  {
    id: "nhan-su",
    name: "Nhân Sự & HR",
    icon: "👨‍💼",
    description: "Prompt tuyển dụng, đào tạo và quản lý nhân sự",
    count: 60,
    color: "bg-pink-500",
  },
  {
    id: "thuong-mai-dien-tu",
    name: "Thương mại Điện tử",
    icon: "🛒",
    description: "Prompt tối ưu shop online, Shopee, Lazada, TikTok Shop",
    count: 60,
    color: "bg-lime-500",
  },
  {
    id: "truyen-thong-xa-hoi",
    name: "Truyền thông Xã hội",
    icon: "📱",
    description: "Prompt quản lý và sáng tạo nội dung mạng xã hội",
    count: 60,
    color: "bg-fuchsia-500",
  },
  {
    id: "khoa-hoc-du-lieu",
    name: "Khoa học Dữ liệu",
    icon: "📊",
    description: "Prompt phân tích dữ liệu, ML và trực quan hóa",
    count: 60,
    color: "bg-violet-500",
  },
];

export const tools = [
  { id: "chatgpt", name: "ChatGPT", icon: "🤖" },
  { id: "claude", name: "Claude", icon: "🧠" },
  { id: "midjourney", name: "Midjourney", icon: "🎨" },
  { id: "dalle", name: "DALL-E", icon: "🖼️" },
  { id: "stable-diffusion", name: "Stable Diffusion", icon: "🎭" },
  { id: "gemini", name: "Gemini", icon: "✨" },
];

const roleByCategory: Record<string, string> = {
  "viet-content": "Chuyên gia Chiến lược Nội dung",
  "lap-trinh": "Kỹ sư Phần mềm Cao cấp",
  "thiet-ke-anh": "Chuyên gia Thiết kế Hình ảnh AI",
  marketing: "Chuyên gia Marketing Tăng trưởng",
  "giao-duc": "Chuyên gia Thiết kế Trải nghiệm Học tập",
  "kinh-doanh": "Chuyên gia Tư vấn Chiến lược Kinh doanh",
  "cham-soc-khach-hang": "Chuyên gia Chăm sóc Khách hàng & Truyền thông Bán hàng",
  "ban-hang": "Chuyên gia Huấn luyện Bán hàng & Chốt đơn",
  "bat-dong-san": "Chuyên gia Bất Động Sản",
  "y-te": "Chuyên gia Y Tế & Sức khỏe",
  "du-lich": "Chuyên gia Du Lịch & Hospitality",
  "phap-ly": "Chuyên gia Pháp Lý",
  "tai-chinh": "Chuyên gia Tài Chính",
  "nhan-su": "Chuyên gia Nhân Sự & HR",
  "thuong-mai-dien-tu": "Chuyên gia Thương mại Điện tử",
  "truyen-thong-xa-hoi": "Chuyên gia Truyền thông Xã hội",
  "khoa-hoc-du-lieu": "Chuyên gia Khoa học Dữ liệu",
};

function isPremiumContent(text: string) {
  const value = String(text || "").toLowerCase();
  return value.includes("role:") || value.includes("# role");
}

function buildPremiumPreview(prompt: Prompt) {
  if (prompt.category === "marketing") {
    return [
      `ROLE: ${roleByCategory["marketing"]}.`,
      `TASK: Giải bài toán marketing cho "${prompt.title}" theo phương pháp funnel.`,
      "OUTPUT: Bản nháp để thực thi ngay + bản chi tiết để tối ưu conversion.",
    ].join("\n");
  }
  return [
    `ROLE: ${roleByCategory[prompt.category] || "Chuyên gia AI"}.`,
    `TASK: Tạo kết quả nhanh cho "${prompt.title}".`,
    `OUTPUT: 1 phiên bản ngắn gọn + 1 phiên bản chi tiết để áp dụng ngay.`,
  ].join("\n");
}

function buildMarketingFullContent(prompt: Prompt) {
  const tags = Array.isArray(prompt.tags) && prompt.tags.length
    ? prompt.tags.join(", ")
    : "marketing, conversion";
  return [
    "# ROLE",
    "Bạn là Chuyên gia Marketing Tăng trưởng cấp cao, có kinh nghiệm thực chiến tại thị trường Việt Nam.",
    "",
    "# CONTEXT",
    `${prompt.description}`,
    "Người dùng cần kết quả có thể áp dụng ngay vào chiến dịch thực tế, ưu tiên doanh thu và conversion.",
    "",
    "# INPUT",
    "- Sản phẩm/dịch vụ: {{offer}}",
    "- Mục tiêu chiến dịch: {{goal}}  # traffic | lead | sale",
    "- Chân dung khách hàng: {{audience}}",
    "- Ngân sách: {{budget}}",
    "- Kênh chạy: {{channel}}  # Facebook | Google | TikTok | Zalo",
    "- Ưu đãi/USP: {{usp_offer}}",
    "",
    "# TASK",
    "1) Xác định pain point và desire chính của audience.",
    "2) Đề xuất góc triển khai theo funnel: Awareness → Consideration → Conversion.",
    "3) Tạo thông điệp chính + 3 thông điệp phụ để A/B test.",
    "4) Tạo script/copy theo kênh đầu vào.",
    "5) Đề xuất CTA, lead magnet hoặc ưu đãi để tăng tỷ lệ chốt.",
    "",
    "# OUTPUT FORMAT",
    "## A. Bản triển khai nhanh (1 trang)",
    "- Mục tiêu",
    "- Hook chính",
    "- Copy ngắn",
    "- CTA",
    "",
    "## B. Bản đầy đủ (thực chiến)",
    "- Customer insight",
    "- Offer framing",
    "- Creative angles",
    "- Copy dài (PAS/AIDA/BAB)",
    "- KPI để theo dõi (CTR, CVR, CPA, ROAS)",
    "",
    "## C. 3 Biến thể A/B test",
    "- Biến thể A: đánh vào pain",
    "- Biến thể B: đánh vào kết quả",
    "- Biến thể C: đánh vào ưu đãi",
    "",
    "# CHECKLIST CHẤT LƯỢNG",
    "- Có thông điệp rõ ràng trong 3 giây đầu.",
    "- Mỗi nội dung chỉ có 1 CTA chính.",
    "- Không dùng claim quá đà/vi phạm chính sách ads.",
    "- Có cơ chế đo lường kết quả sau 24h/72h.",
    `- Tags ưu tiên: ${tags}.`,
  ].join("\n");
}

function buildPremiumFullContent(prompt: Prompt) {
  if (prompt.category === "marketing") {
    return buildMarketingFullContent(prompt);
  }
  const role = roleByCategory[prompt.category] || "Chuyên gia AI";
  const tags = Array.isArray(prompt.tags) && prompt.tags.length
    ? prompt.tags.join(", ")
    : "không có";
  return [
    `# ROLE`,
    `Bạn là ${role}, có kinh nghiệm thực chiến trong lĩnh vực ${prompt.category}.`,
    ``,
    `# CONTEXT`,
    `${prompt.description}`,
    ``,
    `# INPUT`,
    `- Mục tiêu: {{goal}}`,
    `- Ngữ cảnh sử dụng: {{context}}`,
    `- Ràng buộc: {{constraints}}`,
    `- Đối tượng mục tiêu: {{audience}}`,
    ``,
    `# TASK`,
    `Tạo kết quả cho prompt "${prompt.title}" theo đúng mục tiêu đầu vào,`,
    `ưu tiên tính rõ ràng, khả thi và có thể áp dụng ngay.`,
    ``,
    `# OUTPUT FORMAT`,
    `1) Bản TÓM TẮT (ngắn gọn, dễ dùng ngay)`,
    `2) Bản ĐẦY ĐỦ (có bước thực hiện, checklist, lưu ý)`,
    `3) 3 biến thể để A/B test`,
    ``,
    `# CHECKLIST CHẤT LƯỢNG`,
    `- Logic rõ ràng, không mơ hồ`,
    `- Có ví dụ minh họa`,
    `- Có bước hành động cụ thể`,
    `- Tối ưu cho công cụ: ${prompt.tool}`,
    `- Độ khó mục tiêu: ${prompt.difficulty}`,
    `- Tags liên quan: ${tags}`,
  ].join("\n");
}

const categoryNameById: Record<string, string> = {
  "viet-content": "Viết Content",
  "lap-trinh": "Lập Trình",
  "thiet-ke-anh": "Thiết Kế Ảnh",
  marketing: "Marketing & SEO",
  "giao-duc": "Giáo Dục",
  "kinh-doanh": "Kinh Doanh",
  "cham-soc-khach-hang": "Bộ giải pháp CSKH 5 Sao",
  "ban-hang": "Sát Thủ Bán Hàng",
  "bat-dong-san": "Bất Động Sản",
  "y-te": "Y Tế & Sức khỏe",
  "du-lich": "Du Lịch & Hospitality",
  "phap-ly": "Pháp Lý",
  "tai-chinh": "Tài Chính",
  "nhan-su": "Nhân Sự & HR",
  "thuong-mai-dien-tu": "Thương mại Điện tử",
  "truyen-thong-xa-hoi": "Truyền thông Xã hội",
  "khoa-hoc-du-lieu": "Khoa học Dữ liệu",
};

function buildAutoDetailDescription(prompt: Prompt) {
  const categoryName = categoryNameById[prompt.category] || prompt.category || "Prompt AI";
  const short = String(prompt.description || "").trim();
  return [
    `Trong chuyên mục ${categoryName}, prompt "${prompt.title}" được thiết kế để giúp bạn ra kết quả nhanh và đúng mục tiêu thay vì mất thời gian thử-sai nhiều lần. Phù hợp cho cá nhân, đội nhóm và doanh nghiệp muốn chuẩn hóa quy trình làm việc với AI, giữ chất lượng đầu ra ổn định và dễ mở rộng.`,
    "",
    "- Giảm thời gian soạn yêu cầu nhờ cấu trúc prompt rõ ràng, có thể copy dùng ngay.",
    "- Tăng chất lượng đầu ra với hướng dẫn cụ thể theo bối cảnh thực tế của người dùng Việt.",
    "- Dễ tùy biến theo ngành nghề, tệp khách hàng và mức độ kinh nghiệm khác nhau.",
    "- Hỗ trợ triển khai nhất quán cho cả cá nhân lẫn team, hạn chế lệch tiêu chuẩn.",
    "- Tối ưu chuyển đổi khi dùng cho mục tiêu bán hàng, chăm sóc khách hoặc marketing.",
    "",
    `Cách dùng nhanh: điền đầy đủ ngữ cảnh, mục tiêu, giới hạn đầu ra và phong cách mong muốn trước khi chạy prompt. Sau đó yêu cầu AI trả 2-3 phiên bản để chọn bản phù hợp nhất. Nếu cần, bạn tiếp tục refine bằng cách bổ sung ví dụ thực tế, tiêu chí đánh giá và định dạng xuất mong muốn (bullet/checklist/bảng). Quy trình này giúp kết quả thực dụng hơn và giảm thời gian chỉnh sửa vòng sau.`,
    "",
    `Mini input: "Mục tiêu: áp dụng prompt ${prompt.title} cho nhu cầu thực tế của tôi. Bối cảnh: ${short || "người dùng cần kết quả rõ ràng, có thể áp dụng ngay"}. Hãy trả lời ngắn gọn, có bước hành động và ví dụ."`,
    `Mini output: "Dưới đây là phương án tối ưu cho mục tiêu của bạn, gồm phần tóm tắt nhanh, checklist triển khai và mẫu áp dụng ngay. Bạn có thể chọn bản gọn để dùng liền hoặc bản đầy đủ để team triển khai đồng bộ."`,
    "",
    `Dùng ngay prompt "${prompt.title}" để tăng tốc công việc, cải thiện chất lượng đầu ra và tạo lợi thế rõ ràng trong chuyên mục ${categoryName}.`,
  ].join("\n");
}

function normalizePrompt(prompt: Prompt): Prompt {
  const nextPreview = prompt.preview && prompt.preview.length >= 80
    ? prompt.preview
    : buildPremiumPreview(prompt);
  const nextFullContent = isPremiumContent(prompt.fullContent)
    ? prompt.fullContent
    : buildPremiumFullContent(prompt);
  return {
    ...prompt,
    preview: nextPreview,
    fullContent: nextFullContent,
    detailDescription: prompt.detailDescription || buildAutoDetailDescription(prompt),
  };
}

const basePrompts: Prompt[] = [
  ...contentPrompts,
  ...codingPrompts,
  ...designPrompts,
  ...marketingPrompts,
  ...educationPrompts,
  ...businessPrompts,
  ...cskhPrompts,
  ...salesPrompts,
  ...testPrompts,
  ...realestatePrompts,
  ...healthcarePrompts,
  ...travelPrompts,
  ...legalPrompts,
  ...financePrompts,
  ...hrPrompts,
  ...ecommercePrompts,
  ...socialPrompts,
  ...datasciencePrompts,
];
// Kết hợp và chuẩn hóa toàn bộ prompt theo khung premium.
export const prompts: Prompt[] = basePrompts.map(normalizePrompt);
export const bundles = [
  {
    id: "bundle-1",
    name: "Content Creator Pack",
    description: "Bộ 10 prompt viết content đa nền tảng hay nhất",
    prompts: ["content-1", "content-5", "content-10", "content-15", "content-20", "content-25", "content-30", "content-35", "content-40", "content-45"],
    price: 199000,
    originalPrice: 490000,
    discount: 59,
  },
  {
    id: "bundle-2",
    name: "Developer Toolkit",
    description: "Bộ 10 prompt lập trình chuyên nghiệp",
    prompts: ["code-1", "code-5", "code-10", "code-15", "code-20", "code-25", "code-30", "code-35", "code-40", "code-45"],
    price: 249000,
    originalPrice: 590000,
    discount: 58,
  },
  {
    id: "bundle-3",
    name: "Designer Starter Kit",
    description: "Bộ 10 prompt thiết kế ảnh AI cho mọi nhu cầu",
    prompts: ["design-1", "design-5", "design-10", "design-15", "design-20", "design-25", "design-30", "design-35", "design-40", "design-45"],
    price: 219000,
    originalPrice: 550000,
    discount: 60,
  },  {
    id: "bundle-4",
    name: "Marketing Master Pack",
    description: "Bộ 10 prompt marketing & SEO toàn diện",
    prompts: ["mkt-1", "mkt-5", "mkt-10", "mkt-15", "mkt-20", "mkt-25", "mkt-30", "mkt-35", "mkt-40", "mkt-45"],
    price: 229000,
    originalPrice: 570000,
    discount: 60,
  },
  {
    id: "bundle-5",
    name: "Education All-in-One",
    description: "Bộ 10 prompt giáo dục & học tập hiệu quả",
    prompts: ["edu-1", "edu-5", "edu-10", "edu-15", "edu-20", "edu-25", "edu-30", "edu-35", "edu-40", "edu-45"],
    price: 149000,
    originalPrice: 390000,
    discount: 62,
  },
  {
    id: "bundle-6",
    name: "Business All-in-One",
    description: "Trọn bộ 10 prompt cho doanh nghiệp & startup",
    prompts: ["biz-1", "biz-5", "biz-10", "biz-15", "biz-20", "biz-25", "biz-30", "biz-35", "biz-40", "biz-45"],
    price: 299000,
    originalPrice: 750000,
    discount: 60,
  },
  {
    id: "sales-bundle",
    name: "Sát Thủ Bán Hàng - 50 Prompt",
    description: "Trọn bộ 50 prompt Coach Bán Hàng Ảo: thấu hiểu khách, phá băng, xử lý từ chối, chốt đơn, chăm sóc sau bán",
    prompts: Array.from({ length: 50 }, (_, i) => `sale-${i + 1}`),
    price: 499000,
    originalPrice: 1450000,
    discount: 66,
  },
  {
    id: "bundle-7",
    name: "MEGA PACK - Tất cả 600 Prompt",
    description: "Trọn bộ toàn bộ 600 prompt từ 6 danh mục, tiết kiệm tối đa",    prompts: [],
    price: 999000,
    originalPrice: 3500000,
    discount: 71,
  },
];