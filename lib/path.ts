// lib/paths.ts
export function assetPath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // avoid double slashes if path already starts with "/"
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
