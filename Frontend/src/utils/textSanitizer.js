// Clean raw HTML or encoded HTML entities into clean, normal readable text
export function stripHtml(raw) {
  if (!raw || typeof raw !== "string") return "";
  let str = raw;
  if (str.includes("&lt;") || str.includes("&gt;")) {
    str = str
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&amp;/gi, "&");
  }
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|h[1-6])>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

export function cleanListItems(items, fallbackList = []) {
  if (!Array.isArray(items) || items.length === 0) return fallbackList;
  const cleaned = items
    .map((item) => stripHtml(item))
    .filter((item) => {
      if (!item || item.length < 3) return false;
      // Discard HTML tag leftovers, raw numbers or empty lines (e.g. "ul1", "li1", "1", "2", "p1")
      if (/^(ul\d*|li\d*|p\d*|\d+)$/i.test(item.trim())) return false;
      return true;
    });
  return cleaned.length > 0 ? cleaned : fallbackList;
}
