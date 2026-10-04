import type { Metadata } from "next";
import Link from "next/link";
import Onboarding from "./onboarding";
import styles from "./ugc.module.css";

export const metadata: Metadata = {
  title: "1,700 UGC Videos | Mehdi Khoudali",
  description: "Get the free list of 1,700 UGC videos.",
  alternates: { canonical: "/ugc-library" },
  openGraph: {
    title: "1,700 UGC Videos",
    description: "Get the free list of 1,700 UGC videos.",
    url: "/ugc-library",
  },
  twitter: {
    title: "1,700 UGC Videos",
    description: "Get the free list of 1,700 UGC videos.",
  },
};

export default function UgcLibraryPage() {
  return (
    <main className={`portfolio-page ${styles.page}`}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>Mehdi Khoudali</Link>
          <nav aria-label="Primary navigation">
            <Link href="/#work">Work</Link>
            <Link href="/#about">About me</Link>
            <Link href="/#contact">Let&apos;s talk</Link>
          </nav>
        </header>
        <Onboarding />
        <footer className={styles.footer}>
          <p>Mehdi Khoudali / TypeScript full-stack developer</p>
          <div>
            <a href="https://x.com/mehdi_khoudali" target="_blank" rel="noreferrer">X</a>
            <a href="https://www.instagram.com/mehdi_khoudali/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
