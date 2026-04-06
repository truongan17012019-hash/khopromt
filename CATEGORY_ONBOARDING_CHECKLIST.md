# Checklist Them Chuyen Muc Moi (Khong Bi 404)

Muc tieu: khi them 1 category + nhom prompt moi, website mo duoc ngay, khong loi 404 o `/danh-muc/[slug]` va `/prompt/[id]`.

## 1) Them category vao du lieu local

Cap nhat `src/data/prompts.ts`:

- Them category moi vao `categories[]`:
  - `id`: slug URL (vi du: `cham-soc-khach-hang`)
  - `name`, `icon`, `description`, `count`, `color`
- Them role vao `roleByCategory` (de normalize content dung nganh).

## 2) Them bo prompt cho category moi

- Tao file du lieu rieng, vi du: `src/data/prompts-cskh.ts`
- Export mang `Prompt[]` day du truong:
  - `id`, `title`, `description`, `price`, `category`, `tool`, `preview`, `fullContent`, ...
- Import va gan vao `basePrompts` trong `src/data/prompts.ts`.

## 3) Bao dam route `/prompt/[id]` khong 404

Trong `src/app/prompt/[id]/page.tsx`:

- Khong chi fallback cho `test-*`.
- Phai fallback theo `prompts.find((p) => p.id === id)` cho moi local prompt.
- Neu DB chua seed prompt moi, route van mo bang du lieu local.

## 4) Bao dam route `/danh-muc/[slug]` khong 404

Trong `src/lib/server/category-settings.ts`:

- Neu DB `categories` co du lieu, van phai merge category mac dinh local neu DB thieu.
- Ly do: nhieu luc DB chua co category moi, nhung code da them category moi.

## 5) Dong bo DB (khuyen nghi)

Neu da co trang Admin Categories:

- Them category moi vao DB bang Admin, hoac seed SQL.
- Kiem tra `is_active = true`.

## 6) Test nhanh truoc deploy

Chay:

- `npm run build`

Mo local:

- `/danh-muc/<category-slug-moi>`
- `/prompt/<prompt-id-moi-1>`
- `/prompt/<prompt-id-moi-2>`

## 7) Deploy

Len production:

- `vercel deploy --prod --yes`

Sau deploy, hard refresh trinh duyet (`Ctrl + F5`) de xoa cache.

---

## Guardrails da ap dung san trong code

- `src/app/prompt/[id]/page.tsx`: fallback local prompt theo ID bat ky.
- `src/lib/server/category-settings.ts`: merge category local neu DB thieu.

=> Nhung guardrails nay giam manh nguy co 404 khi them chuyen muc moi.
