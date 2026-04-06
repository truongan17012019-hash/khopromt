import { supabase, isSupabaseConfigured } from "./supabase";

export async function signUp(email: string, password: string, name: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase chưa được cấu hình. Vui lòng kiểm tra file .env.local");
  }
  const { data, error } = await supabase.auth.signUp({
    email, password, options: { data: { name } },
  });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase chưa được cấu hình");
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase chưa được cấu hình");
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(translateAuthError(error.message));
}

export async function resetPassword(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase chưa được cấu hình");
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function updatePassword(newPassword: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase chưa được cấu hình");
  }
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function getSession() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

function translateAuthError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials": "Email hoặc mật khẩu không đúng",
    "Email not confirmed": "Email chưa được xác nhận",
    "User already registered": "Email này đã được đăng ký",
    "Password should be at least 6 characters": "Mật khẩu phải có ít nhất 6 ký tự",
    "Email rate limit exceeded": "Gửi quá nhiều yêu cầu. Vui lòng thử lại sau",
  };
  return errorMap[message] || message;
}
