import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/component/shared/Navbar";
import HalftoneBackground from "@/component/backgrounds/halftone-bg/HalfToneBg";

export const metadata: Metadata = {
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
    "Next.js"
  ],
  authors: [{ name: "Mannan Kochar", url: "https://mannan.dev" }],
  creator: "Mannan Kochar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mannan.dev", // Replace with your actual URL
    title: "Mannan Kochar | Creative Developer",
    description: "Bridging the gap between static design and interactive code. View my projects and skills.",
    siteName: "Mannan Kochar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mannan Kochar | Creative Developer",
    description: "Bridging the gap between static design and interactive code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`antialiased scroll-smooth`}
    >
      <body className="bg-(--bg-color) text-[#0E0E0E] relative cursor-none">
        <HalftoneBackground gridSize={64} radius={0.12} bgColor="#1e1e1e" dotColor="#717174">
          <Navbar />
          <main>{children}</main>
        </HalftoneBackground>
      </body>
    </html>
  );
}
