type EventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(event: string, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;

  const data = {
    event,
    ts: Date.now(),
    ...payload,
  };

  // For GTM / GA setups
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(data);

  // For direct gtag usage when available
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, payload);
  }

  // Local debug trail to validate events quickly
  try {
    const key = "promptvn_events";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing.slice(-100)));
  } catch {
    // noop
  }

  // Best-effort server-side tracking for admin KPI.
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // noop
  }
}
