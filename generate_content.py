import json, os

# Blog posts with rich content
blogs = [
  {
    "id": "blog-1",
    "title": "Huong dan viet Prompt AI hieu qua cho nguoi moi",
    "slug": "huong-dan-viet-prompt-ai-hieu-qua",
    "excerpt": "Tim hieu cach viet prompt AI chuyen nghiep.",
    "content": """<h2>Prompt AI la gi?</h2>
<p>Prompt AI la cau lenh ban gui cho cac mo hinh ngon ngu lon (LLM) nhu ChatGPT, Claude, Gemini. Mot prompt tot giup ban nhan ket qua chinh xac, huu ich va tiet kiem thoi gian hon nhieu so voi viec hoi chung chung.</p>

<h2>Tai sao Prompt Engineering quan trong?</h2>
<p>Theo nghien cuu cua OpenAI, <strong>mot prompt duoc viet tot co the tang chat luong output len 200-400%</strong> so voi cau hoi thong thuong. Day khong chi la ky nang ky thuat - day la ky nang lam viec thien yeu trong thoi dai AI.</p>

<h2>Cong thuc CREAD - 5 thanh phan cua Prompt hieu qua</h2>

<h3>C - Context (Ngu canh)</h3>
<p>Cung cap boi canh cu the cho AI. Thay vi hoi "Viet email", hay noi "Toi la Marketing Manager tai mot cong ty startup SaaS, can viet email gioi thieu san pham moi cho khach hang doanh nghiep."</p>

<h3>R - Role (Vai tro)</h3>
<p>Giao vai tro cho AI de no hieu goc nhin can thiet. Vi du: "Hay dong vai mot chuyen gia SEO voi 10 nam kinh nghiem" hoac "Hay dong vai mot copywriter quang cao chuyen nghiep."</p>

<h3>E - Examples (Vi du)</h3>
<p>Cung cap 1-2 vi du ve output mong muon. Day goi la ky thuat "few-shot prompting" va giup AI hieu chinh xac ban muon gi.</p>

<h3>A - Action (Hanh dong)</h3>
<p>Mo ta ro rang nhiem vu can lam. Su dung cac dong tu cu the: "Phan tich", "Viet", "So sanh", "Liet ke", "Tao"...</p>

<h3>D - Details (Chi tiet)</h3>
<p>Them cac rang buoc cu the: do dai, format, tone, ngon ngu, doi tuong doc gia.</p>

<h2>5 Loi thuong gap khi viet Prompt</h2>
<ul>
<li><strong>Qua chung chung:</strong> "Viet bai blog" thay vi "Viet bai blog 1500 tu ve xu huong AI 2024 cho doi tuong la startup founders"</li>
<li><strong>Thieu ngu canh:</strong> AI khong biet ban la ai, lam gi, can gi</li>
<li><strong>Khong chi dinh format:</strong> Khong noi ro muon bullet points, bang, hay doan van</li>
<li><strong>Qua nhieu yeu cau mot luc:</strong> Nen chia nho thanh nhieu prompt</li>
<li><strong>Khong iterate:</strong> Prompt dau tien it khi hoan hao - hay yeu cau AI chinh sua va cai thien</li>
</ul>

<h2>Vi du thuc te</h2>
<blockquote>
<strong>Prompt xau:</strong> Viet email marketing<br><br>
<strong>Prompt tot:</strong> Hay dong vai mot email marketing specialist. Viet email gioi thieu san pham AI prompt marketplace cho doi tuong la freelancer Viet Nam. Tone than thien, chuyen nghiep. Email dai 200-300 tu, co CTA ro rang, subject line hap dan. Bao gom: loi ich chinh, so lieu cu the, va uu dai dac biet.
</blockquote>

<h2>Ket luan</h2>
<p>Prompt Engineering khong kho, nhung can luyen tap. Bat dau voi cong thuc CREAD, tranh 5 loi pho bien, va luon iterate de cai thien. Tren PromptVN, ban co the tim thay hang tram prompt da duoc toi uu san - tiet kiem thoi gian va hoc hoi tu cac chuyen gia.</p>""",
    "author": "PromptVN Team",
    "category": "huong-dan",
    "tags": ["prompt engineering", "AI"],
    "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    "published": True,
    "createdAt": "2024-03-15",
    "updatedAt": "2024-03-15",
    "views": 1250
  },
]

# Will continue in next chunk
print("Script loaded, generating...")
