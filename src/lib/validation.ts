export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^(0|\+84)\d{9,10}$/;
  return re.test(phone.replace(/\s/g, ""));
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) return { valid: false, message: "Mật khẩu tối thiểu 6 ký tự" };
  if (password.length > 128) return { valid: false, message: "Mật khẩu tối đa 128 ký tự" };
  if (!/[A-Za-z]/.test(password)) return { valid: false, message: "Mật khẩu cần có ít nhất 1 chữ cái" };
  if (!/[0-9]/.test(password)) return { valid: false, message: "Mật khẩu cần có ít nhất 1 chữ số" };
  return { valid: true, message: "" };
}
export function validatePrice(price: number): boolean {
  return Number.isInteger(price) && price >= 0 && price <= 100000000;
}

export function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function validateCouponCode(code: string): boolean {
  return /^[A-Z0-9]{3,20}$/.test(code);
}

export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}