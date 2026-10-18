// Mirrors the :root[data-accent="..."] blocks in src/index.css. Charting
// libraries (recharts) need literal color strings rather than CSS
// variables, so this is the single source of truth those components
// read from — keep both in sync if you add/change a preset.
//
// Accent presets use the same hues in both themes; the surfaces adapt to
// light or dark mode while the selected accent stays consistent.
export const ACCENT_PRESETS: Record<string, { primary: string; secondary: string; label: string }> = {
  purple: { primary: "#7C6EF6", secondary: "#A794FA", label: "Purple" },
  blue: { primary: "#3B82F6", secondary: "#22D3EE", label: "Ocean" },
  green: { primary: "#22C55E", secondary: "#4ADE80", label: "Green" },
  mint: { primary: "#43DEC8", secondary: "#8FF2E6", label: "Mint Turquoise" },
  rose: { primary: "#F43F5E", secondary: "#FB923C", label: "Rose" },
  amber: { primary: "#F59E0B", secondary: "#EC4899", label: "Amber" },
};

export function getAccentPreset(accentColor: string | undefined) {
  return ACCENT_PRESETS[accentColor ?? "purple"] ?? ACCENT_PRESETS.purple;
}
