// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://albarreducation.com";
const siteName = "Albar Education";
const siteDescription =
  "Albar Education provides video lectures, notes, books, and past papers for Pakistani students in Matric and FSC classes 9 to 12.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Albar Education | Matric & FSC Learning Platform",
    template: "%s | Albar Education",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Albar Education",
    "Matric online classes Pakistan",
    "FSC online classes Pakistan",
    "class 9 notes",
    "class 10 past papers",
    "class 11 lectures",
    "class 12 study material",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName,
    title: "Albar Education | Matric & FSC Learning Platform",
    description: siteDescription,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Albar Education logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Albar Education | Matric & FSC Learning Platform",
    description: siteDescription,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
import PageShell from "../components/PageShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: siteName,
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              description: siteDescription,
              areaServed: "Pakistan",
              sameAs: [
                "https://www.youtube.com/@sirsadam",
                "https://patreon.com/sirsadam",
                "https://whatsapp.com/channel/0029VaEdyBSG3R3p7BU1C02e",
              ],
            }),
          }}
        />
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}

