const fs = require('fs');
const path = require('path');
const base = 'D:/Promt/promptvn/src';

function writeFile(relPath, content) {
  const full = path.join(base, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Written:', relPath);
}

// ============================================
// 1. BLOG DATA - blog-posts.ts (with sample posts)
// ============================================
writeFile('data/blog-posts.ts', `
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export const blogCategories = [
  { id: "huong-dan", name: "Hướng dẫn", icon: "📖" },
  { id: "tin-tuc", name: "Tin tức AI", icon: "📰" },
  { id: "meo-hay", name: "Mẹo hay", icon: "💡" },
  { id: "case-study", name: "Case Study", icon: "📊" },
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Hướng dẫn viết Prompt AI hiệu quả cho người mới bắt đầu",
    slug: "huong-dan-viet-prompt-ai-hieu-qua",
    excerpt: "Tìm hiểu cách viết prompt AI chuyên nghiệp để có được kết quả tốt nhất từ ChatGPT, Claude và các công cụ AI khác.",
    content: "<h2>Prompt AI là gì?</h2><p>Prompt AI là câu lệnh hoặc yêu cầu mà bạn gửi cho các mô hình ngôn ngữ lớn (LLM) như ChatGPT, Claude, Gemini. Một prompt tốt sẽ giúp bạn nhận được kết quả chính xác và hữu ích hơn.</p><h2>5 nguyên tắc viết Prompt hiệu quả</h2><p><strong>1. Rõ ràng và cụ thể:</strong> Thay vì viết 'Viết bài về marketing', hãy viết 'Viết bài blog 1000 từ về chiến lược email marketing cho doanh nghiệp nhỏ, bao gồm 5 bước cụ thể và ví dụ thực tế'.</p><p><strong>2. Cung cấp ngữ cảnh:</strong> Cho AI biết bạn là ai, đối tượng mục tiêu là ai, và mục đích sử dụng.</p><p><strong>3. Định dạng đầu ra:</strong> Chỉ rõ format bạn muốn: bullet points, bảng, đoạn văn, v.v.</p><p><strong>4. Cho ví dụ:</strong> Nếu có thể, cung cấp 1-2 ví dụ về kết quả bạn mong muốn.</p><p><strong>5. Lặp lại và cải thiện:</strong> Đừng ngại chỉnh sửa prompt nhiều lần để có kết quả tốt nhất.</p><h2>Kết luận</h2><p>Viết prompt tốt là kỹ năng quan trọng trong thời đại AI. Hãy thực hành thường xuyên và sử dụng các template có sẵn trên PromptVN để tiết kiệm thời gian.</p>",
    author: "PromptVN Team",
    category: "huong-dan",
    tags: ["prompt engineering", "AI", "hướng dẫn", "ChatGPT"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    views: 1250
  },
  {
    id: "blog-2",
    title: "Top 10 xu hướng AI năm 2024 mà bạn không thể bỏ qua",
    slug: "top-10-xu-huong-ai-2024",
    excerpt: "Khám phá những xu hướng AI nổi bật nhất trong năm 2024 và cách chúng ảnh hưởng đến công việc hàng ngày.",
