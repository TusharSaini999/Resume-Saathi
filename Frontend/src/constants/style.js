// Unslop Design System Tokens for Resume Saathi
// Clean neutral ramp (Graphite) with signature accent derived from the official logo:
// Logo Primary: #fe3e91 (Rose / Magenta from logo mark)
// Logo Secondary: #5309b6 (Royal Violet from logo mark)

export const BRAND_PRIMARY = "#fe3e91";
export const BRAND_PRIMARY_HOVER = "#e11d48";
export const BRAND_PRIMARY_GLOW = "#ff2aac";
export const BRAND_VIOLET = "#5309b6";

export const GRADIENT_SHARED = "text-zinc-900 dark:text-zinc-100 font-semibold";

export const BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#fe3e91] text-white hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:text-white dark:hover:bg-[#ff2aac] active:scale-[0.98] transition-all duration-150 shadow-xs dark:shadow-[0_0_15px_rgba(254,62,145,0.25)]";

export const BUTTON_SECONDARY_CLASS =
  "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-[#fe3e91]/40 dark:hover:border-[#fe3e91]/50 hover:text-[#fe3e91] dark:hover:text-[#fe3e91] active:scale-[0.98] transition-all duration-150";

export const BUTTON_ACCENT_CLASS =
  "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-[#fe3e91] to-[#5309b6] text-white hover:opacity-95 active:scale-[0.98] transition-all duration-150 shadow-xs dark:shadow-[0_0_15px_rgba(254,62,145,0.3)]";

export const UNDERLINE_CLASS =
  "h-0.5 bg-[#fe3e91] dark:bg-[#fe3e91] transition-all duration-200 origin-left";

// Neutral text roles (Graphite ramp)
export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-100";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-400";
export const TEXT_MUTED = "text-zinc-500 dark:text-zinc-500";

// Surfaces & Hairlines
export const SURFACE_PAGE = "bg-[#fafafa] dark:bg-[#141415]";
export const SURFACE_CARD = "bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800/90";
export const SURFACE_RAISED = "bg-zinc-50 dark:bg-[#232325] border border-zinc-200/80 dark:border-zinc-800/90";
export const HAIRLINE_BORDER = "border-zinc-200/80 dark:border-zinc-800/90";
