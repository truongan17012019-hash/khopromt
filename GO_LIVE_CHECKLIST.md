# Go-Live Checklist - PromptVN

Checklist này dành cho việc đưa web PromptVN lên production an toàn.

## 0) Mốc quyết định

- [ ] Chọn ngày giờ go-live.
- [ ] Chọn 1 người chịu trách nhiệm kỹ thuật chính.
- [ ] Chọn 1 người test nghiệp vụ mua hàng.

---

## 1) Hạ tầng Deploy

- [ ] Chọn nền tảng deploy (khuyến nghị: Vercel).
- [ ] Kết nối repository với môi trường production.
- [ ] Mua domain và trỏ DNS đúng (A/CNAME theo nhà cung cấp hosting).
- [ ] Bật SSL/HTTPS cho domain chính.
- [ ] Tạo môi trường `production` riêng (không dùng cấu hình local).

Gợi ý:
- Domain app: `https://your-domain.com`
- Admin: `https://your-domain.com/admin`

---

## 2) Environment Variables Production

Set đầy đủ trên hosting (Vercel/Server):

### Core app
- [ ] `NEXT_PUBLIC_BASE_URL=https://your-domain.com`

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL=...`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- [ ] `SUPABASE_SERVICE_ROLE_KEY=...`

### MoMo
- [ ] `MOMO_PARTNER_CODE=...`
- [ ] `MOMO_ACCESS_KEY=...`
- [ ] `MOMO_SECRET_KEY=...`
- [ ] `MOMO_ENDPOINT=...` (production endpoint)

### VNPay
- [ ] `VNPAY_TMN_CODE=...`
- [ ] `VNPAY_HASH_SECRET=...`
- [ ] `VNPAY_URL=...` (production endpoint)

### Analytics
- [ ] `NEXT_PUBLIC_GA_ID=...` (nếu dùng)

Lưu ý:
- [ ] Không để giá trị placeholder kiểu `your-...` trong production.
- [ ] Không commit secrets lên repo.

---

## 3) Database & Schema (Supabase)

- [ ] Xác nhận đã có các bảng:
  - [ ] `prompts`
  - [ ] `orders`
  - [ ] `order_items`
  - [ ] `user_purchases`
  - [ ] `wishlists`
  - [ ] `reviews`
  - [ ] `coupons` (nếu dùng)
- [ ] Kiểm tra unique/index quan trọng:
  - [ ] `user_purchases(user_id, prompt_id)` unique
  - [ ] index `orders.user_id`, `orders.payment_status`
- [ ] Seed dữ liệu prompts/workflows production.
- [ ] Bật backup định kỳ database.

---

## 4) Thanh toán Production (MoMo/VNPay)

### Merchant setup
- [ ] Tài khoản merchant MoMo đã duyệt production.
- [ ] Tài khoản merchant VNPay đã duyệt production.

### Callback/Return URL
- [ ] MoMo IPN URL: `https://your-domain.com/api/payment/callback`
- [ ] VNPay Return URL: `https://your-domain.com/thanh-toan-thanh-cong`
- [ ] URL callback public, HTTPS, truy cập được từ Internet.

### Test flow thanh toán live (số tiền nhỏ)
- [ ] MoMo success.
- [ ] MoMo cancel/fail.
- [ ] VNPay success.
- [ ] VNPay cancel/fail.
- [ ] Callback gửi lặp không tạo quyền mua trùng.
- [ ] Sau thanh toán thành công:
  - [ ] Order đổi trạng thái paid.
  - [ ] User thấy sản phẩm ở dashboard.
  - [ ] Nội dung prompt/workflow mở đúng quyền.

---

## 5) Auth, Quyền truy cập, Admin

- [ ] Login/logout hoạt động ổn trên production.
- [ ] Route `/dashboard` yêu cầu đăng nhập.
- [ ] Mua xong thì `Xem Prompt` hoạt động đúng.
- [ ] Workflow bundle mở full sau khi mua Growth Bundle.
- [ ] Trang admin chỉ cho người có quyền phù hợp (nếu chưa có RBAC thật, cần bổ sung trước scale).

---

## 6) Tracking & KPI

- [ ] Event hoạt động:
  - [ ] `view_workflow`
  - [ ] `click_buy_growth`
  - [ ] `start_checkout`
  - [ ] `purchase`
- [ ] Kiểm tra data hiển thị ở `/admin/kpi`.
- [ ] Xác nhận mốc KPI tuần đầu:
  - [ ] CTR buy > 3%
  - [ ] Checkout start rate > 8%
  - [ ] Purchase rate > 1.5% - 2%

---

## 7) Bảo mật & Ổn định

- [ ] Kiểm tra middleware/rate limit vẫn chạy production.
- [ ] Bật theo dõi lỗi runtime (Sentry hoặc log service).
- [ ] Kiểm tra không lộ keys trong client bundle.
- [ ] Rà lại CSP và các security headers.
- [ ] Kiểm tra API nhạy cảm có xác thực tối thiểu.

---

## 8) Nội dung pháp lý

- [ ] Trang Điều khoản sử dụng.
- [ ] Trang Chính sách bảo mật.
- [ ] Trang Chính sách hoàn tiền/hủy đơn.
- [ ] Thông tin liên hệ hỗ trợ khách hàng.

---

## 9) QA cuối trước mở public

- [ ] `npm run build` pass trên production build.
- [ ] Test trên mobile (iOS/Android) các trang:
  - [ ] Home
  - [ ] Workflow pages
  - [ ] Cart
  - [ ] Checkout
  - [ ] Success page
  - [ ] Dashboard
- [ ] Test Chrome + Edge.
- [ ] Kiểm tra tốc độ tải trang chính.

---

## 10) Runbook ngày Go-Live

### Trước mở public (T-30 phút)
- [ ] Deploy bản release cuối.
- [ ] Verify env vars production.
- [ ] Test 1 giao dịch thực tế giá nhỏ.

### Khi mở public (T=0)
- [ ] Bật chiến dịch traffic.
- [ ] Theo dõi error logs realtime.
- [ ] Theo dõi KPI admin.

### Sau mở public (T+2h, T+24h)
- [ ] Kiểm tra tỷ lệ lỗi thanh toán.
- [ ] Kiểm tra dashboard mua hàng thực tế.
- [ ] Chốt danh sách issue cần fix nóng.

---

## 11) Rollback plan

- [ ] Có bản release trước đó để rollback nhanh.
- [ ] Có người chịu trách nhiệm rollback.
- [ ] Điều kiện rollback rõ ràng:
  - [ ] Lỗi thanh toán diện rộng.
  - [ ] Lỗi mở quyền mua hàng.
  - [ ] Lỗi truy cập toàn site kéo dài.

---

## Gợi ý thứ tự triển khai trong 1 ngày

1. Hạ tầng + domain + env.
2. DB + seed.
3. Payment callback test.
4. QA full flow mua hàng.
5. Bật tracking + KPI.
6. Go-live soft launch trước, sau đó scale traffic.

