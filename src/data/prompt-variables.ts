export interface VariableField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required: boolean;
}

export interface CategoryVariables {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  fields: VariableField[];
}

export const categoryVariables: CategoryVariables[] = [
  {
    categoryId: "cham-soc-khach-hang",
    categoryName: "Chăm Sóc Khách Hàng",
    icon: "💬",
    color: "from-blue-500 to-blue-600",
    fields: [
      { key: "ten_san_pham", label: "Tên sản phẩm/dịch vụ", placeholder: "VD: Gói hosting Premium", type: "text", required: true },
      { key: "tinh_huong", label: "Tình huống cụ thể", placeholder: "VD: Khách phàn nàn sản phẩm lỗi sau 2 ngày sử dụng", type: "textarea", required: true },
      { key: "loi_khach", label: "Lời khách nói/phàn nàn", placeholder: "VD: Sản phẩm của bên bạn quá đắt mà chất lượng không xứng", type: "textarea", required: false },
      { key: "muc_tieu", label: "Mục tiêu xử lý", placeholder: "VD: Giữ chân khách, upsell gói cao hơn", type: "text", required: false },
      { key: "kenh_giao_tiep", label: "Kênh giao tiếp", placeholder: "", type: "select", options: ["Chat/Messenger", "Điện thoại", "Email", "Gặp trực tiếp", "Zalo"], required: false },
    ],
  },
  {
    categoryId: "ban-hang",
    categoryName: "Bán Hàng",
    icon: "💰",
    color: "from-emerald-500 to-emerald-600",
    fields: [
      { key: "ten_san_pham", label: "Tên sản phẩm/dịch vụ", placeholder: "VD: Khóa học Digital Marketing Pro", type: "text", required: true },
      { key: "gia_san_pham", label: "Giá sản phẩm", placeholder: "VD: 2.990.000đ (gốc 5.990.000đ)", type: "text", required: false },
      { key: "doi_tuong_khach", label: "Đối tượng khách hàng", placeholder: "VD: Chủ shop online, 25-40 tuổi", type: "text", required: true },
      { key: "loi_tu_choi", label: "Lời từ chối của khách", placeholder: "VD: Để tôi suy nghĩ thêm / Giá cao quá", type: "textarea", required: false },
      { key: "diem_manh", label: "Điểm mạnh sản phẩm", placeholder: "VD: Cam kết hoàn tiền 100%, hỗ trợ 1-1", type: "textarea", required: false },
    ],
  },
  {
    categoryId: "viet-content",
    categoryName: "Viết Content",
    icon: "✍️",
    color: "from-purple-500 to-purple-600",
    fields: [
      { key: "chu_de", label: "Chủ đề/Topic", placeholder: "VD: Cách tiết kiệm tiền cho người mới đi làm", type: "text", required: true },
      { key: "nen_tang", label: "Nền tảng đăng", placeholder: "", type: "select", options: ["Facebook", "Instagram", "TikTok", "Blog/Website", "LinkedIn", "YouTube", "Email"], required: true },
      { key: "doi_tuong", label: "Đối tượng đọc", placeholder: "VD: Gen Z, nhân viên văn phòng 22-30 tuổi", type: "text", required: false },
      { key: "tone", label: "Tone of voice", placeholder: "", type: "select", options: ["Chuyên nghiệp", "Thân thiện/gần gũi", "Hài hước", "Truyền cảm hứng", "Storytelling", "Bán hàng thuyết phục"], required: false },
      { key: "yeu_cau_them", label: "Yêu cầu thêm", placeholder: "VD: Kèm CTA mạnh, có hashtag, dưới 500 từ", type: "textarea", required: false },
    ],
  },
  {
    categoryId: "marketing",
    categoryName: "Marketing",
    icon: "📊",
    color: "from-orange-500 to-orange-600",
    fields: [
      { key: "san_pham_dv", label: "Sản phẩm/dịch vụ", placeholder: "VD: App quản lý tài chính cá nhân", type: "text", required: true },
      { key: "ngan_sach", label: "Ngân sách marketing", placeholder: "VD: 20 triệu/tháng", type: "text", required: false },
      { key: "kenh_marketing", label: "Kênh marketing", placeholder: "", type: "select", options: ["Facebook Ads", "Google Ads", "SEO", "Email Marketing", "Influencer", "TikTok Ads", "Đa kênh"], required: true },
      { key: "kpi_muc_tieu", label: "KPI mục tiêu", placeholder: "VD: 500 leads/tháng, CPA dưới 50k", type: "text", required: false },
      { key: "doi_thu", label: "Đối thủ cạnh tranh", placeholder: "VD: App A, App B — đang chạy ads mạnh trên Facebook", type: "textarea", required: false },
    ],
  },
  {
    categoryId: "giao-duc",
    categoryName: "Giáo Dục",
    icon: "📚",
    color: "from-cyan-500 to-cyan-600",
    fields: [
      { key: "mon_hoc", label: "Môn học/chủ đề", placeholder: "VD: Toán lớp 10 — Hàm số bậc hai", type: "text", required: true },
      { key: "doi_tuong_hs", label: "Đối tượng học sinh", placeholder: "VD: Học sinh lớp 10, trình độ trung bình", type: "text", required: true },
      { key: "muc_tieu_hoc", label: "Mục tiêu bài học", placeholder: "VD: Hiểu và vẽ được đồ thị hàm bậc hai", type: "text", required: false },
      { key: "phuong_phap", label: "Phương pháp giảng dạy", placeholder: "", type: "select", options: ["Truyền thống", "Gamification", "Project-based", "Flipped classroom", "Thảo luận nhóm", "Case study"], required: false },
      { key: "thoi_luong", label: "Thời lượng", placeholder: "VD: 45 phút / 1 buổi 2 tiếng", type: "text", required: false },
    ],
  },
  {
    categoryId: "lap-trinh",
    categoryName: "Lập Trình",
    icon: "💻",
    color: "from-gray-700 to-gray-800",
    fields: [
      { key: "ngon_ngu", label: "Ngôn ngữ/Framework", placeholder: "VD: React, Next.js, TypeScript", type: "text", required: true },
      { key: "mo_ta_tinh_nang", label: "Mô tả tính năng", placeholder: "VD: Trang dashboard hiển thị biểu đồ doanh thu realtime", type: "textarea", required: true },
      { key: "tech_stack", label: "Tech stack hiện tại", placeholder: "VD: Next.js 14, Supabase, Tailwind CSS", type: "text", required: false },
      { key: "trinh_do", label: "Trình độ", placeholder: "", type: "select", options: ["Beginner", "Intermediate", "Advanced", "Senior/Lead"], required: false },
      { key: "yeu_cau_ky_thuat", label: "Yêu cầu kỹ thuật thêm", placeholder: "VD: Cần responsive, SEO-friendly, loading < 2s", type: "textarea", required: false },
    ],
  },
  {
    categoryId: "thiet-ke-anh",
    categoryName: "Thiết Kế & Ảnh",
    icon: "🎨",
    color: "from-pink-500 to-pink-600",
    fields: [
      { key: "loai_thiet_ke", label: "Loại thiết kế", placeholder: "VD: Banner quảng cáo Facebook, Logo, Poster", type: "text", required: true },
      { key: "phong_cach", label: "Phong cách", placeholder: "", type: "select", options: ["Minimalist", "Luxury/Sang trọng", "Playful/Vui tươi", "Corporate/Chuyên nghiệp", "Retro/Vintage", "Modern/Hiện đại"], required: true },
      { key: "thuong_hieu", label: "Thương hiệu/Brand", placeholder: "VD: Thời trang nữ ABC — tone màu hồng, trẻ trung", type: "text", required: false },
      { key: "kich_thuoc", label: "Kích thước/Platform", placeholder: "VD: 1200x628px (Facebook), 1080x1080 (Instagram)", type: "text", required: false },
      { key: "noi_dung_chinh", label: "Nội dung chính cần truyền tải", placeholder: "VD: Flash sale giảm 50%, chỉ còn 24h", type: "textarea", required: false },
    ],
  },
  {
    categoryId: "kinh-doanh",
    categoryName: "Kinh Doanh",
    icon: "🏢",
    color: "from-indigo-500 to-indigo-600",
    fields: [
      { key: "nganh_nghe", label: "Ngành nghề", placeholder: "VD: F&B — chuỗi cà phê, 5 chi nhánh", type: "text", required: true },
      { key: "quy_mo", label: "Quy mô doanh nghiệp", placeholder: "VD: 50 nhân viên, doanh thu 2 tỷ/tháng", type: "text", required: true },
      { key: "muc_tieu_kd", label: "Mục tiêu kinh doanh", placeholder: "VD: Mở rộng lên 10 chi nhánh trong 12 tháng", type: "text", required: false },
      { key: "thach_thuc", label: "Thách thức hiện tại", placeholder: "VD: Chi phí vận hành cao, khó tuyển nhân viên chất lượng", type: "textarea", required: false },
      { key: "nguon_luc", label: "Nguồn lực hiện có", placeholder: "VD: Vốn 5 tỷ, team marketing 3 người", type: "text", required: false },
    ],
  },
];

// Map category slug to categoryId
export const categorySlugMap: Record<string, string> = {
  "cham-soc-khach-hang": "cham-soc-khach-hang",
  "ban-hang": "ban-hang",
  "viet-content": "viet-content",
  "marketing": "marketing",
  "giao-duc": "giao-duc",
  "lap-trinh": "lap-trinh",
  "thiet-ke-anh": "thiet-ke-anh",
  "kinh-doanh": "kinh-doanh",
};

// Map prompt category field to categoryId
export const promptCategoryMap: Record<string, string> = {
  "Chăm sóc khách hàng": "cham-soc-khach-hang",
  "Bán hàng": "ban-hang",
  "Viết Content": "viet-content",
  "Marketing": "marketing",
  "Giáo dục": "giao-duc",
  "Lập trình": "lap-trinh",
  "Thiết kế & Ảnh": "thiet-ke-anh",
  "Kinh doanh": "kinh-doanh",
};

export function getCategoryVariables(categoryId: string): CategoryVariables | undefined {
  return categoryVariables.find((c) => c.categoryId === categoryId);
}

export function getCategoryIdFromPrompt(promptCategory: string): string | undefined {
  return promptCategoryMap[promptCategory];
}
