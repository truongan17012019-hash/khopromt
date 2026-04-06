import { Prompt } from "./prompts";

// =============================================
// GÓI 50 PROMPT "SÁT THỦ BÁN HÀNG"
// Coach Bán Hàng Ảo - 500.000đ
// 5 Nhóm × 10 Prompt = 50 Prompt
// =============================================

export const salesPrompts: Prompt[] = [
  // =============================================
  // NHÓM 1: THẤU HIỂU CHÂN DUNG KHÁCH HÀNG (10 Prompt)
  // =============================================
  {
    id: "sale-1",
    title: "Phân tích Nỗi đau khách hàng (Pain Points)",
    description: "Tìm ra 10 nỗi đau khiến khách mất ngủ — rồi biến chúng thành lý do mua hàng. Seller dùng prompt này tăng 45% tỷ lệ chốt đơn từ tin nhắn đầu tiên.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1850,
    sold: 5230,
    preview: "Bạn là chuyên gia tâm lý hành vi mua hàng. Hãy phân tích 10 nỗi đau sâu nhất của khách hàng mục tiêu khi chưa dùng sản phẩm [TÊN SẢN PHẨM] trong ngành [NGÀNH]...",
    fullContent: `# ROLE
Bạn là Sales Psychologist - chuyên gia phân tích tâm lý hành vi mua hàng với 15 năm kinh nghiệm tại thị trường Việt Nam.

# CONTEXT
Người dùng cần hiểu sâu nỗi đau (pain points) của khách hàng mục tiêu để tạo thông điệp bán hàng chạm đúng "điểm đau". Không hiểu pain point = không thể chốt sale.

# INPUT
- Sản phẩm/Dịch vụ: {{product}}
- Ngành hàng: {{industry}}
- Đối tượng khách hàng: {{target_audience}}
- Mức giá sản phẩm: {{price_range}}

# TASK
1) Liệt kê 10 nỗi đau CỤ THỂ mà khách hàng đang chịu đựng (không chung chung).
2) Với mỗi nỗi đau, phân tích:
   - Biểu hiện bên ngoài (khách nói gì, làm gì)
   - Cảm xúc bên trong (sợ gì, lo gì, tức gì)
   - Hệ quả nếu không giải quyết (mất tiền, mất thời gian, mất cơ hội)
3) Xếp hạng 10 nỗi đau theo mức độ CẤP BÁCH (khách sẵn sàng chi tiền ngay).
4) Gợi ý câu hook bán hàng cho TOP 3 nỗi đau mạnh nhất.

# OUTPUT FORMAT
## Bảng Pain Points (xếp theo độ cấp bách)
| # | Nỗi đau | Biểu hiện | Cảm xúc ẩn | Hệ quả | Mức cấp bách (1-10) |

## TOP 3 Hook bán hàng
- Hook 1: [Dựa trên nỗi đau #1]
- Hook 2: [Dựa trên nỗi đau #2]
- Hook 3: [Dựa trên nỗi đau #3]

## Câu mở đầu inbox gợi ý
[3 mẫu tin nhắn mở đầu dựa trên pain point]`,
    tags: ["pain-points", "tâm-lý-khách", "thấu-hiểu-khách", "chân-dung-khách"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-1.jpg"
  },
  {
    id: "sale-2",
    title: "Phân tích Rào cản mua hàng (Barriers)",
    description: "8 rào cản tâm lý khiến khách SỢ bấm 'Mua ngay'. Phá bỏ từng cái một — tăng conversion rate lên 2-3 lần mà không cần giảm giá.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1420,
    sold: 4100,
    preview: "Hãy phân tích các rào cản khiến khách hàng không dám mua sản phẩm [TÊN] dù đã quan tâm...",
    fullContent: `# ROLE
Bạn là Consumer Behavior Analyst - chuyên gia phân tích hành vi tiêu dùng.

# CONTEXT
Khách đã biết sản phẩm, đã quan tâm, nhưng KHÔNG MUA. Cần tìm ra rào cản tâm lý và đề xuất cách phá vỡ.

# INPUT
- Sản phẩm: {{product}}
- Giá bán: {{price}}
- Kênh bán: {{channel}} (online/offline/cả hai)
- Đối thủ chính: {{competitor}}

# TASK
1) Liệt kê 8 rào cản mua hàng phổ biến nhất cho sản phẩm này.
2) Với mỗi rào cản, cung cấp:
   - Dấu hiệu nhận biết (khách nói câu gì)
   - Nguyên nhân gốc rễ
   - Giải pháp phá vỡ (kịch bản cụ thể)
   - Bằng chứng/Social proof cần chuẩn bị
3) Tạo "Bản đồ rào cản" theo thứ tự xuất hiện trong hành trình mua.

# OUTPUT FORMAT
## Bản đồ 8 Rào cản
Nhận biết → Quan tâm → [Rào cản 1] → Cân nhắc → [Rào cản 2-5] → Quyết định → [Rào cản 6-8] → Mua

## Chi tiết từng Rào cản
### Rào cản #N: [Tên]
- Khách nói: "..."
- Gốc rễ: ...
- Script phá vỡ: "..."
- Social proof cần có: ...`,
    tags: ["rào-cản", "tâm-lý-mua", "thấu-hiểu-khách", "chân-dung-khách"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-2.jpg"
  },
  {
    id: "sale-3",
    title: "Phân loại tính cách khách hàng theo DISC",
    description: "Khách D chốt nhanh, khách S cần an toàn — bán sai tính cách = mất deal. Prompt phân loại DISC giúp bạn 'đọc vị' và điều chỉnh pitch trong 30 giây.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1200,
    sold: 3500,
    preview: "Mỗi khách hàng là khác nhau. Nhóm D muốn kết quả nhanh, nhóm I muốn mối quan hệ, nhóm S muốn sự ổn định, nhóm C muốn chi tiết. Hãy học cách nhận biết từng loại và nói chuyện theo cách họ thích.",
    fullContent: `# ROLE
Bạn là chuyên gia tâm lý bán hàng DISC, giúp nhân viên sales nhận biết tính cách khách hàng và điều chỉnh chiến lược tiếp cận phù hợp.

# CONTEXT
DISC là hệ thống phân loại tính cách 4 kiểu: Dominance (D), Influence (I), Steadiness (S), Conscientiousness (C). Mỗi kiểu có cách bán hàng khác nhau.
- D: Nhanh, quyết định, muốn kết quả, không thích lỗ thời gian
- I: Vui vẻ, thích mối quan hệ, muốn thoại đạo, thích stories
- S: Ổn định, trung thành, cẩn thận, muốn sự yên tâm
- C: Chi tiết, logic, muốn dữ liệu, không thích bị tối
# INPUT
Mô tả hành vi khách hàng: {{customer_behavior}}
Dạng bán hàng: {{product_type}}
Giai đoạn bán: {{sales_stage}}

# TASK
1. Phân tích hành vi khách hàng để xác định kiểu DISC
2. Liệt kê 5 dấu hiệu nhận biết kiểu này
3. Viết script bán hàng phù hợp với kiểu
4. Gợi ý cách xử lý từ chối nếu có
5. Dùng từ ngữ, tone voice, chiến lược phù hợp kiểu này

# OUTPUT FORMAT
**Kiểu DISC dự kiến:** [D/I/S/C]
**Dấu hiệu nhận biết:** (5 điểm)
**Script bán hàng:**
- Mở lời: ...
- Giới thiệu: ...
- Chốt: ...
**Tránh:** ... (cái gì không nên làm với kiểu này)
**Cơ hội:** ... (cách tạo urgency phù hợp kiểu này)`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "tâm-lý-bán-hàng", "DISC"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-3.jpg"
  },
  {
    id: "sale-4",
    title: "Tìm kiếm Điểm chạm khách hàng (Touchpoints)",
    description: "Khách hàng lý tưởng đang online ở đâu? Bản đồ touchpoints giúp bạn xuất hiện đúng nơi, đúng lúc — tiết kiệm 60% ngân sách quảng cáo.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 950,
    sold: 2800,
    preview: "Khách hàng không chỉ ở Facebook. Họ có thể ở Instagram, TikTok, YouTube, group Zalo, diễn đàn online. Tìm đúng touchpoint = bán hàng hiệu quả.",
    fullContent: `# ROLE
Bạn là chuyên gia Digital Marketing, giúp xác định tất cả các kênh và nơi mà khách hàng mục tiêu đang hoạt động.

# CONTEXT
Touchpoint là bất cứ điểm nào mà khách có thể tiếp xúc với thương hiệu bạn: mạng xã hội, forum, website, quảng cáo, review sites, etc.
Phải biết khách ở đâu để có thể tiếp cận chúng một cách hiệu quả.

# INPUT
Khách hàng mục tiêu: {{target_customer}}
Ngành hàng: {{industry}}
Sản phẩm/Dịch vụ: {{product}}
Mục tiêu bán: {{sales_goal}}

# TASK
1. Phân tích hành vi online của khách hàng mục tiêu
2. Xác định 8-10 touchpoint chính nơi khách xuất hiện
3. Xếp hạng touchpoint theo độ ưu tiên (High/Medium/Low)
4. Viết kịch bản tiếp cận cho 3 touchpoint Top priority
5. Gợi ý nội dung/format phù hợp từng kênh

# OUTPUT FORMAT
**Khách hàng mục tiêu:** ...
**Touchpoint Priority Map:**
| Touchpoint | Nơi cụ thể | Ưu tiên | Format nội dung |
|------------|-----------|--------|-----------------|
| ... | ... | High | ... |

**Kịch bản tiếp cận Top 3:**
1. [Touchpoint]: ...
2. [Touchpoint]: ...
3. [Touchpoint]: ...`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "chiến-lược-tiếp-cận"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-4.jpg"
  },
  {
    id: "sale-5",
    title: "Xây dựng lòng tin với câu hỏi khơi gợi",
    description: "Đừng bán — hãy hỏi. 7 câu hỏi khơi gợi khiến khách TỰ nói ra vấn đề, tự thuyết phục mình mua. Tỷ lệ chốt tăng 55% khi khách tự 'mở lòng'.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.9,
    reviewCount: 1450,
    sold: 4200,
    preview: "Không phải nói mà là hỏi. Khi khách tự nói ra vấn đề của họ, họ sẽ tự thuyết phục chính mình mua hàng.",
    fullContent: `# ROLE
Bạn là huấn luyện viên sales tâm lý, dạy kỹ thuật hỏi - lắng nghe để xây dựng lòng tin và khơi gợi nhu cầu khách hàng.

# CONTEXT
Bán hàng hiệu quả không phải nói về sản phẩm mà là hỏi về khách hàng. Câu hỏi tốt sẽ:
- Khiến khách tự nói ra vấn đề
- Tạo cảm giác bạn hiểu họ
- Tạo sự mong muốn được giải quyết
- Xây dựng tính chuyên gia của bạn

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Khách hàng mục tiêu: {{target_customer}}
Vấn đề chính họ gặp: {{main_problem}}
Giai đoạn tiếp xúc: {{contact_stage}}

# TASK
1. Tạo 10 câu hỏi khơi gợi để hiểu nhu cầu khách
2. Sắp xếp theo thứ tự logic (từ rộng đến chi tiết)
3. Viết response xử lý cho 5 câu trả lời phổ biến
4. Tạo follow-up questions kếp theo
5. Viết script demo phát hiện nhu cầu hoàn chỉnh

# OUTPUT FORMAT
**Câu hỏi khơi gợi:**
1. [Câu mở]: ...
2. [Câu chuyên sâu]: ...
...

**Xử lý response:**
Nếu khách nói "...": Hãy hỏi tiếp "..."

**Script demo 5 phút:**
(Nội dung chi tiết)`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "kỹ-thuật-hỏi"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-5.jpg"
  },
  {
    id: "sale-6",
    title: "Vẽ Customer Journey Map chi tiết",
    description: "Hiểu hành trình từ 'biết đến' đến 'mua hàng', bạn sẽ biết chính xác nên nói gì, ở đâu, lúc nào. Customer Journey Map chi tiết — bán hàng như đọc tâm trí.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1100,
    sold: 3200,
    preview: "Khách không mua ngay. Họ đi qua các giai đoạn: nhận biết, xem xét, quyết định. Biết được khách ở đâu = bán đúng lúc.",
    fullContent: `# ROLE
Bạn là chuyên gia Customer Experience, xây dựng bản đồ hành trình khách hàng chi tiết để tối ưu hóa conversion.

# CONTEXT
Customer Journey Map gồm các stage: Awareness, Consideration, Decision, Retention, Advocacy.
Mỗi stage khách có nhu cầu, cảm xúc, điểm đau, và channel tiếp xúc khác nhau.

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Khách hàng mục tiêu: {{buyer_persona}}
Vòng bán hàng hiện tại: {{sales_cycle}}
Thách thức chính: {{key_challenges}}

# TASK
1. Xác định 5 stage chính của hành trình khách
2. Mô tả hành vi, cảm xúc, nhu cầu tại mỗi stage
3. Xác định touchpoint tối ưu cho mỗi stage
4. Viết content/message phù hợp từng stage
5. Xác định metrics để đo lường effectiveness tại mỗi stage

# OUTPUT FORMAT
**Customer Journey Map - {{product}}:**

| Stage | Hành vi | Cảm xúc | Nhu cầu | Touchpoint | Message |
|-------|--------|---------|--------|-----------|---------|
| Awareness | ... | ... | ... | ... | ... |
| Consideration | ... | ... | ... | ... | ... |
| Decision | ... | ... | ... | ... | ... |
| Purchase | ... | ... | ... | ... | ... |
| Retention | ... | ... | ... | ... | ... |

**Cơ hội tối ưu hóa:**
- ...
- ...`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "customer-journey"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-6.jpg"
  },
  {
    id: "sale-7",
    title: "Phân tích Insight khách hàng từ đánh giá đối thủ",
    description: "Đối thủ bị review 1 sao ở đâu = cơ hội vàng cho bạn ở đó. Prompt phân tích insight từ đánh giá đối thủ — tìm lỗ hổng thị trường trong 15 phút.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 880,
    sold: 2600,
    preview: "Đối thủ của bạn đã giúp bạn hiểu khách rồi. Chỉ cần đọc review, complaint của họ là biết khách muốn gì.",
    fullContent: `# ROLE
Bạn là chuyên gia Competitive Intelligence, khai thác dữ liệu từ review đối thủ để tìm cơ hội bán hàng.

# CONTEXT
Review, đánh giá của khách hàng đối thủ là kho dữ liệu vô cùng quý giá. Mỗi complaint, praise là cơ hội để bạn:
- Hiểu nhu cầu thật sự
- Tìm những điểm yếu đối thủ
- Xây dựng positioning tốt hơn
- Tạo messaging hiệu quả

# INPUT
Sản phẩm của bạn: {{your_product}}
Sản phẩm/dịch vụ đối thủ: {{competitor_product}}
Link review/Shopee/Lazada: {{review_source}}
Số lượng review để phân tích: {{sample_size}}

# TASK
1. Thu thập 30-50 review từ đối thủ (complaint + praise)
2. Phân loại complaint thành 5-7 chủ đề chính
3. Xác định pattern chính: tần suất, mức độ nghiêm trọng
4. Tạo messaging để leverage điểm yếu này
5. Tạo script mở lời nhắc nhở những complaint này

# OUTPUT FORMAT
**Phân tích Review Đối Thủ:**

**Complaint Top:**
1. [Theme]: X% (n=... reviews)
   - Ví dụ: "..."
   - Script xử lý: ...

2. [Theme]: X% (n=... reviews)
   - Ví dụ: "..."
   - Script xử lý: ...

**Positioning tương phản:** ...
**Messaging mở lời:** ...`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "competitive-insight"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-7.jpg"
  },
  {
    id: "sale-8",
    title: "Tạo Buyer Persona chi tiết",
    description: "Bán cho 'tất cả mọi người' = bán cho không ai cả. Tạo Buyer Persona chi tiết đến từng thói quen mua sắm — quảng cáo trúng đích, chi phí giảm 40%.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1550,
    sold: 4500,
    preview: "Buyer Persona là hồ sơ khách hàng lý tưởng. Biết rõ họ là ai, tuổi bao nhiêu, làm gì, muốn gì - bán hàng sẽ dễ dàng hơn.",
    fullContent: `# ROLE
Bạn là chuyên gia Buyer Persona, xây dựng hồ sơ khách hàng lý tưởng với thông tin chi tiết từ demographics đến psychographics.

# CONTEXT
Buyer Persona bao gồm:
- Thông tin nhân khẩu: tuổi, giới tính, công việc, thu nhập
- Mục tiêu/vấn đề: điều họ muốn đạt được, vấn đề họ gặp
- Hành vi tìm kiếm: cách họ tìm kiếm giải pháp
- Sở thích/mối quan tâm: họ quan tâm điều gì
- Đối tượng ảnh hưởng: ai ảnh hưởng tới quyết định của họ

# INPUT
Sản phẩm/Dịch vụ của bạn: {{product}}
Nhóm khách mục tiêu: {{target_segment}}
Dữ liệu khách hiện tại (nếu có): {{current_customer_data}}
Ngành/Lĩnh vực: {{industry}}

# TASK
1. Tạo persona cho 2-3 loại khách hàng chính
2. Đặt tên, tuổi, công việc cho mỗi persona
3. Viết background story (1 đoạn) cho mỗi persona
4. Liệt kê 5 mục tiêu chính của persona
5. Liệt kê 5 vấn đề/lo lắng chính của persona
6. Viết kịch bản bán hàng lý tưởng cho từng persona

# OUTPUT FORMAT
**Buyer Persona #1: [Tên]**
- Tuổi: ... | Giới tính: ... | Công việc: ... | Thu nhập: ...
- Story: (1 đoạn)

**Mục tiêu:** (5 điểm)
**Vấn đề:** (5 điểm)
**Hành vi tìm kiếm:** ... (Ở đâu, dùng từ khóa gì)
**Messaging:** ... (Cách nói chuyện phù hợp)

[Repeat cho persona 2, 3]`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "buyer-persona"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-8.jpg"
  },
  {
    id: "sale-9",
    title: "Phân tích ngôn ngữ khách hàng (Voice of Customer)",
    description: "Khách nói 'muốn trắng da' chứ không nói 'muốn sản phẩm chứa niacinamide'. Dùng chính ngôn ngữ của khách để bán — tăng 3x tỷ lệ click quảng cáo.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1050,
    sold: 3100,
    preview: "Khách nói 'da xỉn' không phải 'tính chất melanin'. Khách nói 'nóng' không phải 'nâng cao temperature'. Dùng ngôn ngữ họ là chìa khóa.",
    fullContent: `# ROLE
Bạn là chuyên gia Copywriting & Voice of Customer, phân tích cách khách hàng nói về vấn đề họ để lấy insight viết copy hiệu quả.

# CONTEXT
Voice of Customer là cách khách hàng thực tế mô tả vấn đề của họ bằng ngôn ngữ của chính họ.
Không phải ngôn ngữ kỹ thuật mà là cách nói bình dân, cảm xúc, trực quan.
Copy hiệu quất dùng đúng ngôn ngữ này.

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Loại khách: {{customer_type}}
Nguồn dữ liệu (comments, review, message): {{data_source}}
Số lượng sample: {{sample_size}}

# TASK
1. Thu thập 20-30 comments/review/message từ khách thực tế
2. Phân tích từ vựng, phrase, cảm xúc họ dùng
3. Nhóm thành các chủ đề: vấn đề, giải pháp mong muốn, lo lắng
4. Tạo "Keyword Map" của Voice of Customer
5. Viết 5 phiên bản copy đưa từ ngôn ngữ khách vào

# OUTPUT FORMAT
**Voice of Customer Analysis:**

**Vấn đề - Cách khách nói:**
- "..." (n=X lần)
- "..." (n=X lần)
- "..." (n=X lần)

**Giải pháp mong muốn:**
- "..." (cách nói)
- "..." (cách nói)

**Lo lắng/Objection:**
- "..." (cách nó biểu hiện)
- "..." (cách nó biểu hiện)

**Copy dựa trên Voice of Customer:**
1. ...
2. ...
3. ...`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "copywriting"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-9.jpg"
  },
  {
    id: "sale-10",
    title: "Xác định Trigger mua hàng theo mùa/sự kiện",
    description: "Tháng 3 khách mua quà 8/3, tháng 9 mua cặp sách — timing là tất cả. Xác định trigger mua hàng theo mùa để ra offer đúng lúc khách sẵn sàng mở ví.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 920,
    sold: 2750,
    preview: "Bán mỹ phẩm trước Tết sẽ dễ hơn bán vào tháng 2. Trigger mua là thời điểm hoàn hảo để chốt đơn.",
    fullContent: `# ROLE
Bạn là chuyên gia Sales Timing & Seasonal Marketing, xác định các trigger, mùa, sự kiện khiến khách sẵn sàng mua hàng.

# CONTEXT
Purchase Trigger có thể là:
- Mùa (Tết, hè, cuối năm)
- Sự kiện cá nhân (sinh nhật, đám cưới, kỷ niệm)
- Sự kiện xã hội (lễ, ngày đặc biệt)
- Nhu cầu khẩn cấp (hỏng, cần thay)
- Tâm lý (sale, khuyến mại, FOMO)

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Khách hàng mục tiêu: {{target_customer}}
Chu kỳ mua trung bình: {{purchase_cycle}}
Dữ liệu bán hàng quá khứ (nếu có): {{historical_data}}

# TASK
1. Xác định 10-15 trigger mua chính cho sản phẩm
2. Xếp hạng theo tầm ảnh hưởng (High/Medium/Low)
3. Xác định timing cụ thể cho mỗi trigger
4. Tạo campaign timeline cho 12 tháng
5. Viết messaging phù hợp từng trigger

# OUTPUT FORMAT
**Purchase Triggers Analysis:**

| Trigger | Type | Timing | Impact | Messaging Hook |
|---------|------|--------|--------|-----------------|
| ... | ... | ... | High | ... |

**12-Month Marketing Calendar:**
- **Tháng 1**: ... (Trigger: ..., Campaign: ..., Message: ...)
- **Tháng 2**: ...
- ...

**Kỹ thuật kích hoạt:** ...`,
    tags: ["thấu-hiểu-khách", "chân-dung-khách", "seasonal-marketing"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-10.jpg"
  },
  {
    id: "sale-11",
    title: "Mở lời Inbox không mùi bán hàng",
    description: "90% khách block vì tin nhắn đầu tiên 'mùi bán hàng' quá nặng. Mẫu mở lời tự nhiên này khiến khách reply thay vì block — tỷ lệ phản hồi tăng 4x.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1300,
    sold: 3800,
    preview: "Mở lời kiểu 'Hi bạn, chúng tôi có sản phẩm...' sẽ bị block ngay. Cách bán mà khách không cảm thấy bị bán là kỹ năng thực sự.",
    fullContent: `# ROLE
Bạn là chuyên gia Inbox Strategy, dạy cách viết tin nhắn mở lời không lộ vẻ bán hàng, tạo cảm giác tự nhiên, xây dựng mối quan hệ.

# CONTEXT
Mở lời Inbox hiệu quả cần:
- Không nhắc đến sản phẩm trong lời đầu tiên
- Tạo giá trị, tò mò, hoặc kết nối cá nhân
- Ngôn ngữ tự nhiên, không công thức mẫu
- Có lý do rõ ràng tại sao bạn nhắn
- Tạo cảm giác "đặc biệt" - khách tưởng bạn chỉ nhắn cho họ

# INPUT
Loại khách mục tiêu: {{target_type}}
Sản phẩm/Dịch vụ: {{product}}
Lý do lý tưởng để nhắn: {{pretext}}
Tính cách/ngành của khách: {{customer_profile}}

# TASK
1. Tạo 7 phiên bản mở lời khác nhau (không nhắc sản phẩm)
2. Mỗi phiên bản dùng nguyên tắc tâm lý khác (value, curiosity, connection...)
3. Viết 3 follow-up tiếp theo nếu khách không rep
4. Tạo script chuyển từ chatting sang bán hàng mượt mà
5. Liệt kê 5 sai lầm phổ biến khi mở lời

# OUTPUT FORMAT
**Phiên bản mở lời #1 (Value):**
"..."

**Phiên bản mở lời #2 (Curiosity):**
"..."

[Repeat cho các phiên bản 3-7]

**Script follow-up (ngày 1, 3, 7):** ...

**Transition từ chat sang bán hàng:** ...

**Sai lầm cần tránh:**
1. ...
2. ...`,
    tags: ["tiếp-cận", "phá-băng", "inbox-strategy"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-11.jpg"
  },
  {
    id: "sale-12",
    title: "Phá băng khi khách Đã xem mà không rep",
    description: "Khách 'đã xem' mà im lặng? 70% vẫn đang cân nhắc. Kịch bản follow-up thông minh kéo họ quay lại chat — không spam, không phiền, chỉ chốt đơn.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 1050,
    sold: 3100,
    preview: "Khách đã xem tin nhưng không reply. Đây không phải \"không quan tâm\", mà là chưa thấy lý do để reply.",
    fullContent: `# ROLE
Bạn là chuyên gia Follow-up, tạo kịch bản phá băng thông minh khi khách đã xem nhưng chưa trả lời.

# CONTEXT
Follow-up không phải nhắc lại tin cũ mà là:
- Thay đổi angle/lý do
- Cung cấp thêm giá trị
- Tạo urgency hoặc FOMO
- Xin phản hồi rõ ràng (là hay không?)
- Tạo lý do cụ thể để khách rep

# INPUT
Tin nhắn mở lời đầu: {{first_message}}
Thời gian đã gửi: {{time_since_sent}}
Khách hàng profile: {{customer_profile}}
Sản phẩm/Lý do bạn nhắn: {{product_reason}}

# TASK
1. Tạo 5 phiên bản follow-up cho ngày 1, 3, 5, 7, 10
2. Mỗi phiên bản dùng angle khác (giá trị, tiếp cận mới, urgency, xin feedback, offer)
3. Viết script nếu khách cuối cùng rep/block/ignore
4. Tạo exit strategy khi nên dừng theo dõi
5. Dạy cách xác định "khách có tiềm năng hay không"

# OUTPUT FORMAT
**Follow-up Timeline:**

**Ngày 1 (Value-add):** ...
**Ngày 3 (Angle khác):** ...
**Ngày 5 (Urgency):** ...
**Ngày 7 (Xin feedback):** ...
**Ngày 10 (Last attempt):** ...

**Xử lý các tình huống:**
- Khách block: ...
- Khách "xem xét": ...
- Khách tham gia conversation: ...

**Khi nên dừng:** ...`,
    tags: ["tiếp-cận", "phá-băng", "follow-up"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-12.jpg"
  },
  {
    id: "sale-13",
    title: "Kịch bản Cold Call 30 giây vàng",
    description: "30 giây đầu tiên quyết định khách cúp máy hay lắng nghe. Script cold call vàng — mở đầu thu hút, khách nói 'kể thêm đi' thay vì 'không cần đâu'.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1600,
    sold: 4700,
    preview: "30 giây đầu tiên quyết định khách có cúp máy hay không. Mở lời đúng cách, khách sẽ lắng nghe.",
    fullContent: `# ROLE
Bạn là huấn luyện viên Cold Calling, dạy script mở lời 30 giây vàng giúp khách không cúp máy và lắng nghe.

# CONTEXT
Mở lời Cold Call cần:
- Tên + công ty (để khách biết ai gọi)
- Lý do gọi rõ ràng (trong 5 giây)
- Giá trị hoặc lý do mà khách sẽ muốn lắng nghe
- Xin phép tiếp tục (không bắt buộc)
- Tone voice: tự tin nhưng không aggressive

# INPUT
Loại khách (B2B/B2C): {{call_type}}
Sản phẩm/Dịch vụ: {{product}}
Lý do chính khách nên nghe: {{value_prop}}
Lĩnh vực/Ngành: {{industry}}

# TASK
1. Tạo 5 phiên bản script mở lời 30 giây
2. Mỗi script cho loại khách hoặc lý do khác
3. Viết script response cho 5 câu trả lời phổ biến (busy, not interested...)
4. Tạo kịch bản appointment setting hoàn chỉnh
5. Dạy cách đọc tone voice khách để điều chỉnh

# OUTPUT FORMAT
**Script #1 (B2B/Decision maker):**
"...
[tên + công ty]
...
[lý do gọi]
...
[giá trị]
[5-7 giây]"

**Response handling:**
- Khách: "Bận lắm"
  Script: "Tôi hiểu, tôi chỉ mất 1 phút..."

[Repeat cho các responses khác]

**Appointment Setting:** ...`,
    tags: ["tiếp-cận", "phá-băng", "cold-calling"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-13.jpg"
  },
  {
    id: "sale-14",
    title: "Biến Comment thành tin nhắn chốt đơn",
    description: "Comment 'bao nhiêu chị?' là cơ hội vàng. Kịch bản biến bình luận thành DM, biến DM thành đơn hàng — tỷ lệ chốt từ comment tăng 60%.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1150,
    sold: 3400,
    preview: "Khách comment \"giá bao nhiêu?\" là signal rất hot. Inbox ngay để chốt, không để khách chạy sang cạnh tranh.",
    fullContent: `# ROLE
Bạn là chuyên gia Social Commerce, dạy cách chuyển comment thành DM và chốt đơn hiệu quả trên social media.

# CONTEXT
Comment là form engagement tốt nhất vì:
- Khách đã chủ động tương tác
- Họ đang quan tâm (không phải scroll qua)
- Public comment = họ muốn khác biết
- Cơ hội chuyển DM rất cao

Tuy nhiên cần kỹ thuật đúng để không làm khách khó chịu.

# INPUT
Loại comment từ khách: {{comment_type}} (giá, thông tin, feedback...)
Sản phẩm/Bài post: {{product_post}}
Tính chất: {{comment_sentiment}}
Kênh (Facebook/Instagram/TikTok): {{platform}}

# TASK
1. Tạo 8 template response công khai cho các loại comment (giá, hỏi chi tiết, phàn nàn, khen...)
2. Mỗi response phải gợi DM ngay nhưng không lạ
3. Viết script DM tiếp theo sau khi khách inbox
4. Tạo strategy chuyển comment hỏi thông tin sang DM chốt đơn
5. Dạy khi nào nên trả lời công khai vs DM

# OUTPUT FORMAT
**Comment Type: Hỏi giá**
Public reply: "..."
(Lợi ích: gợi inbox, vẫn tạo trust công khai)

Next DM: "..."

**Comment Type: Hỏi chi tiết**
Public reply: "..."
Next DM: "..."

[Repeat cho các loại comment khác]

**Best practices:** ...`,
    tags: ["tiếp-cận", "phá-băng", "social-commerce"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-14.jpg"
  },
  {
    id: "sale-15",
    title: "Tạo sự tò mò qua Story Facebook/Zalo",
    description: "Story 3 slide khiến khách nhắn tin hỏi mua mà bạn không cần CTA lộ liễu. Kỹ thuật tạo tò mò đã giúp 1.000+ seller tăng inbox gấp 5 lần.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 1020,
    sold: 3000,
    preview: "Story tốt là khách tự inbox bạn để hỏi, không phải bạn phải nhắn trước. Đó là sức hút thực sự.",
    fullContent: `# ROLE
Bạn là chuyên gia Story Marketing, tạo story khiến khách không thể không inbox bạn để hỏi.

# CONTEXT
Story hiệu quả dùng:
- Cliffhanger (chưa nói hết)
- Scarcity (\"chỉ còn vài cái\")
- Transformation (trước/sau)
- Intrigue (\"bạn có biết tại sao...?\")
- Problem solved (\"tôi đã giải quyết điều X này\")

Không nên dùng CTA rõ \"Inbox ngay\" mà để khách tự chủ động.

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Main benefit/transformation: {{main_benefit}}
Loại khách: {{customer_type}}
Style: {{brand_style}} (formal/casual/funny...)

# TASK
1. Tạo 10 story ideas dùng các technique: cliffhanger, scarcity, transformation, intrigue
2. Viết copy đầy đủ cho 5 story tốt nhất
3. Mô tả visual/format cho từng story
4. Tạo follow-up khi khách inbox hỏi
5. Dạy cách tạo story series (liên tiếp nhiều ngày)

# OUTPUT FORMAT
**Story Idea #1 (Cliffhanger):**
Copy: "..."
Visual: ...
Expected reaction: Khách sẽ inbox hỏi "...?"
Follow-up: "..."

**Story Idea #2 (Transformation):**
Copy: "..."
[Before/After]

[Repeat cho các idea khác]

**Story Series (5 ngày):** 
Day 1: ...
Day 2: ...`,
    tags: ["tiếp-cận", "phá-băng", "story-marketing"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-15.jpg"
  },
  {
    id: "sale-16",
    title: "Kịch bản Livestream bán hàng hút tương tác",
    description: "Livestream mà im lặng = thất bại. Script từ mở đầu kéo người xem, giữ tương tác, đến chốt đơn liên tục — doanh thu live tăng 200% từ buổi đầu tiên.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.9,
    reviewCount: 1450,
    sold: 4200,
    preview: "Livestream không phải talk show. Mỗi 3 phút phải có interaction, phải có offer, phải có lý do để khách mua.",
    fullContent: `# ROLE
Bạn là chuyên gia Livestream Selling, viết script livestream bán hàng toàn diện từ mở đầu đến chốt đơn.

# CONTEXT
Livestream bán hàng khác với livestream thường:
- Phải có structure rõ (Hook, Story, Demo, Offer, CTA)
- Phải tương tác liên tục (không chỉ nói suông)
- Phải có urgency (flash sale, limited stock, countdown)
- Phải chốt đơn trong stream (không just awareness)
- Cần team: bạn nói, người khác quản lý comment

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Thời lượng livestream: {{duration}} (15/30/60 phút)
Mục tiêu (awareness/direct sales): {{goal}}
Loại khách: {{audience_type}}

# TASK
1. Viết outline 30 phút livestream hoàn chỉnh
2. Mỗi segment có time, script, interaction point
3. Tạo 3 offer khác nhau (early bird, regular, last minute)
4. Viết cách xử lý comment/question trong stream
5. Tạo script gọi hành động (CTA) cụ thể

# OUTPUT FORMAT
**Livestream 30 phút Structure:**

**0:00-1:30 (Hook - Welcome):** ...
[Goal: Subscribe/Follow nhanh]

**1:30-5:00 (Problem/Story):** ...
[Goal: Tạo resonance, khách cảm thấy \"đó là mình\"]

**5:00-15:00 (Demo/Content):** ...
[Interaction every 2-3 min: \"Ai here?\", poll, Q&A...]

**15:00-25:00 (Offer/Close):** ...
[3 tier offers with countdown]

**25:00-30:00 (Final CTA/Re-offer):** ...`,
    tags: ["tiếp-cận", "phá-băng", "livestream-selling"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-16.jpg"
  },
  {
    id: "sale-17",
    title: "Viết tin nhắn giới thiệu sản phẩm mới cho khách cũ",
    description: "Khách cũ mua lại rẻ gấp 5 lần tìm khách mới. Mẫu tin nhắn giới thiệu sản phẩm mới — khách cũ thấy được 'ưu ái', tỷ lệ mua lại tăng 35%.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1200,
    sold: 3600,
    preview: "Khách cũ là vàng, họ đã biết bạn, đã mua từ bạn rồi. Chỉ cần mách đúng sản phẩm là sẽ mua lại.",
    fullContent: `# ROLE
Bạn là chuyên gia Re-activation & Upsell, viết tin nhắn giới thiệu sản phẩm mới cho khách đã mua.

# CONTEXT
Khách cũ có lợi ích:
- Đã tín nhiệm thương hiệu bạn
- Biết quality, service của bạn
- Conversion rate cao hơn 5x so với khách mới
- Cost lower, profit higher
- Easy to upsell/cross-sell

Tuy nhiên không nên quá aggressive, giữ relationship là priority.

# INPUT
Sản phẩm mới: {{new_product}}
Sản phẩm họ đã mua trước: {{previous_product}}
Thời gian từ lần mua cuối: {{time_since_purchase}}
Tính chất (upgrade/complement/new category): {{product_type}}

# TASK
1. Tạo 5 template tin nhắn dùng các angle khác (upgrade, complement, improvement, new launch, special offer)
2. Mỗi template phải reference lần mua cũ (tạo familiarity)
3. Viết script handle response (interested, not interested, ask more)
4. Tạo kịch bản upsell khi khách quan tâm
5. Dạy khi nào follow-up, khi nào thôi

# OUTPUT FORMAT
**Template #1 (Upgrade):**
"Hi [tên]! Hôm qua bạn mua [old product], nhưng giờ mình có phiên bản mới [new product] tốt hơn. [Benefit]. Bạn có muốn xem không?"

**Template #2 (Complement):**
"..."

[Repeat cho templates 3-5]

**Handling responses:**
- Interested: ... (Upsell script)
- Not now: ... (Timing follow-up)
- Not interested: ... (Exit gracefully)

**Upsell sequence:** ...`,
    tags: ["tiếp-cận", "phá-băng", "re-engagement"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-17.jpg"
  },
  {
    id: "sale-18",
    title: "Kịch bản tiếp cận khách hàng B2B qua LinkedIn/Email",
    description: "B2B không chốt bằng cảm xúc mà bằng ROI. Kịch bản cold outreach LinkedIn/Email chuyên nghiệp — tỷ lệ reply 25%, gấp 5 lần email bán hàng thông thường.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 980,
    sold: 2900,
    preview: "B2B cold outreach khác B2C. Người quyết định B2B muốn professional, solution-focused, ROI-driven.",
    fullContent: `# ROLE
Bạn là chuyên gia B2B Sales Development, viết cold outreach chuyên nghiệp trên LinkedIn và Email cho doanh nghiệp.

# CONTEXT
B2B cold outreach thành công cần:
- Research sâu (công ty, người, thách thức)
- Personalization (không template mẫu)
- Value proposition rõ ràng (ROI, efficiency, cost saving)
- Respect thời gian (ngắn gọn, direct)
- Legitimate reason to connect
- Call to action cụ thể (meeting, call, demo)

# INPUT
Sản phẩm/Dịch vụ B2B: {{b2b_solution}}
Target company profile: {{company_profile}}
Decision maker role: {{decision_maker_role}}
Unique value vs competitors: {{unique_value}}

# TASK
1. Tạo 5 template LinkedIn connection request (personalized)
2. Tạo 3 template email cold outreach (follow-up sau connect)
3. Viết handling script cho 5 responses phổ biến (not relevant, already have solution, too expensive...)
4. Tạo follow-up sequence (3-5 emails nếu không reply)
5. Dạy cách qualify prospect (có đáng theo dõi hay không)

# OUTPUT FORMAT
**LinkedIn Connection Request:**
"Hi [name], I noticed you're leading [team] at [company]. We help companies like [similar companies] reduce [pain point] by [X%]. Would love to connect and explore if we can help [company] too. -[Your name]"

**Email #1 (Post-connection):**
Subject: [Personalized headline]
Body: ...

**Email #2 (Day 3):**
...

**Email #3 (Day 7):**
...

**Response Handling:**
- \"We already have a solution\": ...
- \"Too expensive\": ...

**Qualification checklist:** ...`,
    tags: ["tiếp-cận", "phá-băng", "b2b-sales"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-18.jpg"
  },
  {
    id: "sale-19",
    title: "Tạo Lead Magnet hút khách tự để lại thông tin",
    description: "Ebook miễn phí đổi email = lead máy in tiền. Prompt tạo lead magnet hút khách tự để lại thông tin — thu 500+ leads/tháng mà không chạy ads.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1100,
    sold: 3200,
    preview: "Khách sẽ không để lại email cho bạn ngoài trường hợp họ thực sự muốn. Lead Magnet là chìa khóa.",
    fullContent: `# ROLE
Bạn là chuyên gia Lead Generation, thiết kế Lead Magnet (ebook, checklist, template, quiz) khiến khách tự để lại thông tin.

# CONTEXT
Lead Magnet cần:
- Deliver value IMMEDIATELY (khách tải xong là có lợi ích)
- Specific & actionable (không vague, phải implement được ngay)
- Relevant to target (đúng audience, đúng pain point)
- Easy to consume (không quá dài, dễ đọc/xem)
- Ethical lead capture (khách biết sẽ được follow-up)

Mục tiêu: Exchange cao (30-50% landing page visitor để lại email)

# INPUT
Sản phẩm/Dịch vụ chính của bạn: {{main_product}}
Biggest pain point của khách: {{pain_point}}
Format khách thích: {{preferred_format}} (ebook/checklist/template/video...)
Industry: {{industry}}

# TASK
1. Tạo 5 lead magnet ideas phù hợp pain point
2. Chọn 1 và viết outline chi tiết (structure, sections, content)
3. Tạo landing page copy để promote lead magnet
4. Viết email sequence 5 ngày sau khi khách tải
5. Dạy cách measure lead magnet effectiveness

# OUTPUT FORMAT
**Lead Magnet Idea #1: [Type - Ebook/Checklist/Template]**
Title: \"...\"
Why attractive: ...
Outline: 
- Section 1: ...
  - Sub-point: ...
- Section 2: ...

**Landing Page Copy:**
Headline: ...
Subheadline: ...
Benefits (3 điểm): ...
CTA: ...

**Email Sequence (Day 1, 2, 3, 4, 5):**
Day 1: ...
...

**Metrics to track:** ...`,
    tags: ["tiếp-cận", "phá-băng", "lead-generation"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-19.jpg"
  },
  {
    id: "sale-20",
    title: "Kịch bản telesale mở đầu cho ngành dịch vụ",
    description: "Telesale spa, gym, bảo hiểm, BĐS — mỗi ngành cần script riêng. Kịch bản mở đầu chuyên biệt giúp khách nói 'ok, chị nghe' trong 15 giây đầu.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1050,
    sold: 3100,
    preview: "Telesale là art form. Phải nói chuyện thì mới bán được. Script chuẩn là 50%, delivery là 50%.",
    fullContent: `# ROLE
Bạn là huấn luyện viên Telesale, viết script mở đầu chuyên nghiệp cho các ngành dịch vụ (spa, gym, bảo hiểm, bất động sản...).

# CONTEXT
Telesale ngành dịch vụ khác với product bán online:
- Khách muốn hiểu về dịch vụ (không phải so sánh price online)
- Cần build confidence qua cuộc gọi
- Appointment setting là goal chính
- Tone voice phải professional + warm
- Phải handle objection related to service quality & trust

# INPUT
Loại dịch vụ: {{service_type}} (spa, gym, bảo hiểm, BĐS, khóa học...)
Target customer type: {{target_type}}
Unique value/differentiator: {{unique_value}}
Campaign purpose: {{purpose}} (trial member, consultation booking, property viewing...)

# TASK
1. Tạo script mở đầu 30 giây
2. Viết script giới thiệu dịch vụ (2 phút) với benefit rõ
3. Tạo 5 objection handling scripts (price, busy, already have service...)
4. Viết appointment setting close (xin ngày giờ)
5. Tạo script follow-up nếu khách không setting appointment

# OUTPUT FORMAT
**Opening 30 sec:**
\"Hi [name], this is [your name] from [company]. We help [target type] achieve [benefit]. Do you have 2 minutes?\"

**Service Intro (2 min):**
\"We offer [service], which helps [benefit]. What's specific is [unique value]. Many of our clients experienced [result]. Would you like to see if it fits your needs?\"

**Objection #1: \"Too expensive\":**
\"I understand. That's why most clients try our [intro offer] first. It's risk-free because [guarantee]. Can we book a consultation?\"

**Appointment Setting:**
\"Great! I'd love to set you up with our specialist for a [30-min consultation]. Are you free [day/time] or [day/time]?\"

**Follow-up (if no commitment):**
\"No pressure. I'll send you our [info/brochure]. Feel free to reach out when you're ready. Fair?\"`,
    tags: ["tiếp-cận", "phá-băng", "telesale"],
    difficulty: "Dễ",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-20.jpg"
  },
  {
    id: "sale-21",
    title: "Xử lý: Giá cao quá (Reframe giá trị)",
    description: "Khách nói 'đắt quá' — đừng giảm giá, hãy reframe giá trị. Kỹ thuật so sánh chi phí cơ hội biến 'đắt' thành 'rẻ hơn tưởng tượng'. Tăng 40% tỷ lệ chốt.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1500,
    sold: 4400,
    preview: "Khách nói \"giá cao quá\" không phải từ chối mà là cơ hội. Reframe ngay từ giá sang giá trị, chi phí không mua.",
    fullContent: `# ROLE
Bạn là chuyên gia Reframing, dạy cách chuyển cuộc trò chuyện từ \"giá quá cao\" sang \"giá trị\" và \"chi phí cơ hội\".

# CONTEXT
\"Giá cao\" không phải objection thực sự, mà là khách chưa thấy giá trị. Cơ hội của bạn là:
- Nhấn mạnh giá trị (outcome, ROI, benefit)
- So sánh với chi phí không mua (missed opportunity, continued pain)
- Đặt giá trong context (chi phí hàng ngày, hàng tháng)
- Dùng comparison (vs đối thủ, vs giải pháp hiện tại)
- Tạo payment options (trả góp, subscription)

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Giá bạn bán: {{your_price}}
Giá khách nói cao: {{customer_perception}}
Lợi ích chính: {{main_benefit}}
ROI/Savings: {{value_delivered}}

# TASK
1. Tạo 7 reframe phrases để đối phó \"giá cao\"
2. Mỗi phrase dùng tactic khác: value, ROI, pain, comparison, daily cost...
3. Viết script xử lý từ chối vì giá chi tiết (2 phút)
4. Tạo \"value story\" chứng minh ROI
5. Viết payment plan options để lower barrier

# OUTPUT FORMAT
**Reframe #1 (Value focus):**
Khách: \"Giá cao quá\"
Bạn: \"Tôi hiểu. Nhưng hãy xem như vậy: Sản phẩm này giúp bạn [benefit] trong [timeframe]. Chi phí thực sự là [reframed cost]. Có đáng không?\"

**Reframe #2 (ROI):**
\"Khách của chúng tôi tiết kiệm được [savings] trong [period]. Chi phí của mình lấy lại trong [time]. Con số nào là đáng?\"

[Repeat cho reframes 3-7]

**Value Story (2 phút):**
Case study: [Khách gặp vấn đề X] -> [Dùng sản phẩm] -> [Kết quả Y]
Tương ứng với giá trị: $Z

**Payment Options:**
- Option 1: ... (Upfront)
- Option 2: ... (Installment)
- Option 3: ... (Subscription)`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "reframing"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-21.jpg"
  },
  {
    id: "sale-22",
    title: "Xử lý: Để hỏi ý kiến vợ/chồng",
    description: "Câu 'để hỏi vợ/chồng' = sắp mất deal. Kỹ thuật tạo đồng thuận giúp khách thuyết phục luôn người quyết định — không cần gặp trực tiếp.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1250,
    sold: 3700,
    preview: "Khách nói \"tôi về hỏi vợ cái\". Lỗi bán hàng phổ biến nhất. Biết cách xử lý = biết chốt deal.",
    fullContent: `# ROLE
Bạn là chuyên gia Sales Psychology, dạy cách xử lý khi khách muốn \"hỏi ý kiến vợ/chồng/cha mẹ\" để cuối cùng khách vẫn mua.

# CONTEXT
Câu \"để hỏi ý kiến\" thường có 2 ý:
1. Thực sự cần xin phép (decision influence từ người khác)
2. Lý do để tránh quyết định ngay (không muốn nói \"không\")

Cách xử lý:
- Tìm ra lý do thực sự (ask clarifying questions)
- Cô lập người quyết định (nhắm tới người đó)
- Tạo buy-in từ chính khách trước
- Offer solution (invite partner to discuss, discount for quick decision...)

# INPUT
Tình huống cụ thể: {{situation}}
Sản phẩm/Dịch vụ: {{product}}
Người được \"hỏi ý kiến\": {{partner_type}} (vợ/chồng/cha/mẹ/partner...)
Lý do khách đưa ra: {{stated_reason}}

# TASK
1. Tạo 5 câu hỏi clarifying để tìm lý do thực sự
2. Viết script xử lý nếu lý do là \"economic\" (khách sợ anh không đồng ý)
3. Viết script xử lý nếu lý do là \"emotional\" (sợ mua sai)
4. Tạo script mời \"người kia\" vào conversation
5. Viết script close khi cả hai đều đồng ý

# OUTPUT FORMAT
**Clarifying Questions:**
1. \"Khi bạn nói muốn hỏi ý kiến [person], thì chủ yếu lo về điều gì?\"
2. \"[Person] đã từng phản đối quyết định tương tự của bạn không?\"
3. \"Nếu [person] đồng ý, bạn sẽ mua ngay không?\"

**Script nếu vấn đề là \"kinh tế\":**
\"Tôi hiểu [spouse] là đối tác tài chính. Hãy xem như vậy - sản phẩm này giúp [family benefit] như thế này [explain]. Chi phí là [price], đáng hơn không?\"

**Script mời người kia:**
\"Có được không nếu mình trao đổi nhanh với [spouse]? Chỉ 5 phút để [person] hiểu rõ giá trị này.\"

**Script close:**
\"Tuyệt vời! Thì bây giờ chúng ta set thời gian [next step] như nào?\"`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "decision-psychology"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-22.jpg"
  },
  {
    id: "sale-23",
    title: "Xử lý: Bên kia bán rẻ hơn",
    description: "'Bên kia rẻ hơn' — cuộc chiến giá không ai thắng. Script nhấn sự khác biệt và hậu mãi, biến so sánh giá thành so sánh giá trị. Bảo vệ margin, vẫn chốt đơn.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "Đối thủ luôn rẻ hơn. Nếu chỉ cạnh tranh giá thì bạn sẽ thua vì họ luôn rẻ hơn được.",
    fullContent: `# ROLE
Bạn là chuyên gia Differentiation & Value Positioning, dạy cách xử lý khi khách nói \"bên kia rẻ hơn\".

# CONTEXT
Không bao giờ cạnh tranh giá. Thay vào đó, cạnh tranh giá trị:
- Quality difference (tại sao bạn tốt hơn)
- Service difference (support, warranty, follow-up)
- Outcome difference (kết quả, ROI, satisfaction)
- Total cost of ownership (không chỉ giá mua mà tổng chi phí)
- Relationship (long-term value vs one-time transaction)

# INPUT
Sản phẩm/Dịch vụ của bạn: {{product}}
Đối thủ/competitor: {{competitor}}
Sự khác biệt chính (quality, service, result): {{differentiation}}
Khách mention ông/bà nào: {{mentioned_competitor}}

# TASK
1. Xác định 5 điểm khác biệt (quality, service, outcome...)
2. Tạo comparison matrix (bạn vs đối thủ) về total value
3. Viết script reframe từ \"giá\" sang \"giá trị\"
4. Tạo \"proof\" của differentiation (testimonial, case study, warranty...)
5. Viết \"fear of cheap\" script (cảnh báo risiko của cheap alternatives)

# OUTPUT FORMAT
**Differentiation Points:**
1. Quality: Bạn [advantage], Đối thủ [limitation]
   Ảnh hưởng: [outcome]
2. Service: ...
3. Warranty/Support: ...

**Comparison Matrix:**
| Factor | Bạn | Đối thủ | Impact |
|--------|-----|---------|--------|
| Quality | High | Medium | Lasts longer |
| Support | 2 years | 30 days | Risk lower |
| Result | 95% success | 60% | Worth premium |
| Total cost over 3 years | $X | $Y | Bạn savings $Z |

**Script:**
\"Tôi hiểu [competitor] rẻ hơn. Nhưng hãy nhìn vào [point A] + [point B] + [point C]. Chi phí thực sự là [total cost]. Mặt khác, chúng tôi offer [guarantee/support] mà họ không có.\"`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "positioning"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-23.jpg"
  },
  {
    id: "sale-24",
    title: "Xử lý: Chưa cần ngay",
    description: "'Chưa cần ngay' = chờ đợi mất tiền. Kỹ thuật tạo FOMO và chi phí cơ hội — 65% khách chốt ngay khi thấy 'chờ = mất'.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1300,
    sold: 3800,
    preview: "\"Chưa cần\" là cơ hội vàng tạo urgency. Khách sợ gì? Khách không mua vì chưa thấy cấp bách.",
    fullContent: `# ROLE
Bạn là chuyên gia Urgency & FOMO, tạo cảm giác cấp bách và chi phí của việc chờ đợi.

# CONTEXT
\"Chưa cần\" có thể nghĩa:
1. Chưa cần ngay nhưng sẽ cần sau (tạo FOMO về deadline)
2. Chưa cần vì bây giờ vẫn ổn (tạo urgency về cost of delay)
3. Chưa cần vì chưa thấy vấn đề gấp (giáo dục về pain cost)

Urgency phải là thực sự (limited stock, deadline, price increase) không phải fake.

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Khách đối tượng: {{customer_type}}
Timing concern: {{why_not_urgent}}
Real urgency factors: {{real_urgency}} (limited stock, price increase, seasonal...)

# TASK
1. Tạo 5 urgency angles khác nhau (scarcity, price increase, waiting cost, seasonal, FOMO...)
2. Mỗi angle có script cụ thể + proof
3. Viết \"cost of waiting\" calculation (nếu chờ thêm 3 tháng sẽ mất gì)
4. Tạo limited-time offer (thực sự có expire date)
5. Viết script xử lý \"khách không tin urgency\" (quá fake)

# OUTPUT FORMAT
**Urgency Angle #1 (Scarcity):**
Fact: \"Chỉ còn [X] units, mỗi tuần bán [Y] units. Nếu chờ, sẽ hết trong [Z] ngày.\"
Script: \"Tôi muốn bạn có cơ hội, nên nói thẳng: sản phẩm này hot, người khác đã order. Nếu muốn, nên đặt trước khi hết.\"

**Urgency Angle #2 (Cost of Waiting):**
Calculation:
- Bạn gặp vấn đề X hàng ngày
- Chi phí/ảnh hưởng: $Y mỗi ngày
- Nếu chờ 3 tháng = mất $[Y × 90]
- Giá sản phẩm = $Z
- Net benefit của hành động ngay = $[Y×90 - Z]

**Limited-time offer:**
- Valid until: [real date]
- Discount/Bonus: [real value]
- Reason: [genuine reason]

**Script if customer skeptical:**
\"Tôi hiểu nghi ngờ. Urgency này là thực: [fact]. Nếu bạn muốn, tôi có thể [guarantee/refund policy] để giảm risk.\"`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "urgency"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-24.jpg"
  },
  {
    id: "sale-25",
    title: "Xử lý: Để suy nghĩ thêm",
    description: "'Để suy nghĩ thêm' là lý do giả — lý do thật ẩn sau. 5 câu hỏi xoáy sâu tìm objection thật, xử lý tại chỗ. Không để khách 'suy nghĩ' rồi biến mất.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1400,
    sold: 4100,
    preview: "\"Để tôi suy nghĩ thêm\" là excuse. Bao giờ họ lại suy nghĩ? Biết câu hỏi đúng = tìm ra lý do thật sự.",
    fullContent: `# ROLE
Bạn là chuyên gia Discovery & Deep Listening, dạy cách dùng câu hỏi sâu để tìm lý do thật sự đằng sau \"để suy nghĩ thêm\".

# CONTEXT
\"Để suy nghĩ thêm\" thường che giấu:
- Concern about price (kinh tế)
- Doubt about quality (tín nhiệm)
- Missing information (cần hiểu thêm)
- Lack of urgency (không thấy vấn đề gấp)
- Fear of making wrong decision (decision anxiety)

Câu hỏi đúng sẽ phơi bày lý do thật sự, sau đó bạn mới có thể xử lý.

# INPUT
Loại sản phẩm/dịch vụ: {{product}}
Giai đoạn khách ở (early interest, strong interest, hesitation): {{stage}}
Khách đã hỏi những gì: {{questions_asked}}
Concern bạn đoán: {{suspected_concern}}

# TASK
1. Tạo 10 câu hỏi discovery (xoáy sâu để tìm lý do thật sự)
2. Mỗi câu hỏi targeted vào một concern cụ thể
3. Sắp xếp theo \"soft đến hard\" (không quá aggressive)
4. Viết script cách hỏi + cách lắng nghe
5. Tạo follow-up response cho mỗi loại lý do

# OUTPUT FORMAT
**Discovery Questions (in order):**

**Soft questions (mở đầu):**
1. \"Vậy cảm giác của bạn về [product] là gì? Cái gì ấy là tốt, cái gì cần suy ngẫm?\"
   (Goal: Khách tự nói ra concern)

2. \"Khi bạn suy nghĩ thêm, cái gì là điều quan trọng nhất cần xem xét?\"
   (Goal: Prioritize concern)

**Harder questions (xoáy sâu):**
3. \"Ngoài vấn đề [X], còn gì khác khiến bạn chưa sẵn sàng?\"
   (Goal: List tất cả concerns)

**Response to each concern:**
If price: \"Tôi hiểu. Nếu giá không phải vấn đề, bạn sẽ mua ngay?\"
If quality doubt: \"Nếu bạn tự tay thử [product] trong 7 ngày và thấy kết quả, bạn có dám mua không?\"
If missing info: \"Thông tin nào sẽ giúp bạn tự tin?\"

**Timeline for follow-up:**
- Day 1: Send [info/proof]
- Day 3: Follow up with question
- Day 7: Offer [incentive] to decide\"`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "discovery"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-25.jpg"
  },
  {
    id: "sale-26",
    title: "Xử lý: Sản phẩm không phù hợp",
    description: "'Không phù hợp' thường là chưa thấy góc phù hợp. Kỹ thuật reframe nhu cầu — biến 'không' thành 'à, vậy thì có'. Cứu 30% deal tưởng đã mất.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1050,
    sold: 3150,
    preview: "Khách nói \"không phù hợp\" thường không phải sản phẩm không phù hợp, mà là bạn chưa tìm đúng use case.",
    fullContent: `# ROLE
Bạn là chuyên gia Solution Selling & Needs Reframing, giúp tìm use case khác hoặc reframe nhu cầu để sản phẩm phù hợp hơn.

# CONTEXT
\"Không phù hợp\" có thể do:
1. Khách hiểu sai use case (sản phẩm phù hợp cho trường hợp khác)
2. Khách có nhu cầu thứ 2 (sản phẩm có thể solve nó)
3. Khách compare với product khác (misalignment expectations)
4. Timing không đúng (khách cần cái khác trước)

Cơ hội: tìm ra need thật sự, reframe product fit.

# INPUT
Sản phẩm/dịch vụ: {{product}}
Khách nói không phù hợp vì: {{stated_reason}}
Khách's actual situation: {{actual_situation}}
Alternative use cases: {{use_cases}}

# TASK
1. Tạo discovery questions để hiểu nhu cầu thật sự
2. Xác định 3-5 use case khác mà sản phẩm có thể fit
3. Reframe mỗi use case thành customer benefit cụ thể
4. Viết pitch lại cho use case mới (short script)
5. Tạo \"next best product\" recommendation nếu benar-benar không fit

# OUTPUT FORMAT
**Discovery Questions:**
1. \"Khi bạn nói không phù hợp, thì chủ yếu là [aspect] không match?\"
2. \"Vậy use case lý tưởng của bạn là gì?\"
3. \"Nếu sản phẩm có thể [feature], nó sẽ phù hợp không?\"

**Alternative Use Cases:**

Use case #1: [Different scenario where product fits]
- Customer situation: ...
- How product helps: ...
- Script: \"Bạn có gặp tình huống [X] không? Sản phẩm này super fit vì [Y].\"

[Repeat for use cases 2-5]

**Re-pitch script (2 min):**
\"Tôi hiểu perspective của bạn. Hãy xem vậy - sản phẩm này được dùng bởi [type of customer] để [outcome]. Cách bạn mô tả use case, nó sẽ [fit/not fit]. Bạn thích tôi giới thiệu [alternative] thay vì?\"`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "solution-selling"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-26.jpg"
  },
  {
    id: "sale-27",
    title: "Xử lý: Đã dùng rồi không hiệu quả",
    description: "'Dùng rồi không hiệu quả' — rào cản lớn nhất. Kịch bản khơi gợi trải nghiệm khác biệt, cho cơ hội thứ 2 — tỷ lệ thuyết phục 35%.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1200,
    sold: 3600,
    preview: "Khách dùng rồi không hiệu quả = họ chưa dùng đúng cách hoặc sản phẩm dùng lần trước khác hôm nay.",
    fullContent: `# ROLE
Bạn là chuyên gia Redemption Selling, dạy cách xử lý khi khách nói \"đã thử rồi, không hiệu quả\" để tạo cơ hội second chance.

# CONTEXT
\"Dùng rồi không hiệu quả\" có thể:
1. Dùng sai cách (need guidance)
2. Sản phẩm chất lượng thấp lần trước (improved version now)
3. Timing không đúng (context khác lần này)
4. Expectation sai (need better education)
5. Sản phẩm khác hôm nay (mình upgraded/evolved)

Mục tiêu: khơi gợi lại hope, offer improvement/guarantee.

# INPUT
Sản phẩm/dịch vụ: {{product}}
Khách dùng version: {{previous_version}} (lúc nào, sản phẩm gì)
Kết quả khách nhận: {{past_result}} (không hiệu quả, slow...)
Improvement bạn có: {{improvements}} (mới hơn, better formula, support, guarantee...)

# TASK
1. Tạo empathy script (thừa nhận vấn đề khách gặp)
2. Xác định các lý do tại sao lần trước không hiệu quả
3. Explain cách bạn đã improve/evolve
4. Offer \"second chance\" dengan guarantee/refund
5. Tạo usage guide để khách dùng đúng cách lần này

# OUTPUT FORMAT
**Empathy Opening:**
\"Tôi nghe khách nói đã dùng lần trước nhưng không hiệu quả. Đó là thực sự khó chịu. Có được tôi hỏi chi tiết về trải nghiệm lần trước không?\"

**Why it didn't work:**
(Based on discovery questions)
- Khách dùng sai cách: [specific mistake]
- Hoặc chất lượng dùng lần trước: [issue]
- Hoặc expectation: [gap]

**What's different now:**
\"Từ lần trước đến giờ, chúng tôi:
- Improved [aspect] = result
- Added [feature] = benefit
- Offer [guarantee] = risk removal\"

**Second chance offer:**
\"Tôi muốn bạn thành công lần này. Nên tôi offer [30-day trial] + [money back] nếu không [specific result]. Fair?\"

**Usage guide to ensure success:**
- Do: ...
- Don't: ...
- Timeline: ...
- Support: [contact person/method]`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "redemption"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-27.jpg"
  },
  {
    id: "sale-28",
    title: "Xử lý: Không tin quảng cáo",
    description: "Thời đại AI, khách không tin quảng cáo. Dùng social proof, case study thực tế, demo live — biến nghi ngờ thành tin tưởng trong 1 cuộc trò chuyện.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "Khách nói \"không tin quảng cáo\" là smart buyer. Cách xử lý: dùng third-party proof, not bạn nói.",
    fullContent: `# ROLE
Bạn là chuyên gia Social Proof & Trust Building, dạy cách xử lý \"không tin quảng cáo\" bằng third-party evidence.

# CONTEXT
\"Không tin quảng cáo\" là smart objection. Bạn nói tốt thì khách biết là sales pitch.
Solution: Dùng third-party proof mà khách không thể argue:
- Customer testimonials (giọng khách, không bạn)
- Case study (tên, kết quả cụ thể)
- Demo/trial result (khách tự thấy)
- Award/certification (third-party validation)
- Media mention (không phải bạn nói)
- Social proof (\"X\" người đã mua, rated 4.9/5)

# INPUT
Sản phẩm/dịch vụ: {{product}}
Evidence bạn có: {{available_proof}} (testimonials, case studies, reviews...)
Khách concern: {{concern}} (quality, effectiveness, hype...)
Best proof format: {{proof_format}} (video, number, story, demo...)

# TASK
1. Tạo 6 phiên bản social proof (testimonial, case study, demo, award, review, result)
2. Mỗi proof phải cụ thể (tên, con số, date, detail)
3. Viết cách deliver mỗi proof (không bảo \"khách nói tốt\", mà show evidence)
4. Tạo \"trial/demo\" script (khách tự experience)
5. Viết handling script nếu khách vẫn skeptical

# OUTPUT FORMAT
**Social Proof #1 (Customer Testimonial):**
\"[Name], [Title] at [Company], said: '[Quote - specific result/benefit]'. [Result metric: X% improvement in Y time].\"
[Video link hoặc photo]

**Social Proof #2 (Case Study):**
Situation: [Company X] had [problem]
Action: Used [product]
Result: [specific metric] - [improvement]
Timeline: [X months to achieve]

**Social Proof #3 (Demo/Trial):**
\"Bạn có 7 ngày để dùng [product] và thấy kết quả. Hoàn toàn risk-free. Nếu không thấy [specific result], bạn đủ quyền refund.\"

[Repeat for proof 4-6]

**If still skeptical:**
\"Tôi hiểu nghi ngờ. Hãy xem như vậy: bạn không cần tin tôi, chỉ cần thử. Kết quả sẽ nói - không cần marketing.\"`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "social-proof"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-28.jpg"
  },
  {
    id: "sale-29",
    title: "Xử lý từ chối ngành Mỹ phẩm/Skincare",
    description: "Ngành BĐS: 'giá cao', 'vị trí xa', 'pháp lý chưa rõ' — 5 script xử lý từ chối chuyên biệt. Broker dùng prompt này tăng 25% tỷ lệ đặt cọc.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1250,
    sold: 3700,
    preview: "Skincare có objection riêng: \"da tôi sensitive\", \"đã dùng nhiều rồi\", \"muốn natural\". Mỗi cái cần script khác.",
    fullContent: `# ROLE
Bạn là chuyên gia Sales cho ngành Mỹ phẩm/Skincare, viết script xử lý các objection phổ biến của ngành.

# CONTEXT
Skincare/mỹ phẩm có objection đặc thù:
1. \"Da tôi sensitive/bị tổn thương\" - sợ irritation
2. \"Đã dùng nhiều sản phẩm rồi, không hiệu quả\" - skeptical
3. \"Muốn dùng natural/organic\" - concern về hóa chất
4. \"Giá đắt cho skincare\" - value concern
5. \"Chỉ dùng [brand quen]\" - brand loyalty

Mỗi concern cần approach khác nhau.

# INPUT
Loại sản phẩm skincare: {{product_type}} (serum, cream, mask...)
Target customer: {{target}} (sensitive skin, acne-prone, aging...)
Brand positioning: {{positioning}} (luxury, natural, science-backed...)
Price point: {{price}}

# TASK
1. Tạo script xử lý từ chối #1: \"Da sensitive\" (reassurance + patch test offer)
2. Tạo script xử lý từ chối #2: \"Dùng nhiều rồi không hiệu quả\" (different approach + case story)
3. Tạo script xử lý từ chối #3: \"Muốn natural\" (explain science + natural claims)
4. Tạo script xử lý từ chối #4: \"Quá đắt\" (investment in skin + cost per use)
5. Tạo script xử lý từ chối #5: \"Tôi loyal với brand X\" (compare + trial offer)

# OUTPUT FORMAT
**Objection #1: \"Da tôi sensitive/bị tổn thương\"**
Concern: Sợ irritation, phá vỡ skin barrier
Response:
\"Tôi hiểu. Mỗi làn da là khác. Sản phẩm này được formulated cho sensitive skin vì [reason]. Hơn nữa, chúng tôi offer patch test 48h miễn phí. Nếu không thấy irritation, bạn sẽ ấn tượng.\"

[Repeat for objection 2-5]

**Pro tips cho ngành skincare:**
- Always offer patch test/trial
- Explain \"lag time\" (skin needs 4-6 weeks to show result)
- Use before/after photos (visual proof)
- Emphasize ingredient (what's inside)
- Build routine (suggest complementary products)`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "skincare-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-29.jpg"
  },
  {
    id: "sale-30",
    title: "Xử lý từ chối ngành Bất động sản",
    description: "Ngành khóa học: 'không có thời gian', 'sợ không hiệu quả' — 5 biến thể xử lý. Tỷ lệ đăng ký tăng 40% khi dùng script đúng tâm lý học viên.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "BĐS từ chối có 5 hạng mục: giá, vị trí, pháp lý, timing, financing. Biết xử lý từng cái = giỏi bán BĐS.",
    fullContent: `# ROLE
Bạn là chuyên gia Real Estate Sales, viết script xử lý objection của ngành bất động sản.

# CONTEXT
BĐS objection khác hàng hóa:
1. \"Giá cao quá so với khu vực\" - value comparison
2. \"Vị trí không lý tưởng\" - location concern
3. \"Pháp lý phức tạp/chưa clear\" - risk concern
4. \"Chưa có tiền cọc\" - financing issue
5. \"Chưa bán được cái cũ\" - logistics concern

Mỗi concern lớn, cần xử lý professional + documents.

# INPUT
Loại BĐS: {{property_type}} (residential, commercial, land...)
Giá: {{price}}
Vị trí: {{location}}
Khách concern: {{concern}}

# TASK
1. Script xử lý: \"Giá cao\" (justify bằng location, infrastructure, appreciation...)
2. Script xử lý: \"Vị trí\" (future development, commute time calculator...)
3. Script xử lý: \"Pháp lý\" (clear documentation, lawyer inspection...)
4. Script xử lý: \"Financing\" (loan program, payment plan...)
5. Script xử lý: \"Chuà bán cái cũ\" (temporary financing, bridge loan...)

# OUTPUT FORMAT
**Objection #1: \"Giá cao quá\"**
Response:
\"Tôi hiểu giá là factor quan trọng. Hãy xem như vậy - giá này là vì [3 reasons: location, infrastructure, future growth].
So sánh với property tương tự ở khu [X]: giá từ [Y đến Z]. Của chúng tôi là [competitive positioning].
Hơn nữa, property này appreciate [X%] mỗi năm. Chi phí thực = investment, không chỉ cost.\"

**Objection #2: \"Vị trí không lý tưởng\"**
Response:
\"Vị trí lý tưởng là subjective. Giả sử bạn lo [specific concern - near MRT, near school...].
[Property] có [advantage: future development, new road, upcoming mall...]. 
Hơn nữa, khoảng cách tới [destination] là chỉ [X] phút. Có acceptable không?\"

[Repeat for objections 3-5]

**Document checklist for BĐS:**
- Title deed
- Building permit
- Tax document
- Survey plan
- Environmental clearance`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "real-estate-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-30.jpg"
  },
  {
    id: "sale-31",
    title: "Xử lý từ chối ngành Khóa học/Giáo dục",
    description: "Bảo hiểm, tài chính — ngành khó bán nhất. 5 kịch bản xử lý từ chối chuyên biệt, từ 'không cần' đến 'sợ lừa đảo'. Agent dùng là thấy kết quả ngay.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1300,
    sold: 3800,
    preview: "Khóa học từ chối: \"quá bận\", \"học online hiệu quả sao\", \"có guarantee không\", \"học rồi apply được không\".",
    fullContent: `# ROLE
Bạn là chuyên gia Sales cho Online Course/EdTech, xử lý objection ngành giáo dục.

# CONTEXT
Khóa học/online education objection:
1. \"Quá bận, không có thời gian\" - time/schedule concern
2. \"Học online có hiệu quả không?\" - effectiveness doubt
3. \"Có guarantee không?\" - risk concern + ROI
4. \"Bao nhiêu người đã thành công?\" - social proof
5. \"Sau khi học xong áp dụng được không?\" - application concern

Education sales = need trust + proof + flexibility

# INPUT
Khóa học: {{course_type}} (skills, business, personal development...)
Duration: {{duration}} (hours, weeks)
Format: {{format}} (video, live, hybrid...)
Target: {{target_audience}}

# TASK
1. Script: \"Quá bận\" (flexible schedule, pace, lifetime access...)
2. Script: \"Online không hiệu quả\" (proof, testimonial, structure...)
3. Script: \"Không guarantee\" (money-back, completion bonus, job placement...)
4. Script: \"Không biết ai đã succeed\" (case study, alumni network, testimonial...)
5. Script: \"Sau học áp dụng thế nào\" (practical project, support, template...)

# OUTPUT FORMAT
**Objection #1: \"Quá bận, không có thời gian\"**
Response:
\"Tôi hiểu bạn bận. Đó là lý do [course] được design flexible:
- Mỗi module chỉ [X] phút (learn during commute, lunch break...)
- Lifetime access - học bất cứ khi nào
- Không deadline
- Bạn có thể learn theo pace của mình

Hầu hết students hoàn thành trong [X] tuần với [Y] giờ/tuần. Fair?\"

**Objection #2: \"Online có hiệu quả không?\"**
Response:
\"Câu hỏi tốt. Hiệu quả phụ thuộc vào 2 yếu tố:
1. Course structure (ours là [proof of structure])
2. Student commitment (kami provide [support: mentoring, community, accountability])

Thực tế: X% students report [measurable result] sau completion.\"

[Repeat for objections 3-5]

**Building trust in EdTech:**
- Show instructor credentials
- Provide preview/free module
- Share student results/metrics
- Offer refund guarantee
- Create alumni success stories`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "education-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-31.jpg"
  },
  {
    id: "sale-32",
    title: "Xử lý từ chối ngành Bảo hiểm/Tài chính",
    description: "F&B, thực phẩm chức năng — khách nghi ngờ chất lượng nhiều nhất. 5 biến thể xử lý từ chối giúp biến nghi ngờ thành đơn hàng đầu tiên.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1050,
    sold: 3150,
    preview: "Insurance/Finance từ chối: \"không hiểu\", \"lừa đảo\", \"quá phức tạp\", \"tại sao cần\", \"xin lại sau\".",
    fullContent: `# ROLE
Bạn là chuyên gia Finance/Insurance Sales, xử lý objection cho sản phẩm tài chính và bảo hiểm.

# CONTEXT
Finance/Insurance objection độc đáo:
1. \"Không hiểu\" - complexity concern, need simplification
2. \"Sợ lừa/scam\" - trust issue, need third-party validation
3. \"Quá phức tạp\" - information overload, need step-by-step
4. \"Tại sao cần?\" - lack of awareness about risk/need
5. \"Xin lại sau/tôi biết rồi\" - procrastination/fake interest

Finance sales = educate + build trust + remove complexity

# INPUT
Sản phẩm: {{product}} (insurance, investment, loan...)
Complexity level: {{complexity}}
Khách segment: {{customer_segment}}
Trust level: {{initial_trust}}

# TASK
1. Script: \"Không hiểu\" (explain simply, use analogy, provide summary doc...)
2. Script: \"Sợ scam\" (credential, regulator approval, third-party review...)
3. Script: \"Quá phức tạp\" (step-by-step, FAQ, comparison tool...)
4. Script: \"Tại sao cần\" (risk scenario, cost of not having, peace of mind...)
5. Script: \"Xin lại sau\" (urgency, benefit of early start, limited offer...)

# OUTPUT FORMAT
**Objection #1: \"Không hiểu\"**
Response:
\"Tôi sẽ explain đơn giản. Hãy xem như vậy:
[Analogy]: [Insurance/product] giống như [simple comparison]
[Benefit]: [Practical outcome in simple terms]
[Cost]: [Clear pricing/payment structure]

Nếu bạn vẫn có question, tôi sẽ send [summary document/infographic]. Fair?\"

**Objection #2: \"Sợ lừa/scam\"**
Response:
\"Đó là legitimate concern. Tôi hiểu skepticism.
[Company] được regulated bởi [agency], licensed để bán [product].
Bạn có thể verify ở [regulator website].
Hơn nữa, [product] được review bởi [third-party: media, rating site, expert...].
Xem [link/proof]? Giúp bạn feel confident?\"

[Repeat for objections 3-5]

**Finance sales best practices:**
- Simplify jargon
- Show credentials/licensing
- Provide written documentation
- Address risk clearly
- Emphasize benefit (not just feature)
- Create sense of urgency (early bird benefit, deadline...)`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "finance-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-32.jpg"
  },
  {
    id: "sale-33",
    title: "Xử lý từ chối ngành Thực phẩm/F&B",
    description: "SaaS/Công nghệ: 'phức tạp quá', 'đang dùng tool khác' — 5 script xử lý. Tỷ lệ trial-to-paid tăng 30% khi onboarding đúng kịch bản.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1200,
    sold: 3600,
    preview: "Food/F&B từ chối: \"không biết taste\", \"sợ bị lừa quality\", \"lịch sử brand\", \"áp dụng được không\".",
    fullContent: `# ROLE
Bạn là chuyên gia F&B/Food Sales, xử lý objection cho ngành thực phẩm và đồ ăn.

# CONTEXT
Food/F&B sales objection độc đáo:
1. \"Không biết taste/quality\" - experience gap, need trial
2. \"Sợ quality thấp/fake\" - authenticity concern
3. \"Brand/origin không rõ\" - trust on brand history
4. \"Giá cao so với thị trường\" - value perception
5. \"Đã quen dùng brand X\" - switching cost

Food sales = trial + trust + taste + habit formation

# INPUT
Sản phẩm thực phẩm: {{product}} (snack, supplement, specialty food...)
Origin/Brand: {{brand}}
Price positioning: {{price_positioning}} (premium, competitive...)
USP: {{unique_selling_point}}

# TASK
1. Script: \"Không biết taste\" (offer trial/sample, taste guarantee...)
2. Script: \"Quality concern\" (certification, origin story, quality control...)
3. Script: \"Brand/origin\" (brand story, award, media mention, expert endorsement...)
4. Script: \"Giá cao\" (ingredient quality, sourcing, health benefit...)
5. Script: \"Quen brand khác\" (comparison, gradual switching strategy...)

# OUTPUT FORMAT
**Objection #1: \"Không biết taste\"**
Response:
\"Tôi hiểu - taste adalah personal. Vì vậy kami offer [trial sample] miễn phí.
Nếu bạn không suka, money back, no question.
Tuy nhiên, [X%] customers who tried love it vì [taste profile].
Want to try? Zero risk.\"

**Objection #2: \"Quality concern\"**
Response:
\"Quality là top priority kami. [Product] là:
- [Certification: organic, non-GMO, halal...]
- Sourced từ [origin with history/story]
- [Quality control process: testing, traceability...]

Bạn có thể trace origin bằng [mechanism: QR code, serial number...].\"

[Repeat for objections 3-5]

**F&B sales tips:**
- Always offer sample/trial
- Tell origin/ingredient story
- Show certification
- Emphasize health benefit
- Build habit (regular delivery, subscription)`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "food-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-33.jpg"
  },
  {
    id: "sale-34",
    title: "Xử lý từ chối ngành Công nghệ/SaaS",
    description: "20 câu từ chối phổ biến nhất + script xử lý cho từng câu. Cheat sheet 'không bao giờ hết đạn' — in ra dán bàn, seller nào cũng cần.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "SaaS từ chối: \"learning curve cao\", \"integration phức tạp\", \"ROI mơ hồ\", \"support bad\", \"competitor better\".",
    fullContent: `# ROLE
Bạn là chuyên gia SaaS/Software Sales, xử lý objection của ngành công nghệ và phần mềm.

# CONTEXT
SaaS/Software objection:
1. \"Learning curve cao\" - implementation concern
2. \"Integration phức tạp\" - technical concern
3. \"ROI không rõ\" - business case doubt
4. \"Support/onboarding\" - service concern
5. \"Competitor tốt hơn\" - product comparison

SaaS sales = technical confidence + implementation support + clear ROI

# INPUT
Phần mềm/SaaS: {{product}} (CRM, analytics, project management...)
Target company size: {{company_size}}
Integration needs: {{integration}}
Competitor: {{competitor}}

# TASK
1. Script: \"Learning curve\" (training, onboarding support, user-friendly design...)
2. Script: \"Integration\" (API, pre-built integration, technical support...)
3. Script: \"ROI mơ hồ\" (ROI calculator, case study with metrics, trial period...)
4. Script: \"Support/onboarding\" (dedicated account manager, training, 24/7 support...)
5. Script: \"Competitor better\" (comparison matrix, unique feature, cost...)

# OUTPUT FORMAT
**Objection #1: \"Learning curve cao\"**
Response:
\"Tôi hiểu concern. Tuy nhiên:
- [Product] được design intuitive (90% users productive in [X] days)
- Kami provide [training: video, live session, documentation, webinar...]
- Dedicated onboarding specialist untuk [X] tuần
- Community/forum untuk peer support

Trial 14 hari dengan onboarding included. Berapakah confidence level?\"

**Objection #2: \"Integration phức tạp\"**
Response:
\"Technical integration adalah concern kami juga.
[Product] punya:
- Pre-built integration dengan [tools: Salesforce, Slack, Zapier...]
- [Percentage]% of integrations are 1-click setup
- API documentation lengkap
- Technical support team untuk custom integration

Khó mana yang baru, kami bantu. Agree?\"

[Repeat for objections 3-5]

**SaaS sales tips:**
- Provide ROI calculator
- Offer free trial (2-4 weeks)
- Show integration roadmap
- Dedicated onboarding support
- Create case study with metrics
- Emphasize unique features, not just price`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "saas-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-34.jpg"
  },
  {
    id: "sale-35",
    title: "Tổng hợp 20 câu từ chối phổ biến nhất & Script xử lý",
    description: "'Anh lấy màu xanh hay đỏ?' thay vì 'Anh có mua không?'. Kỹ thuật lựa chọn giả định chốt đơn trong vô thức — tỷ lệ chốt tăng 45%.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1600,
    sold: 4800,
    preview: "20 câu từ chối phổ biến nhất + script xử lý chuẩn. Một cheat sheet đầy đủ cho sales professional.",
    fullContent: `# ROLE
Bạn là tổng hợp toàn bộ sales objection handling, tạo cheat sheet 20 câu từ chối phổ biến nhất + script.

# CONTEXT
Sales gặp phải những objection lặp lại. Biết script chuẩn cho mỗi cái = close rate tăng 30%.
Tổng hợp này gồm:
- 20 câu từ chối phổ biến nhất
- Script response chuẩn cho mỗi câu
- Follow-up technique
- Khi nào dừng theo dõi

# INPUT
Industry/product: {{industry}}
Loại khách: {{customer_type}}
Giai đoạn sales: {{sales_stage}}

# TASK
1. Liệt kê 20 câu từ chối phổ biến nhất
2. Mỗi câu có: Script response, Follow-up timing, When to move on
3. Nhóm câu từ chối thành 5 category (price, timing, product fit, trust, logistics)
4. Tạo decision tree (when to persist vs give up)
5. Viết kỹ thuật \"advanced handling\" cho 5 câu khó nhất

# OUTPUT FORMAT
**CHEAT SHEET: 20 Câu Từ Chối + Script Xử Lý**

**CATEGORY 1: GIÁ (Price Objection)**
1. \"Giá cao quá\"
   Script: \"Tôi hiểu. Nhưng hãy xem như vậy: [reframe to value]\"
   Follow-up: Day 3, offer [discount/payment plan]
   Give up if: Khách vẫn không quan tâm sau 2 follow-up

2. \"Bên kia rẻ hơn\"
   Script: \"Tôi hiểu bạn xem giá. Nhưng [differentiation]: [unique value]\"
   Follow-up: Send comparison document
   Give up if: Khách chosen competitor

[Repeat pattern for câu 3-5 trong price category]

**CATEGORY 2: TIMING (Urgency Objection)**
6. \"Chưa cần ngay\"
   Script: \"Perfect, nghe tôi nói: [urgency reason]. Cost của waiting là [X].\"
   ...

[Repeat for 7-10]

**CATEGORY 3: PRODUCT FIT**
11. \"Sản phẩm không phù hợp\"
    Script: ...
[Repeat for 12-14]

**CATEGORY 4: TRUST**
15. \"Không tin quảng cáo\"
    Script: ...
[Repeat for 16-18]

**CATEGORY 5: LOGISTICS**
19. \"Chưa bán được cái cũ\"
    Script: ...
20. \"Phải hỏi người khác trước\"
    Script: ...

**Decision Tree:**
If khách [concern] -> Use [script] -> Follow-up [timing] -> If still no -> [move-on strategy]

**Hard objections (Advanced handling):**
1. Khi khách block bạn
2. Khi khách aggressive objection
3. Khi khách compare bạn với competitor
4. Khi khách nói \"already decided no\"
5. Khi khách ghosting sau commitment`,
    tags: ["xử-lý-từ-chối", "chốt-sale", "comprehensive-guide"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-35.jpg"
  },
  {
    id: "sale-36",
    title: "Chốt bằng Sự lựa chọn giả định",
    description: "'Chỉ còn 3 suất tặng kèm phụ kiện' — urgency thật, không fake. Kịch bản quà tặng giới hạn tạo FOMO chuẩn, khách chốt ngay vì sợ bỏ lỡ.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1500,
    sold: 4400,
    preview: "Không hỏi \"mua không\", mà hỏi \"mua cái nào\". Câu hỏi giả định khách sẽ mua, chỉ hỏi chi tiết.",
    fullContent: `# ROLE
Bạn là chuyên gia Assumptive Close & Sales Psychology, dạy kỹ thuật chốt bằng \"assumed decision\".

# CONTEXT
Assumptive close (giả định khách sẽ mua) là kỹ thuật tâm lý:
- Không hỏi \"mua không\" (yes/no question - easy to say no)
- Mà hỏi \"cái nào\" (choice between options - assume they buy)
- Khách biết inconsistent nếu nói \"không mua\" sau khi choose

Ví dụ:
- Bad: \"Bạn có muốn mua không?\"
- Good: \"Bạn lấy package Basic hay Premium?\"

Tâm lý: Khách unconsciously commit khi choose chi tiết.

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Options/variants: {{options}} (size, color, package, timing...)
Decision point: {{close_moment}}

# TASK
1. Xác định 5 điểm trong sales conversation để dùng Assumptive Close
2. Viết câu hỏi \"assumed decision\" cho mỗi điểm
3. Tạo list của choices (options để khách choose)
4. Viết follow-up khi khách chọn (confirm + next step)
5. Dạy cách handle khi khách catch the assumption (\"tôi chưa nói mua\")

# OUTPUT FORMAT
**Assumptive Close Point #1 (Early stage):**
Instead of: \"Bạn có quan tâm sản phẩm không?\"
Use: \"Bạn thích cái nào hơn, [option A] hay [option B]?\"
(Assumes khách quan tâm, chỉ hỏi preference)

**Assumptive Close Point #2 (Mid-sales):**
Instead of: \"Bạn muốn mua không?\"
Use: \"Bạn prefer payment [option 1], [option 2], hay [option 3]?\"
(Assumes purchase decision made, only ask payment method)

[Repeat cho points 3-5]

**Follow-up after choice:**
Khách chọn: \"Tôi thích [option]\"
Bạn: \"Tuyệt! Thì chúng ta [next action - setting appointment, confirming details...]\"

**If khách catch it:**
Khách: \"Tôi chưa nói mua, bạn sao giả định?\"
Bạn: \"You're right, sorry! Tôi chỉ muốn understand preference của bạn nếu bạn quyết định mua.\"`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "closing-technique"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-36.jpg"
  },
  {
    id: "sale-37",
    title: "Chốt bằng Quà tặng giới hạn",
    description: "'Chị Hương ở Quận 7 mới mua tuần trước, feedback thế này...' — social proof chốt đơn mạnh gấp 10 lần tự khen. Prompt tạo câu chuyện thành công thuyết phục.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1250,
    sold: 3700,
    preview: "\"Nếu mua trong 24h, bạn được thêm [bonus]. Chỉ còn X người nữa thôi.\" Bonus tạo urgency + perceived value.",
    fullContent: `# ROLE
Bạn là chuyên gia Limited-Time Bonus Closing, tạo urgency và perceived value qua quà tặng.

# CONTEXT
Limited-time bonus effective vì:
- Tạo FOMO (khách sợ miss out)
- Tăng perceived value (bonus là \"free\" nhưng valuable)
- Tạo deadline cụ thể (\"if you buy today\")
- Thực sự legitimate (stock limited, offer really expires)

Key: Bonus phải valuable lạ true scarcity (không fake).

# INPUT
Sản phẩm chính: {{main_product}}
Bonus idea: {{bonus_idea}} (complementary product, service, access...)
Real scarcity: {{scarcity}} (limited stock, limited time, limited slots...)
Urgency window: {{urgency_window}} (24h, 48h, 7 days...)

# TASK
1. Thiết kế 5 loại bonus phù hợp sản phẩm (tiered bonuses...)
2. Tính giá trị perceived vs cost (bonus phải feel valuable)
3. Viết copy \"bonus reveal\" (khi nào mention bonus)
4. Tạo limited-time hook (deadline cụ thể, scarcity proof)
5. Viết script chốt bằng bonus kết hợp với urgency

# OUTPUT FORMAT
**Bonus Tier #1 (Basic):**
Bonus: [Item/service]
Value to customer: [How it helps]
Real cost to you: [Your cost - keep margin]
Positioning: \"Free with purchase today\"

**Bonus Tier #2 (Mid):**
...

**Bonus Reveal Script:**
\"Khi bạn purchase dalam 24h, bạn được:
- [Main product]
- + [Bonus #1] (value X, free)
- + [Bonus #2] (value Y, free)
Total value: $[X+Y+price], bạn trả: $[price]
Profit: $[X+Y]\"

**Urgency Hook:**
\"Limited tới [X] slot thôi. Mỗi ngày mình có [Y] orders. Nếu bạn decide ngay, mình confirm trong 1 hour.\"

**Close script:**
\"So to confirm: bạn lấy [product] + [bonuses] ngay hôm nay? Mình ship ngay, bạn nhận [X] days.\"`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "bonus-offer"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-37.jpg"
  },
  {
    id: "sale-38",
    title: "Chốt bằng Social Proof (Câu chuyện thành công)",
    description: "'Dùng 30 ngày không hiệu quả, hoàn 100% tiền' — đảo ngược rủi ro. Khách hết lý do từ chối, tỷ lệ chốt tăng 60% khi bạn 'chịu rủi ro thay khách'.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1450,
    sold: 4200,
    preview: "\"100+ khách đã mua, rated 4.9/5. Anh sẽ là next success story.\" Social proof = transfer cả trust + confidence.",
    fullContent: `# ROLE
Bạn là chuyên gia Social Proof Selling, dùng testimonial, case study, review, statistics để chốt đơn.

# CONTEXT
Social proof hiệu quả vì:
- Third-party validation (không bạn nói tốt)
- FOMO/bandwagon effect (\"người khác mua, tại sao bạn không\")
- De-risk perception (\"nếu X người mua, chắc không lừa\")
- Credibility transfer (\"nếu khách giống bạn thành công, bạn cũng được\")

Best social proof: Similar customer scenario -> Success result

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Available social proof: {{proof_available}} (testimonial, review, case study, awards, stats...)
Khách segment: {{customer_segment}}
Best proof match: {{proof_match}} (khách tương tự)

# TASK
1. Tạo 5 social proof statements cụ thể (stat, testimonial, case study...)
2. Mỗi proof phải có: Source, Con số, Outcome, Timeline
3. Viết script \"social proof reveal\" (khi mention proof)
4. Tạo \"social proof close\" script (dùng proof để chốt)
5. Dạy cách match proof với khách concern (nếu lo giá, dùng ROI proof)

# OUTPUT FORMAT
**Social Proof #1 (Statistic):**
\"[X%] of customers achieved [result]. Average time to achieve: [Y] weeks. Satisfaction rate: [Z%].\"

**Social Proof #2 (Testimonial - Video/Quote):**
\"[Customer name] from [similar company] said: '[Quote about result]'. He achieved [metric] in [timeframe].\"

**Social Proof #3 (Case Study - Detailed):**
Situation: [Customer] had [problem]
Solution: Used [product]
Result: [specific metrics, timeframe, quote]
Cost-benefit: Invest $X, gained $Y

**Social Proof Close Script:**
\"Bạn khawatir [concern]. Bagus, banyak customer punya concern yang sama. Lihat lagi [social proof] - customer seperti kamu achieve [result].
Bapak percaya bisa achieve juga?\"

**Match proof dengan concern:**
- Concern about price -> Show ROI/cost-benefit proof
- Concern about effectiveness -> Show case study dengan metric
- Concern about trust -> Show large number (X thousand users)
- Concern about time -> Show timeline proof

**When to drop the proof:**
- Near decision point (last 2-3 min)
- When khách hesitant
- To overcome specific objection`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "social-proof"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-38.jpg"
  },
  {
    id: "sale-39",
    title: "Chốt Đảo ngược rủi ro",
    description: "'Chỉ còn 2 ngày' + đồng hồ đếm ngược = khách chốt gấp 3 lần. Kịch bản deadline & scarcity chuẩn — khan hiếm thật, không lừa, khách tin và mua.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1300,
    sold: 3800,
    preview: "\"Mua với 30-day money-back guarantee. Không hài lòng = hoàn tiền 100%, không câu hỏi.\" Risk reversal = remove buying hesitation.",
    fullContent: `# ROLE
Bạn là chuyên gia Risk Reversal, xóa bỏ risk buying từ khách bằng guarantee, warranty, trial period.

# CONTEXT
Risk Reversal principle:
- Transfer risk từ khách thành you
- Khách think: \"Okay, nếu không work, tôi lấy tiền lại. Zero risk.\"
- Psychology: Khách tự convince vì risk removed
- Implementation: Phải légit guarantee, thực sự honor nó

Risk reversal có thể là:
- Money-back guarantee (30/60/90 days)
- Satisfaction guarantee (specific outcome)
- Trial period (free usage)
- Performance guarantee (specific result or refund)
- Partial payment (pay first milestone, rest later)

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Khách biggest fear: {{customer_fear}}
What you can guarantee: {{guarantee_option}}
Timeline: {{timeline}}

# TASK
1. Thiết kế risk reversal strategy cho sản phẩm
2. Tạo 5 loại guarantee (money-back, satisfaction, performance, trial, partial payment)
3. Viết terms cụ thể (duration, condition, process)
4. Viết script \"reveal guarantee\" (khi mention guarantee)
5. Tạo closing script dùng guarantee (remove last hesitation)

# OUTPUT FORMAT
**Risk Reversal Option #1: 30-Day Money-Back**
Guarantee: \"Nếu dalam 30 hari bạn tidak satisfied, kami refund 100%, no question.\"
Process: [Simple refund process - 1 email = auto refund]
Timeline: [Refund within X days]
Conditions: [Minimal condition - product used/unused]

**Risk Reversal Option #2: Satisfaction Guarantee**
Guarantee: \"Nếu bạn tidak achieve [specific result] dalam [timeframe], kami refund.\"
Proof: [How do we measure result - metric, test, feedback]
Condition: [Customer did their part - followed steps, attended training...]

[Repeat for options 3-5: Performance guarantee, Trial, Partial payment]

**Reveal Script:**
\"Khawatir rugi? Kami offer [guarantee]. Jika dalam [X] days bapak tidak see [result], kami [refund/action].
Ini remove semua risk dari bapak. Fair?\"

**Close with guarantee:**
\"So here's deal: beli sekarang, 30 hari full satisfaction guarantee. Kalaupun tidak work, bapak dapat uang balik.
Bapak siap?\"

**Pro tip:** Mention guarantee EARLY (overcome objection), not just at close.
Guarantee terbaik = specify outcome (not just \"satisfaction\")`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "risk-reversal"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-39.jpg"
  },
  {
    id: "sale-40",
    title: "Chốt Upsell - Bán thêm combo tiết kiệm",
    description: "Khen → Đề xuất → Khen. Kỹ thuật sandwich dẫn dắt khách đồng ý mà không biết đang bị 'chốt'. Tâm lý học ứng dụng trong bán hàng — hiệu quả 100%.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "Khách sẽ mua Basic package. Khi họ committed, mình present Premium combo được lợi hơn. Upsell = increase AOV.",
    fullContent: `# ROLE
Bạn là chuyên gia Upsell & Cross-sell, tăng Average Order Value bằng cách suggest combo, upgrade, bundle.

# CONTEXT
Upsell effective khi:
- Khách đã commit mua (sẽ mua kế tiếp easier)
- Upgrade là logical next step (not random)
- Bundle save money for customer (they get value)
- Timing là ngay sau khách choose base product
- Framing là \"better value\", not \"more expensive\"

Upsell psychology:
- Khách compare với base price (perceive discount)
- Upgrading feel like getting more value same/slightly higher price
- Bundle feel smarter choice

# INPUT
Base product/package: {{base_product}}
Upsell options: {{upsell_options}} (combo, bundle, upgrade, add-on...)
Value difference: {{value_diff}}
Sweet spot price: {{sweet_spot_price}}

# TASK
1. Thiết kế 3 upsell level (Good/Better/Best packaging)
2. Mỗi level có: Product, Price, Value add, Save amount
3. Viết script \"upsell reveal\" (khi suggest upgrade)
4. Tạo comparison chart (Base vs Upsell - visual proof of value)
5. Viết close script (confirm upsell choice)

# OUTPUT FORMAT
**Good Package (Base):**
Include: [List items]
Price: $X
Value: $[perceived value]

**Better Package (Upsell #1):**
Include: [Base items] + [Added value #1] + [Added value #2]
Price: $Y (only $[Y-X] more)
Value: $[perceived value]
Save: Customers save $[Z] vs buying separately

**Best Package (Upsell #2):**
Include: [All above] + [Premium item]
Price: $Z
Value: $[maximum perceived value]
Save: Customers save $[biggest saving]

**Upsell Reveal Script:**
\"Sekarang sebelum confirm, mau share satu option lagi.
Banyak customers upgrade ke [Better Package] karena dapat [benefit] cuma untuk $[Y].
Dibanding beli terpisah $[more], ini lebih cost-effective.
Want to see comparison?\"

**Comparison Visual:**
| Item | Base | Better | Best |
|------|------|--------|------|
| Feature A | Yes | Yes | Yes |
| Feature B | No | Yes | Yes |
| Feature C | No | No | Yes |
| Price | $X | $Y | $Z |
| Savings vs separate | - | $A | $B |

**Close Upsell:**
\"Bagus? Jadi kami confirm [Better Package] untuk bapak. Ship dalam [timeframe], okay?\"`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "upsell"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-40.jpg"
  },
  {
    id: "sale-41",
    title: "Chốt bằng Deadline & Scarcity",
    description: "Zalo/Messenger là chiến trường chốt đơn. Kịch bản chat A-Z: từ chào hỏi, tư vấn, xử lý từ chối đến chốt tiền — seller online nào cũng phải có.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1250,
    sold: 3700,
    preview: "\"Còn 3 slot thôi\", \"offer hết sau hôm nay\", \"giá tăng thứ Hai\" - scarcity tạo urgency thực sự.",
    fullContent: `# ROLE
Bạn là chuyên gia Scarcity & Deadline Selling, tạo urgency thực sự (không fake) để chốt đơn.

# CONTEXT
Scarcity/Deadline hiệu quả khi THỰC SỰ CÓ (không fake):
- Limited stock (thực sự có số lượng hạn)
- Limited slots (appointments, service hours)
- Limited time (offer expires at date/time)
- Price increase scheduled (price really go up)
- Seasonal (limited season)

Fake scarcity = destroy trust. Always be truthful.

# INPUT
Thực scarcity của bạn: {{real_scarcity}}
Timeline: {{timeline}}
Current status: {{current_status}} (X units left, Y slots remaining...)
Next phase: {{next_phase}} (price increase, waitlist, sold out...)

# TASK
1. Identify real scarcity dalam business bạn
2. Create scarcity messaging cụ thể (số lượng, timing, consequence)
3. Tạo countdown visual (progressbar, number, timer)
4. Viết script reveal scarcity (early vs late in conversation)
5. Create urgency close script (last push untuk decide ngay)

# OUTPUT FORMAT
**Real Scarcity #1: Limited Stock**
Fact: \"Mỗi bulan bisa produce [X] units.\"
Current: \"Sudah sold [Y] units, tinggal [Z] units.\"
Projection: \"Dengan demand sekarang, akan sold out dalam [timeframe].\"
Message: \"[Z] units left. Typical customer butuh [X] hari untuk decide. Bapak siap decide sekarang?\"

**Real Scarcity #2: Limited Slots**
Fact: \"Bisa accept [X] new clients/month due to [reason: capacity, my time, quality...].\"
Current: \"Tinggal [Y] slots available.\"
Message: \"Slot terbatas. Jika tidak ambil sekarang, berikutnya [next available date/month].\"

**Real Scarcity #3: Price Increase**
Fact: \"Harga naik [amount/percentage] mulai [date] karena [reason: cost increase, demand...].\"
Current price deadline: \"Harga sekarang $X, hanya berlaku sampai [date].\"
Message: \"Invest sekarang dan save [savings amount]. Setelah itu harga $Y. Bapak decide sekarang atau tunggu bayar lebih?\"

**Scarcity Countdown Visual:**
- \"Tinggal 3 slots\" (number clear)
- Progress bar (visual depletion)
- Timer (deadline countdown)
- Sold out notice (create FOMO)

**Reveal Scarcity Timing:**
- EARLY: Set context (\"ada limited slots\")
- OBJECTION HANDLING: Use scarcity to overcome hesitation
- CLOSE: Last push (\"jangan tunggu, daftar sekarang\")

**Urgency Close Script:**
\"Jadi timing-wise: offer ini berakhir [date/time]. Slot tinggal [number]. Bapak mau secure slot sekarang atau tunggu next batch [next date]?\"

**IMPORTANT: Never fake scarcity.**
If you say \"limited\" but have unlimited = destroy trust.
Better: No scarcity than fake scarcity.`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "scarcity"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-41.jpg"
  },
  {
    id: "sale-42",
    title: "Chốt bằng kỹ thuật Sandwich (Khen-Đề xuất-Khen)",
    description: "Live mà không biết chốt = show giải trí miễn phí. Script đếm ngược, flash sale, pin comment — biến người xem thành người mua, doanh thu live x3.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1400,
    sold: 4100,
    preview: "\"Bạn là người smart [khen], nên bạn biết điều này [ý kiến], cách làm tốt nhất là [close] [khen]\".",
    fullContent: `# ROLE
Bạn là chuyên gia Psychology-Based Closing, dạy kỹ thuật Sandwich (Praise-Suggestion-Praise) để dẫn dắt quyết định.

# CONTEXT
Sandwich technique (Khen-Đề xuất-Khen) hiệu quả vì:
- Khen đầu: Tạo positive emotional state, khách feel understood
- Đề xuất ở giữa: Insert suggestion/ask lúc khách receptive
- Khen cuối: Reinforce positive feeling, eliminate resistance

Ví dụ:
\"Bạn là người business-minded [khen] nên bạn tự biết ROI đó quan trọng [đề xuất], cách bạn approach problem đó adalah smart [khen].\"

Khách feel: Acknowledged + Persuaded + Positive

# INPUT
Khách profile: {{customer_profile}} (smart, ambitious, careful, analytical...)
Suggestion/ask: {{suggestion}} (mua, upsell, decide sekarang...)
Khách concern: {{concern}}

# TASK
1. Identify 3 qualities của khách để khen
2. Craft khen authentic (not fake flattery)
3. Insert suggestion logically
4. Craft khen closing yang reinforce decision
5. Viết 3 full conversation dùng sandwich technique

# OUTPUT FORMAT
**Khen #1 (Opening):**
Authentic praise based on khách behavior/statement
\"Tôi notice bapak [quality] - [specific example]. Itu positive trait.\"

**Đề xuất (Middle):**
Insert suggestion naturally setelah khen
\"Karena itu, orang seperti bapak biasanya [do action]. Bapak pikir gimana?\"

**Khen #2 (Closing):**
Reinforce decision dengan khen lagi
\"Keputusan itu itself show [quality]. Bapak tahu apa yang bagus buat bisnis bapak.\"

**Full Sandwich Example #1 (For analytical customer):**
Opening: \"Bapak clearly analytic person - cara bapak ask question itu detailed. I respect itu.\"
Suggestion: \"Orang analytical seperti bapak tahu bahwa ROI [product] adalah [metric]. Sudah cukup jelas kan? Jadi mau proceed?\"
Closing: \"Keputusan analytical bapak ini good one - banyak competitor analyze lebih lama tapi tidak execute. Bapak execute - itu yang membeda.\"

**Full Sandwich Example #2 (For action-oriented customer):**
Opening: \"Bapak adalah action-taker - I see how fast bapak move. Itu kenapa bapak success.\"
Suggestion: \"Action-taker seperti bapak tahu momentum ini penting. Jadi sekarang timing bagus untuk [action]. Setuju?\"
Closing: \"Bagus - keputusan quick bapak itu exactly mindset yang bikin business grow. Bapak sudah on the right track.\"

**Timing of Sandwich:**
- Use EARLY to set positive tone
- Use MID to handle objection
- Use LATE to close deal

**Mistakes to avoid:**
- Khen harus authentic (not excessive)
- Suggestion harus logical (follow dari khen)
- Khen akhir harus reinforce decision (not guilt)`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "psychology-close"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-42.jpg"
  },
  {
    id: "sale-43",
    title: "Chốt đơn qua Zalo/Messenger",
    description: "Khách vừa mua xong = lúc dễ bán nhất. Script cross-sell sản phẩm liên quan ngay sau thanh toán — tăng 25% giá trị đơn hàng mà khách thấy đang được 'tư vấn'.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1200,
    sold: 3600,
    preview: "Chat chốt đơn khác call/face-to-face. Phải viết short, clear, visual, và có CTA rõ.",
    fullContent: `# ROLE
Bạn là chuyên gia Chat Sales (Zalo, Messenger, WhatsApp), viết kịch bản chốt đơn hoàn chỉnh qua text.

# CONTEXT
Chat sales khác cuộc gọi:
- Không có tone voice, phải rely trên word choice
- Khách đọc nhanh, phải short + scannable
- Phải visual (emoji, line break, formatting)
- Khách có time think (they can take time to respond vs call)
- Multi-threading (conversation có thể span multiple days)

Chat effective khi:
- Concise (mỗi message max 2-3 sentences)
- Visual (dùng emoji, line breaks, bullet points)
- Clear CTA (apa next step?)
- Responsive (reply fast, show presence)
- Documented (track conversation, confirm via text)

# INPUT
Sản phẩm/Dịch vụ: {{product}}
Khách profile: {{customer_profile}}
Sales stage: {{sales_stage}} (introduction, interest, consideration, close...)
Khách concern/status: {{current_status}}

# TASK
1. Viết chat conversation hoàn chỉnh từ first message đến close
2. Mỗi message short, clear, CTA
3. Tạo visual formatting (emoji, bullet, line break)
4. Handle 3 objection dalam chat
5. Viết closing sequence + confirmation

# OUTPUT FORMAT
**Chat Flow: From Introduction to Close**

**Day 1 - Opening (5-10 min after khách contact):**
\"👋 Hi [name]!
Trima kasih contact kami.
Kami jual [product] yang [main benefit].
Bapak tertarik sama [specific aspect] tidak?\"

[Waiting for response]

**Day 1 - If interested response:**
\"Bagus! Jadi [product] ini:
✅ [Benefit 1]
✅ [Benefit 2]
✅ [Benefit 3]

Cocok untuk [ideal customer].
Bapak cocok gak?\"

**Day 1-2 - Information phase:**
\"Mau lihat:
📸 Photos? | 🎬 Video? | 📄 Details?
[Link/attachments]\"

**Day 2-3 - Handling objection in chat:**
Objection: \"Giá mahal\"
Response: \"Saya mengerti. Tapi hitung-hitung per hari = $[X] doang. ROI bapak dapat dalam [timeframe].
Dengan guarantee [guarantee], zero risk. 👍\"

[Repeat for 2 more objections]

**Day 3-5 - Closing sequence:**
Message 1 (Interest check):
\"Nah jadi, bapak ready order gak? 🤔\"

If \"Yes\":
\"Syukur! Jadi step selanjutnya:
1️⃣ Confirm details (nama, alamat, phone)
2️⃣ Pilih payment method
3️⃣ Kami ship

Ready?\"

If \"Maybe/Need time\":
\"Gak apa. Butuh pertanyaan apa yang dijawab? Yang paling important buat bapak apa?\"

If \"No\":
\"Okay, understand. Kalau lain kali ada pertanyaan, reach out ya. Semoga ketemu lagi! 👋\"

**Confirmation (After \"Yes\"):**
\"✅ Confirmed!
📦 Order: [Product]
💵 Total: $[Amount]
🚚 Ship: [Date]
📞 Tracking: Will send link

Terimakasih! 🙏\"`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "chat-sales"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-43.jpg"
  },
  {
    id: "sale-44",
    title: "Kịch bản chốt đơn Livestream",
    description: "Ngày thứ 3 sau nhận hàng — thời điểm vàng tạo khách trung thành. Tin nhắn hỏi thăm thông minh + hướng dẫn sử dụng = giảm 50% tỷ lệ hoàn hàng.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1450,
    sold: 4200,
    preview: "Livestream chốt đơn khác bài post. Phải interactive, real-time, urgency, pin comment link, countdown timer.",
    fullContent: `# ROLE
Bạn là chuyên gia Livestream Closing, viết script chốt đơn khi live stream - dùng countdown, flash sale, interaction.

# CONTEXT
Livestream closing advantage:
- Real-time interaction (khách see others buying = FOMO)
- Visual urgency (countdown timer visible)
- Flash sale possible (temporary discount for live viewers)
- Chat engagement (questions, comments create sense of community)
- Pin important info (link, offer, deadline)

Livestream closing technique:
- Countdown timer (visible, creates urgency)
- Flash sale (only during live)
- Social proof (mention orders coming in real-time)
- Interactive CTA (\"comment BUY\", \"click link\", \"DM for order\")
- Limited supply (\"only 10 left\", \"closing in 5 min\")

# INPUT
Sản phẩm/Offer: {{product}}
Flash sale discount: {{discount}} (X% off or $X off)
Duration of stream: {{stream_duration}}
Closing timing: {{closing_time}} (when in stream to close)

# TASK
1. Viết opening (5 min): Hook + problem statement + preview offer
2. Viết demo/content (15 min): Product showcase + benefit + social proof
3. Viết offer reveal (5 min): Announce flash sale, flash special price
4. Viết countdown + final push (5 min): Timer, urgency, order confirmation
5. Tạo visual + pin strategy (countdown graphic, link in comment)

# OUTPUT FORMAT
**Livestream Structure - 30 min**

**0:00-5:00 (Hook & Opening):**
\"Hey everyone! 👋 Welcome!
Today only [product] ON SALE 🔥
Save $[amount] if you buy dalam live ini.
[Product] solve [problem] in [X] days.
Siapa yang interested? Comment 'IN' dong! 👇\"

[Interact: Read comments, mention names]

**5:00-20:00 (Demo/Content):**
\"Jadi [product] ini:
📸 [Show product/feature]
✅ [Benefit 1 - explain]
✅ [Benefit 2 - explain]
✅ [Benefit 3 - explain]

Customer story:
[Name] dari [place] pakai [product], dapat [result] dalam [timeframe].
Sekarang bisnis [he/she] grow [metric].\"

[Interact: Answer questions, show engagement]

**20:00-25:00 (Offer Reveal):**
\"Okay, time-sensitive offer 🎯
Normal price: $[X]
LIVE ONLY price: $[X - discount]
SAVE: $[discount]

This is 🔥 deal. Limited para [number] people doang.
Link: [PIN THIS COMMENT dengan link]

Comment 'BOUGHT' kalau sudah order! 👇\"

**25:00-30:00 (Countdown + Final Push):**
[Show countdown timer: 5:00 remaining]
\"Okay final 5 minutes!
⏰ Countdown starts NOW
🔗 Link di comment paling atas
🎁 [Bonus if they buy now]
💵 Price back to normal in [X] minutes

Siapa mau grab ini? Order sekarang!
Kami kembali [next stream date] tapi harga normal.\"

[Last minute: \"4 minutes!\", \"3 minutes!\" etc.]

**29:30 (Final Close):**
\"LAST 30 SECONDS 🚨
[Read names of who bought]
[Wow, X orders! Tinggal [number] left!]
🔗 LINK STILL OPEN
ORDER NOW!

[10, 9, 8... countdown]\"

**30:00 (End):**
\"SOLD OUT! 🎉
Thank you! Next stream [date/time]
See you!\"

**PIN STRATEGY:**
- Pin link comment immediately when reveal offer
- Update pin: \"Tinggal [X] slot\"
- Final pin: \"LAST 5 MINUTES\"

**Interactive prompts:**
- \"Comment 'IN' if interested\"
- \"Who want [product]? Comment name!\"
- \"First 3 comments get [bonus]\"
- \"Share this live - tag [number] friends\"

**Social proof in real-time:**
\"Okay [name] just bought! That's [number] orders in 5 minutes!\"
\"Guys, overwhelming response! Limited lang talaga!\"`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "livestream-closing"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-44.jpg"
  },
  {
    id: "sale-45",
    title: "Chốt Cross-sell sau khi khách đã mua",
    description: "Review 5 sao là vũ khí bán hàng miễn phí mạnh nhất. Kịch bản xin feedback tinh tế — khách vui vẻ đánh giá, không ai thấy bị ép. Social proof tăng mỗi ngày.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "Khách vừa mua product A. Ngay lúc đó, offer product B/C liên quan. Conversion rate highest at moment of purchase.",
    fullContent: `# ROLE
Bạn là chuyên gia Post-Purchase Cross-sell, tạo one-click offer ngay sau khách thanh toán.

# CONTEXT
Post-purchase cross-sell effective vì:
- Khách \"in buying mode\" (already committed, mind open)
- Momentum (excited about purchase)
- One-click offer (frictionless, easy)
- Complementary product (natural fit)
- Limited time offer (creates urgency)

Timing: Immediate, within 1 min after payment

Psychology:
- Khách already \"buy\", adding more feel easier than first buy
- Related product feel like \"need to complete the solution\"
- Last chance offer create urgency

# INPUT
Produk utama yang dibeli: {{main_product}}
Cross-sell option: {{crosssell_products}} (2-3 complementary items)
Bundling strategy: {{bundling}}
Offer window: {{offer_window}} (how long offer available)

# TASK
1. Identify 3 cross-sell products yang complement main product
2. Tata ranking berdasarkan relevance + margin
3. Terbuat 2-tier offer (good/better dengan bundling)
4. Create one-click checkout link
5. Viết post-purchase offer copy + email sequence

# OUTPUT FORMAT
**Cross-sell Ranking:**

Product #1 (Top relevance): [Product name]
- Why cross-sell: [complement reason]
- Typical customer pairing: [who buy both]
- Profit margin: [X%]

Product #2 (Second): ...
Product #3 (Third): ...

**Cross-sell Offer Tiers:**

**Tier 1: Single Add-on**
Offer: [Product] untuk $[discounted price] (usual $[normal price])
How it complements: \"[Main product] + [Cross-sell product] = [complete solution]\"
Button: \"ADD TO ORDER - $[price]\"

**Tier 2: Bundle**
Offer: [Main product] + [Cross-sell 1] + [Cross-sell 2] untuk $[bundle price]
Save: $[savings vs buying separately]
Button: \"BUNDLE & SAVE - $[price]\"

**Post-Purchase Offer Sequence:**

**Step 1: Thank you page (Immediate)**
\"✅ Order confirmed!
Incoming: [Main product]

Wait! 👇 Complete your solution:
[Cross-sell product] - $[price]
ADD NOW (one-click) ➡️ [button]

Or get BUNDLE - [Cross-sell 1] + [Cross-sell 2]
SAVE $[amount] ➡️ [button]\"

**Step 2: Email #1 (5 min after purchase)**
Subject: \"[name], tunggu! Offer khusus untuk Anda...\"
Body: \"Senang beli [main product]!
Banyak customer juga beli [cross-sell] bersamanya karena [reason].
Khusus untuk Anda, kami diskon [cross-sell] jadi $[price] (usually $[normal]).
Offers ends in [X] hours.
[Link to add-on]\"

**Step 3: Email #2 (Day 1)**
Subject: \"Last chance: [X] off [cross-sell] for [name]\"
Body: \"[name], offer kami close in [X] hours.
[Cross-sell] pairs perfectly dengan [main product] Anda karena [specific benefit].
[LINK]\"

**Step 4: Email #3 (Day 2)**
Subject: \"[name], offer expired - but here's bonus\"
Body: \"[Cross-sell] offer sudah expired.
Tapi karena Anda valuable customer, kami give [bonus/discount] untuk purchase berikutnya.
[LINK]\"

**One-Click Best Practices:**
- Same payment method as main order
- Automatic shipment bundling (save on shipping)
- Easy return (if regret buying)
- Clear that it's additional charge (not hidden)

**Metrics to track:**
- Cross-sell conversion rate
- AOV (Average Order Value) increase
- Bundle vs single product performance
- Email open rate vs purchase rate`,
    tags: ["chốt-đơn", "kỹ-thuật-chốt", "cross-sell"],
    difficulty: "Nâng cao",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-45.jpg"
  },
  {
    id: "sale-46",
    title: "Chăm sóc sau 3 ngày nhận hàng",
    description: "Chi phí giữ khách cũ rẻ gấp 5 lần tìm khách mới. Mẫu tin nhắn re-purchase đúng lúc sản phẩm sắp hết — tỷ lệ mua lại tăng 45% mà không cần giảm giá.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.8,
    reviewCount: 1250,
    sold: 3700,
    preview: "Khách mua rồi, không phải lúc quên. Follow-up sau 3 ngày = tạo satisfaction + opportunity cho upsell.",
    fullContent: `# ROLE
Bạn là chuyên gia Post-Purchase Customer Care, viết kịch bản follow-up sau 3 ngày nhận hàng.

# CONTEXT
Follow-up sau 3 ngày quan trọng vì:
- Khách vừa nhận hàng, unboxing experience fresh
- Cơ hội hỏi thăm satisfaction (flag issue early)
- Guide usage (ensure they get full value)
- Build relationship (bukan quên sau mua)
- Opportunity: Ask for review, upsell related product

Psychology: Khách feel cared for, not just transactional

# INPUT
Sản phẩm đã bán: {{product}}
Khách segment: {{customer_segment}}
Typical usage: {{typical_usage}}
Related products: {{related_products}}

# TASK
1. Viết 3-day follow-up message (care + satisfaction check)
2. Terbuat usage guide/tips untuk maximize value
3. Viết troubleshooting untuk common issues
4. Request feedback/review (soft ask, not pushy)
5. Teaser untuk related product (subtle upsell)

# OUTPUT FORMAT
**3-Day Follow-up Message:**

Timing: Exactly 72 hours after delivery confirmation

Message:
\"Hi [name]! 👋
Hope you love [product]! 📦

Wanted to check: Everything okay? Any questions?

Quick tips to maximize:
✅ [Tip 1 - specific usage]
✅ [Tip 2 - best practice]
✅ [Tip 3 - pro move]

Video guide: [link] (3 min)

Reply atau DM kalau ada pertanyaan! 💬\"

**Follow-up - Satisfaction Check:**

If khách not respond:
\"Hi [name]! Tidak melihat response. Beneran okay?
[Product] work smooth?
Just want make sure setup correct. Reply ya! 👍\"

**Troubleshooting Script:**

Common issue #1: [Issue]
Solution: \"Kalau [symptom], try [solution]. Biasanya balik normal.\"

Common issue #2: [Issue]
Solution: \"Jika [symptom], bisa [troubleshoot step].\"

**Review Request (Soft):**

\"If happy with [product], mau share pengalaman? 🤔
Rating/review Anda helps other customers.
Sama-sama: [link to review]
Thank you! 🙏\"

**Related Product Teaser:**

\"By the way, banyak customers juga upgrade dengan [related product].
Make [main product] even better dengan [feature].
If interested, kami give [discount] para Anda.
[Link]\"

**Follow-up Sequence:**

Day 3: Check satisfaction + usage tips
Day 7: If no review, ask for feedback
Day 14: Ask for testimonial/case study
Day 30: Time for next purchase? Teaser untuk related product`,
    tags: ["chăm-sóc", "re-marketing", "customer-care"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-46.jpg"
  },
  {
    id: "sale-47",
    title: "Xin Feedback & Đánh giá 5 sao tinh tế",
    description: "Khách phàn nàn = cơ hội tạo fan trung thành. Kịch bản xử lý khiếu nại 4 bước — 80% khách hài lòng hơn SAU khi khiếu nại được giải quyết đúng cách.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.9,
    reviewCount: 1450,
    sold: 4200,
    preview: "Xin review sai cách = khách khó chịu hoặc ignore. Xin đúng cách = khách vui vẻ đánh giá 5 sao.",
    fullContent: `# ROLE
Bạn là chuyên gia Review & Feedback Solicitation, dạy cách xin review tinh tế không lố, khách happy đánh giá.

# CONTEXT
Xin review hiệu quả khi:
- Timing đúng (khi khách satisfied, excited)
- Approach right (respect time, make it easy, not transactional)
- Incentive right (optional, small value, not bribery)
- Channel right (where khách comfortable)
- Framing right (genuine ask, not desperate)

Psychology: Khách want to help nếu merasa valued, tidak forced

# INPUT
Sản phẩm: {{product}}
Platform review: {{platform}} (Shopee, Google, Facebook, custom site...)
Ideal review: {{ideal_review}} (what you want them mention)
Incentive: {{incentive}} (discount code, entry to draw, thank you gift...)

# TASK
1. Identify best timing untuk ask review (day 7, day 30, after first result...)
2. Viết 3 approach berbeda (email, SMS, post-purchase pop-up, follow-up message)
3. Create easy-to-follow link/instruction
4. Terbuat incentive yang tepat (optional, ethical, aligned)
5. Viết follow-up jika not reviewed

# OUTPUT FORMAT
**Best Timing untuk Ask Review:**

Scenario A: Fast-consumption product (1-3 days)
→ Ask on Day 3-5 (already experienced value)

Scenario B: Slow-reveal product (2-4 weeks)
→ Ask on Day 21 (seen results)

Scenario C: Service with follow-up
→ Ask after completion (everything resolved)

**Approach #1: Email (Professional)**

Subject: \"[name], your feedback matters 💬\"

Body:
\"Hi [name],

Terima kasih order [product] dari kami!

Kami care banget tentang experience Anda.
Bisa share pendapat? 5 min review help kami improve.

⭐⭐⭐⭐⭐ Review here: [direct link]

Plus, sebagai terima kasih: [small incentive - optional]
Discount code: [CODE] (next purchase)

Thank you! 🙏
[Your name]\"

**Approach #2: SMS/Message (Casual)**

\"Hi [name]! 👋
Love [product]? 💕
Quick review? ⭐️⭐️⭐️⭐️⭐️
[Link] (2 min)
+ get [incentive] [code]
Thanks! 🙏\"

**Approach #3: Post-purchase Pop-up**

\"Bagaimana experience?\"
Button 1: \"😍 Love it! Review →\" (go to review platform)
Button 2: \"😐 Okay, maybe later\" (remind tomorrow)
Button 3: \"😞 Not happy, help!\" (go to support)

**Incentive Strategy:**

Good incentive:
✅ Small value ($5-10 equivalent)
✅ Discount code (usable for next purchase)
✅ Entry to draw/raffle
✅ Small gift with next order
✅ \"Reviewer exclusive\" access

Bad incentive:
❌ Only give discount IF 5-star (bribing)
❌ Huge incentive (fake engagement)
❌ Free product (unethical inducement)
❌ Cash (looks desperate)

**What to ask them mention:**

Instead of: \"Just give 5-star\"
Ask: \"Tell others:
- What problem [product] solve?
- How it helped you?
- Would you recommend? Why?\"

This way review authentic, not generic.

**Follow-up jika not reviewed:**

Day 1 (Initial ask): [First message]
Day 7 (Gentle reminder): \"Hi [name], just checking - saw my review request?\"
Day 14 (Last ask): \"Last reminder - review help us tons!\"
Day 21+: (Stop asking)

**Email template for Last reminder:**

Subject: \"[name], one last thing...\"

Body:
\"Hi [name],

Kami notice belum review [product].
No pressure, tapi: review Anda super valuable buat kami.

Help kami improve? ⭐️
[Link]

If ada issue, reach out support: [link]

Thanks! 🙏\"

**Pro tips:**
- Make link 1-click (tidak perlu login multiple times)
- Show review template (make it easy untuk write)
- Thank publicly (\"Thanks [name] for 5-star!\")
- Address negative reviews fast (show you care)`,
    tags: ["chăm-sóc", "re-marketing", "feedback"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-47.jpg"
  },
  {
    id: "sale-48",
    title: "Mời khách cũ mua lại (Re-purchase)",
    description: "'Chúc mừng sinh nhật anh/chị, tặng riêng voucher 20%' — tỷ lệ mua từ tin nhắn sinh nhật cao gấp 3 lần tin nhắn thường. VIP cảm thấy được trân trọng.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.7,
    reviewCount: 1100,
    sold: 3250,
    preview: "Khách đã mua rồi. Khi sản phẩm sắp hết, mình nhắc nhở. Re-purchase rate cao hơn 10x new customer.",
    fullContent: `# ROLE
Bạn là chuyên gia Repeat Purchase & Customer Reactivation, viết kịch bản mời khách cũ mua lại.

# CONTEXT
Re-purchase strategy hiệu quả vì:
- Khách already know product/brand (lower friction)
- Repeat purchase easier (already familiar)
- Lifetime value higher (LTV multiplied)
- Cost lower (already have contact)

Timing: Calculate typical usage cycle → remind before they run out

Psychology: Khách appreciate reminder (not annoying, actually helpful)

# INPUT
Sản phẩm consumable: {{product}}
Typical usage duration: {{usage_duration}} (e.g., 30 days supply)
Khách purchase history: {{purchase_history}}
New version/variant: {{new_version}}

# TASK
1. Calculate optimal re-purchase timing
2. Viết reminder message (\"time to reorder\" angle)
3. Introduce upgrade/new version (subtle upsell)
4. Create subscription option (auto-reorder)
5. Special offer untuk repeat customers

# OUTPUT FORMAT
**Re-purchase Timing Calculation:**

Example:
- Product: Skincare cream (50g)
- Typical usage: 30 days
- Optimal reminder: Day 25-27 (before they run out)

Message frequency:
- Day 25: \"Supplies running low?\"
- Day 28: \"Time to reorder\"
- Day 35: \"Last chance before backorder\"

**Reminder Message #1 (Gentle):**

\"Hi [name]! 👋
Remember [product] you loved?

👉 Time for reorder! 
Usually run out around now.
[BUY NOW]

Quick checkout (remembered your preference) ✨\"

**Reminder Message #2 (With upgrade):**

\"Hi [name]! 👋
[Product] running low?

Good news: Kami launched [new version]!
✨ Better formula (X% improved)
✨ Better packaging (lasts 40 days vs 30)
✨ Same price

Want to try?
[UPGRADE] vs [SAME]\"

**Reminder Message #3 (Subscription offer):**

\"Hi [name]! 👋
Tired of remembering to reorder?

Try [product] subscription:
✅ Auto-ship setiap 30 days
✅ 10% discount vs buying single
✅ Cancel anytime
✅ Free shipping

Setup now: [LINK]\"

**Special offer untuk repeat customers:**

\"Loyalty thanks! 🙏
[Name], karena udah loyal customer:
🎁 15% off next order [CODE]
🎁 Free bonus [item]
🎁 VIP early access to new launch

Valid untuk [X] days\"

**Re-purchase Email Sequence:**

Day 25 (First reminder):
Subject: \"[name], time to restock?\"
Body: \"[product] usually run out now. Reorder? [LINK]\"

Day 28 (Second reminder):
Subject: \"Last day for [discount]!\"
Body: \"Flash discount ending today! Grab [product] [LINK]\"

Day 32 (Third reminder - if not purchased):
Subject: \"[name], something wrong with [product]?\"
Body: \"Haven't seen reorder. Issue? Or want try something else? Kami help! [CONTACT]\"

**Pro tips:**
- Make reorder one-click (same address, payment method)
- Create subscription (reduce churn, increase LTV)
- Offer loyalty program (points, exclusive access)
- Launch product improvement (\"version 2.0 better!\")
- Ask for feedback (\"which variant you prefer?\")`,
    tags: ["chăm-sóc", "re-marketing", "repeat-purchase"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-48.jpg"
  },
  {
    id: "sale-49",
    title: "Xử lý khiếu nại chuyên nghiệp (Complaint Handling)",
    description: "Khách giới thiệu khách = kênh bán hàng 0 đồng quảng cáo. Kịch bản referral program khiến khách tự nguyện giới thiệu bạn bè — mỗi khách VIP mang về 3 khách mới.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "claude",
    rating: 4.8,
    reviewCount: 1300,
    sold: 3800,
    preview: "Khách phàn nàn = cơ hội. Xử lý đúng cách = convert thành brand advocate, xử lý sai = lose forever.",
    fullContent: `# ROLE
Bạn là chuyên gia Complaint Handling & Customer Recovery, xử lý khiếu nại chuyên nghiệp để convert khách phàn nàn thành loyal.

# CONTEXT
Complaint handling psychology:
- Khách complain = still care (worse = they leave silently)
- They want to be heard (not dismissed)
- They want solution (not excuse)
- They want to feel valued (compensation if fair)

Result of good handling:
- 70% của complaining khách mau continue relationship
- They become advocate (tell friends: \"hỗ trợ customer service bagus\")

Result of bad handling:
- Lose customer forever
- Negative word-of-mouth (10x damage)

# INPUT
Loại complaint: {{complaint_type}} (quality, delivery, service, pricing...)
Severity: {{severity}} (minor, major, critical)
Khách emotion: {{emotion}} (upset, angry, disappointed, confused...)
Solution available: {{solution_options}}

# TASK
1. Viết response standar untuk masing-masing complaint type
2. Followup conversation dengan solution + compensation
3. Create recovery/win-back sequence
4. Learn dari complaint (improvement)
5. Follow-up después of resolution (ensure satisfaction)

# OUTPUT FORMAT
**Complaint Handling Framework:**

**Step 1: Immediate Response (Within 1 hour)**

Acknowledge:
\"Hi [name],
Thank you for reaching out. I'm [your name].
Aku paham [frustration]: [khách's complaint].
You're right to be [emotion].
Saya akan fix ini.\"

**Step 2: Clarify & Listen**

Ask questions:
\"To help better, dapat clear?
- When/where did [issue] happen?
- What was expected vs actual?
- How does this affect you?

(Really listen, note details)\"

**Step 3: Apologize (if company fault)**

Sincere apology:
\"I sincerely apologize untuk [specific issue].
Itu tidak meet standar kami.
Ini tidak seharusnya happen.\"

(Not: \"Sorry you feel that way\" - that's not apology)

**Step 4: Solution + Timeline**

Clear action:
\"Sini kami akan do:
1. [Action 1] → by [date]
2. [Action 2] → by [date]
3. [Action 3] → by [date]

Progress update: [frequency]\"

**Step 5: Compensation (if appropriate)**

Fair compensation:
- Refund (if applicable)
- Replacement (if product fault)
- Discount (next purchase)
- Gesture (gift, service, recognition)

Framing: \"As goodwill, kami offer...\" (not obligation)

**Step 6: Follow-up**

After resolution:
\"Hi [name],
[Issue] resolved ya? Confirm working?
Anything else kami bisa help?\"

(Show you care it's truly fixed)

**Complaint Type Responses:**

**Type 1: Quality Issue**
Response: \"We take quality seriously. Ini unusual.
[Actions to replace/refund/improve] + [compensation]\"

**Type 2: Delivery/Logistics**
Response: \"Delivery important. Kami track [order].
[Redeliver/refund option] + [compensation]\"

**Type 3: Service Experience**
Response: \"We're sorry untuk experience itu.
Kami escalate ke [team] untuk improve.
[Solution + compensation]\"

**Type 4: Pricing/Value**
Response: \"I hear price concern.
Let me explain value: [reframe] [offer solution]\"

**Recovery Sequence (Post-resolution):**

Day 0: Immediate response + solution
Day 3: Follow-up (confirm resolution)
Day 7: Thank you + feedback request
Day 14: Win-back offer (\"we appreciate your patience, here's [offer]\")
Day 30: Relationship check (\"how are we doing?\")

**Learn from Complaint:**

For each complaint:
- Root cause analysis
- Process improvement
- Staff training (if needed)
- Policy update (if needed)
- Share with team (prevent repeat)

**Pro tips:**
- Fast response (speed build trust)
- Personal touch (not template)
- Take responsibility (even if not direct fault)
- Over-communicate (better safe than sorry)
- Follow through (do what you say)`,
    tags: ["chăm-sóc", "re-marketing", "complaint-handling"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-49.jpg"
  },
  {
    id: "sale-50",
    title: "Kịch bản tri ân VIP dịp lễ/sinh nhật",
    description: "Tháng 1 bán khác tháng 12, mùa hè bán khác mùa đông. Kịch bản chào hàng theo mùa/lễ đã tối ưu — chỉ cần điền sản phẩm vào là chạy.",
    price: 29000,
    originalPrice: 59000,
    category: "ban-hang",
    tool: "chatgpt",
    rating: 4.9,
    reviewCount: 1600,
    sold: 4800,
    preview: "Sinh nhật khách, lễ hội = cơ hội nuôi dưỡng mối quan hệ. Personal touch + special offer = khách feel valued.",
    fullContent: `# ROLE
Bạn là chuyên gia VIP Customer Care & Relationship Nurturing, viết kịch bản tri ân dịp lễ/sinh nhật cho khách thân thiết.

# CONTEXT
Occasion-based appreciation (birthday, holiday, anniversary) hiệu quả vì:
- Personal touch (show you remember them)
- Emotional connection (not transactional)
- VIP feeling (special treatment)
- Natural offer (not forced, aligned with occasion)

Psychology: Khách feel seen, valued, part of community

# INPUT
Khách segment: {{customer_segment}} (VIP, top 20%, top spender...)
Occasion: {{occasion}} (birthday, Tết/Lunar New Year, Christmas, customer anniversary...)
Budget untuk gift/discount: {{budget}}
Personalization level: {{personalization}} (generic, semi-personal, full personal)

# TASK
1. Determine VIP qualification criteria
2. Viết birthday message + offer script
3. Viết Lunar New Year/Christmas message + offer
4. Viết customer anniversary (\"1 year as customer\") message
5. Create monthly/quarterly appreciation touchpoint

# OUTPUT FORMAT
**VIP Qualification Criteria:**

Top 20% by:
- ✅ Total spend (top $X spenders)
- ✅ Repeat frequency (5+ purchases)
- ✅ Engagement (reviews, referrals, feedback)
- ✅ Longevity (customer for 1+ year)

**Birthday Message:**

Subject: \"🎂 [name], happy birthday!\"

Body:
\"Hi [name]! 🎉

Today's your special day!

[Personal reference: \"still remember you bought X last year?\"]

As thank you untuk loyalty Anda:
🎁 [Special birthday discount - e.g., 20% off]
Code: [BIRTHDAY_CODE]
+ [Gift/bonus item] included
Valid: [date range]

Enjoy, celebrate, and thank you! 🙏
[Your name]\"

**Lunar New Year/Holiday Message:**

Subject: \"🎊 Happy Lunar New Year, [name]!\"

Body:
\"Hi [name]! 🎊

Happy Lunar New Year!

Year of [animal] - may it bring [wishes].

[Reference khách's purchase]: \"Thank you untuk trust [product] dari kami.\"

Special holiday offer:
✨ [Special Tết discount - e.g., 25% off]
Code: [LUNAR_CODE]
+ [Gift hamper/bundle] free
Valid: Tết week

Cùng celebrate! 🧧
[Your name]\"

**Customer Anniversary Message:**

Subject: \"🎉 [name], it's been 1 YEAR!\"

Body:
\"Hi [name]! 🎉

Wow, today marks 1 year since you joined us!

Time flies! 📅 Recap:
📦 [X] orders
💝 [Y] products tried
⭐ [Z] pieces of feedback

You mean so much to us.

Celebrate with us:
🎁 [Anniversary exclusive discount - e.g., 30% off]
Code: [ANNIVERSARY_CODE]
+ [VIP gift] included

Here's to many more! 🥂
[Your name]\"

**Seasonal/Holiday Calendar:**

Jan: New Year - \"New goals\" special offer
Feb: Valentine - \"Love your order\" discount
Mar: None/local
Apr: None/local
May: Summer kickoff - \"Fresh start\" offer
Jun: Mid-year - \"Half-year celebration\" discount
Jul: Summer - \"Beat the heat\" special
Aug: Back to school - Season offer
Sep: None/local
Oct: Diwali/Local festival - Festival discount
Nov: Black Friday prep - \"Early access\" VIP
Dec: Christmas - \"Tis the season\" gift bundle

**VIP Quarterly Touchpoint:**

Q1: Birthday month (if fall in Q1)
Q2: Mid-year appreciation (\"thanks for sticking with us\")
Q3: Summer hello + new launch preview
Q4: Holiday season + year-end thank you

**Appreciation Offer Tiers:**

🥉 Standard VIP: 15% discount + e-card
🥈 Premium VIP: 20% discount + small gift
🥇 Top VIP: 30% discount + exclusive item + personal call/video

**Pro Implementation:**

1. **Segment email list** by occasion (birthday month, customer anniversary month)
2. **Personalize** if you have data (name, purchase history, preference)
3. **Timing** (send 1 day before, or morning-of in their timezone)
4. **Offer specificity** (not vague \"special discount\", be specific: 20% off)
5. **Easy redemption** (code simple, one-click apply)
6. **Follow-up** (if not redeemed by halfway, remind \"offer ending soon\")
7. **Thank after purchase** (personal note, not automated)

**Tools to use:**
- Birthday database (collect during signup)
- Automation (send timed to birthday)
- Segmentation (different messaging per segment)
- Personalization (merge customer name, purchase history)

**Example Full Email Sequence for Birthday VIP:**

Day 0 (Birthday): \"Happy birthday [name]!\" + offer
Day 2: \"Still celebrating?\" + reminder offer active
Day 4: \"Last 2 days - [discount] code [CODE]\"
Day 7: \"[Name], offer ended but thanks for being special!\" + appreciate message`,
    tags: ["chăm-sóc", "re-marketing", "vip-program"],
    difficulty: "Trung bình",
    author: "PromptVN",
    createdAt: "2026-04-01",
    image: "/images/sale-50.jpg"
  },
];
