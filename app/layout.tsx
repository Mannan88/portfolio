import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/component/shared/Navbar";
import HalftoneBackground from "@/component/backgrounds/halftone-bg/HalfToneBg";
import MobileNotice from "@/component/MobileNotice";

// Define your base URL once to easily construct absolute paths for images
const SITE_URL = "https://mannan88.github.io/portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mannan Kochar | Creative Developer",
    template: "%s | Mannan Kochar",
  },
  description: "Portfolio of Mannan Kochar, a Design Engineering student and Creative Developer based in Mumbai. Specializing in React, Next.js, and GSAP animations.",
  keywords: [
    "Mannan Kochar",
    "Creative Developer",
    "Frontend Developer",
    "Mumbai",
    "GSAP",
    "Three.js",
    "React",
    "Next.js",
    "GLSL",
    "Figma",
    "Canva",
  ],
  authors: [{ name: "Mannan Kochar", url: SITE_URL }],
  creator: "Mannan Kochar",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: "Mannan Kochar | Creative Developer",
    description: "Bridging the gap between static design and interactive code. View my projects and skills.",
    siteName: "Mannan Kochar Portfolio",
    images: [
      {
        url: `${SITE_URL}/summary_large_image.png`,
        width: 1200,
        height: 630,
        alt: "Mannan Kochar Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mannan Kochar | Creative Developer",
    description: "Bridging the gap between static design and interactive code.",
    // 3. Twitter Card Image
    images: [`${SITE_URL}/summary_large_image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased scroll-smooth`}>
      <body className="bg-(--bg-color) text-[#0E0E0E] relative cursor-none">
        <MobileNotice />
        <HalftoneBackground gridSize={64} radius={0.12} bgColor="#1e1e1e" dotColor="#717174">
          <Navbar />
          <main>{children}</main>
        </HalftoneBackground>
      </body>
    </html>
  );
}
