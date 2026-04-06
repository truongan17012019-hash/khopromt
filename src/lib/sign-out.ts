"use client";

/**
 * Tách khỏi store.ts để store không import supabase (tránh vòng/thứ tự bundle khiến hook Header = undefined).
 */
export async function signOutClient(): Promise<void> {
  const [{ supabase: sb }, { useAuthStore }] = await Promise.all([
    import("@/lib/supabase"),
    import("@/lib/store"),
  ]);
  try {
    if (sb) {
      await sb.auth.signOut();
    }
  } catch {
    /* noop */
  }
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("promptvn_auth");
    }
  } catch {
    /* noop */
  }
  useAuthStore.setState({ isLoggedIn: false, user: null });
}
