import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(`/dang-nhap?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      );
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        return NextResponse.redirect(
          new URL(`/dang-nhap?error=${encodeURIComponent("Đăng nhập thất bại.")}`, request.url)
        );
      }
    } catch {
      return NextResponse.redirect(
        new URL(`/dang-nhap?error=${encodeURIComponent("Có lỗi xảy ra.")}`, request.url)
      );
    }
  }
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
