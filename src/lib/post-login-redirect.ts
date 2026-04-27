/** OAuth round-trip: store where to land after Google redirect (full client path + query). */
export const POST_LOGIN_OAUTH_KEY = "ileoti_post_login_oauth_return";

export function savePathForOAuthReturn(): void {
  if (typeof window === "undefined") return;
  const path = `${window.location.pathname}${window.location.search}`;
  sessionStorage.setItem(POST_LOGIN_OAUTH_KEY, path);
}

export function takePathForOAuthReturn(): string {
  if (typeof window === "undefined") return "/";
  const raw = sessionStorage.getItem(POST_LOGIN_OAUTH_KEY);
  sessionStorage.removeItem(POST_LOGIN_OAUTH_KEY);
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
