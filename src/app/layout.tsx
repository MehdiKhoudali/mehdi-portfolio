import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFrame } from "@/components/site-frame";
import { SmoothScroll } from "@/components/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mehdikhoudali.com"),
  title: "Mehdi Khoudali - Software Engineer",
  description:
    "Mehdi Khoudali is a software engineer and founder in Casablanca, building products for creators, founders, and teams, and sharing what he learns.",
  applicationName: "Mehdi Khoudali",
  keywords: [
    "Mehdi Khoudali",
    "Mehdi K",
    "software engineer Morocco",
    "freelancer Casablanca",
    "startup founder",
  ],
  authors: [{ name: "Mehdi Khoudali" }],
  creator: "Mehdi Khoudali",
  openGraph: {
    title: "Mehdi Khoudali - Software Engineer",
    description:
      "Mehdi Khoudali is a software engineer and founder in Casablanca, building products for creators, founders, and teams, and sharing what he learns.",
    siteName: "Mehdi Khoudali",
    type: "website",
    images: [
      {
        url: "/mehdi-portrait.jpg",
        width: 1200,
        height: 1600,
        alt: "Portrait of Mehdi Khoudali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehdi Khoudali - Software Engineer",
    description:
      "Mehdi Khoudali is a software engineer and founder in Casablanca, building products for creators, founders, and teams, and sharing what he learns.",
    images: ["/mehdi-portrait.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SmoothScroll />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
