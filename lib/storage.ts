const BUCKET = "project-images";

export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return url.pathname.slice(idx + marker.length);
  } catch {
    return null;
  }
}
