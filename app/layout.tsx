import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const arabic = IBM_Plex_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nuvexa.com"),
  title: { default: "NUVEXA Properties — Exceptional places. Considered living.", template: "%s | NUVEXA" },
  description: "A considered collection of exceptional properties and landmark developments across Egypt and beyond.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-nuvexa.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon-nuvexa.png",
  },
  openGraph: { title: "NUVEXA Properties", description: "Exceptional places. Considered living.", type: "website", locale: "ar_EG", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "NUVEXA Properties — Exceptional places. Considered living." }] },
  twitter: { card: "summary_large_image", title: "NUVEXA Properties", description: "Exceptional places. Considered living.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${display.variable} ${sans.variable} ${arabic.variable}`}>{children}</body>
    </html>
  );
}
