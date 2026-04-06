/** Nội dung marketing /khoa-hoc — dùng chung client admin + server (không import Supabase). */

export type CoursePageStatKey = "courseCount" | "totalLessons" | "avgRating" | "freeCount";

export type CoursePageStatSlot = {
  label: string;
  sub: string;
  valueKey: CoursePageStatKey;
};

export type CoursePageOutcome = {
  icon: string;
  title: string;
  body: string;
};

export type CoursePagePath = {
  name: string;
  desc: string;
  topics: string[];
};

export type CoursePageFaq = { q: string; a: string };

export type CoursePageLink = { label: string; href: string };

export type CoursePageSettings = {
  hero: {
    badge: string;
    title: string;
    intro: string;
    bullets: string[];
    primaryCta: CoursePageLink;
    secondaryCta: CoursePageLink;
  };
  stats: CoursePageStatSlot[];
  outcomesSection: { heading: string; subheading: string };
  outcomes: CoursePageOutcome[];
  pathsSection: {
    eyebrow: string;
    title: string;
    intro: string;
    asideNote: string;
  };
  paths: CoursePagePath[];
  methodSection: {
    title: string;
    p1: string;
    p2: string;
    links: CoursePageLink[];
  };
  audienceBox: {
    title: string;
    lines: string[];
    /** Dùng {{students}} để chèn tổng học viên (định dạng vi-VN) */
    footerHtml: string;
  };
  listSection: { title: string; hint: string };
  faqSection: {
    title: string;
    contactLead: string;
    contactLabel: string;
    contactHref: string;
  };
  faq: CoursePageFaq[];
  cta: {
    title: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const DEFAULT_COURSE_PAGE_SETTINGS: CoursePageSettings = {
  hero: {
    badge: "Học có lộ trình — làm được việc thật",
    title: "Khóa học AI & Prompt Engineering",
    intro:
      "Từ nền tảng đến ứng dụng doanh nghiệp: bạn học cách nghĩ, viết prompt và xây quy trình với ChatGPT, Claude, Midjourney và hệ sinh thái công cụ AI — kèm quiz, ví dụ thực tế và liên kết với kho prompt trên PromptVN.",
    bullets: [
      "Framework viết prompt, tránh lỗi chung chung và lãng phí token",
      "Bài học theo từng chủ đề; kiểm tra nhanh sau mỗi phần",
      "Lọc theo trình độ và gói thành viên (Miễn phí / Pro / Business)",
    ],
    primaryCta: { label: "Xem khóa học", href: "#danh-sach-khoa-hoc" },
    secondaryCta: { label: "Kho prompt thực hành", href: "/danh-muc" },
  },
  stats: [
    { label: "Khóa học", sub: "chủ đề chính", valueKey: "courseCount" },
    { label: "Bài học", sub: "nội dung + quiz", valueKey: "totalLessons" },
    { label: "Đánh giá TB", sub: "từ học viên", valueKey: "avgRating" },
    { label: "Miễn phí", sub: "khóa mở sẵn", valueKey: "freeCount" },
  ],
  outcomesSection: {
    heading: "Bạn nhận được gì sau lộ trình?",
    subheading:
      "Chúng tôi thiết kế khóa học theo hướng **ứng dụng**: mỗi phần đều gắn với công việc cụ thể — từ viết email đến chiến dịch nội dung, từ ảnh AI đến tự động hóa quy trình.",
  },
  outcomes: [
    {
      icon: "brain",
      title: "Tư duy Prompt có hệ thống",
      body: "Nắm framework CREAD, phân tách nhiệm vụ, kiểm soát định dạng đầu ra — giảm thử-sai và tiết kiệm token.",
    },
    {
      icon: "zap",
      title: "Ứng dụng ngay trong công việc",
      body: "Email, báo cáo, nội dung, phân tích dữ liệu, automation: mỗi khóa gắn với tình huống thực tế, không lý thuyết suông.",
    },
    {
      icon: "target",
      title: "Đo lường tiến độ",
      body: "Quiz sau từng bài giúp củng cố kiến thức; bạn biết mình đã nắm chắc phần nào trước khi chuyển bài.",
    },
    {
      icon: "layers",
      title: "Đa nền tảng AI",
      body: "ChatGPT, Claude, Midjourney, Gemini và quy trình tích hợp — chọn đúng công cụ cho từng loại nhiệm vụ.",
    },
  ],
  pathsSection: {
    eyebrow: "Lộ trình gợi ý",
    title: "Từ căn bản đến chuyên sâu",
    intro:
      "Bạn không bắt buộc học theo thứ tự tuyến tính: hãy bắt đầu từ trình độ phù hợp, sau đó lấp chỗ trống kỹ năng bằng các khóa còn lại. Bảng dưới đây giúp định hướng nhanh.",
    asideNote: "Gợi ý theo mức độ, không phải thứ tự bắt buộc",
  },
  paths: [
    {
      name: "Cơ bản",
      desc: "Làm quen prompt, thiết lập công cụ, viết lệnh rõ ràng và tránh lỗi phổ biến. Phù hợp người mới bắt đầu hoặc tự học rời rạc.",
      topics: ["Prompt Engineering 101", "ChatGPT hàng ngày", "Nền tảng đa model"],
    },
    {
      name: "Trung cấp",
      desc: "Đi sâu sáng tạo hình ảnh, marketing nội dung, tự động hóa — kết hợp AI với quy trình team và KPI.",
      topics: ["Midjourney", "Marketing & content", "Automation & workflow"],
    },
    {
      name: "Nâng cao",
      desc: "Tối ưu chi phí, chiến lược enterprise, bảo mật và quy trình chuẩn cho tổ chức — nghĩ như kiến trúc sư AI.",
      topics: ["Tối ưu token & chi phí", "AI trong doanh nghiệp", "Governance & an toàn"],
    },
  ],
  methodSection: {
    title: "Cách chúng tôi thiết kế bài học",
    p1:
      "Mỗi khóa gồm nhiều bài học (lesson). Trong từng bài, nội dung trình bày dạng chương nhỏ: khái niệm, ví dụ, checklist và lỗi thường gặp. Phần quiz cuối bài giúp bạn tự kiểm tra trước khi chuyển sang chủ đề mới — tránh ảo tưởng “đã hiểu” khi chỉ đọc lướt.",
    p2:
      "Sau khóa, bạn có thể đưa prompt vào workflow thật: tham khảo thêm hàng trăm mẫu trên nền tảng, hoặc nâng gói thành viên để mở khóa khóa Pro/Business và tính năng phù hợp.",
    links: [
      { label: "Danh mục prompt", href: "/danh-muc" },
      { label: "Bắt đầu với prompt (hướng dẫn)", href: "/bat-dau-dung-prompt" },
      { label: "Cách dùng prompt AI hiệu quả", href: "/cach-dung-prompt-ai" },
    ],
  },
  audienceBox: {
    title: "Ai nên tham gia?",
    lines: [
      "Người làm marketing, content, sales cần tốc độ và chất lượng đồng đều.",
      "Developer, PM, analyst muốn tích hợp AI vào báo cáo và tự động hóa.",
      "Designer, creator cần thống nhất prompt hình ảnh và storytelling.",
      "Founder, team lead xây playbook nội bộ và đào tạo nhân sự dùng AI đúng cách.",
    ],
    footerHtml:
      "Tổng cộng hơn <strong>{{students}}</strong> lượt đăng ký ghi nhận trên các khóa — con số minh họa mức độ quan tâm cộng đồng; chất lượng đầu ra phụ thuộc vào việc bạn thực hành sau mỗi bài.",
  },
  listSection: {
    title: "Tất cả khóa học",
    hint: "Lọc theo trình độ hoặc gói. Nhấn vào thẻ để vào từng khóa và học từng bài.",
  },
  faqSection: {
    title: "Câu hỏi thường gặp",
    contactLead: "Nếu cần hỗ trợ tài khoản hoặc thanh toán, xem thêm trang",
    contactLabel: "Liên hệ",
    contactHref: "/lien-he",
  },
  faq: [
    {
      q: "Khóa học trên PromptVN khác gì video YouTube miễn phí?",
      a: "Nội dung được cấu trúc theo lộ trình, có bài học HTML dễ tra cứu, quiz kiểm tra sau mỗi phần và gắn với thư viện prompt trên nền tảng — bạn học xong có thể áp dụng ngay với kho mẫu có sẵn.",
    },
    {
      q: "Tôi chưa có gói Pro/Business có học được không?",
      a: "Có. Các khóa gắn nhãn Miễn phí mở cho mọi người. Khóa Pro/Business yêu cầu gói tương ứng để mở khóa toàn bộ — phù hợp khi bạn đã dùng AI thường xuyên và cần chiều sâu.",
    },
    {
      q: "Mất bao lâu để hoàn thành một khóa?",
      a: "Thời lượng ghi trên từng thẻ khóa (ví dụ 4–8 giờ). Bạn có thể học từng bài, tạm dừng bất cứ lúc nào; không giới hạn số lần xem lại nội dung bài học.",
    },
    {
      q: "Sau khi học xong tôi làm gì tiếp?",
      a: "Khuyến nghị: áp dụng vào 1–2 dự án thật, lưu prompt vào thư viện cá nhân, và khám phá thêm prompt chuyên sâu theo từng danh mục trên PromptVN để mở rộng kỹ năng.",
    },
    {
      q: "Kiến thức có cập nhật khi AI thay đổi nhanh không?",
      a: "Đội nội dung cập nhật khóa học và bổ sung bài khi có thay đổi lớn về mô hình hoặc giao diện công cụ. Phần tư duy prompt và quy trình ít lỗi thời hơn so với thủ thuật từng phiên bản.",
    },
  ],
  cta: {
    title: "Sẵn sàng kết hợp học + làm?",
    body: "Chọn một khóa phù hợp trình độ, học xong 1–2 bài và áp dụng ngay với prompt trên PromptVN — tốc độ triển khai nhanh hơn nhiều so với chỉ xem lý thuyết rời rạc.",
    primaryLabel: "Chọn khóa học",
    primaryHref: "#danh-sach-khoa-hoc",
    secondaryLabel: "Đăng nhập / Đăng ký",
    secondaryHref: "/dang-nhap",
  },
};
