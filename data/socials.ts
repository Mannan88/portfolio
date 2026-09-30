export interface SocialLink {
  label: string
  href: string
  color: string
  note?: string // small qualifier shown next to the label, e.g. "hobby"
}

// Same five colors used for the navbar's section dots — keeps the accent
// language consistent across the whole site instead of introducing new ones.
export const SOCIALS: SocialLink[] = [
  { label: "X", href: "https://x.com/Mannan_k2005", color: "#ef4444" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mannan-kochar-74bb75270/", color: "#3b82f6" },
  { label: "GitHub", href: "https://github.com/Mannan88", color: "#22c55e" },
  { label: "Email", href: "mailto:kocharmanan88@gmail.com", color: "#eab308" },
  { label: "Pinterest", href: "https://in.pinterest.com/mannankochar885/", color: "#a855f7", note: "hobby" },
]
