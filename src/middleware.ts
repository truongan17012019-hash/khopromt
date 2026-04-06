import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 60; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const pathname = req.nextUrl.pathname;

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }
  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // In production, check for admin role via JWT/session
    // For now, allow access (implement proper auth check with Supabase)
  }

  // Protect API routes that need authentication
  const protectedAPIs = ["/api/orders", "/api/reviews", "/api/wishlist"];
  if (protectedAPIs.some((path) => pathname.startsWith(path))) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader && req.method !== "GET") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    /** Production only: CSP trên dev hay chặn CSS/HMR (blob, chunk style) của Next → trang trắng / không Tailwind. */
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https: blob:; font-src 'self' data: https:; img-src 'self' data: blob: https:; connect-src 'self' https: wss:;"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};