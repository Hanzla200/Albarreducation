/* eslint-disable @typescript-eslint/no-explicit-any */

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Safely extracts a field from a Strapi entity (supporting Strapi v5 flat objects,
 * Strapi v4 { id, attributes } objects, and local mock objects).
 */
export function getField<T = any>(item: any, key: string): T | undefined {
  if (!item) return undefined;
  if (item.attributes && item.attributes[key] !== undefined) {
    return item.attributes[key];
  }
  return item[key];
}

/**
 * Safely extracts a field from a relation property across Strapi v4/v5/mock shapes.
 */
export function getRelationField<T = any>(
  item: any,
  relationKey: string,
  fieldKey: string
): T | undefined {
  const rel = getField(item, relationKey);
  if (!rel) return undefined;

  // Handle single relation (v4: { data: { attributes: { ... } } } or v5: { ... })
  if (rel?.data?.attributes && rel.data.attributes[fieldKey] !== undefined) {
    return rel.data.attributes[fieldKey];
  }
  if (rel?.data && rel.data[fieldKey] !== undefined) {
    return rel.data[fieldKey];
  }
  if (rel?.attributes && rel.attributes[fieldKey] !== undefined) {
    return rel.attributes[fieldKey];
  }
  if (rel[fieldKey] !== undefined) {
    return rel[fieldKey];
  }

  // Handle array relation
  if (Array.isArray(rel)) {
    if (rel.length > 0) {
      return getField(rel[0], fieldKey);
    }
  }

  return undefined;
}

/**
 * Ensures data is always returned as an array.
 */
export function asArray<T = any>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null && Array.isArray((data as any).data)) {
    return (data as any).data;
  }
  return [];
}

/**
 * Resolves media file URLs from Strapi.
 */
export function getMediaUrl(media: any): string | null {
  if (!media) return null;
  const url =
    getField(media, "url") ||
    media?.data?.attributes?.url ||
    media?.data?.url ||
    (Array.isArray(media) && getField(media[0], "url")) ||
    (Array.isArray(media?.data) && getField(media.data[0], "url"));

  if (!url) return null;
  if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
    if (url.startsWith("/")) {
      return `${STRAPI_BASE}${url}`;
    }
    return url;
  }
  return String(url);
}

/**
 * Generates a clean human-readable label for a lecture.
 */
export function getLectureLabel(lecture: any): string {
  if (!lecture) return "Untitled Lecture";

  const title = getField(lecture, "title");
  if (title) return String(title);

  const description = getField(lecture, "description");
  if (description) {
    const text = String(description).replace(/<[^>]*>/g, "").trim();
    if (text) return text.slice(0, 75);
  }

  const videoUrl = getField(lecture, "vediourls");
  if (videoUrl) return String(videoUrl);

  return "Untitled Lecture";
}
