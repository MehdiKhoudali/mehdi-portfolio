import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { SiteContact, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SmoothScroll } from "@/components/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mehdikhoudali.com"),
  title: "Mehdi Khoudali - Software Engineer",
  description:
    "Mehdi Khoudali is a software engineer building apps for influencers from Casablanca, Morocco.",
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
      "Mehdi Khoudali is a software engineer building apps for influencers from Casablanca, Morocco.",
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
      "Mehdi Khoudali is a software engineer building apps for influencers from Casablanca, Morocco.",
    images: ["/mehdi-portrait.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SmoothScroll />
        <div className="portfolio-page min-h-screen bg-[#0a0a0a] text-[#f0eee8]">
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-12">
            <SiteHeader />
          </div>
          {children}
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-12">
            <SiteContact />
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
