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
    title: "Hướng dẫn viết Prompt AI hiệu quả cho người mới",
    slug: "huong-dan-viet-prompt-ai-hieu-qua",    excerpt: "Tìm hiểu cách viết prompt AI chuyên nghiệp với công thức CREAD và các ví dụ thực tế.",
    content: "<h2>Prompt AI là gì?</h2>\n<p>Prompt AI là câu lệnh bạn gửi cho các mô hình ngôn ngữ lớn (LLM) như ChatGPT, Claude, Gemini. Một prompt tốt giúp bạn nhận kết quả chính xác, hữu ích và tiết kiệm thời gian hơn nhiều so với việc hỏi chung chung.</p>\n\n<h2>Tại sao Prompt Engineering quan trọng?</h2>\n<p>Theo nghiên cứu của OpenAI, <strong>một prompt được viết tốt có thể tăng chất lượng output lên 200-400%</strong> so với câu hỏi thông thường. Đây không chỉ là kỹ năng kỹ thuật - đây là kỹ năng làm việc thiết yếu trong thời đại AI.</p>\n<p>Hãy tưởng tượng bạn cần viết một bài blog. Nếu bạn chỉ nói \"Viết bài blog\", AI sẽ cho ra một bài chung chung. Nhưng nếu bạn cung cấp ngữ cảnh, vai trò, format cụ thể - kết quả sẽ khác biệt hoàn toàn.</p>\n\n<h2>Công thức CREAD - 5 thành phần của Prompt hiệu quả</h2>\n\n<h3>C - Context (Ngữ cảnh)</h3>\n<p>Cung cấp bối cảnh cụ thể cho AI. Thay vì hỏi \"Viết email\", hãy nói \"Tôi là Marketing Manager tại một công ty startup SaaS, cần viết email giới thiệu sản phẩm mới cho khách hàng doanh nghiệp.\"</p>\n\n<h3>R - Role (Vai trò)</h3>\n<p>Giao vai trò cho AI để nó hiểu góc nhìn cần thiết. Ví dụ: \"Hãy đóng vai một chuyên gia SEO với 10 năm kinh nghiệm\" hoặc \"Hãy đóng vai một copywriter quảng cáo chuyên nghiệp.\"</p>\n\n<h3>E - Examples (Ví dụ)</h3>\n<p>Cung cấp 1-2 ví dụ về output mong muốn. Đây gọi là kỹ thuật \"few-shot prompting\" và giúp AI hiểu chính xác bạn muốn gì.</p>\n\n<h3>A - Action (Hành động)</h3>\n<p>Mô tả rõ ràng nhiệm vụ cần làm. Sử dụng các động từ cụ thể: \"Phân tích\", \"Viết\", \"So sánh\", \"Liệt kê\", \"Tạo\"...</p>\n\n<h3>D - Details (Chi tiết)</h3>\n<p>Thêm các ràng buộc cụ thể: độ dài, format, tone, ngôn ngữ, đối tượng độc giả.</p>\n\n<h2>5 Lỗi thường gặp khi viết Prompt</h2>\n<ul>\n<li><strong>Quá chung chung:</strong> \"Viết bài blog\" thay vì \"Viết bài blog 1500 từ về xu hướng AI 2024 cho đối tượng là startup founders\"</li>\n<li><strong>Thiếu ngữ cảnh:</strong> AI không biết bạn là ai, làm gì, cần gì</li>\n<li><strong>Không chỉ định format:</strong> Không nói rõ muốn bullet points, bảng, hay đoạn văn</li>\n<li><strong>Quá nhiều yêu cầu một lúc:</strong> Nên chia nhỏ thành nhiều prompt</li>\n<li><strong>Không iterate:</strong> Prompt đầu tiên ít khi hoàn hảo - hãy yêu cầu AI chỉnh sửa và cải thiện</li>\n</ul>\n\n<h2>Ví dụ thực tế: Prompt xấu vs Prompt tốt</h2>\n<blockquote><strong>Prompt xấu:</strong> Viết email marketing</blockquote>\n<blockquote><strong>Prompt tốt:</strong> Hãy đóng vai một email marketing specialist. Viết email giới thiệu sản phẩm AI prompt marketplace cho đối tượng là freelancer Việt Nam. Tone thân thiện, chuyên nghiệp. Email dài 200-300 từ, có CTA rõ ràng, subject line hấp dẫn. Bao gồm: lợi ích chính, số liệu cụ thể, và ưu đãi đặc biệt.</blockquote>\n\n<h2>Kỹ thuật nâng cao</h2>\n<h3>Chain of Thought (Suy nghĩ từng bước)</h3>\n<p>Yêu cầu AI giải thích từng bước logic trước khi đưa ra kết luận. Ví dụ: \"Hãy phân tích từng bước tại sao chiến lược marketing này hiệu quả, sau đó đề xuất cải thiện.\"</p>\n\n<h3>Role Stacking (Kết hợp vai trò)</h3>\n<p>Giao nhiều vai trò cùng lúc: \"Hãy đóng vai vừa là nhà thiết kế UX vừa là chuyên gia tâm lý học hành vi để phân tích trang landing page này.\"</p>\n\n<h2>Kết luận</h2>\n<p>Prompt Engineering không khó, nhưng cần luyện tập. Bắt đầu với công thức CREAD, tránh 5 lỗi phổ biến, và luôn iterate để cải thiện. Trên PromptVN, bạn có thể tìm thấy hàng trăm prompt đã được tối ưu sẵn - tiết kiệm thời gian và học hỏi từ các chuyên gia.</p>",
    author: "PromptVN Team",
    category: "huong-dan",
    tags: ["prompt engineering", "AI"],    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    views: 1250
  },
  {
    id: "blog-2",
    title: "Top 10 xu hướng AI năm 2024",
    slug: "top-10-xu-huong-ai-2024",
    excerpt: "Khám phá xu hướng AI nổi bật nhất năm 2024 - từ AI Agent đến Video AI.",    content: "<h2>AI bùng nổ trong năm 2024</h2>\n<p>Năm 2024 đánh dấu sự bùng nổ chưa từng có của AI. GPT-4 Turbo, Claude 3, Gemini Ultra - mỗi tháng lại có một bước đột phá mới. Dưới đây là 10 xu hướng quan trọng nhất.</p>\n\n<h3>1. AI Agent - Trợ lý tự động</h3>\n<p>AI Agent không chỉ trả lời câu hỏi mà còn tự thực hiện nhiệm vụ: đặt lịch, gửi email, phân tích dữ liệu. AutoGPT, CrewAI, và LangChain đang dẫn đầu xu hướng này.</p>\n\n<h3>2. RAG - Retrieval Augmented Generation</h3>\n<p>Kết hợp knowledge base riêng với AI để trả lời chính xác hơn. Doanh nghiệp dùng RAG để tạo chatbot biết về sản phẩm, quy trình nội bộ.</p>\n\n<h3>3. AI Video - Sora và đối thủ</h3>\n<p>OpenAI Sora có thể tạo video 60 giây từ text prompt. Runway Gen-2, Pika Labs cũng đang cạnh tranh mạnh mẽ trong lĩnh vực này.</p>\n\n<h3>4. Coding AI ngày càng mạnh</h3>\n<p>GitHub Copilot, Cursor, Devin - AI không chỉ gợi ý code mà có thể viết cả ứng dụng hoàn chỉnh. Developer dùng AI coding tăng năng suất 40-55%.</p>\n\n<h3>5. Multimodal AI</h3>\n<p>AI xử lý đồng thời text, image, audio, video. GPT-4V phân tích ảnh, Gemini xử lý video, Claude đọc PDF - tất cả trong một cuộc hội thoại.</p>\n\n<h3>6. Open Source AI bùng nổ</h3>\n<p>Llama 3, Mistral, Phi-3 - các model open source ngày càng mạnh, có thể chạy trên laptop. Doanh nghiệp tiết kiệm chi phí và kiểm soát data tốt hơn.</p>\n\n<h3>7. AI trong Y tế</h3>\n<p>AI chẩn đoán bệnh, phân tích hình ảnh y khoa, hỗ trợ nghiên cứu thuốc mới. AlphaFold 3 dự đoán cấu trúc protein với độ chính xác chưa từng có.</p>\n\n<h3>8. Personalization AI</h3>\n<p>AI cá nhân hóa trải nghiệm mua sắm, nội dung, quảng cáo. Netflix, Spotify, TikTok đều dùng AI để đề xuất nội dung phù hợp nhất.</p>\n\n<h3>9. AI Ethics và Regulation</h3>\n<p>EU AI Act có hiệu lực, các nước bắt đầu quy định về AI. Transparency, fairness, accountability trở thành yêu cầu bắt buộc.</p>\n\n<h3>10. Enterprise AI adoption</h3>\n<p>90% doanh nghiệp Fortune 500 đã triển khai AI. Từ customer service đến supply chain, AI đang thay đổi mọi ngành nghề.</p>\n\n<h2>Kết luận</h2>\n<p>2024 là năm bản lề cho AI. Những ai nắm bắt sớm sẽ có lợi thế cạnh tranh lớn. Bắt đầu với prompt engineering là bước đầu tiên dễ nhất và hiệu quả nhất.</p>",
    author: "PromptVN Team",
    category: "tin-tuc",
    tags: ["AI trends", "2024"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
    views: 980
  },  {
    id: "blog-3",
    title: "7 mẹo ChatGPT 90% người dùng không biết",
    slug: "7-meo-su-dung-chatgpt",
    excerpt: "Mẹo ẩn giúp khai thác tối đa ChatGPT - từ Custom Instructions đến System Prompts.",
    content: "<h2>Power User Tips cho ChatGPT</h2>\n<p>ChatGPT mạnh hơn bạn nghĩ rất nhiều. Hầu hết người dùng chỉ sử dụng 10-20% khả năng thực sự của nó. Dưới đây là 7 mẹo giúp bạn trở thành power user.</p>\n\n<h3>1. Custom Instructions - Cá nhân hóa vĩnh viễn</h3>\n<p>Vào Settings, thiết lập Custom Instructions để ChatGPT luôn nhớ: bạn là ai, làm gì, muốn output như thế nào. Không cần nhắc lại mỗi cuộc hội thoại.</p>\n<p><strong>Ví dụ:</strong> \"Tôi là content marketer tại startup B2B. Luôn viết bằng tiếng Việt, tone chuyên nghiệp nhưng thân thiện. Output dạng bullet points khi có thể.\"</p>\n\n<h3>2. Chain of Thought - Buộc AI suy nghĩ</h3>\n<p>Thêm \"Hãy suy nghĩ từng bước\" vào prompt. AI sẽ phân tích logic trước khi trả lời, giảm sai sót đáng kể.</p>\n<p><strong>Ví dụ:</strong> \"Phân tích từng bước tại sao conversion rate của landing page này thấp, rồi đề xuất 5 cải thiện cụ thể.\"</p>\n\n<h3>3. Role Playing - Giao vai chuyên gia</h3>\n<p>\"Hãy đóng vai [chuyên gia X]\" biến ChatGPT thành consultant riêng. AI sẽ sử dụng kiến thức chuyên ngành và thuật ngữ phù hợp.</p>\n<p><strong>Ví dụ:</strong> \"Hãy đóng vai CFO với 15 năm kinh nghiệm. Phân tích bảng cân đối kế toán này và đề xuất chiến lược tài chính.\"</p>\n\n<h3>4. Few-Shot Learning - Cho ví dụ</h3>\n<p>Cung cấp 2-3 ví dụ input/output mẫu. ChatGPT sẽ hiểu pattern và áp dụng cho request mới.</p>\n\n<h3>5. Output Formatting - Kiểm soát format</h3>\n<p>Chỉ định rõ format: \"Trả lời dưới dạng bảng\", \"Viết dạng markdown\", \"Output JSON\". ChatGPT follow format rất tốt khi được yêu cầu rõ ràng.</p>\n\n<h3>6. Temperature Control qua prompt</h3>\n<p>Muốn output sáng tạo: \"Hãy sáng tạo và đưa ra ý tưởng độc đáo\". Muốn chính xác: \"Hãy chính xác, chỉ dựa trên dữ kiện, không suy đoán\". Cách bạn yêu cầu ảnh hưởng đến mức độ sáng tạo.</p>\n\n<h3>7. Iterative Refinement - Cải thiện liên tục</h3>\n<p>Đừng dừng ở output đầu tiên. Hãy nói: \"Tốt rồi, nhưng hãy làm ngắn hơn 30%\", \"Thêm số liệu cụ thể\", \"Đổi tone sang formal hơn\". Mỗi iteration làm output tốt hơn.</p>\n\n<h2>Bonus: Kết hợp nhiều mẹo</h2>\n<p>Sức mạnh thật sự đến khi kết hợp: Role Playing + Chain of Thought + Output Formatting = prompt cực kỳ hiệu quả.</p>\n\n<h2>Kết luận</h2>\n<p>ChatGPT là công cụ mạnh mẽ, nhưng chỉ mạnh bằng cách bạn sử dụng nó. Áp dụng 7 mẹo này và bạn sẽ thấy sự khác biệt rõ rệt trong chất lượng output.</p>",
    author: "PromptVN Team",
    category: "meo-hay",
    tags: ["ChatGPT", "mẹo hay"],
    image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-03-08",
    updatedAt: "2024-03-08",
    views: 2100
  },  {
    id: "blog-4",
    title: "Case Study: Tăng 300% doanh thu nhờ AI Prompt",
    slug: "case-study-tang-300-doanh-thu",
    excerpt: "Câu chuyện thực tế của doanh nghiệp Việt Nam dùng AI prompt tăng doanh thu.",
    content: "<h2>Bối cảnh</h2>\n<p>Công ty ABC là một startup thương mại điện tử tại TP.HCM, chuyên bán sản phẩm skincare online. Với đội ngũ 8 người, họ gặp khó khăn trong việc tạo content marketing đủ nhanh và đủ chất lượng để cạnh tranh.</p>\n\n<h2>Thách thức</h2>\n<ul>\n<li><strong>Content bottleneck:</strong> 1 copywriter viết được 2-3 bài/ngày, cần ít nhất 10 bài</li>\n<li><strong>Chi phí thuê ngoài cao:</strong> 500K-1M/bài viết SEO chất lượng</li>\n<li><strong>Ads copy không hiệu quả:</strong> CTR chỉ đạt 0.8%, dưới trung bình ngành</li>\n<li><strong>Email marketing nhạt nhẽo:</strong> Open rate 12%, industry average là 20%</li>\n</ul>\n\n<h2>Giải pháp: Bộ Prompt Marketing từ PromptVN</h2>\n<p>Công ty ABC đầu tư vào bộ 50 prompt marketing chuyên nghiệp từ PromptVN, bao gồm prompt cho: SEO blog, Facebook Ads, Email Marketing, và Product Description.</p>\n\n<h3>Giai đoạn 1: Content Production (Tháng 1-2)</h3>\n<p>Sử dụng prompt SEO blog để tạo 8-10 bài/ngày thay vì 2-3. Mỗi bài được tối ưu keyword, có structure rõ ràng, tone phù hợp thương hiệu.</p>\n\n<h3>Giai đoạn 2: Ads Optimization (Tháng 3-4)</h3>\n<p>Dùng prompt Facebook Ads để tạo 20-30 variations cho mỗi campaign. A/B testing liên tục, CTR tăng từ 0.8% lên 2.4%.</p>\n\n<h3>Giai đoạn 3: Email Personalization (Tháng 5-6)</h3>\n<p>Prompt email marketing giúp cá nhân hóa nội dung theo segment. Open rate tăng từ 12% lên 28%.</p>\n\n<h2>Kết quả sau 6 tháng</h2>\n<ul>\n<li><strong>Doanh thu tăng 300%:</strong> Từ 200M lên 800M/tháng</li>\n<li><strong>Chi phí content giảm 80%:</strong> Từ 50M xuống 10M/tháng</li>\n<li><strong>Traffic organic tăng 450%:</strong> Nhờ SEO content đều đặn</li>\n<li><strong>Ads CTR tăng 3x:</strong> Từ 0.8% lên 2.4%</li>\n<li><strong>Email open rate tăng 133%:</strong> Từ 12% lên 28%</li>\n</ul>\n\n<h2>Bài học rút ra</h2>\n<blockquote>AI prompt không thay thế con người - nó khuếch đại năng lực của con người. Copywriter vẫn cần review và tinh chỉnh, nhưng tốc độ và volume tăng lên gấp nhiều lần.</blockquote>\n\n<h2>Kết luận</h2>\n<p>Đầu tư vào prompt AI chất lượng có ROI cực cao. Với chi phí chỉ vài trăm nghìn đồng cho bộ prompt, công ty ABC đã tạo ra hàng trăm triệu doanh thu thêm mỗi tháng. Bạn có thể bắt đầu ngay hôm nay trên PromptVN.</p>",
    author: "PromptVN Team",
    category: "case-study",
    tags: ["case study", "marketing"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05",
    views: 750
  },  {
    id: "blog-5",
    title: "So sánh ChatGPT vs Claude vs Gemini",
    slug: "so-sanh-chatgpt-claude-gemini",
    excerpt: "Phân tích 3 AI chatbot phổ biến nhất: điểm mạnh, yếu, và khi nào dùng cái nào.",
    content: "<h2>3 ông lớn AI chatbot</h2>\n<p>Năm 2024, thị trường AI chatbot được chi phối bởi 3 tên tuổi: ChatGPT (OpenAI), Claude (Anthropic), và Gemini (Google). Mỗi cái có thế mạnh riêng.</p>\n\n<h3>ChatGPT - Đa năng nhất</h3>\n<ul>\n<li><strong>Điểm mạnh:</strong> Plugin ecosystem phong phú, code execution, image generation (DALL-E), cộng đồng lớn nhất</li>\n<li><strong>Điểm yếu:</strong> Đôi khi hallucinate, API đắt hơn, context window ngắn hơn Claude</li>\n<li><strong>Giá:</strong> Free (GPT-3.5) hoặc $20/tháng (Plus)</li>\n<li><strong>Dùng khi:</strong> Content marketing, brainstorming, coding, data analysis, general tasks</li>\n</ul>\n\n<h3>Claude - Chính xác nhất</h3>\n<ul>\n<li><strong>Điểm mạnh:</strong> Context window 200K tokens (dài nhất), ít hallucination, phân tích văn bản xuất sắc, code review tốt</li>\n<li><strong>Điểm yếu:</strong> Ít plugin, chậm hơn, cộng đồng nhỏ hơn, đôi khi quá thận trọng</li>\n<li><strong>Giá:</strong> Free (giới hạn) hoặc $20/tháng (Pro)</li>\n<li><strong>Dùng khi:</strong> Phân tích tài liệu dài, viết pháp lý, code review, research chuyên sâu</li>\n</ul>\n\n<h3>Gemini - Google ecosystem</h3>\n<ul>\n<li><strong>Điểm mạnh:</strong> Tích hợp Google Workspace, real-time web search, image generation, giá rẻ nhất</li>\n<li><strong>Điểm yếu:</strong> Chất lượng không ổn định, tiếng Việt yếu hơn, ít nổi trội ở lĩnh vực nào</li>\n<li><strong>Giá:</strong> Free hoặc $20/tháng (Advanced)</li>\n<li><strong>Dùng khi:</strong> Google Workspace workflow, cần search real-time, budget thấp</li>\n</ul>\n\n<h2>Bảng so sánh nhanh</h2>\n<p><strong>Code writing:</strong> ChatGPT 5/5 | Claude 5/5 | Gemini 3/5</p>\n<p><strong>Phân tích tài liệu:</strong> ChatGPT 4/5 | Claude 5/5 | Gemini 3/5</p>\n<p><strong>Creative writing:</strong> ChatGPT 5/5 | Claude 5/5 | Gemini 4/5</p>\n<p><strong>Accuracy:</strong> ChatGPT 4/5 | Claude 5/5 | Gemini 3/5</p>\n<p><strong>Real-time info:</strong> ChatGPT 2/5 | Claude 2/5 | Gemini 5/5</p>\n<p><strong>Giá API:</strong> ChatGPT 3/5 | Claude 4/5 | Gemini 5/5</p>\n\n<h2>Khuyến cáo: Dùng nhiều AI cùng lúc</h2>\n<p>Các chuyên gia thường dùng: ChatGPT cho content và brainstorming, Claude cho phân tích và accuracy, Gemini cho search và Google integration. Mỗi AI có thế mạnh riêng - sử dụng đúng tool cho đúng việc.</p>\n\n<h2>Kết luận</h2>\n<p>Không có AI nào tốt nhất cho mọi việc. Hãy hỏi: cái nào tốt nhất cho công việc cụ thể của tôi? Câu trả lời sẽ khác nhau tùy trường hợp.</p>",
    author: "PromptVN Team",
    category: "huong-dan",
    tags: ["so sánh", "ChatGPT", "Claude"],
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    views: 1800
  },  {
    id: "blog-6",
    title: "Midjourney tạo ảnh sản phẩm chuyên nghiệp",
    slug: "cach-dung-midjourney-tao-anh-san-pham",
    excerpt: "Hướng dẫn Midjourney tạo ảnh sản phẩm TMĐT chuyên nghiệp từ A-Z.",
    content: "<h2>Tại sao dùng Midjourney cho ảnh sản phẩm?</h2>\n<p>Midjourney là công cụ AI tạo ảnh hàng đầu, đặc biệt mạnh trong lĩnh vực product photography. Thay vì thuê photographer (5-10M/buổi chụp), bạn có thể tạo ảnh sản phẩm chuyên nghiệp với chi phí gần như bằng 0.</p>\n\n<h2>Cấu trúc Prompt Midjourney cơ bản</h2>\n<p><strong>Format:</strong> [Chủ thể] + [Style] + [Lighting] + [Background] + [Parameters]</p>\n\n<h3>Các Parameters quan trọng</h3>\n<ul>\n<li><strong>--ar 1:1 hoặc 4:5:</strong> Tỷ lệ khung hình (vuông cho Instagram, 4:5 cho shop)</li>\n<li><strong>--v 6:</strong> Version mới nhất, chất lượng tốt nhất</li>\n<li><strong>--s 250:</strong> Stylize level, 0-1000 (thấp = sát prompt, cao = sáng tạo hơn)</li>\n<li><strong>--q 2:</strong> Quality, render chi tiết hơn</li>\n<li><strong>--no text, watermark:</strong> Loại bỏ chữ và watermark không mong muốn</li>\n</ul>\n\n<h2>5 loại ảnh sản phẩm phổ biến</h2>\n\n<h3>1. Flat Lay (Nhìn từ trên)</h3>\n<p><strong>Prompt mẫu:</strong> Flat lay product photography of a skincare set on white marble surface, soft natural lighting, minimalist composition, editorial style --ar 1:1 --v 6 --s 150</p>\n\n<h3>2. Lifestyle Shot</h3>\n<p><strong>Prompt mẫu:</strong> A woman using a premium face cream in a bright modern bathroom, natural morning light, soft focus background, commercial photography style --ar 4:5 --v 6</p>\n\n<h3>3. White Background (Nền trắng)</h3>\n<p><strong>Prompt mẫu:</strong> Product photography of a glass perfume bottle on pure white background, professional studio lighting, high-end commercial style, sharp details --ar 1:1 --v 6 --s 100</p>\n\n<h3>4. Creative/Art Direction</h3>\n<p><strong>Prompt mẫu:</strong> A luxury watch floating in mid-air surrounded by golden particles, dramatic lighting, dark background, high-end advertising style --ar 16:9 --v 6 --s 300</p>\n\n<h3>5. Packaging Mockup</h3>\n<p><strong>Prompt mẫu:</strong> Minimalist packaging design for organic tea brand, kraft paper box on wooden table, natural lighting, clean and modern aesthetic --ar 4:5 --v 6</p>\n\n<h2>Mẹo nâng cao</h2>\n<ul>\n<li><strong>Thêm reference:</strong> \"in the style of Apple product photography\" hoặc \"editorial Vogue style\"</li>\n<li><strong>Lighting cụ thể:</strong> \"rim lighting\", \"golden hour\", \"soft diffused light\", \"dramatic side lighting\"</li>\n<li><strong>Material detail:</strong> \"glossy surface\", \"matte finish\", \"frosted glass\", \"brushed metal\"</li>\n<li><strong>Camera angle:</strong> \"45 degree angle\", \"eye level\", \"low angle hero shot\"</li>\n</ul>\n\n<h2>Kết luận</h2>\n<p>Midjourney không thay thế hoàn toàn photographer, nhưng là công cụ tuyệt vời cho: concept visualization, social media content, A/B testing ảnh quảng cáo, và MVP product images. Trên PromptVN, bạn có thể mua các bộ prompt Midjourney đã tối ưu cho từng ngành hàng cụ thể.</p>",
    author: "PromptVN Team",
    category: "huong-dan",
    tags: ["Midjourney", "ảnh sản phẩm"],
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=400&fit=crop",
    published: true,
    createdAt: "2024-02-28",
    updatedAt: "2024-02-28",
    views: 1500
  },
];