import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
