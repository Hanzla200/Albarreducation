import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://albarreducation.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/student/classes",
    "/student/lectures",
    "/student/notes",
    "/student/books",
    "/student/pastpapers",
    "/contact",
  ];

  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));
}