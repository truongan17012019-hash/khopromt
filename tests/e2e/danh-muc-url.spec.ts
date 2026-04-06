import { expect, test, type Page } from "@playwright/test";

async function pickAnyCategorySlug(page: Page) {
  await page.goto("/danh-muc");
  const categoryButtons = page.locator("aside button");
  await expect(categoryButtons.first()).toBeVisible();
  const count = await categoryButtons.count();
  expect(count).toBeGreaterThan(1);
  await categoryButtons.nth(1).click();
  await expect(page).toHaveURL(/\/danh-muc\/[^/?#]+/);
  const url = new URL(page.url());
  const slug = url.pathname.split("/").filter(Boolean)[1];
  expect(slug).toBeTruthy();
  return slug;
}

test("click danh mục sẽ đổi URL sang slug", async ({ page }) => {
  await page.goto("/danh-muc");
  const categoryButtons = page.locator("aside button");
  await expect(categoryButtons.first()).toBeVisible();
  await categoryButtons.nth(1).click();
  await expect(page).toHaveURL(/\/danh-muc\/[^/?#]+/);
});

test("link query cũ ?category= sẽ redirect về slug", async ({ page }) => {
  const slug = await pickAnyCategorySlug(page);
  await page.goto(`/danh-muc?category=${encodeURIComponent(slug)}`);
  await expect(page).toHaveURL(new RegExp(`/danh-muc/${slug}$`));
});

test("state filter/search/sort trong URL được giữ sau reload", async ({ page }) => {
  const slug = await pickAnyCategorySlug(page);
  await page.goto(
    `/danh-muc/${slug}?filter=sale&tool=chatgpt&search=prompt&sort=price-low`
  );
  await expect(page.locator('input[placeholder*="Tìm theo"]')).toHaveValue("prompt");
  await expect(page.locator("select")).toHaveValue("price-low");
  await page.reload();
  await expect(page.locator('input[placeholder*="Tìm theo"]')).toHaveValue("prompt");
  await expect(page.locator("select")).toHaveValue("price-low");
  await expect(page).toHaveURL(
    new RegExp(`/danh-muc/${slug}\\?filter=sale&tool=chatgpt&search=prompt&sort=price-low`)
  );
});
