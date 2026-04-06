export interface CourseQuiz {
  question: string;
  options: string[];
  correct: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  quiz: CourseQuiz[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  price: number;
  tier: string;
  image: string;
  lessons: CourseLesson[];
}
export const courses: Course[] = [
  {
    id: "course-1",
    title: "Prompt Engineering 101",
    slug: "prompt-engineering-101",
    description: "Khóa học nền tảng về Prompt Engineering - từ zero đến hero. Học cách viết prompt hiệu quả cho mọi AI model.",
    instructor: "PromptVN Team",
    level: "Cơ bản",
    duration: "4 giờ",
    rating: 4.8,
    students: 1250,
    price: 0,
    tier: "free",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "pe101-1",
        title: "Prompt là gì? Tại sao quan trọng?",
        duration: "45 phút",        content: "<h2>Giới thiệu Prompt Engineering</h2><p>Prompt Engineering là nghệ thuật và khoa học viết câu lệnh cho AI. Một prompt tốt giúp bạn nhận được kết quả chính xác, hữu ích và tiết kiệm thời gian.</p><h3>Tại sao Prompt Engineering quan trọng?</h3><p>Theo nghiên cứu, prompt được viết tốt có thể tăng chất lượng output lên 200-400%. Đây là kỹ năng thiết yếu trong thời đại AI.</p><h3>Các thành phần của một Prompt</h3><ul><li><strong>Context:</strong> Bối cảnh và thông tin nền</li><li><strong>Role:</strong> Vai trò bạn muốn AI đảm nhận</li><li><strong>Task:</strong> Nhiệm vụ cụ thể cần thực hiện</li><li><strong>Format:</strong> Định dạng output mong muốn</li></ul><p>Trong bài học tiếp theo, chúng ta sẽ đi sâu vào từng thành phần.</p>",
        quiz: [
          { question: "Prompt Engineering là gì?", options: ["Kỹ thuật lập trình AI", "Nghệ thuật viết câu lệnh cho AI", "Thiết kế giao diện AI", "Huấn luyện model AI"], correct: 1 },
          { question: "Prompt tốt có thể tăng chất lượng output bao nhiêu %?", options: ["10-20%", "50-100%", "200-400%", "1000%"], correct: 2 },
        ],
      },
      {
        id: "pe101-2",
        title: "Công thức CREAD viết Prompt",
        duration: "60 phút",        content: "<h2>Công thức CREAD</h2><p>CREAD là framework 5 bước giúp bạn viết prompt hiệu quả mọi lúc.</p><h3>C - Context (Ngữ cảnh)</h3><p>Cung cấp bối cảnh cụ thể. Thay vì hỏi chung chung, hãy cho AI biết bạn là ai, đang làm gì, cần gì.</p><h3>R - Role (Vai trò)</h3><p>Giao vai trò cho AI: chuyên gia SEO, copywriter, data analyst... AI sẽ trả lời từ góc nhìn chuyên môn đó.</p><h3>E - Examples (Ví dụ)</h3><p>Cung cấp 1-2 ví dụ mẫu (few-shot prompting). AI sẽ hiểu pattern và áp dụng cho yêu cầu của bạn.</p><h3>A - Action (Hành động)</h3><p>Mô tả rõ nhiệm vụ: Phân tích, Viết, So sánh, Tạo... Dùng động từ cụ thể.</p><h3>D - Details (Chi tiết)</h3><p>Thêm ràng buộc: độ dài, format, tone, ngôn ngữ, đối tượng đọc.</p>",
        quiz: [
          { question: "CREAD viết tắt của gì?", options: ["Create, Read, Edit, Add, Delete", "Context, Role, Examples, Action, Details", "Copy, Rewrite, Extract, Analyze, Draft", "Code, Run, Execute, Apply, Deploy"], correct: 1 },
          { question: "Few-shot prompting là gì?", options: ["Chụp ảnh ít lần", "Cung cấp ví dụ mẫu cho AI", "Dùng ít token", "Hỏi ngắn gọn"], correct: 1 },
        ],
      },
      {
        id: "pe101-3",
        title: "Thực hành: Viết Prompt cho Marketing",
        duration: "75 phút",        content: "<h2>Thực hành Prompt Marketing</h2><p>Trong bài này, chúng ta sẽ áp dụng CREAD để viết prompt cho các tình huống marketing thực tế.</p><h3>Bài tập 1: Email Marketing</h3><p>Viết prompt để tạo email giới thiệu sản phẩm mới. Áp dụng đầy đủ 5 yếu tố CREAD.</p><h3>Bài tập 2: Social Media Content</h3><p>Tạo prompt cho bài đăng Facebook Ads với CTA rõ ràng, target audience cụ thể.</p><h3>Bài tập 3: SEO Blog</h3><p>Viết prompt để tạo bài blog chuẩn SEO 1500 từ, có heading structure, keyword placement.</p><h3>Mẹo quan trọng</h3><ul><li>Luôn chỉ định tone of voice phù hợp brand</li><li>Nêu rõ đối tượng đọc (persona)</li><li>Yêu cầu nhiều variations để A/B test</li></ul>",
        quiz: [
          { question: "Khi viết prompt cho email marketing, yếu tố nào quan trọng nhất?", options: ["Độ dài email", "Context về sản phẩm và đối tượng", "Số lượng emoji", "Font chữ"], correct: 1 },
          { question: "Tại sao nên yêu cầu AI tạo nhiều variations?", options: ["Để tốn nhiều token hơn", "Để A/B testing và chọn version tốt nhất", "Vì AI chỉ viết tốt lần thứ 3", "Không cần thiết"], correct: 1 },
        ],
      },
      {
        id: "pe101-4",
        title: "Lỗi thường gặp và cách khắc phục",
        duration: "60 phút",        content: "<h2>5 Lỗi phổ biến khi viết Prompt</h2><h3>1. Quá chung chung</h3><p>Thay vì hỏi chung, hãy cụ thể hóa mọi yêu cầu. Nêu rõ context, audience, format.</p><h3>2. Thiếu ngữ cảnh</h3><p>AI không biết bạn là ai. Hãy cung cấp background về bản thân, công việc, mục tiêu.</p><h3>3. Không chỉ định format</h3><p>Nói rõ muốn bullet points, bảng, đoạn văn, hay JSON. AI follow format rất tốt khi được yêu cầu.</p><h3>4. Quá nhiều yêu cầu một lúc</h3><p>Chia nhỏ thành nhiều prompt riêng biệt. Mỗi prompt một nhiệm vụ rõ ràng.</p><h3>5. Không iterate</h3><p>Prompt đầu tiên ít khi hoàn hảo. Hãy yêu cầu AI chỉnh sửa, cải thiện, thêm bớt.</p><h2>Tổng kết khóa học</h2><p>Bạn đã nắm vững nền tảng Prompt Engineering. Hãy luyện tập hàng ngày và khám phá thêm prompt chuyên nghiệp trên PromptVN!</p>",
        quiz: [
          { question: "Lỗi phổ biến nhất khi viết prompt là gì?", options: ["Viết quá dài", "Quá chung chung, thiếu cụ thể", "Dùng tiếng Anh", "Hỏi quá nhiều câu hỏi"], correct: 1 },
          { question: "Khi output chưa ưng ý, nên làm gì?", options: ["Bỏ cuộc", "Đổi sang AI khác", "Iterate - yêu cầu AI chỉnh sửa và cải thiện", "Viết lại từ đầu"], correct: 2 },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "ChatGPT cho Công việc Hàng ngày",
    slug: "chatgpt-cho-cong-viec",
    description: "Ứng dụng ChatGPT vào công việc thực tế: email, báo cáo, phân tích dữ liệu, brainstorming.",
    instructor: "PromptVN Team",
    level: "Cơ bản - Trung cấp",
    duration: "5 giờ",
    rating: 4.7,
    students: 890,
    price: 199000,
    tier: "pro",
    image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "cgpt-1",
        title: "Thiết lập ChatGPT tối ưu",
        duration: "45 phút",        content: "<h2>Cấu hình ChatGPT cho công việc</h2><p>Trước khi bắt đầu, hãy thiết lập ChatGPT để phù hợp với nhu cầu công việc của bạn.</p><h3>Custom Instructions</h3><p>Vào Settings > Custom Instructions, điền thông tin về bản thân và cách bạn muốn AI trả lời. Điều này giúp AI hiểu context của bạn mà không cần nhắc lại mỗi lần.</p><h3>GPTs và Plugins</h3><p>Khám phá GPT Store để tìm các GPT chuyên biệt cho công việc: viết email, phân tích data, tạo presentation...</p><h3>Keyboard Shortcuts</h3><p>Ctrl+Shift+; để mở cuộc hội thoại mới. Tận dụng shortcuts để làm việc nhanh hơn.</p>",
        quiz: [
          { question: "Custom Instructions giúp gì?", options: ["Thay đổi giao diện ChatGPT", "ChatGPT nhớ context của bạn", "Tăng tốc độ trả lời", "Giảm giá subscription"], correct: 1 },
          { question: "GPT Store là gì?", options: ["Cửa hàng bán GPT", "Nơi tìm GPT chuyên biệt cho từng lĩnh vực", "Kho lưu trữ hội thoại", "Trang cài đặt"], correct: 1 },
        ],
      },
      {
        id: "cgpt-2",
        title: "Viết Email và Báo cáo chuyên nghiệp",
        duration: "60 phút",        content: "<h2>Email chuyên nghiệp với ChatGPT</h2><p>ChatGPT giúp viết email nhanh gấp 5 lần, với tone phù hợp và cấu trúc rõ ràng.</p><h3>Template Prompt cho Email</h3><p>Hãy đóng vai communication specialist. Viết email [loại email] cho [đối tượng]. Tone [formal/casual]. Bao gồm: mục đích chính, supporting points, CTA rõ ràng. Dưới 200 từ.</p><h3>Báo cáo chuyên nghiệp</h3><p>Dùng ChatGPT để tạo outline, viết từng section, thêm data insights. Luôn review và edit trước khi gửi.</p><h3>Mẹo quan trọng</h3><ul><li>Cung cấp context đầy đủ về công ty, vị trí, mối quan hệ</li><li>Chỉ định tone phù hợp văn hóa công ty</li><li>Luôn proofread output trước khi gửi</li></ul>",
        quiz: [
          { question: "Khi dùng ChatGPT viết email, điều gì quan trọng nhất?", options: ["Copy paste nguyên output", "Cung cấp context và review trước khi gửi", "Viết càng dài càng tốt", "Dùng nhiều emoji"], correct: 1 },
          { question: "ChatGPT giúp viết email nhanh hơn bao nhiêu lần?", options: ["2 lần", "5 lần", "10 lần", "100 lần"], correct: 1 },
        ],
      },
      {
        id: "cgpt-3",
        title: "Phân tích dữ liệu và Brainstorming",
        duration: "75 phút",        content: "<h2>Data Analysis với ChatGPT</h2><p>ChatGPT Plus với Code Interpreter có thể phân tích file Excel, CSV, tạo biểu đồ và insights tự động.</p><h3>Cách upload và phân tích data</h3><p>Upload file trực tiếp vào ChatGPT. Yêu cầu: phân tích xu hướng, tìm anomalies, tạo visualization, đề xuất action items.</p><h3>Brainstorming hiệu quả</h3><p>Dùng kỹ thuật SCAMPER: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse. Yêu cầu ChatGPT brainstorm theo từng hướng.</p><h3>Mind Mapping</h3><p>Yêu cầu ChatGPT tạo mind map dạng text hoặc markdown. Từ 1 ý tưởng trung tâm, phát triển ra các nhánh con.</p>",
        quiz: [
          { question: "Code Interpreter trong ChatGPT dùng để làm gì?", options: ["Viết code website", "Phân tích file data, tạo biểu đồ", "Dịch ngôn ngữ lập trình", "Debug code"], correct: 1 },
          { question: "SCAMPER là gì?", options: ["Ngôn ngữ lập trình", "Framework brainstorming", "Công cụ AI mới", "Plugin ChatGPT"], correct: 1 },
        ],
      },
      {
        id: "cgpt-4",
        title: "Workflow tự động hóa với ChatGPT",
        duration: "60 phút",        content: "<h2>Tự động hóa công việc</h2><p>Kết hợp ChatGPT với các công cụ khác để tạo workflow tự động.</p><h3>ChatGPT + Zapier</h3><p>Tự động hóa quy trình: nhận email > ChatGPT phân loại > trả lời tự động hoặc chuyển cho team phù hợp.</p><h3>ChatGPT API cho business</h3><p>Tích hợp ChatGPT vào hệ thống nội bộ: chatbot CSKH, content generator, data pipeline.</p><h3>Batch Processing</h3><p>Xử lý hàng loạt: dịch 100 product descriptions, tạo 50 social media posts, phân tích 200 customer reviews cùng lúc.</p><h2>Tổng kết</h2><p>ChatGPT không chỉ là chatbot - nó là productivity multiplier. Áp dụng đúng cách giúp bạn tiết kiệm 10-20 giờ/tuần.</p>",
        quiz: [
          { question: "ChatGPT kết hợp Zapier để làm gì?", options: ["Tạo website", "Tự động hóa quy trình công việc", "Thiết kế đồ họa", "Quản lý tài chính"], correct: 1 },
          { question: "Batch Processing với ChatGPT là gì?", options: ["Chạy nhiều model cùng lúc", "Xử lý hàng loạt nội dung cùng lúc", "Nấu ăn theo mẻ", "Cập nhật phần mềm"], correct: 1 },
        ],
      },
    ],
  },
  {
    id: "course-3",
    title: "Midjourney Mastery",
    slug: "midjourney-mastery",
    description: "Thành thạo Midjourney từ cơ bản đến nâng cao - tạo ảnh sản phẩm, artwork, branding assets.",
    instructor: "PromptVN Team",
    level: "Trung cấp",
    duration: "6 giờ",
    rating: 4.9,
    students: 670,
    price: 299000,
    tier: "pro",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "mj-1",
        title: "Midjourney cơ bản và Parameters",
        duration: "60 phút",        content: "<h2>Bắt đầu với Midjourney</h2><p>Midjourney là AI tạo ảnh hàng đầu, đặc biệt mạnh về chất lượng nghệ thuật và product photography.</p><h3>Cấu trúc Prompt cơ bản</h3><p>Format: [Chủ thể] + [Style] + [Lighting] + [Background] + [Parameters]</p><h3>Parameters quan trọng</h3><ul><li><strong>--ar:</strong> Aspect ratio (1:1, 4:5, 16:9)</li><li><strong>--v 6:</strong> Version mới nhất</li><li><strong>--s:</strong> Stylize level (0-1000)</li><li><strong>--q 2:</strong> Quality cao</li><li><strong>--no:</strong> Negative prompt</li></ul><h3>Discord workflow</h3><p>Sử dụng /imagine trong Discord server Midjourney. Tìm hiểu cách upscale, variation, và remix.</p>",
        quiz: [
          { question: "Parameter --ar dùng để làm gì?", options: ["Chọn art style", "Thiết lập tỷ lệ khung hình", "Tăng chất lượng", "Chọn version"], correct: 1 },
          { question: "Midjourney version mới nhất là?", options: ["V4", "V5", "V6", "V7"], correct: 2 },
        ],
      },
      {
        id: "mj-2",
        title: "Ảnh sản phẩm chuyên nghiệp",
        duration: "90 phút",        content: "<h2>Product Photography với Midjourney</h2><p>Tạo ảnh sản phẩm chuyên nghiệp thay vì thuê photographer đắt đỏ.</p><h3>Flat Lay Photography</h3><p>Prompt mẫu: Flat lay product photography of [sản phẩm] on [bề mặt], soft natural lighting, minimalist composition, editorial style --ar 1:1 --v 6 --s 150</p><h3>Lifestyle Shot</h3><p>Prompt mẫu: A person using [sản phẩm] in [bối cảnh], natural morning light, soft focus background, commercial photography style --ar 4:5 --v 6</p><h3>White Background</h3><p>Prompt mẫu: Product photography of [sản phẩm] on pure white background, professional studio lighting, sharp details --ar 1:1 --v 6 --s 100</p>",
        quiz: [
          { question: "Flat lay photography chụp từ góc nào?", options: ["Ngang", "Dưới lên", "Trên xuống", "45 độ"], correct: 2 },
          { question: "Parameter --s ảnh hưởng đến gì?", options: ["Kích thước ảnh", "Mức độ stylize/sáng tạo", "Tốc độ render", "Số lượng ảnh"], correct: 1 },
        ],
      },
      {
        id: "mj-3",
        title: "Branding và Marketing Assets",
        duration: "90 phút",        content: "<h2>Tạo Brand Assets với Midjourney</h2><p>Midjourney giúp tạo nhanh các tài nguyên thương hiệu chuyên nghiệp.</p><h3>Logo Concept</h3><p>Dùng Midjourney để explore logo concepts trước khi thuê designer chỉnh sửa chi tiết.</p><h3>Social Media Graphics</h3><p>Tạo hàng loạt ảnh cho Instagram, Facebook với style nhất quán. Sử dụng seed number để giữ consistency.</p><h3>Banner và Hero Image</h3><p>Tạo banner website, hero images với kích thước chính xác bằng --ar parameter.</p><h3>Mẹo giữ Brand Consistency</h3><ul><li>Lưu lại seed number của ảnh ưng ý</li><li>Tạo style guide prompt: liệt kê colors, mood, style</li><li>Sử dụng --sref để reference style</li></ul>",
        quiz: [
          { question: "Seed number dùng để làm gì?", options: ["Tăng chất lượng ảnh", "Giữ style nhất quán giữa các ảnh", "Thêm watermark", "Chọn theme màu"], correct: 1 },
          { question: "--sref parameter dùng cho?", options: ["Style reference", "Size reference", "Speed reference", "Seed reference"], correct: 0 },
        ],
      },
      {
        id: "mj-4",
        title: "Kỹ thuật nâng cao và Workflow",
        duration: "75 phút",        content: "<h2>Advanced Midjourney Techniques</h2><h3>Image Prompting</h3><p>Upload ảnh reference cùng text prompt. Midjourney sẽ kết hợp style/content từ ảnh reference.</p><h3>Multi-Prompt với :: syntax</h3><p>hot:: dog vs hot dog - dấu :: tách concept. Dùng hot::2 dog::1 để weight concept.</p><h3>Inpainting và Vary Region</h3><p>Chỉnh sửa một phần ảnh mà giữ nguyên phần còn lại. Rất hữu ích cho product placement.</p><h3>Workflow chuyên nghiệp</h3><ol><li>Brainstorm concept bằng text prompt</li><li>Tạo variations để chọn hướng tốt nhất</li><li>Upscale và refine ảnh được chọn</li><li>Post-process trong Photoshop/Canva nếu cần</li></ol><h2>Tổng kết</h2><p>Midjourney là công cụ mạnh mẽ cho visual content. Kết hợp với kỹ năng prompt engineering, bạn có thể tạo nội dung hình ảnh chuyên nghiệp với chi phí gần zero.</p>",
        quiz: [
          { question: "Dấu :: trong Midjourney dùng để làm gì?", options: ["Kết thúc prompt", "Tách các concept riêng biệt", "Thêm negative prompt", "Chọn version"], correct: 1 },
          { question: "Inpainting là gì?", options: ["Vẽ thêm nét mới", "Chỉnh sửa một phần ảnh giữ nguyên phần còn lại", "Tô màu ảnh trắng đen", "In ảnh ra giấy"], correct: 1 },
        ],
      },
    ],
  },  {
    id: "course-4",
    title: "Claude AI Chuyên sâu",
    slug: "claude-ai-chuyen-sau",
    description: "Khai thác tối đa Claude AI - phân tích tài liệu, code review, research chuyên sâu.",
    instructor: "PromptVN Team",
    level: "Trung cấp",
    duration: "4 giờ",
    rating: 4.8,
    students: 450,
    price: 249000,
    tier: "pro",
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "claude-1",
        title: "Claude vs ChatGPT - Khi nào dùng Claude?",
        duration: "45 phút",        content: "<h2>Thế mạnh của Claude</h2><p>Claude (Anthropic) nổi bật với context window 200K tokens, độ chính xác cao, và khả năng phân tích văn bản dài xuất sắc.</p><h3>Khi nào dùng Claude?</h3><ul><li>Phân tích tài liệu dài (hợp đồng, báo cáo, sách)</li><li>Code review và debug chi tiết</li><li>Research chuyên sâu cần độ chính xác cao</li><li>Viết nội dung pháp lý, kỹ thuật</li></ul><h3>So sánh Context Window</h3><p>Claude: 200K tokens (khoảng 150,000 từ). ChatGPT: 128K tokens. Gemini: 1M tokens nhưng chất lượng kém hơn ở context dài.</p>",
        quiz: [
          { question: "Claude có context window bao nhiêu tokens?", options: ["32K", "128K", "200K", "1M"], correct: 2 },
          { question: "Claude đặc biệt mạnh ở lĩnh vực nào?", options: ["Tạo ảnh", "Phân tích tài liệu dài và độ chính xác", "Real-time search", "Video generation"], correct: 1 },
        ],
      },
      {
        id: "claude-2",
        title: "Phân tích tài liệu với Claude",
        duration: "60 phút",        content: "<h2>Document Analysis chuyên sâu</h2><p>Claude có thể đọc và phân tích toàn bộ tài liệu dài trong một lần - từ hợp đồng pháp lý đến báo cáo tài chính.</p><h3>Cách upload tài liệu</h3><p>Kéo thả PDF, DOCX, hoặc paste text trực tiếp. Claude sẽ đọc toàn bộ và sẵn sàng trả lời câu hỏi.</p><h3>Prompt phân tích hiệu quả</h3><p>Hãy phân tích tài liệu này và: 1) Tóm tắt các điểm chính, 2) Highlight các rủi ro hoặc vấn đề, 3) Đề xuất action items, 4) Liệt kê câu hỏi cần clarify.</p><h3>So sánh tài liệu</h3><p>Upload 2 phiên bản hợp đồng và yêu cầu Claude so sánh, tìm khác biệt, đánh giá thay đổi.</p>",
        quiz: [
          { question: "Claude có thể đọc format tài liệu nào?", options: ["Chỉ PDF", "Chỉ text", "PDF, DOCX, text và nhiều format khác", "Chỉ Word"], correct: 2 },
          { question: "Khi phân tích hợp đồng, nên yêu cầu Claude làm gì?", options: ["Chỉ tóm tắt", "Tóm tắt, highlight rủi ro, đề xuất action items", "Chỉ dịch sang tiếng Anh", "In ra PDF"], correct: 1 },
        ],
      },
      {
        id: "claude-3",
        title: "Code Review và Technical Writing",
        duration: "60 phút",        content: "<h2>Claude cho Developer</h2><p>Claude là một trong những AI tốt nhất cho code review, debug, và technical writing.</p><h3>Code Review Prompt</h3><p>Review code này và: 1) Tìm bugs tiềm ẩn, 2) Đề xuất improvements về performance, 3) Kiểm tra security vulnerabilities, 4) Đánh giá code style và best practices.</p><h3>Debug với Claude</h3><p>Paste error message + code context. Claude phân tích root cause và đề xuất fix cụ thể.</p><h3>Technical Documentation</h3><p>Claude viết API docs, README, technical specs rất tốt. Cung cấp code + context, yêu cầu viết documentation chuẩn.</p>",
        quiz: [
          { question: "Claude review code tốt nhờ?", options: ["Tốc độ nhanh", "Context window lớn và độ chính xác cao", "Giao diện đẹp", "Giá rẻ"], correct: 1 },
          { question: "Khi debug với Claude, cần cung cấp gì?", options: ["Chỉ error message", "Error message và code context", "Chỉ tên file", "Screenshot"], correct: 1 },
        ],
      },
      {
        id: "claude-4",
        title: "Research và Tổng hợp thông tin",
        duration: "75 phút",        content: "<h2>Research chuyên sâu với Claude</h2><h3>Literature Review</h3><p>Upload nhiều bài nghiên cứu, yêu cầu Claude tổng hợp, so sánh findings, tìm contradictions.</p><h3>Competitive Analysis</h3><p>Cung cấp thông tin về đối thủ, yêu cầu phân tích SWOT, market positioning, differentiation strategy.</p><h3>Data Synthesis</h3><p>Claude xuất sắc trong việc kết hợp thông tin từ nhiều nguồn thành báo cáo tổng hợp có cấu trúc.</p><h3>Fact-checking</h3><p>Yêu cầu Claude kiểm tra tính chính xác của claims, tìm sources, đánh giá credibility.</p><h2>Tổng kết</h2><p>Claude là công cụ research và analysis mạnh mẽ. Kết hợp context window lớn với độ chính xác cao, Claude phù hợp cho các task cần depth và nuance.</p>",
        quiz: [
          { question: "Claude phù hợp nhất cho loại research nào?", options: ["Research cần real-time data", "Research cần phân tích tài liệu dài và tổng hợp", "Research cần ảnh minh họa", "Research cần video"], correct: 1 },
          { question: "SWOT analysis gồm những gì?", options: ["Speed, Width, Output, Time", "Strengths, Weaknesses, Opportunities, Threats", "Software, Web, Online, Tech", "Simple, Well, Organized, Thorough"], correct: 1 },
        ],
      },
    ],
  },  {
    id: "course-5",
    title: "AI cho Marketing",
    slug: "ai-cho-marketing",
    description: "Ứng dụng AI toàn diện trong marketing: content, ads, email, SEO, social media.",
    instructor: "PromptVN Team",
    level: "Trung cấp",
    duration: "5 giờ",
    rating: 4.6,
    students: 520,
    price: 349000,
    tier: "pro",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "mkt-1",
        title: "Content Marketing với AI",
        duration: "60 phút",        content: "<h2>AI Content Marketing Strategy</h2><p>AI giúp tạo content nhanh gấp 5-10 lần, nhưng cần strategy đúng để đảm bảo chất lượng.</p><h3>Content Pillar Strategy</h3><p>Dùng AI để brainstorm content pillars, tạo content calendar, và viết outline cho từng bài.</p><h3>Blog SEO Content</h3><p>Prompt: Viết bài blog 1500 từ về [topic] cho [audience]. Tối ưu keyword [keyword], có H2/H3 structure, internal links suggestions, meta description.</p><h3>Repurposing Content</h3><p>Từ 1 blog post, dùng AI tạo: 5 social posts, 1 email newsletter, 3 short-form videos scripts, 1 infographic outline.</p>",
        quiz: [
          { question: "AI giúp tạo content nhanh hơn bao nhiêu lần?", options: ["2 lần", "5-10 lần", "50 lần", "100 lần"], correct: 1 },
          { question: "Content repurposing là gì?", options: ["Xóa content cũ", "Tái sử dụng 1 content thành nhiều format", "Copy content đối thủ", "Viết lại content bằng AI"], correct: 1 },
        ],
      },
      {
        id: "mkt-2",
        title: "Facebook & Google Ads với AI",
        duration: "75 phút",        content: "<h2>AI-Powered Advertising</h2><p>Dùng AI để viết ad copy, tạo variations, và tối ưu chiến dịch quảng cáo.</p><h3>Facebook Ads Copy</h3><p>Tạo 10 ad copy variations với hook, body, CTA khác nhau. A/B test để tìm winning ad.</p><h3>Google Ads</h3><p>AI viết headlines (30 ký tự), descriptions (90 ký tự) cho responsive search ads. Tạo 15 headlines + 4 descriptions cho mỗi ad group.</p><h3>Landing Page Copy</h3><p>Dùng AI tạo landing page copy theo framework AIDA: Attention, Interest, Desire, Action.</p>",
        quiz: [
          { question: "Google Ads headline giới hạn bao nhiêu ký tự?", options: ["20", "30", "50", "100"], correct: 1 },
          { question: "AIDA framework gồm?", options: ["AI, Data, Intelligence, Analytics", "Attention, Interest, Desire, Action", "Audience, Intent, Design, Ads", "Analysis, Insight, Decision, Action"], correct: 1 },
        ],
      },
      {
        id: "mkt-3",
        title: "Email Marketing tự động hóa",
        duration: "60 phút",        content: "<h2>AI Email Marketing</h2><p>Email marketing vẫn là kênh ROI cao nhất. AI giúp cá nhân hóa và scale email campaigns.</p><h3>Subject Line Optimization</h3><p>Tạo 20 subject line variations. Sử dụng power words, urgency, personalization. Test A/B liên tục.</p><h3>Email Sequences</h3><p>Dùng AI tạo welcome series (5 emails), nurture sequence (7 emails), abandoned cart (3 emails).</p><h3>Personalization at Scale</h3><p>AI giúp viết email cá nhân hóa theo segment: industry, role, behavior, purchase history.</p>",
        quiz: [
          { question: "Email marketing có ROI cao nhất so với kênh nào?", options: ["Social media", "Tất cả các kênh digital marketing", "SEO", "PPC"], correct: 1 },
          { question: "Welcome series thường gồm bao nhiêu email?", options: ["1-2", "3-5", "10-15", "20+"], correct: 1 },
        ],
      },
      {
        id: "mkt-4",
        title: "SEO và Social Media với AI",
        duration: "60 phút",        content: "<h2>AI cho SEO</h2><h3>Keyword Research</h3><p>Dùng AI để brainstorm keyword ideas, tìm long-tail keywords, phân tích search intent.</p><h3>On-page SEO</h3><p>AI viết meta titles, descriptions, alt tags, internal linking suggestions. Tối ưu content cho featured snippets.</p><h3>Social Media Content</h3><p>Tạo content calendar 30 ngày. Mỗi ngày: 1 bài chính + captions cho multi-platform (Facebook, Instagram, LinkedIn, TikTok).</p><h3>Influencer Outreach</h3><p>AI viết outreach email cá nhân hóa, đề xuất collaboration ideas phù hợp từng influencer.</p><h2>Tổng kết</h2><p>AI là marketing multiplier. Dùng đúng cách giúp small team cạnh tranh với big brands.</p>",
        quiz: [
          { question: "Long-tail keyword là gì?", options: ["Keyword rất dài", "Keyword cụ thể, ít cạnh tranh, conversion cao", "Keyword đuôi dài", "Keyword nhiều người search"], correct: 1 },
          { question: "AI giúp small team marketing như thế nào?", options: ["Thay thế hoàn toàn team", "Scale output để cạnh tranh với big brands", "Giảm chất lượng content", "Không giúp gì"], correct: 1 },
        ],
      },
    ],
  },  {
    id: "course-6",
    title: "Xây dựng Workflow AI",
    slug: "xay-dung-workflow-ai",
    description: "Thiết kế và triển khai AI workflow cho doanh nghiệp - từ automation đến integration.",
    instructor: "PromptVN Team",
    level: "Nâng cao",
    duration: "6 giờ",
    rating: 4.7,
    students: 320,
    price: 499000,
    tier: "business",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "wf-1",
        title: "Tư duy thiết kế AI Workflow",
        duration: "60 phút",        content: "<h2>AI Workflow Design Thinking</h2><p>Workflow AI hiệu quả bắt đầu từ việc hiểu rõ quy trình hiện tại và xác định điểm AI can thiệp tốt nhất.</p><h3>Framework AIAO</h3><p>AI-In, AI-Out: Xác định input gì cho AI, output gì từ AI, và human review ở đâu.</p><h3>Mapping quy trình</h3><p>Vẽ flowchart quy trình hiện tại. Đánh dấu: tasks lặp lại, tasks tốn thời gian, tasks cần sáng tạo, tasks cần accuracy.</p><h3>ROI Assessment</h3><p>Tính ROI cho mỗi điểm tự động hóa: thời gian tiết kiệm x hourly cost - chi phí triển khai.</p>",
        quiz: [
          { question: "Bước đầu tiên khi thiết kế AI workflow?", options: ["Mua tool AI", "Hiểu rõ quy trình hiện tại", "Thuê AI engineer", "Đọc blog về AI"], correct: 1 },
          { question: "AIAO framework là gì?", options: ["AI Input, AI Output", "Artificial Intelligence, Automated Operations", "All In, All Out", "AI Agent, AI Operator"], correct: 0 },
        ],
      },
      {
        id: "wf-2",
        title: "Công cụ No-Code cho AI Workflow",
        duration: "90 phút",        content: "<h2>No-Code AI Tools</h2><p>Không cần lập trình vẫn xây được AI workflow mạnh mẽ.</p><h3>Zapier + AI</h3><p>Kết nối 5000+ apps với AI. Ví dụ: email mới > AI phân loại > Slack notification > Auto-reply.</p><h3>Make (Integromat)</h3><p>Visual workflow builder mạnh hơn Zapier cho complex scenarios. Hỗ trợ branching, looping, error handling.</p><h3>Relevance AI</h3><p>Xây dựng AI agents no-code: chatbot CSKH, document processor, data analyzer.</p><h3>Stack AI</h3><p>Kéo thả để tạo AI pipeline: input > process > output. Tích hợp multiple AI models.</p>",
        quiz: [
          { question: "Zapier kết nối được bao nhiêu apps?", options: ["100+", "1000+", "5000+", "10000+"], correct: 2 },
          { question: "Make (Integromat) mạnh hơn Zapier ở điểm nào?", options: ["Giá rẻ hơn", "Complex scenarios: branching, looping, error handling", "Nhiều apps hơn", "Giao diện đẹp hơn"], correct: 1 },
        ],
      },
      {
        id: "wf-3",
        title: "API Integration và Automation",
        duration: "90 phút",        content: "<h2>AI API Integration</h2><p>Khi no-code không đủ, API integration cho phép customize hoàn toàn.</p><h3>OpenAI API</h3><p>Tích hợp GPT-4 vào hệ thống: customer support, content generation, data extraction.</p><h3>Anthropic API</h3><p>Claude API cho document analysis, code review, long-context tasks.</p><h3>Webhook Automation</h3><p>Thiết lập webhook listeners: khi event xảy ra > trigger AI process > return result.</p><h3>Batch Processing Pipeline</h3><p>Xử lý hàng ngàn items: upload CSV > AI process từng row > output CSV kết quả.</p>",
        quiz: [
          { question: "Khi nào cần dùng API thay vì no-code?", options: ["Luôn luôn", "Khi cần customize và scale lớn", "Khi budget thấp", "Không bao giờ"], correct: 1 },
          { question: "Webhook automation hoạt động thế nào?", options: ["Chạy theo lịch", "Trigger khi event xảy ra", "Chạy thủ công", "Chạy liên tục"], correct: 1 },
        ],
      },
      {
        id: "wf-4",
        title: "Triển khai và Tối ưu Workflow",
        duration: "60 phút",        content: "<h2>Deployment và Optimization</h2><h3>Testing Strategy</h3><p>Test từng component riêng, sau đó test end-to-end. Dùng sample data trước khi chạy production.</p><h3>Error Handling</h3><p>Thiết lập fallback cho mỗi step. AI fail > human takeover. Log mọi error để cải thiện.</p><h3>Monitoring</h3><p>Track metrics: success rate, processing time, cost per task, quality score. Dashboard real-time.</p><h3>Continuous Improvement</h3><p>Review output hàng tuần. Cải thiện prompt, thêm examples, fine-tune thresholds.</p><h2>Tổng kết</h2><p>AI workflow không phải set-and-forget. Cần monitoring và optimization liên tục để đảm bảo ROI dương.</p>",
        quiz: [
          { question: "Khi AI step fail, nên làm gì?", options: ["Bỏ qua", "Human takeover (fallback)", "Chạy lại vô hạn", "Tắt workflow"], correct: 1 },
          { question: "AI workflow cần gì sau khi deploy?", options: ["Không cần gì", "Monitoring và optimization liên tục", "Chỉ cần backup", "Chỉ cần update AI model"], correct: 1 },
        ],
      },
    ],
  },  {
    id: "course-7",
    title: "AI trong Kinh doanh",
    slug: "ai-trong-kinh-doanh",
    description: "Chiến lược ứng dụng AI cho SMEs Việt Nam - tiết kiệm chi phí, tăng doanh thu.",
    instructor: "PromptVN Team",
    level: "Trung cấp - Nâng cao",
    duration: "5 giờ",
    rating: 4.5,
    students: 280,
    price: 399000,
    tier: "business",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "biz-1",
        title: "AI Strategy cho SMEs Việt Nam",
        duration: "60 phút",        content: "<h2>AI cho Doanh nghiệp vừa và nhỏ</h2><p>SMEs Việt Nam có thể leverage AI với budget nhỏ nhưng impact lớn.</p><h3>Quick Wins</h3><p>Bắt đầu từ những task đơn giản nhất: viết content, trả lời email, phân tích reviews. ROI ngay trong tuần đầu.</p><h3>AI Readiness Assessment</h3><p>Đánh giá: Data có sẵn chưa? Team có AI literacy chưa? Budget bao nhiêu? Mục tiêu cụ thể gì?</p><h3>Roadmap 90 ngày</h3><p>Tháng 1: Quick wins với ChatGPT/Claude. Tháng 2: Workflow automation. Tháng 3: Custom AI solutions.</p>",
        quiz: [
          { question: "SMEs nên bắt đầu AI từ đâu?", options: ["Xây AI model riêng", "Quick wins: content, email, analysis", "Thuê AI team", "Mua enterprise AI platform"], correct: 1 },
          { question: "AI Readiness Assessment đánh giá gì?", options: ["Chỉ budget", "Data, team literacy, budget, mục tiêu", "Chỉ kỹ thuật", "Chỉ thị trường"], correct: 1 },
        ],
      },
      {
        id: "biz-2",
        title: "Customer Service AI",
        duration: "75 phút",        content: "<h2>AI Customer Service</h2><p>AI giúp CSKH 24/7 với chi phí thấp hơn 80% so với thuê nhân viên.</p><h3>Chatbot AI cho Website</h3><p>Xây chatbot AI biết về sản phẩm, chính sách, FAQ. Tự động trả lời 70-80% câu hỏi thường gặp.</p><h3>Phân loại và Routing</h3><p>AI phân loại ticket theo priority và topic, chuyển đến team phù hợp. Giảm response time 60%.</p><h3>Sentiment Analysis</h3><p>Phân tích cảm xúc khách hàng từ reviews, social media, support tickets. Phát hiện sớm vấn đề.</p>",
        quiz: [
          { question: "AI CSKH giảm chi phí bao nhiêu %?", options: ["20%", "50%", "80%", "100%"], correct: 2 },
          { question: "Chatbot AI thường tự động trả lời được bao nhiêu % câu hỏi?", options: ["10-20%", "30-50%", "70-80%", "100%"], correct: 2 },
        ],
      },
      {
        id: "biz-3",
        title: "Sales và Revenue Optimization",
        duration: "60 phút",        content: "<h2>AI cho Sales</h2><h3>Lead Scoring</h3><p>AI phân tích behavior data để score leads: website visits, email opens, content downloads. Sales team focus vào hot leads.</p><h3>Personalized Outreach</h3><p>AI viết sales email cá nhân hóa dựa trên: industry, company size, pain points, previous interactions.</p><h3>Price Optimization</h3><p>AI phân tích demand, competition, seasonality để đề xuất giá tối ưu. Dynamic pricing cho e-commerce.</p><h3>Churn Prediction</h3><p>Dự đoán khách hàng sắp rời bỏ dựa trên usage patterns. Trigger retention campaign kịp thời.</p>",
        quiz: [
          { question: "Lead scoring dựa trên gì?", options: ["Cảm giác của sales", "Behavior data: visits, opens, downloads", "Chỉ revenue", "Random"], correct: 1 },
          { question: "Churn prediction giúp gì?", options: ["Tìm khách hàng mới", "Dự đoán và giữ chân khách hàng sắp rời bỏ", "Tăng giá sản phẩm", "Giảm chi phí marketing"], correct: 1 },
        ],
      },
      {
        id: "biz-4",
        title: "Đo lường ROI và Scale AI",
        duration: "60 phút",        content: "<h2>Measuring AI ROI</h2><h3>KPIs cho AI Projects</h3><p>Time saved, cost reduced, revenue increased, accuracy improved, customer satisfaction score.</p><h3>Cost-Benefit Analysis</h3><p>AI costs: API fees, tool subscriptions, training time. Benefits: labor savings, speed improvement, quality increase.</p><h3>Scaling Strategy</h3><p>Prove ROI ở 1 department > expand sang departments khác > enterprise-wide deployment.</p><h3>Change Management</h3><p>Training team, addressing concerns, celebrating wins. AI adoption cần cả technical và cultural change.</p><h2>Tổng kết</h2><p>AI không phải magic - cần strategy, execution, và measurement. SMEs Việt Nam hoàn toàn có thể compete với big players nhờ AI.</p>",
        quiz: [
          { question: "KPIs cho AI projects gồm gì?", options: ["Chỉ revenue", "Time saved, cost reduced, revenue increased, accuracy", "Chỉ số lượng AI tools", "Chỉ customer satisfaction"], correct: 1 },
          { question: "Scaling AI nên bắt đầu thế nào?", options: ["Deploy toàn công ty ngay", "Prove ROI ở 1 department rồi mở rộng", "Chờ competitors làm trước", "Outsource toàn bộ"], correct: 1 },
        ],
      },
    ],
  },  {
    id: "course-8",
    title: "Prompt Nâng cao cho Developer",
    slug: "prompt-nang-cao-developer",
    description: "Kỹ thuật prompt nâng cao cho lập trình viên: code generation, debugging, architecture design.",
    instructor: "PromptVN Team",
    level: "Nâng cao",
    duration: "5 giờ",
    rating: 4.9,
    students: 380,
    price: 449000,
    tier: "pro",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    lessons: [
      {
        id: "dev-1",
        title: "Code Generation Prompts",
        duration: "75 phút",        content: "<h2>AI Code Generation</h2><p>AI có thể viết code nhanh gấp 3-5 lần, nhưng cần prompt đúng để code chất lượng.</p><h3>Prompt Structure cho Code</h3><p>1) Ngôn ngữ/framework, 2) Mô tả chức năng, 3) Input/Output specs, 4) Error handling requirements, 5) Code style preferences.</p><h3>Code Generation Best Practices</h3><ul><li>Luôn chỉ định ngôn ngữ và version</li><li>Cung cấp interface/type definitions</li><li>Yêu cầu comments và documentation</li><li>Chỉ định testing requirements</li></ul><h3>Ví dụ Prompt</h3><p>Viết TypeScript function: input là array of objects, filter theo conditions, sort theo field, return paginated results. Include error handling, JSDoc comments, unit test examples.</p>",
        quiz: [
          { question: "AI giúp viết code nhanh hơn bao nhiêu lần?", options: ["1-2x", "3-5x", "10x", "100x"], correct: 1 },
          { question: "Code generation prompt cần gì?", options: ["Chỉ tên function", "Ngôn ngữ, specs, error handling, style", "Chỉ mô tả ngắn", "Không cần gì đặc biệt"], correct: 1 },
        ],
      },
      {
        id: "dev-2",
        title: "Debugging và Code Review Prompts",
        duration: "60 phút",        content: "<h2>AI-Assisted Debugging</h2><h3>Error Analysis Prompt</h3><p>Đây là error: [paste error]. Code context: [paste code]. Hãy: 1) Giải thích root cause, 2) Đề xuất fix, 3) Giải thích tại sao fix này hoạt động, 4) Đề xuất cách prevent lỗi tương tự.</p><h3>Code Review Prompt</h3><p>Review code sau về: performance, security, maintainability, edge cases, best practices. Đề xuất improvements cụ thể với code examples.</p><h3>Rubber Duck Debugging</h3><p>Giải thích vấn đề cho AI từng bước. Quá trình giải thích thường giúp bạn tự tìm ra bug.</p><h3>Memory Leak Detection</h3><p>Paste code và yêu cầu AI kiểm tra: event listeners not removed, closures giữ references, timers not cleared.</p>",
        quiz: [
          { question: "Rubber Duck Debugging là gì?", options: ["Debug bằng cách nói chuyện với vịt cao su", "Giải thích vấn đề từng bước để tự tìm ra bug", "Dùng AI tool tên Rubber Duck", "Kỹ thuật testing đặc biệt"], correct: 1 },
          { question: "Code review nên kiểm tra những gì?", options: ["Chỉ syntax", "Performance, security, maintainability, edge cases", "Chỉ formatting", "Chỉ naming conventions"], correct: 1 },
        ],
      },
      {
        id: "dev-3",
        title: "Architecture và System Design",
        duration: "75 phút",        content: "<h2>AI cho Architecture Design</h2><h3>System Design Prompt</h3><p>Thiết kế system cho [requirements]. Constraints: [scale, budget, team size]. Bao gồm: architecture diagram description, tech stack recommendation, tradeoffs analysis.</p><h3>Database Schema Design</h3><p>Cung cấp business requirements, yêu cầu AI thiết kế schema: tables, relationships, indexes, migrations.</p><h3>API Design</h3><p>AI giúp design RESTful/GraphQL API: endpoints, request/response formats, authentication, rate limiting, versioning.</p><h3>Microservices Decomposition</h3><p>Từ monolith, yêu cầu AI đề xuất: service boundaries, communication patterns, data ownership, deployment strategy.</p>",
        quiz: [
          { question: "System design prompt cần gì?", options: ["Chỉ tên hệ thống", "Requirements, constraints, và yêu cầu cụ thể", "Chỉ tech stack", "Chỉ budget"], correct: 1 },
          { question: "AI giúp gì trong database design?", options: ["Chỉ tạo tables", "Schema, relationships, indexes, migrations", "Chỉ backup data", "Không giúp gì"], correct: 1 },
        ],
      },
      {
        id: "dev-4",
        title: "Testing và DevOps Prompts",
        duration: "60 phút",        content: "<h2>AI cho Testing và DevOps</h2><h3>Test Generation</h3><p>Paste code, yêu cầu AI tạo: unit tests, integration tests, edge case tests. Specify framework (Jest, Pytest, etc).</p><h3>CI/CD Pipeline Design</h3><p>AI thiết kế pipeline: build, test, lint, security scan, deploy. GitHub Actions, GitLab CI, hoặc Jenkins.</p><h3>Infrastructure as Code</h3><p>AI viết Terraform, Docker Compose, Kubernetes configs dựa trên requirements.</p><h3>Monitoring và Alerting</h3><p>Thiết kế monitoring strategy: metrics to track, alert thresholds, dashboard layout, incident response runbook.</p><h2>Tổng kết</h2><p>AI là pair programmer tuyệt vời. Không thay thế developer nhưng amplify khả năng gấp nhiều lần. Invest vào prompt skills = invest vào career.</p>",
        quiz: [
          { question: "AI giúp viết loại test nào?", options: ["Chỉ unit test", "Unit, integration, edge case tests", "Chỉ manual test cases", "Không viết test được"], correct: 1 },
          { question: "Infrastructure as Code là gì?", options: ["Code chạy trên server", "Quản lý infrastructure bằng code (Terraform, Docker...)", "Code trong infrastructure", "Viết code offline"], correct: 1 },
        ],
      },
    ],
  },
];