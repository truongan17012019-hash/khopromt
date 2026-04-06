# Hướng dẫn giao diện PromptVN (theme MLV)

Khi thêm trang hoặc component mới, giữ **một gu** với phần còn lại của site bằng các quy tắc sau.

## Màu và typography

- **Nền / chữ phụ / viền:** dùng **`slate-*`** (`bg-slate-50`, `text-slate-600`, `border-slate-200`, …), không dùng `gray-*` cho layout chính.
- **CTA, liên kết nhấn mạnh, trạng thái chọn:** dùng **`brand-*`** (cam, định nghĩa trong `tailwind.config.ts`).
- **Font:** Be Vietnam Pro (đã khai báo trong `globals.css` / `tailwind.config.ts`).

## Class tiện ích (globals)

| Class | Mục đích |
|--------|-----------|
| **`hero-mlv`** | Hero / banner tối: nền slate đậm + lưới + glow cam. Dùng cho đầu trang quan trọng (chi tiết prompt, giỏ, dashboard, danh mục, …). |
| **`section-eyebrow`** | Nhãn phụ nhỏ uppercase phía trên tiêu đề section (màu cam). |
| **`ui-btn-primary`** | Nút chính (nền cam, hover đậm hơn). |
| **`ui-btn-secondary`**, **`ui-btn-ghost`** | Nút phụ / viền. |
| **`ui-card`**, **`ui-card-hover`** | Thẻ nội dung bo góc + viền slate nhạt. |

## Nút và form

- Nút hành động chính: **`ui-btn-primary`** hoặc tương đương `bg-brand-500` / `hover:bg-brand-600`.
- Focus ring: **`focus:ring-brand-500`** (hoặc theo pattern trong `globals.css`).

## Header / footer

- Header site: nền tối (`slate-950`), chữ sáng, CTA **`Khám phá miễn phí`** kiểu cam.
- Footer: nền tối đồng bộ; hover link có thể dùng **`text-brand-400`**.

## Tài liệu liên quan trong repo

- `src/app/globals.css` — định nghĩa `.hero-mlv`, `.section-eyebrow`, `.ui-*`.
- `tailwind.config.ts` — scale màu **`brand`**.

Cập nhật file này khi thêm token mới hoặc đổi hệ màu.
