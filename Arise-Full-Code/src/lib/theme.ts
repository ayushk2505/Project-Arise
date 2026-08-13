// Mirrors the :root[data-accent="..."] blocks in src/index.css. Charting
// libraries (recharts) need literal color strings rather than CSS
// variables, so this is the single source of truth those components
// read from — keep both in sync if you add/change a preset.
//
// "purple" (labeled "System" in the UI) is special: it's theme-adaptive —
// teal in dark mode, lavender in light mode — matching the CSS default.
// All other presets are fixed hues regardless of theme.
export const ACCENT_PRESETS: Record<string, { primary: string; secondary: string; label: string }> = {
  purple: { primary: "#2DD4BF", secondary: "#5EEAD4", label: "System" },
  blue: { primary: "#3B82F6", secondary: "#22D3EE", label: "Ocean" },
  green: { primary: "#34D399", secondary: "#22D3EE", label: "Emerald" },
  rose: { primary: "#F43F5E", secondary: "#FB923C", label: "Rose" },
  amber: { primary: "#F59E0B", secondary: "#EC4899", label: "Amber" },
};

const SYSTEM_LIGHT = { primary: "#7C6EF6", secondary: "#A794FA", label: "System" };

export function getAccentPreset(accentColor: string | undefined, theme: "dark" | "light" = "dark") {
  if ((accentColor ?? "purple") === "purple" && theme === "light") {
    return SYSTEM_LIGHT;
  }
  return ACCENT_PRESETS[accentColor ?? "purple"] ?? ACCENT_PRESETS.purple;
}
